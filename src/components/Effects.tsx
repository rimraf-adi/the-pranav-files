import React from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import style from "../../styles/gadzhi.json";

const leakCfg = style.reference.overlays.lightLeak;

/** Dark, contrasty, navy-shadow / warm-skin look approximated with CSS filters + overlays. */
export const gradeFilter = "contrast(1.18) saturate(1.1) brightness(0.9)";

export const GradeOverlay: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(8,30,48,0.30), rgba(4,12,26,0.42))",
        mixBlendMode: "multiply",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  </>
);

/** Sparse flickering white specks, concentrated in the top area (film dust). */
export const FilmDust: React.FC<{ count?: number }> = ({ count = 16 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slot = Math.floor(frame / 3);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = random(`dust-${i}-${slot}`);
        if (r > 0.3) return null;
        const x = random(`dx-${i}-${slot}`) * width;
        const y = random(`dy-${i}-${slot}`) * height * 0.55;
        const s = 2 + random(`ds-${i}-${slot}`) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s * (1 + random(`dh-${i}-${slot}`)),
              borderRadius: s,
              background: "rgba(255,255,255,0.8)",
              opacity: 0.4 + random(`do-${i}-${slot}`) * 0.5,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Orange/pink glow: ramps up before each cut time, peaks at it, decays after. */
export const LightLeak: React.FC<{ times: number[] }> = ({ times }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let k = 0;
  for (const c of times) {
    const d = t - c;
    if (d >= -leakCfg.rampBeforeCutSec && d < 0)
      k = Math.max(k, 1 + d / leakCfg.rampBeforeCutSec);
    else if (d >= 0 && d < leakCfg.decayAfterCutSec)
      k = Math.max(k, 1 - d / leakCfg.decayAfterCutSec);
  }
  if (k <= 0) return null;
  const drift = Math.sin(frame / 4) * 6;
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, k * 0.95),
        mixBlendMode: "screen",
        background: `radial-gradient(circle at ${22 + drift}% 28%, ${leakCfg.color}ff 0%, ${leakCfg.color}00 55%),
          radial-gradient(circle at ${82 - drift}% 72%, rgba(255,60,130,0.85) 0%, rgba(255,60,130,0) 50%),
          rgba(255,170,90,0.18)`,
      }}
    />
  );
};
