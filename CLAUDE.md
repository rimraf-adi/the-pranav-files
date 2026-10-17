# Motion editor harness

Remotion repo that acts as a video editor. You edit **data**, Remotion renders it.

## Rules
- Normal edits touch ONLY `public/projects/<name>/` (`timeline.json`, `transcript.json`). Never rewrite `src/` during an edit.
- Need a new effect? Stop, say so, and follow the `add-component` flow as a separate task.
- `timeline.json` must validate against `src/schema/timeline.ts`. Run `npx tsc --noEmit` after any `src/` change.
- Captions are Roman-script Hinglish. Keep English words in English. Never output Devanagari in captions.
- Style lives in `styles/<style>.json` and the matching `style-*` skill. Don't hardcode style values in components.

## Workflow (see skill `edit-workflow`)
1. `python3 scripts/transcribe.py <video> public/projects/<name>/transcript.json`
2. `python3 scripts/build_timeline.py public/projects/<name> projects/<name>/raw/<file>`
3. Edit `timeline.json`: set `emphasis`, tune `punchIns`.
4. Preview: `npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5`
5. Inspect: `scripts/contact_sheet.sh out/preview.mp4 out/sheet.png` then Read the PNG.
6. Fix and repeat. Final render at scale 1.

## Commands
- Studio: `npm run dev`
- Typecheck: `npm run lint`
