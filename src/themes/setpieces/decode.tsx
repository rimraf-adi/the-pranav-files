// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceDecode() (slot-machine glyph reels lock left→right, RGB jitter, lock snap, CRT power-off exit). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import type { Hero, Setpiece, ThemeCtx } from "../types";
import { ff, fitPx, heroXY, useRetro } from "../util/retro-common";

const Decode: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, s, px, W, H, dur } = useRetro();
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, any>;
  const TEXT = hero.text.toUpperCase();
  const I = hero.start;
  const E = Math.min(dur - 0.25, I + 1.75);
  const units = [...TEXT].reduce((a, c) => a + (c === " " ? 0.38 : 0.82), 0);
  const fontPx = Math.min(((dna.hero as any)?.fontPx ?? 112) * s, Math.floor((W * 0.8) / Math.max(1, units)));
  void fitPx;
  const { x, y } = heroXY(dna, W, H);
  const A = dna.palette.accent;
  const MG = dna.palette.magenta;
  const stagger = p.lockStagger ?? 0.045;
  const GL: string = p.glyphs ?? "X017#%/<>+=*KZR";

  const reels = React.useMemo(() => {
    const r = mulberry32(p.seed ?? 99);
    return [...TEXT].map((ch) => {
      if (ch === " ") return { ch, cols: [] as string[], n: 0 };
      const n = 5 + Math.floor(r() * 4);
      const cols = Array.from({ length: n }, () => GL[Math.floor(r() * GL.length)]);
      return { ch, cols: [...cols, ch], n };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TEXT]);

  if (t < I - 0.4 || t > E + 0.6) return null;
  const LOCKED = I + 0.3 + stagger * (TEXT.length - 1) + 0.083;
  const dimOp =
    tw(t, I - 0.25, 0.3, 0, dna.plate.dim ?? 0.22, ease.power2.in) * tw(t, E + 0.05, 0.4, 1, 0, ease.power1.in);

  let scale = 1;
  if (t >= LOCKED - 0.083 && t < LOCKED) scale = 1.04;
  else if (t >= LOCKED) scale = tw(t, LOCKED, 0.3, 1.04, 1, ease.elastic.out(1, 0.4));
  let bright = 1;
  let scaleY = 1;
  if (t >= E) bright = tw(t, E, 0.07, 1, 2.6, ease.power2.in);
  if (t >= E + 0.06) scaleY = tw(t, E + 0.06, 0.13, 1, 0.012, ease.power4.in);
  const on = t >= I - 0.02 && t < E + 0.2;
  const boff = Math.max(px(14), Math.min(px(40), (W - units * fontPx) / 2 - px(8)));
  const showBr = !!p.brackets && (W - units * fontPx) / 2 > px(22);
  const brStyle = (k: number): React.CSSProperties => ({
    position: "absolute",
    width: px(26),
    height: px(26),
    opacity: tw(t, I - 0.12 + k * 0.05, 0.22, 0, 0.95, ease.expo.out),
    transform: `scale(${tw(t, I - 0.12 + k * 0.05, 0.22, 0.3, 1, ease.expo.out)})`,
  });
  const bw = `${px(3)}px solid ${A}`;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#021018", opacity: dimOp }} />
      {on ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `translate(-50%,-50%) scale(${scale}, ${scale * scaleY})`,
            filter: `brightness(${bright})`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontFamily: `${ff(dna.fonts.hero)}, sans-serif`,
              fontWeight: 800,
              fontSize: fontPx,
              lineHeight: `${fontPx}px`,
              color: "#eafaff",
            }}
          >
            {reels.map((r, i) => {
              const lock = I + 0.3 + stagger * i;
              const steps = r.n;
              const prog = r.ch === " " ? 0 : tw(t, I, lock - I, 0, 1, ease.steps(Math.max(1, steps)));
              const locked = t >= lock;
              const base = `0 0 ${px(14)}px ${A}8c, 0 3px ${px(16)}px rgba(0,0,0,0.6)`;
              let color = "#eafaff";
              let shadow = base;
              if (r.ch !== " ") {
                if (t < lock) {
                  color = "#bfe9ff";
                  const flip = t >= I + 0.12 + 0.02 * i;
                  shadow = flip
                    ? `${-px(3)}px 0 ${px(10)}px ${A}cc, ${px(3)}px 0 ${px(10)}px ${MG}cc`
                    : `${px(3)}px 0 ${px(10)}px ${A}cc, ${-px(3)}px 0 ${px(10)}px ${MG}cc`;
                } else if (t < lock + 0.083) {
                  color = "#fff";
                  shadow = `0 0 ${px(22)}px rgba(255,255,255,0.95)`;
                }
              }
              void locked;
              return (
                <span
                  key={i}
                  style={{
                    display: "block",
                    height: fontPx,
                    width: `${r.ch === " " ? 0.38 : 0.82}em`,
                    overflow: "hidden",
                    textAlign: "center",
                    color,
                    textShadow: shadow,
                  }}
                >
                  <span style={{ display: "block", transform: `translateY(${-fontPx * steps * prog}px)` }}>
                    {r.cols.map((g, k) => (
                      <span key={k} style={{ display: "block", height: fontPx }}>
                        {g}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </div>
          {showBr ? (
            <>
              <div style={{ ...brStyle(0), left: -boff, top: -px(30), borderLeft: bw, borderTop: bw }} />
              <div style={{ ...brStyle(1), right: -boff, top: -px(30), borderRight: bw, borderTop: bw }} />
              <div style={{ ...brStyle(2), left: -boff, bottom: -px(34), borderLeft: bw, borderBottom: bw }} />
              <div style={{ ...brStyle(3), right: -boff, bottom: -px(34), borderRight: bw, borderBottom: bw }} />
            </>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Decode };
export default setpiece;
