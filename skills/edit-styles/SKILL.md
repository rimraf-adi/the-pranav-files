---
name: edit-styles
description: Use when asked to edit a reel "in a style", compare looks, or make several versions of one video. Routes to the style-* skills (formal, bold, editorial, clean), explains moments.json, and how to apply and compare styles with scripts/edit_styles.
---

# Edit styles

A style is a reusable recipe: captions theme + which template each kind of graphic uses + colours + header treatment
(relevant photo, icon, soft fade) + sound. The video-specific facts live in `public/projects/<name>/moments.json`
(style-independent), so one video can be rendered in every style and any new video can reuse every style.

| Style | Skill | Use for | Graphics | Captions |
|---|---|---|---|---|
| formal | `skills/style-formal` | most talking-head explainers, finance, business | up to 3 | plain, calm |
| bold | `skills/style-bold` | hooks, challenges, high-energy | up to 5 | stamp-in grotesk |
| editorial | `skills/style-editorial` | stories, quotes, long-form explainers | up to 3 | serif |
| clean | `skills/style-clean` | speaker-led videos, minimal | 1 | plain |

## Workflow
1. Do the normal pipeline first (`skills/edit-workflow`): transcript, `timeline.json` with cuts and words.
2. Write `public/projects/<name>/moments.json` (schema below). Pick relevant images with `skills/find-assets` (Pexels key is in `.env`; look at the previews before choosing, never slap a stock photo on).
3. Apply a style: `python3 scripts/edit_styles/apply_style.py public/projects/<name> formal` -> `variants/formal.json`.
   Warnings mean a line is longer than its template slot: shorten it, or give a per-style wording in `lines_by_style`.
4. Preview: `npx remotion render Reel public/renders/<name>_formal.mp4 --props=public/projects/<name>/variants/formal.json --scale=0.5`,
   then inspect a contact sheet (`scripts/pipeline/contact_sheet.sh`) and close-up stills of every graphic.
5. Compare: `python3 scripts/edit_styles/compare_styles.py public/projects/<name> --styles formal,bold,editorial,clean`
   renders each and tiles them 2x2 (labelled) into `public/renders/<name>_styles.mp4`.
6. Keep one: `apply_style.py ... --set-active` writes it to `timeline.json` (base is backed up to `variants/_base.json`).

## moments.json
```json
{ "emphasis": ["3", "90%"],
  "moments": [
    { "id": "opening", "kind": "hook", "at": 0.0, "duration": 3.3,
      "lines": ["YEARS OF TRADING", "3 YEARS", "", ""],        // [tiny label, big word, accent, tail]
      "lines_by_style": { "bold": ["TRADING FOR", "3 YEARS", "", ""] },   // optional wording for a tighter template
      "bg": "projects/x/assets/photos/chart.jpg", "bgFocus": "62% 50%", "icon": "projects/x/assets/icons/trend-up.svg",
      "cover_top_px": 575 } ] }                                  // hides a baked-in overlay at the top; header appears instantly
```
kinds: `hook` (opening), `stat` (a number), `statement` (a claim), `cta` (call to action).
Rules that hold for every style:
- Graphics paraphrase, never copy, the captions: a short label plus one big word (big word <= 8 chars, accent <= 10-16).
- Anchor `at` to the first word of the trigger phrase; 1.9-3.3 s; leave >= 0.6 s of face between graphics; never put a graphic over a baked thumbnail.
- No zooms. Check the header never covers the face. Photos must be relevant (search Pexels with a specific query, view the previews).

## Add a new style
Copy `edit-styles/formal.json` to `edit-styles/<name>.json`, change captions theme / templates / colours / header / sfx,
add a template to `edit-styles/template-slots.json` if you use a new one (map the 4 lines to its text items, set slot limits and header `y`,
found by rendering stills), then add `skills/style-<name>/SKILL.md` and run `python3 scripts/tools/link_skills.py`.
