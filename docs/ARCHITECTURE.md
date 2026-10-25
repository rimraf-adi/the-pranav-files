# Architecture

One idea: **you edit data, Remotion renders it.** Everything else is tooling around that.

```
the-pranav-files/
├─ AGENTS.md, README.md          rules for every agent; human quick start
├─ package.json, remotion.config.ts, tsconfig.json, eslint.config.mjs
│
├─ src/                          Remotion code (the renderer)
│  ├─ Root.tsx                   compositions: Reel, BrollPreview, TemplatePreview, CardPreview
│  ├─ components/                Reel (camera, segments, sfx), Broll + Motion + BrollScenes, Captions, TemplateScene, common
│  ├─ schema/timeline.ts         zod schema of timeline.json (the contract)
│  ├─ themes/                    32 caption themes: dna/*.json + paradigms + setpieces (registry is generated)
│  ├─ templates/                 43 replicated motion templates (+ ae.tsx toolkit; registry is generated)
│  ├─ films/engraving/           animated intro film (composition EngravingIntro): primitives + timeline
│  └─ cards/                     takeaway card system
├─ styles/default.json           neutral renderer tokens (fonts, tone colours, scene defaults)
│
├─ public/projects/<name>/       one folder per video: raw/ timeline.json transcript.json moments.json beats.md assets/ variants/
├─ public/renders/               rendered videos (gitignored)
│
├─ edit-styles/                  data: presets (formal, bold, editorial, clean) + template-slots.json
├─ skills/                       agent playbooks (flat; one folder each): pipeline skills + style-* skills + motion-templates
├─ scripts/
│  ├─ pipeline/                  transcribe, romanize, build_timeline, beats_to_timeline, analyze_media, previews, contact_sheet
│  ├─ edit_styles/               apply_style.py, compare_styles.py
│  ├─ templates/                 pack inspection + extraction -> skills/motion-templates, registry generator, template previews
│  ├─ themes/                    theme registry generator, theme previews
│  ├─ assets/                    licensed asset search / fetch / licence check (Pexels, Openverse, Iconify, ...)
│  ├─ background/                optional speaker matte + background blur (own venv)
│  └─ tools/                     link_skills.py
├─ editor/                       Next.js timeline GUI (reads the same schema)
├─ library/                      third-party packs (gitignored): zips/ as downloaded, extracted/ unpacked
├─ THIRD_PARTY/                  licences of ported code
└─ out/                          scratch (gitignored)
```

## Data flow
```
raw video ─ transcribe ─> transcript.json ─ build_timeline ─> timeline.json (cuts + words)
                                                      │
 moments.json (what graphic, when) + edit style ──────┤ apply_style.py
 b-roll beats.md ── beats_to_timeline ────────────────┤
                                                      ▼
                         variants/<style>.json  ──>  remotion render Reel --props=...  ──> public/renders/*.mp4
```

## Where does X go?
| Change | Place |
|---|---|
| A new look for edits | `edit-styles/<name>.json` + `skills/style-<name>/` (no code) |
| A new caption theme | `src/themes/dna/<name>.json` (+ paradigm/setpiece if new), `node scripts/themes/gen-theme-registry.mjs` |
| A new animated template | `src/templates/<slug>.tsx`, `node scripts/templates/gen-template-registry.mjs`, add to `edit-styles/template-slots.json` if styles should use it |
| A new b-roll kind | `src/schema/timeline.ts` + renderer in `src/components/`, then `npm run lint` |
| A new video | `public/projects/<name>/` only |
| A third-party pack | drop the zip in `library/zips/`, `python3 -I scripts/templates/assets_zip.py replicate library/zips library/extracted` |

## Generated, do not edit
`src/themes/registry.generated.ts`, `src/templates/registry.generated.ts`, `.claude|.agents|.agent/skills/` (from `link_skills.py`),
`skills/motion-templates/{templates,presets,replicas,thumbs,raw,INDEX.md,CATALOG.md}` (from the extract/catalog scripts).
