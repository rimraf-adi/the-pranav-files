// Replica of the "Hook 01" Premiere template (skills/motion-templates/templates/hooks-captions-hook-01.md).
// Text 01 (4 lines) slides in word by word, fades up, then blur/rotate-fades out; "Let's / start / the video."
// slide in from 2.08 / 2.2 / 2.36 s and shrink away at 3.28+. The mCloner media clones (Media 01-07) are empty by default.
import React from "react";
import { clamp01, lerp } from "./ae";
import { INTER, Lyr, SlideText, bz, kf, lines } from "./ae-hooks";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;
type L = {
  text: string;
  color: string;
  at: number;
  /** precomp size, text origin (centre x, first baseline) */
  box: [number, number];
  ox: number;
  base: number;
  /** Position (base + Main Position X/Y slider) */
  pos: [number, number];
  scale: number;
  inDur: number;
  /** exit: Text 01 blur-fade; others scale to 0 */
  exit?: { c0: number; c1: number; pos: [number, number] };
  scaleOut?: [number, number];
};
const ITEMS: L[] = [
  { text: "Today,\nI am teaching\n7 essential\nshortcuts.", color: "#FFFFFF", at: 0, box: [585, 374], ox: 291.74, base: 72.2, pos: [550.83, 960], scale: 85, inDur: 1.52, exit: { c0: 1.8, c1: 3.0, pos: [120, 0] } },
  { text: "Let's", color: "#00F9FF", at: 2.08, box: [210, 74], ox: 103.06, base: 72.2, pos: [308.4 + 106, 906.22 - 32], scale: 100, inDur: 1, scaleOut: [3.28, 4.4] },
  { text: "start", color: "#FFFFFF", at: 2.2, box: [211, 69], ox: 105.98, base: 67.63, pos: [547.58, 1044.89 - 85], scale: 100, inDur: 1, scaleOut: [3.4, 4.52] },
  { text: "the video.", color: "#F3FF00", at: 2.36, box: [431, 74], ox: 216.47, base: 72.2, pos: [582.84, 1161.95 - 113], scale: 100, inDur: 1, scaleOut: [3.56, 4.68] },
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {ITEMS.map((it, i) => {
      const tl = t - it.at;
      if (tl < 0) return null;
      const inO = lerp(-1, 1, clamp01(tl / it.inDur));
      const outC = it.exit ? clamp01((t - it.exit.c0) / (it.exit.c1 - it.exit.c0)) : undefined;
      const scale = it.scaleOut ? kf(t, [[it.scaleOut[0], 100], [it.scaleOut[1], 0]], [bz(0.8, 0, 0.8, 0)]) : it.scale;
      return (
        <Lyr key={i} pos={it.pos} anchor={[it.box[0] / 2, it.box[1] / 2]} scale={scale} opacity={clamp01(tl / 1)}>
          <SlideText
            lines={lines(texts[i] ?? it.text, INTER, 100)}
            color={colors[i] ?? it.color}
            ox={it.ox}
            base={it.base}
            inO={inO}
            outC={outC}
            outPos={it.exit?.pos}
            outRot={53}
            outBlur={100}
          />
        </Lyr>
      );
    })}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-hook-01",
  name: "Hook 01",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 5,
  fonts: ["Inter"],
  texts: ITEMS.map((i) => i.text),
  colors: ITEMS.map((i) => i.color),
  Component,
};
export default def;
