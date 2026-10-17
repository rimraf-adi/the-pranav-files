import { z } from "zod";

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
