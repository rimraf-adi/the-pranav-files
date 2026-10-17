// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/spotlight.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { alpha, mix, readable } from "../palettes";
import type { StyleProps } from "./types";

const INK = "#f5f3ff", MUTED = "#b6b4d0", BG = "#120e30";

export const Spotlight: React.FC<StyleProps> = ({ content: c, accent, accent2, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 44 : 60, iw = w - pad * 2;
  const a = readable(accent, BG, 4.5), a2 = readable(accent2, BG, 3);
  const ts = fit(c.title, iw, h * (compact ? 0.34 : 0.3), compact ? 96 : 116, 52, 1.1, 0.5);
  const ds = compact ? 30 : 36;
  const dot = tw(t, 0.05, 0.4, 0, 1, ease.back.out());
  const breathe = 0.85 + 0.15 * Math.sin(t * 1.6);
  return (
    <div style={{
      width: w, height: h, boxSizing: "border-box", padding: `${pad * 0.8}px ${pad}px`, position: "relative", overflow: "hidden", color: INK, fontFamily: FONT.sans,
      display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 20 : 30,
      background: `radial-gradient(70% 55% at 28% 30%, ${alpha(a, 0.35 * breathe)} 0%, transparent 55%), radial-gradient(80% 70% at 80% 80%, ${alpha(a2, 0.22)} 0%, transparent 60%), linear-gradient(160deg, ${mix("#1b1648", a, 0.12)} 0%, #0e0a24 100%)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: a, boxShadow: `0 0 22px ${a}, 0 0 5px ${a}`, transform: `scale(${dot})` }} />
        <R at={0.1} d={0.4} kind="fade" style={{ font: `700 20px/1 ${FONT.mono}`, letterSpacing: "0.26em", color: a }}>{c.kicker || "TAKEAWAY"}</R>
      </div>
      {c.title ? (
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: ts, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          <Rich text={c.title} at={0.3} stagger={0.07} d={0.7} kind="blur" hl={{ color: a, textShadow: `0 0 36px ${alpha(a, 0.7)}` }} />
        </div>
      ) : null}
      {c.detail ? <R at={1.0} d={0.5} kind="fade" style={{ fontSize: ds, lineHeight: 1.45, color: MUTED, maxWidth: "92%" }}>{c.detail.replace(/\*/g, "")}</R> : null}
      <Extras c={c} w={iw} maxH={h * 0.28} k={{ font: FONT.sans, mono: FONT.mono, ink: INK, muted: MUTED, accent: a, bg: BG, size: ds * 0.9, at: 1.2, marker: "dot" }} />
    </div>
  );
};
