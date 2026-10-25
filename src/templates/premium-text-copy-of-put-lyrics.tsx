// Replica of premium-text "Put Lyrics" (comp TXT 3, 1920x1080 @23.976, 2.42s).
// PUT / HERE: Lato Black Italic white, slide in (PUT from the left, HERE from below) with fade. LYRICS: red Impact(Anton)
// 140%, per-letter inertial bounce (freq 1.5, decay 5, .25s; from offset 53,-228, rot 46, scale 0), CC Light Sweep,
// big soft drop shadow. Approximated: sweep; the static 9px Gaussian Blur on PUT/HERE is reduced to 2px.
import React from "react";
import { bezier, lerp, track } from "./ae";
import { PLayer, bounceAmount } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const L = "Lato";
const A = "Anton";
const norm = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const px = lerp(-429, 960, bezier(0, 0.93, 0.19, 1)(norm(t, 0, 1.627)));
  const hy = lerp(801, 649, bezier(0.3, 0, 0.2, 1)(norm(t, 0, 1.376)));
  return (
    <>
      <PLayer text={texts[0] ?? "PUT"} font={L} weight={900} italic caps color={colors[0] ?? "#FFFFFF"} pos={[px, 418]} anchorY={-28}
        capH={0.72} opacity={track(t, [{ t: 0, v: 0 }, { t: 0.918, v: 1 }])} blur={2} />
      <PLayer text={texts[1] ?? "LYRICS"} font={A} caps color={colors[1] ?? "#FF0000"} pos={[960, 540]} anchorY={-28} capH={0.73}
        scale={140} amount={bounceAmount(t, 0, 1 / 23.976, 1.5, 5, 0.25)}
        from={{ x: 53, y: -228, rot: 46, scale: 0, opacity: 1 }}
        shadow={{ dist: 14, soft: 36, op: 127.5 }}
        sweep={{ p: norm(t, 0.501, 2.002), width: 50, intensity: 25, dir: -1 }} />
      <PLayer text={texts[2] ?? "HERE"} font={L} weight={900} italic caps color={colors[2] ?? "#FFFFFF"} pos={[960, hy]} anchorY={-28}
        capH={0.72} opacity={track(t, [{ t: 0.25, v: 0 }, { t: 0.918, v: 1 }])} blur={2} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-put-lyrics",
  name: "Put Lyrics",
  w: 1920, h: 1080, fps: 23.976, durationSec: 2.419,
  fonts: [L, A],
  texts: ["PUT", "LYRICS", "HERE"],
  colors: ["#FFFFFF", "#FF0000", "#FFFFFF"],
  Component,
};
export default def;
