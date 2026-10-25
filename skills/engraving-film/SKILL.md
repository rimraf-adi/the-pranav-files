---
name: engraving-film
description: Use to make or re-theme the animated "engraving film" intro (typographic word play, public-domain engravings, ink rings and arcs, a candlestick mark, lockup) for a person or brand, e.g. the "Better Call PJ" stock-market intro. Composition EngravingIntro in src/films/engraving.
---

# Engraving film (animated intro)

A 14.5 s, 16:9 (1920x1080), 30 fps intro that replicates the cut structure of a reference film (`docs/references/engraving-film.md`, frames in `out/refs/demo/frames`, 10 fps),
re-written for a stock-market educator. Look: white chart-paper grid, ink-blue type (Playfair Display), one emerald accent, green up-triangle pointers, IBM Plex Mono figures,
no third-party marks. Cuts sit on a 0.1 s grid like the reference.

## Message it carries (never stated as a pitch)
- guidance toward profit: rising green profit lines, a compass needle that swings to them, "pro / fit"
- sound knowledge: ledger rows verified one by one with green checks, "sell -> tell", "chase -> chart"
- tagline: "Sound knowledge, steady profit."; ends on the lockup (candlestick mark + name)

## Render
```bash
npx remotion render EngravingIntro public/renders/better_call_pj_intro.mp4                  # full resolution 1920x1080
npx remotion render EngravingIntro out/preview.mp4 --scale=0.5 --props='{"name":"Your Name","tagline":["Line one,","line two."]}'
```
Props (zod `filmSchema`, default name "Better Call PJ"): `name` (lockup, ~16 characters fit), `tagline` (two lines, <= 16 characters each).

## Retarget for someone else
1. Words and beats are in `src/films/engraving/EngravingFilm.tsx` (one block per time range, in seconds). Word pairs that work: a struck word plus a red/green letter swap (sell -> tell), a word that splits over two lines with growing weight (pro / fit).
2. Images: public-domain engravings in `public/projects/engraving-film/assets/photos/` (fetched with `skills/find-assets`, Wikimedia). Swap files of the same name or add new ones with `scripts/assets/search.py ... --source wikimedia` + `fetch.py`; run `scripts/assets/license_check.py engraving-film`.
3. Colours/fonts: `src/films/engraving/theme.ts`. Primitives (rings, arcs, charts, candle ring, 3D candle, ledger, hourglass, letter construction): `primitives.tsx`.
4. Inspect like the reference: render at half scale, extract 10 fps frames, tile 24 per sheet (8x3) and compare with `out/refs/demo/sheets/s1..s6.jpg`. Sound: the reference audio onsets are listed in `docs/references/engraving-film.md`; the replica is silent.

Layout is authored for 1920x1080 (`W`/`H`/`CX`/`CY` in theme.ts); a portrait cut needs a re-layout, not a crop.

Rules: pure functions of the frame; every image gets the ink arc + pointer; headline words stay short (big word <= 8 chars); no invented numbers shown as claims (ledger figures are decoration).
