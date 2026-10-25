// Replica of "TXTFX 8" (premium-text pack): red Playfair Black "TXTFX" (all caps) rises from below, un-blurring 18 -> 6, its
// letters flicker in at random (Start 0 -> 100 in 0.28 s, reseeded 30x/s) under a light sweep; a purple script line
// ("Song lyrics") then fades in as a soft wave (Offset sweep, tracking +7, blur 19) wrapped in two big purple Glows.
// Playfair Display 900, Sloop Script Three -> Great Vibes.
// Approximations: AE Glows are stacked soft drop-shadows; Range Selector Offset (-100 -> 100) mapped to a hidden->revealed wave.
import React from "react";
import { PLayer, SCRIPT, between, prog, ranks, startCov, waveReveal } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["txtfx", "Song lyrics"], colors: ["#FF0000", "#AC00FF"] };

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const tx = texts[0] ?? DEF.texts[0];
  const n0 = [...tx].filter((c) => !/\s/.test(c)).length;
  const r0 = ranks(n0, `tx8-${Math.floor(t * 30)}`);
  const s0 = prog(t, 0, 0.284) * 100;
  const u = prog(t, 0.033, 1.735, [0.312, 0, 0.669, 1]);
  const purple = colors[1] ?? DEF.colors[1];
  return (
    <>
      <PLayer
        text={tx} font="Playfair Display" weight={900} upper size={134} color={colors[0] ?? DEF.colors[0]}
        pos={[960, between(t, 0, 1055, 0.684, 540, [0, 0.55, 0.27, 1])]} anchorUp={40} scale={[179, 179]}
        opacity={between(t, 0, 0, 1.001, 1, [0, 0.73, 0.27, 1])}
        blur={between(t, 0, 18.2, 0.651, 6)}
        sweeps={[{ k: between(t, 0.317, 0.5, 0.851, -0.1), w: 0.18, a: 0.5 }]}
        chars={(i) => ({ opacity: 1 - startCov(r0[i] ?? i, n0, s0) })}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]} font={SCRIPT} size={265} color={purple}
        pos={[973, 530]} anchorUp={68} scale={[68, 68]} capMid={0.3}
        glow={[{ r: 12, a: 0.7 }, { r: 70, a: 0.4 }]}
        sweeps={[{ k: 0.4, w: 0.15, a: 0.35 }]}
        chars={(i, n) => {
          const r = waveReveal(i, n, u, 0.5);
          return { opacity: r, blur: 9 * (1 - r), track: 7 * 0.265 * (1 - r) };
        }}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-txtfx-8",
  name: "TXTFX 8",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.069,
  fonts: ["Playfair Display", SCRIPT],
  texts: DEF.texts,
  colors: DEF.colors,
  Component,
};
export default def;
