#!/usr/bin/env python3
"""Build skills/motion-templates/INDEX.md from raw/templates.json (written by extract_templates.py).

usage: python3 scripts/templates/build_template_index.py [skills/motion-templates]
"""
import json
import sys
from pathlib import Path

RECIPE = {
    "Range Selector": "per-character stagger (Text animator): reveal each letter with `random(seed)` order or left-to-right offset",
    "CC Light Sweep": "light sweep: moving linear-gradient highlight clipped to the text (`background-clip:text`)",
    "Glo2": "glow: stacked `text-shadow` / `filter: drop-shadow` in the accent colour",
    "Drop Shadow": "drop shadow: `text-shadow` with the listed distance/softness/opacity",
    "Box Blur2": "blur in/out: animate `filter: blur()` toward 0",
    "Gaussian Blur 2": "blur in/out: animate `filter: blur()` toward 0",
    "Geometry2": "transform: scale/position/rotation keyframes",
    "Linear Wipe": "wipe: animate `clip-path: inset()`",
    "Strobe": "flicker: quantised opacity steps",
    "CC Scatterize": "scatter: per-letter random offsets and fade",
    "Ramp": "gradient fill",
}


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "skills/motion-templates")
    recs = json.loads((out / "raw" / "templates.json").read_text())
    rows = ["| template | file | comp | fonts | colours | animated props | recipe hints |", "|---|---|---|---|---|---|---|"]
    for r in sorted(recs, key=lambda x: (x["pack"], x["slug"])):
        main = max(r["comps"], key=lambda c: len(c["layers"])) if r["comps"] else None
        comp = f"{main['w']}x{main['h']} {main['sec']}s @{main['fps']}" if main else "-"
        cols = sorted({c["value"] for c in r["controls"] if isinstance(c.get("value"), str) and c["value"].startswith("#")})
        keyed = expr = 0
        for c in r["comps"]:
            for l in c["layers"]:
                for p in l["props"]:
                    keyed += "keys" in p
                    expr += "expression" in p
        names = " ".join(e for e in r["effects"]) + " " + " ".join(p["path"] for c in r["comps"] for l in c["layers"] for p in l["props"])
        hints = [v.split(":")[0] for k, v in RECIPE.items() if k in names]
        rows.append(f"| {r['name']} | [{r['slug']}.md](templates/{r['slug']}.md) | {comp} | {', '.join(r['fonts']) or '-'} | {' '.join(cols) or '-'} | {keyed} keyed, {expr} expr | {'; '.join(dict.fromkeys(hints)) or '-'} |")
    (out / "INDEX.md").write_text("# Template index\n\n" + "\n".join(rows) + "\n")
    print("INDEX.md:", len(recs), "templates")


if __name__ == "__main__":
    main()
