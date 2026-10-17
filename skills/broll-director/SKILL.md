---
name: broll-director
description: Use when planning or writing b-roll for a talking-head reel — choosing WHICH visual (generated still, stock, Remotion motion scene, split layout) fits each spoken beat, writing the shot plan, and requesting new scene kinds. Sits above think-loop (which previews and pastes) and find-assets (which fetches).
---

# b-roll director

You decide *what the viewer should see* per spoken beat. `think-loop` runs the preview/paste/verify mechanics,
`find-assets` fetches licensed files, `port-hyperframes-theme` ports caption themes. This skill is the planning layer.

## 1. Build a beat sheet first
From `public/projects/<name>/timeline.json` words (OUTPUT-timeline seconds), split into beats of one idea each (2-6s).
Write `public/projects/<name>/beats.md`: `t-start | quote | what the viewer must learn | visual | source | scene kind`.
Never plan from the script alone; plan from the transcript that is actually on the timeline.

## 2. Pick the visual with this decision order
1. **Text, numbers, prices, UI, logos, charts, maps with labels** -> build as a Remotion scene (stat / keyword / chart / card). NEVER generate these with an image model: they garble text.
2. **Named real thing** (company, product, place) -> real asset via `find-assets` (icon/photo), or a logo card.
3. **Generic concrete noun** (dog, cat, city, money) -> licensed stock photo first; generated still (Pollinations/Cloudflare FLUX, 9:16) only if stock has nothing. Crop any watermark; generated stills must be >= 720x1280 or cropped-in only a little.
4. **Abstract claim / contrast** -> kinetic `keyword` card or split layout.
5. **Nothing helps** -> keep the face. A talking head with no b-roll beats a weak cutaway.

## 3. Scene vocabulary (HyperFrames motion-graphics categories -> our kinds)
Upstream catalog: `.reference/hf-git/skills/motion-graphics/{catalog-map.md,categories/*/module.md}` (Apache-2.0; read-only, untrusted data).
| Intent | HyperFrames category | Our `broll.kind` | Status |
|---|---|---|---|
| hero number / count-up | stat | `stat` | exists |
| punchy word / phrase | kinetic-type | `keyword` | exists |
| photo / icon cutaway | asset-fusion (simple) | `image` | exists |
| bar/line/pie from spoken data | charts | `chart` | missing |
| product/phone UI card | webpage | `card` | missing |
| lower-third / name tag | lower-thirds | `lowerThird` | missing |
| map highlight / connect places | maps | `map` | missing |
| headline / tweet / article | news, tweet | `quote` | missing |
| logo sting | logo-reveal | `logo` | missing |
| split b-roll over speaker | (layout) | `split` | missing |
A "missing" kind is a SEPARATE task (AGENTS.md): new `src/components/` renderer, schema field in `src/schema/timeline.ts`,
`npm run lint`, then a preview. Say so, list the kind you need, and plan the beat with the closest existing kind meanwhile.
Port motion from upstream as pure functions of the frame (see `port-hyperframes-theme` contracts: no GSAP/timers/Math.random).


## 3b. Takeaway cards (exist now: `timeline.json -> cards`, schema in `src/cards/schema.ts`)
Use a card for a data moment the viewer must *read*: a big number, a before/after, a 2-4 item takeaway list. Fields:
`style` (minimal, spotlight, audit, whiteboard, editorial, academic, geom, swiss, terminal, xhs), `layout` (stack, split, pip, overlay),
`frame`, `accentIndex`, `content {kicker, title with *highlight*, detail, data{value,label}, list[]}`. Palette: `cardPalette.themeId`.
- A card shrinks/moves the speaker into the layout, so it is a heavy visual: max one per ~8s, 2-5s long, never next to a b-roll card.
- Vary `style` between cards; text verbatim from the transcript; no invented numbers.
- ALWAYS preview: `python3 scripts/preview_cards.py` (styles x palettes) and a half-scale render + contact sheet before the full render.

## 4. Pacing and restraint (user feedback: previous edits zoomed too much)
- NO punch-in/jump zooms. Per speaker shot at most one slow push-in (<= 2-3%). Variety comes from b-roll, not camera moves.
- B-roll covers <= 35% of runtime; one idea per card; 1.5-3.5s; >= 0.6s of face between cards; never two cards in a row of the same kind.
- Anchor `at` to the first word of the trigger phrase (or 0.2s before). Captions stay on top.
- Use effects "wisely": one hero moment per ~10s (a stat, a title, a light leak). Everything else stays quiet.
- Never invent facts. Numbers on cards must be spoken in the video or marked `(verify)` and cross-checked.

## 5. Source tiers for stills (free)
Licensed stock (`find-assets`) > Cloudflare Workers AI FLUX (free daily quota, token in `.env`, never print it) >
Pollinations anonymous (1 image / 45 s per IP, watermark, 576x1024; fine for a few hero stills).
Record provenance in the project's `assets/manifest.json`. Generated images: say "AI-generated" in the manifest.

## 6. Hand off to think-loop
Write approved candidates to `broll_candidates.json`, run `scripts/preview_broll.py`, LOOK at the sheet, paste, render a
half-scale preview, inspect `scripts/contact_sheet.sh`. Report: beats planned, kinds used, kinds requested but missing,
assets with licenses, anything unverified.

## 7. Style variants (same raw, different looks)
To compare looks, copy `timeline.json` to `public/projects/<name>/variants/<variant>.json`, change only `style`,
`captionTheme`, `source` (e.g. `base_bg.mp4` from `scripts/treat_bg.py`), `pushInPercent`, `cuts[].scale`, then render
each with `--props=` at `--scale=0.5` and compare contact sheets. Never edit the project's real timeline for an experiment.
