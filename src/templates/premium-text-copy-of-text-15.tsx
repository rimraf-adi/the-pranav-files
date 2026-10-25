// Replica of "TEXT 15" (premium-text pack): "ADD YOUR" (Playfair Black) fades in by random letters (Range Selector Start 0->100,
// seed time*30), "LYRICS" reveals left to right with a scrambling Character Offset (time*15), "Here" (red script) rises in as a
// soft wave (scale 72%, blur 7, tight tracking) with a light sweep. Sloop Script Three -> Great Vibes.
import React from "react";
import { PLayer, SCRIPT, between, prog, ranks, shiftChar, startCov, waveReveal } from "./ae-premium-e";
import { bezier } from "./ae";
import type { TemplateDef, TemplateProps } from "./types";

const PF = "Playfair Display";
const DEF = { texts: ["ADD YOUR", "LYRICS", "Here"], colors: ["#F7F7F7", "#FCFCFC", "#FF0000"] };

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const t0 = texts[0] ?? DEF.texts[0];
  const t1 = texts[1] ?? DEF.texts[1];
  const t2 = texts[2] ?? DEF.texts[2];

  // 0: ADD YOUR - random order, reseeded 30x per second
  const s0 = bezier(0.012, 0.699, 0.464, 1)(Math.min(1, t / 0.801)) * 100;
  const frameSeed = Math.floor(t * 30);
  const n0 = [...t0].filter((c) => !/\s/.test(c)).length;
  const r0 = ranks(n0, `t15-${frameSeed}`);

  // 1: LYRICS - left to right, characters scramble while selected
  const s1 = prog(t, 0.317, 1.151, [0, 0.63, 0.33, 1]) * 100;
  const n1 = [...t1].filter((c) => !/\s/.test(c)).length;
  const off1 = Math.floor(t * 15);

  // 2: Here - Range Selector Offset 0 -> 100 (shape smooth) reveals as a wave
  const u2 = prog(t, 0.801, 1.535, [0.017, 0.461, 0.833, 1]);

  return (
    <>
      <PLayer
        text={t0}
        font={PF}
        weight={900}
        size={134}
        color={colors[0] ?? DEF.colors[0]}
        pos={[957.7048, 465.8616]}
        anchorUp={52}
        scale={[137, 137]}
        shadow={{ d: 5, s: 5 }}
        chars={(i) => ({ opacity: 1 - startCov(r0[i] ?? i, n0, s0) })}
        opacity={t >= 0 ? 1 : 0}
      />
      <PLayer
        text={t1}
        font={PF}
        weight={900}
        size={134}
        color={colors[1] ?? DEF.colors[1]}
        pos={[959.7244, 613.9759]}
        anchorUp={52}
        scale={[137, 137]}
        shadow={{ d: 5, s: 5 }}
        opacity={t >= 0.317 ? 1 : 0}
        chars={(i, n, ch) => {
          const cov = startCov(i, n1 || n, s1);
          return { opacity: 1 - cov, ch: cov > 0 && cov < 1 ? shiftChar(ch, off1 * cov) : cov >= 1 ? ch : ch };
        }}
      />
      <PLayer
        text={t2}
        font={SCRIPT}
        size={134}
        color={colors[2] ?? DEF.colors[2]}
        pos={[554, 717]}
        anchorUp={21}
        scale={[223, 223]}
        shadow={{ d: 5, s: 5 }}
        opacity={between(t, 0.801, 0, 1.401, 1) }
        capMid={0.3}
        sweeps={[{ k: 0.5, w: 0.2, a: 0.35 }]}
        chars={(i, n) => {
          const r = waveReveal(i, n, u2, 0.6);
          return { opacity: r, sx: 0.72 + 0.28 * r, blur: 7 * (1 - r) * 0.5, track: -1.6 * (1 - r) };
        }}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-15",
  name: "TEXT 15",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 3.52,
  fonts: [PF, SCRIPT],
  texts: DEF.texts,
  colors: DEF.colors,
  Component,
};
export default def;
