// Replica of the "Caption 14" Premiere template (skills/motion-templates/templates/hooks-captions-caption-14.md).
// Words pop in with a damped-cosine spring (expression selector: pos y 50, opacity 0; delay .1 s per word, .051 s per char with 30 deg rotation on line 4); line 2 is Playfair italic; line 3 also un-blurs.
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "Let’s", color: "#FFFFFF", font: "sans", comp: [209, 74], just: "center", pos: [264.56, 1144.3], slider: [-98, 85], scale: 50, tIn: 0, fx: { kind: "spring", delay: 0.1, unit: "word" }, fade: false }),
  T({ text: "look at", color: "#FFC900", font: "serif", comp: [291, 81], just: "center", pos: [211.19, 1329.74], slider: [106, -32], scale: 100, tIn: 0.12, fx: { kind: "spring", delay: 0.1, unit: "word" } }),
  T({ text: "what is really", color: "#00FFEF", font: "sans", comp: [579, 89], just: "center", pos: [604.18, 1472.98], slider: [0, -85], scale: 80, tIn: 0.36, fx: { kind: "spring", delay: 0.1, unit: "word" }, blur: true }),
  T({ text: "happening.", color: "#FFFFFF", font: "sans", comp: [497, 90], just: "center", pos: [286.41, 1562.55], slider: [0, -113], scale: 50, tIn: 0.24, fx: { kind: "spring", delay: 0.051, unit: "char", rot: 30 } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-14",
  name: "Caption 14",
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
