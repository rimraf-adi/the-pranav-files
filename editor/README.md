# Motion Editor GUI

A Next.js app for making small manual fixes to a project's `public/projects/<name>/timeline.json`
without editing the JSON by hand. The preview is the real `Reel` composition from `../src`, played
with `@remotion/player` straight from the in-memory timeline, so every edit shows up immediately.

```bash
cd editor
npm install
npm run dev          # http://localhost:3210  ->  /edit/demo
```

## What it edits
- **A-roll** track (read-only on the timeline): one block per `segments[]` entry, with jump cuts marked on the ruler. You can change `from`/`to` (SOURCE seconds) in the inspector, but later items are not re-timed for you.
- **Captions** (`words[]`): double-click a word (on the timeline or in the Transcript tab) to fix its text; Tab/Shift-Tab moves to the next/previous word. Split (`S`, at the playhead), merge (`M`), emphasis (`E`), hero word (`captionTheme.hero` follows the word when words are inserted or removed).
- **B-roll** (`broll[]`): every kind in the schema. The property form is generated from the zod schema: ranges, enums, defaults (`reset`), optional fields (`set`/`unset`) and descriptions all come from `src/schema/timeline.ts`. Asset picker for `src`/`bg`/`shots[].src`/`icon`, crop-focus picker for montage shots, and kind conversion.
- **Cards**, **Titles**, **Cuts** (scale/originY/leak), **SFX** (its own track; blocks are drawn at the audio's real length, the left bar shows volume).
- **Project**: style, grade, dust, pushInPercent, headroomPercent, cardPalette, caption theme and hero.
- Add (`+` on each track, inserted at the playhead), duplicate (`⌘D`), delete (`Del`), undo/redo (`⌘Z` / `⇧⌘Z`).

## Timeline
Drag a block to move it, drag its edges to trim. Moves and trims snap to caption-word boundaries and
the playhead (hold **Alt** to turn snapping off), otherwise to whole frames. Duration limits come from
the schema (b-roll 0.8-12s, cards 1.5-60s, titles 0.8-3.5s). Click the ruler or an empty lane to
scrub; `Ctrl`/`⌘` + wheel zooms.

Keys: `Space` play/pause · `←/→` nudge the selection one frame (`Shift` = 10; with nothing selected, or
with `Alt`, they step the playhead) · `Home`/`End` · `Esc` deselect · `Enter` edit the selected word ·
`⌘S` save.

## Saving and other writers
- Saves go through `PUT /api/projects/<name>/timeline`, which validates with the same zod schema and
  refuses to write an invalid file (plus editor checks: no Devanagari in captions, unique ids, no empty
  asset paths). Missing asset files are warnings only.
- The file is written as the python scripts write it (2-space indent, UTF-8, trailing newline), keeping
  key order. Integers that python wrote as `1.0` come back as `1`.
- `timeline.json` is watched. If it changes on disk (another agent session, `beats_to_timeline.py`, …)
  and you have no unsaved edits, the editor reloads it. If you do have unsaved edits you get a banner
  (load the disk version, or overwrite it on purpose); a plain save never overwrites a newer file.
- Autosave (top bar) is off by default.

## Render preview
"Render preview" runs, from the repo root,
`npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5`
and streams its progress. It renders the **saved** file (you're asked to save first). One render at a
time; "Stop render" stops only the process group the editor started.

## How it's wired
- `../src` is compiled by Next (`experimental.externalDir`) through the `@reel/*` path alias. Every bare
  import, including the ones in `../src`, resolves from `editor/node_modules` first (webpack
  `resolve.modules`), so the Player and the Reel share one copy of `remotion`. That is also why dev runs
  with `--webpack`. Keep the `remotion`/`@remotion/*` versions here equal to the root `package.json`.
- `staticFile()` paths (`/projects/...`, `/shared/...`) are served from the repo's `public/` by
  `app/api/static/[...path]`, with HTTP range support for the video decoders.
- Nothing from `.env` is read or sent to the browser.
