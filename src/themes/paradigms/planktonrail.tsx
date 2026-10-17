// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmPlanktonrail() (jellyfish glow-on, two-row float, sinking exits, plankton motes). Re-implemented for Remotion.
import React from "react";
import { interpolate } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";

const kf = (t: number, at: number, dur: number, vals: number[]) =>
  interpolate(
    t,
    vals.map((_, i) => at + (dur * i) / (vals.length - 1)),
    vals,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.sine.inOut,
    },
  );

const Plankton: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const A: string = pal.accent;
  const VIO: string = pal.violet ?? "#9d7bff";
  const yld = (b.yield ?? {}) as Record<string, number>;
  const I = hero?.start ?? Infinity;
  const endT = (lines[lines.length - 1]?.end ?? 0) + 1.5;
  const rowB = H * 0.8;
  const rowA = rowB - px(b.rowDy ?? 58) * 1.35;
  const heroCy = H * 0.28;

  // motes (seeded; same every frame)
  const motes = React.useMemo(() => {
    const m = b.motes ?? {};
    const rr = mulberry32(m.seed ?? 2929);
    const near = m.near ?? 5;
    return Array.from({ length: m.count ?? 12 }, (_, i) => {
      const isNear = Number.isFinite(I) && i < near;
      let L: number;
      let T: number;
      if (isNear) {
        const ang = (i / near) * Math.PI * 2 + 0.55 + rr() * 0.5;
        const r = (150 + rr() * 75) * 1.5;
        L = W / 2 + Math.cos(ang) * r * 1.0;
        T = heroCy + Math.sin(ang) * r * 0.85;
      } else {
        L = 60 + rr() * (W - 120);
        T = H * 0.08 + rr() * H * 0.68;
      }
      L = Math.max(20, Math.min(W - 25, L));
      T = Math.max(25, Math.min(H - 175, T));
      const s = (2 + Math.round(rr() * 2)) * 1.5;
      const tin = 0.04 + rr() * 0.35;
      const a1 = (rr() - 0.5) * 54;
      const a2 = a1 + (rr() - 0.5) * 54;
      const a3 = a2 + (rr() - 0.5) * 45;
      const b1 = (rr() - 0.5) * 42;
      const b2 = b1 + (rr() - 0.5) * 42;
      const b3 = b2 + (rr() - 0.5) * 36;
      const tx = (W / 2 - L) * 0.72 + (rr() - 0.5) * 36;
      const ty = (heroCy - T) * 0.72 + (rr() - 0.5) * 27;
      return { isNear, L, T, s, tin, xs: [0, a1, a2, a3], ys: [0, b1, b2, b3], tx, ty };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H, I]);

  // line scheduling (couplet rows)
  const activeIdx = lines.reduce((a, L, i) => (L.start < I ? i : a), 0);
  const data = lines.map((L, i) => {
    const pairLast = lines[Math.min(i - (i % 2) + 1, lines.length - 1)];
    let out: number | null =
      i + 2 < lines.length
        ? Math.min(lines[i + 2].start - 0.15, pairLast.end + 0.28 + (i % 2) * 0.12)
        : i + 1 < lines.length
          ? lines[i + 1].start - 0.05
          : null;
    if (i !== activeIdx && out != null && out > I - 0.25 && L.start < I)
      out = I - 0.21;
    return { L, i, out };
  });

  return (
    <>
      {motes.map((m, i) => {
        const dEnd = m.isNear ? I - 0.25 : endT;
        const t0 = m.tin + 0.32;
        let op = tw(t, m.tin, 0.3, 0, 0.1, ease.power1.out);
        let x = 0;
        let y = 0;
        let sc = 1;
        if (t > t0) {
          const D = Math.max(0.1, dEnd - t0);
          const k = Math.min(1, (t - t0) / D);
          const idx = k * 3;
          const lo = Math.min(2, Math.floor(idx));
          const f = ease.sine.inOut(idx - lo);
          x = m.xs[lo] + (m.xs[lo + 1] - m.xs[lo]) * f;
          y = m.ys[lo] + (m.ys[lo + 1] - m.ys[lo]) * f;
          op = 0.1 + 0.03 * Math.sin(k * 6.28);
        }
        if (m.isNear && t > I - 0.19 + i * 0.045) {
          const k = ease.power2.in(
            Math.min(1, (t - (I - 0.19 + i * 0.045)) / 0.75),
          );
          x = x + (m.tx - x) * k;
          y = y + (m.ty - y) * k;
          op = 0.1 + 0.32 * k;
          sc = 1 + 0.7 * k;
        }
        const fadeOut = tw(t, endT - 0.2, 0.18, 1, 0, ease.power1.in);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.L,
              top: m.T,
              width: m.s,
              height: m.s,
              borderRadius: "50%",
              background: `${pal.mote ?? "#96f5e8"}f2`,
              boxShadow: `0 0 ${px(7)}px ${px(2)}px ${A}bf`,
              opacity: op * fadeOut * (t < m.tin ? 0 : 1),
              transform: `translate(${x}px, ${y}px) scale(${sc})`,
            }}
          />
        );
      })}
      {data.map(({ L, i, out }) => {
        const inT = L.start;
        if (t < inT - 0.05 || (out != null && t > out + 0.35)) return null;
        const t0 = Math.max(0.02, inT - 0.02);
        const D = (out ?? endT) - t0 - 0.04;
        const yArr = D > 1.5 ? [-2, 2, -3, 1, 3, 0] : [-2, 1, -2, 0];
        let ly = kf(t, t0, Math.max(0.1, D), yArr.map((v) => v * 1.5));
        let op = 1;
        if (out != null) {
          ly += tw(t, out, 0.3, 0, px(15), ease.power1.in);
          op *= tw(t, out, 0.3, 1, 0, ease.power1.in);
        }
        // rail yields to the apex
        if (hero) {
          if (i === activeIdx && (out ?? 99) > I - (yld.pre ?? 0.17) + 0.25) {
            let y = tw(t, I - (yld.pre ?? 0.17), 0.18, 1, yld.dim ?? 0.55, ease.power1.out);
            if ((out ?? 99) > I + 1.2 && t > I + 0.9)
              y = tw(t, I + 0.9, 0.25, yld.dim ?? 0.55, 1, ease.power1.out);
            op *= y;
          }
          if (L.start > I && L.start < I + 0.9) {
            const e = yld.enter ?? 0.8;
            op *= tw(
              t,
              Math.max(I + (yld.post ?? 0.63), L.start + 0.1),
              0.25,
              e,
              1,
              ease.power1.out,
            );
          }
        }
        const fs = Math.min(
          px(b.fontPx ?? 44),
          (W * 0.9) /
            Math.max(
              8,
              L.words.reduce((n, w) => n + w.text.length + 0.3, 0) * 0.56,
            ),
        );
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: i % 2 ? rowB : rowA,
              transform: `translate(-50%, -50%) translateY(${ly}px)`,
              whiteSpace: "nowrap",
              fontFamily: `'${dna.fonts.body}', sans-serif`,
              fontWeight: 400,
              fontSize: fs,
              lineHeight: 1.2,
              color: pal.body,
              opacity: op,
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              const em = !!w.emphasis;
              if (t < st - 0.01) {
                return (
                  <span
                    key={wi}
                    style={{ display: "inline-block", opacity: 0, marginRight: "0.3em" }}
                  >
                    {w.text.replace(/[.,?!]+$/g, "")}
                  </span>
                );
              }
              const o = tw(t, st, 0.083, 0, 1, ease.none);
              const g = ease.sine.out(Math.min(1, Math.max(0, (t - st) / 0.4)));
              let sc = 0.92 + 0.08 * g;
              const blur = 5 * (1 - g);
              let bright = 0.45 + 0.55 * g;
              if (em && t > st + 0.52) {
                bright *= kf(t, st + 0.52, 0.55, [1.4, 1.06, 1.5, 1.12, 1]);
                sc *= kf(t, st + 0.52, 0.55, [1.035, 1.01, 1.05, 1.015, 1]);
              }
              const sh = `0 2px 10px rgba(1,10,20,0.85), 0 0 ${16 * g}px ${A}cc${
                em ? `, 0 0 ${34 * g}px ${VIO}8c` : ""
              }`;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: "0.3em",
                    opacity: o,
                    transform: `scale(${sc})`,
                    filter: `blur(${blur}px) brightness(${bright})`,
                    textShadow: sh,
                    color: em ? (pal.em ?? "#f4fffd") : undefined,
                  }}
                >
                  {w.text.replace(/[.,?!]+$/g, "")}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const paradigm: Paradigm = { Component: Plankton };
export default paradigm;
