---
name: style-formal
description: Use for a restrained, professional edit (finance, business, explainers). Calm plain captions, at most three header graphics, one accent colour, relevant photo header with a long soft fade, whisper-quiet sound. Preset in edit-styles/formal.json.
---

# Style: formal

**Look**: white captions with a soft fade, emphasis on only a few words. Graphics sit in a header over a darkened relevant photo
(fades out well above the face) and use the Caption 01 stack: tiny uppercase label, big white word, yellow accent line, small tail. Icon top-right.
**Why it works**: it informs without performing. Fewer, calmer graphics read as credible.

| Part | Setting |
|---|---|
| Captions theme | `plain` |
| Template | `hooks-captions-caption-01` at scale 0.85 |
| Colours | white, white, `#F3FF00`, white |
| Header | photo + icon, scrim 0.85, height 800, solid 400, fade-in 0.27 s |
| Graphics | max 3, kinds hook/stat/statement/cta |
| Sound | soft whoosh at 12% on each graphic, no ticks |
| Zoom | none |

Apply: `python3 scripts/edit_styles/apply_style.py public/projects/<name> formal`. Needs `bg` + `icon` per moment (relevant photo; find-assets).
Lines: label <= 26 chars, big <= 8, accent <= 10, tail <= 26.
Pairs well with: any footage; avoid when the speaker is already very animated (use clean).
