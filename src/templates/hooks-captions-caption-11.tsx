// Replica of the "Caption 11" Premiere template (skills/motion-templates/templates/hooks-captions-caption-11.md).
// Layers fade in over 1 s; lines 1-3 also un-blur (Fast Box Blur 50 -> 0), line 4 runs the word slide-up animator.
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "Let’s simplify", color: "#FFFFFF", font: "sans", comp: [585, 90], just: "right", anchor: [585, 45], pos: [468.56, 1148.3], slider: [0, 85], scale: 50, tIn: 0, fx: { kind: "none" }, blur: true }),
  T({ text: "how", color: "#FFD100", font: "sans", comp: [188, 74], just: "left", anchor: [0, 37], pos: [378.19, 1247.25], slider: [106, -32], scale: 100, tIn: 0.12, fx: { kind: "none" }, blur: true }),
  T({ text: "founders", color: "#FFD100", font: "sans", comp: [406, 74], just: "center", pos: [583.46, 1378.5], slider: [0, -85], scale: 80, tIn: 0.24, fx: { kind: "none" }, blur: true }),
  T({ text: "have future mind.", color: "#FFFFFF", font: "sans", comp: [767, 74], just: "center", pos: [696.61, 1476.43], slider: [0, -113], scale: 40, tIn: 0.4, fx: { kind: "slide" } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-11",
  name: "Caption 11",
  w: 1080,
  h: 1920,
  fps: 25,
  durationSec: 10,
  fonts: ["Inter"],
  texts: ITEMS.map((i) => i.text),
  colors: ITEMS.map((i) => i.color),
  Component,
};
export default def;
