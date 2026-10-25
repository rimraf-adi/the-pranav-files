#!/usr/bin/env python3
"""Render a replicated template and tile frames next to the original's own preview strip.

usage: python3 scripts/templates/preview_template.py <slug> [--frames 8]
Writes out/templates/<slug>/{clip.mp4,sheet.png}. LOOK at sheet.png: top row = the Premiere template's own preview
(skills/motion-templates/thumbs/<slug>-strip.jpg), below = our render at even intervals.
"""
import argparse, json, os, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("slug"); ap.add_argument("--frames", type=int, default=8)
a = ap.parse_args()
out = f"out/templates/{a.slug}"; os.makedirs(out, exist_ok=True)
props = json.dumps({"template": a.slug, "speed": 1})
r = subprocess.run(["npx", "remotion", "render", "TemplatePreview", f"{out}/clip.mp4", f"--props={props}", "--scale=0.5"], capture_output=True, text=True)
if r.returncode:
    sys.exit(r.stderr[-1500:] or r.stdout[-1500:])
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{out}/clip.mp4"], capture_output=True, text=True).stdout)
step = dur / a.frames
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{out}/clip.mp4", "-vf", f"fps=1/{step:.3f},scale=270:-1,tile={a.frames}x1", "-frames:v", "1", f"{out}/ours.png"], check=True)
strip = f"skills/motion-templates/thumbs/{a.slug}-strip.jpg"
if os.path.exists(strip):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", strip, "-i", f"{out}/ours.png", "-filter_complex",
                    "[0]scale=1080:-1[a];[1]scale=1080:-1[b];[a][b]vstack", f"{out}/sheet.png"], check=True)
else:
    os.replace(f"{out}/ours.png", f"{out}/sheet.png")
print(f"{out}/sheet.png  ({dur:.1f}s)")
