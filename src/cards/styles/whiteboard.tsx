// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/whiteboard.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { alpha, readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#fdf6e3", INK = "#1a1a1a", MUTED = "#6e6a5b";

export const Whiteboard: React.FC<StyleProps> = ({ content: c, accent, accent2, accent3, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 52 : 64, iw = w - pad * 2;
  const a = readable(accent, BG, 2.6), a2 = readable(accent2, BG);
  const ts = fit(c.title, iw, h * (compact ? 0.34 : 0.3), compact ? 120 : 148, 64, 1.0, 0.4);
  const ds = compact ? 40 : 48;
  const draw = tw(t, 0.0, 0.9, 0, 1, ease.power2.inOut);
  // wobbly hand-drawn rectangle, stroke-drawn
  const x0 = 18, y0 = 18, x1 = w - 18, y1 = h - 18;
  const path = `M${x0 + 6},${y0 + 3} Q${w / 2},${y0 - 5} ${x1 - 4},${y0 + 5} Q${x1 + 4},${h / 2} ${x1 - 3},${y1 - 4} Q${w / 2},${y1 + 6} ${x0 + 5},${y1 - 2} Q${x0 - 3},${h / 2} ${x0 + 6},${y0 + 3}`;
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${pad * 0.8}px ${pad}px`, position: "relative", overflow: "hidden", backgroundColor: BG, color: INK, fontFamily: FONT.hand, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 16 : 28,
      backgroundImage: "radial-gradient(circle at 30% 20%, rgba(0,0,0,.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,.02) 0%, transparent 50%)" }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={path} pathLength={1} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
      <R at={0.1} d={0.4} kind="left" style={{ alignSelf: "flex-start", font: `700 40px/1 ${FONT.hand}`, color: a, transform: "rotate(-2deg)", paddingLeft: 8 }}>{c.kicker || "takeaway"}</R>
      {c.title ? (
        <div style={{ fontWeight: 700, fontSize: ts, lineHeight: 1.0 }}>
          <Rich text={c.title} at={0.3} stagger={0.06} kind="pop" hl={{ color: a2, backgroundImage: `linear-gradient(transparent 62%, ${alpha(accent3, 0.75)} 62%, ${alpha(accent3, 0.75)} 92%, transparent 92%)` }} />
        </div>
      ) : null}
      {c.detail ? (
        <R at={0.85} d={0.45} kind="fade" style={{ fontSize: ds, lineHeight: 1.2, color: MUTED, maxWidth: "94%" }}>
          <Rich text={c.detail} at={-10} kind="fade" hl={{ color: a, fontWeight: 700 }} />
        </R>
      ) : null}
      <Extras c={c} w={iw} maxH={h * 0.28} k={{ font: FONT.hand, mono: FONT.hand, ink: INK, muted: MUTED, accent: a, bg: BG, size: ds * 0.95, at: 1.1, marker: "arrow" }} />
    </div>
  );
};
