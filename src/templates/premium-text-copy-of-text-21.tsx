// Replica of "TEXT 21" (premium-text pack): "PLACE" above and "HERE" below an italic magenta "TXTFX" that slides in from the left
// with two light sweeps. The white words build letter by letter: Range Selector Start 0 -> 100 over 1.4 s (bezier with overshoot),
// each letter starts hidden, 91 px low and 15 px left (animator 1) plus a (7,4) nudge (animator 2). All caps. Inter Bold / Inter
// ExtraBold Italic.  Approximation: the HERE layer's Position was not exported, (960,540) was inferred from the preview.
import React from "react";
import { PLayer, between, prog, startCov } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["plACE", "TXTFX", "here"], colors: ["#FFFFFF", "#F800FF", "#FFFFFF"] };

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const s1 = prog(t, -0.083, 1.317, [0.457, -0.042, 0.225, 1.071]) * 100;
  const s2 = prog(t, -0.117, 1.317, [0.466, 0, 0.328, 1]) * 100;
  const chars = (i: number, n: number) => {
    const c1 = startCov(i, n, s1);
    const c2 = startCov(i, n, s2);
    return { x: -15 * c1 + 7 * c2, y: 91 * c1 + 4 * c2, opacity: 1 - c1 };
  };
  const sw = between(t, 0.067, 1.14, 1.502, -0.49);
  return (
    <>
      <PLayer
        text={texts[0] ?? DEF.texts[0]} font="Inter" weight={700} upper size={134} color={colors[0] ?? DEF.colors[0]}
        pos={[960, 262]} anchorUp={160} scale={[115, 115]} capMid={0.36} chars={chars}
      />
      <PLayer
        text={texts[2] ?? DEF.texts[2]} font="Inter" weight={700} upper size={134} color={colors[2] ?? DEF.colors[2]}
        pos={[960, 540]} anchorUp={160} scale={[115, 115]} capMid={0.36} chars={chars}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]} font="Inter" weight={800} italic upper size={134} color={colors[1] ?? DEF.colors[1]}
        letterSpacing={-4.3}
        pos={[between(t, 0, -443, 0.617, 960, [0.2, 0.8, 0.2, 1]), between(t, 0, 546, 0.617, 540, [0.2, 0.8, 0.2, 1])]}
        anchorUp={44} scale={[207, 207]} capMid={0.36}
        sweeps={[{ k: sw, w: 0.2, a: 0.5 }, { k: 0.4, w: 0.08, a: 0.2 }]}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-21",
  name: "TEXT 21",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.019,
  fonts: ["Inter"],
  texts: DEF.texts,
  colors: DEF.colors,
  Component,
};
export default def;
