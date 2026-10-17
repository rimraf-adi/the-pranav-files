---
name: style-gadzhi
description: Use when styling a talking-head reel in the reference agency-creator look (Iman Gadzhi style): blur-in kinetic title stacks above the head, color-coded keywords, small italic lowercase captions, light-leak cuts, dark graded footage. Source of truth is the analysed reference clip in ./reference.
---

# Gadzhi style (extracted from the reference showcase clip)

Source: a 10s before/after showcase (the AFTER half is the target). Crops and frame-rate sheets are in `reference/`:
`after_a.png`, `after_b.png` (key frames), `title_anim.png` (40ms steps of a title building), `cut_anim.png` (light-leak cut).
OBSERVED = measured from frames. INFERRED = my reading, confirm against more samples.

## Layout (9:16)
- OBSERVED: the speaker sits in the lower ~70% of frame; the top ~28% is a clean "title zone". The head is pushed down, never covered by text.
- Titles are stacked, centered, ~80% of frame width on the longest line, tight line height (~0.95), starting ~4% from the top.
- Captions (spoken words) sit lower: ~78% from top, over the chest, not the face.

## Title stack (the signature element)
- Font: heavy geometric sans, uppercase (looks like Montserrat/Poppins ExtraBold, INFERRED, font not confirmed).
- Three-level hierarchy per title: PRIMARY (huge, colored: "100", "RIGHT TRACK", "STEP"), SECONDARY (white, ~70% of primary: "DAYS", "NOT" red), MODIFIER (tiny white: "BREAKDOWN", italic "or", "by").
- Color is semantic: red = attention / number / negative ("100", "NOT"), green = positive / validation ("RIGHT TRACK"), cyan = process / steps ("STEP by STEP"), white = neutral. Never more than 2 colors in one title.
- Each title lives ~1.3-2.0s and is swapped for the next keyword; roughly one title per 2.5s, with gaps of plain captions between them. Titles ride on key phrases, not every sentence.
- Entrance (OBSERVED, 25fps): each LINE blur-in over ~0.25s (blur ~14px -> 0 with opacity 0 -> 1, letters resolve in staggered order, last letters last). Lines start ~0.2s apart ("100" at 0.24s, "DAYS" 0.44s, "BREAKDOWN" 0.80s), full build ~0.75s. Hold ~0.5-1.0s. Exit: quick blur-out + fade over ~0.1-0.15s.
- Behind the title, a colored gradient wash fades in from the top over ~0.2s, tinted to the primary word (dark red / teal / black). The footage under it is darkened.

## Captions
- OBSERVED: small, lowercase, italic, white, light-to-regular weight (Montserrat Italic-like), no stroke, soft shadow, ~5-6% of frame width in height.
- 1-3 words per chunk, changing roughly every word to two (5-10 frames). NOT the bold uppercase stroke captions used earlier in this repo.
- Captions keep running while a title is on screen.

## Icons
- Flat, monochrome (white/grey) silhouette icons paired with a short label at the top ("Client" + person-in-suit icon). Same blur-in as titles. ~14% of frame width.

## Grade and texture
- OBSERVED: dark, contrasty footage, crushed blacks, navy/teal shadows, warm skin highlights. Background behind the speaker is soft/blurred and darkened; vignette.
- Sparse white film-dust specks flicker over the top area (small, 1-3px, brief).
- Warm orange/yellow glow can wash the face right before a cut.

## Cuts / transitions
- OBSERVED: hard cut with a LIGHT LEAK. Orange/pink additive glow ramps up over ~0.15-0.2s before the cut (peak at the cut), cut is instant to a different camera angle, glow decays over ~0.15s after (no whoosh visible in frames; sound unknown).
- Any title on screen ends at the cut.

## Motion
- INFERRED: slow push-in during a shot (face grows ~5-8% over 2-3s), reset on the cut. Not hard punch-ins.

## Audio (limited)
- OBSERVED: loud, limited master: mean ~-21 dB, peak ~-0.2 dB, no silences (tight cut). Music and SFX can't be identified from this analysis.

## Don't
- Cover the face with text; use more than 2 title colors; keep a title longer than ~2s; use stroked uppercase captions; use flat text cards on a black background as b-roll (the earlier yellow cards do NOT match this style).

Values for code live in `styles/gadzhi.json` -> `reference`.
