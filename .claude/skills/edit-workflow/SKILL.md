---
name: edit-workflow
description: Use when asked to edit, cut, caption or render a video in this repo. Gives the ordered pipeline from raw footage to rendered reel and the checks before each render.
---

# Edit workflow

Order matters; don't skip the verify step.

1. **Ingest**: confirm the source exists in `public/projects/<name>/raw/`. Run `scripts/transcribe.py`. If the output reports words still in Devanagari, romanize them in `transcript.json` keeping word count and timestamps identical.
2. **Cut**: run `scripts/build_timeline.py`. It removes silences and remaps word times. Never hand-edit segment times unless a cut lands mid-word.
3. **Style pass** (load `style-gadzhi`): mark `emphasis: true` on the 1-2 key words per caption page (numbers, money, strong verbs). Adjust `punchIns`.
4. **Preview** at `--scale=0.5`, then build a contact sheet and Read it.
5. **Check**: captions inside frame and not covering the face; no cut mid-word; punch-ins not closer than 3s; emphasis not on more than ~30% of words.
6. **Final render** only after the check passes. Report output path and duration.

If anything needs a new component or schema field, stop and ask.
