import React from "react";
import {
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import type { Tone } from "../schema/timeline";
import style from "../../styles/default.json";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "900"],
  subsets: ["latin"],
});

const blur = { lineBlurInSec: 0.25, blurPx: 14, exitSec: 0.12 };
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const toneColor = (t: Tone) => style.tones[t];

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

/** Text that blur-resolves letter by letter . */
export const BlurText: React.FC<{
  text: string;
  size: number;
  color: string;
  delaySec?: number;
  seed: string;
  weight?: 500 | 900;
}> = ({
  text,
  size,
  color,
  delaySec = 0,
  seed,
  weight = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const a = blur;
  const exitStart = durationInFrames - a.exitSec * fps;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        whiteSpace: "pre",
        fontFamily,
        fontWeight: weight,
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
