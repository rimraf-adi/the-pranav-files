// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/editorial.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { readable } from "../palettes";
import { ease, tw } from "../../themes/motion";
import type { StyleProps } from "./types";

const BG = "#f1e8d5", INK = "#0e1018", MUTED = "#6b6353";

export const Editorial: React.FC<StyleProps> = ({ content: c, accent, accent2, accent3, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 40 : 56, iw = w - pad * 2;
  const ts = fit(c.title, iw, h * (compact ? 0.34 : 0.3), compact ? 100 : 124, 56, 1.04, 0.46);
  const ds = compact ? 30 : 36;
  const block = tw(t, 0.15, 0.5, 0, 1, ease.back.out());
  const dot = tw(t, 0.35, 0.4, 0, 1), ring = tw(t, 0.55, 0.4, 0, 1);
  const a = readable(accent, BG);
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: pad, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.serif, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 16 : 26 }}>
      <div style={{ position: "absolute", right: -40, top: -40, width: w * 0.38, height: w * 0.38, background: accent, transform: `scale(${block})`, transformOrigin: "100% 0" }} />
      <div style={{ position: "absolute", right: w * 0.26, top: w * 0.3, width: 56, height: 56, borderRadius: "50%", background: accent3, opacity: dot }} />
      <div style={{ position: "absolute", left: pad, bottom: pad * 0.6, width: 90, height: 90, borderRadius: "50%", border: `10px solid ${accent2}`, opacity: ring * 0.9 }} />
      <R at={0.05} d={0.4} kind="fade" style={{ alignSelf: "flex-start", padding: "9px 18px", background: INK, color: BG, font: `700 20px/1 ${FONT.mono}`, letterSpacing: "0.22em", zIndex: 1 }}>{c.kicker || "TAKEAWAY"}</R>
      {c.title ? (
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontStyle: "italic", fontSize: ts, lineHeight: 1.04, letterSpacing: "-0.02em", zIndex: 1 }}>
          <Rich text={c.title} at={0.3} stagger={0.06} kind="blur" hl={{ color: a, fontStyle: "normal" }} />
        </div>
      ) : null}
      {c.detail ? (
        <R at={0.8} d={0.45} kind="fade" style={{ fontSize: ds, lineHeight: 1.45, color: MUTED, maxWidth: "92%", zIndex: 1 }}>
          <Rich text={c.detail} at={-10} kind="fade" hl={{ color: a, fontWeight: 700 }} />
        </R>
      ) : null}
      <div style={{ zIndex: 1 }}><Extras c={c} w={iw} maxH={h * 0.28} k={{ font: FONT.serif, mono: FONT.mono, ink: INK, muted: MUTED, accent, bg: BG, size: ds * 0.9, at: 1.0, marker: "dot", dataFont: FONT.display }} /></div>
    </div>
  );
};
