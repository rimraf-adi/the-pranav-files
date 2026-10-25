// Replica of "TEXT 22" (premium-text pack): white Inter Bold "FINAL" drops in from the top and "HERE" rises from the bottom
// (stretched 123% / 139% wide, Gaussian Blur 25 -> 0, fade, drop shadow) onto a red vertically-squashed "LYRICS" (scale 100x50)
// that is uncovered from its last letter to its first (Range Selector End 100 -> 0).
// Approximation: HERE's baseline offset (anchor not exported) was matched to the preview.
import React from "react";
import { PLayer, between, endCov } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["FINAL", "LYRICS", "HERE"], colors: ["#FFFFFF", "#FF0000", "#FFFFFF"] };

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const e = between(t, 0.067, 100, 1.068, 0, [0.43, 0, 0.213, 1]);
  return (
    <>
      <PLayer
        text={texts[0] ?? DEF.texts[0]} font="Inter" weight={700} size={134} color={colors[0] ?? DEF.colors[0]}
        pos={[between(t, 0, 968.0104, 1.018, 963.188, [0, 0.77, 0.17, 1]), between(t, 0, 34.2907, 1.018, 512.2907, [0, 0.77, 0.17, 1])]}
        anchorUp={0} scale={[123.0722, 100]} shadow={{ d: 7, s: 6 }}
        opacity={between(t, 0.033, 0, 1.034, 1, [0, 0.16, 0.61, 1])}
        blur={between(t, 0, 25.3, 1.001, 0, [0, 0.14, 0.37, 1])}
      />
      <PLayer
        text={texts[1] ?? DEF.texts[1]} font="Inter" weight={700} size={134} color={colors[1] ?? DEF.colors[1]}
        pos={[963.1802, 542.3402]} anchorUp={48.7273} scale={[100, 50]} shadow={{ d: 7, s: 6 }}
        chars={(i, n) => ({ opacity: 1 - endCov(i, n, e) })}
      />
      <PLayer
        text={texts[2] ?? DEF.texts[2]} font="Inter" weight={700} size={134} color={colors[2] ?? DEF.colors[2]}
        pos={[between(t, 0, 947.0104, 1.001, 958.0013, [0, 0.48, 0.27, 1]), between(t, 0, 918.5017, 1.001, 669.5017, [0, 0.48, 0.27, 1])]}
        anchorUp={-79} scale={[139.0154, 100]} shadow={{ d: 7, s: 6 }}
        opacity={between(t, 0, 0, 1.001, 1, [0, 0.14, 0.37, 1])}
        blur={between(t, 0, 25.3, 1.001, 0, [0, 0.14, 0.37, 1])}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-22",
  name: "TEXT 22",
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
