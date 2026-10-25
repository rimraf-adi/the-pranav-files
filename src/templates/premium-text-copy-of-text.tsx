// Replica of "TEXT 18" (file name premium-text-copy-of-text, premium-text pack): three magenta Anton words (PLACE / LYRICS / HERE)
// stacked; every letter pops in from scale 0 with an elastic overshoot (Expression Selector: linear 0.1 s then
// sin(3 cycles)/e^(7t) bounce, 0.2 frames per letter). LYRICS has a drop shadow and light sweep. Impact -> Anton.
// Approximation: LYRICS position was not exported, (960,527) was inferred from the preview; sweep is a static band.
import React from "react";
import { PLayer, bounceAmount } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const L = [
  { text: "PLACE", at: 0, pos: [960, 344], up: 94, scale: 118, shadow: undefined, sweep: false },
  { text: "LYRICS", at: 0.25, pos: [960, 527], up: 43, scale: 175, shadow: { d: 17, s: 41 }, sweep: true },
  { text: "HERE", at: 0.484, pos: [960, 606], up: 94, scale: 118, shadow: { d: 10, s: 0 }, sweep: false },
] as const;

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {L.map((l, li) => (
      <PLayer
        key={li}
        text={texts[li] ?? l.text}
        font="Anton"
        size={134}
        color={colors[li] ?? "#EA00FF"}
        pos={[l.pos[0], l.pos[1]]}
        anchorUp={l.up}
        scale={[l.scale, l.scale]}
        opacity={t >= l.at ? 1 : 0}
        shadow={l.shadow ? { d: l.shadow.d, s: l.shadow.s } : undefined}
        sweeps={l.sweep ? [{ k: 0.35, w: 0.18, a: 0.45 }] : undefined}
        chars={(i) => {
          const a = bounceAmount(t - l.at - (i + 1) * (1 / 59.94) * 0.2);
          return { sx: Math.max(0, 1 - a / 100) };
        }}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "premium-text-copy-of-text",
  name: "TEXT 18",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.002,
  fonts: ["Anton"],
  texts: L.map((l) => l.text),
  colors: ["#EA00FF", "#EA00FF", "#EA00FF"],
  Component,
};
export default def;
