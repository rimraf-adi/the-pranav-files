// Replica of premium-text "Lyrics 6" (comp TXT 6, 1920x1080 @23.976, 2.42s).
// Akira(Michroma) white 66% lines fade in letter by letter (random order, Start 0->100, seed time*20) above and below
// a blue Impact(Anton) line sliding in from the right (x 2185->960) with a strong blue glow and a light sweep.
// Approximated: glow = blurred blob, CC Light Sweep = gradient pass.
import React from "react";
import { bezier, lerp, track } from "./ae";
import { PLayer, randomReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const M = "Michroma";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const shadow = { dist: 5, soft: 0, op: 127.5 };
  const p1 = track(t, [{ t: 0, v: 0 }, { t: 0.751, v: 1 }]);
  const p2 = track(t, [{ t: 0.292, v: 0 }, { t: 1.043, v: 1 }]);
  const slide = bezier(0.2, 0.7, 0.2, 1)(Math.min(1, Math.max(0, t / 1.084)));
  return (
    <>
      <PLayer text={texts[0] ?? "LYRICS"} font={M} color={colors[0] ?? "#FFFFFF"} pos={[960, 444]} anchorY={-42} capH={0.72}
        scale={66} amount={randomReveal(p1, "l6a", 20, t)} from={{ opacity: 0 }} shadow={shadow} />
      <PLayer text={texts[1] ?? "LYRICS"} font={A} caps color={colors[1] ?? "#3400FF"} pos={[lerp(2185, 960, slide), 540]}
        anchorY={-42} capH={0.73}
        glow={{ padX: 150, padY: 120, blur: 34, opacity: 0.7, lighten: 0.15 }}
        sweep={{ p: track(t, [{ t: 0.042, v: 0 }, { t: 1.835, v: 1 }]), width: 50, intensity: 25, dir: -1 }} />
      {t >= 0.292 && (
        <PLayer text={texts[2] ?? "LYRICS"} font={M} color={colors[2] ?? "#FFFFFF"} pos={[960, 620]} anchorY={-42} capH={0.72}
          scale={66} amount={randomReveal(p2, "l6b", 20, t)} from={{ opacity: 0 }} shadow={shadow} />
      )}
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-lyrics-6",
  name: "Lyrics 6",
  w: 1920, h: 1080, fps: 23.976, durationSec: 2.419,
  fonts: [A, M],
  texts: ["LYRICS", "LYRICS", "LYRICS"],
  colors: ["#FFFFFF", "#3400FF", "#FFFFFF"],
  Component,
};
export default def;
