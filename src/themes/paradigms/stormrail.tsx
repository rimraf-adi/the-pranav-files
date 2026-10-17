// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmStormrail(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";

type Drop = { x0: number; d: number; len: number; frac: number };
const makeDrops = (n: number, seed: number, W: number): Drop[] => {
  const rnd = mulberry32(seed);
  return Array.from({ length: n }, () => {
    const x0 = 20 + rnd() * (W - 40);
    const d = 0.55 + rnd() * 0.55;
    const len = 46 + rnd() * 70;
    const frac = rnd();
    return { x0, d, len, frac };
  });
};

const Rain: React.FC<{ drops: Drop[]; t: number; t0: number; opacity: number }> = ({
  drops,
  t,
  t0,
  opacity,
}) => {
  const { H, s } = useStage();
  if (opacity <= 0) return null;
  const travel = H + 300 * s;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {drops.map((d, i) => {
        const p = (((t - t0) / d.d + d.frac) % 1 + 1) % 1;
        const y = -160 * s + travel * p;
        const x = d.x0 - 160 * s * p;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 2 * s,
              height: d.len * s,
              borderRadius: 1,
              background:
                "linear-gradient(to bottom, rgba(200,222,244,0), rgba(214,232,250,0.95))",
              transform: `translate(${x}px, ${y}px) rotate(9deg)`,
              transformOrigin: "0 0",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Stormrail: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H, fps } = useStage();
  const F = 1 / fps;
  const b = dna.body as Record<string, any>;
  const r = b.rain ?? {};
  const A = dna.palette.accent;
  const sgn = (dna.hero as any)?.params?.side === "right" ? -1 : 1;
  const I = hero?.start;
  const drops = React.useMemo(() => makeDrops(r.count ?? 18, r.seed ?? 9021, W), [r.count, r.seed, W]);
  const drops2 = React.useMemo(() => makeDrops(r.count ?? 18, r.seed2 ?? 4477, W), [r.count, r.seed2, W]);
  const railBottom = H - px(b.bottomPx ?? 98) - H * 0.12;

  const rain2Op =
    I === undefined || t < I - 0.11 || t > I + 1.24
      ? 0
      : t < I + 0.02
        ? 0
        : t < I + 1.02
          ? 0.11
          : tw(t, I + 1.02, 0.3, 0.11, 0, ease.none);

  return (
    <AbsoluteFill>
      <Rain drops={drops} t={t} t0={0} opacity={r.opacity ?? 0.08} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: H * 0.3,
          opacity: tw(t, 0.05, 0.2, 0, 1, ease.none),
          background:
            "linear-gradient(to bottom, rgba(6,10,18,0) 0%, rgba(6,10,18,0.45) 45%, rgba(6,10,18,0.62) 100%)",
        }}
      />
      {lines.map((L, i) => {
        const inT = L.start;
        const outT = Math.max(L.end + 0.1, Math.min((lines[i + 1]?.start ?? Infinity) - 0.2, L.end + 1.08));
        if (t < inT - 0.03 || t > outT + 0.22) return null;
        let op = 1;
        let y = 0;
        let blur = 0;
        if (t >= outT) {
          const k = tw(t, outT, 0.18, 0, 1, ease.power1.in);
          op = 1 - k;
          y = 22 * px(1) * k;
          blur = 3 * k;
        }
        let shadow = `0 6px 16px rgba(2,8,18,0.85), 0 2px 4px rgba(2,8,18,0.7), 0 0 14px ${A}47`;
        if (I !== undefined && b.yield && L.start < I + 0.9 && L.end > I - 0.3) {
          const dimT = Math.max(I - (b.yield.pre ?? 0.15), L.start + 0.05);
          if (outT > dimT + 0.25) {
            const dimmed = tw(t, dimT, 0.12, 1, b.yield.dim, ease.none);
            const resT = I + (b.yield.post ?? 0.29);
            op *= resT + 0.3 < outT ? tw(t, resT, 0.1, dimmed, 1, ease.none) : dimmed;
          }
        }
        if (I !== undefined && L.start <= I - 2 * F && outT > I && t >= I - 2 * F && t < I + 0.09)
          shadow = `${12 * sgn * px(1)}px 4px 12px rgba(2,8,18,0.85), 0 0 14px ${A}73`;
        const fs = Math.min(
          px(b.fontPx ?? 44) * 1.25,
          (W * 0.9) / Math.max(8, L.words.reduce((n, w) => n + w.text.length + 1.2, 0) * 0.62),
        );
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: railBottom,
              transform: `translate(-50%,-100%) translateY(${y}px)`,
              opacity: op,
              filter: blur ? `blur(${blur}px)` : undefined,
              whiteSpace: "nowrap",
              fontFamily: `'${dna.fonts.body}', sans-serif`,
              fontWeight: 700,
              fontSize: fs,
              lineHeight: 1.15,
              letterSpacing: b.letterSpacing ?? "0.015em",
              color: dna.palette.body,
              textShadow: shadow,
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              if (t < st) return <span key={wi} style={{ display: "inline-block", margin: "0 0.16em", opacity: 0 }}>{w.text.replace(/[.,?!]+$/g, "")}</span>;
              const dt = t - st;
              let bright = 1;
              let sc = 1;
              let dy = 0;
              if (dt < F) {
                bright = 2.2;
                sc = 1.06;
                dy = 4 * px(1);
              } else {
                sc = tw(t, st + F, 0.12, 1.06, 1, ease.power2.out);
                dy = tw(t, st + F, 0.12, 4 * px(1), 0, ease.power2.out);
                bright = tw(t, st + F, 0.14, 2.2, 1, ease.power1.out);
              }
              if (w.emphasis) {
                const t0 = st + 0.2;
                if (t >= t0 && t < t0 + F) bright = 1.9;
                else if (t >= t0 + 2 * F && t < t0 + 3 * F) bright = 1.8;
                else if (t >= t0 + 3 * F && t < t0 + 3 * F + 0.12)
                  bright = tw(t, t0 + 3 * F, 0.12, 1.8, 1, ease.none);
              }
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    margin: "0 0.16em",
                    transformOrigin: "50% 85%",
                    transform: `translateY(${dy}px) scale(${sc})`,
                    filter: `brightness(${bright})`,
                  }}
                >
                  {w.text.replace(/[.,?!]+$/g, "")}
                </span>
              );
            })}
          </div>
        );
      })}
      <Rain drops={drops2} t={t} t0={(I ?? 0) - 0.11} opacity={rain2Op} />
    </AbsoluteFill>
  );
};

const paradigm: Paradigm = { Component: Stormrail };
export default paradigm;
