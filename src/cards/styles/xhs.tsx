// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/xhs.html. Re-implemented for Remotion.
import React from "react";
import { Count, Extras, R, Rich, fit, plain, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { alpha, onColor, readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#fff5e9", INK = "#1d1418", MUTED = "#8a7a78";
const Heart: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" fill={c} /></svg>
);
const Bubble: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 4h16v12H9l-5 4z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" /></svg>
);

export const Xhs: React.FC<StyleProps> = ({ content: c, accent, accent2, accent3, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 40 : 48, iw = w - pad * 2;
  const a = readable(accent, BG, 3);
  const ts = fit(c.title, iw, h * (compact ? 0.28 : 0.26), compact ? 88 : 104, 52, 1.12, 0.55);
  const ds = compact ? 30 : 36;
  const pulse = 1 + 0.18 * Math.max(0, Math.sin((t - 1.4) * 7)) * (t > 1.4 && t < 2.2 ? 1 : 0);
  const chips = (c.list && c.list.length ? c.list : []).slice(0, 4);
  const handle = c.tag || "@speaker";
  const like = c.data && c.data.to !== undefined ? c.data : { prefix: "", suffix: "", decimals: 0, label: "", from: 0, to: 2481 };
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${compact ? 30 : 44}px ${pad}px`, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.sans, display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 18 : 28 }}>
      <R at={0.05} d={0.4} kind="left" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent2})`, boxShadow: `0 0 0 4px #fff, 0 0 0 5px ${alpha(accent, 0.3)}` }} />
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 26px/1.1 ${FONT.sans}` }}>{handle}</div>
          <div style={{ font: `400 19px/1.3 ${FONT.sans}`, color: MUTED }}>{c.kicker || "just now"}</div>
        </div>
        <div style={{ padding: "10px 26px", borderRadius: 999, border: `3px solid ${a}`, color: a, font: `700 21px/1 ${FONT.sans}` }}>Follow</div>
      </R>
      {c.title ? (
        <div style={{ fontWeight: 900, fontSize: ts, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
          <Rich text={c.title} at={0.3} stagger={0.055} kind="pop" hl={{ color: a, background: alpha(accent3, 0.35), borderRadius: 10, padding: "0 8px" }} />
        </div>
      ) : null}
      {c.detail ? <R at={0.8} d={0.45} kind="fade" style={{ fontSize: ds, lineHeight: 1.45, color: "#4a3d3d" }}>{plain(c.detail)}</R> : null}
      {chips.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {chips.map((it, i) => {
            const p = tw(t, 1.0 + i * 0.12, 0.35, 0, 1, ease.back.out());
            const col = [accent, accent2, accent3][i % 3];
            return <span key={i} style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})`, padding: "10px 22px", borderRadius: 999, background: alpha(col, 0.16), color: readable(col, BG, 3.5), font: `700 ${ds * 0.75}px/1 ${FONT.sans}` }}>#{plain(it).replace(/\s+/g, "")}</span>;
          })}
        </div>
      ) : null}
      <Extras c={{ ...c, list: undefined }} w={iw} maxH={h * 0.24} k={{ font: FONT.sans, mono: FONT.mono, ink: INK, muted: MUTED, accent: a, bg: BG, size: ds * 0.9, at: 1.0 }} />
      <R at={1.3} d={0.4} kind="rise" style={{ display: "flex", gap: 36, alignItems: "center", font: `700 26px/1 ${FONT.sans}`, color: MUTED }}>
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ transform: `scale(${pulse})`, display: "flex" }}><Heart c={accent} s={34} /></span><Count d={{ ...like, value: undefined } as never} at={1.3} dur={1.2} /></span>
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Bubble c={MUTED} s={32} />{Math.round(((like.to ?? 2481) as number) / 17)}</span>
        <span style={{ marginLeft: "auto", color: onColor(accent) === "#ffffff" ? a : MUTED }}>save</span>
      </R>
    </div>
  );
};
