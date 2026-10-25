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
| word-by-word image montage | (asset montage) | `montage` | exists |
| bar/line/pie from spoken data | charts | `chart` | missing |
| product/phone UI or logo on gradient | webpage / logo-reveal | `product` (variant phone/logo) | exists |
| lower-third / name tag | lower-thirds | `lowerThird` | missing |
| map highlight / connect places | maps | `map` | missing |
| headline / tweet / article | news, tweet | `quote` | missing |
| b-roll on top half, speaker below (soft seam) | (layout) | card style `media`, layout `split` | exists |
A "missing" kind is a SEPARATE task (AGENTS.md): new `src/components/` renderer, schema field in `src/schema/timeline.ts`,
`npm run lint`, then a preview. Say so, list the kind you need, and plan the beat with the closest existing kind meanwhile.
Port motion from upstream as pure functions of the frame (see `port-hyperframes-theme` contracts: no GSAP/timers/Math.random).


## 3b. Takeaway cards (exist now: `timeline.json -> cards`, schema in `src/cards/schema.ts`)
Use a card for a data moment the viewer must *read*: a big number, a before/after, a 2-4 item takeaway list. Fields:
`style` (minimal, spotlight, audit, whiteboard, editorial, academic, geom, swiss, terminal, xhs), `layout` (stack, split, pip, overlay),
`frame`, `accentIndex`, `content {kicker, title with *highlight*, detail, data{value,label}, list[]}`. Palette: `cardPalette.themeId`.
- A card shrinks/moves the speaker into the layout, so it is a heavy visual: max one per ~8s, 2-5s long, never next to a b-roll card.
- Vary `style` between cards; text verbatim from the transcript; no invented numbers.
- ALWAYS preview: `python3 scripts/pipeline/preview_cards.py` (styles x palettes) and a half-scale render + contact sheet before the full render.

## 3c. Patterns from a strong reference reel (startup breakdown, 67s, inferred from 1 fps frames; scene cuts at 3.7, 5.1, 6.8, 8.5, 12.3, 16.2, 20.0, 21.4, 31.8, 42.8 s)
Plan the WHOLE reel as an arc, not isolated cutaways:
1. **Hook (0-3s):** speaker only, desaturated background, 2-3 kinetic words at head height, one accent-colored word ("why *nobody* is doing...").
2. **Name the thing (3-5s):** a named product/company gets a logo card on a flat brand-tinted gradient. One second, no speaker.
3. **Show the product (5-7s, then 36-43s):** first a real UI screenshot filling the top half with the speaker below; later, when explaining *how it works*, a phone mockup on the same gradient held ~7s with one word-caption per beat. Longer hold = explanation.
4. **Concrete-noun montage (7-11s):** when the speaker lists nouns ("book, people, pet, visits, boarding"), cut to a different real-footage shot for EACH word, ~1s each, full-bleed, one-word caption mid-frame. Fast, matched to speech rhythm, then straight back to the face.
5. **Personal anecdote (12-20s):** split layout, b-roll on TOP half, speaker bottom half, caption on the seam. 5-6 alternating shots (the speaker's own cat, packing a suitcase, a daycare room) tied to each clause. The face stays visible.
6. **Price/number (20-24s):** no card; giant white/accent word on the speaker ("sasta", "2000") with a small modifier line ("charge karte") underneath.
7. **Place (30-33s):** map b-roll full-bleed behind the speaker, 2-3s, speaker small at the bottom.
8. **Face time:** b-roll clusters at 0-22s and 36-43s; a face-only stretch of ~10s in the middle and a long face-only close (43-67s) where the speaker is allowed a slow push-in.
9. **Consistency:** one background palette for all non-footage cards (here maroon), white text, one accent color (cyan); mixed type (bold sans for impact words, italic serif for soft words). Hard cuts only.
Rules extracted: every cutaway answers a specific spoken word; montages are word-by-word; explanations get long holds; the speaker's face is never covered; cut density is highest in the hook and the anecdote, lowest in the argument.

## 3d. Write the plan as data: beats.md -> timeline.json
Put the beat table in `public/projects/<name>/beats.md` with a `Spec` column (key=value pairs) and run
`python scripts/pipeline/beats_to_timeline.py public/projects/<name> --validate`. It rewrites only `broll` and `cards`
and validates through Remotion. Full spec syntax is in the script's docstring. Examples:
`broll montage` `shots="a.jpg:book;b.jpg:pet"`, `broll product` `variant=phone src=... words="website;experts"`,
`card media/split` `media="a.jpg:fed;b.jpg:oil"` (b-roll top, face below), `card swiss/split` `title="Still above *target*" value=3.7%`.
Preview kinds first with `scripts/pipeline/preview_broll.py`; render a still of a card with `npx remotion still Reel ... --frame=N`.

## 4. Pacing and restraint (user feedback: previous edits zoomed too much)
- NO punch-in/jump zooms. Per speaker shot at most one slow push-in (<= 2-3%). Variety comes from b-roll, not camera moves.
- B-roll covers <= 35% of runtime; one idea per card; 1.5-3.5s; >= 0.6s of face between cards; never two cards in a row of the same kind.
- Anchor `at` to the first word of the trigger phrase (or 0.2s before). Captions stay on top.
- Use effects "wisely": one hero moment per ~10s (a stat or a hero graphic). Everything else stays quiet.
- Never invent facts. Numbers on cards must be spoken in the video or marked `(verify)` and cross-checked.

## 5. Source tiers for stills (free)
Licensed stock (`find-assets`) > Cloudflare Workers AI FLUX (free daily quota, token in `.env`, never print it) >
Pollinations anonymous (1 image / 45 s per IP, watermark, 576x1024; fine for a few hero stills).
Record provenance in the project's `assets/manifest.json`. Generated images: say "AI-generated" in the manifest.

## 6. Hand off to think-loop
Write approved candidates to `broll_candidates.json`, run `scripts/pipeline/preview_broll.py`, LOOK at the sheet, paste, render a
half-scale preview, inspect `scripts/pipeline/contact_sheet.sh`. Report: beats planned, kinds used, kinds requested but missing,
assets with licenses, anything unverified.

## 7. Style variants (same raw, different looks)
To compare looks, copy `timeline.json` to `public/projects/<name>/variants/<variant>.json`, change only `style`,
`captionTheme`, `source` (e.g. `base_bg.mp4` from `scripts/background/treat_bg.py`), `pushInPercent`, `cuts[].scale`, then render
each with `--props=` at `--scale=0.5` and compare contact sheets. Never edit the project's real timeline for an experiment.
