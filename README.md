# Motion editor

An agent-driven video editor for talking-head reels, built on [Remotion](https://www.remotion.dev).
You edit **data** (`timeline.json`); Remotion renders it. Any coding agent (Claude Code, Codex, Antigravity, Cursor) can drive it.

## Quick start

Requirements: Node 22+, Python 3.10+, `ffmpeg` and `ffprobe` on PATH. Works on macOS, Linux and Windows.

```console
npm i --loglevel=error
cp .env.example .env                 # add GROQ_API_KEY (transcription); never commit .env
python scripts/tools/link_skills.py        # make skills discoverable by your agent (see Agent setup)
npm run dev                          # Remotion Studio
```

## Pipeline

```console
python scripts/pipeline/transcribe.py <video> public/projects/<name>/transcript.json
python scripts/pipeline/build_timeline.py public/projects/<name> projects/<name>/raw/<file>
# edit public/projects/<name>/timeline.json (emphasis, b-roll, cards)
npx remotion render Reel public/renders/<name>.mp4 --props=public/projects/<name>/timeline.json --scale=0.5
scripts/pipeline/contact_sheet.sh public/renders/<name>.mp4 public/renders/<name>_sheet.png   # look at it
npx remotion render Reel public/renders/<name>.mp4 --props=public/projects/<name>/timeline.json   # final, scale 1
```

Always preview at half scale and inspect the contact sheet before the full render.

## Layout

Full map and data flow: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

| Path | Contents |
|---|---|
| `src/` | Remotion renderer: `components/`, `schema/timeline.ts` (the contract), `themes/` (32 caption themes), `templates/` (43 replicated motion templates), `cards/` |
| `public/projects/<name>/` | one video: `raw/`, `timeline.json`, `transcript.json`, `moments.json`, `beats.md`, `assets/`, `variants/` |
| `edit-styles/` | reusable edit styles (formal, bold, editorial, clean) as data |
| `skills/` | agent playbooks; start at `skills/motion-editor/SKILL.md` |
| `scripts/` | `pipeline/`, `edit_styles/`, `templates/`, `themes/`, `assets/`, `background/`, `tools/` |
| `editor/` | Next.js timeline GUI |
| `library/` | third-party packs (gitignored) |
| `styles/` | neutral renderer tokens |

## Edit styles

```console
python3 scripts/edit_styles/apply_style.py public/projects/<name> formal      # -> variants/formal.json
python3 scripts/edit_styles/compare_styles.py public/projects/<name>          # all styles side by side (2x2)
```

Styles are data (`edit-styles/*.json`) with a skill each (`skills/style-*`); the video-specific plan is `moments.json`. See `skills/edit-styles/SKILL.md`.

## Features

- **Captions:** Roman-script Hinglish captions, 25 HyperFrames-style caption themes.
- **Motion templates:** 43 replicated After Effects / Premiere text templates usable as `{"kind":"template"}` b-roll (catalog in `skills/motion-templates/CATALOG.md`).
- **B-roll:** `stat`, `keyword`, `image`, `montage` (word-by-word shots) and `product` (phone mockup or logo on a gradient), plus takeaway **cards** (11 styles incl. `media` for b-roll on top with the speaker below; 4 layouts).
- **Plan as markdown:** write `public/projects/<name>/beats.md` and run `python scripts/pipeline/beats_to_timeline.py public/projects/<name> --validate` to generate the `broll` and `cards` entries.
- **Assets:** copyright-safe icons, photos and SFX via `scripts/assets/` with license checking.
- **Background treatment (optional):** speaker matte and a blurred, darkened background, same resolution, fps and audio.

```console
python scripts/background/treat_bg.py --setup                       # one-time (~440MB of Python deps, own venv)
python scripts/background/treat_bg.py <video> <project_dir>         # writes matte.mp4 and base_bg.mp4
```

## Agent setup (Claude Code, Codex, Antigravity, others)

`skills/` is the single source of truth and `AGENTS.md` holds the rules. Run `python scripts/tools/link_skills.py` once after cloning
(use `python3` on macOS/Linux; add `--copy` if symlinks are unavailable, e.g. Windows without Developer Mode), then restart the agent
so it picks up the new skill folders. Every agent starts from the root skill, `skills/motion-editor/SKILL.md`.

| Agent | Reads rules from | Reads skills from | Setup |
|---|---|---|---|
| Claude Code | `AGENTS.md` (add `CLAUDE.md` containing `@AGENTS.md` if you want it auto-loaded) | `.claude/skills/<name>/SKILL.md` | `link_skills.py`, restart `claude`; skills trigger by description or `/motion-editor` |
| Codex CLI | `AGENTS.md` (native) | `.agents/skills/<name>/SKILL.md` | `link_skills.py`, restart `codex`; confirm the path in the [Codex skills docs](https://developers.openai.com/codex/skills) |
| Antigravity | `AGENTS.md` | `.agent/skills/<name>/SKILL.md` (workspace scope) | `link_skills.py`, reopen the workspace; confirm in the Antigravity skills codelab |
| Cursor / others | `AGENTS.md` | none | tell the agent: "read skills/motion-editor/SKILL.md first, then the skill it routes to" |

The skill paths for Codex and Antigravity come from secondary sources and are not verified here. If an agent does not see the skills,
paste the prompt in the last row of the table; the skills are plain markdown and work without any linking.

Prompts that work in any agent:

```text
Read AGENTS.md and skills/motion-editor/SKILL.md. Then plan b-roll for public/projects/demo using skills/broll-director.
Preview before any full render and show me the contact sheet.
```

Keys: put `GROQ_API_KEY` (and any asset-source keys) in `.env`; agents must never print or commit it.
`link_skills.py` output folders (`.claude/skills`, `.agents/skills`, `.agent/skills`) are generated and gitignored; edit only `skills/`.

## Platform notes

| | macOS | Windows | Linux |
|---|---|---|---|
| Install ffmpeg | `brew install ffmpeg` | `winget install Gyan.FFmpeg` (restart the terminal) | `sudo apt install ffmpeg` (or your distro's package) |
| Python command | `python3` | `python` or `py -3` | `python3` |
| Link skills | `python3 scripts/tools/link_skills.py` | `python scripts\tools\link_skills.py --copy` (symlinks need Developer Mode or admin; re-run after editing a skill) | `python3 scripts/tools/link_skills.py` |
| Matte venv | `.venv-matte/bin/python` | `.venv-matte\Scripts\python.exe` | `.venv-matte/bin/python` |
| Matte install | `python3 scripts/background/treat_bg.py --setup` | `python scripts\background\treat_bg.py --setup` | `python3 scripts/background/treat_bg.py --setup` (CPU torch by default; add `--cuda` for the GPU build) |
| Google Antigravity | [download](https://antigravity.google/download) | [download](https://antigravity.google/download) (Windows 10+ 64-bit, x64 or ARM64) | [download](https://antigravity.google/download) (x64 or ARM64, glibc 2.28+, e.g. Ubuntu 20, Debian 10, Fedora 36) |

Antigravity reads project skills from `.agent/skills/` (created by `link_skills.py`). Pick your platform on the official
[download page](https://antigravity.google/download); versions and system requirements change, so check it before installing.
Skill authoring reference: [Authoring Google Antigravity Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills).
Windows tip: run the Python commands from PowerShell or Git Bash; shell scripts such as `scripts/pipeline/contact_sheet.sh` need Git Bash or WSL.

## Commands

```console
npm run dev        # Remotion Studio
npm run lint       # eslint + tsc
npx remotion render Reel <out.mp4> --props=<timeline.json> [--scale=0.5]
```

## Credits and licenses

Remotion has its own [license terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) (a company license may be needed).
Caption themes and cards are re-implemented from [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) (Apache-2.0); see `THIRD_PARTY/`.
The optional matte uses Robust Video Matting (check its license before commercial use). Asset licenses are recorded in each project's `assets/CREDITS.md`.
