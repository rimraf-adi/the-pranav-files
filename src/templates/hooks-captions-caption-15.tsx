// Replica of the "Caption 15" Premiere template (skills/motion-templates/templates/hooks-captions-caption-15.md).
// Like 14 plus a Number Counter (Playfair italic, 0 -> 750 over 1 s, rises from y 1616 -> 1327) with two white Glow effects; line 4 types over 1.24 s.
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "How to make", color: "#FFFFFF", font: "sans", comp: [571, 74], just: "center", pos: [867.88, 1104.95], slider: [-98, 85], scale: 50, tIn: 0, fx: { kind: "none" }, blur: true }),
  T({ text: "750", color: "#FFFFFF", font: "serif", comp: [200, 81], just: "center", pos: [343.19, 1615.74], posTo: [343.19, 1326.74], slider: [106, -32], scale: 250, tIn: 0.12, fx: { kind: "none" }, baseline: 59.4, dx: 4.6, counter: true, glow: true }),
  T({ text: "dollar in a day", color: "#00FFEF", font: "sans", comp: [604, 89], just: "center", pos: [718.18, 1463.98], slider: [0, -85], scale: 80, tIn: 0.36, fx: { kind: "spring", delay: 0.1, unit: "word" }, blur: true }),
  T({ text: "just cooking in your kitchen.", color: "#FFFFFF", font: "sans", comp: [1240, 90], just: "center", pos: [545.12, 1565.25], slider: [0, -113], scale: 50, tIn: 0.24, fx: { kind: "type", dur: 1.24, infl: 0.7 } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-15",
  name: "Caption 15",
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
