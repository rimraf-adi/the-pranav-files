// Replica of premium-text "Place 12" (comp TXT 12, 1920x1080 @59.94; layers live ~2.3s).
// PLACE: Anton lime, LYRICS: Impact(Anton) red 150%. Letters resolve left to right (Range Selector Start 0->100 with
// Flow beziers) from opacity 0 with Character Offset scramble (time*30); CC Light Sweep there-and-back, drop shadow,
// dim olive glow blob. Approximated: scramble cycles A-Z, glow blob, sweep.
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, seqReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const A = "Anton";
const norm = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const p1 = bezier(0, 0.55, 0.35, 1)(norm(t, 0, 1.418));
  const p2 = bezier(0, 0.32, 0.51, 1)(norm(t, 0.133, 1.134));
  const back = (a: number, mid: number, b: number) =>
    track(t, [{ t: a, v: 0, bez: [0.4, 0, 0.2, 1] }, { t: mid, v: 1, bez: [0.4, 0, 0.2, 1] }, { t: b, v: 0 }]);
  return (
    <>
      <PLayer text={texts[0] ?? "PLACE"} font={A} color={colors[0] ?? "#C5FF00"} pos={[960.3, 455.7]} anchorY={-56} capH={0.73}
        scale={[150.6, 137.1]} opacity={t > 2.269 ? 0 : 1}
        amount={seqReveal(p1)} from={{ opacity: 0.05 }} scramble={t * 30}
        shadow={{ dist: 5, soft: 9, op: 195.5 }}
        glow={{ padX: 170, padY: 190, blur: 40, opacity: 0.3 }}
        sweep={{ p: back(0, 1.018, 2.002) * 1, width: 50, intensity: 40 }} />
      {t >= 0.133 && (
        <PLayer text={texts[1] ?? "LYRICS"} font={A} color={colors[1] ?? "#FF0000"} pos={[961.9, 640.9]} anchorY={-36} capH={0.73}
          scale={150} opacity={t > 2.402 ? 0 : 1}
          amount={seqReveal(p2)} from={{ opacity: 0.05 }}
          shadow={{ dist: 6, soft: 12, op: 156 }}
          sweep={{ p: back(0.133, 1.151, 2.135), width: 50, intensity: 25 }} />
      )}
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-place-12",
  name: "Place 12",
  w: 1920, h: 1080, fps: 59.94, durationSec: 2.45,
  fonts: [A],
  texts: ["PLACE", "LYRICS"],
  colors: ["#C5FF00", "#FF0000"],
  Component,
};
export default def;
