// Replica of the "Caption 10" Premiere template (skills/motion-templates/templates/hooks-captions-caption-10.md).
// Layers fade in over 1 s; lines 2-4 also run a 'Slide Down By Character' animator (words slide up from 100 px, ramp-up range).
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "Here is", color: "#FFFFFF", font: "sans", comp: [304, 74], just: "center", pos: [301.56, 1148.3], slider: [0, 85], scale: 50, tIn: 0, fx: { kind: "none" } }),
  T({ text: "what makes the difference", color: "#00F9FF", font: "sans", comp: [1184, 74], just: "center", pos: [378.19, 1319.74], slider: [106, -32], scale: 60, tIn: 0.12, fx: { kind: "slide" } }),
  T({ text: "using", color: "#FFFFFF", font: "sans", comp: [238, 90], just: "center", pos: [423.18, 1440.98], slider: [0, -85], scale: 45, tIn: 0.24, fx: { kind: "slide" } }),
  T({ text: "artifical intelligence.", color: "#F3FF00", font: "sans", comp: [904, 90], just: "center", pos: [695.41, 1524.55], slider: [0, -113], scale: 60, tIn: 0.4, fx: { kind: "slide" } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-10",
  name: "Caption 10",
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
