import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import type { Tone } from "../schema/timeline";
import style from "../../styles/gadzhi.json";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "900"],
  subsets: ["latin"],
});
loadFont("italic", { weights: ["500", "900"], subsets: ["latin"] });

const ref = style.reference;
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const toneColor = (t: Tone) => ref.title.palette[t];
export const washColor = (t: Tone) => ref.title.wash.colors[t];

/** Fraction 0..1 of a "fade in at start, fade out at end" envelope, in seconds. */
export const useEnvelope = (inSec: number, outSec: number) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, inSec * fps, durationInFrames - outSec * fps, durationInFrames],
    [0, 1, 1, 0],
    clamp,
  );
};

/** Colored gradient wash from the top, tinted to the title tone. */
export const Wash: React.FC<{
  tone: Tone;
  height?: number;
  strength?: number;
}> = ({ tone, height = 46, strength = 0.95 }) => {
  const e = useEnvelope(ref.title.wash.fadeInSec, ref.title.anim.exitSec);
  const c = washColor(tone);
  return (
    <AbsoluteFill
      style={{
        opacity: e * strength,
        background: `linear-gradient(to bottom, ${c} 0%, ${c} ${height * 0.45}%, ${c}00 ${height}%)`,
      }}
    />
  );
};

/** Text that blur-resolves letter by letter (reference title entrance). */
export const BlurText: React.FC<{
  text: string;
  size: number;
  color: string;
  delaySec?: number;
  seed: string;
  italic?: boolean;
  weight?: 500 | 900;
}> = ({
  text,
  size,
  color,
  delaySec = 0,
  seed,
  italic = false,
  weight = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const a = ref.title.anim;
  const exitStart = durationInFrames - a.exitSec * fps;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        whiteSpace: "pre",
        fontFamily,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 0.95,
        color,
        textTransform: "uppercase",
      }}
    >
      {[...text].map((ch, i) => {
        const d = (delaySec + random(`${seed}-${i}`) * 0.1) * fps;
        const inP = interpolate(frame, [d, d + a.lineBlurInSec * fps], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const outP = interpolate(
          frame,
          [exitStart, exitStart + a.exitSec * fps],
          [0, 1],
          clamp,
        );
        const p = inP * (1 - outP);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              filter: `blur(${(1 - p) * a.blurPx}px)`,
              transform: `scale(${1 + (1 - p) * 0.08})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Width-aware font size for heavy uppercase text. */
export const fitSize = (text: string, maxSize: number, widthPx: number) =>
  Math.min(maxSize, widthPx / (Math.max(1, text.length) * 0.84));
