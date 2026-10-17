// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/SKILL.md (Step 8 data-anim kinds). Re-implemented for Remotion.
// data-anim fade-in / slide-in / kinetic-chars / count-up / grow-x / scale-pop / blur-in / mask-reveal / typewriter as pure functions of the frame.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease, tw } from "../themes/motion";
import { alpha, readable } from "./palettes";
import type { CardContent } from "./schema";

export const useClock = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return { t: frame / fps, dur: durationInFrames / fps, frame };
};

export type Kind = "blur" | "rise" | "pop" | "fade" | "left" | "right" | "wipe";

/** Style for an element revealed `p` (0..1) with the given entrance kind. */
export const revealStyle = (kind: Kind, p: number, dist = 36): React.CSSProperties => {
  const q = 1 - p;
  switch (kind) {
    case "blur": return { opacity: p, filter: p < 1 ? `blur(${q * 14}px)` : undefined, transform: `translateY(${q * dist * 0.6}px)` };
    case "rise": return { opacity: p, transform: `translateY(${q * dist}px)` };
    case "pop": return { opacity: Math.min(1, p * 2.2), transform: `scale(${0.8 + 0.2 * ease.back.out(1.9)(p)})` };
    case "left": return { opacity: p, transform: `translateX(${-q * dist * 2}px)` };
    case "right": return { opacity: p, transform: `translateX(${q * dist * 2}px)` };
    case "wipe": return { clipPath: `inset(0 ${q * 100}% 0 0)`, opacity: p > 0 ? 1 : 0 };
    default: return { opacity: p };
  }
};

/** Whole-card exit envelope: 1 -> 0 over the last `out` seconds. */
export const useExit = (out = 0.4) => {
  const { t, dur } = useClock();
  return tw(t, dur - out, out, 1, 0, ease.power2.in);
};

export const R: React.FC<{
  at: number; d?: number; kind?: Kind; dist?: number; style?: React.CSSProperties; className?: string; children?: React.ReactNode;
}> = ({ at, d = 0.5, kind = "rise", dist, style, children }) => {
  const { t } = useClock();
  const p = tw(t, at, d, 0, 1, ease.power3.out);
  return <div style={{ ...revealStyle(kind, p, dist), ...style }}>{children}</div>;
};

/** Text with `*highlighted*` runs; each word enters on a stagger (data-anim kinetic-chars, word granularity). */
export const Rich: React.FC<{
  text: string; at?: number; d?: number; stagger?: number; kind?: Kind;
  hl?: React.CSSProperties; style?: React.CSSProperties; upper?: boolean;
}> = ({ text, at = 0.3, d = 0.45, stagger = 0.05, kind = "pop", hl, style, upper }) => {
  const { t } = useClock();
  const words: { w: string; h: boolean }[] = [];
  text.split(/(\*[^*]+\*)/).forEach((seg) => {
    const h = /^\*[^*]+\*$/.test(seg);
    (h ? seg.slice(1, -1) : seg).split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, h }));
  });
  return (
    <span style={{ ...style, textTransform: upper ? "uppercase" : undefined }}>
      {words.map((x, i) => {
        const p = tw(t, at + i * stagger, d, 0, 1, ease.power3.out);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", ...revealStyle(kind, p, 24), ...(x.h ? hl : null) }}>
            {x.w + (i < words.length - 1 ? " " : "")}
          </span>
        );
      })}
    </span>
  );
};

export const plain = (s: string) => s.replace(/\*/g, "");

/** Largest font size (<= max) at which `text` wraps into the box. */
export const fit = (text: string, w: number, h: number, max: number, min: number, lh = 1.1, cw = 0.52) => {
  const words = plain(text).split(/\s+/).filter(Boolean);
  for (let s = max; s >= min; s -= 2) {
    const cpl = Math.max(1, Math.floor(w / (s * cw)));
    let lines = 1, cur = 0;
    for (const word of words) {
      const len = Math.min(word.length, cpl);
      if (cur === 0) cur = len;
      else if (cur + 1 + len <= cpl) cur += 1 + len;
      else { lines++; cur = len; }
    }
    if (lines * s * lh <= h) return s;
  }
  return min;
};

export const Count: React.FC<{ d: NonNullable<CardContent["data"]>; at: number; dur?: number }> = ({ d, at, dur = 0.9 }) => {
  const { t } = useClock();
  if (d.to === undefined) return <>{d.prefix}{d.value ?? ""}{d.suffix}</>;
  const v = tw(t, at, dur, d.from ?? 0, d.to, ease.power2.out);
  return <>{d.prefix}{v.toFixed(d.decimals)}{d.suffix}</>;
};

export type Tokens = {
  font: string; mono: string; ink: string; muted: string; accent: string; bg: string;
  size: number; at: number; marker?: "dot" | "num" | "arrow" | "gt" | "dash"; rule?: string; weight?: number; dataFont?: string;
};

/** data / quote / list hints, rendered in a style's own tokens so every style supports every hint. */
export const Extras: React.FC<{ c: CardContent; k: Tokens; maxH: number; w: number }> = ({ c, k, maxH, w }) => {
  const { t } = useClock();
  const items = c.list ?? [];
  const acc = readable(k.accent, k.bg);
  const out: React.ReactNode[] = [];
  let used = 0;
  if (c.data && (c.data.value || c.data.to !== undefined)) {
    const bs = Math.min(k.size * 2.6, fit(`${c.data.prefix}${c.data.value ?? c.data.to}${c.data.suffix}`, w, maxH * 0.55, k.size * 2.6, k.size, 1, 0.6));
    used += bs * 1.1 + (c.data.label ? k.size * 1.4 : 0);
    out.push(
      <R key="data" at={k.at} kind="pop" style={{ display: "flex", alignItems: "baseline", gap: k.size * 0.6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: k.dataFont ?? k.font, fontWeight: 900, fontSize: bs, lineHeight: 1, color: acc, fontVariantNumeric: "tabular-nums" }}>
          <Count d={c.data} at={k.at} />
        </span>
        {c.data.label ? <span style={{ fontFamily: k.mono, fontSize: k.size * 0.8, color: k.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.data.label}</span> : null}
      </R>,
    );
  }
  if (c.quote && used + k.size * 3 < maxH) {
    used += k.size * 3;
    out.push(
      <R key="quote" at={k.at + 0.15} kind="blur" style={{ borderLeft: `${Math.max(4, k.size * 0.18)}px solid ${acc}`, paddingLeft: k.size * 0.7, fontFamily: k.font, fontStyle: "italic", fontSize: k.size * 1.05, lineHeight: 1.3, color: k.ink }}>
        {c.quote}
      </R>,
    );
  }
  if (items.length) {
    const room = Math.max(1, Math.floor((maxH - used) / (k.size * 1.75)));
    items.slice(0, room).forEach((it, i) => {
      const p = tw(t, k.at + 0.2 + i * 0.14, 0.45, 0, 1, ease.power3.out);
      const m = k.marker === "num" ? String(i + 1).padStart(2, "0") : k.marker === "arrow" ? "→" : k.marker === "gt" ? ">" : k.marker === "dash" ? "—" : "●";
      out.push(
        <div key={`li${i}`} style={{ display: "flex", gap: k.size * 0.6, alignItems: "baseline", fontFamily: k.font, fontSize: k.size, lineHeight: 1.3, color: k.ink, ...revealStyle("rise", p, 18) }}>
          <span style={{ color: acc, fontFamily: k.mono, fontWeight: 700, fontSize: k.marker === "dot" ? k.size * 0.6 : k.size * 0.9, minWidth: k.size * 1.4 }}>{m}</span>
          <span><Rich text={it} at={-10} kind="fade" hl={{ color: acc, background: alpha(acc, 0.14) }} /></span>
        </div>,
      );
    });
  }
  return out.length ? <div style={{ display: "flex", flexDirection: "column", gap: k.size * 0.7 }}>{out}</div> : null;
};
