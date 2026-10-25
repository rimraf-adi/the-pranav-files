#!/usr/bin/env python3
"""Render candidate b-roll BEFORE pasting it into the edit, so the agent can inspect them.

usage: preview_broll.py <candidates.json> <outdir>
candidates.json: {"broll": [ {id, kind, at, duration, ...}, ... ]}
For each item renders stills at 15%/50%/85% of its duration via the BrollPreview
composition, then tiles them into <outdir>/broll_sheet.png (one row per candidate).
Validation errors from the zod schema surface here, so bad props fail before paste.
"""
import json, os, subprocess, sys, tempfile

cands = json.load(open(sys.argv[1]))["broll"]; out = sys.argv[2]
os.makedirs(out, exist_ok=True)
rows = []
for c in cands:
    frames = []
    dur = round(c["duration"] * 30)
    for i, frac in enumerate((0.15, 0.5, 0.85)):
        png = os.path.join(out, f"{c['id']}_{i}.png")
        props = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
        json.dump({"item": c}, props); props.close()
        r = subprocess.run(["npx", "remotion", "still", "BrollPreview", png, f"--props={props.name}",
                            f"--frame={int(dur * frac)}", "--scale=0.25"], capture_output=True, text=True)
        if r.returncode:
            sys.exit(f"{c['id']} failed:\n{(r.stderr or r.stdout)[-1200:]}")
        frames.append(png)
    row = os.path.join(out, f"{c['id']}_row.png")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *sum([["-i", f] for f in frames], []),
                    "-filter_complex", "hstack=inputs=3", row], check=True)
    rows.append(row)
sheet = os.path.join(out, "broll_sheet.png")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *sum([["-i", r] for r in rows], []),
                "-filter_complex", f"hstack=inputs={len(rows)}" if len(rows) > 1 else "copy", sheet], check=True)
print(sheet)
