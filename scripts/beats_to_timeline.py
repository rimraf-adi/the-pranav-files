#!/usr/bin/env python3
"""Turn the beat sheet (public/projects/<name>/beats.md) into timeline.json `broll` + `cards`.

usage: python scripts/beats_to_timeline.py public/projects/<name> [--dry-run] [--validate]

beats.md holds a markdown table. Columns (header names are matched case-insensitively):
  t (s) | Spoken | Visual | Kind | Spec
- `t (s)`  start-end on the OUTPUT timeline, e.g. `5.7-7.9`
- `Kind`   `broll <kind>` (stat|keyword|image|montage|product|chart|map|lowerThird) or `card <style>[/<layout>]` (layout default split);
           rows whose kind is title/face/other are ignored (titles are managed by hand)
- `Spec`   space-separated key=value, values quoted when they contain spaces. Lists use `;`, shots use `src:word`.
    stat:     label="Fed interest rate" from=3.75 to=4 suffix=% decimals=2 tone=attention
    keyword:  text="2013" sub="first hike since"
    image:    src=projects/x/assets/photos/a.jpg label="Oil"
    montage:  shots="a.jpg:book;b.jpg:pet;c.jpg:visits"   (word optional; `a.jpg@58% 50%` sets the 9:16 crop focus; 1 shot = full-bleed cutaway)
    chart:    title="Inflation vs target" chartType=bar items="Inflation:3.7;Target:2" unit=% highlight=0
    map:      title="Iran tension" regions="Iran" pins="Iran:53:32" focus="20,5,80,45"   (country names from public/shared/world-110m.geojson)
    lowerThird: title="Name" sub="Role"
    trend:    plan="THE PLAN" planSub="rates down" real="WHAT HAPPENED" realSub="rates up" flipAt=1.75   (times relative to the row start)
    ticker:   label="FED RATE" from=3.75 to=4 decimals=2 suffix=% stepAt=1.0 chip="+0.25" line=step|none bg=<photo>
    votes:    yes=12 no=0 label="BOARD VOTE" verdict="UNANIMOUS" resultAt=1.5
    gauge:    label="INFLATION" value=3.7 target=2 max=5 unit=% valueAt=1.0 targetAt=3.0
    flow:     json='{"nodes":[{"id":"a","label":"IRAN","at":0.1,"row":0},{"id":"b","label":"OIL","value":"$100","from":"a","at":2.0}]}'
    any kind: json='{...}' merges raw fields (use for nested data; no | characters inside)
    product:  variant=phone src=... words="website;experts;area" from=#5c1a2e to=#1c0610
    card:     kicker="RATE DECISION" title="*First* hike" detail=... list="a;b;c" value=3.7% label="vs 2%" accent=2 frame=clean
              media="a.jpg:fed;b.jpg:oil"   (style `media`: b-roll on top, speaker below; word after : is optional)
              hideCaptions=false   (keep captions running over the card)
Rewrites ONLY timeline.json `broll` and `cards`. --validate renders frame 0 through Remotion so the zod schema checks the result.
"""
import json
import re
import shlex
import subprocess
import sys
from pathlib import Path


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def parse_table(md):
    rows, header = [], None
    for line in md.splitlines():
        if not line.strip().startswith("|"):
            header = None if rows else header
            continue
        c = cells(line)
        if all(re.fullmatch(r":?-{2,}:?", x) for x in c):
            continue
        if header is None:
            header = [h.lower() for h in c]
            continue
        rows.append(dict(zip(header, c)))
    return rows


def num(v):
    try:
        f = float(v)
        return int(f) if f.is_integer() and "." not in v else f
    except ValueError:
        return v


def spec(cell):
    out = {}
    for tok in shlex.split(cell.replace("’", "'")) if cell else []:
        if "=" in tok:
            k, v = tok.split("=", 1)
            out[k] = v
    return out


def shots(v):
    res = []
    for part in v.split(";"):
        src, _, word = part.partition(":")
        src, _, focus = src.partition("@")
        if src.strip():
            shot = {"src": src.strip(), "word": word.strip()}
            if focus.strip():
                shot["focus"] = focus.strip()
            res.append(shot)
    return res


NUMERIC = {"from", "to", "decimals", "stepAt", "flipAt", "yes", "no", "resultAt", "value", "target", "max", "valueAt", "targetAt"}


def build(rows):
    broll, cards = [], []
    for r in rows:
        kind = r.get("kind", "").split()
        if kind:
            kind[0] = kind[0].lower()
        t = r.get("t (s)") or r.get("t") or ""
        m = re.match(r"\s*([\d.]+)\s*-\s*([\d.]+)", t)
        if not kind or not m:
            continue
        at, end = float(m.group(1)), float(m.group(2))
        dur = round(end - at, 2)
        s = spec(r.get("spec", ""))
        if kind[0] == "broll" and len(kind) > 1:
            k = kind[1]
            item = {"id": s.pop("id", f"{k}{len(broll) + 1}"), "kind": k, "at": at, "duration": dur}
            for key in ("tone", "leak"):
                if key in s:
                    item[key] = s.pop(key) == "true" if key == "leak" else s.pop(key)
            if k == "montage":
                item["shots"] = shots(s.pop("shots", ""))
            if k == "product" and "words" in s:
                item["words"] = [w for w in s.pop("words").split(";") if w]
            if k == "chart" and "items" in s:
                item["items"] = [{"label": a.partition(":")[0], "value": num(a.partition(":")[2])} for a in s.pop("items").split(";") if a]
                if "highlight" in s:
                    item["highlight"] = int(s.pop("highlight"))
            if k == "map":
                item["regions"] = [r for r in s.pop("regions", "").split(";") if r]
                item["pins"] = [{"label": a[0], "lon": float(a[1]), "lat": float(a[2])} for a in (x.split(":") for x in s.pop("pins", "").split(";") if x)]
                if "focus" in s:
                    item["focus"] = [float(x) for x in s.pop("focus").split(",")]
            if "json" in s:
                item.update(json.loads(s.pop("json")))
            for key, v in s.items():
                item[key] = num(v) if key in NUMERIC else v
            broll.append(item)
        elif kind[0] == "card":
            style, _, layout = (kind[1] if len(kind) > 1 else "minimal").partition("/")
            content = {}
            for key in ("kicker", "title", "detail", "quote", "tag"):
                if key in s:
                    content[key] = s[key]
            if "list" in s:
                content["list"] = [x for x in s["list"].split(";") if x]
            if "value" in s or "label" in s:
                content["data"] = {"value": s.get("value", ""), "label": s.get("label", "")}
            if "media" in s:
                content["media"] = shots(s["media"])
            card = {"id": s.get("id", f"card{len(cards) + 1}"), "at": at, "duration": dur, "style": style,
                    "layout": layout or "split", "frame": s.get("frame", "clean"), "content": content}
            if "accent" in s:
                card["accentIndex"] = int(s["accent"])
            if "hideCaptions" in s:
                card["hideCaptions"] = s["hideCaptions"] == "true"
            cards.append(card)
    return broll, cards


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    proj = Path(args[0])
    broll, cards = build(parse_table((proj / "beats.md").read_text()))
    print(f"{len(broll)} broll, {len(cards)} cards")
    if "--dry-run" in sys.argv:
        print(json.dumps({"broll": broll, "cards": cards}, indent=1, ensure_ascii=False))
        return
    tl_path = proj / "timeline.json"
    tl = json.loads(tl_path.read_text())
    tl["broll"], tl["cards"] = broll, cards
    tl_path.write_text(json.dumps(tl, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {tl_path}")
    if "--validate" in sys.argv:
        r = subprocess.run(["npx", "remotion", "still", "Reel", "/tmp/_beats_validate.png", f"--props={tl_path}", "--frame=0", "--scale=0.1"],
                           capture_output=True, text=True)
        if r.returncode:
            sys.exit(f"validation FAILED:\n{(r.stderr or r.stdout)[-1500:]}")
        print("validated")


if __name__ == "__main__":
    main()
