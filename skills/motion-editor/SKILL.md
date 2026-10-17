---
name: motion-editor
description: Root entry skill for this Remotion motion-editor repo. Use first for any request to edit, restyle, caption, add b-roll to, or render a talking-head reel. Routes to the right sub-skill and tells Claude Code, Codex or Antigravity how skills are discovered here.
---

# motion-editor (root skill)

You edit **data** (`public/projects/<name>/timeline.json`, `transcript.json`); Remotion renders it. Read `AGENTS.md` for the hard rules.
This skill only routes. Open the sub-skill's `SKILL.md` BEFORE acting; do not work from this summary.

## Routing table
| The request is about... | Open | Notes |
|---|---|---|
| Whole pipeline, raw footage to reel | `skills/edit-workflow/SKILL.md` | ordered steps, commands |
| Visual style (titles, captions, grade, motion) | `skills/style-gadzhi/SKILL.md`, `styles/*.json` | no zoom spam: punchIn is off by default |
| Which b-roll for which spoken beat | `skills/broll-director/SKILL.md` | planning layer |
| Beat table -> timeline JSON | `python scripts/beats_to_timeline.py public/projects/<name> --validate` | spec syntax in the script docstring |
| Previewing/pasting/verifying b-roll | `skills/think-loop/SKILL.md` | perceive -> preview -> paste -> verify |
| Icons, photos, SFX, music (licensed) | `skills/find-assets/SKILL.md` | goes through `scripts/assets/` |
| Porting a HyperFrames caption theme | `skills/port-hyperframes-theme/SKILL.md` | touches `src/themes/` only |
| Subject matte / blurred dark background | `python scripts/treat_bg.py --setup`, then `treat_bg.py <video> <project_dir>` | outputs `matte.mp4`, `base_bg.mp4` (drop-in source) |

## Typical order
transcribe -> build_timeline -> style pass (`edit-workflow`) -> beat sheet (`broll-director`) -> preview/paste (`think-loop`)
-> optional background treatment -> half-scale render + contact sheet -> final render.
Comparing looks: copy the timeline to `public/projects/<name>/variants/<variant>.json`, change style/theme/source only, render each.

## How agents find these skills (run once after cloning)
Canonical skills are in `skills/` (agent-agnostic). Run:
```bash
python scripts/link_skills.py        # python3 on macOS/Linux; add --copy if symlinks are unavailable
```
It links every `skills/<name>/` into the folder each tool reads:
- Claude Code: `.claude/skills/<name>/SKILL.md`
- Codex CLI: `.agents/skills/<name>/SKILL.md` (also read by other agents)
- Antigravity: `.agent/skills/<name>/SKILL.md`
These folders are generated and gitignored; edit only `skills/`. Tools that read only `AGENTS.md` (Cursor, etc.) are pointed here from it.
Restart the agent session after the first link, since newly created skill folders are not picked up live.

## Rules that apply everywhere
- Edits touch only `public/projects/<name>/` unless the task is explicitly "new effect/scene" (then `src/components/`, `src/schema/timeline.ts`, `npm run lint`).
- Captions: Roman Hinglish, never Devanagari. Never hardcode style values in components. Secrets only in `.env`; never print or commit.
- Never invent facts or numbers on cards; license-check assets (`scripts/assets/license_check.py`) before shipping.

## Working agreements (every agent: Claude Code, Codex, Antigravity)
1. **Preview before the expensive render.** Order: schema/lint check -> stills for new b-roll/cards -> half-scale render
   (`--scale=0.5`) -> `scripts/contact_sheet.sh` -> LOOK at the PNG -> only then the full-resolution render.
   Anything that re-lays out the video (takeaway cards, split/pip layouts) MUST be seen in a contact sheet first.
2. **Never `pkill`/`killall` renders.** Other agents may be rendering in this repo. Stop only your own process, matched by
   your unique output filename (`pkill -f "my_output.mp4"`), or let it finish.
3. **One writer per file.** Check `git status` before editing; do not touch files another running session owns
   (`src/themes/**` ports, `src/cards/**`). Never move or delete shared paths (`styles/`, `out/`, `scripts/`) mid-session.
4. **No zoom by default.** `pushInPercent: 0`, `cuts[].scale: 1`. Add motion only when the user asks.
5. **Edit data, not code**, unless the task is a new scene/effect. Keep experiments in `public/projects/<name>/variants/`
   and delete them when done; derived videos (matte, base_bg, subject) live outside `public/`.
6. **Renders go to `public/renders/` (gitignored).** Never commit renders, `.env`, or `.venv*`.
7. **Report honestly**: what rendered, what you inspected, what you did not check, and any broken files you noticed but did not own.
8. **Clean up what you start**: temp files, background renders, test timelines. Archive finished helper sessions (never delete without asking).
