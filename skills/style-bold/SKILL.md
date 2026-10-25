---
name: style-bold
description: Use for a high-energy edit (hooks, challenges, hype). Stamp-in grotesk captions, right-aligned stacks with a big cyan word, dark header with an icon and no photo, a sound on every graphic, up to five graphics. Preset in edit-styles/bold.json.
---

# Style: bold

**Look**: grotesk captions that stamp in word by word; the header is near-solid dark with a right-aligned Caption 02 stack
(label, huge cyan word, yellow accent), an icon top-right, no photo (photos slow a fast edit down). Every graphic gets a whoosh and a tick.

| Part | Setting |
|---|---|
| Captions theme | `grotesk-pop` |
| Template | `hooks-captions-caption-02` at scale 0.8 |
| Colours | white, `#00FFD7`, white, `#F3FF00` |
| Header | icon, no photo, scrim 0.94, height 760, solid 420 |
| Graphics | max 5 |
| Sound | whoosh 16% + tick 40% |
| Zoom | none (energy comes from the type, not the camera) |

Apply: `apply_style.py public/projects/<name> bold`. Slot limits for this right-aligned stack: label <= 15 chars (longer text is
clipped on the left: use `lines_by_style` with a shorter label), big <= 8, accent <= 16, tail <= 17.
Avoid for sombre or sensitive topics.
