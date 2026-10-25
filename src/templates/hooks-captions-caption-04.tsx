// Replica of "Caption 04": four centred lines slide up from below the frame (Position keys, 1s, AE ease 16.67/100),
// staggered 0 / .2 / .4 / .6s. "This is" + "where" share the first row.
import React from "react";
import { CapLayer, key } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

type L = { text: string; color: string; w: number; h: number; origin: [number, number]; anchor: [number, number]; x: number; y0: number; y1: number; scale: number; at: number };
const L: L[] = [
  { text: "This is", color: "#00FFE6", w: 282, h: 74, origin: [140.67, 72.197], anchor: [141, 37], x: 541.558 - 98, y0: 1982.295 + 85, y1: 1144.295 + 85, scale: 60, at: 0 },
  { text: "where", color: "#FFFFFF", w: 284, h: 74, origin: [142.658, 72.248], anchor: [142, 37], x: 527.187 + 106, y0: 2099.737 - 32, y1: 1261.737 - 32, scale: 60, at: 0.2 },
  { text: "the opportunity", color: "#F3FF00", w: 698, h: 89, origin: [348.108, 71.993], anchor: [349, 44.5], x: 540.183, y0: 2241.982 - 85, y1: 1403.982 - 85, scale: 100, at: 0.4 },
  { text: "starts", color: "#FFFFFF", w: 263, h: 69, origin: [131.624, 67.633], anchor: [131.5, 34.5], x: 542.39, y0: 2364.553 - 113, y1: 1526.553 - 113, scale: 100, at: 0.6 },
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
        pos={[l.x, key(t, l.at, l.at + 1, l.y0, l.y1)]}
        scale={l.scale}
        at={l.at}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-04",
  name: "Caption 04",
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
