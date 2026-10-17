// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/audit.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#ebd9b4", INK = "#1d1a14", MUTED = "#6b5e44";

export const Audit: React.FC<StyleProps> = ({ content: c, accent, accent2, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const padX = compact ? 48 : 64, iw = w - padX * 2;
  const a = readable(accent, BG, 3.5), a2 = readable(accent2, BG, 3.5);
  const ts = fit(c.title, iw, h * (compact ? 0.28 : 0.24), compact ? 84 : 100, 48, 1.12, 0.5);
  const ds = compact ? 28 : 34;
  const stamp = tw(t, 1.3, 0.35, 0, 1, ease.back.out(2.4));
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${compact ? 36 : 56}px ${padX}px`, position: "relative", overflow: "hidden", backgroundColor: BG, color: INK, fontFamily: FONT.serif, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 14 : 22,
      backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.02) 0 1px, transparent 1px 28px), radial-gradient(120% 80% at 20% 0%, rgba(255,250,235,.45) 0%, transparent 60%)" }}>
      <R at={0.05} d={0.4} kind="fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${INK}`, paddingBottom: 12 }}>
        <span style={{ font: `700 19px/1 ${FONT.mono}`, letterSpacing: "0.3em", textTransform: "uppercase" }}>{c.kicker || "Finding"}</span>
        <span style={{ font: `400 17px/1 ${FONT.mono}`, color: MUTED, letterSpacing: "0.1em" }}>REF · {c.tag || "A-01"}</span>
      </R>
      {c.title ? (
        <div style={{ fontWeight: 700, fontSize: ts, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
          <Rich text={c.title} at={0.25} stagger={0.045} kind="fade" hl={{ color: a, textDecoration: "underline", textDecorationThickness: 4, textUnderlineOffset: 8 }} />
        </div>
      ) : null}
      {c.detail ? (
        <R at={0.75} d={0.5} kind="fade" style={{ fontSize: ds, lineHeight: 1.5, textAlign: "justify", hyphens: "auto", color: "#3b3426" }}>
          <Rich text={c.detail} at={-10} kind="fade" hl={{ fontWeight: 700, color: a2 }} />
        </R>
      ) : null}
      <Extras c={c} w={iw} maxH={h * 0.26} k={{ font: FONT.serif, mono: FONT.mono, ink: INK, muted: MUTED, accent: a2, bg: BG, size: ds * 0.9, at: 1.0, marker: "num" }} />
      <div style={{ position: "absolute", right: padX, bottom: compact ? 30 : 70, transform: `rotate(-9deg) scale(${0.4 + 0.6 * stamp})`, opacity: stamp, border: `6px double ${a}`, color: a, padding: "6px 22px", font: `900 ${compact ? 38 : 50}px/1 ${FONT.mono}`, letterSpacing: "0.12em", borderRadius: 6, mixBlendMode: "multiply" }}>
        {(c.kicker && c.tag ? c.tag : "APPROVED").toUpperCase().slice(0, 14)}
      </div>
    </div>
  );
};
