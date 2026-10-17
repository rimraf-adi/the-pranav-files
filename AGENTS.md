# Motion editor harness

Agent-agnostic instructions (Claude Code, Antigravity, Cursor, Codex, etc.).
This Remotion repo acts as a video editor. You edit **data**; Remotion renders it.

## Rules
- Normal edits touch ONLY `public/projects/<name>/` (`timeline.json`, `transcript.json`). Do not rewrite `src/` during an edit.
- Need a new effect? Stop, say so, and handle it as a separate task: new component in `src/components/`, schema field in `src/schema/timeline.ts`, then `npm run lint`.
- `timeline.json` must validate against `src/schema/timeline.ts`.
- Captions are Roman-script Hinglish. Keep English words in English. Never put Devanagari in captions.
- Style lives in `styles/<style>.json` and `skills/style-*`. Don't hardcode style values in components.
- Secrets live in `.env` (gitignored). Never print or commit them.

## Skills
Playbooks are in `skills/<name>/SKILL.md`. Read the relevant one before acting:
- `skills/edit-workflow`: ordered pipeline, raw footage to rendered reel
- `skills/style-gadzhi`: the visual style playbook
- `skills/think-loop`: inspect video+audio, design b-roll, preview it, then paste and verify

## Workflow
1. `python3 scripts/transcribe.py <video> public/projects/<name>/transcript.json` (Groq Whisper, needs `GROQ_API_KEY`)
2. `python3 scripts/build_timeline.py public/projects/<name> projects/<name>/raw/<file>`
3. Edit `timeline.json`: set `emphasis`, tune `punchIns`.
4. Preview: `npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5`
5. Inspect: `scripts/contact_sheet.sh out/preview.mp4 out/sheet.png`, then view the PNG.
6. Fix and repeat. Final render at scale 1.

## Scripts
- `scripts/transcribe.py`: Groq Whisper, 10s chunks (longer windows silently drop speech)
- `scripts/romanize.py`: Devanagari -> Roman Hinglish, word count and timings unchanged
- `scripts/build_timeline.py`: audio-silence cuts + word remap -> `timeline.json` (`--keep` preserves broll)
- `scripts/analyze_media.py`: loudness, silences, scene changes, contact sheet
- `scripts/preview_broll.py`: render candidate b-roll stills before pasting
- `scripts/contact_sheet.sh`: tile frames of a render for inspection

## Commands
- Studio: `npm run dev`
- Typecheck/lint: `npm run lint`
