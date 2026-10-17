#!/usr/bin/env python3
"""Render a caption theme on a project's transcript and tile frames around the hero word.

usage: preview_theme.py <theme> <project> [--hero-word crypto] [--pre 1.5] [--post 2.5] [--cols 6] [--full]
Writes out/themes/<theme>/{timeline.json,clip.mp4,sheet.png}. One bundle/render (fast); LOOK at sheet.png.
Titles/b-roll/cuts are stripped so the theme is judged on its own (grade stays on, dust off).
--full renders the whole video instead of the hero window.
If public/projects/<project>/subject.webm exists it is used so Behind-layers go behind the speaker.
"""
import argparse, json, os, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("theme"); ap.add_argument("project")
ap.add_argument("--hero-word", default="crypto")
ap.add_argument("--pre", type=float, default=1.5); ap.add_argument("--post", type=float, default=2.5)
ap.add_argument("--cols", type=int, default=6); ap.add_argument("--full", action="store_true")
a = ap.parse_args()

src = f"public/projects/{a.project}/timeline.json"
tl = json.load(open(src))
words = tl["words"]
idx = next((i for i in range(len(words) - 1, -1, -1) if words[i]["text"].strip(".,?!").lower() == a.hero_word.lower()), None)
if idx is None:
    sys.exit(f"hero word '{a.hero_word}' not in transcript")
tl.update(titles=[], broll=[], cuts=[], dust=False, captionTheme={"name": a.theme, "hero": idx})
if os.path.exists(f"public/projects/{a.project}/subject.webm"):
    tl["subject"] = f"projects/{a.project}/subject.webm"   # alpha cutout => text can sit BEHIND the speaker
out = f"out/themes/{a.theme}"; os.makedirs(out, exist_ok=True)
json.dump(tl, open(f"{out}/timeline.json", "w"), ensure_ascii=False, indent=1)

fps = tl.get("fps", 30)
total = sum(s["to"] - s["from"] for s in tl["segments"])
h = words[idx]["start"]
lo, hi = (0.0, total) if a.full else (max(0.0, h - a.pre), min(total, h + a.post))
f0, f1 = int(lo * fps), max(int(lo * fps) + 1, int(hi * fps) - 1)
cmd = ["npx", "remotion", "render", "Reel", f"{out}/clip.mp4", f"--props={out}/timeline.json",
       "--scale=0.5", f"--frames={f0}-{f1}"]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode:
    sys.exit((r.stderr or r.stdout)[-2500:])
n = a.cols * 3
span = (f1 - f0 + 1) / fps
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{out}/clip.mp4", "-vf",
                f"fps={n / span:.4f},scale=240:-1,tile={a.cols}x3", "-frames:v", "1", f"{out}/sheet.png"], check=True)
print(f"hero '{words[idx]['text']}' @ {h:.2f}s; window {lo:.1f}-{hi:.1f}s -> {out}/sheet.png")
