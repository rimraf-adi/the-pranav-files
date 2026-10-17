// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, setpieceHoloboot(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";
import { holoGeom, kf } from "../util/calm-holo";

const HoloBoot: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const pal = dna.palette as Record<string, string>;
  const b = dna.body as Record<string, any>;
  const A = pal.accent;
  const MG = pal.magenta ?? "#ff5fd6";
  const GLOW = pal.glow ?? "#3eccf2";
  const CORE = pal.core ?? "#eafbff";
  const BAND = pal.band ?? "#d8faff";
  const I = hero.start;
  const text = hero.text.toUpperCase();

  const fpx = Math.min(px((dna.hero as any)?.fontPx ?? 118), (W * 0.86) / Math.max(3, text.length * 0.8));
  const halfW = (text.length * 0.78 * fpx) / 2;
  const k = fpx / 118;
  const cx = W / 2;
  const cy = H * 0.22;
  const coneW = Math.min(2 * halfW + 80, W - 40);
  const coneTop = cy - 0.55 * fpx;
  const emitY = Math.min(H - 30, cy + 2.4 * fpx);
  const coneH = emitY - coneTop;
  const beamTop = coneTop + 40;
  const beamH = emitY - beamTop;
  const { plateBot } = holoGeom(W, H, px, b);
  const bcW = Math.min(W * 0.9, px(p.coneW ?? 800));
  const bcTop = plateBot - 4;
  const bcH = H - bcTop - 4;
  const bandH = Math.max(20, Math.round(fpx * 0.39));
  const bp = (f: number) => Math.round(bandH * f);

  const heroOut = Math.max(hero.end + 0.9, I + 1.9);
  const CUT = Math.min(heroOut - 0.22, DUR - 0.3);
  const C = I + 0.07;
  const holdD = Math.max(0.6, Math.min(1.72, CUT - 0.05 - (I + 0.24)));
  const holdD2 = Math.max(0.5, holdD - 0.1);
  const reactD = Math.max(0.3, Math.min(0.9, CUT - 0.3 - (I + 0.24)));
  const loomD = Math.min(0.62, Math.max(0.2, CUT - 0.3 - (I + 0.74)));
  const passT = Math.max(I + (p.passAt ?? 1.29), I + 1.25);
  const doPass = passT + 0.65 < CUT - 0.05;

  // ---- body-zone projector (all video)
  const bdotOp = t >= 0.06 && t < DUR - 0.05 ? 1 : 0;
  let bdotS = tw(t, 0.06, 0.12, 0.2, 1, ease.back.out(2.4));
  if (t >= 0.5) {
    const cyc = Math.floor((t - 0.5) / 2.15);
    bdotS = kf(t, 0.5 + cyc * 2.15, 2.0, [1, 1.3, 1, 1.25, 1]);
  }
  if (t >= DUR - 0.12) bdotS = 1.6;
  let bconeOp = 0;
  let bconeSy = 1;
  if (t >= 0.08) {
    bconeSy = tw(t, 0.08, 0.14, 0.05, 1, ease.expo.out);
    bconeOp = t < 0.22 ? 0.9 : t < 0.26 ? 0.5 : 0.9;
    if (t >= 0.6) {
      const i = Math.floor((t - 0.6) / 2.3);
      bconeOp = kf(t, 0.6 + i * 2.3, 2.2, i % 2 ? [0.86, 0.72, 0.84, 0.7, 0.84] : [0.9, 0.74, 0.86, 0.72, 0.86]);
    }
    if (t >= DUR - 0.2) bconeOp *= tw(t, DUR - 0.2, 0.18, 1, 0, ease.power1.in);
  }

  // ---- scene reaction
  const scrimMax = (dna.plate.scrim as number) ?? 0.58;
  let scrim = 0;
  let dim = 0;
  if (t >= I - 0.21) {
    scrim = tw(t, I - 0.21, 0.34, 0, scrimMax, ease.power2.in);
    if (t >= I + 0.24) scrim = tw(t, I + 0.24, reactD, scrimMax, scrimMax * 0.79, ease.power2.out);
    scrim *= t >= CUT - 0.12 ? tw(t, CUT - 0.12, 0.4, 1, 0, ease.power1.in) : 1;
  }
  if (t >= I - 0.05) {
    dim = (dna.plate.charge as number) ?? 0.28;
    if (t >= I + 0.24) dim = tw(t, I + 0.24, reactD, dim, (dna.plate.dim as number) ?? 0.18, ease.power2.out);
    dim *= t >= CUT - 0.12 ? tw(t, CUT - 0.12, 0.4, 1, 0, ease.power1.in) : 1;
  }

  // ---- apex rig
  const dotOp = t >= I - 0.135 && t < CUT + 0.27 ? 1 : 0;
  let dotS = tw(t, I - 0.135, 0.12, 0.2, 1, ease.back.out(2.4));
  if (t >= I + 0.29) dotS = kf(t, I + 0.29, holdD2, [1, 1.4, 1, 1.35, 1, 1.3, 1]);
  if (t >= CUT + 0.12) dotS = 2.2;
  const dotFade = t >= CUT + 0.18 ? tw(t, CUT + 0.18, 0.09, 1, 0, ease.power2.in) : 1;

  let coneOp = 0;
  let coneSx = 1;
  if (t >= I - 0.125) {
    coneSx = tw(t, I - 0.125, 0.11, 0.07, 1, ease.expo.out);
    coneOp = t < I - 0.01 ? 1 : t < I + 0.035 ? 0.55 : 0.95;
    if (t >= I + 0.29) coneOp = kf(t, I + 0.29, holdD2, [0.95, 0.78, 0.9, 0.76, 0.88]);
    if (t >= CUT + 0.02) coneOp *= tw(t, CUT + 0.02, 0.16, 1, 0, ease.power1.in);
  }
  const beamOp = t >= I - 0.095 ? tw(t, I + 0.11, 0.3, 1, 0, ease.power1.in) : 0;
  const beamSy = tw(t, I - 0.095, 0.085, 0, 1, ease.power3.in);

  // word group
  let apxOp = t >= I - 0.055 ? 1 : 0;
  let sX = 1;
  let sY = 1;
  if (t >= C) {
    sX = tw(t, C + 0.084, 0.5, 1.07, 1, ease.elastic.out(1, 0.38));
    sY = tw(t, C + 0.084, 0.5, 0.91, 1, ease.elastic.out(1, 0.38));
  }
  let rotY = 0;
  let loom = 1;
  let skew = 0;
  if (t >= I + 0.24) rotY = kf(t, I + 0.24, holdD, [0, 6, -7, 5, 0]);
  if (loomD >= 0.2) loom = tw(t, I + 0.74, loomD, 1, 1.028, ease.sine.inOut);
  let clipBlur = 0;
  let bright = t >= C ? 2.3 - 1.3 * tw(t, C + 0.05, 0.36, 0, 1, ease.power2.out) : 1;
  let magX = tw(t, C, 0.4, -8, -2, ease.power2.out);
  let cynX = tw(t, C, 0.4, 8, 2, ease.power2.out);
  let clipX = t >= C + 0.104 ? 0 : t >= C + 0.062 ? -3 : t >= C + 0.02 ? 3 : 0;
  if (doPass && t >= passT && t < passT + 0.5) {
    const P = passT;
    skew = t < P + 0.042 ? 6 : t < P + 0.125 ? -4 : 0;
    if (t < P + 0.083) {
      clipBlur = 2.5;
      bright = 1.35;
    } else if (t < P + 0.125) {
      clipBlur = 1;
      bright = 1;
    } else bright = 1;
    if (t < P + 0.05) {
      magX = -7;
      cynX = 7;
    } else {
      magX = tw(t, P + 0.05, 0.18, -7, -2, ease.power2.out);
      cynX = tw(t, P + 0.05, 0.18, 7, 2, ease.power2.out);
    }
    clipX = 0;
    if (t >= P + 0.13) sY *= tw(t, P + 0.172, 0.3, 0.97, 1, ease.elastic.out(1, 0.4));
  }
  // projector cut
  let cutSy = 1;
  let cutSx = 1;
  if (t >= CUT - 0.02) bright = 2.4;
  if (t >= CUT) cutSy = tw(t, CUT, 0.09, 1, 0.018, ease.power3.in);
  if (t >= CUT + 0.1) cutSx = tw(t, CUT + 0.1, 0.075, 1, 0.015, ease.power3.in);
  if (t >= CUT + 0.18) apxOp = 0;

  const sweep = tw(t, I - 0.055, 0.125, 100, 0, ease.power2.in);
  const clipPath = t < I + 0.08 ? `inset(${sweep}% 0% 0% 0%)` : "none";

  const bandPos = -tw(t, I + 0.24, holdD, 0, 6 * bandH, ease.none);
  const bandOp = t >= I + 0.24 ? 0.55 : 0;
  const glowOp = t >= I + 0.29 ? kf(t, I + 0.29, holdD2, [0.55, 0.4, 0.52, 0.38, 0.5]) : 0.55;

  if (t < 0.02 && !(t >= I - 0.3)) return null;
  const active = t >= I - 0.3 && t < CUT + 0.4;

  const layer = (style: React.CSSProperties, id: string) => (
    <div
      key={id}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        fontFamily: `'${dna.fonts.hero}', sans-serif`,
        fontWeight: 700,
        fontSize: fpx,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* body-zone projector cone + base dot */}
      <div
        style={{
          position: "absolute",
          left: W / 2 - bcW / 2,
          top: bcTop,
          width: bcW,
          height: bcH,
          opacity: bconeOp,
          transform: `scaleY(${bconeSy})`,
          transformOrigin: "50% 100%",
          clipPath: "polygon(0% 0%, 100% 0%, 51.6% 100%, 48.4% 100%)",
          background: `linear-gradient(to top, ${A}4d 0%, ${A}1a 55%, ${A}05 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: W / 2 - px(4.5),
          top: H - px(34),
          width: px(9),
          height: px(9),
          borderRadius: "50%",
          background: pal.dot ?? "#bff0ff",
          opacity: bdotOp,
          transform: `scale(${bdotS})`,
          boxShadow: `0 0 10px ${A}e6, 0 0 24px ${A}8c`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: dim, background: "#02101a" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: scrim,
          background: `radial-gradient(58% 46% at 50% ${(cy / H) * 100}%, rgba(2,9,15,0.88) 0%, rgba(2,9,15,0.55) 48%, rgba(2,9,15,0) 78%)`,
        }}
      />
      {active ? (
        <>
          <div
            style={{
              position: "absolute",
              left: cx - coneW / 2,
              top: coneTop,
              width: coneW,
              height: coneH,
              opacity: coneOp,
              transform: `scaleX(${coneSx})`,
              transformOrigin: "50% 100%",
              clipPath: "polygon(0% 0%, 100% 0%, 53% 100%, 47% 100%)",
              background: `linear-gradient(to top, ${A}57 0%, ${A}1f 50%, ${A}05 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: cx - 2.5,
              top: beamTop,
              width: 5,
              height: beamH,
              opacity: beamOp,
              transform: `scaleY(${beamSy})`,
              transformOrigin: "50% 100%",
              background: `linear-gradient(to top, ${CORE}f2, ${CORE}1f)`,
              filter: "blur(0.6px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: cx - px(6.5),
              top: emitY - px(6),
              width: px(13),
              height: px(13),
              borderRadius: "50%",
              background: pal.dotHot ?? "#dff8ff",
              opacity: dotOp * dotFade,
              transform: `scale(${dotS})`,
              boxShadow: `0 0 12px ${A}f2, 0 0 34px ${A}99`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              opacity: apxOp,
              transform: `translate(-50%,-50%) perspective(900px) rotateY(${rotY}deg) skewX(${skew}deg) scale(${sX * loom * cutSx}, ${sY * loom * cutSy})`,
            }}
          >
            <div
              style={{
                position: "relative",
                clipPath,
                filter: `brightness(${bright})${clipBlur ? ` blur(${clipBlur}px)` : ""}`,
                transform: `translateX(${clipX * px(1)}px)`,
              }}
            >
              {layer({ position: "relative", opacity: 0, userSelect: "none" }, "size")}
              {layer({ top: Math.max(2, 3 * k), color: "rgba(1,12,20,0.92)", filter: `blur(${Math.max(4, 7 * k)}px)`, transform: "scale(1.03)" }, "dark")}
              {layer({ color: `${GLOW}f2`, filter: `blur(${Math.max(8, 16 * k)}px)`, transform: "scale(1.05)", opacity: glowOp }, "glow")}
              {layer({ color: `${MG}8c`, transform: `translateX(${magX * px(1)}px)` }, "mag")}
              {layer({ color: `${A}99`, transform: `translateX(${cynX * px(1)}px)` }, "cyn")}
              {layer({ color: CORE, textShadow: `0 0 22px ${A}73, 0 3px 14px rgba(1,10,16,0.55)` }, "core")}
              {layer(
                {
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${2.5 * k * 1.5}px, rgba(2,12,18,0.62) ${2.5 * k * 1.5}px, rgba(2,12,18,0.62) ${4 * k * 1.5}px)`,
                },
                "scan",
              )}
              {layer(
                {
                  color: "transparent",
                  opacity: bandOp,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) ${bp(0.717)}px, ${BAND}f2 ${bp(0.783)}px, ${BAND}f2 ${bp(0.87)}px, rgba(255,255,255,0) ${bp(0.935)}px, rgba(255,255,255,0) ${bandH}px)`,
                  backgroundSize: `100% ${bandH}px`,
                  backgroundPosition: `0px ${bandPos}px`,
                },
                "bands",
              )}
            </div>
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: HoloBoot };
export default setpiece;
