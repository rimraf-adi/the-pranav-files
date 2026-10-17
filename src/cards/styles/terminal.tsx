// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/styles/terminal.html. Re-implemented for Remotion.
import React from "react";
import { Count, R, fit, plain, useClock } from "../anim";
import { FONT } from "../fonts";
import { ease, tw } from "../../themes/motion";
import { readable } from "../palettes";
import type { StyleProps } from "./types";

const BG = "#0d1117", INK = "#e6edf3", MUTED = "#7d8590";

export const Terminal: React.FC<StyleProps> = ({ content: c, accent, accent2, accent3, w, h }) => {
  const { t } = useClock();
  const compact = h < 700;
  const pad = compact ? 52 : 64, iw = w - pad * 2 - 24;
  const g = readable(accent, BG, 4.5), amber = readable(accent3, BG, 4.5), mag = readable(accent2, BG, 4.5);
  const title = plain(c.title);
  const ts = fit("> " + title, iw, h * (compact ? 0.3 : 0.26), compact ? 64 : 78, 38, 1.25, 0.62);
  const ds = compact ? 28 : 32;
  const cps = 38;
  const typed = Math.max(0, Math.floor((t - 0.35) * cps));
  const shown = title.slice(0, typed);
  const done = typed >= title.length;
  const cursor = Math.floor(t * 2.2) % 2 === 0;
  const kick = (c.kicker || "takeaway").toLowerCase().replace(/\s+/g, "-");
  const lines: React.ReactNode[] = [];
  if (c.detail) lines.push(<div key="d" style={{ color: MUTED }}># {plain(c.detail)}</div>);
  (c.list ?? []).slice(0, compact ? 2 : 5).forEach((it, i) => lines.push(<div key={`l${i}`} style={{ color: INK }}><span style={{ color: amber }}>- </span>{plain(it)}</div>));
  if (c.quote) lines.push(<div key="q" style={{ color: mag }}>"{c.quote}"</div>);
  const start = 0.35 + title.length / cps + 0.15;
  return (
    <div style={{ width: w, height: h, boxSizing: "border-box", padding: `${compact ? 44 : 56}px ${pad}px`, position: "relative", overflow: "hidden", background: BG, color: INK, fontFamily: FONT.mono }}>
      <div style={{ position: "absolute", inset: 22, border: "3px solid #2c333e", borderRadius: 8, boxShadow: "inset 0 0 0 1px #1a1f27, 0 0 0 1px #06080c" }} />
      <div style={{ position: "absolute", left: 46, top: 10, padding: "0 10px", background: BG, font: `700 17px/1 ${FONT.mono}`, color: MUTED, letterSpacing: "0.12em" }}>~/takeaway{c.tag ? ` · ${c.tag}` : ""}</div>
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: compact ? 16 : 26, padding: "0 12px" }}>
        <R at={0.05} d={0.3} kind="fade" style={{ fontSize: ds, color: g }}>$ cat {kick}.md</R>
        <div style={{ fontSize: ts, lineHeight: 1.25, fontWeight: 700, minHeight: ts * 1.25, wordBreak: "break-word" }}>
          <span style={{ color: g }}>&gt; </span>{shown}
          <span style={{ background: g, color: g, opacity: done && !cursor ? 0 : 1 }}>{" "}</span>
        </div>
        {c.data && (c.data.value || c.data.to !== undefined) ? (
          <R at={start} kind="fade" style={{ fontSize: ds * 1.9, fontWeight: 700, color: amber, lineHeight: 1.1 }}>
            <Count d={c.data} at={start} />{c.data.label ? <span style={{ fontSize: ds * 0.8, color: MUTED, marginLeft: 18 }}>{c.data.label}</span> : null}
          </R>
        ) : null}
        <div style={{ fontSize: ds, lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 8 }}>
          {lines.map((l, i) => {
            const p = tw(t, start + 0.1 + i * 0.25, 0.35, 0, 1, ease.power2.out);
            return <div key={i} style={{ opacity: p, transform: `translateX(${(1 - p) * -14}px)` }}>{l}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
