// Replica of "Caption 07": "One" and "move" slide in from the left inside their layer box (Geometry2 Position keys,
// clipped), "changes" is typed with a blinking cursor (Animation slider 0 -> .8s, cursor off at 2s), "everything." fades
// in from blur. Every layer also clears a Fast Box Blur 15 -> 0 over 1s. Layers enter 0 / .16 / 0 / .6s.
import React from "react";
import { CapLayer, key } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

type L = { text: string; color: string; just: "left" | "right"; w: number; h: number; origin: [number, number]; anchor: [number, number]; pos: [number, number]; scale: number; at: number };
const L: L[] = [
  { text: "One", color: "#FFFFFF", just: "right", w: 185, h: 75, origin: [185.9, 73.352], anchor: [185, 75], pos: [290.584 + 50, 1284.402 + 19], scale: 50, at: 0 },
  { text: "move", color: "#FFF100", just: "right", w: 244, h: 55, origin: [245.193, 53.231], anchor: [244, 0], pos: [290.728 + 50, 1318.968], scale: 75, at: 0.16 },
  { text: "changes", color: "#00FFF6", just: "left", w: 383, h: 90, origin: [-1.829, 72.09], anchor: [0, 45], pos: [306.072 + 50, 1319.983], scale: 150, at: 0 },
  { text: "everything.", color: "#FFFFFF", just: "left", w: 504, h: 90, origin: [-1.777, 72.09], anchor: [504, 0], pos: [878.033 + 50, 1400.453], scale: 50, at: 0.6 },
];
// Geometry2 slides for layers 0 and 1: [startX, endX(=anchor x), t0, t1]
const GEO: Record<number, [number, number, number, number]> = { 0: [-4.796, 92.5, 0, 1], 1: [-68.681, 99.407, 0.16, 1.24] };

const cursorOn = (t: number) => {
  if (t >= 2) return 0;
  if (t > 0 && t < 0.801) return 1;
  const since = t < 0.801 ? t : t - 0.801;
  return Math.sin(Math.PI * since * 2) >= 0 ? 1 : 0;
};

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {L.map((l, i) => {
      const full = texts[i] ?? l.text;
      const g = GEO[i];
      const text = i === 2 ? full.slice(0, Math.ceil(full.length * Math.min(1, Math.max(0, t / 0.801)))) : full;
      return (
        <CapLayer
          key={i}
          t={t}
          text={text}
          color={colors[i] ?? l.color}
          w={l.w}
          h={l.h}
          just={l.just}
          origin={l.origin}
          anchor={l.anchor}
          pos={l.pos}
          scale={l.scale}
          at={l.at}
          blur={key(t, l.at, l.at + 1, 15, 0)}
          geoOffset={g ? [key(t, g[2], g[3], g[0], g[1]) - g[1], 0] : undefined}
          geoAnchor={g ? [g[1], 0] : undefined}
          cursor={i === 2 ? cursorOn(t) : undefined}
        />
      );
    })}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-07",
  name: "Caption 07",
  w: 1080,
  h: 1920,
  fps: 25,
  durationSec: 10,
  fonts: ["Inter"],
  texts: L.map((l) => l.text),
  colors: L.map((l) => l.color),
  Component,
};
export default def;
