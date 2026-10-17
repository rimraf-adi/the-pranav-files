---
name: find-assets
description: Find, download and license-check copyright-safe icons, b-roll photos, SFX and music for a project. Use when a title needs an icon, a b-roll cutaway needs a photo, or a cut needs a whoosh/pop/riser.
---

# find-assets

Plain CLIs in `scripts/assets/` (Python 3 stdlib, HTTP through `curl`). Everything lands in
`public/projects/<project>/assets/` with a `manifest.json` provenance record.
Normal edits touch only `public/projects/<project>/`; do not hand-copy files in there, always go through `fetch.py`.

## Loop

```bash
# 1. search (JSON list on stdout; disallowed licenses are already dropped)
python3 scripts/assets/search.py "account tie" --type icon --limit 8 > /tmp/r.json
# 2. look at preview_url / title / license / width, pick one, download
python3 scripts/assets/fetch.py /tmp/r.json demo --index 0 --color '#FFFFFF' --name client
# 3. audit before render/ship (non-zero exit = do not ship)
python3 scripts/assets/license_check.py demo
```

`fetch.py` prints the path to put in `timeline.json`. Shortcuts: `fetch.py ph:bank-fill demo --color '#FFF'`
(Iconify id), or pipe: `search.py ... | fetch.py - demo --index 0`.
Use `--id <id>` instead of `--index` to pick by id. `--dry-run` shows what would be saved.

## Which source for what

| Need | Command | License | Key |
|---|---|---|---|
| Flat icon | `--type icon` (Iconify, default) | MIT / ISC / Apache-2.0 sets only | none |
| Photo, no-key | `--type photo` (Openverse, default) | CC0 / PDM | none |
| Photo, best quality for named places/buildings/people-free landmarks | `--type photo --source wikimedia` | per file; PD / CC0 pass, CC-BY(-SA) needs `--allow-attribution` | none |
| Generic stock photo (offices, screens, cities) | `--source pexels` or `pixabay` | their own licenses | `PEXELS_API_KEY` / `PIXABAY_API_KEY` |
| SFX (whoosh, pop, riser, impact) | `--type sfx` (Openverse, default) | CC0 | none |
| SFX/music, more choice | `--type sfx\|music --source freesound` | CC0 (CC-BY with flag) | `FREESOUND_API_KEY` |
| Everything usable for a type | `--source all` | mixed | missing keys are skipped with a note |

Keys come from the environment or `./.env` (gitignored; names in `.env.example`). Never print or commit them.
A keyed source without its key prints how to get one and exits; use a no-key source instead.

### Query tips
- Icons: Iconify search is name based. Say the noun, not the idea: `client` finds nothing useful, try `account tie`
  (person in suit), `bank`, `chart line`/`trending up`, `fire`, `cash`/`currency usd`, `alert`/`warning`, `rocket`.
  Compare 2-3 sets (`--sets ph,lucide`); stick to one set per video so stroke weight matches. Prefer `-fill`/solid
  variants for small icons beside text. `--sets` accepts any Iconify prefix, but non-allowlisted licenses are rejected at fetch.
- Photos: name the specific thing (`federal reserve building`, `oil refinery`), then try Wikimedia (`Eccles Building
  federal reserve`) for sharper originals. Use `--min-width 1600` for full-frame b-roll and `--orientation portrait` when the
  reel is 1080x1920. Openverse images are often Flickr 500-1024px: fine for a small card, soft full-bleed.
- SFX: `whoosh`, `swoosh`, `pop`, `riser`, `impact`, `click`. Check `duration` in the result (SFX search is limited to short clips).

## License rules (enforced in code, `scripts/assets/common.py`)
- **Allowed, no credit:** `cc0`, `pdm`, `public-domain`, `mit`, `isc`, `apache-2.0`, `0bsd`, `unlicense`,
  plus `pexels` and `pixabay` (their own licenses, see caveats).
- **Allowed only with `--allow-attribution`:** `cc-by`, `cc-by-sa`. The manifest then stores a `credit` line you MUST show
  (video description or on-screen). Avoid `cc-by-sa` in video: share-alike may extend to the finished work.
- **Always refused:** any `-nc`, `-nd`, unknown/missing license, all-rights-reserved, GFDL-only, MPL, OFL.
- `fetch.py` re-checks the license against the source API (not the search JSON), only downloads over https from the
  source's own hosts, and refuses raw URLs. `license_check.py` fails on unknown license, attribution without credit,
  missing source_url, files missing from the manifest, or files modified after download.
- MIT/ISC/Apache icons: free to use, but the notice is meant to travel with the work; `license_check.py --credits`
  writes `assets/CREDITS.md` for the video description/repo.
- Never remove or edit manifest entries to make the check pass; re-fetch instead.

### Caveats worth knowing
- **Iconify**: one API, many sets, each with its own license (checked per set via `/collections`). Many popular sets are
  CC-BY (Font Awesome 6, Streamline, Basil, Pixel) or MPL/OFL; they are excluded by default.
- **Openverse**: search aggregator; the license is metadata from the upstream provider (Flickr, Wikimedia, Freesound...).
  Anonymous limit seen in headers: 20 req/min, 200 req/day. Audio `download_url` is Freesound's HQ mp3 *preview*.
- **Wikimedia Commons**: license is per file; Commons vets copyright only. Trademarks, logos in frame, and identifiable
  people can still carry non-copyright restrictions (see the `notes` field). No logos or recognizable faces in b-roll.
  Needs a descriptive User-Agent (set in code).
- **Pexels**: free commercial use, no attribution required; not allowed: identifiable people shown in a bad light,
  implying endorsement by people/brands in the image, reselling unaltered. API needs a link-back to Pexels when you
  *display* API results in an app (not relevant for a downloaded asset); credit is stored in the manifest anyway.
  Limit 200 req/hour.
- **Pixabay**: Pixabay Content License (not CC0). No standalone resale, brands/logos/recognizable people need care.
  Its API docs page rate-limited (HTTP 429) every fetch I made, so the API rate limit and caching terms were **not**
  verified from the official page; keep requests few. Audio is not implemented for Pixabay.
- **Freesound**: per-sound license; the code requests only CC0 (plus CC-BY with the flag) and refuses `-nc`. API token is
  enough for the HQ mp3 preview; original WAV needs OAuth2 and is not used. 60 req/min, 2000/day.

## Using an asset in timeline.json
All paths are relative to `public/` (the same convention as `source`) and the renderer wraps them in `staticFile()`.
`fetch.py` prints exactly this string, and it is the `file` field in `manifest.json`.

```json
{"titles":[{"id":"t1","at":2.0,"lines":[
  {"text":"CLIENT","level":"primary","icon":"projects/demo/assets/icons/client.svg"}]}],
 "broll":[{"id":"b1","kind":"image","at":5.0,"duration":2.5,
  "src":"projects/demo/assets/photos/federal-reserve-eccles.jpg","label":"THE FED"}]}
```

- `titles[].lines[].icon` takes an SVG; fetch with `--color` matching the title tone (white `#FFFFFF` on dark grade).
- `broll[].src` (kind `image`) takes a photo.
- SFX/music have no field in `src/schema/timeline.ts` yet. Files can be fetched (`assets/sfx/`, `assets/music/`) but
  wiring them in is a separate task (new schema field + component), per AGENTS.md rules.
- Preview a candidate before pasting: `scripts/preview_broll.py` (see `skills/think-loop`).

## Done checklist
1. `license_check.py <project>` exits 0.
2. Every attribution-required entry has its credit shown somewhere.
3. Run `license_check.py <project> --credits` and keep `assets/CREDITS.md` with the project.
