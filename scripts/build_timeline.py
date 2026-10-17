#!/usr/bin/env python3
"""transcript.json -> timeline.json (silence cut + word remap + punch-in seeds).

usage: build_timeline.py <project_dir> <source_rel_to_public> [--gap 0.35] [--pad 0.08]
Reads <project_dir>/transcript.json, writes <project_dir>/timeline.json.
The agent then edits timeline.json (emphasis flags, punchIns). Deterministic: no LLM here.
"""
import json, sys, argparse, os

ap = argparse.ArgumentParser()
ap.add_argument("project"); ap.add_argument("source")
ap.add_argument("--gap", type=float, default=0.35, help="silence longer than this is cut")
ap.add_argument("--pad", type=float, default=0.08)
a = ap.parse_args()

words = json.load(open(os.path.join(a.project, "transcript.json")))["words"]

# group words into segments separated by gaps > --gap
segs, cur = [], [words[0]]
for w in words[1:]:
    if w["start"] - cur[-1]["end"] > a.gap:
        segs.append(cur); cur = [w]
    else:
        cur.append(w)
segs.append(cur)

segments, out_words, t = [], [], 0.0
for g in segs:
    f = max(0.0, g[0]["start"] - a.pad); to = g[-1]["end"] + a.pad
    segments.append({"from": round(f, 3), "to": round(to, 3)})
    for w in g:
        out_words.append({"text": w["text"],
                          "start": round(t + (w["start"] - f), 3),
                          "end": round(t + (w["end"] - f), 3),
                          "emphasis": False})
    t += to - f

# seed punch-ins roughly every 5s on segment starts
punch, last = [], -99
for seg_i, g in enumerate(segs):
    at =out_words[sum(len(x) for x in segs[:seg_i])]["start"]
    if at - last >= 5:
        punch.append({"at": round(at, 2), "duration": 1.2, "scale": 1.12}); last = at

json.dump({"fps": 30, "width": 1080, "height": 1920, "source": a.source,
           "segments": segments, "words": out_words, "punchIns": punch, "style": "gadzhi"},
          open(os.path.join(a.project, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"{len(segments)} segments, {t:.1f}s output, {len(punch)} punch-ins")
