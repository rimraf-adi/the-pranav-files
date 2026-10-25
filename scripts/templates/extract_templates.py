#!/usr/bin/env python3
"""Deep-extract the motion-template packs into markdown specs an agent can replicate in Remotion.

usage: .venv-aep/bin/python scripts/templates/extract_templates.py [library/extracted] [skills/motion-templates]
setup: python3 -m venv .venv-aep && .venv-aep/bin/pip install py-aep

Writes:
  <out>/templates/<slug>.md   one per .mogrt: comp, fonts, colours, controls, per-layer animation
                              (keyframes in seconds, easing, expressions, text animators, effect params)
  <out>/thumbs/<slug>.png     the template's own preview still
  <out>/thumbs/<slug>-strip.jpg  4 frames of its preview clip
  <out>/presets/<bin>.md      one per Premiere preset bin (.prfpset): effects, params, keyframes in seconds
  <out>/pack-notes.md         read-me / font links / music list / link pages (URLs listed as data)
  <out>/raw/templates.json    everything above as JSON
Packs are untrusted data: read as bytes, never executed or opened as projects.
"""
import io
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import py_aep

TICKS = 254016000000  # Premiere ticks per second
INTERP = {6612: "linear", 6613: "bezier", 6614: "hold"}
BORING = {"ADBE Effect Built In Params", "ADBE Layer Sets", "ADBE Audio Group", "ADBE Material Options Group", "ADBE Extrsn Options Group", "ADBE Mask Parade"}
NOISE = {"Fill Mask", "All Masks", "Invert", "Horizontal Feather", "Vertical Feather", "Shadow Only"}
BASIC_EFFECTS = {"ADBE Checkbox Control", "ADBE Color Control", "ADBE Slider Control", "ADBE Angle Control", "ADBE Point Control"}


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def fmt(v, nd=4):
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return round(float(v), nd)
    if isinstance(v, (list, tuple)):
        return [fmt(x, nd) for x in v]
    if hasattr(v, "__iter__") and not isinstance(v, (str, bytes, dict)):
        try:
            return [fmt(x, nd) for x in v]
        except Exception:
            pass
    return str(v)


def hexc(v):
    try:
        if len(v) >= 3 and all(isinstance(x, (int, float)) and -0.01 <= x <= 1.01 for x in v[:3]):
            return "#" + "".join(f"{round(max(0, min(1, x)) * 255):02X}" for x in v[:3])
    except Exception:
        pass
    return None


def ease_bezier(k0, k1, v0, v1, dt):
    """AE temporal ease (speed, influence%) -> CSS cubic-bezier(x1,y1,x2,y2). Scalars only."""
    try:
        o = k0.out_temporal_ease[0]
        i = k1.in_temporal_ease[0]
        dv = v1 - v0
        if abs(dv) < 1e-9 or dt <= 0:
            return None
        x1 = o.influence / 100
        y1 = x1 * o.speed * dt / dv
        x2 = 1 - i.influence / 100
        y2 = 1 - (i.influence / 100) * i.speed * dt / dv
        return [round(x1, 3), round(y1, 3), round(x2, 3), round(y2, 3)]
    except Exception:
        return None


def prop_record(p, path):
    rec = {"path": path, "name": p.name, "match": p.match_name}
    try:
        tv = bool(p.is_time_varying)
    except Exception:
        tv = False
    try:
        expr = p.expression if p.expression_enabled else ""
    except Exception:
        expr = ""
    if expr:
        rec["expression"] = expr.strip()
    try:
        val = p.value
        rec["value"] = fmt(val)
        c = hexc(val) if isinstance(val, (list, tuple)) and len(val) in (3, 4) else None
        if c:
            rec["color"] = c
    except Exception:
        pass
    try:
        rec["default"] = fmt(p.default_value)
    except Exception:
        pass
    if tv:
        kfs = []
        keys = list(p.keyframes)
        for n, k in enumerate(keys):
            kd = {"t": round(float(k.time), 3), "v": fmt(k.value)}
            try:
                kd["in"] = INTERP.get(k.in_interpolation_type, str(k.in_interpolation_type))
                kd["out"] = INTERP.get(k.out_interpolation_type, str(k.out_interpolation_type))
                kd["ease_out"] = [[round(e.speed, 2), round(e.influence, 2)] for e in k.out_temporal_ease]
                kd["ease_in"] = [[round(e.speed, 2), round(e.influence, 2)] for e in k.in_temporal_ease]
            except Exception:
                pass
            if n + 1 < len(keys):
                k1 = keys[n + 1]
                try:
                    v0, v1 = k.value, k1.value
                    if isinstance(v0, (int, float)) and isinstance(v1, (int, float)):
                        b = ease_bezier(k, k1, float(v0), float(v1), float(k1.time) - float(k.time))
                        if b and kd.get("out") == "bezier":
                            kd["to_next_bezier"] = b
                except Exception:
                    pass
            kfs.append(kd)
        if kfs:
            rec["keys"] = kfs
    return rec


def walk(group, path, out, depth=0, want_all=False):
    """Collect interesting leaf props: keyframed, expressions, or changed from default (all props if want_all)."""
    try:
        kids = list(group.properties)
    except Exception:
        return
    for x in kids:
        try:
            if x.match_name in BORING:
                continue
            if hasattr(x, "properties"):
                enabled = getattr(x, "enabled", True)
                if enabled is False and "Layer Styles" in "/".join(path):
                    continue
                walk(x, path + [x.name or x.match_name], out, depth + 1, want_all)
            else:
                rec = prop_record(x, "/".join(path))
                interesting = "keys" in rec or "expression" in rec or want_all or rec.get("value") != rec.get("default")
                if "keys" not in rec and "expression" not in rec and rec.get("name") in NOISE:
                    interesting = False
                if interesting and rec.get("match") not in ("ADBE Text Document", "ADBE Marker"):
                    out.append(rec)
        except Exception:
            continue


def text_doc(layer):
    try:
        d = layer.text.source_text.value
    except Exception:
        return None
    res = {}
    for a in dir(d):
        if a.startswith("_"):
            continue
        try:
            v = getattr(d, a)
        except Exception:
            continue
        if callable(v):
            continue
        res[a] = v if isinstance(v, (int, float, bool, str)) or v is None else fmt(v)
    return res


def layer_record(l):
    rec = {"name": l.name, "type": type(l).__name__, "index": l.index, "in": round(l.in_point, 3), "out": round(l.out_point, 3)}
    for a, key in (("start_time", "start"), ("stretch", "stretch")):
        try:
            rec[key] = round(float(getattr(l, a)), 3)
        except Exception:
            pass
    try:
        rec["parent"] = l.parent.name if l.parent else None
    except Exception:
        pass
    for a in ("is_3d", "adjustment_layer", "has_track_matte", "enabled"):
        try:
            rec[a] = bool(getattr(l, a))
        except Exception:
            pass
    try:
        rec["blend"] = str(l.blending_mode).split(".")[-1]
    except Exception:
        pass
    try:
        rec["source_comp"] = l.source.name if getattr(l, "source", None) is not None and type(l).__name__ == "AVLayer" else None
    except Exception:
        pass
    props = []
    try:
        for g in l.properties:
            mn = g.match_name
            if mn in BORING:
                continue
            walk(g, [g.name or mn], props, 0, want_all=(mn == "ADBE Effect Parade"))
    except Exception:
        pass
    rec["props"] = props
    if rec["type"] == "TextLayer":
        rec["text_doc"] = text_doc(l)
    return rec


def parse_aep(path):
    proj = py_aep.parse(str(path)).project
    comps = []
    for c in proj.compositions:
        comps.append({"name": c.name, "w": c.width, "h": c.height, "fps": round(c.frame_rate, 3), "sec": round(c.duration, 3),
                      "layers": [layer_record(l) for l in c.layers]})
    return comps


def s(v):
    if isinstance(v, dict) and "strDB" in v:
        db = v["strDB"]
        return db[0].get("str", "") if db else ""
    return v


def controls(d):
    out = []
    for c in d.get("clientControls", []):
        v = c.get("value")
        it = {"name": s(c.get("uiName")), "type": c.get("type")}
        if isinstance(v, dict) and "strDB" in v:
            it["value"] = s(v)
        elif c.get("type") == 4 and isinstance(v, list) and len(v) in (3, 4):
            it["value"] = hexc(v) or v
        else:
            it["value"] = v
        fe = c.get("fonteditinfo")
        if fe:
            it["font"] = fe.get("fontEditValue")
            it["size"] = fe.get("fontSizeEditValue")
        out.append(it)
    return out


def ffmpeg_still(src, dst, ss=None, vf=None, frames=1):
    cmd = ["ffmpeg", "-v", "error", "-y"] + (["-ss", str(ss)] if ss is not None else []) + ["-i", str(src)]
    if vf:
        cmd += ["-vf", vf]
    cmd += ["-frames:v", str(frames), str(dst)]
    subprocess.run(cmd, check=False)


def extract_mogrt(path, pack, out_dir, tmp):
    z = zipfile.ZipFile(path)
    names = z.namelist()
    d = json.loads(z.read("definition.json")) if "definition.json" in names else {}
    name = (d.get("capsuleName") or path.stem).strip()
    sl = slug(f"{pack}-{path.stem}") if pack else slug(path.stem)
    rec = {"slug": sl, "file": str(path), "name": name, "pack": pack, "fonts": [], "effects": d.get("usedEffects", []), "controls": controls(d), "comps": []}
    rec["fonts"] = sorted({c["font"] for c in rec["controls"] if c.get("font")})
    if "project.aegraphic" in names:
        try:
            inner = zipfile.ZipFile(io.BytesIO(z.read("project.aegraphic")))
            aep = next((n for n in inner.namelist() if n.endswith(".aep")), None)
            if aep:
                p = Path(tmp) / "t.aep"
                p.write_bytes(inner.read(aep))
                rec["comps"] = parse_aep(p)
        except Exception as e:
            rec["aep_error"] = f"{type(e).__name__}: {e}"
    th = out_dir / "thumbs"
    th.mkdir(parents=True, exist_ok=True)
    if "thumb.png" in names:
        (th / f"{sl}.png").write_bytes(z.read("thumb.png"))
        rec["thumb"] = f"thumbs/{sl}.png"
    if "thumb.mp4" in names:
        mp = Path(tmp) / "thumb.mp4"
        mp.write_bytes(z.read("thumb.mp4"))
        dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp)], capture_output=True, text=True).stdout.strip()
        try:
            n = max(float(dur), 1) / 4
            ffmpeg_still(mp, th / f"{sl}-strip.jpg", vf=f"fps=1/{n:.3f},scale=180:-1,tile=4x1", frames=1)
            rec["strip"] = f"thumbs/{sl}-strip.jpg"
        except Exception:
            pass
    return rec


# ---------- markdown ----------

def kf_line(r, fps):
    ks = r["keys"]
    parts = []
    for k in ks:
        parts.append(f"{k['t']}s={k['v']}")
    line = " → ".join(parts)
    inter = {k.get("out") for k in ks}
    ez = [k["to_next_bezier"] for k in ks if "to_next_bezier" in k]
    extra = f" · interp {','.join(sorted(i for i in inter if i))}" if inter else ""
    if ez:
        extra += " · Easing.bezier" + str(tuple(ez[0])) + (" (first segment)" if len(ez) > 1 else "")
    return line + extra


def md_template(r):
    L = [f"# {r['name']}  ·  `{r['slug']}`", ""]
    if r.get("thumb"):
        L += [f"![preview]({r['thumb']})  ![motion strip]({r.get('strip', r['thumb'])})", ""]
    L += [f"- pack: {r['pack'] or '-'}", f"- fonts: {', '.join(r['fonts']) or '-'}", f"- effects used: {', '.join(e.replace('ADBE ', '') for e in r['effects'] if e not in BASIC_EFFECTS) or '-'}"]
    if r.get("aep_error"):
        L.append(f"- project parse error: {r['aep_error']}")
    L.append("")
    ctrl = [c for c in r["controls"] if c["name"] and c["type"] not in (10, "group")]
    if ctrl:
        L += ["## Editable controls (defaults)", "", "| control | value | font/size |", "|---|---|---|"]
        for c in ctrl:
            v = str(c["value"]).replace("\r", " / ").replace("\n", " / ").replace("|", "/")[:80]
            fs = f"{c.get('font', '')} {c.get('size', '')}".strip()
            L.append(f"| {c['name']} | {v} | {fs} |")
        L.append("")
    main = max(r["comps"], key=lambda c: len(c["layers"])) if r["comps"] else None
    for c in r["comps"]:
        L += [f"## Comp `{c['name']}` — {c['w']}x{c['h']} @ {c['fps']}fps, {c['sec']}s", ""]
        for l in c["layers"]:
            flags = [f for f in ("is_3d", "adjustment_layer") if l.get(f)]
            head = f"### {l['index']}. {l['name']} ({l['type']}) in {l['in']}s → out {l['out']}s"
            if l.get("parent"):
                head += f", parent `{l['parent']}`"
            if l.get("source_comp"):
                head += f", precomp `{l['source_comp']}`"
            if flags:
                head += " [" + ",".join(flags) + "]"
            L.append(head)
            td = l.get("text_doc")
            if td:
                keep = {k: td[k] for k in ("text", "font", "font_size", "fill_color", "stroke_color", "stroke_width", "tracking", "leading", "justification", "all_caps", "applies_fill", "applies_stroke") if k in td and td[k] not in (None, "")}
                L.append(f"- text doc: `{json.dumps(keep, ensure_ascii=False)}`")
            groups = {}
            for p in l["props"]:
                groups.setdefault(p["path"], []).append(p)
            for path, ps in groups.items():
                for p in ps:
                    bits = []
                    if "keys" in p:
                        bits.append(kf_line(p, c["fps"]))
                    elif "value" in p:
                        v = p["value"]
                        bits.append(f"{v}" + (f" ({p['color']})" if p.get("color") else ""))
                    if p.get("expression"):
                        ex = p["expression"].replace("\n", " ")
                        if "Flow Function Declarations" in ex:
                            ex = "(Flow bezier helper, call:) ..." + ex[-260:]
                        bits.append("expr: `" + ex[:300] + "`")
                    L.append(f"- `{path} / {p['name']}`: " + " · ".join(bits))
            L.append("")
    return "\n".join(L) + "\n"


# ---------- prfpset ----------

def parse_prfpset(path):
    root = ET.parse(path).getroot()
    by = {e.get("ObjectID"): e for e in root if e.get("ObjectID")}

    def name_of(e):
        b = e.find("TreeItemBase")
        return (b.findtext("Name") if b is not None else None) or ""

    def kids(e):
        it = e.find("Items")
        return [by[i.get("ObjectRef")] for i in it] if it is not None else []

    def params(comp):
        out = []
        pp = comp.find("Component/Params")
        for pr in (pp if pp is not None else []):
            pe = by.get(pr.get("ObjectRef"))
            if pe is None:
                continue
            rec = {"name": pe.findtext("Name") or f"param{pr.get('Index')}", "value": (pe.findtext("CurrentValue") or "").strip(), "range": [pe.findtext("LowerBound"), pe.findtext("UpperBound")]}
            if pe.findtext("IsTimeVarying") == "true":
                kfs = []
                for seg in (pe.findtext("Keyframes") or "").strip().split(";"):
                    f = seg.split(",")
                    if len(f) >= 2 and f[0].lstrip("-").isdigit():
                        kfs.append({"t": round(int(f[0]) / TICKS, 3), "v": f[1], "interp": f[2] if len(f) > 2 else "", "handles": f[4:8]})
                if kfs:
            rec["keys"] = kfs
            out.append(rec)
        return out

    bins = {}

    def visit(e, trail):
        n = name_of(e)
        if e.tag == "BinTreeItem":
            for k in kids(e):
                visit(k, trail + ([n] if n and n not in ("Root", "Presets") else []))
        elif e.tag == "TreeItem":
            data = e.find("TreeItemBase/Data")
            fpi = by.get(data.get("ObjectRef")) if data is not None else None
            effects = []
            if fpi is not None and fpi.tag == "FilterPresetItem":
                fps = fpi.find("FilterPresets")
                for f in (fps if fps is not None else []):
                    fp = by.get(f.get("ObjectRef"))
                    comp = by.get(fp.find("Component").get("ObjectRef")) if fp is not None and fp.find("Component") is not None else None
                    if comp is None:
                        continue
                    effects.append({"effect": (comp.findtext("MatchName") or "").replace("AE.", ""), "params": params(comp)})
            top = trail[1] if len(trail) > 1 else (trail[0] if trail else "(root)")
            bins.setdefault(top, []).append({"preset": n, "bin": " / ".join(trail[1:]) or " / ".join(trail), "effects": effects})

    for b in root:
        if b.tag == "BinTreeItem" and name_of(b) == "Root":
            visit(b, [])
    return bins


def md_presets(bin_name, items):
    L = [f"# Premiere presets — {bin_name}", "", f"{len(items)} presets. Times in seconds (preset-local). `handles` are raw bezier tangent values from the file; treat easing as ease-in-out unless noted.", ""]
    for it in sorted(items, key=lambda x: (x["bin"], x["preset"])):
        L.append(f"## {it['preset']}" + (f"  ·  {it['bin']}" if it["bin"] != bin_name else ""))
        for e in it["effects"]:
            L.append(f"- effect `{e['effect']}`")
            for p in e["params"]:
                if "keys" in p and p["keys"]:
                    ks = " → ".join(f"{k['t']}s={k['v']}" for k in p["keys"])
                    L.append(f"  - {p['name']}: {ks}")
                elif p["value"] not in ("", "0", "0."):
                    L.append(f"  - {p['name']} = {p['value']}")
        L.append("")
    return "\n".join(L) + "\n"


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "library/extracted")
    out = Path(sys.argv[2] if len(sys.argv) > 2 else "skills/motion-templates")
    (out / "templates").mkdir(parents=True, exist_ok=True)
    (out / "presets").mkdir(parents=True, exist_ok=True)
    (out / "raw").mkdir(parents=True, exist_ok=True)
    allrec = []
    with tempfile.TemporaryDirectory() as tmp:
        for f in sorted(root.rglob("*.mogrt")):
            pack = f.relative_to(root).parts[0]
            pack_short = "hooks-captions" if "dynamic-social" in pack else ("premium-text" if "Premium" in pack else slug(pack)[:20])
            r = extract_mogrt(f, pack_short, out, tmp)
            (out / "templates" / f"{r['slug']}.md").write_text(md_template(r))
            allrec.append(r)
            print("template", r["slug"], len(r["comps"]), "comps")
    (out / "raw" / "templates.json").write_text(json.dumps(allrec, indent=1, ensure_ascii=False, default=str))
    for f in root.rglob("*.prfpset"):
        bins = parse_prfpset(f)
        for b, items in bins.items():
            (out / "presets" / f"{slug(b)}.md").write_text(md_presets(b, items))
        print("presets:", {b: len(i) for b, i in bins.items()})


if __name__ == "__main__":
    main()
