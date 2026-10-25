#!/usr/bin/env python3
"""Give the agent eyes and ears. Writes <outdir>/analysis.json + frames + contact sheet.

usage: analyze_media.py <video> <outdir> [--every 2]
Audio: duration, mean/max volume, silences, per-second loudness (RMS dB).
Video: scene-change timestamps, a frame every N seconds, contact sheet PNG
       (frames labelled by index; index * N = seconds).
Read analysis.json, then LOOK at contact_sheet.png before planning b-roll.
"""
import argparse, json, os, re, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("outdir"); ap.add_argument("--every", type=float, default=2)
a = ap.parse_args()
os.makedirs(os.path.join(a.outdir, "frames"), exist_ok=True)

def ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True).stderr

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "default=nw=1:nk=1", a.video], capture_output=True, text=True).stdout)

vol = ff("-i", a.video, "-af", "volumedetect", "-f", "null", "-")
mean = re.search(r"mean_volume: (-?[\d.]+)", vol); mx = re.search(r"max_volume: (-?[\d.]+)", vol)

sil = ff("-i", a.video, "-af", "silencedetect=n=-35dB:d=0.4", "-f", "null", "-")
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", sil)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", sil)]
silences = [{"from": s, "to": e} for s, e in zip(starts, ends)]

# per-second loudness
rms = ff("-i", a.video, "-af", "asetnsamples=16000,astats=metadata=1:reset=1,"
         "ametadata=print:key=lavfi.astats.Overall.RMS_level", "-f", "null", "-")
loud = [round(float(x), 1) for x in re.findall(r"RMS_level=(-?[\d.]+|-inf)", rms) if x != "-inf"]

scn = ff("-i", a.video, "-vf", "select='gt(scene,0.3)',showinfo", "-an", "-f", "null", "-")
scenes = [round(float(x), 2) for x in re.findall(r"pts_time:([\d.]+)", scn)]

ff("-y", "-i", a.video, "-vf", f"fps=1/{a.every},scale=270:-1", os.path.join(a.outdir, "frames", "f%03d.png"))
sheet = os.path.join(a.outdir, "contact_sheet.png")
ff("-y", "-i", a.video, "-vf",
   f"fps=1/{a.every},scale=216:-1,drawtext=text='%{{eif\\:n*{a.every}\\:d}}s':x=6:y=6:fontsize=22:"
   f"fontcolor=white:box=1:boxcolor=black@0.6,tile=8x3", "-frames:v", "1", sheet)

json.dump({"duration": round(dur, 2),
           "mean_volume_db": float(mean.group(1)) if mean else None,
           "max_volume_db": float(mx.group(1)) if mx else None,
           "silences": silences, "scene_changes": scenes,
           "loudness_rms_db_per_0.5s": loud[:400],
           "frame_every_s": a.every, "contact_sheet": sheet},
          open(os.path.join(a.outdir, "analysis.json"), "w"), indent=1)
print(f"duration {dur:.1f}s, {len(silences)} silences, {len(scenes)} scene changes -> {sheet}")
