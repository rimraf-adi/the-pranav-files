#!/usr/bin/env python3
"""Render several edit styles of one project and tile them side by side in one video.

usage: python3 scripts/edit_styles/compare_styles.py <project_dir> [--styles formal,bold,editorial,clean] [--scale 0.5] [--out FILE]
Applies each style (apply_style.py), renders each variant (half scale by default), then tiles them: 2x2 for four styles,
a single row otherwise. Each tile is labelled with its style name; audio comes from the first style.
Output default: public/renders/<name>_styles.mp4
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FONTS = ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/System/Library/Fonts/Helvetica.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT, **kw)
    if r.returncode:
        sys.exit(f"failed: {' '.join(map(str, cmd))}\n{(r.stderr or r.stdout)[-1200:]}")
    return r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--styles", default="formal,bold,editorial,clean")
    ap.add_argument("--scale", type=float, default=0.5)
    ap.add_argument("--out")
    a = ap.parse_args()
    proj = Path(a.project)
    name = proj.name
    styles = a.styles.split(",")
    out = Path(a.out) if a.out else ROOT / "public" / "renders" / f"{name}_styles.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = ROOT / "out" / "styles" / name
    tmp.mkdir(parents=True, exist_ok=True)
    clips = []
    for s in styles:
        v = proj / "variants" / f"{s}.json"
        print(run([sys.executable, "scripts/edit_styles/apply_style.py", str(proj), s]).stdout.strip())
        clip = tmp / f"{s}.mp4"
        print(f"rendering {s} ...", flush=True)
        run(["npx", "remotion", "render", "Reel", str(clip), f"--props={v}", f"--scale={a.scale}"])
        clips.append(clip)
    font = next((f for f in FONTS if os.path.exists(f)), None)
    labelled = []
    for s, c in zip(styles, clips):
        lab = tmp / f"{s}_l.mp4"
        vf = "null" if not font else f"drawtext=fontfile='{font}':text='{s}':fontcolor=white:fontsize=h/38:box=1:boxcolor=black@0.55:boxborderw=8:x=(w-text_w)/2:y=h-h/14"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(c), "-vf", vf, "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-an", str(lab)])
        labelled.append(lab)
    n = len(labelled)
    inputs = sum([["-i", str(l)] for l in labelled], [])
    if n == 4:
        fc = "[0][1]hstack[a];[2][3]hstack[b];[a][b]vstack[v]"
    else:
        fc = "".join(f"[{i}]" for i in range(n)) + f"hstack=inputs={n}[v]"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-i", str(clips[0]), "-filter_complex", fc, "-map", "[v]", "-map", f"{n}:a?", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(out)])
    print("side by side ->", out)


if __name__ == "__main__":
    main()
