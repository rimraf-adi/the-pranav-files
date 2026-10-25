#!/usr/bin/env python3
"""Render stills of the talking-head-recut card system BEFORE using it, so the agent can look.

usage: preview_cards.py [outdir=out/cards] [--styles a,b] [--palettes x,y] [--layout stack] [--frame clean] [--frame-sheet]
Renders every style x palette (CardPreview composition) -> <outdir>/<style>_<palette>.png and tiles them into
<outdir>/sheet_styles.png (rows = styles, cols = palettes). With --frame-sheet also renders every layout x frame for
style=minimal -> <outdir>/sheet_layouts.png (rows = layouts, cols = frames).
"""
import argparse, json, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor

STYLES = "academic editorial minimal spotlight geom whiteboard audit terminal swiss xhs".split()
PALETTES = "classic noir mint craft slate mono".split()
LAYOUTS = "split stack pip overlay".split()
FRAMES = "clean hairline polaroid".split()
FRAME_AT = 80  # frames: card + all entrances settled, before the exit

SAMPLE = {
    "academic": dict(kicker="TAKEAWAY", tag="00:18 → 00:46", title="Less is *more*", detail="Complex explanations are often *uncompressed thinking*.", quote="Compression is comprehension."),
    "editorial": dict(kicker="THE BIG IDEA", title="Real creation starts by *refusing* the template", detail="Treat every idea as a *first expression*."),
    "minimal": dict(kicker="TAKEAWAY", title="Rates *fall*", detail="When the repo rate drops, loan costs follow.", data=dict(to=6.5, from_=0, suffix="%", decimals=1, label="repo rate")),
    "spotlight": dict(kicker="TAKEAWAY", title="In the darkest room, *one light* is enough", detail="Every great decision is made while uncertain."),
    "geom": dict(kicker="TAKEAWAY", title="Big idea", detail="Stop the safe middle. Go *boldest* or do not go.", list=["Pick one thing", "Ship it loud"]),
    "whiteboard": dict(kicker="remember this", title="Save *first*, spend later", detail="Pay yourself before the month eats it.", list=["20% to savings", "auto-transfer on day 1"]),
    "audit": dict(kicker="FINDING", tag="A-07", title="The fee was *never* disclosed", detail="Clause 14 shifts the full cost onto the borrower after month six, without notice.", data=dict(value="Rs 4,200", label="hidden fee")),
    "terminal": dict(kicker="rule one", tag="v1.0", title="Ship small, ship often", detail="Big launches hide small bugs.", list=["commit daily", "deploy hourly"]),
    "swiss": dict(kicker="Principle", tag="№ 03", title="Form follows *function*", detail="Remove everything that does not carry meaning."),
    "xhs": dict(kicker="saved 2.4k", tag="@pranav.talks", title="3 habits that *quietly* fix your money", detail="Small, boring, automatic.", list=["autopay", "no-spend day", "round-up"]),
}


def props(style, palette, layout, frame, accent=0):
    c = dict(SAMPLE[style])
    d = c.get("data")
    if d:
        d = dict(d)
        if "from_" in d:
            d["from"] = d.pop("from_")
        c["data"] = d
    return dict(style=style, palette=palette, layout=layout, frame=frame, accentIndex=accent, content=c)


def still(p, out, scale):
    f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
    json.dump(p, f); f.close()
    r = subprocess.run(["npx", "remotion", "still", "CardPreview", out, f"--props={f.name}", f"--frame={FRAME_AT}", f"--scale={scale}"], capture_output=True, text=True)
    os.unlink(f.name)
    if r.returncode:
        sys.exit(f"{out} failed:\n{(r.stderr or r.stdout)[-1500:]}")


def sheet(files, cols, out):
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    for f in files:
        cmd += ["-i", f]
    rows = []
    n = len(files)
    parts = "".join(f"[{i}:v]" for i in range(n))
    cmd += ["-filter_complex", f"{parts}xstack=inputs={n}:layout=" + "|".join(f"{(i % cols)}0_0".replace(f"{i % cols}0_0", f"w0*{i % cols}_h0*{i // cols}") for i in range(n)), out]
    subprocess.run(cmd, check=True)


ap = argparse.ArgumentParser()
ap.add_argument("outdir", nargs="?", default="out/cards")
ap.add_argument("--styles", default=",".join(STYLES))
ap.add_argument("--palettes", default=",".join(PALETTES))
ap.add_argument("--layout", default="stack")
ap.add_argument("--frame", default="clean")
ap.add_argument("--frame-sheet", action="store_true")
ap.add_argument("--scale", default="0.2")
a = ap.parse_args()
os.makedirs(a.outdir, exist_ok=True)
styles, palettes = a.styles.split(","), a.palettes.split(",")

jobs = [(props(s, p, a.layout, a.frame), os.path.join(a.outdir, f"{s}_{p}.png")) for s in styles for p in palettes]
if a.frame_sheet:
    jobs += [(props("minimal", "noir", l, fr), os.path.join(a.outdir, f"layout_{l}_{fr}.png")) for l in LAYOUTS for fr in FRAMES]
with ThreadPoolExecutor(3) as ex:
    list(ex.map(lambda j: still(j[0], j[1], a.scale), jobs))
sheet([j[1] for j in jobs[: len(styles) * len(palettes)]], len(palettes), os.path.join(a.outdir, "sheet_styles.png"))
print(os.path.join(a.outdir, "sheet_styles.png"))
if a.frame_sheet:
    sheet([j[1] for j in jobs[len(styles) * len(palettes):]], len(FRAMES), os.path.join(a.outdir, "sheet_layouts.png"))
    print(os.path.join(a.outdir, "sheet_layouts.png"))
