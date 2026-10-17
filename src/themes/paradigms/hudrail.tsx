// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmHudrail() (arcade HUD bar, coin-pop words, checkerboard dissolve exit, CRT overlays). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import type { Paradigm, ThemeCtx } from "../types";
import {
  Crt,
  F24,
  clean,
  dockBottom,
  ff,
  lineOut,
  useRetro,
  yieldMul,
} from "../util/retro-common";

const Hudrail: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useRetro();
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const A = pal.accent;
  const MG = pal.magenta ?? "#FF2E88";
  const bar = b.bar ?? {};
  const barH = px(bar.h ?? 70);
  const inset = px(bar.inset ?? 24);
  const barTop = dockBottom(H) - barH;
  const barW = W - 2 * inset;
  const boot = tw(t, 0.05, 0.12, 14, 0, ease.steps(2));
  const hudOp = (t >= 0.05 ? 1 : 0) * yieldMul(t, hero?.start, b.yield);
  const blink = t < 0.28 ? 1 : Math.floor((t - 0.28) / 0.45) % 2 === 0 ? 0.3 : 1;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: inset,
          top: barTop,
          width: barW,
          height: barH,
          opacity: hudOp,
          transform: `translateY(${boot * px(1)}px)`,
          background: "rgba(3,8,18,0.84)",
          border: `${px(2)}px solid ${A}`,
          boxShadow: `0 0 ${px(16)}px ${A}59, inset 0 0 ${px(24)}px ${A}14`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: px(14),
            top: px(5),
            fontFamily: `${ff(dna.fonts.tag)}, monospace`,
            fontSize: px(15),
            color: pal.yellow ?? A,
            opacity: blink,
            textShadow: "0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          {b.tags?.left ?? "1UP"}
        </div>
        <div
          style={{
            position: "absolute",
            right: px(14),
            top: px(5),
            fontFamily: `${ff(dna.fonts.tag)}, monospace`,
            fontSize: px(12),
            color: pal.credit ?? A,
            textShadow: "0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          {b.tags?.right ?? "CREDIT 01"}
        </div>
        {lines.map((L, i) => {
          const out = lineOut(lines, i);
          const xo = out - 0.04;
          if (t < L.start - 0.03 || t > xo + 0.2) return null;
          const chars = L.words.reduce((n, w) => n + clean(w.text).length + 0.5, 0);
          const fs = Math.min(px(b.fontPx ?? 26), (barW - px(80)) / Math.max(6, chars));
          return (
            <div
              key={L.index}
              style={{
                position: "absolute",
                left: "50%",
                top: "56%",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                fontFamily: `${ff(dna.fonts.body)}, monospace`,
                fontSize: fs,
                lineHeight: 1,
                textTransform: b.textTransform ?? "none",
                color: pal.body,
                textShadow: "0 3px 0 rgba(0,0,0,0.6)",
              }}
            >
              {L.words.map((w, wi) => {
                const st = w.start;
                if (t < st) return <span key={wi} style={{ display: "inline-block", opacity: 0, marginRight: "0.45em" }}>{clean(w.text)}</span>;
                const gone = t >= (wi % 2 === 0 ? xo : xo + 0.083);
                let color: string = pal.body;
                if (w.emphasis) {
                  if (t >= st + 0.214) color = pal.body;
                  else if (t >= st + 0.172) color = MG;
                  else if (t >= st + 0.13) color = A;
                }
                const sc = tw(t, st, 0.12, 0, 1, ease.steps(2));
                return (
                  <span
                    key={wi}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginRight: "0.45em",
                      opacity: gone ? 0 : 1,
                      transform: `scale(${sc})`,
                      transformOrigin: "50% 100%",
                      color,
                    }}
                  >
                    {clean(w.text)}
                    {t >= st && t < st + F24 ? (
                      <span
                        style={{ position: "absolute", inset: -px(3), background: "#fff", opacity: 0.95 }}
                      />
                    ) : null}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <Crt scan={b.scan ?? 0.06} vig={0.34} />
    </AbsoluteFill>
  );
};

const paradigm: Paradigm = { Component: Hudrail };
export default paradigm;
