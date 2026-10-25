#!/usr/bin/env python3
"""Apply an edit style to a project: moments.json + style preset -> timeline variant.

usage: python3 scripts/edit_styles/apply_style.py <project_dir> <style> [--out FILE] [--set-active]
  <project_dir>   public/projects/<name> (needs timeline.json for cuts/words/source and moments.json)
  <style>         a preset in edit-styles/<style>.json (formal, bold, editorial, clean, ...)
  --out FILE      default public/projects/<name>/variants/<style>.json
  --set-active    also write the result to timeline.json (the base timeline is backed up to variants/_base.json once)

The style decides captions theme, which template each moment kind uses, colours, header treatment (photo, icon, fade) and sound.
The base timeline is never changed unless --set-active. Slot limits (edit-styles/template-slots.json) are checked and warned about.
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load(p):
    return json.loads(Path(p).read_text())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("style")
    ap.add_argument("--out")
    ap.add_argument("--set-active", action="store_true")
    a = ap.parse_args()

    proj = Path(a.project)
    name = proj.name
    base = load(proj / "timeline.json")
    spec = load(proj / "moments.json")
    style = load(ROOT / "edit-styles" / f"{a.style}.json")
    slots = load(ROOT / "edit-styles" / "template-slots.json")
    sfx_dir = f"projects/{name}/assets/sfx/"

    tl = dict(base)
    tl["captionTheme"] = style["captionTheme"]
    tl["style"] = base.get("style", "default")

    keep = {w.lower().rstrip(".,") for w in spec.get("emphasis", [])}
    limit = max(1, int(len(base["words"]) * style.get("emphasis_max_ratio", 0.12)))
    n = 0
    for w in tl["words"]:
        hit = w["text"].lower().rstrip(".,") in keep and n < limit
        w["emphasis"] = bool(hit)
        n += hit

    broll, sfx = [], []
    moments = sorted(spec["moments"], key=lambda m: m["at"])
    used = 0
    for m in moments:
        k = style["kinds"].get(m["kind"], {})
        if not k or k.get("skip") or used >= style.get("max_moments", 99):
            continue
        used += 1
        slot = slots[k["template"]]
        lines = (m.get("lines_by_style", {}).get(a.style, m["lines"]) + [""] * 4)[:4]
        texts = [""] * 4
        for i, idx in enumerate(slot["order"]):
            texts[idx] = lines[i]
            if len(lines[i]) > slot["limits"][i]:
                print(f"warn: {m['id']} line {i} '{lines[i]}' is {len(lines[i])} chars, template {k['template']} fits {slot['limits'][i]}", file=sys.stderr)
        h = k.get("header", {})
        cover = m.get("cover_top_px", 0)
        item = {
            "id": m["id"], "kind": "template", "at": m["at"], "duration": m["duration"], "tone": "neutral",
            "template": k["template"], "texts": texts, "colors": k["colors"],
            "x": 0, "y": slot["y"], "scale": k.get("scale", 0.85), "speed": 1,
            "scrim": 1.0 if cover else h.get("scrim", 0.85), "scrimHeight": h.get("scrimHeight", 800),
            "solidHeight": max(cover, h.get("solid", 400)), "fadeIn": 0 if cover else h.get("fadeIn", 0.27),
            "bgFocus": m.get("bgFocus", "50% 50%"), "bgBrightness": h.get("bgBrightness", 0.66),
        }
        if cover:
            item["scrimHeight"] = max(item["scrimHeight"], cover + 305)
        if h.get("bg") and m.get("bg"):
            item["bg"] = m["bg"]
        if h.get("icon") and m.get("icon"):
            item["icon"] = m["icon"]
        broll.append(item)
        s = style.get("sfx", {})
        if s.get("enter"):
            sfx.append({"at": max(0.0, round(m["at"] - 0.05, 2)), "src": f"{sfx_dir}{s['enter']}.mp3", "volume": s["volume"]})
        if s.get("tick"):
            sfx.append({"at": round(m["at"] + 0.4, 2), "src": f"{sfx_dir}tick.mp3", "volume": 0.4})
    tl["broll"], tl["sfx"] = broll, sfx

    out = Path(a.out) if a.out else proj / "variants" / f"{a.style}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f"{a.style}: {len(broll)} graphics, {len(sfx)} sfx, captions={style['captionTheme']['name']} -> {out}")
    if a.set_active:
        bk = proj / "variants" / "_base.json"
        if not bk.exists():
            bk.write_text(json.dumps(base, ensure_ascii=False, indent=1))
        (proj / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
        print("timeline.json updated (base kept in variants/_base.json)")


if __name__ == "__main__":
    main()
