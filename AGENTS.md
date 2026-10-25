# Motion editor harness

Agent-agnostic instructions (Claude Code, Antigravity, Cursor, Codex, etc.).
This Remotion repo acts as a video editor. You edit **data**; Remotion renders it.

## Rules
- Normal edits touch ONLY `public/projects/<name>/` (`timeline.json`, `transcript.json`). Do not rewrite `src/` during an edit.
- Need a new effect? Stop, say so, and handle it as a separate task: new component in `src/components/`, schema field in `src/schema/timeline.ts`, then `npm run lint`.
- `timeline.json` must validate against `src/schema/timeline.ts`.
- Captions are Roman-script Hinglish. Keep English words in English. Never put Devanagari in captions.
- Edit styles live in `edit-styles/<style>.json` + `skills/style-*`; renderer tokens in `styles/default.json`. Don't hardcode style values in components. Graphics paraphrase the captions, use relevant licensed photos, and are inspected (contact sheet + close-ups) before anything is sent.
- Secrets live in `.env` (gitignored). Never print or commit them.

## Skills
Start with `skills/motion-editor/SKILL.md` (root router). Make skills discoverable by Claude Code / Codex / Antigravity with `python scripts/tools/link_skills.py`.
Playbooks are in `skills/<name>/SKILL.md`. Read the relevant one before acting:
- `skills/edit-workflow`: ordered pipeline, raw footage to rendered reel
- `skills/think-loop`: inspect video+audio, design b-roll, preview it, then paste and verify
- `skills/edit-styles` (+ `style-formal|bold|editorial|clean`): apply a reusable edit style to a project, compare styles side by side
- `skills/motion-templates`: catalog of 43 replicated animated text templates and the recipe for new ones
- Repo map: `docs/ARCHITECTURE.md`

## Workflow
1. `python3 scripts/pipeline/transcribe.py <video> public/projects/<name>/transcript.json` (Groq Whisper, needs `GROQ_API_KEY`)
2. `python3 scripts/pipeline/build_timeline.py public/projects/<name> projects/<name>/raw/<file>`
3. Edit `timeline.json`: set `emphasis`.
4. Preview: `npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5`
5. Inspect: `scripts/pipeline/contact_sheet.sh out/preview.mp4 out/sheet.png`, then view the PNG.
6. Fix and repeat. Final render at scale 1.

## Scripts
- `scripts/pipeline/transcribe.py`: Groq Whisper, 10s chunks (longer windows silently drop speech)
- `scripts/pipeline/romanize.py`: Devanagari -> Roman Hinglish, word count and timings unchanged
- `scripts/pipeline/build_timeline.py`: audio-silence cuts + word remap -> `timeline.json` (`--keep` preserves broll)
- `scripts/pipeline/analyze_media.py`: loudness, silences, scene changes, contact sheet
- `scripts/pipeline/preview_broll.py`: render candidate b-roll stills before pasting
- `scripts/pipeline/contact_sheet.sh`: tile frames of a render for inspection

## Commands
- Studio: `npm run dev`
- Typecheck/lint: `npm run lint`
