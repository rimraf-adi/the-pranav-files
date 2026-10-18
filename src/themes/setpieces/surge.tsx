// Surge: the climax word for "it went UP". Letters spring up from below one by one in the accent red,
// an arrow shoots up from behind the head, the word drifts upward while held, then letters fly up and out.
// Exits shortly after the word is spoken (hero.end + exitPad) so it never lingers into the next sentence.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const Surge: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const prm = ((dna.hero as any)?.params ?? {}) as { exitPad?: number; color?: string; y?: number; arrow?: boolean };
  const I = hero.start;
  const E = hero.end + (prm.exitPad ?? 0.45);
  if (t < I - 0.3 || t > E + 0.45) return null;
  const fontPx = px((dna.hero as any)?.fontPx ?? 130);
  const red = prm.color ?? (dna.palette.hero as string) ?? "#FF2D2D";
  const text = hero.text.replace(/[^\p{L}\p{N}%]/gu, "").toUpperCase();

  const dim = dna.plate.dim as number | undefined;
  const dimOp = dim ? tw(t, I - 0.2, 0.25, 0, dim, ease.power2.in) * tw(t, E, 0.35, 1, 0, ease.power1.in) : 0;
  const drift = tw(t, I + 0.3, Math.max(0.2, E - I - 0.3), 0, -px(22), ease.power1.inOut);
  const thump = tw(t, I + 0.16, 0.06, 0, 1) * tw(t, I + 0.22, 0.25, 1, 0, ease.power2.out);

  const arrowK = tw(t, I + 0.05, 0.35, 0, 1, ease.expo.out) * tw(t, E - 0.05, 0.25, 1, 0, ease.power2.in);
  const arrowLen = px(150) * arrowK;
  const cy = H * (prm.y ?? 0.4);
  const cx = W / 2, top = cy - fontPx * 0.55;

  return (
    <AbsoluteFill>
      {dim ? <AbsoluteFill style={{ background: "#06080c", opacity: dimOp }} /> : null}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: arrowK > 0 && prm.arrow !== false ? 1 : 0 }}>
        {[-1, 0, 1].map((k) => {
          const x = cx + k * fontPx * 1.15;
          const len = arrowLen * (k === 0 ? 1 : 0.55);
          return k === 0 ? (
            <g key={k} style={{ filter: `drop-shadow(0 0 ${px(10)}px ${red})` }}>
              <line x1={x} y1={top} x2={x} y2={top - len} stroke={red} strokeWidth={px(9)} strokeLinecap="round" />
              <path d={`M${x - px(22)} ${top - len + px(12)} L${x} ${top - len - px(18)} L${x + px(22)} ${top - len + px(12)} Z`} fill={red} />
            </g>
          ) : (
            <line key={k} x1={x} y1={top - px(10)} x2={x} y2={top - px(10) - len} stroke={red} strokeOpacity={0.5} strokeWidth={px(3)} strokeLinecap="round" />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%) translateY(${drift}px) scale(${1 + 0.04 * thump})`, display: "flex", whiteSpace: "nowrap", fontFamily: `'${dna.fonts.hero}', sans-serif`, fontWeight: 900, fontSize: fontPx, lineHeight: 1, letterSpacing: "0.01em" }}>
        {[...text].map((ch, i) => {
          const a = I - 0.04 + i * 0.045;
          const inK = tw(t, a, 0.34, 0, 1, ease.back.out(2.4));
          const o = tw(t, a, 0.08, 0, 1);
          const e0 = E + i * 0.035;
          const out = tw(t, e0, 0.22, 0, 1, ease.power2.in);
          const y = (1 - inK) * fontPx * 0.7 - out * fontPx * 0.6;
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: o * (1 - out), filter: `blur(${out * px(4)}px)`, color: red, textShadow: `0 0 ${px(26)}px rgba(255,45,45,0.45), 0 2px 10px rgba(0,0,0,0.45)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Surge };
export default setpiece;
