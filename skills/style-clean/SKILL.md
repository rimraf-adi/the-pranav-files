---
name: style-clean
description: Use when the speaker and the words should carry the video. Plain captions and a single small opening header, no photo, no icon, no sound design. Preset in edit-styles/clean.json.
---

# Style: clean

**Look**: calm captions only. One small opening header (label + big word, no photo or icon) that also hides any baked-in overlay at the top;
no other graphics.

| Part | Setting |
|---|---|
| Captions theme | `plain` |
| Template | `hooks-captions-caption-01` at scale 0.7, white only |
| Header | no photo, no icon, scrim 0.92 (1.0 when `cover_top_px` is set), height 700, solid 420 |
| Graphics | max 1 (the `hook` moment); stat/statement/cta are skipped |
| Sound | none |

Apply: `apply_style.py public/projects/<name> clean`. Use for interviews, tutorials, anything where graphics would compete with the speaker.
