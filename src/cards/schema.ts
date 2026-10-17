// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/SKILL.md (Step 6 storyboard card fields, zones). Re-implemented for Remotion.
import { z } from "zod";

export const CARD_STYLES = ["academic", "editorial", "minimal", "spotlight", "geom", "whiteboard", "audit", "terminal", "swiss", "xhs", "media"] as const;
export const CARD_LAYOUTS = ["split", "stack", "pip", "overlay"] as const;
export const CARD_FRAMES = ["clean", "hairline", "polaroid"] as const;
export const CARD_ZONES = ["fullscreen", "whiteboard-area", "lower-third", "side-panel", "video-overlay"] as const;

export const cardData = z.object({
  value: z.string().optional().describe("literal big value, e.g. '7.2%'"),
  from: z.number().optional().describe("with `to`: count-up from..to"),
  to: z.number().optional(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  decimals: z.number().int().min(0).max(2).default(0),
  label: z.string().default(""),
});

export const cardContent = z.object({
  kicker: z.string().default(""),
  title: z.string().default("").describe("wrap words in *asterisks* to highlight them"),
  detail: z.string().default(""),
  quote: z.string().optional(),
  list: z.array(z.string()).max(6).optional(),
  data: cardData.optional(),
  media: z.array(z.object({ src: z.string(), word: z.string().default("") })).max(8).optional().describe("style 'media': b-roll shots filling the card, split evenly over its duration"),
  tag: z.string().default("").describe("small meta string: timecode / @handle / stamp text, per style"),
});

export const card = z.object({
  id: z.string(),
  at: z.number().min(0).describe("start on OUTPUT timeline, seconds"),
  duration: z.number().min(1.5).max(60).default(5),
  style: z.enum(CARD_STYLES).default("minimal"),
  layout: z.enum(CARD_LAYOUTS).default("stack"),
  frame: z.enum(CARD_FRAMES).default("clean"),
  accentIndex: z.number().int().min(0).max(4).default(0),
  zone: z.enum(CARD_ZONES).optional().describe("default comes from the layout"),
  content: cardContent.default({ kicker: "", title: "", detail: "", tag: "" }),
  frameLabel: z.string().default("").describe("polaroid caption"),
  hideCaptions: z.boolean().default(true),
});

export const cardPalette = z.object({
  themeId: z.enum(["classic", "noir", "mint", "craft", "slate", "mono"]).default("noir"),
});

export type Card = z.infer<typeof card>;
export type CardContent = z.infer<typeof cardContent>;
export type CardStyleKey = (typeof CARD_STYLES)[number];
export type CardLayout = (typeof CARD_LAYOUTS)[number];
export type CardFrame = (typeof CARD_FRAMES)[number];
export type CardZone = (typeof CARD_ZONES)[number];
