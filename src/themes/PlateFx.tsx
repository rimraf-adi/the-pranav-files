import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Hero, ThemeDNA } from "./types";

/**
 * Generic plate effects from dna.plate (upstream "_postfx"): punch-in, shake and grain
 * around the hero moment. Theme-specific dim/scrim lives in the set piece itself.
 */
export const PlateFx: React.FC<{
  dna?: ThemeDNA;
  hero?: Hero;
  children: React.ReactNode;
}> = ({ dna, hero, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const plate = dna?.plate ?? {};
  const since = hero ? t - hero.start : -1;

  let scale = 1;
  let dx = 0;
  let dy = 0;
  if (hero && since >= 0) {
    if (plate.punch)
      scale += plate.punch * Math.exp(-since * (plate.punchDecay ?? 9));
    const win = plate.shakeWindow ?? 0.6;
    if (plate.shakeAmpX && since < win) {
      const decay = Math.exp(-since * (plate.shakeDecay ?? 7));
      const hz = plate.shakeHz ?? 12;
      dx = Math.sin(since * hz * 2 * Math.PI) * plate.shakeAmpX * decay;
      dy =
        Math.cos(since * hz * 2 * Math.PI * 0.8) *
        (plate.shakeAmpY ?? plate.shakeAmpX) *
        decay;
    }
  }
  const grain = plate.grain ?? 0;
  const seed = Math.floor(random(`grain-${frame}`) * 1000);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ transform: `translate(${dx}px, ${dy}px) scale(${scale})` }}
      >
        {children}
      </AbsoluteFill>
      {grain > 0 ? (
        <AbsoluteFill
          style={{
            mixBlendMode: "overlay",
            opacity: interpolate(grain, [0, 10], [0, 0.45], {
              extrapolateRight: "clamp",
            }),
            pointerEvents: "none",
          }}
        >
          <svg width="100%" height="100%">
            <filter id="g">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="2"
                seed={seed}
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#g)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
