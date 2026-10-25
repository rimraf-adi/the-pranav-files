// Replica of premium-text "Insert" (comp TXT 9, 1920x1080 @59.94, 2.72s).
// INSERT / HERE: Impact(Anton) white, wave reveal from (opacity 0, scale 72%, blur 7) via Range Selector Offset
// -100->100 (bezier .248,0,.136,.874), fade out 2.37-2.62s. LYRICS: yellow 190%, random-order fade-in over 1s with
// a faint yellow glow blob. Approximated: glow = blurred duplicate, ramp shape = linear wave smear.
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, randomReveal, waveReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const FONT = "Anton";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const wave = bezier(0.248, 0, 0.136, 0.874)(Math.min(1, t / 1.251));
  const out = track(t, [{ t: 2.369, v: 1 }, { t: 2.619, v: 0 }]);
  const lp = bezier(0.333, 0, 0.667, 1)(Math.min(1, t / 1.001));
  const shadow = { dist: 6, soft: 44, op: 137.5 };
  const from = { opacity: 0, scale: 72, blur: 7 };
  return (
    <>
      <PLayer text={texts[0] ?? "INSERT"} font={FONT} caps color={colors[0] ?? "#FFFFFF"} pos={[961.2, 351]} anchorY={-53}
        capH={0.73} scale={[155, 150]} opacity={out} amount={waveReveal(wave, 0.9)} from={from} shadow={shadow} letterSpacing={-1.6} />
      <PLayer text={texts[1] ?? "LYRICS"} font={FONT} caps color={colors[1] ?? "#EBFF00"} pos={[959, 557]} anchorY={-44}
        capH={0.73} scale={190} amount={randomReveal(lp, "insert-l", 20, t)} from={{ opacity: 0 }}
        glow={{ padX: 140, padY: 105, blur: 30, opacity: 0.3 }} />
      <PLayer text={texts[2] ?? "HERE"} font={FONT} caps color={colors[2] ?? "#FFFFFF"} pos={[958.4, 743.3]} anchorY={-21}
        capH={0.73} scale={[183, 149]} opacity={out} amount={waveReveal(wave, 0.9)} from={from} shadow={shadow} letterSpacing={-1.6} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-insert",
  name: "Insert",
  w: 1920, h: 1080, fps: 59.94, durationSec: 2.719,
  fonts: [FONT],
  texts: ["INSERT", "LYRICS", "HERE"],
  colors: ["#FFFFFF", "#EBFF00", "#FFFFFF"],
  Component,
};
export default def;
