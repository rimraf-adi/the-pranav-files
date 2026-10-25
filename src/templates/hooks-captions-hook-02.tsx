// Replica of the "Hook 02" Premiere template (skills/motion-templates/templates/hooks-captions-hook-02.md).
// How / I made / 500K$ / last year! pop in (scale) staggered by 0.2 s, then fly off to the right. A rounded Media
// frame (empty by default, drawn as its outline) grows at the bottom, moves to centre and becomes a tall frame
// that holds "I am explaining my 5 secrets." and collapses at 2.8-4.64 s.
import React from "react";
import { INTER, Lyr, ClipRect, RRect, SlideText, POP, bz, kf, lines } from "./ae-hooks";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;
const SW = 4; // stroke in the (scaled) frame space, ~2px on screen

type Fly = { text: string; color: string; at: number; box: [number, number]; ox: number; base: number; pos: [number, number]; scale: number; dx: number };
const FLY: Fly[] = [
  { text: "How", color: "#FFFFFF", at: 0, box: [200, 74], ox: 94.97, base: 71.3, pos: [281.296, 799.58], scale: 60, dx: 1234 },
  { text: "I made", color: "#00F9FF", at: 0.2, box: [293, 74], ox: 144.54, base: 72.2, pos: [441.4, 869.22], scale: 120, dx: 1234 },
  { text: "500K$", color: "#FFFFFF", at: 0.4, box: [319, 87], ox: 160.14, base: 76.58, pos: [607.29, 985.85], scale: 180, dx: 1234 },
  { text: "last year!", color: "#F3FF00", at: 0.6, box: [395, 89], ox: 197.76, base: 71.99, pos: [626.97, 1100.08], scale: 90, dx: 1234 },
];
const T5 = { text: "I am explaining\nmy 5 secrets.", color: "#FFFFFF", box: [656, 189] as [number, number], ox: 327.24, base: 72 };

const FLYEASE = bz(0.9, 0, 1 / 6, 1);
/** Media 01 / 02 transform (shared keys): position from (515.7,1426.7) to centre, scale 0 -> 50 -> 100 */
const media = (t: number) => ({
  x: kf(t, [[1.68, 515.7066], [2.64, 540]], [bz(0.9, 0, 0.9, 0)]),
  y: kf(t, [[1.68, 1426.7197], [2.64, 960]], [bz(0.9, 0, 0.9, 0)]),
  s: kf(t, [[0.6, 0], [1.6, 50], [1.68, 50], [2.64, 100]], [POP, [0, 0, 1, 1], bz(0.9, 0, 0.9, 0)]),
});

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const m = media(t);
  const h3 = kf(t, [[2.8, 1600], [4.64, 0]], [bz(0.9, 0, 0.9, 0)]);
  return (
    <>
      {/* Media 01 frame: square, scale 0 -> 100 (own) inside Media 01 (scale 0 -> 50 -> 100), 0.8 - 2.16 s */}
      {t >= 0.8 && t < 2.16 && (
        <Lyr pos={[m.x, m.y]} anchor={[540, 540]} scale={m.s}>
          <Lyr pos={[540, 540]} anchor={[0, 0]} scale={kf(t, [[0.8, 0], [1.8, 100]], [POP])}>
            <RRect w={1080} h={1080} r={130} sw={SW} />
          </Lyr>
        </Lyr>
      )}
      {/* Media 02 frame + Text 05, 2.16 - 5 s */}
      {t >= 2.16 && (
        <Lyr pos={[m.x, m.y]} anchor={[540, 800]} scale={m.s}>
          <RRect w={1080} h={h3} r={130} sw={kf(t, [[4.44, SW], [4.64, 0]])} cx={540} cy={800} />
          <ClipRect cx={540} cy={800} w={1080} h={h3} r={130}>
            <Lyr pos={[540, 800]} anchor={[T5.box[0] / 2, T5.box[1] / 2]}>
              <SlideText lines={lines(texts[4] ?? T5.text)} color={colors[4] ?? T5.color} ox={T5.ox} base={T5.base} inO={-1 + 2 * Math.min(1, Math.max(0, t - 2.16))} />
            </Lyr>
          </ClipRect>
        </Lyr>
      )}
      {FLY.map((f, i) => {
        if (t < f.at) return null;
        const k = f.at + 1;
        const fx = kf(t, [[k, f.pos[0]], [k + 0.8, f.pos[0] + f.dx]], [FLYEASE]);
        const sc = kf(t, [[f.at, 0], [k, f.scale]], [POP]);
        return (
          <Lyr key={i} pos={[fx, f.pos[1]]} anchor={[f.box[0] / 2, f.box[1] / 2]} scale={sc}>
            <SlideText lines={lines(texts[i] ?? f.text, INTER, 100)} color={colors[i] ?? f.color} ox={f.ox} base={f.base} />
          </Lyr>
        );
      })}
    </>
  );
};

const def: TemplateDef = {
  slug: "hooks-captions-hook-02",
  name: "Hook 02",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 5,
  fonts: ["Inter"],
  texts: [...FLY.map((f) => f.text), T5.text],
  colors: [...FLY.map((f) => f.color), T5.color],
  Component,
};
export default def;
