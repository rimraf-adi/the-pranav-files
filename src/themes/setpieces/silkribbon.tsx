// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, setpieceSilkribbon(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";
import { StrokeWord, layoutStrokes, penAt } from "../util/strokes-svg";
import { HERO_Y, heroDisplay, heroSpan } from "../util/strokes-hero";

const hex = (a: number) =>
  Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, "0");
const kf = (t: number, T: number, xs: number[]) => {
  const u = Math.min(0.9999, Math.max(0, t / T)) * (xs.length - 1);
  const i = Math.floor(u);
  return xs[i] + (xs[i + 1] - xs[i]) * (u - i);
};

const Silk: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const { I } = heroSpan(dna, hero);
  const ENDT = DUR - 0.04;
  const WIN = Math.min(p.window ?? 0.68, Math.max(0.36, ENDT - 0.42 - I));
  const { rose: ROSE, accent: TEAL, violet: VIO, deep: DEEP = "#070C24" } = dna.palette;
  const scrim = (dna.plate as any).scrim ?? 0.72;
  const tw0 = Math.min(px(p.targetWidth ?? 880), W * 0.9);
  const layout = layoutStrokes(heroDisplay(hero).toLowerCase(), tw0, dna.fonts.strokeFont);
  const prog = Math.min(1, Math.max(0, (t - I) / WIN));
  const DRAWN = I + WIN;
  const span = tw0 * 0.6364;
  const shift = tw(t, I - 0.07, ENDT - (I - 0.07), 0, 1.5 * span, ease.none);
  const gx1 = -shift;
  // sky blobs
  const deepen = (at: number) => tw(t, at, 0.5, p.wash ?? 0.12, p.deepen ?? 0.2, ease.sine.inOut);
  const aA = t < I - 0.1 ? tw(t, 0.05, 0.5, 0, p.wash ?? 0.12, ease.sine.out) : deepen(I - 0.1);
  const aB = t < I - 0.05 ? tw(t, 0.15, 0.5, 0, p.wash ?? 0.12, ease.sine.out) : deepen(I - 0.05);
  const ax = kf(t, ENDT, [0, 34, 58, 44, 16, -8, 0]) * px(1);
  const ay = kf(t, ENDT, [0, 10, 22, 30, 22, 8, 0]) * px(1);
  const bx = kf(t, ENDT, [0, -28, -52, -60, -38, -12, 0]) * px(1);
  const by = kf(t, ENDT, [0, 14, 8, -6, -16, -8, 0]) * px(1);
  const scr = tw(t, I - 0.34, 0.38, 0, 1, ease.sine.inOut);
  const SP = p.spill ?? 0.3;
  const spill = tw(t, I + 0.1, 0.7, 0, SP, ease.sine.out);
  const breathe =
    t > DRAWN ? kf(t - DRAWN, Math.max(0.1, ENDT - DRAWN), [0.85, 0.7, 0.9, 0.72, 0.86]) : 0.85;
  const [nx, ny] = penAt(layout, prog);
  const nibOp = t < I - 0.01 ? 0 : t < DRAWN ? 1 : tw(t, DRAWN, 0.22, 1, 0, ease.sine.in);
  const nibS = t < DRAWN ? 1 : tw(t, DRAWN, 0.22, 1, 2.4, ease.sine.in);
  const cx = W / 2;
  const cy = H * HERO_Y;
  const spillW = tw0 + px(60);
  const spillH = spillW * 0.51;
  const pad = 60;
  const gradId = "agrad";
  const show = t > I - 0.5;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -0.141 * W + ax, top: -0.2 * H + ay, width: 0.859 * W, height: 0.5 * H, borderRadius: "50%", opacity: aA, background: `radial-gradient(50% 50% at 50% 50%, ${TEAL}d9 0%, ${TEAL}00 70%)` }} />
      <div style={{ position: "absolute", left: 0.406 * W + bx, top: -0.25 * H + by, width: 0.922 * W, height: 0.5 * H, borderRadius: "50%", opacity: aB, background: `radial-gradient(50% 50% at 50% 50%, ${ROSE}cc 0%, ${ROSE}00 70%)` }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 0.5 * H, opacity: scr, background: `linear-gradient(to bottom, ${DEEP}${hex(scrim)} 0%, ${DEEP}${hex(scrim * 0.694)} 55%, ${DEEP}00 100%)` }} />
      {show ? (
        <>
          <div style={{ position: "absolute", left: cx - spillW / 2, top: cy - spillH / 2, width: spillW, height: spillH, opacity: spill, background: `radial-gradient(50% 50% at 50% 50%, ${TEAL}80 0%, ${VIO}47 45%, ${ROSE}00 75%)` }} />
          <div style={{ position: "absolute", left: cx - (layout.width + pad * 2) / 2, top: cy - (layout.height + pad * 2) / 2 }}>
            <StrokeWord
              layout={layout}
              progress={prog}
              defs={
                <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={gx1} y1={0} x2={gx1 + span} y2={0} spreadMethod="reflect">
                  <stop offset="0" stopColor={ROSE} />
                  <stop offset="0.5" stopColor={TEAL} />
                  <stop offset="1" stopColor={VIO} />
                </linearGradient>
              }
              layers={[
                { width: px(p.haloWidth ?? 18), color: `url(#${gradId})`, opacity: breathe, blur: px(7) },
                { width: px(p.coreWidth ?? 6), color: `url(#${gradId})` },
              ]}
              extra={
                <g opacity={nibOp} transform={`translate(${nx} ${ny}) scale(${nibS})`}>
                  <circle r={px(7)} fill="#fff" opacity={0.85} style={{ filter: `blur(${px(7)}px)` }} />
                  <circle r={px(3.5)} fill="#fff" />
                </g>
              }
              style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.45))" }}
            />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Silk };
export default setpiece;
