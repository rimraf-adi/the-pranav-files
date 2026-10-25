// Replica of the "Hook 05" Premiere template (skills/motion-templates/templates/hooks-captions-hook-05.md).
// "7 Advices from seven millionaire woman." : big 7 (Haas -> Inter), Playfair italic "Advices", small "from", and a
// yellow two-line block (line 2 in a smaller serif italic). Words slide in, then blur/rotate-fade out (~1.8-3.4 s).
// A rounded Media frame (empty by default, drawn as its outline) slides in from the left, grows, then collapses.
import React from "react";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { clamp01, lerp } from "./ae";
import { INTER, PLAYFAIR, Lyr, RRect, SlideText, bz, kf, lines } from "./ae-hooks";
import type { Line } from "./ae-hooks";
import type { TemplateDef, TemplateProps } from "./types";

// the italic 700 face of the serif (the registry loader only fetches the upright styles)
loadFont("italic", { weights: ["700"], subsets: ["latin"] });

const FPS = 25;
const EASE_IN = bz(1 / 6, 1, 0.8, 0); // linear out, 80% zero-speed in

type T = {
  text: string;
  color: string;
  at: number;
  box: [number, number];
  ox: number;
  base: number;
  pos: [number, number];
  scale: number;
  inDur: number;
  exit: [number, number, number];
  align?: "left";
  mk: (text: string) => Line[];
};
const TS: T[] = [
  { text: "7", color: "#FFFFFF", at: 0, box: [51, 69], ox: 15.04, base: 68.8, pos: [331.0292, 594.1129 + 85], scale: 350, inDur: 1.52, exit: [2.0, 3.44, 10.46], mk: (s) => lines(s, INTER, 100) },
  { text: "Advices", color: "#00F9FF", at: 0.12, box: [352, 81], ox: 180.98, base: 79.54, pos: [416.0241 + 106, 771.2222 - 32], scale: 150, inDur: 1, exit: [1.96, 3.12, 120], mk: (s) => lines(s, PLAYFAIR, 100) },
  { text: "from", color: "#FFFFFF", at: 0.24, box: [213, 74], ox: 107.4, base: 72.5, pos: [785.2009, 937.8922 - 85], scale: 70, inDur: 1, exit: [1.92, 3.2, 120], mk: (s) => lines(s, INTER, 100) },
  {
    text: "seven\nmillionaire woman.",
    color: "#F3FF00",
    at: 0.4,
    box: [490, 155],
    ox: -0.63,
    base: 53.23,
    pos: [564.8377, 1074.9481 - 113],
    scale: 150,
    inDur: 1,
    exit: [1.84, 3.2, 120],
    align: "left",
    // line 1 in the sans, further lines in a smaller serif italic (as in the template's preview)
    mk: (s) => s.split(/\r|\n/).map((x, i) => (i === 0 ? { text: x, fam: INTER, size: 100 } : { text: x, fam: PLAYFAIR, size: 54 })),
  },
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  // Media 01 frame: slides in from the left (pos -526 -> 540, y 1327), width 0 -> 1080 (scaled 50%), holds, collapses; stroke fades out
  const mx = kf(t, [[0, -526], [1.04, 540]], [bz(1 / 6, 1, 0.8, 0)]);
  const w = kf(t, [[0, 0], [1.04, 1080], [2.52, 1080], [3.92, 0]], [EASE_IN, [0, 0, 1, 1], bz(1 / 6, 1, 0.8, 0)]);
  const sw = kf(t, [[3.48, 4], [3.92, 0]]);
  return (
    <>
      <Lyr pos={[mx, 1327]} anchor={[540, 540]} scale={50}>
        <Lyr pos={[540, 540]} anchor={[0, 0]}>
          <RRect w={w} h={1080} r={130} sw={sw} />
        </Lyr>
      </Lyr>
      {TS.map((it, i) => {
        const tl = t - it.at;
        if (tl < 0) return null;
        const c = clamp01((tl - it.exit[0]) / (it.exit[1] - it.exit[0]));
        return (
          <Lyr key={i} pos={it.pos} anchor={[it.box[0] / 2, it.box[1] / 2]} scale={it.scale} opacity={kf(tl, [[0, 0], [1, 1]], [bz(1 / 6, 1, 1, 0)])}>
            <SlideText
              lines={it.mk(texts[i] ?? it.text)}
              color={colors[i] ?? it.color}
              ox={it.ox}
              base={it.base}
              align={it.align}
              inO={lerp(-1, 1, clamp01(tl / it.inDur))}
              outC={c}
              outPos={[it.exit[2], 0]}
              outRot={53}
              outBlur={100}
            />
          </Lyr>
        );
      })}
    </>
  );
};

const def: TemplateDef = {
  slug: "hooks-captions-hook-05",
  name: "Hook 05",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 5,
  fonts: ["Inter", "Playfair Display"],
  texts: TS.map((i) => i.text),
  colors: TS.map((i) => i.color),
  Component,
};
export default def;
