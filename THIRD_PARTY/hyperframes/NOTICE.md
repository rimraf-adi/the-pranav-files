# Third-party notice: HyperFrames

Portions of `src/themes/` are derived from **HyperFrames** (https://github.com/heygen-com/hyperframes),
Copyright HeyGen, licensed under the Apache License, Version 2.0 (see `LICENSE` in this folder).

Derived material:
- `src/themes/dna/*.json`: theme DNA files from `skills/embedded-captions/themes/` (values copied; unchanged unless noted in a `_port` field).
- `src/themes/paradigms/*.tsx`, `src/themes/setpieces/*.tsx`: re-implementations in React/Remotion of the
  body paradigms and hero set pieces from `skills/embedded-captions/scripts/make-theme.cjs` (originally HTML + GSAP).
- `src/themes/tokens/*.json`: design tokens from `themes/*.css`.

Changes: the original HTML/GSAP/CSS output was rewritten as Remotion components driven by `useCurrentFrame()`.
Coordinates were adapted from the upstream canvas to the 1080x1920 portrait canvas. Each ported file carries a
header comment naming its upstream source. This project is not affiliated with or endorsed by HeyGen.
