// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmInkrail(). Re-implemented for Remotion.
import React from "react";
import { useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";

const clean = (s: string) => s.replace(/[.,?!]+$/g, "");

const InkRail: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const INK = pal.body as string;
  const PAP = (pal.paper as string) ?? "#fffaee";
  const PAP2 = (pal.paper2 as string) ?? "#fff8e8";
  const n = lines.length;
  const base = n >= 3 ? 0 : 3 - n;
  const rowGap = px(b.rowGap ?? 56);
  // portrait: last reading row sits at ~82% of the frame height (safe zone)
  const lastRowY = H * 0.82;
  const yld = b.yield as { dim: number; delay?: number; post?: number };
  const IKLATE = DUR - 0.84;

  return (
    <>
      {lines.map((L, li) => {
        const slot = li === n - 1 && n >= 3 ? 2 : base + (li % 2);
        const y = lastRowY - (2 - slot) * rowGap;
        let outT: number | null = null;
        let outDur = 0;
        if (li + 2 < n) {
          outDur = Math.max(0.35, 0.5 - 0.05 * li);
          outT = Math.max(
            L.words[L.words.length - 1].start + 0.25,
            lines[li + 2].words[0].start - outDur - 0.05,
          );
        }
        const inT = L.start;
        if (t < inT - 0.02) return null;
        if (outT !== null && t > outT + outDur + 0.02) return null;

        // exit: re-dissolve (blur up + spread + fade + rise)
        let lineOp = 1;
        let lineBlur = 0;
        let lineScale = 1;
        let lineY = 0;
        if (outT !== null) {
          lineOp = tw(t, outT, outDur, 1, 0, ease.power1.in);
          lineBlur = tw(t, outT, outDur, 0, px(9), ease.power1.in);
          lineScale = tw(t, outT, outDur, 1, 1.13, ease.power1.in);
          lineY = tw(t, outT, outDur, 0, -px(8), ease.power1.in);
        }
        // yield while the drop blooms
        if (hero && yld) {
          const dimT = hero.start + (yld.delay ?? 0.12);
          if (inT < dimT - 0.05 && (outT === null || outT > dimT + 0.35)) {
            const resT = hero.start + (yld.post ?? 1.07);
            const dimmed = tw(t, dimT, 0.3, 1, yld.dim, ease.power1.out);
            const restore =
              outT === null || resT + 0.33 < outT
                ? tw(t, resT, 0.3, 0, 1, ease.power1.out)
                : 0;
            lineOp *= dimmed + (1 - dimmed) * restore;
          }
        }
        const fontPx = Math.min(
          px(b.fontPx ?? 46),
          (W * 0.86) /
            Math.max(
              8,
              L.words.reduce((a, w) => a + clean(w.text).length + 1.2, 0) * 0.62,
            ),
        );
        const ruleT = L.words[0].start + 0.12;
        const ruleSx = tw(t, ruleT, 0.9, 0, 1, ease.power2.out);

        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: y,
              transform: `translate(-50%, -50%) translateY(${lineY}px) scale(${lineScale})`,
              opacity: lineOp,
              filter: lineBlur > 0.05 ? `blur(${lineBlur}px)` : undefined,
              whiteSpace: "nowrap",
              fontFamily: `'${dna.fonts.body}', serif`,
              fontWeight: b.weight ?? 400,
              fontSize: fontPx,
              lineHeight: 1.25,
              letterSpacing: b.letterSpacing ?? "0.055em",
              color: INK,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "7%",
                bottom: -px(7),
                width: "86%",
                height: Math.max(2, px(2)),
                opacity: t >= ruleT ? 0.55 : 0,
                transform: `scaleX(${ruleSx})`,
                background: `linear-gradient(90deg, ${INK}00 0%, ${INK}8c 18%, ${INK}8c 82%, ${INK}00 100%)`,
                boxShadow: `0 1px 7px ${PAP}8c`,
                filter: "blur(0.8px)",
              }}
            />
            {L.words.map((w, wi) => {
              const st = w.start;
              const em = !!w.emphasis;
              const late = st > IKLATE;
              const txt = clean(w.text);
              const inkOp = tw(t, st, 0.083, 0, 1, ease.none);
              const bleedDur = late ? 0.4 : 0.6;
              const blur = tw(t, st, bleedDur, px(12), 0, ease.power2.out);
              const sc = tw(t, st, bleedDur, 1.25, 1, ease.power2.out);
              const haloDur = late ? 0.5 : 0.7;
              const haloSc = tw(t, st, haloDur, 1.5, 1.04, ease.power2.out);
              const haloOp = tw(
                t,
                st,
                haloDur,
                em ? 0.55 : 0.5,
                em ? 0.3 : 0.25,
                ease.power2.out,
              );
              // wisp (emphasis)
              const wt = st + 0.55;
              const dir = li % 2 === 0 ? 1 : -1;
              const showWisp = em && st + 1.55 <= DUR - 0.03 && t >= wt;
              const wispOp = showWisp
                ? 0.5 * tw(t, st + 1.12, 0.42, 1, 0, ease.power1.in)
                : 0;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    marginRight: wi < L.words.length - 1 ? "0.34em" : 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: t >= st ? haloOp : 0,
                      transform: `scale(${haloSc})`,
                      transformOrigin: "50% 60%",
                      filter: `blur(${px(9)}px)`,
                    }}
                  >
                    {txt}
                  </span>
                  <span
                    style={{
                      position: "relative",
                      display: "inline-block",
                      opacity: inkOp,
                      transform: `scale(${sc})`,
                      transformOrigin: "50% 60%",
                      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                      textShadow: `0 0 5px ${PAP}, 0 0 14px ${PAP}f2, 0 0 30px ${PAP2}d9, 0 1px 2px ${PAP}e6`,
                    }}
                  >
                    {txt}
                  </span>
                  {wispOp > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: -px(16),
                        width: px(22),
                        height: px(28),
                        marginLeft: -px(11),
                        opacity: wispOp,
                        border: `${px(3)}px solid transparent`,
                        borderTopColor: `${INK}8c`,
                        borderRadius: "50%",
                        filter: `blur(${px(2)}px)`,
                        transform: `translate(${tw(t, wt, 1.0, 0, 10 * dir, ease.power1.out) * px(1)}px, ${tw(t, wt, 1.0, 0, -38, ease.power1.out) * px(1)}px) rotate(${tw(t, wt, 1.0, 12 * dir, 92 * dir, ease.power1.out)}deg) scaleY(${tw(t, wt, 1.0, 1, 1.55, ease.power1.out)})`,
                      }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const paradigm: Paradigm = { Component: InkRail };
export default paradigm;
