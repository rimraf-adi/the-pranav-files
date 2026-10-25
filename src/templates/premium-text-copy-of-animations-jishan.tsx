// Replica of premium-text "Animations (jishan)" (comp TXT 2, 1920x1080 @23.976, 3.46s).
// ADD / HERE: Anton, scale 0->43% bezier; ANIMATIONS: Impact(Anton) red, per-letter damped spring pop
// (delay .05s, freq 2, amp 80, decay 9; from offset -156,-117 and scale 0) plus a CC Light Sweep (approximated gradient).
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, springAmount } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const FONT = "Anton";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const small = track(t, [{ t: 0, v: 0, bez: [0.4, 0, 0.2, 1] }, { t: 1.627, v: 43 }]);
  const shadow = { dist: 5, soft: 5, op: 127.5 };
  const posAnim = bezier(0, 0.65, 0.3, 1);
  void posAnim;
  return (
    <>
      <PLayer text={texts[0] ?? "ADD"} font={FONT} caps color={colors[0] ?? "#FFFFFF"} pos={[964, 456]} anchorY={-45.4}
        capH={0.73} scale={small} shadow={shadow} />
      <PLayer text={texts[1] ?? "ANIMATIONS"} font={FONT} caps color={colors[1] ?? "#FF0000"} pos={[960, 540]} anchorY={-48}
        capH={0.73} amount={springAmount(t, 0, 0.05, 2, 80, 9)} from={{ x: -156, y: -117, scale: 0, opacity: 1 }}
        shadow={shadow} sweep={{ p: track(t, [{ t: 0, v: 0 }, { t: 2.002, v: 1 }]), width: 50, intensity: 25, dir: -1 }} />
      <PLayer text={texts[2] ?? "HERE"} font={FONT} caps color={colors[2] ?? "#FF0000"} pos={[961, 618]} anchorY={-40.7}
        capH={0.73} scale={small} shadow={shadow} />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-animations-jishan",
  name: "Animations (Jishan)",
  w: 1920, h: 1080, fps: 23.976, durationSec: 3.462,
  fonts: [FONT],
  texts: ["ADD", "ANIMATIONS", "HERE"],
  colors: ["#FFFFFF", "#FF0000", "#FF0000"],
  Component,
};
export default def;
