#!/usr/bin/env python3
"""transcript.json -> timeline.json (audio-based silence cut + word remap + punch-in seeds).

usage: build_timeline.py <project_dir> <source_rel_to_public> [--gap 0.35] [--pad 0.08]
Cuts come from REAL audio silence (ffmpeg silencedetect), not word gaps, because
ASR word timestamps can be wrong and would cut speech. Deterministic: no LLM here.
Preserves any existing broll/emphasis in timeline.json only if --keep is passed.
"""
import argparse, json, os, re, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("project"); ap.add_argument("source")
ap.add_argument("--gap", type=float, default=0.35, help="silences longer than this are cut")
ap.add_argument("--pad", type=float, default=0.08, help="breathing room kept at each side of a cut")
ap.add_argument("--keep", action="store_true", help="keep existing broll from timeline.json")
a = ap.parse_args()

words = json.load(open(os.path.join(a.project, "transcript.json")))["words"]
video = os.path.join("public", a.source)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "default=nw=1:nk=1", video], capture_output=True, text=True).stdout)
log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", video, "-af",
                      f"silencedetect=n=-35dB:d={a.gap}", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", log)]
en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
en += [dur] * (len(st) - len(en))  # trailing silence runs to the end

cuts = [(s + a.pad, e - a.pad) for s, e in zip(st, en) if e - s > 2 * a.pad + 0.05]
keep, cur = [], 0.0
for cs, ce in cuts:
    if cs > cur:
        keep.append((cur, cs))
    cur = ce
if cur < dur:
    keep.append((cur, dur))

# ASR sometimes stretches a word across silence/dropped speech (clamped to ~2s upstream).
# Snap such a word to sit just before the next word so captions don't linger early.
for w, nxt in zip(words, words[1:]):
    if w["end"] - w["start"] >= 1.5 and nxt["start"] - w["end"] > 0.1:
        w["start"] = max(w["start"], nxt["start"] - 0.35)
        w["end"] = nxt["start"] - 0.02

def to_out(t):
    """source time -> output time; a time inside a cut snaps to the cut point"""
    o = 0.0
    for f, e in keep:
        if t < f:
            return o
        if t <= e:
            return o + (t - f)
        o += e - f
    return o

out_words = []
for w in words:
    s, e = to_out(w["start"]), to_out(w["end"])
    out_words.append({"text": w["text"], "start": round(s, 3), "end": round(max(e, s + 0.05), 3),
                      "emphasis": False})

# seed punch-ins ~every 5s at the start of each kept segment
punch, last, o = [], -99, 0.0
for f, e in keep:
    if o - last >= 5:
        punch.append({"at": round(o, 2), "duration": 1.2, "scale": 1.12}); last = o
    o += e - f

prev = {}
tp = os.path.join(a.project, "timeline.json")
if a.keep and os.path.exists(tp):
    prev = json.load(open(tp))
json.dump({"fps": 30, "width": 1080, "height": 1920, "source": a.source,
           "segments": [{"from": round(f, 3), "to": round(e, 3)} for f, e in keep],
           "words": out_words, "punchIns": prev.get("punchIns", punch),
           "broll": prev.get("broll", []), "style": "gadzhi"},
          open(tp, "w"), ensure_ascii=False, indent=1)
print(f"{len(keep)} segments, {o:.1f}s output (source {dur:.1f}s), {len(cuts)} cuts")
