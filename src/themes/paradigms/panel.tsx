// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmPanel() (typed console log in a docked glass panel; linkages redact-until-hero + corrupt-on-last-word). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import type { Paradigm, ThemeCtx } from "../types";
import { clean, dockBottom, ff, useRetro } from "../util/retro-common";

const MAXVIS = 6;

const Panel: React.FC<ThemeCtx> = ({ dna, lines, words, hero }) => {
  const { t, px, W, H } = useRetro();
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const A = pal.accent;
  const pn = b.panel ?? {};
  const fontPx = px(b.fontPx ?? 34);
  const lineH = Math.round(fontPx * 1.35);
  const redact = dna.linkages.includes("redact-until-hero");
  const corrupt = dna.linkages.includes("corrupt-on-last-word");
  const nLines = Math.min(lines.length, MAXVIS);
  const stagger = (dna.hero as any)?.params?.lockStagger ?? 0.045;
  const lockT = hero ? hero.start + 0.3 + stagger * (hero.text.length - 1) + 0.083 : 0;
  const panelW = Math.min(W - px(60), px(pn.width ?? 470) * 1.35);
  const left = px(pn.left ?? 36);
  const padX = px(22);

  // panel fade-in + yield
  let op = tw(t, 0.05, 0.3, 0, 1, ease.power2.out);
  let dx = tw(t, 0.05, 0.3, -px(16), 0, ease.power2.out);
  if (hero && b.yield) {
    const dn = tw(t, hero.start - 0.08, 0.25, 1, b.yield.dim, ease.power1.in);
    const up = tw(t, lockT + 0.15, 0.3, 0, 1, ease.power1.out);
    op *= dn + (1 - dn) * up;
  }
  // corrupt-on-last-word: jitter + hue shift
  let filter = "none";
  const last = words[words.length - 1];
  if (corrupt && last) {
    const NZ = last.start + 0.04;
    const seq: [number, number][] = [[3, 0], [-4, 1], [3, 2], [-2, 3], [0, 4]];
    for (const [d, k] of seq)
      if (t >= NZ + k * (1 / 30) && t < NZ + (k + 1) * (1 / 30)) {
        dx += px(d);
        if (d) filter = `hue-rotate(${d * 8}deg)`;
      }
  }
  // terminal scroll: older rows slide up out of the clip
  let scroll = 0;
  lines.forEach((L, li) => {
    if (li >= MAXVIS) scroll += tw(t, L.words[0].start - 0.1, 0.28, 0, -lineH, ease.power2.out);
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left,
          top: dockBottom(H) - (px(18) + px(22) + fontPx * 0.6 + px(18) + nLines * lineH + px(22)),
          width: panelW,
          boxSizing: "border-box",
          padding: `${px(18)}px ${padX}px ${px(22)}px`,
          background: pal.panelBg,
          border: `1px solid ${A}59`,
          borderRadius: 4,
          opacity: op,
          transform: `translateX(${dx}px)`,
          filter,
          boxShadow: `0 0 ${px(24)}px rgba(0,0,0,0.35), inset 0 0 ${px(60)}px ${A}0a`,
        }}
      >
        <div
          style={{
            fontFamily: `${ff(dna.fonts.tag)}, monospace`,
            fontSize: px(22),
            color: pal.prompt,
            letterSpacing: 2,
            borderBottom: `1px solid ${A}40`,
            paddingBottom: px(8),
            marginBottom: px(10),
          }}
        >
          {`OBS-01 // ${pn.header ?? "LOG_"}`}
        </div>
        <div style={{ height: nLines * lineH, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${scroll}px)` }}>
            {lines.map((L, li) => {
              const first = L.words[0].start;
              const lastStart = L.words[L.words.length - 1].start;
              const capEnd = lastStart + 0.25;
              const caretOn =
                b.caret &&
                t >= capEnd &&
                t < capEnd + 0.9 &&
                Math.floor((t - capEnd) / 0.22) % 2 === 0;
              return (
                <div
                  key={li}
                  style={{
                    height: lineH,
                    lineHeight: `${lineH}px`,
                    fontFamily: `${ff(dna.fonts.body)}, monospace`,
                    fontSize: fontPx,
                    color: pal.body,
                    textShadow: `0 0 ${px(8)}px ${A}59`,
                    whiteSpace: "nowrap",
                    opacity: t >= first - 0.03 ? 1 : 0,
                  }}
                >
                  <span style={{ color: pal.prompt, marginRight: px(8) }}>$</span>
                  {L.words.map((w, wi) => {
                    const txt = clean(w.text);
                    const isRed =
                      redact && hero && w.start >= hero.start - 0.01 && w.start <= hero.end + 0.01;
                    const shown = isRed && t < lockT ? "█".repeat(Math.max(3, txt.length - 1)) : txt;
                    const prog = tw(t, w.start, 0.12, 0, 1, ease.steps(Math.max(2, txt.length)));
                    return (
                      <span
                        key={wi}
                        style={{
                          display: "inline-block",
                          marginRight: "0.3em",
                          color: isRed && t >= lockT ? "#7adcff" : undefined,
                          clipPath: `inset(0 ${(1 - prog) * 100}% 0 0)`,
                        }}
                      >
                        {shown}
                      </span>
                    );
                  })}
                  {caretOn ? (
                    <span
                      style={{
                        display: "inline-block",
                        width: px(14),
                        height: px(26),
                        background: pal.body,
                        marginLeft: px(4),
                        verticalAlign: "baseline",
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const paradigm: Paradigm = { Component: Panel };
export default paradigm;
