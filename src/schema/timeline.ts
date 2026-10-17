import { z } from "zod";

// All times are in seconds on the OUTPUT timeline (after cuts), except
// segments[].from/to which are seconds in the SOURCE video.

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

export const punchIn = z.object({
  at: z.number().min(0),
  duration: z.number().positive().default(1.2),
  scale: z.number().min(1).max(1.4).default(1.12),
});

const brollBase = {
  id: z.string(),
  at: z.number().min(0).describe("start on OUTPUT timeline, seconds"),
  duration: z.number().min(0.8).max(6),
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
  punchIns: z.array(punchIn).default([]),
  broll: z.array(broll).default([]),
  style: z.string().default("gadzhi"),
});

export type Timeline = z.infer<typeof timeline>;
export type Broll = z.infer<typeof broll>;
export type Word = z.infer<typeof word>;

export const totalSeconds = (t: Pick<Timeline, "segments">) =>
  t.segments.reduce((s, g) => s + (g.to - g.from), 0);
