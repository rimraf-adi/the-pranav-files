// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/swiss.html. Re-implemented for Remotion.
import React from "react";
import { Extras, R, Rich, fit, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#ffffff", INK = "#111111", MUTED = "#555555";

export const Swiss: React.FC<StyleProps> = ({ content: c, accent, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 52 : 64, iw = w - pad * 2;
  const a = readable(accent, BG, 3);
  const ts = fit(c.title, iw, h * (compact ? 0.36 : 0.3), compact ? 112 : 128, 56, 0.96, 0.55);
  const ds = compact ? 28 : 34;
  const rule = tw(t, 0.05, 0.6, 0, 1, ease.power3.out);
  const rule2 = tw(t, 0.2, 0.6, 0, 1, ease.power3.out);
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${compact ? 40 : 56}px ${pad}px`, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.sans, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
      <div>
        <div style={{ height: 6, background: INK, width: `${rule * 100}%` }} />
        <div style={{ height: 2, background: INK, width: `${rule2 * 100}%`, marginTop: 5 }} />
        <R at={0.15} d={0.4} kind="fade" style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, font: `700 19px/1 ${FONT.mono}`, letterSpacing: "0.26em", textTransform: "uppercase" }}>
          <span>{c.kicker || "Takeaway"}</span>
          <span style={{ color: a }}>{c.tag || "№ 01"}</span>
        </R>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 18 : 30 }}>
        {c.title ? (
          <div style={{ fontWeight: 700, fontSize: ts, lineHeight: 0.96, letterSpacing: "-0.035em" }}>
            <Rich text={c.title} at={0.3} stagger={0.06} kind="rise" hl={{ color: a }} />
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <R at={0.7} d={0.4} kind="pop" style={{ width: 40, height: 40, background: a, flex: "none", marginTop: 6 }}>{""}</R>
          {c.detail ? <R at={0.8} d={0.45} kind="fade" style={{ fontSize: ds, lineHeight: 1.4, color: MUTED }}>{c.detail.replace(/\*/g, "")}</R> : null}
        </div>
        <Extras c={c} w={iw} maxH={h * 0.26} k={{ font: FONT.sans, mono: FONT.mono, ink: INK, muted: MUTED, accent: a, bg: BG, size: ds * 0.9, at: 1.0, marker: "num" }} />
      </div>
      <div style={{ height: 2, background: INK }} />
    </div>
  );
};
