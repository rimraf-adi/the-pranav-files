// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceBoltstrike(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const MAIN: [number, number][] = [[-45, -282], [-107, -134], [-23, -56], [-113, 66], [-17, 150], [-85, 268]];
const BA: [number, number][] = [[-107, -134], [-183, -56], [-157, 10]];
const BB: [number, number][] = [[-113, 66], [-187, 140], [-163, 200]];

const Boltstrike: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, words, hero }) => {
  const { t, px, W, H, fps } = useStage();
  const F = 1 / fps;
  const p = (dna.hero as any).params ?? {};
  const pal = dna.palette;
  const A = pal.accent;
  const I = hero.start;
  const EX = (dna.hero as any).exitAt ?? I + (p.hold ?? 2.05);
  const text = hero.text.toUpperCase();
  const hpx = Math.min(px((dna.hero as any).fontPx ?? 145), (W * 0.9) / (text.length * 0.56));
  const halfW = text.length * 0.28 * hpx;
  const cx = W / 2;
  const cy = H * 0.27;
  const sgn = p.side === "right" ? -1 : 1;
  const kx = (halfW / 360) * sgn;
  const ky = hpx / 145;

  // sky kisses: 1 frame on every body word, double on emphasis, re-flash in the hold
  let kiss = 0;
  for (let i = 0; i < words.length; i++) {
    if (i === hero.index) continue;
    const st = words[i].start;
    if (t >= st && t < st + F) kiss = 0.06;
    if (words[i].emphasis) {
      const t0 = st + 0.2;
      if ((t >= t0 && t < t0 + F) || (t >= t0 + 2 * F && t < t0 + 3 * F)) kiss = 0.07;
    }
  }
  for (const rt of [I + 0.84, I + 1.44]) if (rt < EX - 0.2 && t >= rt && t < rt + F) kiss = 0.08;

  const inWin = t > I - 0.5 && t < EX + 0.6;
  const ptsStr = (arr: [number, number][], top = false) =>
    arr
      .map(([dx, dy], k) => {
        const x = cx + dx * kx;
        let y = cy + dy * ky;
        if (top && k === 0) y = Math.min(y, -25);
        return `${Math.round(x)},${Math.round(y)}`;
      })
      .join(" ");
  const MAINP = ptsStr(MAIN, true);
  const BAP = ptsStr(BA);
  const BBP = ptsStr(BB);
  const boltSvg = (color: string, w: number, wb: number) => (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }}>
      <polyline points={MAINP} fill="none" stroke={color} strokeWidth={w * ky} strokeLinejoin="miter" strokeLinecap="round" />
      <polyline points={BAP} fill="none" stroke={color} strokeWidth={wb * ky} strokeLinecap="round" />
      <polyline points={BBP} fill="none" stroke={color} strokeWidth={wb * ky} strokeLinecap="round" />
    </svg>
  );

  // charge / dim
  const charge = dna.plate.charge ?? 0.3;
  const pdim = dna.plate.dim ?? 0.22;
  let dimP = tw(t, I - 0.39, 0.3, 0, charge, ease.power2.in);
  if (t >= I - 2 * F) dimP = t < I + 0.1 ? 0.08 : tw(t, I + 0.1, 0.25, 0.08, pdim, ease.power2.out);
  dimP *= tw(t, EX - 0.14, 0.4, 1, 0, ease.power1.in);
  let scrim = tw(t, I - 0.39, 0.3, 0, 0.42, ease.power2.in);
  if (t >= I - 2 * F) scrim = t < I + 0.1 ? 0.32 : tw(t, I + 0.1, 0.3, 0.32, 0.36, ease.none);
  scrim *= tw(t, EX - 0.04, 0.3, 1, 0, ease.none);

  // bolt flicker
  let bolt = 0;
  if (t >= I - 2 * F && t < I - F) bolt = 1;
  else if (t >= I - F && t < I) bolt = 0.35;
  else if (t >= I) bolt = tw(t, I + 0.045, 0.07, 1, 0, ease.power2.in);
  let sky = 0;
  if (t >= I - 2 * F) {
    if (t < I - F) sky = 0.26;
    else if (t < I + 0.02) sky = 0.1;
    else if (t < I + 0.06) sky = 0.3;
    else sky = tw(t, I + 0.06, 0.22, 0.3, 0, ease.expo.out);
  }

  // apex word
  const apexOn = t >= I - 2 * F && t < EX + 0.26;
  let sx = 1;
  let sy = 1;
  let wf = "";
  if (t < I + 0.025) {
    sx = sy = tw(t, I - 2 * F, 0.105, 3.1, 1, ease.power4.in);
    wf = `blur(${tw(t, I - 2 * F, 0.105, 14, 0, ease.power4.in)}px) brightness(${tw(t, I - 2 * F, 0.105, 3.2, 2.5, ease.power4.in)})`;
  } else {
    const k = tw(t, I + 0.025 + 2 * F, 0.55, 0, 1, ease.elastic.out(1.05, 0.34));
    sx = t < I + 0.025 + 2 * F ? 1.1 : 1.1 + (1 - 1.1) * k;
    sy = t < I + 0.025 + 2 * F ? 0.9 : 0.9 + (1 - 0.9) * k;
    let br = t < I + 0.025 + 2 * F ? 2.5 : tw(t, I + 0.025 + 2 * F, 0.45, 2.5, 1, ease.power2.out);
    for (const [bt, bv] of [[I + 0.84, 1.45], [I + 1.44, 1.35]] as const)
      if (bt < EX - 0.2 && t >= bt && t < bt + F) br = bv;
    wf = `brightness(${br})`;
  }
  const loomDur = Math.max(0.4, EX - 0.04 - (I + 0.74));
  const loom = tw(t, I + 0.74, loomDur, 1, 1.035, ease.power1.inOut);
  sx *= loom;
  sy *= loom;
  const exitK = tw(t, EX, 0.22, 0, 1, ease.power2.in);
  const flip = t >= I - 2 * F && t < I + 0.09;
  const wShadow = flip
    ? `${16 * sgn * px(1)}px 6px 18px rgba(2,6,14,0.9), ${4 * sgn * px(1)}px 2px 6px rgba(2,6,14,0.75), 0 0 26px ${A}b3`
    : `0 8px 26px rgba(3,8,18,0.85), 0 2px 6px rgba(3,8,18,0.7), 0 0 18px ${A}59`;
  const breDur = Math.max(0.6, Math.min(1.5, EX - 0.23 - (I + 0.3)));
  let ozone = 0;
  if (t >= I + 0.02) {
    const kf = [0.85, 0.5, 0.65, 0.42, 0.55, 0.38];
    if (t < I + 0.3) ozone = 0.85;
    else {
      const u = Math.min(1, (t - (I + 0.3)) / breDur) * (kf.length - 1);
      const k = Math.min(kf.length - 2, Math.floor(u));
      ozone = kf[k] + (kf[k + 1] - kf[k]) * (u - k);
    }
    if (t >= EX - 0.22) ozone = tw(t, EX - 0.22, 0.18, ozone, 0.32, ease.none);
  }
  const wordStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: `'${dna.fonts.hero}', sans-serif`,
    fontSize: hpx,
    lineHeight: 1,
    letterSpacing: "0.012em",
    whiteSpace: "nowrap",
  };
  const scW = 2 * halfW + 380 * (W / 1280);
  const scH = hpx * 2.28;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(38,62,96,${p.mood ?? 0.1})` }} />
      {inWin ? <AbsoluteFill style={{ background: "#0a1422", opacity: dimP }} /> : null}
      <AbsoluteFill
        style={{
          opacity: kiss,
          background:
            "linear-gradient(to bottom, rgba(222,236,255,0.95) 0%, rgba(222,236,255,0.40) 38%, rgba(222,236,255,0) 72%)",
        }}
      />
      {inWin ? (
        <div
          style={{
            position: "absolute",
            left: cx - scW / 2,
            top: cy - scH / 2,
            width: scW,
            height: scH,
            borderRadius: "50%",
            opacity: scrim,
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(5,10,20,0.85) 0%, rgba(5,10,20,0.45) 55%, rgba(5,10,20,0) 100%)",
          }}
        />
      ) : null}
      {apexOn ? (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            opacity: 1 - exitK,
            transform: `translateY(${38 * px(1) * exitK}px) scale(${sx}, ${sy})`,
            filter: exitK > 0 ? `blur(${6 * exitK}px)` : undefined,
          }}
        >
          <div
            style={{
              ...wordStyle,
              transform: `translate(-50%,-50%) translateY(${8 * ky}px)`,
              color: A,
              filter: `blur(${Math.max(10, Math.round(26 * ky))}px)`,
              opacity: ozone,
            }}
          >
            {text}
          </div>
          <div
            style={{
              ...wordStyle,
              transform: "translate(-50%,-50%)",
              color: pal.hero ?? pal.body,
              filter: wf,
              textShadow: wShadow,
            }}
          >
            {text}
          </div>
        </div>
      ) : null}
      {bolt > 0 ? (
        <AbsoluteFill style={{ opacity: bolt }}>
          <AbsoluteFill style={{ filter: "blur(16px)", opacity: 0.55 }}>{boltSvg(A, 22, 13)}</AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(5px)", opacity: 0.9 }}>{boltSvg(pal.glow ?? "#cfe8ff", 9, 5)}</AbsoluteFill>
          <AbsoluteFill>{boltSvg(pal.core ?? "#fff", 3.5, 2.2)}</AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {sky > 0 ? (
        <AbsoluteFill
          style={{
            opacity: sky,
            background:
              "radial-gradient(120% 90% at 42% 22%, rgba(240,248,255,0.95) 0%, rgba(200,222,250,0.55) 45%, rgba(120,150,190,0) 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Boltstrike };
export default setpiece;
