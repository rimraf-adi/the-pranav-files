// Replica of "Caption 08": "Nobody" slides in from the right while un-blurring, "talks" and "it." fade in from blur,
// "about" (Geometry2) scales up 0 -> 100% about its baseline. Fast Box Blur 15 -> 0 over 1s on every layer.
// Layers enter 0 / .16 / .36 / .84s.
import React from "react";
import { CapLayer, key } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

type L = { text: string; color: string; just: "left" | "center" | "right"; w: number; h: number; origin: [number, number]; anchor: [number, number]; pos: [number, number]; scale: number; at: number };
const L: L[] = [
  { text: "Nobody", color: "#FFFFFF", just: "right", w: 353, h: 89, origin: [352.244, 71.993], anchor: [353, 89], pos: [733.584 + 50, 1152.402 + 19], scale: 50, at: 0 },
  { text: "talks", color: "#FFF100", just: "left", w: 217, h: 74, origin: [-1.078, 72.197], anchor: [0, 0], pos: [383.728 + 50, 1177.968], scale: 75, at: 0.16 },
  { text: "about", color: "#00FFF6", just: "center", w: 259, h: 74, origin: [129.128, 72.197], anchor: [0, 37], pos: [237.072 + 50, 1286.983], scale: 150, at: 0.36 },
  { text: "it.", color: "#FFFFFF", just: "left", w: 77, h: 73, origin: [-3.786, 72.201], anchor: [77, 0], pos: [521.033 + 50, 1376.453], scale: 50, at: 0.84 },
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
        just={l.just}
        origin={l.origin}
        anchor={l.anchor}
        pos={i === 0 ? [key(t, 0, 1, 733.584 + 50, 455.584 + 50), l.pos[1]] : l.pos}
        scale={l.scale}
        at={l.at}
        blur={key(t, l.at, l.at + 1, 15, 0)}
        geoScale={i === 2 ? key(t, l.at, l.at + 1, 0, 100) : undefined}
        geoAnchor={i === 2 ? [129.5, 50.528] : undefined}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-08",
  name: "Caption 08",
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
