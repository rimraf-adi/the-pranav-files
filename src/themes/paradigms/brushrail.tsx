// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmBrushrail(). Re-implemented for Remotion.
import React from "react";
import { random, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";
import { yieldFactor } from "../util/strokes-hero";

const ULD1 = "M 5 8 C 30 11.5, 68 4, 95 7";
const ULD2 = "M 2 9 C 32 12.5, 66 4.5, 98 7.5";

const Brush: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const stripW = Math.min(px(b.strip?.w ?? 820), W * 0.92);
  const stripH = px(b.strip?.h ?? 90) * 1.25;
  const CX = W / 2;
  const CY = H * 0.8;
  const maxHold = b.maxHold ?? 0.78;
  const INKB = pal.body as string;
  const data = lines.map((L, li) => {
    const lastSt = L.words[L.words.length - 1].start;
    const out = lines[li + 1]?.start ?? L.end + 1;
    let eraseT: number, eraseEnd: number;
    if (li === lines.length - 1) {
      eraseT = DUR - 0.142;
      eraseEnd = DUR - 0.032;
    } else {
      eraseT = Math.max(lastSt + 0.18, Math.min(out - 0.136, lastSt + maxHold));
      eraseEnd = Math.max(eraseT + 0.06, Math.min(out + 0.004, eraseT + 0.14));
    }
    return { eraseT, eraseEnd };
  });
  const lastE = data[data.length - 1].eraseT;
  const heroLi = hero ? lines.findIndex((L) => hero.start >= L.start - 0.01 && hero.start < (lines[L.index + 1]?.start ?? Infinity)) : -1;
  const yf = yieldFactor(t, hero?.start ?? 1e9, b.yield);
  const bandOpen = tw(t, 0.08, 0.2, 0, 1, ease.power2.out) * (1 - tw(t, lastE, 0.13, 0, 1, ease.power2.in));
  const bandHead = t < 0.3 ? tw(t, 0.08, 0.2, -30, 100, ease.power2.out) : t >= lastE ? tw(t, lastE, 0.13, 100, -5, ease.power2.in) : -100;
  const breathe = 0.4 + 0.05 * Math.sin(2 * Math.PI * 0.32 * Math.max(0, t - 0.3));
  const fontPx = px(b.fontPx ?? 44) * 1.05;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CX - stripW / 2,
          top: CY - stripH / 2,
          width: stripW,
          height: stripH,
          opacity: yf,
          clipPath: `inset(0% ${100 - bandOpen * 100}% 0% 0%)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `linear-gradient(180deg, ${pal.paperHi} 0%, ${pal.paperLo} 100%)`, transform: "rotate(-0.7deg) scale(1.012)", opacity: breathe }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `linear-gradient(180deg, ${pal.paperHi} 0%, ${pal.paperLo} 100%)`, transform: "rotate(0.5deg) scaleX(0.99)", opacity: 0.42 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `linear-gradient(180deg, ${pal.sheetHi}ed 0%, ${pal.sheetLo}ed 100%)`, boxShadow: "0 5px 20px rgba(18,14,10,0.4), inset 0 0 26px rgba(120,98,70,0.18)" }} />
        {(t < 0.3 || t >= lastE) && (
          <div style={{ position: "absolute", top: "-8%", left: `${bandHead}%`, width: px(30), height: "116%", opacity: 0.6, filter: "blur(7px)", background: `linear-gradient(90deg, ${pal.bh}00 0%, ${pal.bh}80 100%)` }} />
        )}
      </div>
      {lines.map((L, li) => {
        const { eraseT, eraseEnd } = data[li];
        if (t < L.words[0].start - 0.02 || t > eraseEnd + 0.02) return null;
        const rot = (random(`br-${b.seed}-${li}`) - 0.5) * 2;
        const wipe = ease.power2.in(Math.min(1, Math.max(0, (t - eraseT) / Math.max(0.01, eraseEnd - eraseT))));
        const lop = li === heroLi ? yf : 1;
        const fs = Math.min(fontPx, (stripW * 0.94) / Math.max(6, L.words.reduce((n, w) => n + w.text.length + 1.2, 0) * 0.55));
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: CX,
              top: CY - 1,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              whiteSpace: "nowrap",
              fontFamily: `'${dna.fonts.body}', serif`,
              fontWeight: b.weight ?? 600,
              fontSize: fs,
              lineHeight: 1,
              color: pal.body,
              textShadow: "0 1px 2px rgba(70,48,26,0.22)",
              opacity: lop,
              clipPath: `inset(-30% ${wipe * 100}% -30% 0%)`,
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              const u = ease.power2.out(Math.min(1, Math.max(0, (t - st) / 0.16)));
              const head = tw(t, st, 0.16, -26, 100, ease.power2.out);
              const text = w.text.replace(/[.,?!]+$/g, "");
              const ulF = ease.power2.out(Math.min(1, Math.max(0, (t - Math.min(st + 0.12, DUR - 0.3)) / 0.22)));
              const ulC = ease.power2.out(Math.min(1, Math.max(0, (t - Math.min(st + 0.15, DUR - 0.3)) / 0.22)));
              return (
                <span key={wi} style={{ display: "inline-block", position: "relative", marginRight: "0.3em" }}>
                  <span style={{ display: "inline-block", position: "relative", clipPath: `inset(-14% ${100 - u * 100}% -14% 0%)` }}>
                    {text}
                    {t >= st && t < st + 0.17 ? (
                      <span style={{ position: "absolute", top: "-14%", left: `${head}%`, width: px(26), height: "128%", opacity: 0.55, filter: "blur(6px)", background: `linear-gradient(90deg, ${INKB}00 0%, ${INKB}8c 100%)` }} />
                    ) : null}
                  </span>
                  {w.emphasis ? (
                    <svg viewBox="0 0 100 14" preserveAspectRatio="none" style={{ position: "absolute", left: "-3%", bottom: -px(12), width: "106%", height: px(14), overflow: "visible" }}>
                      {[
                        [ULD1, 7, 0.3, ulF],
                        [ULD2, 2.6, 0.95, ulC],
                      ].map(([d, sw, so, f], k) =>
                        (f as number) > 0 ? (
                          <path key={k} d={d as string} pathLength={1} fill="none" stroke={pal.ulInk} strokeWidth={sw as number} strokeOpacity={so as number} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - (f as number)} vectorEffect="non-scaling-stroke" style={{ strokeWidth: (sw as number) * px(1) * 0.6 }} />
                        ) : null,
                      )}
                    </svg>
                  ) : null}
                </span>
              );
            })}
            {t >= eraseT && t < eraseEnd + 0.01 ? (
              <div style={{ position: "absolute", top: "-18%", left: `${100 - wipe * 100 - 3}%`, width: px(34), height: "136%", opacity: 0.5, filter: "blur(7px)", background: `linear-gradient(270deg, ${INKB}00 0%, ${INKB}80 100%)` }} />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const paradigm: Paradigm = { Component: Brush };
export default paradigm;
