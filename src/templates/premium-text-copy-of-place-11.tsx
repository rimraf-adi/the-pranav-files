// Replica of premium-text "Place 11" (comp TXT 11, 1920x1080 @59.94, 3.55s).
// Playfair Display Black. "place" drops in from above and "here" rises from below, both blur 25->0 and fade in
// (Flow beziers), slowly shrinking (100 - 2t %). LYRICS: red 206%->(206-4t)%, per-letter damped spring pop (delay .06,
// freq 2, amp 50, decay 8; from offset 123,-156, rot 53, scale 0, opacity 0) with a light sweep and small glow.
import React from "react";
import { bezier, lerp } from "./ae";
import { PLayer, springAmount } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const F = "Playfair Display";
const norm = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const sc1 = 100 - t * 2;
  const placeY = lerp(-30.7, 447.3, bezier(0, 0.77, 0.17, 1)(norm(t, 0, 1.018)));
  const hereY = lerp(934.5, 685.5, bezier(0, 0.48, 0.27, 1)(norm(t, 0, 1.001)));
  const blur = lerp(25.3, 0, bezier(0, 0.14, 0.37, 1)(norm(t, 0, 1.001)));
  const opP = bezier(0, 0.16, 0.61, 1)(norm(t, 0.033, 1.034));
  const opH = bezier(0, 0.14, 0.37, 1)(norm(t, 0, 1.001));
  return (
    <>
      <PLayer text={texts[0] ?? "place"} font={F} weight={900} color={colors[0] ?? "#FFFFFF"} pos={[633, placeY]} anchorY={0}
        capH={0.7} scale={sc1} opacity={opP} blur={blur} />
      <PLayer text={texts[1] ?? "LYRICS"} font={F} weight={900} color={colors[1] ?? "#FF0000"} pos={[960, 540]} anchorY={-43}
        capH={0.7} scale={206 - 4 * t} amount={springAmount(t, 0, 0.06, 2, 50, 8)}
        from={{ x: 123, y: -156, rot: 53, scale: 0, opacity: 0 }}
        glow={{ padX: 30, padY: 20, blur: 14, opacity: 0.35 }}
        sweep={{ p: norm(t, 0.033, 1.151), width: 50, intensity: 25, dir: -1 }} />
      <PLayer text={texts[2] ?? "here"} font={F} weight={900} color={colors[2] ?? "#FFFFFF"} pos={[1302, hereY]} anchorY={0}
        capH={0.7} scale={sc1} opacity={opH} blur={blur} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-place-11",
  name: "Place 11",
  w: 1920, h: 1080, fps: 59.94, durationSec: 3.554,
  fonts: [F],
  texts: ["place", "LYRICS", "here"],
  colors: ["#FFFFFF", "#FF0000", "#FFFFFF"],
  Component,
};
export default def;
