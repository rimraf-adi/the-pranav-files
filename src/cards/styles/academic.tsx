// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/academic.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit } from "../anim";
import { FONT } from "../fonts";
import { alpha, onColor, readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#f1ead8", INK = "#1a1d2b", MUTED = "#5b5749";

export const Academic: React.FC<StyleProps> = ({ content: c, accent, accent2, w, h }) => {
  const compact = h < 700;
  const pad = compact ? 36 : 44, iw = w - pad * 2;
  const a = readable(accent, BG);
  const ts = fit(c.title, iw, h * (compact ? 0.3 : 0.26), compact ? 92 : 112, 52, 1.12, 0.5);
  const ds = compact ? 30 : 36;
  return (
    <div style={{
      width: w, height: h, boxSizing: "border-box", padding: `${pad * 0.8}px ${pad}px`, position: "relative", overflow: "hidden",
      backgroundColor: BG, color: INK, fontFamily: FONT.serif, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 16 : 26,
      backgroundImage: "linear-gradient(rgba(91,87,73,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(91,87,73,.2) 1px,transparent 1px),radial-gradient(120% 80% at 50% 0%,#fff8e9 0%,transparent 60%)",
      backgroundSize: "28px 28px,28px 28px,100% 100%",
    }}>
      <R at={0.05} d={0.4} kind="fade" style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ padding: "9px 18px", background: accent, color: onColor(accent), font: `700 20px/1 ${FONT.mono}`, letterSpacing: "0.16em" }}>{c.kicker || "TAKEAWAY"}</span>
        {c.tag ? <span style={{ font: `400 18px/1 ${FONT.mono}`, color: MUTED }}>{c.tag}</span> : null}
      </R>
      {c.title ? (
        <div style={{ fontSize: ts, lineHeight: 1.12, fontWeight: 700, letterSpacing: "-0.01em" }}>
          <Rich text={c.title} at={0.25} stagger={0.05} kind="pop" hl={{ color: a, boxShadow: `inset 0 -0.34em 0 ${alpha(accent, 0.22)}` }} />
        </div>
      ) : null}
      {c.detail ? (
        <R at={0.7} d={0.45} kind="fade" style={{ fontSize: ds, lineHeight: 1.45, color: MUTED, maxWidth: "94%" }}>
          <Rich text={c.detail} at={-10} kind="fade" hl={{ color: a, fontWeight: 700 }} />
        </R>
      ) : null}
      <Extras c={c} w={iw} maxH={h * 0.3} k={{ font: FONT.serif, mono: FONT.mono, ink: INK, muted: MUTED, accent: accent2, bg: BG, size: ds * 0.9, at: 1.05, marker: "num" }} />
    </div>
  );
};
