// Replica of premium-text "Lyrics 1" (comp TXT 4, 1920x1080 @23.976, 2.34s).
// Red Impact(Anton) line drops in with fade; Akira(Michroma) red line with per-letter spring (delay .04, freq 3,
// amp 20, decay 8; from y -535, rot 26, scale 0) and red glow; white Impact(Anton) line drops in below.
import React from "react";
import { bezier, lerp } from "./ae";
import { PLayer, springAmount } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const M = "Michroma";
const ramp = (t: number, t0: number, t1: number, ez: (x: number) => number) =>
  ez(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const e1 = bezier(0, 0.55, 0.19, 1);
  const o1 = bezier(0.84, 0, 0.16, 1);
  const e3 = bezier(0.22, 1, 0.36, 1);
  return (
    <>
      <PLayer text={texts[0] ?? "LYRICS"} font={A} caps color={colors[0] ?? "#FF0000"}
        pos={[960, lerp(380, 439, ramp(t, 0, 0.751, e1))]} anchorY={-48} capH={0.73}
        opacity={ramp(t, 0, 0.751, o1)} />
      <PLayer text={texts[1] ?? "LYRICS"} font={M} caps color={colors[1] ?? "#FF0000"} pos={[960, 538]} anchorY={-49}
        capH={0.72} amount={springAmount(t, 0, 0.04, 3, 20, 8)} from={{ y: -535, rot: 26, scale: 0, opacity: 1 }}
        glow={{ padX: 90, padY: 190, blur: 36, opacity: 0.75 }} />
      <PLayer text={texts[2] ?? "LYRICS"} font={A} caps color={colors[2] ?? "#FFFFFF"}
        pos={[960, lerp(629, 652, ramp(t, 0.292, 0.834, e3))]} anchorY={-49} capH={0.73}
        opacity={ramp(t, 0.292, 0.834, e3)} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-lyrics-1",
  name: "Lyrics 1",
  w: 1920, h: 1080, fps: 23.976, durationSec: 2.336,
  fonts: [A, M],
  texts: ["LYRICS", "LYRICS", "LYRICS"],
  colors: ["#FF0000", "#FF0000", "#FFFFFF"],
  Component,
};
export default def;
