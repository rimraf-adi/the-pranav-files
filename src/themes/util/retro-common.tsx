// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, shared helpers for the
// retro/CRT/LED/VHS/flap themes (hero geometry fitting, line windows, yield dimming, scanline/vignette overlays). Re-implemented for Remotion.
import React from "react";
import { useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Line, ThemeDNA } from "../types";

/** 1 frame at the 24fps cadence upstream bakes its blips against (0.042s). */
export const F24 = 0.042;

export const useRetro = () => {
  const st = useStage();
  const { durationInFrames } = useVideoConfig();
  return { ...st, dur: durationInFrames / st.fps };
};

/** Docked furniture sits above the platform UI: bottom edge of bars at 86% of the height. */
export const dockBottom = (H: number) => H * 0.86;

/** Hero centre: upstream (1280x720) x/y mapped to fractions; y clamped into the portrait upper-middle band. */
export const heroXY = (dna: ThemeDNA, W: number, H: number) => {
  const h = dna.hero as Record<string, any> | undefined;
  const x = ((h?.x ?? 640) / 1280) * W;
  const yf = Math.min(0.46, Math.max(0.3, (h?.y ?? 266) / 720));
  return { x: Math.min(W * 0.6, Math.max(W * 0.4, x)), y: yf * H };
};

/** Width fit: largest font <= basePx that keeps `len` chars of `emPerChar` inside maxW. */
export const fitPx = (len: number, basePx: number, emPerChar: number, maxW: number) =>
  Math.max(40, Math.min(basePx, Math.floor(maxW / (Math.max(1, len) * emPerChar))));

/** Hero exit time: DNA override, else a hold after the apex, clamped inside the clip. */
export const heroExit = (hero: Hero, hold: number, dur: number, dna: ThemeDNA) =>
  Math.min(dur - 0.05, (dna.hero as any)?.exitAt ?? hero.start + hold);

/** Line in/out windows like the rail paradigm: out waits briefly for the next line. */
export const lineOut = (lines: Line[], i: number) => {
  const L = lines[i];
  return Math.max(L.end + 0.05, Math.min(L.end + 0.5, (lines[i + 1]?.start ?? Infinity) - 0.02));
};

/** Body "yield": multiplier that dims to `dim` while the hero lands, then restores. */
export const yieldMul = (
  t: number,
  heroStart: number | undefined,
  y: { dim: number; pre?: number; post?: number; dd?: number; ru?: number } | undefined,
) => {
  if (heroStart == null || !y) return 1;
  const dn = tw(t, heroStart - (y.pre ?? 0.2), y.dd ?? 0.18, 1, y.dim, ease.power1.in);
  const up = tw(t, heroStart + (y.post ?? 0.9), y.ru ?? 0.25, 0, 1, ease.power1.out);
  return dn + (1 - dn) * up;
};

export const clean = (s: string) => s.replace(/[.,?!]+$/g, "");

/** CRT scanlines + lens vignette over the whole frame. */
export const Crt: React.FC<{ scan: number; vig?: number }> = ({ scan, vig = 0.34 }) => {
  const { s } = useStage();
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 95% at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,${vig}) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: scan,
          background: `repeating-linear-gradient(180deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) ${2 * s}px, rgba(0,0,0,0) ${2 * s}px, rgba(0,0,0,0) ${5 * s}px)`,
        }}
      />
    </>
  );
};

/**
 * CSS family stack for a DNA font name. @remotion/google-fonts registers some families under a spelled-out name
 * (VT323 -> "VTThreeTwoThree", Press Start 2P -> "Press Start TwoP"); list both so the loaded face is always hit.
 */
const ALIAS: Record<string, string> = {
  VT323: "VTThreeTwoThree",
  "Press Start 2P": "Press Start TwoP",
};
export const ff = (name: string) =>
  ALIAS[name] ? `'${ALIAS[name]}', '${name}'` : `'${name}'`;
