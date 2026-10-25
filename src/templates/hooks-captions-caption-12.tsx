// Replica of the "Caption 12" Premiere template (skills/motion-templates/templates/hooks-captions-caption-12.md).
// Fade + un-blur; line 1 spins in from -120 deg, line 2 from +120 deg (about their anchors), line 3 slides in from the right (x 1554 -> 736), line 4 word slide-up.
import React from "react";
import { CaptionStack, type CaptionItem } from "./ae-captions-b";
import type { TemplateDef, TemplateProps } from "./types";

const T = (o: CaptionItem): CaptionItem => o;
const ITEMS: CaptionItem[] = [
  T({ text: "I will", color: "#FFFFFF", font: "sans", comp: [186, 72], just: "right", anchor: [186, 36], pos: [492.21, 1104.91], slider: [0, 0], scale: 50, tIn: 0, fx: { kind: "none" }, blur: true, rotFrom: -120 }),
  T({ text: "explain", color: "#FFD100", font: "sans", comp: [322, 89], just: "left", anchor: [0, 44.5], pos: [509.92, 1109.83], slider: [0, 0], scale: 50, tIn: 0.12, fx: { kind: "none" }, blur: true, rotFrom: 120 }),
  T({ text: "how much", color: "#FFD100", font: "sans", comp: [455, 74], just: "center", pos: [1554, 1263.5], posTo: [736, 1263.5], slider: [0, -85], scale: 100, tIn: 0.24, fx: { kind: "none" }, blur: true }),
  T({ text: "do you need to start camper", color: "#FFFFFF", font: "sans", comp: [1240, 89], just: "center", pos: [466, 1252.57], slider: [0, 0], scale: 40, tIn: 0.4, fx: { kind: "slide" } }),
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => <CaptionStack items={ITEMS} t={t} texts={texts} colors={colors} />;

const def: TemplateDef = {
  slug: "hooks-captions-caption-12",
  name: "Caption 12",
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
