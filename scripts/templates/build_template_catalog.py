#!/usr/bin/env python3
"""Write skills/motion-templates/CATALOG.md: visual descriptors + usage for every replicated template.

usage: node scripts/templates/dump_templates.mjs && python3 scripts/templates/build_template_catalog.py
Descriptors are hand-written from inspecting our own renders (skills/motion-templates/replicas/<slug>.png);
defaults (texts, colours, fonts, size, duration) come from the code via out/templates_meta.json.
"""
import json
from pathlib import Path

CAP_MOTION = "each word-group pops in: words start 1 frame apart, expo-out over ~8 frames, from an offset + blurred + transparent state; groups enter at 0 / ~0.12 / ~0.24 / ~0.5 s, then hold (no exit)"

# slug-suffix -> (look, motion, use, quality)
D = {
    "caption-01": ("Left-aligned stack: tiny white line, BIG white word, yellow line, small white closer.", "words slide in from the right / rise from below while un-blurring; " + CAP_MOTION, "calm hook or statement under a face; yellow carries the key phrase", "ok"),
    "caption-02": ("Right-aligned stack: white line, HUGE cyan word, tiny connector, yellow closer.", CAP_MOTION, "contrast statements (\"X than Y\"); key noun in cyan", "ok"),
    "caption-03": ("Centred stack: tiny cyan lead-in, big white word, white verb, red closing phrase.", CAP_MOTION, "warnings / mistakes (\"most people start in the wrong place\"); red = the problem", "ok"),
    "caption-04": ("Centred: tiny cyan + white lead-ins, yellow medium phrase, white closer.", CAP_MOTION + "; blur settles late", "short promise lines; yellow phrase is the payoff", "ok"),
    "caption-05": ("Mixed type: cyan lead-in, yellow ITALIC SERIF phrase on the left, bold white closer on the right.", CAP_MOTION, "editorial / insight lines; the serif words feel like a quote", "ok"),
    "caption-06": ("Staggered diagonal: cyan big word top-left, white small word, yellow big word lower-right, small closer.", CAP_MOTION, "two-beat contrast (\"most beginners / miss this\")", "ok"),
    "caption-07": ("Row of small yellow/white lead-in + HUGE cyan word with a blinking caret bar, small closer under it.", CAP_MOTION + "; caret blinks after reveal", "punchline lines (\"one move changes everything\")", "ok"),
    "caption-08": ("Left stack: white lead-in, yellow word, HUGE cyan word, tiny closer.", CAP_MOTION, "short punchy lines (\"nobody talks about it\")", "ok"),
    "caption-09": ("Left two-line sentence: white lead words, yellow phrase on the second line.", CAP_MOTION + "; strong blur on entry", "sentence-style caption, medium size", "ok"),
    "caption-10": ("Three-tier: cyan/white lead, white small connector, yellow phrase right-shifted.", CAP_MOTION, "explanatory sentences with a highlighted noun phrase", "ok"),
    "caption-11": ("Mixed: white lead-in, yellow bold word with a stacked white word, small grey tail line.", CAP_MOTION, "list-like lines (\"let's simplify how founders…\")", "ok"),
    "caption-12": ("White lead, yellow word, yellow bold phrase, small white tail.", CAP_MOTION + "; slide direction alternates", "explainer lines with a big yellow phrase", "ok"),
    "caption-13": ("White lead, ITALIC SERIF word, yellow phrase, small tail.", CAP_MOTION, "tutorial / how-to lines", "ok"),
    "caption-14": ("Italic gold serif lead, cyan phrase, small white tail, tiny white opener.", CAP_MOTION, "narrative lines; gold italic + cyan accent", "ok"),
    "caption-15": ("Large white italic serif number/word with soft glow, white lead, cyan phrase, small tail.", CAP_MOTION + "; glow fades in", "numbers and money claims (\"750 dollar in a day\")", "ok"),
    "hook-01": ("Centred white multi-line block, bold sans, no accent colour until emphasis.", "lines appear one after another with a slide + fade; ends ~5 s; later lines swap", "list / promise hook at the start (\"today I am teaching 7 essential shortcuts\")", "ok"),
    "hook-02": ("Cyan + white + yellow lines with large \"500K$\"-style number; contains empty rounded media frames (image slots).", "text pops; rounded frames scale in beside it", "needs footage in the frames: do not use without media", "approximate: frames are empty placeholders"),
    "hook-03": ("Centred type-on lines with a caret in rounded frames; cyan accent words.", "typewriter reveal with caret; frames fade in", "habit / step lists; empty frames", "approximate: frames are empty placeholders"),
    "hook-04": ("Highlight-bar type: purple, cyan and magenta bars behind white/yellow words, a tilted rounded frame.", "bars wipe in behind words; frame rotates slightly", "loud social-media hooks; empty tilted frame", "approximate: frame is an empty placeholder"),
    "hook-05": ("Mixed serif/sans: huge white 7, cyan serif word, yellow sans word, yellow italic serif line, empty frames.", "words swap with wipes; last line dissolves", "numbered \"advice\" hooks; empty frames", "approximate: frames are empty placeholders"),
    "addtext": ("Magenta blurred pill with white condensed ADDTEXT.", "pill pops in, letters type on, soft blur-glow pulse", "label / tag over footage; short (2 s)", "approximate"),
    "animations-jishan": ("Red condensed ANIMATIONS with tiny ADD / HERE lines, no glow.", "letters scramble in then settle; fast", "bold keyword card; 3.5 s", "approximate"),
    "insert": ("Yellow-lit pill (glow) with white condensed INSERT / LYRICS / HERE stack.", "letters flip in, yellow halo breathes", "highlighted lyric / keyword; 2.7 s", "approximate"),
    "lyrics-1": ("Red glow pill, white small LYRICS with ghost red outline text.", "ghosted letters collapse into a single line, red glow pulse", "lyric line card", "approximate"),
    "lyrics-6": ("Blue glow pill, wide light LYRICS (wide font) with repeated ghost lines.", "ghost copies converge, blue glow", "cool-toned lyric card", "approximate"),
    "lyrics-7": ("Big red condensed LYRICS above white script \"Add Them Here\", red glow.", "caps slam in, script writes on beneath", "lyric / title with a signature", "approximate"),
    "lyrics-animation": ("Red condensed LYRICS above script \"Animations\" on a grey frosted pill.", "letters drop in, pill fades up", "title with subtitle", "approximate"),
    "lyrics-jishan": ("Blue condensed LYRICS between white ADD / HERE lines.", "letters grow in, blue tint", "clean three-line label", "approximate"),
    "place-11": ("Red serif LYRICS with tiny white place / here, red glow box.", "serif caps slam in, soft red halo", "classic serif title card", "approximate"),
    "place-12": ("Lime halo; white condensed PLACE over red LYRICS.", "letters pop in with lime glow pulse", "high-energy gaming/tech title", "approximate"),
    "put-lyrics": ("Red condensed LYRICS with white PUT / HERE.", "letters tear in, small word slides", "short lyric / punch title", "approximate"),
    "text": ("Magenta condensed PLACE / LYRICS / HERE stack.", "words stagger in, one overlaps the next", "neon-magenta title block", "approximate"),
    "text-13": ("Lime condensed PLACE / LYRICS with white HERE.", "words slide in from the sides, overlapping", "bright title block (1920x1080 comp)", "approximate"),
    "text-14": ("White glowing PLACE with a tilted green HERE and LYRICS underneath.", "PLACE fades in, HERE stamps on a tilt, glow pulse", "pop-title with a green sticker word", "approximate"),
    "text-15": ("White serif ADD YOUR, red script \"Here\" overlapping LYRICS (serif).", "serif lines fade up, red script writes over", "elegant title with signature accent", "approximate"),
    "text-16": ("Orange-to-yellow gradient condensed LYRICS with small script \"Here\".", "letters rise in with warm glow, script fades", "warm cinematic title", "approximate"),
    "text-17": ("White condensed PLACE / HERE around a blue script \"Your Lyrics\".", "script writes over the stack", "title with a script flourish", "approximate"),
    "text-19": ("White PLACE / HERE with a red tilted LYRICS slashed across.", "red word swings in diagonally, stack settles", "aggressive keyword", "approximate"),
    "text-20": ("Grey condensed ADD LYRIC with red script overlay.", "letters shake in, script overlays in red", "glitchy lyric label", "approximate"),
    "text-21": ("Big magenta italic TXTFX with small white PLACE / HERE.", "letters swing in, magenta stamp", "playful title", "approximate"),
    "text-22": ("White HERE / FINAL stack with a red strike line.", "words slide and cross, strike wipes", "minimal keyword with strike-through", "approximate"),
    "txtfx-8": ("Red serif TXTFX with purple script \"Song lyrics\" overlay, blur-glow.", "serif caps blur in, purple script writes over", "dramatic serif title", "approximate"),
    "untitled": ("Identical to text-14.", "see text-14", "alias", "approximate"),
}


def key(slug):
    return slug.replace("hooks-captions-", "").replace("premium-text-copy-of-", "")


def main():
    root = Path("skills/motion-templates")
    meta = json.loads(Path("out/templates_meta.json").read_text())
    L = [
        "# Replicated templates: visual catalog",
        "",
        f"{len(meta)} templates are implemented in `src/templates/` (Remotion). Use one as a b-roll item:",
        "",
        "```json",
        '{"id":"hook","kind":"template","at":0.2,"duration":3,"template":"hooks-captions-caption-02",',
        ' "texts":["Life is","shorter","than","your reality"],"colors":["#FFFFFF","#00FFD7","#FFFFFF","#F0FF00"],',
        ' "x":0,"y":-500,"scale":0.8,"speed":1}',
        "```",
        "",
        "- `texts` / `colors` override the defaults below by index (omit to keep defaults). `x`,`y` are canvas px offsets, `scale` multiplies, `speed` retimes.",
        "- Caption/Hook comps are 1080x1920 (portrait, text sits in the lower-middle of the frame by default: move with `y`). Premium comps are 1920x1080: they are fitted to the canvas width and centred, so they read small; use `scale` 1.3-1.8 and set `y`.",
        "- Header treatment (keeps a template readable over footage): `bg` = illustration photo (pick a relevant one via find-assets / Pexels; frame the subject with `bgFocus`, e.g. \"30% 45%\"), `icon` = flat svg (top-right), `scrim` 0-1 + `scrimHeight` px + `solidHeight` px (fully opaque part, use it to hide a baked-in overlay before the long soft fade). Example: `\"bg\":\"projects/x/assets/photos/a.jpg\",\"icon\":\"projects/x/assets/icons/trend-up.svg\",\"scrim\":0.85,\"scrimHeight\":1100`.",
        "- Graphics should paraphrase, not repeat, the captions: short label + one big word. Slots overflow if a word is too long (big line <= ~8 chars, yellow line <= ~10 chars in the Caption 01 / 02 layouts); use \"\" for unused lines.",
        "- Template time starts at the item's `at`; the animation is mostly in the first 0.5-1.5 s, then it holds. Set `duration` to the beat length and cut with the speech.",
        "- Each section: `look` = what it is, `motion` = how it enters, `use` = when to pick it, then the code defaults. Images are our own render (6 frames across the clip; premium ones are cropped to the text band).",
        "- Quality: `ok` = layout and timing checked against the original preview; `approximate` = looks right in our render but glow, light-sweep, scatter or 3D were simplified, and the original was not compared frame by frame.",
        "- Fonts are Google substitutes (Inter for NHaas Grotesk, Anton for Impact, Pacifico/Dancing Script for scripts, Michroma for Akira, Playfair Display for Playfair).",
        "",
    ]
    fam = {"caption": [], "hook": [], "premium": []}
    for t in meta:
        k = key(t["slug"])
        fam["caption" if k.startswith("caption") else "hook" if k.startswith("hook") else "premium"].append(t)
    titles = {"caption": "Caption pack (portrait, 10 s, multi-line statement captions)", "hook": "Hook pack (portrait, 5-6 s, opening hooks)", "premium": "Premium text pack (landscape comps, 2-5 s, title / lyric cards)"}
    for f, items in fam.items():
        L += [f"## {titles[f]}", ""]
        for t in items:
            look, motion, use, q = D.get(key(t["slug"]), ("(no descriptor)", "", "", "approximate"))
            L += [
                f"### `{t['slug']}` — {t['name']}",
                f"![{t['name']}](replicas/{t['slug']}.png)",
                f"- look: {look}",
                f"- motion: {motion}",
                f"- use: {use}",
                f"- quality: {q}",
                f"- defaults: texts {json.dumps(t['texts'], ensure_ascii=False)}; colours {json.dumps(t['colors'])}; fonts {', '.join(t['fonts'])}; comp {t['w']}x{t['h']} @{t['fps']}fps, {t['durationSec']}s",
                f"- original spec: `templates/{t['slug']}.md`",
                "",
            ]
    (root / "CATALOG.md").write_text("\n".join(L))
    print("CATALOG.md:", len(meta), "templates")


if __name__ == "__main__":
    main()
