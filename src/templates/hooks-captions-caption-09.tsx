// Replica of the "Caption 09" Premiere template (skills/motion-templates/templates/hooks-captions-caption-09.md).
// Four text layers (0 / .12 / .24 / .40 s) fade in over 1 s with a typewriter range-selector animator (chars, opacity 0, 1 s; 2.04 s for line 4).
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "This is", color: "#FFFFFF", font: "sans", comp: [282, 74], just: "center", pos: [486.56, 1144.3], slider: [-98, 85], scale: 60, tIn: 0, fx: { kind: "type", dur: 1 } }),
  T({ text: "what", color: "#FFFFFF", font: "sans", comp: [222, 73], just: "right", anchor: [222, 36.5], pos: [278.19, 1321.74], slider: [106, -32], scale: 60, tIn: 0.12, fx: { kind: "type", dur: 1 } }),
  T({ text: "experienced", color: "#F3FF00", font: "sans", comp: [563, 89], just: "left", anchor: [0, 44.5], pos: [407.18, 1374.98], slider: [0, -85], scale: 80, tIn: 0.24, fx: { kind: "type", dur: 1 } }),
  T({ text: "founders do.", color: "#F3FF00", font: "sans", comp: [558, 74], just: "center", pos: [626.41, 1468.55], slider: [0, -113], scale: 60, tIn: 0.4, fx: { kind: "type", dur: 2.04 } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-09",
  name: "Caption 09",
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
