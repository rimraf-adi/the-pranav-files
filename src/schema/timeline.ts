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

export const timeline = z.object({
  fps: z.number().default(30),
  width: z.number().default(1080),
  height: z.number().default(1920),
  source: z.string().describe("path relative to /public, e.g. projects/demo/raw/clip.mp4"),
  segments: z.array(segment).min(1),
  words: z.array(word).default([]),
  punchIns: z.array(punchIn).default([]),
  style: z.string().default("gadzhi"),
});

export type Timeline = z.infer<typeof timeline>;
export type Word = z.infer<typeof word>;

export const totalSeconds = (t: Pick<Timeline, "segments">) =>
  t.segments.reduce((s, g) => s + (g.to - g.from), 0);
