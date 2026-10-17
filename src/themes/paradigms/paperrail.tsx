// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmPaperrail() (kraft strip, steps(2) chip placement, washi tape, peel-off exits, hero star hand-off). Re-implemented for Remotion.
import React from "react";
import { random } from "remotion";
import { tw } from "../motion";
import { useStage } from "../stage";
import { lineOut, rnd, stepQ, STAR_CLIP, isHeroWord } from "../util/craft-shared";
import { mulberry32 } from "../motion";
import type { Paradigm, ThemeCtx } from "../types";

const Paper: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, frame, px, W, H } = useStage();
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const seed: number = b.seed ?? 150372;
  const stripW = Math.min(W * 0.94, px((b.strip?.w ?? 1140) * 0.95));
  const stripH = px(b.strip?.h ?? 88) * 1.45;
  const SX = (W - stripW) / 2;
  const ST = H * 0.88 - stripH;
  const k = (px(b.fontPx ?? 38) * 1.0) / px(38);
  const r = (v: number) => px(v) * k;
  const tapeDelay = b.tapeDelay ?? 0.25;
  const I = hero?.start ?? Infinity;

  const torn = React.useMemo(() => {
    const rr = mulberry32(seed);
    const pts: string[] = [];
    const SEG = 28;
    for (let i = 0; i <= SEG; i++)
      pts.push(
        `${((stripW / SEG) * i).toFixed(1)}px ${Math.max(0, (rr() - 0.5) * 12 + 6).toFixed(1)}px`,
      );
    pts.push(`${stripW}px ${stripH}px`, `0px ${stripH}px`);
    return `polygon(${pts.join(",")})`;
  }, [seed, stripW, stripH]);

  // strip: placed on the table (steps(3) slide), 4-frame handmade jitter
  const slide = stepQ((t - 0.1) / 0.18, 3);
  const sy = (1 - slide) * (stripH + px(26));
  const jf = Math.floor(frame / 4);
  const jx = t > 0.45 ? (random(`pj-x-${jf}`) - 0.5) * 2 : 0;
  const jy = t > 0.45 ? (random(`pj-y-${jf}`) - 0.5) * 2 : 0;
  const jr = t > 0.45 ? (random(`pj-r-${jf}`) - 0.5) * 0.36 : 0;
  let wrapOp = t < 0.1 ? 0 : 1;
  if (hero && b.yield) {
    const dimT = Math.max(0.15, I - (b.yield.pre ?? 0.2));
    const resT = I + (b.yield.post ?? 0.9);
    wrapOp *=
      t < resT
        ? tw(t, dimT, 0.1, 1, b.yield.dim, (x) => x)
        : tw(t, resT, 0.22, b.yield.dim, 1, (x) => x);
  }

  return (
    <div style={{ position: "absolute", inset: 0, opacity: wrapOp }}>
      <div
        style={{
          position: "absolute",
          left: SX,
          top: ST,
          width: stripW,
          height: stripH,
          transform: `translate(${jx}px, ${sy + jy}px) rotate(${jr}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, #bd9e6f 0%, #b89968 45%, #a8854f 100%)",
            boxShadow: "inset 0 -4px 0 rgba(90,66,30,0.55)",
            clipPath: torn,
          }}
        />
        {[
          { left: -px(16), top: -px(11), rot: -38 },
          { right: -px(14), top: -px(9), rot: 33 },
        ].map((tp, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...tp,
              width: px(84),
              height: px(24),
              opacity: 0.62,
              background: "rgba(255,99,84,0.85)",
              transform: `rotate(${tp.rot}deg)`,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 6px, rgba(255,255,255,0) 6px 13px)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: px(26),
            top: stripH - px(36),
            fontFamily: `'${dna.fonts.tag}', cursive`,
            fontSize: px(24),
            color: pal.tag ?? "#503d20",
            opacity: 0.85,
            whiteSpace: "nowrap",
            transform: "rotate(-2deg)",
          }}
        >
          {b.tag ?? "cut & paste · 12 fps"}
        </div>
      </div>
      {lines.map((L, li) => {
        const outT = lineOut(lines, li);
        const xo = outT - 0.04;
        const n = L.words.length + 1;
        if (t < L.start - 0.05 || t > xo + n * 0.03 + 0.25) return null;
        const isLastLine = li === lines.length - 1;
        // fit font to strip
        const fs = Math.min(
          px(b.fontPx ?? 38) * 1.3,
          (stripW * 0.92) /
            Math.max(
              6,
              L.words.reduce((a, w) => a + w.text.length * 0.56 + 1.3, 0),
            ),
        );
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: ST + px(18),
              transform: `translate(-50%, ${sy}px)`,
              whiteSpace: "nowrap",
              fontSize: fs,
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              const isHero = isHeroWord(hero, w);
              const isLast = isLastLine && wi === L.words.length - 1;
              const kind = isHero ? 2 : isLast ? 3 : w.emphasis ? 1 : 0;
              const wxo = xo + wi * 0.03;
              const hidden = t < st;
              const gone = t > wxo + 0.2;
              if (hidden || gone) {
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      padding: `${r(5)}px ${r(14)}px ${r(7)}px`,
                      marginRight: r(10),
                      opacity: 0,
                      width: kind === 2 ? r(46) : undefined,
                    }}
                  >
                    {kind === 2 ? "" : w.text.replace(/[.,?!]+$/g, "")}
                  </span>
                );
              }
              const r0 = (rnd(seed, li * 31 + wi) - 0.5) * 5;
              const place = stepQ((t - st) / 0.12, 2);
              let y = (1 - place) * -16 * (fs / 38 / 1.0);
              const sc = 1.06 - 0.06 * place;
              let rot = r0;
              if (t > st + 0.4) {
                const slot = Math.floor((t - st - 0.4) / 0.21);
                rot = r0 + (rnd(seed + 5, li * 977 + wi * 13 + slot) - 0.5) * 1.0;
              }
              let tapeT = 0;
              if (kind === 1) {
                const tt = Math.min(st + tapeDelay, xo - 0.2);
                if (tt >= st + 0.08) tapeT = tt;
              }
              if (tapeT && t >= tapeT && t < tapeT + 0.0833) y += 2;
              let op = 1;
              if (t >= wxo) {
                const p = stepQ((t - wxo) / 0.18, 3);
                rot = r0 + -8 * p;
                y = y + -40 * p;
                op = 1 - p;
              }
              if (kind === 2) {
                let ss = 1;
                if (t >= st + 0.09) ss = t < st + 0.17 ? 1.18 : t < st + 0.25 ? 1.06 : 1;
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      position: "relative",
                      width: r(46),
                      height: r(44),
                      marginRight: r(10),
                      verticalAlign: -r(7),
                      opacity: op,
                      transform: `translateY(${y}px) rotate(${rot}deg) scale(${sc})`,
                      transformOrigin: "50% 80%",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: pal.accent,
                        clipPath: STAR_CLIP,
                        transform: `scale(${ss})`,
                        filter: "drop-shadow(0 3px 0 rgba(58,38,16,0.38))",
                      }}
                    />
                  </span>
                );
              }
              const red = kind === 3;
              return (
                <span
                  key={wi}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginRight: r(10),
                    padding: `${r(5)}px ${r(14)}px ${r(7)}px`,
                    background: red ? pal.accent : (pal.chip ?? "#f6edd8"),
                    border: `1px solid ${red ? (pal.accentEdge ?? "#c93527") : (pal.chipEdge ?? "#cdb98e")}`,
                    borderRadius: 3,
                    boxShadow: "0 3px 0 rgba(58,38,16,0.38)",
                    fontFamily: `'${dna.fonts.body}', sans-serif`,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    color: red ? "#fff3e4" : pal.body,
                    opacity: op,
                    transform: `translateY(${y}px) rotate(${rot}deg) scale(${sc})`,
                    transformOrigin: "50% 80%",
                  }}
                >
                  {w.text.replace(/[.,?!]+$/g, "")}
                  {tapeT && t >= tapeT ? (
                    <span
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -15,
                        width: r(58),
                        height: r(18),
                        opacity: 0.92,
                        background: "rgba(255,79,63,0.66)",
                        transform: `rotate(-36deg) scale(${1 + 0.7 * (1 - stepQ((t - tapeT) / 0.0833, 2))})`,
                        backgroundImage:
                          "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 5px, rgba(255,255,255,0) 5px 11px)",
                      }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const paradigm: Paradigm = { Component: Paper };
export default paradigm;
