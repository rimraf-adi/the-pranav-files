// Replica of premium-text "Text 13" (comp TXT 13, 1920x1080 @59.94, 2.27s).
// PLACE and HERE: Anton white 228%, slide in from opposite sides (x 2493->958 / -514->955, bezier .0,.72,.31,1 over 1.37s)
// with a drop shadow. LYRICS: Impact(Anton) yellow-green 228% between them, random-order letter fade-in
// (Start 0->100 over .95s, bezier .76,0,.01,1, seed time*30).
import React from "react";
import { bezier, lerp } from "./ae";
import { PLayer, randomReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const norm = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const k = bezier(0, 0.72, 0.31, 1)(norm(t, 0, 1.368));
  const p = bezier(0.76, 0, 0.01, 1)(norm(t, 0, 0.951));
  return (
    <>
      <PLayer text={texts[0] ?? "PLACE"} font={A} color={colors[0] ?? "#FFFFFF"} pos={[lerp(2493, 958, k), 353]} anchorY={-41}
        capH={0.73} scale={228} shadow={{ dist: 6, soft: 3, op: 145.5 }} />
      <PLayer text={texts[1] ?? "LYRICS"} font={A} color={colors[1] ?? "#D3FF00"} pos={[960, 566]} anchorY={-41} capH={0.73}
        scale={228} amount={randomReveal(p, "t13", 30, t)} from={{ opacity: 0 }} shadow={{ dist: 9, soft: 7, op: 128.5 }} />
      <PLayer text={texts[2] ?? "HERE"} font={A} color={colors[2] ?? "#FFFFFF"} pos={[lerp(-514, 955, k), 778]} anchorY={-41}
        capH={0.73} scale={228} shadow={{ dist: 6, soft: 3, op: 145.5 }} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-13",
  name: "Text 13",
  w: 1920, h: 1080, fps: 59.94, durationSec: 2.269,
  fonts: [A],
  texts: ["PLACE", "LYRICS", "HERE"],
  colors: ["#FFFFFF", "#D3FF00", "#FFFFFF"],
  Component,
};
export default def;
