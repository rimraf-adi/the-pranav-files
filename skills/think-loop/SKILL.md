---
name: think-loop
description: Use when asked to add b-roll, cutaways, graphics or "make this video better" on an edited talking-head video. Runs a perceive -> think -> preview -> revise -> paste -> verify loop so b-roll is chosen from what is actually said and shown, inspected before it is placed, and checked after.
---

# Think loop (b-roll)

Never paste b-roll blind. Each pass has an artifact the agent must LOOK at.

## 1. Perceive
- `python3 scripts/analyze_media.py public/projects/<name>/raw/<file> out/<name>` then view `out/<name>/contact_sheet.png` and read `analysis.json` (silences, scene changes, loudness).
- Read `public/projects/<name>/timeline.json` words (output-timeline times). Timeline times, not source times, are what `broll.at` uses.
- Note: is the speaker moving/locked-off? One continuous shot means b-roll is the only visual variety.

## 2. Think (write it down in `out/<name>/think.md` before creating anything)
For each candidate: the spoken quote + timestamp, why a visual helps (number, claim, name, place, contrast), the b-roll `kind`, and what the viewer should learn in <2s.
Good triggers: a number or statistic, a named entity, a claim worth proving, a topic change, a stretch >6s with no visual change.
Rules:
- Anchor `at` to the first word of the trigger phrase (or ~0.2s before). Duration 1.5-3.5s.
- Max ~35% of runtime covered; leave >=0.6s of face between cards; never two in a row.
- Never invent facts or numbers. Use only values spoken in the video. Don't animate a count-up that implies a trend the speaker didn't state (use a static card instead).
- ASR can mishear numbers/names (it once heard "2003" for 2013). If the card shows a figure or a name, cross-check it with a second transcription of that window (`whisper-large-v3-turbo`) or flag it to the user.
- Prefer real assets (photos/icons from `skills/find-assets`, if present) over text-only cards when a concrete thing is named.

## 3. Preview before placing
- Write candidates to `public/projects/<name>/broll_candidates.json` as `{"broll":[...]}` matching `src/schema/timeline.ts`.
- `python3 scripts/preview_broll.py public/projects/<name>/broll_candidates.json out/<name>/broll` then view `broll_sheet.png` (3 stills per card: start/mid/end).
- Critique: legible at phone size? text inside safe area? animation reaches its end state? numbers correct? Does it look like the style in `skills/style-gadzhi`?

## 4. Revise (max 3 rounds)
Fix props or, if the look itself is weak, change `src/components/Broll.tsx` as a separate deliberate task (see AGENTS.md rules), then re-preview. Stop when the sheet passes the critique.

## 5. Paste
Copy approved items into `timeline.json -> broll`. Set `emphasis` on the matching words. Keep captions on top of b-roll (they already render last).

## 6. Verify
- `npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5`
- `scripts/contact_sheet.sh out/preview.mp4 out/sheet.png 1.5` and view it.
- Check: face visible between cards, captions not colliding with card text, b-roll <=35%, every card lands on its spoken trigger, no card starts mid-fade of another.
- Report what was added (id, time, quote) and anything uncertain.
