import type React from "react";
import { z } from "zod";
import type { Word } from "../schema/timeline";

/**
 * Theme DNA: a JSON "visual constitution" ported from heygen-com/hyperframes
 * (skills/embedded-captions/themes/*.json, Apache-2.0, see THIRD_PARTY/hyperframes).
 * Only identity fields are validated; paradigm/setpiece-specific params pass through.
 */
export const themeDNA = z
  .object({
    name: z.string(),
    voice: z.string().optional(),
    when: z.string().optional(),
    register: z.string().optional(),
    fonts: z.record(z.string(), z.string()).default({}),
    palette: z.record(z.string(), z.any()).default({}),
    body: z
      .object({
        paradigm: z.string(),
        layer: z.enum(["fg", "bg"]).default("fg"),
      })
      .passthrough(),
    hero: z.object({ setpiece: z.string() }).passthrough().optional(),
    fx: z.record(z.string(), z.any()).default({}),
    plate: z.record(z.string(), z.any()).default({}),
    linkages: z.array(z.string()).default([]),
  })
  .passthrough();

export type ThemeDNA = z.infer<typeof themeDNA>;

/** One displayed line of transcript. Times are OUTPUT-timeline seconds. */
export type Line = { index: number; words: Word[]; start: number; end: number };
/** The climax ("apex") word the theme's hero set piece choreographs around. */
export type Hero = { index: number; text: string; start: number; end: number };

export type ThemeCtx = {
  dna: ThemeDNA;
  words: Word[];
  lines: Line[];
  hero?: Hero;
};

/** Renders the transcript surface. Pure function of useCurrentFrame(). */
export type Paradigm = {
  Component: React.FC<ThemeCtx>;
  /** hero word stays inside `lines` (inline set pieces) instead of being owned by the set piece */
  heroInline?: boolean;
};

/** Climax choreography. Behind = under the subject cutout, Front = over everything. */
export type Setpiece = {
  Behind?: React.FC<ThemeCtx & { hero: Hero }>;
  Front?: React.FC<ThemeCtx & { hero: Hero }>;
  inline?: boolean;
};
