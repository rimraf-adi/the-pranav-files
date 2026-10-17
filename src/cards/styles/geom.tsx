// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/geom.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#0a0a0a", INK = "#ffffff", MUTED = "#aaaaaa";

export const Geom: React.FC<StyleProps> = ({ content: c, accent, accent2, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const slab1 = tw(t, 0.1, 0.45, 0, 1, ease.power3.out), slab2 = tw(t, 0.25, 0.45, 0, 1, ease.power3.out), stripe = tw(t, 0.5, 0.5, 0, 1, ease.power2.out);
  const padX = 56, iw = w - padX * 2;
  const topPad = compact ? 150 : 250;
  const ts = fit(c.title, iw * 0.88, h * 0.3, compact ? 108 : 132, 56, 0.96, 0.62);
  const ds = compact ? 28 : 34;
  const a = readable(accent, BG, 4), a2 = readable(accent2, BG, 3);
  // outline the first word when nothing is *highlighted*
  const title = /\*/.test(c.title) ? c.title : c.title.replace(/^(\S+)/, "*$1*");
  return (
    <div style={{ width: w, height: h, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.sans }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w * 0.5, height: compact ? 120 : 200, background: accent, transform: `translateX(${-(1 - slab1) * w * 0.5}px)` }} />
      <div style={{ position: "absolute", right: 0, bottom: 0, width: w * 0.34, height: w * 0.34, background: accent2, transform: `translateX(${(1 - slab2) * w * 0.34}px)` }} />
      <div style={{ position: "absolute", left: -40, top: h * 0.7, height: 5, width: w * 0.56 * stripe, background: INK, transform: "rotate(-6deg)", transformOrigin: "0 0" }} />
      <div style={{ position: "absolute", left: padX, top: topPad, right: padX, bottom: 70, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 14 : 24 }}>
        <R at={0.05} d={0.4} kind="fade" style={{ position: "absolute", left: 0, top: -(topPad - (compact ? 40 : 70)), padding: "8px 16px", background: BG, color: a, font: `700 20px/1 ${FONT.mono}`, letterSpacing: "0.22em" }}>{c.kicker || "TAKEAWAY"}</R>
        {c.title ? (
          <div style={{ fontWeight: 900, fontSize: ts, lineHeight: 0.96, letterSpacing: "-0.03em", textTransform: "uppercase", maxWidth: "88%" }}>
            <Rich text={title} at={0.55} stagger={0.06} kind="rise" hl={{ color: "transparent", WebkitTextStroke: `3px ${a}` }} />
          </div>
        ) : null}
        {c.detail ? (
          <R at={0.95} d={0.4} kind="fade" style={{ fontSize: ds, lineHeight: 1.4, color: MUTED, maxWidth: "70%" }}>
            <Rich text={c.detail} at={-10} kind="fade" hl={{ color: a2, fontWeight: 700 }} />
          </R>
        ) : null}
        <Extras c={c} w={iw * 0.7} maxH={h * 0.22} k={{ font: FONT.sans, mono: FONT.mono, ink: INK, muted: MUTED, accent: a, bg: BG, size: ds * 0.9, at: 1.1, marker: "arrow" }} />
      </div>
    </div>
  );
};
