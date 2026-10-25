// Replica of premium-text "Lyrics 7" (comp TXT 7, 1920x1080 @59.94, 2.72s).
// LYRICS: red Impact(Anton) 224%, letters start squashed wide (scale 221%x43%), blurred, transparent and resolve in
// random order via Range Selector Offset -100->100 (1.97s, bezier .005,.611,.121,1); CC Light Sweep 0->1.38s; dark red glow blob.
// "Add Them Here": Sloop Script -> Pacifico, white, fades in 0.6s with an offset wave. Approximated: glow, sweep, ramp shape.
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, randomReveal, waveReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const S = "Pacifico";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const off = bezier(0.005, 0.611, 0.121, 1)(Math.min(1, t / 1.969));
  const off2 = bezier(0.014, 0.579, 0.833, 1)(Math.min(1, t / 0.734));
  const sw = bezier(0, 0.2, 0.19, 1)(Math.min(1, t / 1.376));
  return (
    <>
      <PLayer text={texts[0] ?? "LYRICS"} font={A} caps color={colors[0] ?? "#FF0000"} pos={[960, 540]} anchorY={-42} capH={0.73}
        scale={224} amount={randomReveal(off, "l7", 0, t)} from={{ opacity: 0, scaleX: 221, scaleY: 43, blur: 3 }}
        shadow={{ dist: 9, soft: 26, op: 124.5 }}
        glow={{ padX: 150, padY: 170, blur: 40, opacity: 0.3 }}
        sweep={{ p: sw, width: 60, intensity: 55, dir: -1 }} />
      <PLayer text={texts[1] ?? "Add Them Here"} font={S} weight={400} color={colors[1] ?? "#FFFFFF"} pos={[934, 681]} anchorY={-21}
        capH={0.6} opacity={track(t, [{ t: 0, v: 0 }, { t: 0.601, v: 1 }])}
        amount={waveReveal(off2, 0.8)} from={{ opacity: 0, scale: 72, blur: 7 }}
        shadow={{ dist: 5, soft: 11, op: 176 }} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-lyrics-7",
  name: "Lyrics 7",
  w: 1920, h: 1080, fps: 59.94, durationSec: 2.719,
  fonts: [A, S],
  texts: ["LYRICS", "Add Them Here"],
  colors: ["#FF0000", "#FFFFFF"],
  Component,
};
export default def;
