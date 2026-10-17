#!/usr/bin/env python3
"""Cinematic background treatment: blur + darken everything behind the speaker.

Usage: python scripts/bgblur.py <video> <matte.mp4> <out.mp4>
         [--blur 20] [--dim 0.35] [--vignette 0.35] [--shrink 2] [--crf 14]

The speaker (matte white) is untouched; the background is gaussian-blurred, multiplied by
--dim and vignetted. Audio is stream-copied; resolution/fps/duration match the source.
Pure ffmpeg, no Python deps.
"""
import argparse
import subprocess
import sys

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("matte")
ap.add_argument("out")
ap.add_argument("--blur", type=float, default=20, help="background gaussian sigma (px)")
ap.add_argument("--dim", type=float, default=0.35, help="background brightness multiplier (1 = unchanged)")
ap.add_argument("--vignette", type=float, default=0.35, help="0 = none, ~0.35 soft, 1 = heavy (background only)")
ap.add_argument("--shrink", type=int, default=2, help="erode matte by N px to kill light halo at hair/edges")
ap.add_argument("--crf", type=int, default=14)
a = ap.parse_args()

bg = f"gblur=sigma={a.blur}:steps=2,lutrgb=r=val*{a.dim}:g=val*{a.dim}:b=val*{a.dim}"
if a.vignette > 0:
    # ffmpeg's vignette angle: smaller = stronger. Map 0..1 -> PI/2.2 .. PI/6
    bg += f",vignette=angle=PI/{2.2 + (1 - a.vignette) * 3.8:.2f}:mode=backward:eval=init"
mask = ",".join(["erosion"] * a.shrink + ["gblur=sigma=1"]) if a.shrink else "gblur=sigma=0.5"
graph = (
    f"[0:v]split=2[o1][o2];"
    f"[o1]{bg},format=gbrp[bg];"
    f"[o2]format=gbrp[fg];"
    f"[1:v]format=gray,{mask}[m];"
    f"[bg][fg][m]maskedmerge,format=yuv420p[v]"
)
cmd = ["ffmpeg", "-v", "error", "-y", "-i", a.video, "-i", a.matte,
       "-filter_complex", graph, "-map", "[v]", "-map", "0:a?",
       "-c:v", "libx264", "-crf", str(a.crf), "-preset", "medium", "-pix_fmt", "yuv420p",
       "-c:a", "copy","-movflags", "+faststart", a.out]
sys.exit(subprocess.call(cmd))
