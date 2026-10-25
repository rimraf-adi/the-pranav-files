---
name: motion-templates
description: Use when asked to replicate, port or take inspiration from an After Effects / Premiere motion template (hooks, captions, animated text, lyrics, transitions, shakes, zooms, drop shadows) while editing a reel. Holds machine-extracted specs of 43 .mogrt templates and 233 Premiere presets, plus the recipe for turning them into Remotion code.
---

# Motion templates (extracted specs)

Source packs live (untracked) in `library/zips/` (as downloaded) and `library/extracted/` (unpacked). Everything here was read from them with
`scripts/templates/extract_templates.py`; regenerate with the commands at the bottom. The packs are third-party commercial
templates: use them as **reference for look and timing**, rebuild the motion in our own components, never ship their files.

## Use a replicated template (fastest path)
43 templates are already implemented in `src/templates/` and usable as `{"kind":"template","template":"<slug>",...}` b-roll.
Pick one from **`CATALOG.md`** (look, motion, when to use, defaults, preview image), then see its usage block at the top of that file.
`python3 scripts/templates/preview_template.py <slug>` renders a sheet (original preview above, ours below). Add a new port as
`src/templates/<slug>.tsx` (default export `TemplateDef`, see `hooks-captions-caption-01.tsx`), then `node scripts/templates/gen-template-registry.mjs`.

## Where to look
| need | open |
|---|---|
| pick a replicated template to use | `CATALOG.md` |
| pick a template | `INDEX.md` (fonts, colours, duration, animated-prop counts, recipe hints) |
| replicate one | `templates/<slug>.md` (+ look at `thumbs/<slug>.png` and `thumbs/<slug>-strip.jpg`) |
| transition / zoom / shake / flash / drop-shadow / sound-impact presets | `presets/<category>.md` |
| fonts, tutorial notes | `pack-notes.md` |
| raw JSON of everything | `raw/templates.json` |

## What a template md contains
Comp size/fps/duration; fonts and sizes; colours; editable controls with defaults; then **per layer**: in/out times,
parent, text document (font, size, fill, stroke, tracking), **text animators** (range selector start/end/offset, per-char
properties), effect parameters (only non-default values), transform values, and **keyframes in seconds** with
interpolation and, for scalar properties, `Easing.bezier(x1,y1,x2,y2)` already converted from After Effects speed/influence.
Expressions are included (long "Flow" bezier helper boilerplate is trimmed to its call).

## Replicating in Remotion (rules)
1. Per AGENTS.md a new effect is a separate task: new component in `src/components/`, schema field in
   `src/schema/timeline.ts`, then `npm run lint`, preview still, half-scale render. Edits to a project only touch `public/projects/<name>/`.
2. Times in the md are seconds; convert with `frame / fps`. Every animation must be a pure function of the frame
   (`interpolate`, `spring`, `Easing`, `random(seed)`); no timers, no CSS animations, no `Math.random()`.
3. Canvas: hooks/captions packs are 1080x1920 (use px as-is). The "premium-text" pack is 1920x1080 landscape: scale
   positions and sizes by 1080/1920 (sizes) and re-centre for portrait; keep text inside x 6-94%, y 8-88%.
4. Mapping:
   - keyframes -> `interpolate(t, [t0,t1], [v0,v1], {easing: Easing.bezier(...), extrapolateLeft/Right: "clamp"})`; `hold` -> step; `linear` -> `Easing.linear`.
   - Text range-selector `Start 0->100` with opacity 0 animator -> reveal letters in order (or `random` order when "Randomize Order" is 1).
   - `Character Offset time*N` -> cycle characters; `Random Seed time*30` -> reseed 30x/s.
   - Drop Shadow (distance, softness, direction 135 deg, opacity 127.5/255) -> `text-shadow`; Glow -> stacked shadow in accent colour;
     Box/Gaussian Blur -> `filter: blur(px)`; CC Light Sweep -> moving gradient clipped to text; Linear Wipe -> `clip-path`.
   - AE scale is percent (100 = 1.0); opacity percent; position in comp pixels; rotation degrees.
   - Colours in controls are `#RRGGBB`; keep the accent/white pairing, swap fonts to Google Fonts equivalents
     (NHaasGroteskDSPro-75Bd -> Inter, Impact -> Anton, PlayfairDisplay -> Playfair Display, Sloop Script -> a script font, GillSans-UltraBold -> Montserrat/Anton).
   - **Expression-driven templates (most Caption/Hook ones): the expression is the motion spec.** Example, Caption 01 text animator:
     `delay=1; dur=8; start=(textIndex-1)*delay; x=clamp(frame-start,0,dur)/dur; v=100*(1-2^(-10x))` = each letter starts 1 frame after
     the previous and eases in with an expo-out over 8 frames (at 25fps); the "Revealing Properties" controls (position 300/0, opacity 0,
     blur 100, scale 100) are the from-state it eases away from. Word layers are staggered by their in-points (0, 0.12, 0.24, 0.52 s).
     In Remotion: `const x = clamp(frame - i*delay, 0, dur)/dur; const k = 1 - 2 ** (-10*x);` then `interpolate(k, [0,1], [from, to])`.
5. Caption-style replication that only needs fonts/colours/entrance is just a theme DNA (`src/themes/dna/*.json`, see `port-hyperframes-theme`).
   Five exist already (`grotesk-pop`, `hook-cyan`, `impact-red`, `playfair-red`, `acid-lime`), derived from these packs.
6. Compare your render's contact sheet with the template's `thumbs/*-strip.jpg` before reporting done; say what is simplified.

## Presets (Premiere effect presets, .prfpset)
Categories: Basic 3D, Color Looks (Lumetri LUT references, not reproducible as data), Drop Shadows, In & Out Animations,
Miscellaneous, Movements, Shake FX, Sound Impacts, Starter Pack, Transitions, Zooms. Each lists the Premiere effect
(`ADBE Motion`, `ADBE Geometry2`, `ADBE Tint` ...) and parameter keyframes in preset-local seconds. `handles` are raw bezier
tangents from the file; assume ease-in-out unless a preset says otherwise. Use them for punch/zoom/shake/flash timings (restraint: see broll-director).

## Regenerate
```bash
python3 -m venv .venv-aep && .venv-aep/bin/pip install py-aep      # once
python3 -I scripts/templates/assets_zip.py replicate library/zips library/extracted
.venv-aep/bin/python scripts/templates/extract_templates.py
python3 scripts/templates/build_template_index.py
```
