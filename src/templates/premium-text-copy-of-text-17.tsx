// Replica of "TEXT 17" (premium-text pack): "PLACE" drops in (animator Position y -192 -> 0 + fade, 0.63 s), blue script "Your"
// slides in from the right (x 400 -> 0 + fade, 1.02 s) with a light sweep, "Lyrics" (purple script) and "HERE" flicker in
// (random-order opacity + hold-keyed layer flicker) and flicker out at the end. Impact -> Anton, Sloop -> Great Vibes.
// Approximations: CC Light Sweep -> masked highlight band; Flicker-In End keyframes ignored.
import React from "react";
import { PLayer, SCRIPT, between, holdTrack, prog, ranks, startCov } from "./ae-premium-e";
import type { TemplateDef, TemplateProps } from "./types";

const DEF = { texts: ["PLACE", "Your", "HERE", "Lyrics"], colors: ["#FFFFFF", "#0400FF", "#FFFFFF", "#4C00FF"] };
const B: [number, number, number, number] = [0.333, 0, 0.667, 1];
const SL: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const lyricsOp: [number, number][] = [[0.717, 1], [0.758, 0], [0.8, 0.929945], [0.842, 0], [0.883, 1], [1.258, 1], [1.3, 0], [1.342, 1], [1.383, 0], [1.552, 1], [2.55, 1], [2.592, 0.37], [2.633, 0.62], [2.675, 1]];
const hereOp: [number, number][] = [[1.551, 1], [1.593, 0], [1.634, 0.929945], [1.676, 0], [1.718, 1], [2.093, 1], [2.134, 0], [2.176, 1], [2.218, 0], [2.301, 0.5], [2.384, 1], [3.384, 1], [3.426, 0.37], [3.468, 0.62], [3.509, 1]];

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const tx = (i: number) => texts[i] ?? DEF.texts[i];
  const cl = (i: number) => colors[i] ?? DEF.colors[i];
  const len = (s: string) => [...s].filter((c) => !/\s/.test(c)).length;

  const place = prog(t, 0, 0.634, B);
  const your = prog(t, 0, 1.018, B);
  const lyricsStart = between(t, 0.05, 0, 0.49, 100);
  const hereStart = between(t, 0, 0, 0.584, 100);
  const rl = ranks(len(tx(3)), "t17-lyrics");
  const rh = ranks(len(tx(2)), "t17-here");
  const sweepYour = between(t, 0, 0.72, 1.018, -0.33);
  const sweepLyr = t < 0.117 ? between(t, -0.901, 1.57, 0.117, 0.66) : between(t, 0.117, 0.66, 0.501, -0.33);

  return (
    <>
      <PLayer
        text={tx(0)} font="Anton" size={134} color={cl(0)}
        pos={[780, 418]} anchorUp={47} scale={[153, 153]} shadow={{ d: 10, s: 44 }}
        chars={() => ({ y: -192 * (1 - between(t, 0, 0, 0.634, 1, SL)), opacity: place })}
      />
      <PLayer
        text={tx(1)} font={SCRIPT} size={134} color={cl(1)}
        pos={[1148, 384]} anchorUp={47} scale={[187, 187]} shadow={{ d: 5, s: 0 }} capMid={0.3}
        chars={() => ({ x: 400 * (1 - between(t, 0, 0, 1.018, 1, SL)), opacity: your })}
        sweeps={[{ k: sweepYour, w: 0.2, a: 0.5 }, { k: 0.55, w: 0.08, a: 0.2 }]}
      />
      <PLayer
        text={tx(3)} font={SCRIPT} size={134} color={cl(3)}
        pos={[692, 524]} anchorUp={47} scale={[195, 195]} shadow={{ d: 5, s: 0 }} capMid={0.3}
        opacity={holdTrack(t, lyricsOp)}
        chars={(i, n) => ({ opacity: 1 - startCov(rl[i] ?? i, n, lyricsStart) })}
        sweeps={[{ k: sweepLyr, w: 0.2, a: 0.5 }]}
      />
      <PLayer
        text={tx(2)} font="Anton" size={134} color={cl(2)}
        pos={[1145, 581]} anchorUp={57} scale={[155, 155]} shadow={{ d: 10, s: 44 }}
        opacity={holdTrack(t, hereOp)}
        chars={(i, n) => ({ opacity: 1 - startCov(rh[i] ?? i, n, hereStart) })}
      />
    </>
  );
};

const def: TemplateDef = {
  slug: "premium-text-copy-of-text-17",
  name: "TEXT 17",
  w: 1920,
  h: 1080,
  fps: 59.94,
  durationSec: 2.002,
  fonts: ["Anton", SCRIPT],
  texts: ["PLACE", "Your", "HERE", "Lyrics"],
  colors: DEF.colors,
  Component,
};
export default def;
