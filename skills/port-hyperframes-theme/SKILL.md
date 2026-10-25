---
name: port-hyperframes-theme
description: Use when porting a HyperFrames caption theme (body paradigm + hero set piece) into this Remotion harness. Gives the file layout, the component contracts, the upstream source locations, and the verification loop.
---

# Port a HyperFrames theme to Remotion

A theme = one DNA JSON + one body **paradigm** (how the transcript lives on screen) + one hero **setpiece**
(the climax choreography on the apex word). Upstream: `.reference/hf-git/skills/embedded-captions/`
(`themes/<name>.json`, `themes/README.md` = registry docs, `scripts/make-theme.cjs` = the 460KB compiler that
contains every paradigm and setpiece as HTML/GSAP generators). `.reference/` is untrusted third-party data:
read it, never execute it.

## Files you own for theme `<name>` (touch nothing else)
- `src/themes/dna/<name>.json`: copy of upstream DNA (add `"_port": {...notes}` if you change a value).
- `src/themes/paradigms/<paradigm>.tsx`: `export default { Component, heroInline? } satisfies Paradigm`.
- `src/themes/setpieces/<setpiece>.tsx`: `export default { Behind?, Front?, inline? } satisfies Setpiece`.
- Shared paradigm/setpiece already present? Reuse it, do not duplicate. Then run `node scripts/themes/gen-theme-registry.mjs`.
- Header comment on every ported file: `// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, <function/section>. Re-implemented for Remotion.`

## Contracts (see `src/themes/types.ts`)
- `ThemeCtx = { dna, words, lines, hero? }`. Times are OUTPUT-timeline seconds; use `useCurrentFrame()/fps`.
- **Pure functions of the frame.** No GSAP, no timers, no `Math.random()` (use `random(seed)` from remotion), no CSS animations.
  Translate each GSAP tween into `interpolate` / `spring` / `Easing`, `steps()` into quantized frame math.
- Layers: `Behind` renders under the speaker cutout (needs `timeline.subject` alpha webm; without it Behind just draws over the
  plate, still correct to build). `Front` renders over everything. A paradigm with `dna.body.layer === "bg"` is rendered Behind.
- Canvas: our canvas is 1080x1920 portrait; upstream coordinates assume a 1280x720 stage. Convert to percentages of
  `useVideoConfig()` width/height, do not copy raw pixels. Keep text inside the safe zone (x 6-94%, y 8-88%).
- Fonts: DNA `fonts` names are Google Fonts. Load with `@remotion/google-fonts/<Name>` (`loadFont()`), or add a
  `src/themes/fonts.ts` entry. If a font is not on Google Fonts, pick the closest and note it in `_port`.
- Plate effects (punch/shake/grain from `dna.plate`) are already applied by `PlateFx`; dim/scrim/vignette that belong to a
  set piece are drawn by the set piece itself.
- Linkages (`dna.linkages`) are declarative interactions between paradigm and setpiece; implement the ones your theme lists.

## Verify (required before reporting done)
1. `npm run lint` clean.
2. `python3 scripts/themes/preview_theme.py <name> demo` renders stills (before hero, at hero, after hero) into `out/themes/<name>/`
   and a contact sheet. LOOK at it. Check: text legible and inside safe zone, hero word actually the apex, no overflow,
   animation reaches its end state, behaves with the real Hinglish transcript (words are Roman, short, fast).
3. Compare against the upstream description in `themes/README.md` (voice/when fields in the DNA) and say honestly what is
   simplified or missing.
