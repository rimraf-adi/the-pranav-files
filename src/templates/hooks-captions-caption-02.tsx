// Replica of "Caption 02": right-aligned stack, each line a precomp with a per-word Expression-Selector animator
// (1 frame apart, expo-out over 8 frames) easing from an offset/blurred/transparent state. Layers enter 0/.24/.4/.56s.
import React from "react";
import { CapLayer } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;
type L = { text: string; color: string; w: number; h: number; origin: [number, number]; anchor: [number, number]; pos: [number, number]; scale: number; at: number; from: { x: number; y: number } };
const L: L[] = [
  { text: "Life is", color: "#FFFFFF", w: 255, h: 74, origin: [255.962, 72.5], anchor: [255, 74], pos: [946.313, 1157.295], scale: 120, at: 0, from: { x: 300, y: 0 } },
  { text: "shorter", color: "#00FFD7", w: 332, h: 74, origin: [332.769, 72.197], anchor: [332, 37], pos: [941.344, 1258.53], scale: 200, at: 0.24, from: { x: 0, y: 100 } },
  { text: "than", color: "#FFFFFF", w: 225, h: 89, origin: [215.009, 79.349], anchor: [225, 44.5], pos: [948.412, 1397.537 - 23], scale: 60, at: 0.4, from: { x: 300, y: 0 } },
  { text: "your reality", color: "#F0FF00", w: 505, h: 89, origin: [504.565, 71.993], anchor: [505, 0], pos: [943.802, 1492.85 - 70], scale: 100, at: 0.56, from: { x: 0, y: 100 } },
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {L.map((l, i) => (
      <CapLayer
        key={i}
        t={t}
        text={texts[i] ?? l.text}
        color={colors[i] ?? l.color}
        w={l.w}
        h={l.h}
        just="right"
        origin={l.origin}
        anchor={l.anchor}
        pos={l.pos}
        scale={l.scale}
        at={l.at}
        reveal={{ from: { x: l.from.x, y: l.from.y, opacity: 0, blur: 100, scale: 100 }, delayF: 1, durF: 8, fps: FPS }}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-02",
  name: "Caption 02",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 10,
  fonts: ["Inter"],
  texts: L.map((l) => l.text),
  colors: L.map((l) => l.color),
  Component,
};
export default def;
