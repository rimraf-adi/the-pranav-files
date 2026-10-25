// Replica of premium-text "Lyrics (jishan)" (comp TXT 1, 1920x1080 @23.976, 3.46s).
// add / HERE: Arial Bold -> Arimo 700, white, random-order letter fade-in (seed time*30). LYRICS: Arial Black ->
// Archivo Black, blue, tracking -63, grows from 0 to 100% (.17s->1.46s, bezier .008,.688,.031,1; vertical scale also
// driven by the Transform effect) with a CC Light Sweep. Approximated: sweep.
import React from "react";
import { bezier, track } from "./ae";
import { PLayer, randomReveal } from "./ae-premium-d";
import type { TemplateDef, TemplateProps } from "./types";

const AR = "Arimo";
const AB = "Archivo Black";
const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const k = bezier(0.008, 0.688, 0.031, 1)(Math.min(1, Math.max(0, (t - 0.167) / 1.293)));
  const p1 = track(t, [{ t: 0, v: 0 }, { t: 0.751, v: 1 }]);
  const p2 = track(t, [{ t: 0.292, v: 0 }, { t: 1.043, v: 1 }]);
  return (
    <>
      <PLayer text={texts[0] ?? "add"} font={AR} weight={700} caps color={colors[0] ?? "#FFFFFF"} pos={[960, 429]} anchorY={-44}
        capH={0.72} amount={randomReveal(p1, "lj-a", 30, t)} from={{ opacity: 0 }} />
      {t >= 0.167 && (
        <PLayer text={texts[1] ?? "LYRICS"} font={AB} weight={400} caps color={colors[1] ?? "#4700FF"} pos={[960, 540]} anchorY={-44}
          capH={0.72} letterSpacing={-8.4} scale={[k * 100, k * k * 100]}
          sweep={{ p: track(t, [{ t: 0.209, v: 0 }, { t: 2.711, v: 1 }]), width: 50, intensity: 25, dir: -1 }} />
      )}
      {t >= 0.292 && (
        <PLayer text={texts[2] ?? "HERE"} font={AR} weight={700} color={colors[2] ?? "#FFFFFF"} pos={[960, 650]} anchorY={-44}
          capH={0.72} amount={randomReveal(p2, "lj-h", 30, t)} from={{ opacity: 0 }} />
      )}
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-lyrics-jishan",
  name: "Lyrics (Jishan)",
  w: 1920, h: 1080, fps: 23.976, durationSec: 3.462,
  fonts: [AR, AB],
  texts: ["add", "LYRICS", "HERE"],
  colors: ["#FFFFFF", "#4700FF", "#FFFFFF"],
  Component,
};
export default def;
