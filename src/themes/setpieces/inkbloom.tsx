// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, setpieceInkbloom(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const BLOBS: [string, number, number, number, number, number, number, number, number, number][] = [
  // id, op, s0, s1, r0, r1, dt, growDur, fadeAt, fadeDur
  ["b1", 0.82, 0.5, 3.0, -4, 5, 0, 1.15, 0.18, 1.05],
  ["b2", 0.62, 0.42, 2.4, 7, -7, 0.04, 1.35, 0.22, 1.15],
  ["b3", 0.5, 0.55, 3.8, -9, 8, 0.08, 1.5, 0.3, 1.2],
];

const InkBloom: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero, lines }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const pal = dna.palette;
  const INK = (pal.ink ?? pal.body) as string;
  const PAP = (pal.paper as string) ?? "#fffaee";
  const PAP2 = (pal.paper2 as string) ?? "#fff8e8";
  const WASH = (pal.wash as string) ?? "#fff9ee";
  const WAPX = (pal.washApex as string) ?? "#fffaf0";
  const b = dna.body as Record<string, any>;

  const D = hero.start;
  const C = D + (p.fall ?? 0.15);
  const text = hero.text;
  // size: demo 132px, clamped to the canvas width
  const fpx = Math.min(px((dna.hero as any)?.fontPx ?? 132), (W * 0.84) / Math.max(3, text.length * 0.62));
  const halfW = Math.max(fpx * 1.2, (text.length * 0.6 * fpx) / 2);
  const ky = fpx / 132;
  const kx = halfW / 200;
  const SX = (v: number) => v * kx;
  const SY = (v: number) => v * ky;
  const cx = W / 2;
  const cy = H * 0.2;

  const nextL = lines.find((L) => L.words[0].start > hero.end + 0.05);
  const XOUT = Math.max(
    C + 0.55,
    Math.min(
      D + (p.maxHold ?? 1.75),
      nextL ? nextL.words[0].start - (p.clearGap ?? 0.24) : DUR - 0.6,
      DUR - 0.6,
    ),
  );
  if (t > XOUT + 0.7 && t > 1.0) {
    // only the persistent rail wash remains
  }
  const loomT = D + 0.373;
  const loomD = Math.min(1.3, XOUT - (D + 0.373) - 0.03);
  const vigOutT = XOUT - 0.15;
  const vigOutD = Math.min(0.6, DUR - 0.05 - (XOUT - 0.15));

  // rail wash registers on the body's middle reading row
  const rowGap = px(b.rowGap ?? 56);
  const railY = H * 0.82 - rowGap;
  const wrW = px(p.washRailW ?? 1180);
  const wrH = px(p.washRailH ?? 300);
  const waW = 2 * halfW + px(370);
  const waH = px(p.washApexH ?? 430);

  const railWash = tw(t, 0.15, 0.5, 0, 1, ease.power1.out);
  const apexWash =
    tw(t, Math.max(0.02, D - 0.077), 0.3, 0, 1, ease.power1.out) *
    tw(t, XOUT, 0.5, 1, 0, ease.power1.in);
  const vig =
    tw(t, C, 0.45, 0, p.vig ?? 0.34, ease.power2.out) *
    (t > vigOutT ? tw(t, vigOutT, Math.max(0.1, vigOutD), 1, 0, ease.power1.in) : 1);

  const active = t >= D - 0.08 && t <= XOUT + 0.6;

  // drop
  const dropVis = t >= D - 0.08 && t < C + 0.083 + 0.07;
  const dropScaleIn = tw(t, D - 0.08, 0.08, 0.55, 1, ease.power2.out);
  const dropY = tw(t, D, C - D, 0, SY(219), ease.power2.in);
  let dsx = tw(t, D, C - D, 1, 0.8, ease.power2.in);
  let dsy = tw(t, D, C - D, 1, 1.45, ease.power2.in);
  if (t >= C) {
    dsx = 1.7;
    dsy = 0.35;
  }
  const dropOp = tw(t, C + 0.083, 0.07, 1, 0, ease.none);

  // group loom + exit dissolve
  const loom = loomD >= 0.2 ? tw(t, loomT, loomD, 1, 1.018, ease.power1.inOut) : 1;
  const exitS = tw(t, XOUT, 0.52, 1, 1.15, ease.power1.in);
  const exitBlur = tw(t, XOUT, 0.52, 0, px(11), ease.power1.in);
  const exitOp = tw(t, XOUT, 0.52, 1, 0, ease.power1.in);

  // hero word resolves out of the blob
  const rt = C + 0.02;
  const rd = Math.min(0.8, Math.max(0.3, XOUT - rt - 0.25));
  const wordOp = t >= rt ? 1 : 0;
  let wBlur = tw(t, rt, rd, px(16), 0, ease.power2.out);
  const wScale = tw(t, rt, rd, 1.12, 1, ease.power2.out);
  const bt = rt + Math.max(0.82, rd + 0.02);
  const bd = 0.66;
  if (t >= bt && t <= bt + bd) {
    const u = (t - bt) / bd;
    const kf = [0, 0.8, 0.15, 0.7, 0];
    const i = Math.min(3, Math.floor(u * 4));
    const f = u * 4 - i;
    wBlur = (kf[i] + (kf[i + 1] - kf[i]) * f) * px(1);
  }

  const wisp = (at: number, op: number, dx: number, dy: number, r0: number, r1: number, sy1: number, d: number, fadeAt: number, fadeD: number, left: number, top: number) => {
    if (!(C + at + 0.6 <= XOUT) || t < C + at) return null;
    const u = (t - (C + at));
    const o = op * tw(t, C + fadeAt, fadeD, 1, 0, ease.power1.in);
    return (
      <div
        style={{
          position: "absolute",
          left: SX(left),
          top: SY(top),
          width: SY(30),
          height: SY(38),
          opacity: o,
          border: `${Math.max(2, SY(4))}px solid transparent`,
          borderTopColor: `${INK}80`,
          borderRadius: "50%",
          filter: `blur(${SY(2.5)}px)`,
          transform: `translate(${tw(u, 0, d, 0, dx, ease.power1.out) * kx}px, ${tw(u, 0, d, 0, dy, ease.power1.out) * ky}px) rotate(${tw(u, 0, d, r0, r1, ease.power1.out)}deg) scaleY(${tw(u, 0, d, 1, sy1, ease.power1.out)})`,
        }}
      />
    );
  };

  const blr = (v: number) => Math.max(px(8), SY(v));
  const blobBox: Record<string, React.CSSProperties> = {
    b1: { left: SX(-115), top: SY(-64), width: SX(230), height: SY(128), borderRadius: "47% 53% 44% 56% / 58% 42% 60% 40%", filter: `blur(${blr(16)}px)` },
    b2: { left: SX(-205), top: SY(-44), width: SX(190), height: SY(108), borderRadius: "56% 44% 58% 42% / 44% 60% 40% 56%", filter: `blur(${blr(20)}px)` },
    b3: { left: SX(-13), top: SY(-66), width: SX(206), height: SY(96), borderRadius: "42% 58% 50% 50% / 62% 38% 56% 44%", filter: `blur(${blr(24)}px)` },
  };

  const ring = (id: number) => {
    const [at, op0, sc1, gd, easeFn, fAt, fD] =
      id === 1
        ? [0.02, 0.7, 7.2, 1.45, ease.expo.out, 0.22, 1.25]
        : [0.16, 0.5, 9.6, 1.7, ease.power2.out, 0.4, 1.4];
    if (t < C + (at as number)) return null;
    const sc = tw(t, C + (at as number), gd as number, 1, sc1 as number, easeFn as (x: number) => number);
    const o = (op0 as number) * tw(t, C + (fAt as number), fD as number, 1, 0, ease.power1.in);
    return (
      <div
        key={id}
        style={{
          position: "absolute",
          left: SX(-80),
          top: SY(-8),
          width: SX(160),
          height: SY(44),
          borderRadius: "50%",
          opacity: o,
          transform: `scale(${sc})`,
          border: `${Math.max(2, px(2))}px solid ${INK}${id === 1 ? "cc" : "8c"}`,
          filter: `blur(${id === 1 ? 1.2 : 2.2}px)`,
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: vig,
          background:
            "radial-gradient(115% 100% at 50% 40%, rgba(0,0,0,0) 42%, rgba(8,6,4,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: W / 2 - wrW / 2,
          top: railY - wrH / 2,
          width: wrW,
          height: wrH,
          opacity: railWash,
          background: `radial-gradient(50% 50% at 50% 50%, ${WASH}d0 0%, ${WASH}90 48%, ${WASH}00 75%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - waW / 2,
          top: cy - waH / 2,
          width: waW,
          height: waH,
          opacity: apexWash,
          background: `radial-gradient(50% 50% at 50% 50%, ${WAPX}4d 0%, ${WAPX}21 50%, ${WAPX}00 76%)`,
        }}
      />
      {active ? (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            opacity: exitOp,
            transform: `scale(${loom * exitS})`,
            filter: exitBlur > 0.05 ? `blur(${exitBlur}px)` : undefined,
          }}
        >
          {BLOBS.map(([id, op, s0, s1, r0, r1, dt, gd, ft, fd]) => {
            if (t < C + dt) return null;
            const o = op * tw(t, C + ft, fd, 1, 0, ease.power1.in);
            const sc = tw(t, C + dt, gd, s0, s1, ease.expo.out);
            const rot = tw(t, C + dt, gd, r0, r1, ease.expo.out);
            return (
              <div
                key={id}
                style={{
                  position: "absolute",
                  background: INK,
                  opacity: o,
                  transform: `scale(${sc}) rotate(${rot}deg)`,
                  transformOrigin: "50% 50%",
                  ...blobBox[id],
                }}
              />
            );
          })}
          {ring(1)}
          {ring(2)}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              transform: "translate(-50%,-50%)",
              fontFamily: `'${dna.fonts.hero}', serif`,
              fontWeight: 700,
              fontSize: fpx,
              lineHeight: 1,
              letterSpacing: "0.02em",
              color: INK,
              opacity: wordOp,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `scale(${wScale})`,
                transformOrigin: "50% 60%",
                filter: wBlur > 0.05 ? `blur(${wBlur}px)` : undefined,
                textShadow: `0 0 14px ${PAP}f2, 0 0 36px ${PAP2}b3, 0 2px 4px ${PAP}99`,
              }}
            >
              {text}
            </span>
          </div>
          {wisp(0.573, 0.45, 12, -44, 14, 96, 1.6, 0.95, 1.123, 0.4, -210, -118)}
          {wisp(0.753, 0.4, -14, -40, -18, -98, 1.5, 0.9, 1.273, 0.38, 118, -122)}
          {dropVis ? (
            <div
              style={{
                position: "absolute",
                left: -SY(9),
                top: -SY(228),
                width: SY(18),
                height: SY(18),
                borderRadius: "46% 54% 50% 50% / 38% 40% 62% 60%",
                background: INK,
                opacity: dropOp,
                boxShadow: `0 0 6px ${INK}73`,
                transform: `translateY(${dropY}px) scale(${dropScaleIn * dsx}, ${dropScaleIn * dsy})`,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: InkBloom };
export default setpiece;
