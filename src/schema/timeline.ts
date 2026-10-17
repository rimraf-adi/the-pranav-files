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

export const titleLine = z.object({
  text: z.string(),
  level: z.enum(["primary", "secondary", "modifier"]).default("primary"),
  tone: tone.optional().describe("overrides the title tone for this line"),
  italic: z.boolean().default(false),
  icon: z
    .string()
    .optional()
    .describe("path relative to /public, shown after the text"),
});

export const title = z.object({
  id: z.string(),
  at: z.number().min(0),
  duration: z.number().min(0.8).max(3.5).default(1.8),
  tone: tone.default("neutral"),
  lines: z.array(titleLine).min(1).max(4),
});

// A cut starts a new "shot": camera scale resets, slow push-in restarts, optional light leak.
export const cut = z.object({
  at: z.number().min(0),
  scale: z.number().min(1).max(1.6).default(1),
  originY: z.number().min(0).max(1).default(0.4),
  leak: z.boolean().default(true),
});

const brollBase = {
  id: z.string(),
  at: z.number().min(0).describe("start on OUTPUT timeline, seconds"),
  duration: z.number().min(0.8).max(6),
  tone: tone.default("attention"),
  leak: z.boolean().default(false).describe("light leak on entry and exit"),
};

export const shot = z.object({
  src: z.string().describe("image path relative to /public"),
  word: z.string().default("").describe("one-word caption shown while this shot is up"),
});

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
    shots: z.array(shot).min(2).max(8).describe("one full-bleed shot per spoken noun; duration is split evenly"),
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
  titles: z.array(title).default([]),
  cuts: z.array(cut).default([]),
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
  grade: z.boolean().default(true),
  dust: z.boolean().default(true),
  style: z.string().default("gadzhi"),
});

export type Timeline = z.infer<typeof timeline>;
export type Title = z.infer<typeof title>;
export type Cut = z.infer<typeof cut>;
export type Broll = z.infer<typeof broll>;
export type Word = z.infer<typeof word>;
export type Tone = z.infer<typeof tone>;

export const totalSeconds = (t: Pick<Timeline, "segments">) =>
  t.segments.reduce((s, g) => s + (g.to - g.from), 0);
