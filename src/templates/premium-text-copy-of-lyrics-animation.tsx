// Replica of premium-text "Lyrics Animation" (comp TXT 5, 1920x1080 @23.976, 2.42s).
// LYRICS: red Impact(Anton), scale 0->224% (bezier .0,.55,.19,1 over .75s), random-order letter fade-in over 1s
// (seed time*11), big drop shadow, CC Light Sweep 0->1.38s. "Animations": Sloop Script -> Pacifico 222px white with
// an offset-wave reveal, glow, fade out 2.37-2.62s. Approximated: glow, sweep.
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, randomReveal, waveReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const S = "Pacifico";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const sc = track(t, [{ t: 0, v: 0, bez: [0, 0.55, 0.19, 1] }, { t: 0.751, v: 224 }]);
  const rp = track(t, [{ t: 0, v: 0 }, { t: 1.001, v: 1 }]);
  const wave = bezier(0.248, 0, 0.136, 0.874)(Math.min(1, t / 1.251));
  const out = track(t, [{ t: 2.369, v: 1 }, { t: 2.619, v: 0 }]);
  return (
    <>
      <PLayer text={texts[0] ?? "LYRICS"} font={A} caps color={colors[0] ?? "#FF0000"} pos={[957.4, 512.6]} anchorY={-42} capH={0.73}
        scale={sc} amount={randomReveal(rp, "la", 11, t)} from={{ opacity: 0 }}
        shadow={{ dist: 16, soft: 60, op: 127.5 }}
        sweep={{ p: track(t, [{ t: 0, v: 0 }, { t: 1.376, v: 1 }]), width: 75, intensity: 51, dir: -1 }} />
      <PLayer text={texts[1] ?? "Animations"} font={S} weight={400} size={222} color={colors[1] ?? "#FFFFFF"} pos={[909.9, 700.2]}
        anchorY={-21} capH={0.6} opacity={out} amount={waveReveal(wave, 0.9)} from={{ opacity: 0, scale: 72, blur: 7 }}
        shadow={{ dist: 6, soft: 5, op: 38.25 }}
        glow={{ padX: 120, padY: 80, blur: 30, opacity: 0.18 }} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-lyrics-animation",
  name: "Lyrics Animation",
  w: 1920, h: 1080, fps: 23.976, durationSec: 2.419,
  fonts: [A, S],
  texts: ["LYRICS", "Animations"],
  colors: ["#FF0000", "#FFFFFF"],
  Component,
};
export default def;
