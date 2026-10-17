// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceDetonation(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, interpolateColors } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const Detonation: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const I = hero.start;
  const O = I + Math.max(1.7, hero.end - hero.start + 1.1);
  if (t < I - 0.5 || t > O + 0.1) return null;
  const h = dna.hero as any;
  const p = h.params;
  const pal = dna.palette;
  const text = hero.text.toUpperCase();
  const fontPx = Math.min(px(h.fontPx ?? 178), (W * 0.88) / (text.length * 0.5));
  const bw = Math.min(W * 0.76, text.length * fontPx * 0.5 + px(60));
  const cx = W / 2;
  const cy = H * 0.25;

  const scrim = (() => {
    let v = tw(t, I - 0.42, 0.4, 0, dna.plate.charge, ease.power2.in);
    if (t >= I + 0.1) v = tw(t, I + 0.1, 0.9, dna.plate.charge, 0.3, ease.power2.out);
    return v * tw(t, O - 0.25, 0.45, 1, 0, ease.power1.in);
  })();
  const dimP =
    t < I
      ? 0
      : tw(t, I + 0.1, 0.9, dna.plate.dim, dna.plate.dim * 0.47, ease.power2.out) *
        tw(t, O - 0.25, 0.45, 1, 0, ease.power1.in);

  // whole stamp scale
  let sx = 1;
  let sy = 1;
  if (t < I + 0.05) {
    sx = sy = tw(t, I - 0.05, 0.1, 3.4, 1, ease.power4.in);
  } else {
    const k = tw(t, I + 0.13, 0.55, 0, 1, ease.elastic.out(1.05, 0.34));
    sx = 1.12 + (1 - 1.12) * k;
    sy = 0.9 + (1 - 0.9) * k;
    const g = tw(t, I + 0.75, 1.2, 1, 1.035, ease.power1.inOut);
    sx *= g;
    sy *= g;
  }
  const detOp = t >= I - 0.05 ? 1 : 0;

  const exitK = (i: number) => tw(t, O - 0.18 + i * 0.01, 0.16, 0, 1, ease.power2.in);
  const bands = (p.slices as number[][]).map((s, i) => {
    const shear = (p.sliceShear as number[])[i] * (W / 1280);
    let x: number;
    let filt: string;
    let color: string;
    if (t < I + 0.05) {
      x = tw(t, I - 0.05, 0.1, shear, shear * 0.26, ease.power4.in);
      const bl = tw(t, I - 0.05, 0.1, 14, 0, ease.power4.in);
      const br = tw(t, I - 0.05, 0.1, 3.4, 1.5, ease.power4.in);
      filt = `blur(${bl}px) brightness(${br})`;
      color = pal.body;
    } else {
      x = 0;
      const br = t < I + 0.15 ? 1.9 : tw(t, I + 0.15, 0.5, 1.9, 1, ease.power2.out);
      filt = `brightness(${br})`;
      const c = tw(t, I + 0.22, 0.9, 0, 1, ease.power1.in);
      color = t < I + 0.22 ? pal.hot : interpolateColors(c, [0, 1], [pal.hot, pal.body]);
    }
    const ex = exitK(i);
    x += -shear * 1.5 * ex;
    return { s, x, filt, color, op: 1 - ex };
  });

  const barS = tw(t, I + 0.16, 0.34, 0, 1, ease.expo.out);
  const furnOp = tw(t, O - 0.18, 0.13, 1, 0, ease.none);
  const tickS = tw(t, I + 0.42, 0.14, 0, 1, ease.back.out(2));
  const tagW = tw(t, I + 0.5, 0.45, 0, px(340), ease.steps(16));
  const heatOp =
    (t < I + 0.5
      ? tw(t, I + 0.06, 0.3, 0, 0.75, ease.none)
      : tw(t, I + 0.5, 1.4, 0.75, 0.3, ease.none)) * furnOp;

  const bandStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: `'${dna.fonts.hero}', sans-serif`,
    fontSize: fontPx,
    lineHeight: 1,
    letterSpacing: "0.012em",
    whiteSpace: "nowrap",
    textShadow: "0 3px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)",
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: scrim,
          background:
            "radial-gradient(120% 105% at 50% 38%, rgba(0,0,0,0) 26%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      <AbsoluteFill style={{ opacity: dimP, background: "#000" }} />
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          opacity: detOp,
          transform: `scale(${sx}, ${sy})`,
        }}
      >
        <div
          style={{
            ...bandStyle,
            transform: "translate(-50%,-50%) translateY(6px)",
            color: "#ff7a28",
            filter: "blur(24px)",
            opacity: heatOp,
            textShadow: "none",
          }}
        >
          {text}
        </div>
        {bands.map((b, i) => (
          <div
            key={i}
            style={{
              ...bandStyle,
              transform: `translate(-50%,-50%) translateX(${b.x}px)`,
              clipPath: `inset(${b.s[0]}% 0 ${b.s[1]}% 0)`,
              color: b.color,
              filter: b.filt,
              opacity: b.op,
            }}
          >
            {text}
          </div>
        ))}
        {p.bars
          ? [-fontPx * 0.7, fontPx * 0.66].map((y, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -bw / 2,
                  top: y,
                  width: bw,
                  height: px(3),
                  background: pal.body,
                  opacity: 0.85 * furnOp,
                  transform: `scaleX(${barS})`,
                }}
              />
            ))
          : null}
        {p.ticks
          ? [-bw / 2, bw / 2 - 3].map((x, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: -fontPx * 0.7,
                  width: px(3),
                  height: px(14),
                  background: pal.hot,
                  opacity: furnOp * (t >= I + 0.42 ? 1 : 0),
                  transform: `scaleY(${tickS})`,
                  transformOrigin: "50% 100%",
                }}
              />
            ))
          : null}
        {p.tag ? (
          <div
            style={{
              position: "absolute",
              left: -px(170),
              top: fontPx * 0.7,
              width: tagW,
              overflow: "hidden",
              whiteSpace: "nowrap",
              opacity: furnOp,
            }}
          >
            <span
              style={{
                fontFamily: `'${dna.fonts.tag}', monospace`,
                fontSize: px(21),
                letterSpacing: "0.34em",
                color: pal.hot,
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              {p.tag}&nbsp;//&nbsp;T+{I.toFixed(2)}S
            </span>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Detonation };
export default setpiece;
