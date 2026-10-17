// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/minimal.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { mix, readable } from "../palettes";
import type { StyleProps } from "./types";

export const Minimal: React.FC<StyleProps> = ({ content: c, palette, accent, w, h }) => {
  const { t } = useClock();
  const BG = palette.bg, INK = palette.text, MUTED = mix(INK, BG, 0.45);
  const compact = h < 700;
  const pad = compact ? 52 : 84, iw = w - pad * 2;
  const ts = fit(c.title, iw, h * (compact ? 0.4 : 0.34), compact ? 112 : 132, 60, 0.98, 0.52);
  const ds = compact ? 30 : 38;
  const rule = tw(t, 0.55, 0.5, 0, 1, ease.power2.out);
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${pad * 0.8}px ${pad}px`, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.sans, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 28 : 52 }}>
      <R at={0.05} d={0.4} kind="fade" style={{ font: `700 20px/1 ${FONT.sans}`, letterSpacing: "0.32em", textTransform: "uppercase" }}>{c.kicker || "Takeaway"}</R>
      {c.title ? (
        <div style={{ fontWeight: 900, fontSize: ts, lineHeight: 0.98, letterSpacing: "-0.04em" }}>
          <Rich text={c.title} at={0.2} stagger={0.07} kind="rise" hl={{ color: readable(accent, BG, 2.2) }} />
        </div>
      ) : null}
      <div style={{ height: 5, width: iw * 0.3 * rule, background: INK }} />
      {c.detail ? (
        <R at={0.75} d={0.5} kind="fade" style={{ fontSize: ds, lineHeight: 1.4, color: MUTED, maxWidth: "88%", letterSpacing: "-0.005em" }}>{c.detail.replace(/\*/g, "")}</R>
      ) : null}
      <Extras c={c} w={iw} maxH={h * 0.28} k={{ font: FONT.sans, mono: FONT.mono, ink: INK, muted: MUTED, accent, bg: BG, size: ds * 0.9, at: 1.0, marker: "dash" }} />
    </div>
  );
};
