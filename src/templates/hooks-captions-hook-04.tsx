// Replica of the "Hook 04" Premiere template (skills/motion-templates/templates/hooks-captions-hook-04.md).
// Four text boxes ("This is / where / the social media / start.") with coloured backgrounds (text bbox + 25/25/15/15 margins),
// each pops in (scale), is revealed by a Linear Wipe and wiped out again; the last two are tilted -5 / +5 deg.
// A rounded Media frame (empty by default, drawn as its outline) scales in at the bottom, tilts -5 -> +5 and scales out.
import React from "react";
import { INTER, Lyr, RRect, POP, bz, kf } from "./ae-hooks";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;

type B = {
  text: string;
  color: string;
  bg: string;
  at: number;
  box: [number, number];
  ox: number;
  base: number;
  /** glyph-bounds height of the text (precomp height) */
  gh: number;
  pos: [number, number];
  rot: number;
  scaleTo: number;
  scaleOut: [number, number, BzKey];
  introWipe: boolean;
  /** exit wipe start in the precomp's own clock */
  wipeOut: number;
};
type BzKey = [number, number, number, number];
const B_: B[] = [
  { text: "This is", color: "#FFFFFF", bg: "#9F00FF", at: 0, box: [320, 74], ox: 154.97, base: 71.3, gh: 74, pos: [275.2014, 723.4905 + 85], rot: 0, scaleTo: 60, scaleOut: [2.76, 3.76, bz(0.4794, 0, 1 / 6, 1)], introWipe: true, wipeOut: 3.0 },
  { text: "where", color: "#000000", bg: "#00F9FF", at: 0.2, box: [284, 74], ox: 142.66, base: 72.25, gh: 74, pos: [379.7336 + 106, 878.8393 - 32], rot: 0, scaleTo: 80, scaleOut: [2.84, 3.84, bz(0.5604, 0, 1 / 6, 1)], introWipe: true, wipeOut: 2.88 },
  { text: "the social media", color: "#FFEC00", bg: "#FF00E7", at: 0.4, box: [722, 74], ox: 361.36, base: 72.2, gh: 74, pos: [563.5847, 1041.1981 - 85], rot: -5, scaleTo: 120, scaleOut: [2.92, 3.92, bz(0.945, 0, 1 / 6, 1)], introWipe: true, wipeOut: 2.76 },
  { text: "start.", color: "#FFFFFF", bg: "#000000", at: 0.6, box: [234, 69], ox: 118.13, base: 67.63, gh: 69, pos: [626.9719, 1206.0823 - 137], rot: 5, scaleTo: 90, scaleOut: [3.0, 4.0, bz(1, 0, 0.1922, 0.806)], introWipe: false, wipeOut: 2.64 },
];

const M = 15; // top/bottom margin, left/right is 25

const BoxText: React.FC<{ b: B; text: string; color: string; bg: string; tl: number }> = ({ b, text, color, bg, tl }) => {
  const cin = b.introWipe ? kf(tl, [[0, 100], [2, 0]], [bz(1 / 6, 1, 0.8, 0)]) : 0;
  const cout = kf(tl, [[b.wipeOut, 0], [b.wipeOut + 1, 100]], [bz(1 / 6, 1, 1 / 6, 0)]);
  const top = b.base - b.gh - M;
  return (
    <div
      style={{
        position: "absolute",
        left: b.ox,
        top,
        height: b.gh + 2 * M,
        transform: "translateX(-50%)",
        padding: "0 25px",
        background: bg,
        clipPath: `inset(0 ${cin}% 0 ${cout}%)`,
        display: "flex",
        alignItems: "flex-start",
        whiteSpace: "pre",
      }}
    >
      <span
        style={{
          marginTop: b.base - INTER.baseline * 100 - top,
          lineHeight: "100px",
          height: 100,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 100,
          letterSpacing: "-0.025em",
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  // Media 01 (parent of the frame): pos (515.7,1426.7), scale 0 -> 50 -> 0, rotation -5 -> 5
  const ms = kf(t, [[0.6, 0], [1.6, 50], [3.16, 50], [4.16, 0]], [POP, [0, 0, 1, 1], [1, 0, 5 / 6, 5 / 6]]);
  const mr = kf(t, [[0.6, -5], [4.16, 5]], [bz(1 / 3, 0, 1 / 3, 0)]);
  const fs = kf(t, [[0.6, 0], [1.6, 100], [3.16, 100], [4.16, 0]], [[1 / 6, 0, 0, 1], [0, 0, 1, 1], [1, 0, 5 / 6, 1]]);
  return (
    <>
      {t >= 0.6 && (
        <Lyr pos={[515.7066, 1426.7197]} anchor={[540, 540]} scale={ms} rot={mr}>
          <Lyr pos={[540, 540]} anchor={[0, 0]} scale={fs}>
            <RRect w={1080} h={1080} r={130} sw={4} />
          </Lyr>
        </Lyr>
      )}
      {B_.map((b, i) => {
        if (t < b.at) return null;
        const tl = t - b.at;
        const sc = kf(t, [[b.at, 0], [b.at + 1, b.scaleTo], [b.scaleOut[0], b.scaleTo], [b.scaleOut[1], 0]], [POP, [0, 0, 1, 1], b.scaleOut[2]]);
        return (
          <Lyr key={i} pos={b.pos} anchor={[b.box[0] / 2, b.box[1] / 2]} scale={sc} rot={b.rot}>
            <BoxText b={b} text={texts[i] ?? b.text} color={colors[2 * i] ?? b.color} bg={colors[2 * i + 1] ?? b.bg} tl={tl} />
          </Lyr>
        );
      })}
    </>
  );
};

const def: TemplateDef = {
  slug: "hooks-captions-hook-04",
  name: "Hook 04",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 5,
  fonts: ["Inter"],
  texts: B_.map((b) => b.text),
  // per text: text colour, then its background colour
  colors: B_.flatMap((b) => [b.color, b.bg]),
  Component,
};
export default def;
