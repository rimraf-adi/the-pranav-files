import { z } from "zod";
import { card, cardPalette } from "../cards/schema";

// All times are seconds on the OUTPUT timeline (after cuts), except
// segments[].from/to which are seconds in the SOURCE video.

export const tone = z
  .enum(["attention", "positive", "process", "neutral"])
  .describe(
    "red=attention/number/negative, green=positive, cyan=process/steps, white=neutral",
  );

export const word = z.object({
  text: z.string(),
  start: z.number().min(0),
  end: z.number().min(0),
  emphasis: z.boolean().default(false),
});

export const segment = z.object({
  from: z.number().min(0),
  to: z.number().min(0),
});

// A cut starts a new "shot": camera scale resets and the slow push-in restarts.
export const cut = z.object({
  at: z.number().min(0),
  scale: z.number().min(1).max(1.6).default(1),
  originY: z.number().min(0).max(1).default(0.4),
});

const brollBase = {
  id: z.string(),
  at: z.number().min(0).describe("start on OUTPUT timeline, seconds"),
  duration: z.number().min(0.8).max(12),
  tone: tone.default("attention"),
};

export const shot = z.object({
  src: z.string().describe("image path relative to /public"),
  word: z.string().default("").describe("one-word caption shown while this shot is up"),
  focus: z.string().default("50% 50%").describe("CSS object-position for the 9:16 crop, e.g. '58% 50%' to keep a subject right of center"),
});

/** optional photo behind a top-zone motion graphic (darkened, slow push) */
const zoneBg = z.string().optional().describe("photo path relative to /public");

// Add a new kind here + a renderer in src/components/Broll.tsx
export const broll = z.discriminatedUnion("kind", [
  z.object({
    ...brollBase,
    kind: z.literal("stat"),
    label: z.string(),
    from: z.number(),
    to: z.number(),
    prefix: z.string().default(""),
    suffix: z.string().default(""),
    decimals: z.number().int().min(0).max(2).default(0),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("keyword"),
    text: z.string(),
    sub: z.string().default(""),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("image"),
    src: z.string().describe("photo path relative to /public"),
    label: z.string().default(""),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("montage"),
    shots: z.array(shot).min(1).max(8).describe("full-bleed shots, one per spoken noun; duration is split evenly; one shot = a single full-bleed cutaway"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("product"),
    variant: z.enum(["phone", "logo"]).default("phone"),
    src: z.string().describe("screenshot (phone) or logo (logo), relative to /public"),
    words: z.array(z.string()).max(12).default([]).describe("held one-word captions above the product, split evenly"),
    from: z.string().default("#5c1a2e").describe("gradient top color"),
    to: z.string().default("#1c0610").describe("gradient bottom color"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("lowerThird"),
    title: z.string(),
    sub: z.string().default(""),
    placement: z.enum(["lower", "top"]).default("lower").describe("top = name card in the top zone, clear of the face"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("chart"),
    title: z.string().default(""),
    chartType: z.enum(["bar", "line"]).default("bar"),
    items: z.array(z.object({ label: z.string(), value: z.number() })).min(2).max(6),
    unit: z.string().default("").describe("suffix shown after values, e.g. %"),
    highlight: z.number().int().min(0).optional().describe("index of the item drawn in the accent color"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("map"),
    title: z.string().default(""),
    regions: z.array(z.string()).default([]).describe("country names from public/shared/world-110m.geojson to highlight"),
    pins: z.array(z.object({ label: z.string(), lon: z.number(), lat: z.number() })).default([]),
    focus: z.array(z.number()).length(4).optional().describe("[lonMin, latMin, lonMax, latMax]; default whole world"),
  }),
  // Top-zone motion graphics (src/components/Motion.tsx). Times inside are seconds RELATIVE to `at`.
  z.object({
    ...brollBase,
    kind: z.literal("trend"),
    bg: zoneBg,
    plan: z.string().describe("label of the expected direction (dashed line going down)"),
    planSub: z.string().default(""),
    real: z.string().describe("label of what actually happened (red line snapping up)"),
    realSub: z.string().default(""),
    flipAt: z.number().min(0).describe("when the red line breaks upward"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("ticker"),
    bg: zoneBg,
    label: z.string(),
    from: z.number().optional().describe("omit to roll in from zeros"),
    to: z.number(),
    stepAt: z.number().min(0).default(0.3).describe("when the digits roll to `to`"),
    prefix: z.string().default(""),
    suffix: z.string().default(""),
    decimals: z.number().int().min(0).max(2).default(0),
    chip: z.string().default("").describe("change chip shown after the step, e.g. +0.25"),
    line: z.enum(["step", "none"]).default("step"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("votes"),
    bg: zoneBg,
    yes: z.number().int().min(1).max(24),
    no: z.number().int().min(0).max(24).default(0),
    label: z.string().default(""),
    verdict: z.string().default(""),
    resultAt: z.number().min(0).describe("when the score appears; seats fill before it"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("gauge"),
    bg: zoneBg,
    label: z.string(),
    value: z.number(),
    target: z.number().optional(),
    max: z.number().positive(),
    unit: z.string().default(""),
    valueAt: z.number().min(0).describe("bar lands on value here, then strains (stuck)"),
    targetAt: z.number().min(0).default(0),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("template"),
    template: z.string().describe("slug of a replicated template in src/templates (see skills/motion-templates/INDEX.md)"),
    texts: z.array(z.string()).default([]).describe("override the template's text items, in order"),
    colors: z.array(z.string()).default([]).describe("override the template's colour controls, in order (#RRGGBB)"),
    x: z.number().default(0).describe("offset in canvas px"),
    y: z.number().default(0).describe("offset in canvas px"),
    scale: z.number().min(0.1).max(4).default(1),
    speed: z.number().min(0.25).max(4).default(1),
    bg: z.string().optional().describe("illustration photo behind the template, path relative to /public; darkened and faded out softly toward the bottom"),
    fadeIn: z.number().min(0).max(1).default(0.27).describe("seconds to fade the header in (0 = instant, use it when hiding a baked-in overlay from frame 0)"),
    bgBrightness: z.number().min(0.2).max(1).default(0.66).describe("brightness of the bg photo (lower = darker, more legible text)"),
    bgFocus: z.string().default("50% 50%").describe("CSS object-position for the bg photo, e.g. '30% 40%' to keep the subject in the header"),
    icon: z.string().optional().describe("flat icon (svg) shown top-right of the header, path relative to /public"),
    scrim: z.number().min(0).max(1).default(0).describe("dark top gradient behind the template, hides baked-in overlays and lifts legibility"),
    solidHeight: z.number().min(0).max(1920).default(0).describe("px kept fully opaque at the top before the soft fade starts (0 = 40% of scrimHeight); use it to hide a baked-in overlay"),
    scrimHeight: z.number().min(100).max(1920).default(760).describe("scrim height in canvas px"),
  }),
  z.object({
    ...brollBase,
    kind: z.literal("flow"),
    bg: zoneBg,
    nodes: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          value: z.string().default("").describe("digits roll in, e.g. $100"),
          sub: z.string().default(""),
          at: z.number().min(0),
          tone: tone.default("neutral"),
          arrow: z.enum(["up", "down", "none"]).default("none"),
          row: z.number().int().min(0).max(1).default(0),
          from: z.string().optional().describe("id of the node this one is caused by (draws an edge)"),
        }),
      )
      .min(2)
      .max(6),
  }),
]);

export const timeline = z.object({
  fps: z.number().default(30),
  width: z.number().default(1080),
  height: z.number().default(1920),
  source: z
    .string()
    .describe("path relative to /public, e.g. projects/demo/raw/clip.mp4"),
  segments: z.array(segment).min(1),
  words: z.array(word).default([]),
  cuts: z.array(cut).default([]),
  sfx: z
    .array(
      z.object({
        at: z.number().min(0).describe("OUTPUT-timeline seconds"),
        src: z.string().describe("audio path relative to /public"),
        volume: z.number().min(0).max(1).default(0.3),
      }),
    )
    .default([])
    .describe("sound design under the voice: whooshes on photo cuts, ticks/pops on graphic beats"),
  broll: z.array(broll).default([]),
  cards: z
    .array(card)
    .default([])
    .describe("talking-head-recut takeaway cards: video animates into the layout bounds while a card shows"),
  cardPalette: cardPalette.default({ themeId: "noir" }),
  captionTheme: z
    .object({
      name: z
        .string()
        .describe("theme DNA id from src/themes/dna, e.g. anchor, stomp, vhs"),
      hero: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("index into words[] of the climax word; default auto"),
    })
    .optional()
    .describe("when set, this theme replaces the default captions"),
  subject: z
    .string()
    .optional()
    .describe(
      "speaker-cutout alpha video (webm) path relative to /public; enables text-behind-subject",
    ),
  headroomPercent: z
    .number()
    .min(0)
    .max(20)
    .default(9)
    .describe("push footage down to free the title zone"),
  pushInPercent: z.number().min(0).max(15).default(6),
  style: z.string().default("default"),
});

export type Timeline = z.infer<typeof timeline>;
export type Cut = z.infer<typeof cut>;
export type Broll = z.infer<typeof broll>;
export type Word = z.infer<typeof word>;
export type Tone = z.infer<typeof tone>;

export const totalSeconds = (t: Pick<Timeline, "segments">) =>
  t.segments.reduce((s, g) => s + (g.to - g.from), 0);
