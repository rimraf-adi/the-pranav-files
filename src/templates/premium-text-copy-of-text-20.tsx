// Replica of "TEXT 20" (premium-text pack): white stretched Anton "ADD LYRIC" scatter-blurs in (CC Scatterize 33 -> 0, fade 0.48 s)
// over a red script word ("Animations") that rises in as a soft wave (Offset -100 -> 100, scale 72%, blur 7) wrapped in two Glow
// effects (radius 30 and 175). Impact -> Anton, Sloop Script Three -> Great Vibes.
// Approximations: CC Scatterize is blur + per-letter jitter; the Range Selector offset is mapped to a hidden->revealed wave.
import React from "react";
import { random } from "remotion";
import { PLayer, SCRIPT, between, prog, waveReveal } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["ADD LYRIC", "Animations"], colors: ["#FFFFFF", "#FF0000"] };

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const sc = between(t, 0, 33, 0.367, 0, [0.01, 0.27, 0.532, 1]);
  const u = prog(t, 0.217, 1.468, [0.248, 0, 0.136, 0.874]);
  const out = between(t, 2.586, 1, 2.836, 0);
  const red = colors[1] ?? DEF.colors[1];
  return (
    <>
      <PLayer
        text={texts[0] ?? DEF.texts[0]} font="Anton" size={134} color={colors[0] ?? DEF.colors[0]}
        pos={[957.5132, 546.2346]} anchorUp={46} scale={[135, 173]} shadow={{ d: 6, s: 5 }}
        opacity={between(t, 0, 0.01, 0.484, 1, [0.167, 0, 0.667, 1])}
        blur={sc * 0.25}
        chars={(i) => ({ x: (random(`t20x-${i}`) - 0.5) * sc * 1.2, y: (random(`t20y-${i}`) - 0.5) * sc * 1.2 })}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]} font={SCRIPT} size={222} color={red}
        pos={[926.9054, 569.0945]} anchorUp={21} scale={[78, 78]} capMid={0.3}
        opacity={t >= 0.217 ? out : 0}
        shadow={{ d: 6, s: 5 }}
        glow={[{ r: 10, a: 0.9 }, { r: 70, a: 0.55 }]}
        chars={(i, n) => {
          const r = waveReveal(i, n, u, 0.5);
          return { opacity: r, sx: 0.72 + 0.28 * r, blur: 3.5 * (1 - r), track: -2.7 * (1 - r) };
        }}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-20",
  name: "TEXT 20",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.002,
  fonts: ["Anton", SCRIPT],
  texts: DEF.texts,
  colors: DEF.colors,
  Component,
};
export default def;
