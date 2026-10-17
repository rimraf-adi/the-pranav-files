#!/usr/bin/env python3
"""Per-frame person matte (white = speaker) using Robust Video Matting.

Usage: <venv python> scripts/matte.py <video> <out_matte.mp4>
         [--ratio 0.75] [--ema 0.5] [--feather 1.5] [--device auto|cpu|cuda|mps]

Frames stream through ffmpeg pipes (no whole-video RAM). Output matches the
source resolution, fps and frame count (video-only; audio is handled by bgblur.py).
Setup: python scripts/treat_bg.py --setup  (creates .venv-matte, fetches RVM code + weights).
Works on macOS, Linux and Windows (device auto: cuda > mps > cpu).
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
import torch

ROOT = Path(__file__).resolve().parent.parent
RVM_DIR = ROOT / ".venv-matte" / "rvm"


def probe(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", str(path)])
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"], s["r_frame_rate"]


def load_model(device):
    sys.path.insert(0, str(RVM_DIR.parent))
    from rvm.model import MattingNetwork  # official RVM code, vendored by setup
    m = MattingNetwork("mobilenetv3").train(False)
    m.load_state_dict(torch.load(RVM_DIR / "rvm_mobilenetv3.pth", map_location="cpu"))
    return m.to(device)


def clean(a, thr=0.3):
    """Fill interior holes and drop small detached specks (keeps main body + parts >0.3% of it, e.g. a detached hand)."""
    b = (a > thr).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(b, connectivity=8)
    if n > 1:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        keep_ids = [i for i in range(1, n)
                    if i == big or stats[i, cv2.CC_STAT_AREA]        >= 0.003 * stats[big, cv2.CC_STAT_AREA]]
        keep = np.isin(lab, keep_ids)
    else:
        keep = b.astype(bool)
    # holes = background not connected to the border
    h, w = keep.shape
    inv = (~keep).astype(np.uint8)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flood = inv.copy()
    for y, x in [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]:
        if flood[y, x] == 1:
            cv2.floodFill(flood, mask, (x, y), 2)
    holes = flood == 1
    out = np.where(keep | holes, a, 0.0).astype(np.float32)
    out[holes] = np.maximum(out[holes], 1.0)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("out")
    ap.add_argument("--ratio", type=float, default=0.75, help="RVM downsample_ratio (higher = sharper edges, slower)")
    ap.add_argument("--ema", type=float, default=0.5, help="weight of previous alpha for temporal smoothing (0 = off)")
    ap.add_argument("--feather", type=float, default=1.5, help="edge feather gaussian sigma in px")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--limit", type=int, default=0, help="debug: only first N frames")
    a = ap.parse_args()

    dev = a.device
    if dev == "auto":
        dev = ("cuda" if torch.cuda.is_available()
               else "mps" if torch.backends.mps.is_available() else "cpu")
    w, h, fps = probe(a.video)
    model = load_model(dev)

    rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.video, "-f", "rawvideo",
                           "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    wr = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{w}x{h}",
        "-r", fps, "-i", "-", "-vf", "scale=out_range=full,format=yuvj420p",
        "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-color_range", "pc",
        "-movflags", "+faststart", a.out], stdin=subprocess.PIPE)

    rec = [None] * 4
    prev = None
    fsz = w * h * 3
    n = 0
    with torch.no_grad():
        while True:
            buf = rd.stdout.read(fsz)
            if len(buf) < fsz:
                break
            rgb = np.frombuffer(buf, np.uint8).reshape(h, w, 3)
            src = torch.from_numpy(rgb.copy()).to(dev).permute(2, 0, 1).float().div(255)[None]
            _, pha, *rec = model(src, *rec, a.ratio)
            al = clean(pha[0, 0].float().cpu().numpy())
            if prev is not None and a.ema > 0:
                al = a.ema * prev + (1 - a.ema) * al
            prev = al
            out = cv2.GaussianBlur(al, (0, 0), a.feather) if a.feather > 0 else al
            wr.stdin.write((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
            n += 1
            if n % 100 == 0:
                print(f"matte: {n} frames", file=sys.stderr, flush=True)
            if a.limit and n >= a.limit:
                break
    rd.kill()
    wr.stdin.close()
    wr.wait()
    print(f"matte: done, {n} frames -> {a.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
