// Replica of "Caption 03": centred 4-line stack; per-word Expression-Selector reveal (1 frame apart, expo-out 8 frames).
// Line 1 rises from +300px, 2 and 4 from +100px, 3 slides from the right. Layers enter 0/.12/.28/.44s.
import React from "react";
import { CapLayer } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;
type L = { text: string; color: string; w: number; h: number; origin: [number, number]; anchor: [number, number]; pos: [number, number]; scale: number; at: number; from: { x: number; y: number } };
const L: L[] = [
  { text: "Most", color: "#00FFE6", w: 219, h: 74, origin: [107.818, 72.197], anchor: [109.5, 37], pos: [541.558, 1158.295], scale: 50, at: 0, from: { x: 0, y: 300 } },
  { text: "people", color: "#FFFFFF", w: 343, h: 90, origin: [176.5, 72.09], anchor: [171.5, 45], pos: [527.187, 1271.737 - 32], scale: 150, at: 0.12, from: { x: 0, y: 100 } },
  { text: "start", color: "#F3FF00", w: 230, h: 89, origin: [114.882, 77.133], anchor: [115, 44.5], pos: [540.183, 1403.982 - 57], scale: 100, at: 0.28, from: { x: 300, y: 0 } },
  { text: "in the wrong place", color: "#D70000", w: 824, h: 89, origin: [410, 71.993], anchor: [412, 44.5], pos: [542.39, 1526.553 - 95], scale: 75, at: 0.44, from: { x: 0, y: 100 } },
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
        just="center"
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
  slug: "hooks-captions-caption-03",
  name: "Caption 03",
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
