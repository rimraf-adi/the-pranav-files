// Replica of the "Caption 13" Premiere template (skills/motion-templates/templates/hooks-captions-caption-13.md).
// Line 1 slides in from the right (x 825 -> 408) with un-blur, line 2 is Playfair italic with a typewriter reveal, line 3 un-blurs, line 4 types over 2.04 s.
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "we will", color: "#FFFFFF", font: "sans", comp: [282, 74], just: "center", pos: [825.15, 1226.69], posTo: [408.15, 1226.69], slider: [0, 0], scale: 60, tIn: 0, fx: { kind: "none" }, blur: true }),
  T({ text: "learn", color: "#FFFFFF", font: "serif", comp: [223, 74], just: "center", pos: [297.57, 1287.18], slider: [0, 0], scale: 100, tIn: 0.12, fx: { kind: "type", dur: 1 } }),
  T({ text: "video automation", color: "#F3FF00", font: "sans", comp: [779, 74], just: "center", pos: [530.18, 1448.98], slider: [0, -85], scale: 80, tIn: 0.24, fx: { kind: "none" }, blur: true }),
  T({ text: "step by step.", color: "#FFFFFF", font: "sans", comp: [556, 89], just: "center", pos: [590.41, 1548.55], slider: [0, -113], scale: 40, tIn: 0.4, fx: { kind: "type", dur: 2.04 } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-13",
  name: "Caption 13",
  w: 1080,
  h: 1920,
  fps: 25,
  durationSec: 10,
  fonts: ["Inter", "Playfair Display"],
  texts: ITEMS.map((i) => i.text),
  colors: ITEMS.map((i) => i.color),
  Component,
};
export default def;
