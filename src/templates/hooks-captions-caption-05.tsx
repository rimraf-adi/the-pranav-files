// Replica of "Caption 05": centred stack; every layer un-blurs (Fast Box Blur 15 -> 0 over 1s). "the logic" (Playfair
// italic, Geometry2) scales up 0 -> 100% about its baseline; "behind it." slides in from the right.
// Layers enter 0 / .2 / .4 / .68s.
import React from "react";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { CapLayer, INTER, PLAYFAIR_ITALIC, SLIDE0, key } from "./ae-captions-a";
import type { TemplateDef, TemplateProps } from "./types";

try { loadFont("italic", { weights: ["400"] }); } catch { /* falls back to synthetic italic */ }

const L = [
  { text: "Here", color: "#00FFE6", w: 214, h: 74, origin: [105.09, 72.248] as [number, number], anchor: [107, 37] as [number, number], pos: [369.558 - 100, 1144.295 + 85] as [number, number], scale: 60, at: 0 },
  { text: "is", color: "#FFFFFF", w: 70, h: 74, origin: [33.563, 72.197] as [number, number], anchor: [35, 37] as [number, number], pos: [272.187 + 100, 1261.737 - 32] as [number, number], scale: 60, at: 0.2 },
  { text: "the logic", color: "#F3FF00", w: 346, h: 99, origin: [171.413, 79.505] as [number, number], anchor: [173, 49.5] as [number, number], pos: [540.183, 1403.982 - 85] as [number, number], scale: 100, at: 0.4 },
  { text: "behind it.", color: "#FFFFFF", w: 404, h: 74, origin: [201.564, 72.197] as [number, number], anchor: [202, 37] as [number, number], pos: [1019.39, 1410.553] as [number, number], scale: 100, at: 0.68 },
];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {L.map((l, i) => {
      const pos: [number, number] = i === 3 ? [key(t, l.at, l.at + 1, 1019.39, 758.39, SLIDE0), l.pos[1]] : l.pos;
      return (
        <CapLayer
          key={i}
          t={t}
          text={texts[i] ?? l.text}
          color={colors[i] ?? l.color}
          fam={i === 2 ? PLAYFAIR_ITALIC : INTER}
          w={l.w}
          h={l.h}
          just="center"
          origin={l.origin}
          anchor={l.anchor}
          pos={pos}
          scale={l.scale}
          at={l.at}
          blur={key(t, l.at, l.at + 1, 15, 0)}
          geoScale={i === 2 ? key(t, l.at, l.at + 1, 0, 100) : undefined}
          geoAnchor={i === 2 ? [173, 67.598] : undefined}
        />
      );
    })}
  </>
);

const def: TemplateDef = {
  slug: "hooks-captions-caption-05",
  name: "Caption 05",
  w: 1080,
  h: 1920,
  fps: 25,
  durationSec: 10,
  fonts: ["Inter", "Playfair Display"],
  texts: L.map((l) => l.text),
  colors: L.map((l) => l.color),
  Component,
};
export default def;
