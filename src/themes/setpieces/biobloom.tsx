// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceBiobloom() (abyss grade, pre-glow, condensing word, six light tendrils, sinking exit). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import { useHeroWin } from "../util/craft-shared";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const TEND: number[][][] = [
  [[340, 268], [255, 230], [195, 185], [135, 110]],
  [[525, 244], [500, 185], [560, 140], [520, 70]],
  [[725, 262], [795, 222], [850, 180], [915, 112]],
  [[365, 332], [280, 372], [215, 425], [150, 492]],
  [[580, 352], [605, 415], [545, 465], [585, 530]],
  [[715, 335], [790, 380], [855, 425], [920, 475]],
];

const kf = (t: number, at: number, dur: number, vals: number[]) =>
  interpolate(
    t,
    vals.map((_, i) => at + (dur * i) / (vals.length - 1)),
    vals,
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.sine.inOut },
  );

const Biobloom: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H, s } = useStage();
  const { I, E, dur } = useHeroWin(dna, hero, 1.8);
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const pal = dna.palette;
  const A: string = pal.accent;
  const VIO: string = pal.violet ?? "#9d7bff";
  const ICE: string = pal.ice ?? "#8fe8ff";
  const CORE: string = pal.core ?? "#f2fffd";
  const text = hero.text;
  // fit hero size to the portrait stage
  const fpx = Math.min(px((dna.hero as any)?.fontPx ?? 120) * 1.15, (W * 0.84) / Math.max(3, text.length * 0.62));
  const halfW = text.length * 0.33 * fpx * 1.05;
  const cx = W / 2;
  const cy = H * 0.28;
  const ky = fpx / 120;
  const kx = Math.max(0.7, Math.min(1.5, halfW / 281));
  const TX = (x: number) => Math.max(16, Math.min(W - 16, cx + (x - 560) * kx));
  const TY = (y: number) => Math.max(16, Math.min(H - 16, cy + (y - 300) * ky));
  const paths = TEND.map((pts) => {
    const q = pts.map(([x, y]) => `${TX(x).toFixed(0)} ${TY(y).toFixed(0)}`);
    return `M ${q[0]} C ${q[1]}, ${q[2]}, ${q[3]}`;
  });
  const TCOL = [A, VIO, ICE, A, VIO, A];

  const C = I + (p.crush ?? 0.11);
  const SINK = E - 0.2;
  const stag = Math.max(0.02, Math.min(0.05, (SINK - 0.46 - (C + 0.02)) / 5));
  let aglowScale = 1;

  // abyss + breathing vignette are on the whole clip until the sink
  const gradeOp = tw(t, SINK + 0.1, 0.4, 1, 0.0, ease.power1.in);
  const vigOp = kf(t, 0.03, dur - 0.09, [0.8, 0.72, 0.83, 0.74, 0.81, 0.76]) * 0.95;

  const pocket = tw(t, I - 0.03, 0.22, 0, dna.plate.scrim ?? 0.55, ease.power2.out) *
    tw(t, SINK + 0.04, 0.22, 1, 0, ease.power1.in);
  // pre-glow: double beat, then crush to a point
  let pre = 0;
  let preS = 0.6;
  if (t >= I - 0.31 && t < I) {
    const k0 = I - 0.31;
    pre = kf(t, k0, 0.19, [0.34, 0.14, 0.46, 0.34]);
    preS = kf(t, k0, 0.19, [0.9, 0.72, 1.08, 0.95]);
    if (t > I - 0.115) {
      pre = tw(t, I - 0.115, 0.1, 0.34, 0.95, ease.power4.in);
      preS = tw(t, I - 0.115, 0.1, 0.95, 0.32, ease.power4.in);
    }
  }
  // word arrival
  const crush = C - I;
  let scale = 1;
  let sx = 1;
  let sy = 1;
  let wblur = 0;
  let wbright = 1.45;
  let aglow = 0;
  let spill = 0;
  if (t >= I) {
    if (t < C) {
      scale = tw(t, I, crush, 2.35, 1, ease.power4.in);
      wblur = tw(t, I, crush, 15, 2, ease.power4.in);
      wbright = tw(t, I, crush, 2.6, 1.7, ease.power4.in);
    } else {
      const q = tw(t, C + 0.085, 0.5, 0, 1, ease.elastic.out(1, 0.42));
      sx = 1.09 + (1 - 1.09) * q;
      sy = 0.93 + (1 - 0.93) * q;
      wblur = 0;
      wbright =
        t < C + 0.1
          ? 1.85
          : tw(t, C + 0.1, 0.34, 1.85, 1.45, ease.power2.out);
      aglow = 0.9;
      spill = t < C + 0.07 ? 0.55 : tw(t, C + 0.07, 0.12, 0.55, 0.2, ease.expo.out);
      if (t > C + 0.21) spill = kf(t, C + 0.21, Math.min(0.5, Math.max(0.2, SINK + 0.03 - (C + 0.21))), [0.13, 0.19, 0.15]);
      if (t > C + 0.12) {
        const D = Math.min(0.72, Math.max(0.3, dur - 0.06 - (C + 0.12)));
        const k = (t - (C + 0.12)) / D;
        const j = Math.min(3, k * 3);
        const lo = Math.min(2, Math.floor(j));
        const f = ease.sine.inOut(j - lo);
        const scs = [1.1, 1.04, 1.13, 1.07];
        const ops = [0.78, 0.9, 0.7, 0.85];
        aglow = ops[lo] + (ops[lo + 1] - ops[lo]) * f;
        aglowScale = scs[lo] + (scs[lo + 1] - scs[lo]) * f;
      }
      if (t > I + 0.59) wbright *= kf(t, I + 0.59, 0.32, [1.6, 1.4, 1.62, 1.5]) / 1.45;
    }
  }
  const driftX = tw(t, I + 0.21, Math.min(0.64, Math.max(0.2, SINK - (I + 0.21))), 0, (p.drift ?? -30) * s * 1.2, ease.sine.out);
  const apexOp =
    (t >= I ? 1 : 0) * tw(t, SINK + 0.06, 0.2, 1, 0, ease.power2.in);
  const apexY = tw(t, SINK + 0.06, 0.2, 0, px(26), ease.power2.in);
  const exitBlur = tw(t, SINK + 0.06, 0.2, 0, 6, ease.power1.in);
  const exitBright = tw(t, SINK + 0.06, 0.2, 0, -0.25, ease.power1.in);
  const tendWrap = tw(t, SINK, 0.2, 1, 0, ease.power2.in);
  const tendY = tw(t, SINK, 0.2, 0, px(14), ease.power2.in);
  const cauOp = (t < C + 0.02 ? 0 : t < C + 0.32 ? tw(t, C + 0.02, 0.3, 0, 0.06) : 0.06) *
    tw(t, SINK + 0.04, 0.18, 1, 0, ease.power1.in);
  const cauA = tw(t, C + 0.02, 0.95, -45, 85, ease.none) * (W / 1280);
  const cauB = tw(t, C + 0.02, 0.95, 55, -75, ease.none) * (W / 1280);
  const flick = t > C + 0.34 ? kf(t, C + 0.34, 0.7, [0.78, 1, 0.72, 1, 0.82]) : 1;
  const pkW = 2 * halfW + 280 * s;
  const pkH = 2.5 * fpx;
  const cxP = (cx / W) * 100;
  const cyP = (cy / H) * 100;
  const active = t >= I - 0.45;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: (p.mood ?? 0.92) * gradeOp,
          background:
            "linear-gradient(180deg, rgba(3,11,26,0.52) 0%, rgba(3,11,26,0.30) 30%, rgba(4,9,20,0.10) 52%, rgba(2,7,16,0.18) 78%, rgba(1,5,12,0.34) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: vigOp * gradeOp,
          background:
            "radial-gradient(120% 110% at 50% 46%, rgba(0,0,0,0) 36%, rgba(2,8,20,0.45) 66%, rgba(1,4,12,0.95) 100%)",
        }}
      />
      {active ? (
        <>
          <div
            style={{
              position: "absolute",
              left: cx - pkW / 2,
              top: cy - pkH / 2,
              width: pkW,
              height: pkH,
              opacity: pocket,
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(1,8,18,0.72) 0%, rgba(1,8,18,0.40) 55%, rgba(1,8,18,0) 78%)",
            }}
          />
          <AbsoluteFill
            style={{
              opacity: spill * tw(t, SINK + 0.04, 0.22, 1, 0, ease.power1.in),
              background: `radial-gradient(58% 46% at ${cxP}% ${cyP}%, ${A}80 0%, ${A}2b 42%, ${A}00 74%)`,
            }}
          />
          {[
            { x: cauA, c: ICE, a: "d9", pos: "42% 46%", sz: "46% 42%", d: 68 },
            { x: cauB, c: VIO, a: "bf", pos: "58% 52%", sz: "44% 46%", d: 66 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: W * 0.0625,
                top: H * 0.069,
                width: W * 0.781,
                height: H * 0.75,
                opacity: cauOp,
                transform: `translateX(${c.x}px)`,
                background: `radial-gradient(${c.sz} at ${c.pos}, ${c.c}${c.a} 0%, ${c.c}00 ${c.d}%)`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: 1.083 * fpx,
              height: 0.717 * fpx,
              marginLeft: -0.54 * fpx,
              marginTop: -0.36 * fpx,
              borderRadius: "50%",
              opacity: pre,
              transform: `scale(${preS})`,
              background: `radial-gradient(50% 50% at 50% 50%, rgba(170,255,242,0.95) 0%, ${A}80 45%, ${A}00 75%)`,
              filter: `blur(${Math.max(6, 10 * ky)}px)`,
            }}
          />
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              position: "absolute",
              inset: 0,
              opacity: tendWrap,
              transform: `translateY(${tendY}px)`,
            }}
          >
            {[
              { blur: 5, w: Math.max(6, 9 * ky), o: 0.5 * flick },
              { blur: 1.1, w: Math.max(2, 3 * ky), o: 0.95 },
            ].map((g, gi) => (
              <g key={gi} style={{ filter: `blur(${g.blur}px)` }}>
                {paths.map((d, i) => {
                  const t0 = C + 0.02 + i * stag;
                  const prog = tw(t, t0, 0.42, 0, 1, ease.power2.out);
                  return (
                    <path
                      key={i}
                      d={d}
                      pathLength={1}
                      stroke={TCOL[i]}
                      strokeWidth={g.w}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="1 1"
                      strokeDashoffset={1 - prog}
                      opacity={t >= t0 ? g.o : 0}
                    />
                  );
                })}
              </g>
            ))}
          </svg>
          <div
            style={{
              position: "absolute",
              left: cx + driftX,
              top: cy + apexY,
              opacity: apexOp,
              transform: `translate(-50%, -50%) scale(${scale * sx}, ${scale * sy})`,
              whiteSpace: "nowrap",
              fontFamily: `'${dna.fonts.hero}', sans-serif`,
              fontWeight: 700,
              fontSize: fpx,
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                color: A,
                filter: `blur(${Math.max(10, 18 * ky)}px)`,
                opacity: aglow,
                transform: `scale(${aglowScale})`,
              }}
            >
              {text}
            </div>
            <div
              style={{
                position: "relative",
                color: CORE,
                filter: `blur(${Math.max(0, wblur + exitBlur)}px) brightness(${Math.max(0.2, wbright + exitBright)})`,
                textShadow: `0 0 ${18 * ky}px ${A}f2, 0 0 ${46 * ky}px ${A}8c, 0 0 ${100 * ky}px ${VIO}80, 0 4px ${22 * ky}px rgba(1,8,16,0.7)`,
              }}
            >
              {text}
            </div>
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Wrapped = Biobloom;

const setpiece: Setpiece = { Behind: Wrapped };
export default setpiece;
