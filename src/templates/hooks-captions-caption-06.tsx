// Replica of "Caption 06": lines slide horizontally into place (Position keys, 1s, AE ease 16.67/100) while a Fast Box
// Blur 15 -> 0 clears. "Most" / "beginners" come from the right (right-aligned), "miss" / "this point." from the left.
// Layers enter 0 / .2 / .4 / .6s.
import React from "react";
import { CapLayer, key } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

type L = { text: string; color: string; just: "left" | "right"; w: number; h: number; origin: [number, number]; anchor: [number, number]; x0: number; x1: number; y: number; scale: number; at: number };
const L: L[] = [
  { text: "Most", color: "#00FFE6", just: "right", w: 219, h: 74, origin: [220.566, 72.197], anchor: [219, 74], x0: 930.763 + 50, x1: 498.763 + 50, y: 1180.445, scale: 100, at: 0 },
  { text: "beginners", color: "#FFFFFF", just: "right", w: 450, h: 90, origin: [450.863, 72.09], anchor: [450, 0], x0: 930.907 + 50, x1: 498.907 + 50, y: 1198.663, scale: 75, at: 0.2 },
  { text: "miss", color: "#F3FF00", just: "left", w: 207, h: 74, origin: [-4.088, 72.197], anchor: [0, 0], x0: 131.294 + 50, x1: 503.294 + 50, y: 1262.068, scale: 150, at: 0.4 },
  { text: "this point.", color: "#FFFFFF", just: "left", w: 434, h: 89, origin: [-1.276, 71.993], anchor: [0, 0], x0: 131.294 + 50, x1: 503.294 + 50, y: 1389.857, scale: 70, at: 0.6 },
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
        pos={[key(t, l.at, l.at + 1, l.x0, l.x1), l.y]}
        scale={l.scale}
        at={l.at}
        blur={key(t, l.at, l.at + 1, 15, 0)}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-06",
  name: "Caption 06",
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
