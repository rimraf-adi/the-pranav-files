#!/usr/bin/env python3
"""Deep-parse every pack in library/extracted/ into one JSON report.

usage: .venv-aep/bin/python scripts/templates/parse_assets.py [library/extracted] [out/assets_parsed.json]
setup: python3 -m venv .venv-aep && .venv-aep/bin/pip install py-aep aep-parser

.mogrt   -> definition.json (name, fonts, effects, editable controls with defaults) + the nested
            project.aegraphic .aep read with py-aep (comps, layers, text, effects, keyframes)
.prfpset -> XML: preset names, effect match names, parameter counts
.mp4     -> ffprobe
Everything is read as data. Nothing inside the packs is executed.
"""
import io
import json
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import py_aep

CONTROL_TYPES = {0: "unknown", 1: "slider", 2: "checkbox", 3: "point", 4: "color", 5: "position", 6: "text", 7: "angle", 8: "dropdown", 9: "group"}


def s(v):
    """Localized string blob -> plain str."""
    if isinstance(v, dict) and "strDB" in v:
        db = v["strDB"]
        return db[0].get("str", "") if db else ""
    return v


def hexcolor(rgba):
    try:
        return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02X}" for c in rgba[:3])
    except Exception:
        return None


def parse_definition(d):
    controls = []
    for c in d.get("clientControls", []):
        v = c.get("value")
        item = {"name": s(c.get("uiName")), "type": CONTROL_TYPES.get(c.get("type"), c.get("type")), "animatable": c.get("canAnimate")}
        if item["type"] == "color" and isinstance(v, list):
            item["value"] = hexcolor(v)
        elif isinstance(v, dict) and "strDB" in v:
            item["value"] = s(v)
        else:
            item["value"] = v
        fe = c.get("fonteditinfo")
        if fe:
            item["font"] = fe.get("fontEditValue")
            item["size"] = fe.get("fontSizeEditValue")
        controls.append(item)
    return {
        "name": d.get("capsuleName"),
        "authorApp": d.get("authorApp"),
        "fonts": [s(f) if not isinstance(f, str) else f for f in d.get("usedFontsLocalized", [])],
        "effects": d.get("usedEffects", []),
        "file_types": d.get("usedFileTypes", []),
        "controls": controls,
    }


def prop_info(p):
    """Keyframe count + easing hint for an animatable property."""
    try:
        n = p.num_keys
    except Exception:
        return None
    return n


def parse_aep(path):
    proj = py_aep.parse(str(path)).project
    out = {"fonts": [], "comps": []}
    try:
        out["fonts"] = sorted({str(getattr(f, "name", f)) for f in proj.used_fonts})
    except Exception:
        pass
    for comp in proj.compositions:
        c = {"name": comp.name, "w": comp.width, "h": comp.height, "fps": round(comp.frame_rate, 2), "sec": round(comp.duration, 2), "layers": []}
        for l in comp.layers:
            li = {"name": l.name, "kind": type(l).__name__, "in": round(l.in_point, 2), "out": round(l.out_point, 2)}
            try:
                li["effects"] = [e.name for e in l.effects]
            except Exception:
                pass
            try:
                txt = l.text.source_text.value
                li["text"] = {"text": getattr(txt, "text", None), "font": getattr(txt, "font", None), "size": getattr(txt, "font_size", None),
                              "fill": hexcolor(getattr(txt, "fill_color", None) or [])}
            except Exception:
                pass
            try:
                tf = l.transform
                kf = {}
                for nm in ("position", "scale", "rotation", "opacity", "anchor_point"):
                    n = prop_info(getattr(tf, nm))
                    if n:
                        kf[nm] = n
                if kf:
                    li["keyframes"] = kf
            except Exception:
                pass
            c["layers"].append(li)
        out["comps"].append(c)
    return out


def parse_mogrt(data, tmp):
    z = zipfile.ZipFile(io.BytesIO(data))
    rep = {"files": z.namelist()}
    if "definition.json" in z.namelist():
        rep["definition"] = parse_definition(json.loads(z.read("definition.json")))
    if "project.aegraphic" in z.namelist():
        try:
            inner = zipfile.ZipFile(io.BytesIO(z.read("project.aegraphic")))
            aep = next((n for n in inner.namelist() if n.endswith(".aep")), None)
            if aep:
                p = Path(tmp) / "t.aep"
                p.write_bytes(inner.read(aep))
                rep["aep"] = parse_aep(p)
        except Exception as e:
            rep["aep_error"] = f"{type(e).__name__}: {e}"
    return rep


def parse_prfpset(path):
    root = ET.parse(path).getroot()
    tags = {}
    for el in root.iter():
        tags[el.tag] = tags.get(el.tag, 0) + 1
    names = sorted({(el.text or "").strip() for el in root.iter() if el.tag in ("Name", "MatchName", "ProjectItemName", "EffectName") and (el.text or "").strip()})
    return {"root": root.tag, "version": root.get("Version"), "elements": len(tags), "top_tags": dict(sorted(tags.items(), key=lambda x: -x[1])[:12]), "names": names[:80]}


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration", "-of", "json", str(path)], capture_output=True, text=True)
    try:
        j = json.loads(r.stdout)
        st = j["streams"][0]
        return {"w": st["width"], "h": st["height"], "fps": st["r_frame_rate"], "sec": round(float(j["format"]["duration"]), 1)}
    except Exception:
        return {}


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "library/extracted")
    out = Path(sys.argv[2] if len(sys.argv) > 2 else "out/assets_parsed.json")
    report = {}
    with tempfile.TemporaryDirectory() as tmp:
        for f in sorted(root.rglob("*")):
            if not f.is_file() or f.name == "manifest.json":
                continue
            rel = str(f.relative_to(root))
            e = f.suffix.lower()
            try:
                if e == ".mogrt":
                    report[rel] = parse_mogrt(f.read_bytes(), tmp)
                elif e == ".prfpset":
                    report[rel] = parse_prfpset(f)
                elif e == ".mp4":
                    report[rel] = probe(f)
                elif e in (".txt", ".htm"):
                    report[rel] = {"text_head": f.read_text(errors="replace")[:400]}
            except Exception as ex:
                report[rel] = {"error": f"{type(ex).__name__}: {ex}"}
            print("parsed", rel[-70:])
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=1, ensure_ascii=False))
    print("->", out)


if __name__ == "__main__":
    main()
