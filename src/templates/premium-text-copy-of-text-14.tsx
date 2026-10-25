// Replica of "TEXT 14" (premium-text pack): three heavy words that un-blur in one after another (Gaussian Blur 33.8 -> 0),
// with a big soft Glow + Drop Shadow; the last word is green and tilted 16 deg. Source font GillSans-UltraBold -> Montserrat 800.
// Approximations: AE Glow (radius 234, threshold 153) is two stacked soft drop-shadows in the text colour.
import React from "react";
import { PLayer, between } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const FONT = "Montserrat";
const L = [
  { text: "PLACE", color: "#FFFFFF", at: 0.1, size: 134, scale: 219, pos: [960, 415.5181], rot: 0 },
  { text: "LYRICS", color: "#FFFFFF", at: 0.284, size: 134, scale: 189, pos: [960, 691.5181], rot: 0 },
  { text: "HERE", color: "#18FF00", at: 0.45, size: 126, scale: 215, pos: [964, 527.5181], rot: 16 },
] as const;

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => (
  <>
    {L.map((l, i) => {
      const col = colors[i] ?? l.color;
      return (
        <PLayer
          key={i}
          text={texts[i] ?? l.text}
          font={FONT}
          weight={800}
          upper
          size={l.size}
          color={col}
          pos={[l.pos[0], l.pos[1]]}
          anchorUp={45}
          scale={[l.scale, l.scale]}
          rot={l.rot}
          opacity={t >= l.at ? 1 : 0}
          blur={between(t, l.at, 33.8, l.at + 0.384, 0, [0, 0.75, 0.23, 1])}
          glow={[{ r: 40, a: 0.45 }, { r: 14, a: 0.3 }]}
          shadow={{ d: 13, s: 22 }}
        />
      );
    })}
  </>
);

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-14",
  name: "TEXT 14",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.002,
  fonts: [FONT],
  texts: L.map((l) => l.text),
  colors: L.map((l) => l.color),
  Component,
};
export default def;
