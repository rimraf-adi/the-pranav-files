// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmSheenrail(). Re-implemented for Remotion.
import React from "react";
import { random, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";
import { pairOut, yieldFactor } from "../util/strokes-hero";

const Sheen: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const PAL = [pal.rose, pal.accent, pal.violet];
  const rowB = H * 0.78;
  const rowA = rowB - px(b.rowDy ?? 58) * 1.35;
  const fontPx = px(b.fontPx ?? 48) * 1.15;
  const yf = yieldFactor(t, hero?.start ?? 1e9, b.yield);
  const activeIdx = lines.reduce(
    (a, L, i) => (L.words[0].start < (hero?.start ?? 1e9) ? i : a),
    0,
  );
  const drift = ((t / Math.max(1, DUR - 0.04)) * 300) % 300;
  const bandOp = tw(t, 0.12, 0.35, 0, 1, ease.sine.out);
  const bw = px(b.band?.w ?? 860) * 1.1;
  const bh = px(b.band?.h ?? 170) * 1.5;
  const grad = `linear-gradient(100deg, ${PAL[0]} 0%, ${PAL[1]} 32%, ${PAL[2]} 64%, ${PAL[0]} 96%)`;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: yf }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - bw / 2,
          top: (rowA + rowB + fontPx) / 2 - bh / 2,
          width: bw,
          height: bh,
          opacity: bandOp,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(6,10,28,0.55) 0%, rgba(6,10,28,0.3) 55%, rgba(6,10,28,0) 78%)",
        }}
      />
      {lines.map((L, i) => {
        const out = pairOut(lines, i, hero?.start, activeIdx, DUR);
        if (t < L.start - 0.05) return null;
        if (out != null && t > out + 0.7) return null;
        const top = i % 2 ? rowB : rowA;
        const nS = b.streaks ?? 4;
        return (
          <React.Fragment key={L.index}>
            <div
              style={{
                position: "absolute",
                left: W / 2,
                top,
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontFamily: `'${dna.fonts.body}', serif`,
                fontWeight: 600,
                fontSize: Math.min(
                  fontPx,
                  (W * 0.9) /
                    Math.max(6, L.words.reduce((n, w) => n + w.text.length + 1, 0) * 0.5),
                ),
                lineHeight: 1.1,
              }}
            >
              {L.words.map((w, wi) => {
                const st = w.start;
                if (t < st) return <span key={wi} style={{ opacity: 0, marginRight: "0.3em", display: "inline-block" }}>{w.text}</span>;
                const o = out != null && t > out ? out : null;
                const so = o != null ? t - (o + wi * 0.035) : -1;
                let op = tw(t, st, 2 / 30, 0, 1, ease.none);
                let y = tw(t, st, 0.38, px(8), 0, ease.sine.out);
                let blur = 0;
                if (so >= 0) {
                  const k = ease.power1.in(Math.min(1, so / 0.32));
                  op *= 1 - k;
                  y += -px(12) * k;
                  blur = 3 * k;
                }
                const pt = st + 0.16;
                const em = w.emphasis;
                const sweep = em ? tw(t, pt, 0.42, -80, 180, ease.power2.inOut) : 0;
                const shineOp = em && t >= pt && t < pt + 0.34 ? 1 : em && t >= pt + 0.34 ? tw(t, pt + 0.34, 0.12, 1, 0, ease.none) : 0;
                const bright = em && t >= pt && t < pt + 0.42 ? 1 + 0.55 * (1 - Math.abs(((t - pt) / 0.42) * 2 - 1)) : 1;
                const text = w.text.replace(/[.,?!]+$/g, "");
                return (
                  <span
                    key={wi}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginRight: "0.3em",
                      opacity: op,
                      transform: `translateY(${y}px)`,
                      filter: blur ? `blur(${blur}px)` : undefined,
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, top: px(3), color: "rgba(4,8,22,0.7)", filter: `blur(${px(3)}px)` }}>{text}</span>
                    <span
                      style={{
                        position: "relative",
                        backgroundImage: grad,
                        backgroundSize: "300% 100%",
                        backgroundPosition: `${drift}% 50%`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter: bright > 1 ? `brightness(${bright})` : undefined,
                      }}
                    >
                      {text}
                    </span>
                    {em ? (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          opacity: shineOp,
                          backgroundImage:
                            "linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%)",
                          backgroundSize: "260% 100%",
                          backgroundPosition: `${sweep}% 50%`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {text}
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>
            {out != null
              ? Array.from({ length: nS }, (_, k) => {
                  const s0 = Math.min(out + 0.04 + k * 0.05, DUR - 0.66);
                  const u = (t - s0) / 0.62;
                  if (u < 0 || u > 1) return null;
                  const e = ease.power1.out(u);
                  const op = u < 0.5 ? (u / 0.5) * 0.7 : 0.7 * (1 - (u - 0.5) / 0.5);
                  const hh = px(40 + Math.round(random(`sk${b.seed}-${i}-${k}-h`) * 28));
                  const x = W / 2 + (k - (nS - 1) / 2) * px(95) + (random(`sk${b.seed}-${i}-${k}-x`) - 0.5) * px(50);
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: x,
                        top: top + px(14) + px(14) - e * px(92),
                        width: px(3),
                        height: hh,
                        borderRadius: 2,
                        opacity: op,
                        filter: "blur(2px)",
                        background: `linear-gradient(to top, rgba(255,255,255,0) 0%, ${PAL[k % 3]} 50%, rgba(255,255,255,0) 100%)`,
                      }}
                    />
                  );
                })
              : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const paradigm: Paradigm = { Component: Sheen };
export default paradigm;
