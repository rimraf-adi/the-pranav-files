// Replica of "TEXT 19" (premium-text pack): white "PLACE" drops from above and "HERE" rises from below (0.97 s) around a red
// "LYRICS" that spins in (AE Transform effect: rotation 96 -> 0, scale height 0 -> 100, 1.17 s) with a travelling light sweep.
// Impact -> Anton.  Approximation: position easing (bezier not exported) is a fast ease-out; light sweep is a masked band.
import React from "react";
import { PLayer, between, prog } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["PLACE", "LYRICS", "HERE"], colors: ["#FFFFFF", "#FF0000", "#FFFFFF"] };
const POS: [number, number, number, number] = [0.2, 0.75, 0.2, 1];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const rot = between(t, 0, 96, 1.168, 0, [0.009, 0.782, 0.003, 1]);
  const sh = prog(t, 0, 1.168, [0.009, 0.613, 0.239, 1]);
  const sweep = between(t, 0, 1.11, 1.935, -0.29);
  return (
    <>
      <PLayer
        text={texts[0] ?? DEF.texts[0]} font="Anton" size={134} color={colors[0] ?? DEF.colors[0]}
        pos={[960, between(t, 0, -175, 0.968, 379, POS)]} anchorUp={46} scale={[166, 166]}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]} font="Anton" size={134} color={colors[1] ?? DEF.colors[1]}
        pos={[960, 540]} anchorUp={46} scale={[195, 195]}
        extraTransform={`rotate(${rot}deg) scale(1, ${Math.max(sh, 0.0001)})`}
        sweeps={[{ k: sweep, w: 0.2, a: 0.55 }]}
      />
      <PLayer
        text={texts[2] ?? DEF.texts[2]} font="Anton" size={134} color={colors[2] ?? DEF.colors[2]}
        pos={[960, between(t, 0, 1241, 0.968, 686, POS)]} anchorUp={46} scale={[166, 166]}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-19",
  name: "TEXT 19",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.002,
  fonts: ["Anton"],
  texts: DEF.texts,
  colors: DEF.colors,
  Component,
};
export default def;
