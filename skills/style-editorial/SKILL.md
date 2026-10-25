---
name: style-editorial
description: Use for stories, quotes and long-form explainers. Serif captions, a serif italic key word in gold with a cyan accent, desaturated photo header, no icons, no sound design, up to three graphics. Preset in edit-styles/editorial.json.
---

# Style: editorial

**Look**: Playfair-style captions; header graphics use the Caption 14 stack (small label, big italic serif word in gold, cyan accent phrase,
small typed tail) over a dark relevant photo (brightness 0.5). Slower, literary feel; no icons, no sounds.

| Part | Setting |
|---|---|
| Captions theme | `playfair-red` |
| Template | `hooks-captions-caption-14` at scale 1.15 |
| Colours | white, `#FFC900`, `#00FFD7`, white |
| Header | photo (dimmed 0.5), scrim 1.0, height 820, solid 380, no icon |
| Graphics | max 3 |
| Sound | none |

Apply: `apply_style.py public/projects/<name> editorial`. Slot limits: label <= 18, big <= 9 (italic serif), accent <= 15, tail <= 26.
This template's accent and tail animate slowly (spring + typewriter): give graphics >= 2.5 s or the last line is still typing when it leaves.
