// Replica of the "Caption 01" Premiere template (skills/motion-templates/templates/hooks-captions-caption-01.md).
// Four word-groups, each a text layer with an Expression-Selector animator: words start 1 frame apart and ease
// (1 - 2^(-10x), 8 frames) from an offset/blurred/transparent state. Layers enter 0 / .12 / .24 / .52 s.
import React from "react";
import { AnimText } from "./ae";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;
const FONT = "Inter"; // source: NHaasGroteskDSPro-75Bd (not on Google Fonts)

type Item = { text: string; color: string; box: [number, number]; pos: [number, number]; anchor: [number, number]; scale: number; at: number; from: { x: number; y: number } };
const ITEMS: Item[] = [
  { text: "You might be", color: "#FFFFFF", box: [573, 90], pos: [153.39, 1125.3], anchor: [0, 90], scale: 50, at: 0, from: { x: 300, y: 0 } },
  { text: "missing", color: "#FFFFFF", box: [343, 90], pos: [153.4, 1226.53], anchor: [0, 45], scale: 200, at: 0.12, from: { x: 0, y: 100 } },
  { text: "this part", color: "#FFED00", box: [367, 89], pos: [158.92, 1365.54], anchor: [0, 44.5], scale: 150, at: 0.24, from: { x: 300, y: 0 } },
  { text: "today.", color: "#FFFFFF", box: [271, 89], pos: [153.61, 1460.85], anchor: [0, 0], scale: 70, at: 0.52, from: { x: 0, y: 100 } },
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {ITEMS.map((it, i) => (
      <AnimText
        key={i}
        text={texts[i] ?? it.text}
        color={colors[i] ?? it.color}
        font={FONT}
        size={100}
        box={{ w: it.box[0], h: it.box[1] }}
        pos={it.pos}
        anchor={it.anchor}
        scale={it.scale}
        t={t}
        at={it.at}
        fps={FPS}
        delayF={1}
        durF={8}
        unit="word"
        from={{ x: it.from.x, y: it.from.y, opacity: 0, blur: 100, scale: 100 }}
        seed={`c01-${i}`}
      />
    ))}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-01",
  name: "Caption 01",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 10,
  fonts: [FONT],
  texts: ITEMS.map((i) => i.text),
  colors: ITEMS.map((i) => i.color),
  Component,
};
export default def;
