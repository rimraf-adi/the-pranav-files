# Motion editor

An agent-driven video editor for talking-head reels, built on [Remotion](https://www.remotion.dev).
You edit **data** (`timeline.json`); Remotion renders it. Any coding agent (Claude Code, Codex, Antigravity, Cursor) can drive it.

## Quick start

Requirements: Node 22+, Python 3.10+, `ffmpeg` and `ffprobe` on PATH. Works on macOS, Linux and Windows.

```console
npm i --loglevel=error
cp .env.example .env                 # add GROQ_API_KEY (transcription); never commit .env
python scripts/link_skills.py        # make skills discoverable by your agent (see Agent setup)
npm run dev                          # Remotion Studio
```

## Pipeline

```console
python scripts/transcribe.py <video> public/projects/<name>/transcript.json
python scripts/build_timeline.py public/projects/<name> projects/<name>/raw/<file>
# edit public/projects/<name>/timeline.json (emphasis, titles, b-roll, cards)
npx remotion render Reel public/renders/<name>.mp4 --props=public/projects/<name>/timeline.json --scale=0.5
scripts/contact_sheet.sh public/renders/<name>.mp4 public/renders/<name>_sheet.png   # look at it
npx remotion render Reel public/renders/<name>.mp4 --props=public/projects/<name>/timeline.json   # final, scale 1
```

Always preview at half scale and inspect the contact sheet before the full render.

## Layout

| Path | Contents |
|---|---|
| `src/` | Remotion code: `Root.tsx`, `components/` (Reel, Broll, Captions, TitleStack, Effects), `schema/timeline.ts` (zod schema), `themes/` (25 ported caption themes), `cards/` (takeaway card system) |
| `public/projects/<name>/` | `raw/` source clip, `timeline.json`, `transcript.json`, `beats.md`, `broll_candidates.json`, `assets/` (licensed icons, photos, SFX + manifest) |
| `public/renders/` | rendered videos and contact sheets (gitignored) |
| `styles/` | style definitions (`gadzhi.json`) |
| `scripts/` | Python CLIs: transcribe, build_timeline, analyze_media, preview_broll/cards/theme, assets/ (search, fetch, license check), matte + background blur, link_skills |
| `skills/` | agent playbooks; start at `skills/motion-editor/SKILL.md` |
| `AGENTS.md` | rules every agent follows |

## Features

- **Captions and titles:** Roman-script Hinglish captions, blur-in title stacks, 25 HyperFrames-style caption themes.
- **B-roll:** `stat`, `keyword`, `image`, `montage` (word-by-word shots) and `product` (phone mockup or logo on a gradient), plus takeaway **cards** (11 styles incl. `media` for b-roll on top with the speaker below; 4 layouts).
- **Plan as markdown:** write `public/projects/<name>/beats.md` and run `python scripts/beats_to_timeline.py public/projects/<name> --validate` to generate the `broll` and `cards` entries.
- **Assets:** copyright-safe icons, photos and SFX via `scripts/assets/` with license checking.
- **Background treatment (optional):** speaker matte and a blurred, darkened background, same resolution, fps and audio.

```console
python scripts/treat_bg.py --setup                       # one-time (~440MB of Python deps, own venv)
python scripts/treat_bg.py <video> <project_dir>         # writes matte.mp4 and base_bg.mp4
```

## Agent setup (Claude Code, Codex, Antigravity, others)

`skills/` is the single source of truth and `AGENTS.md` holds the rules. Run `python scripts/link_skills.py` once after cloning
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
