// Replica of "TEXT 16" (premium-text pack): big orange Impact "LYRICS" whose letters drop in with a damped-cosine bounce
// (Expression Selector: 20*cos(3t*2pi)/e^(8t), 0.04 s per letter; letters start scaled 0, 535 px up, rotated 26 deg),
// plus an orange->red gradient script word flying in from the left ("Add") and one from the right ("Here"), both
// un-blurring from 36.5.  Impact -> Anton, Sloop Script Three -> Great Vibes.
// Approximations: Strobe Light is a random 25% black flash (0.05 s per 0.1 s slot) from 0.5 s on; CC Light Sweep is a static
// soft highlight band; Gradient Ramp is a per-letter linear gradient.
import React from "react";
import { random } from "remotion";
import { PLayer, SCRIPT, between, prog } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["Add", "LYRICS", "Here"], colors: ["#FF7400", "#FF9600", "#FFB800"] };
const B: [number, number, number, number] = [0.333, 0, 0.667, 1];
const POS: [number, number, number, number] = [0, 0.76, 0.15, 1];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  // strobe on LYRICS
  const slot = Math.floor(t / 0.1);
  const strobe = t > 0.5 && t % 0.1 < 0.05 && random(`t16-strobe-${slot}`) < 0.25;

  const addBlur = between(t, 0.317, 36.5, 0.984, 0, B);
  const hereBlur = between(t, 0.384, 36.5, 1.051, 0, B);
  return (
    <>
      <PLayer
        text={texts[0] ?? DEF.texts[0]}
        font={SCRIPT}
        size={134}
        color={colors[0] ?? DEF.colors[0]}
        gradient={[colors[0] ?? DEF.colors[0], "#FF0000", 200]}
        pos={[between(t, 0.317, 31.3143, 1.218, 507.2571, POS), 427.0286]}
        anchorUp={-8}
        scale={[100, 100]}
        capMid={0.3}
        opacity={t < 0.317 ? 0 : prog(t, 0.317, 0.984, B)}
        blur={addBlur}
        sweeps={[{ k: 0.5, w: 0.18, a: 0.35 }]}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]}
        font="Anton"
        size={134}
        color={colors[1] ?? DEF.colors[1]}
        pos={[960, 542]}
        anchorUp={57}
        scale={[247, 247]}
        filter={strobe ? "brightness(0.25)" : undefined}
        sweeps={[{ k: 0.47, w: 0.14, a: 0.4 }]}
        chars={(i) => {
          const tt = t - 0.04 * (i + 1);
          const a = tt >= 0 ? (20 * Math.cos(3 * tt * 2 * Math.PI)) / Math.exp(8 * tt) : 100;
          return { sx: Math.max(0, 1 - a / 100), y: (-535 * a) / 100, rot: (26 * a) / 100 };
        }}
      />
      <PLayer
        text={texts[2] ?? DEF.texts[2]}
        font={SCRIPT}
        size={134}
        color={colors[2] ?? DEF.colors[2]}
        gradient={[colors[2] ?? DEF.colors[2], "#FF0000", 200]}
        pos={[between(t, 0.384, 2032.3143, 1.285, 1333.2571, POS), 795.0286]}
        anchorUp={-8}
        scale={[105, 105]}
        capMid={0.3}
        opacity={t < 0.384 ? 0 : prog(t, 0.384, 1.051, B)}
        blur={hereBlur}
        sweeps={[{ k: 0.5, w: 0.18, a: 0.3 }]}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-16",
  name: "TEXT 16",
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
