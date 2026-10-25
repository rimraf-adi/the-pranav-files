// Replica of premium-text "ADDTEXT" (comp TXT 10, 1920x1080 @59.94, 2.27s).
// Anton, random-order letter fade-in (Start 0->100 over 1s, seed time*15), scale 0->150%, big magenta glow blob,
// two CC Light Sweeps (approximated by one gradient pass 0.03s->1.24s). Glow approximated by blurred duplicate.
import React from "react";
import { track } from "./ae";
import { PLayer, randomReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const FONT = "Anton";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const p = track(t, [{ t: 0, v: 0 }, { t: 1.001, v: 1 }]);
  const sc = track(t, [{ t: 0, v: 0, bez: [0.4, 0, 0.2, 1] }, { t: 1.001, v: 150 }]);
  return (
    <PLayer
      text={texts[0] ?? "ADDTEXT"}
      font={FONT}
      weight={400}
      color={colors[0] ?? "#C000FF"}
      pos={[955.4, 532.7]}
      anchorY={-53}
      capH={0.73}
      scale={sc}
      amount={randomReveal(p, "addtext", 15, t)}
      from={{ opacity: 0 }}
      shadow={{ dist: 5, soft: 17, op: 136.5 }}
      glow={{ padX: 190, padY: 235, blur: 40, opacity: 0.95, lighten: 0.55 }}
      sweep={{ p: track(t, [{ t: 0.033, v: 0 }, { t: 1.235, v: 1 }]), width: 50, intensity: 50 }}
    />
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-addtext",
  name: "Add Text",
  w: 1920, h: 1080, fps: 59.94, durationSec: 2.269,
  fonts: [FONT],
  texts: ["ADDTEXT"],
  colors: ["#C000FF"],
  Component,
};
export default def;
