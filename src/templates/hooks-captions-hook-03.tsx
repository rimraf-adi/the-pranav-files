// Replica of the "Hook 03" Premiere template (skills/motion-templates/templates/hooks-captions-hook-03.md).
// "Small / changes / big / results" pop in (scale) as a staircase, then each blur-rotate-fades out (0.12-1.04 s of its own
// clock). Six copies of a typed line ("Today, we will speak habits.") fly in from different heights and converge at 3.4 s,
// then "Let's start video." appears inside a growing rounded frame that collapses at 4.96-5.96 s.
import React from "react";
import { clamp01 } from "./ae";
import { INTER, Lyr, ClipRect, RRect, SlideText, POP, bz, kf, lines } from "./ae-hooks";
import type { TemplateDef, TemplateProps } from "./types";

const FPS = 25;

type W = { text: string; color: string; at: number; box: [number, number]; ox: number; base: number; pos: [number, number]; out: [number, number] };
const WORDS: W[] = [
  { text: "Small", color: "#FFFFFF", at: 0, box: [253, 78], ox: 127.17, base: 73.3, pos: [297.296, 896.5828], out: [151.8, 0] },
  { text: "changes", color: "#00F9FF", at: 0.2, box: [383, 90], ox: 190.72, base: 79.3, pos: [452.3997, 978.2222], out: [229.8, 0] },
  { text: "big", color: "#FFFFFF", at: 0.4, box: [132, 90], ox: 65.5, base: 72.12, pos: [607.2875, 1070.8535], out: [79.2, 0] },
  { text: "results", color: "#F3FF00", at: 0.6, box: [306, 74], ox: 151.56, base: 71.3, pos: [734.9719, 1158.0823], out: [183.6, 0] },
];

/** rows of the typed line: [layer in-point, start y, end y] */
const ROWS: [number, number, number][] = [
  [1.08, 1480.0228, 960.9815],
  [1.2, 860.8228, 960.9815],
  [1.32, 448.0228, 962.0132],
  [1.44, 654.4228, 962.0132],
  [1.56, 1067.2228, 962.0132],
  [1.68, 1273.6228, 962.0132],
];
const T5_BOX: [number, number] = [1212, 90];
const T6_BOX: [number, number] = [724, 74];
const TYPE_DUR = 1.28;

/** Text 05: typed in over 1.28 s (centred as it grows) with a blinking cursor, as in the template's cursor animator */
const Typed: React.FC<{ tl: number; text: string; color: string }> = ({ tl, text, color }) => {
  const n = Math.round(clamp01(tl / TYPE_DUR) * text.length);
  const typing = tl > 0 && tl < TYPE_DUR;
  const cursor = typing || Math.sin(Math.PI * (tl - TYPE_DUR) * 4) >= 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 606.67 - 2000,
        top: 71.99 - INTER.baseline * 100,
        width: 4000,
        height: 100,
        lineHeight: "100px",
        display: "flex",
        justifyContent: "center",
        whiteSpace: "pre",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 100,
        letterSpacing: "-0.025em",
        color,
      }}
    >
      {text.slice(0, n)}
      <span style={{ position: "relative", display: "inline-block", width: 0 }}>
        <span style={{ position: "absolute", left: 4, opacity: cursor ? 1 : 0 }}>|</span>
      </span>
    </div>
  );
};

const Component: React.FC<TemplateProps> = ({ t, texts, colors }) => {
  const rw = kf(t, [[3.4, 900], [4.96, 900], [5.96, 0]], [POP, bz(0.8, 0, 1 / 6, 1)]);
  const rh = kf(t, [[3.4, 0], [4.96, 1080], [5.96, 0]], [POP, bz(0.8, 0, 1 / 6, 1)]);
  return (
    <>
      {WORDS.map((w, i) => {
        if (t < w.at) return null;
        const tl = t - w.at;
        const c = clamp01((tl - 0.12) / (1.04 - 0.12));
        return (
          <Lyr key={i} pos={w.pos} anchor={[w.box[0] / 2, w.box[1] / 2]} scale={kf(t, [[w.at, 0], [w.at + 0.48, 100]], [POP])}>
            <SlideText lines={lines(texts[i] ?? w.text)} color={colors[i] ?? w.color} ox={w.ox} base={w.base} outC={c} outPos={w.out} outRot={53} outBlur={100} />
          </Lyr>
        );
      })}
      {ROWS.map(([at, y0, y1], i) =>
        t >= at && t < 3.4 ? (
          <Lyr key={i} pos={[515.7066, kf(t, [[2.56, y0], [3.4, y1]], [bz(1, 0, 0.0388, 1.018)])]} anchor={[T5_BOX[0] / 2, T5_BOX[1] / 2]} scale={49.9772}>
            <Typed tl={t - at} text={texts[4] ?? "Today, we will speak habits."} color={colors[4] ?? "#FFFFFF"} />
          </Lyr>
        ) : null,
      )}
      {t >= 3.4 && (
        <>
          <RRect w={rw} h={rh} r={130} sw={4} cx={540} cy={960} />
          <ClipRect cx={540} cy={960} w={rw} h={rh} r={130}>
            <Lyr pos={[540, 960]} anchor={[T6_BOX[0] / 2, T6_BOX[1] / 2]} scale={70}>
              <SlideText lines={lines(texts[5] ?? "Let's start video.")} color={colors[5] ?? "#FFFFFF"} ox={361.06} base={72.2} inO={-1 + 2 * clamp01(t - 3.4)} />
            </Lyr>
          </ClipRect>
        </>
      )}
    </>
  );
};

const def: TemplateDef = {
  slug: "hooks-captions-hook-03",
  name: "Hook 03",
  w: 1080,
  h: 1920,
  fps: FPS,
  durationSec: 6,
  fonts: ["Inter"],
  texts: [...WORDS.map((w) => w.text), "Today, we will speak habits.", "Let's start video."],
  colors: [...WORDS.map((w) => w.color), "#FFFFFF", "#FFFFFF"],
  Component,
};
export default def;
