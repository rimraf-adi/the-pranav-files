// Top-zone motion graphics: trend, ticker, votes, gauge, flow.
// All live in the top ~30% of the 1080x1920 frame over a dark scrim so the speaker's face is never covered.
// Every value animates on a time (seconds relative to the item's `at`) that the timeline anchors to a spoken word.
// Pure functions of the frame: no timers, no Math.random.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Broll, Tone } from "../schema/timeline";
import style from "../../styles/gadzhi.json";
import { fontFamily, toneColor } from "./common";
import { ease, tw } from "../themes/motion";

const M = style.reference.scenes.motion;
const ZB = M.zoneBottomPx;
/** keeps graphics below the platform header UI (IG/YT/TikTok top bar) */
const SAFE = M.safeTopPx;

const tc = (t: Tone) => (t === "attention" ? M.red : t === "positive" ? M.green : t === "neutral" ? M.text : toneColor(t));
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const useT = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return { t: frame / fps, dur: durationInFrames / fps };
};

/** Shared stage: optional photo backdrop, scrim, envelope (fade + small lift in, fade + rise out). */
const Zone: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg, children }) => {
  const { t, dur } = useT();
  const e = tw(t, 0, 0.22, 0, 1, ease.power2.out) * tw(t, dur - 0.22, 0.22, 1, 0, ease.power2.in);
  const lift = tw(t, 0, 0.35, 18, 0, ease.power3.out) + tw(t, dur - 0.22, 0.22, 0, -14, ease.power2.in);
  const fadeMask = "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)";
  return (
    <AbsoluteFill>
      {bg ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: ZB + SAFE + 140, overflow: "hidden", opacity: e, maskImage: fadeMask, WebkitMaskImage: fadeMask }}>
          <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + (0.06 * t) / Math.max(dur, 0.1)})`, filter: "brightness(0.5) saturate(0.95) contrast(1.12)" }} />
        </div>
      ) : null}
      <AbsoluteFill style={{ opacity: e, background: `linear-gradient(to bottom, rgba(${M.scrim},0.84) 0px, rgba(${M.scrim},0.62) ${ZB * 0.75 + SAFE}px, rgba(${M.scrim},0) ${ZB + SAFE + 170}px)` }} />
      <AbsoluteFill style={{ opacity: e, transform: `translateY(${lift + SAFE}px)`, fontFamily, color: M.text }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ y: number; children: React.ReactNode; color?: string }> = ({ y, children, color = M.muted }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", color, fontSize: 30, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase" }}>{children}</div>
);

const Tri: React.FC<{ dir: "up" | "down"; color: string; size: number }> = ({ dir, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
    <path d={dir === "up" ? "M5 1 L9.5 9 L0.5 9 Z" : "M5 9 L9.5 1 L0.5 1 Z"} fill={color} />
  </svg>
);

/** Slot-machine digits. `from`/`to` are equal-length strings; non-digits are static. */
const Odometer: React.FC<{ from: string; to: string; t: number; at: number; size: number; color: string; spins?: number; glow?: number }> = ({ from, to, t, at, size, color, spins = 0, glow = 0 }) => {
  const f = from.padStart(to.length, "0");
  const up = parseFloat(to.replace(/[^\d.]/g, "")) >= parseFloat(f.replace(/[^\d.]/g, "") || "0");
  const n = to.length;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", height: size, fontSize: size, fontWeight: 900, lineHeight: 1, color, textShadow: glow ? `0 0 ${36 * glow}px ${rgba(M.red, 0.55 * glow)}` : undefined }}>
      {[...to].map((c, i) => {
        if (!/\d/.test(c)) return <span key={i}>{c}</span>;
        const a = /\d/.test(f[i]) ? +f[i] : 0;
        const b = +c;
        const k = n - 1 - i;
        const p = tw(t, at + k * 0.07, 0.62, 0, 1, ease.back.out(1.25));
        const extra = a === b ? 0 : spins;
        const i0 = up ? a : a + 10 * (extra + (b > a ? 1 : 0));
        const i1 = up ? b + 10 * (extra + (b < a ? 1 : 0)) : b;
        const pos = i0 + (i1 - i0) * p;
        return (
          <span key={i} style={{ display: "inline-block", width: "0.66em", height: size, overflow: "hidden", position: "relative", maskImage: "linear-gradient(transparent, #000 14%, #000 86%, transparent)", WebkitMaskImage: "linear-gradient(transparent, #000 14%, #000 86%, transparent)" }}>
            <span style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", transform: `translateY(${-pos * size}px)` }}>
              {Array.from({ length: 40 }, (_, d) => (
                <span key={d} style={{ display: "block", height: size }}>{d % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ trend
/** Expectation vs reality: a dashed line heads down ("the plan"), then a red line breaks upward. */
export const Trend: React.FC<Extract<Broll, { kind: "trend" }>> = (p) => {
  const { t } = useT();
  const W = 760, H = 330;
  const O = [30, H * 0.5], P = [W * 0.5, H * 0.98], R = [W * 0.92, H * 0.0];
  const dp = tw(t, 0.05, 0.8, 0, 1, ease.power2.out);
  const rp = tw(t, p.flipAt, 0.45, 0, 1, ease.expo.out);
  const flipped = t >= p.flipAt;
  const pt = (A: number[], B: number[], k: number) => [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
  const E = pt(O, P, dp), E2 = pt(O, R, rp);
  const ang = (A: number[], B: number[]) => (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI;
  const since = t - p.flipAt;
  const shake = since > 0 && since < 0.35 ? Math.sin(since * 70) * 9 * (1 - since / 0.35) : 0;
  const strike = tw(t, p.flipAt + 0.05, 0.3, 0, 100, ease.power2.out);
  const realIn = tw(t, p.flipAt + 0.08, 0.3, 0, 1, ease.power3.out);
  return (
    <Zone bg={p.bg}>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <div style={{ position: "absolute", left: 90, top: 56, opacity: (flipped ? 0.5 : 1) * tw(t, 0.05, 0.25, 0, 1) }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "0.04em", padding: "8px 0" }}>{p.plan}</div>
            <div style={{ position: "absolute", left: -6, top: "52%", height: 6, width: `calc(${strike}% + 12px)`, background: M.red, borderRadius: 3, opacity: strike > 0 ? 1 : 0 }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: M.muted, marginTop: 6 }}>{p.planSub}</div>
        </div>
        <div style={{ position: "absolute", right: 90, top: 56, textAlign: "right", opacity: realIn, transform: `translateY(${(1 - realIn) * 20}px)` }}>
          <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 14, background: M.red, color: "#0a0a0a", fontSize: 48, fontWeight: 900, letterSpacing: "0.03em", boxShadow: `0 0 34px ${rgba(M.red, 0.55)}` }}>{p.real}</div>
          <div style={{ fontSize: 36, fontWeight: 500, color: M.text, marginTop: 6 }}>{p.realSub}</div>
        </div>
        <svg width={W} height={H} style={{ position: "absolute", left: 160, top: 175, overflow: "visible" }}>
          {[0.2, 0.5, 0.8].map((y) => <line key={y} x1={0} x2={W} y1={H * y} y2={H * y} stroke={M.faint} strokeWidth={2} strokeDasharray="4 12" />)}
          <g opacity={flipped ? 0.4 : 1}>
            <line x1={O[0]} y1={O[1]} x2={E[0]} y2={E[1]} stroke={M.text} strokeWidth={9} strokeDasharray="22 16" strokeLinecap="round" />
            {dp > 0.05 ? <path d="M0 -13 L22 0 L0 13 Z" fill={M.text} transform={`translate(${E[0]} ${E[1]}) rotate(${ang(O, P)})`} /> : null}
          </g>
          {flipped ? (
            <g style={{ filter: `drop-shadow(0 0 14px ${rgba(M.red, 0.7)})` }}>
              <line x1={O[0]} y1={O[1]} x2={E2[0]} y2={E2[1]} stroke={M.red} strokeWidth={14} strokeLinecap="round" />
              <path d="M-4 -19 L30 0 L-4 19 Z" fill={M.red} transform={`translate(${E2[0]} ${E2[1]}) rotate(${ang(O, R)})`} />
            </g>
          ) : null}
          <circle cx={O[0]} cy={O[1]} r={11} fill={M.text} />
        </svg>
      </div>
    </Zone>
  );
};

// ------------------------------------------------------------------ ticker
/** A live number: digits roll from `from` to `to` at `stepAt`; optional line that steps up with it. */
export const Ticker: React.FC<Extract<Broll, { kind: "ticker" }>> = (p) => {
  const { t } = useT();
  const fmt = (v: number) => `${p.prefix}${v.toFixed(p.decimals)}${p.suffix}`;
  const toS = fmt(p.to);
  const fromS = p.from !== undefined ? fmt(p.from) : toS.replace(/\d/g, "0");
  const accent = tc(p.tone);
  const hot = tw(t, p.stepAt + 0.2, 0.3, 0, 1, ease.power2.out);
  const chipK = tw(t, p.stepAt + 0.35, 0.35, 0, 1, ease.back.out(2));
  const rising = p.to >= (p.from ?? 0);
  const color = p.tone === "neutral" ? M.text : hot > 0.5 ? accent : M.text;
  const W = 900, H = 170, low = H * 0.8, high = H * 0.16, sx = W * 0.6;
  const d1 = tw(t, 0.15, Math.max(0.3, p.stepAt - 0.15), 0, sx, ease.power1.out);
  const yJ = tw(t, p.stepAt, 0.4, low, high, ease.back.out(1.6));
  const d2 = tw(t, p.stepAt + 0.25, 0.9, sx, W, ease.power2.out);
  const stepped = t >= p.stepAt;
  const head = stepped ? [d2, yJ] : [d1, low];
  const ph = (t * 1.4) % 1;
  return (
    <Zone bg={p.bg}>
      <Kicker y={58}>{p.label}</Kicker>
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, display: "flex", justifyContent: "center", alignItems: "center", gap: 28 }}>
        <Odometer from={fromS} to={toS} t={t} at={p.stepAt} size={150} color={color} spins={p.from === undefined ? 1 : 0} glow={p.tone === "neutral" ? 0 : hot} />
        {p.chip ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: accent, color: "#0a0a0a", fontSize: 44, fontWeight: 900, transform: `scale(${chipK})`, opacity: Math.min(1, chipK * 2) }}>
            <Tri dir={rising ? "up" : "down"} color="#0a0a0a" size={30} />
            {p.chip}
          </div>
        ) : null}
      </div>
      {p.line === "step" ? (
        <svg width={W} height={H} style={{ position: "absolute", left: 90, top: 316, overflow: "visible" }}>
          <defs>
            <linearGradient id={`${p.id}-a`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={accent} stopOpacity={0.32} />
              <stop offset="1" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          {[high, (high + low) / 2, low].map((y) => <line key={y} x1={0} x2={W} y1={y} y2={y} stroke={M.faint} strokeWidth={2} strokeDasharray="4 12" />)}
          {stepped ? <path d={`M${sx} ${low} L${sx} ${yJ} L${d2} ${yJ} L${d2} ${H} L${sx} ${H} Z`} fill={`url(#${p.id}-a)`} /> : null}
          <path d={`M0 ${low} L${stepped ? sx : d1} ${low}`} stroke={M.text} strokeOpacity={0.85} strokeWidth={6} fill="none" strokeLinecap="round" />
          {stepped ? <path d={`M${sx} ${low} L${sx} ${yJ} L${d2} ${yJ}`} stroke={accent} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${rgba(accent, 0.7)})` }} /> : null}
          <text x={0} y={low - 16} fill={M.muted} fontSize={26} fontWeight={500}>{fromS}</text>
          {stepped ? <text x={sx + 16} y={high - 18} fill={accent} fontSize={26} fontWeight={900} opacity={hot}>{toS}</text> : null}
          <circle cx={head[0]} cy={head[1]} r={10 + 22 * ph} fill={stepped ? accent : M.text} opacity={0.45 * (1 - ph)} />
          <circle cx={head[0]} cy={head[1]} r={10} fill={stepped ? accent : M.text} />
        </svg>
      ) : null}
    </Zone>
  );
};

// ------------------------------------------------------------------ votes
/** Parliament arc: seats fill one by one, then the score lands. */
export const Votes: React.FC<Extract<Broll, { kind: "votes" }>> = (p) => {
  const { t } = useT();
  const n = p.yes + p.no;
  const C = [540, 470], R = 330;
  const fillSpan = Math.max(0.4, p.resultAt - 0.35);
  const res = tw(t, p.resultAt, 0.45, 0, 1, ease.back.out(1.6));
  const flash = tw(t, p.resultAt, 0.08, 0, 1) * tw(t, p.resultAt + 0.1, 0.5, 1, 0);
  return (
    <Zone bg={p.bg}>
      <Kicker y={56}>{p.label}</Kicker>
      <svg width={1080} height={ZB + 40} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {Array.from({ length: n }, (_, i) => {
          const a = Math.PI - ((i + 0.5) * Math.PI) / n;
          const x = C[0] + R * Math.cos(a), y = C[1] - R * Math.sin(a);
          const k = tw(t, 0.15 + (i * fillSpan) / n, 0.28, 0, 1, ease.back.out(2.2));
          const col = i < p.yes ? M.red : "#8a8a94";
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={30} fill="none" stroke={M.faint} strokeWidth={3} />
              <circle r={30 * k} fill={col} style={{ filter: k > 0.5 ? `drop-shadow(0 0 ${8 + 18 * flash}px ${rgba(col, 0.75)})` : undefined }} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", transform: `scale(${0.6 + 0.4 * res})`, opacity: Math.min(1, res * 2) }}>
        <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1 }}>{p.yes}–{p.no}</div>
        {p.verdict ? <div style={{ marginTop: 14, fontSize: 34, fontWeight: 900, letterSpacing: "0.28em", color: M.red }}>{p.verdict}</div> : null}
      </div>
    </Zone>
  );
};

// ------------------------------------------------------------------ gauge
/** A bar that fills to a value and strains there (stuck), with a target marker dropping in. */
export const Gauge: React.FC<Extract<Broll, { kind: "gauge" }>> = (p) => {
  const { t } = useT();
  const x0 = 90, w = 900, y = 340, h = 56;
  const X = (v: number) => x0 + (w * Math.max(0, Math.min(p.max, v))) / p.max;
  const fill = tw(t, 0.2, Math.max(0.4, p.valueAt - 0.2), 0, p.value, ease.power2.out);
  const ph = t - p.valueAt - 0.35;
  const dip = ph > 0 ? 0.28 * Math.pow(Math.max(0, Math.sin((ph * Math.PI) / 0.9)), 8) : 0;
  const v = fill - dip;
  const land = tw(t, p.valueAt - 0.05, 0.3, 0, 1, ease.back.out(2));
  const tgt = p.target !== undefined ? tw(t, p.targetAt, 0.45, 0, 1, ease.back.out(1.7)) : 0;
  const gap = p.target !== undefined ? tw(t, p.targetAt + 0.3, 0.3, 0, 1) * (0.55 + 0.35 * Math.sin(t * 7)) : 0;
  const numX = Math.min(Math.max(X(fill), 230), 860);
  return (
    <Zone bg={p.bg}>
      <Kicker y={56}>{p.label}</Kicker>
      <div style={{ position: "absolute", left: numX - 200, width: 400, top: 160, textAlign: "center", fontSize: 128, fontWeight: 900, lineHeight: 1, color: M.red, transform: `scale(${0.85 + 0.15 * land})`, textShadow: `0 0 ${30 * land}px ${rgba(M.red, 0.5)}` }}>
        {fill.toFixed(1)}{p.unit}
      </div>
      <div style={{ position: "absolute", left: x0, top: y, width: w, height: h, borderRadius: h / 2, background: M.glass, border: `2px solid ${M.stroke}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: X(v) - x0, background: `linear-gradient(90deg, ${rgba(M.red, 0.55)}, ${M.red})`, boxShadow: `0 0 26px ${rgba(M.red, 0.6)}` }} />
        {p.target !== undefined ? (
          <div style={{ position: "absolute", left: X(p.target) - x0, width: Math.max(0, X(v) - X(p.target)), top: 0, bottom: 0, opacity: gap, background: "repeating-linear-gradient(135deg, rgba(255,255,255,.35) 0 10px, transparent 10px 22px)" }} />
        ) : null}
      </div>
      {Array.from({ length: Math.floor(p.max) + 1 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: X(i) - 30, width: 60, top: y + h + 14, textAlign: "center", fontSize: 26, color: M.muted, fontWeight: 500 }}>{i}{p.unit}</div>
      ))}
      {p.target !== undefined ? (
        <div style={{ position: "absolute", left: X(p.target) - 120, width: 240, top: y - 92, textAlign: "center", opacity: Math.min(1, tgt * 2), transform: `translateY(${(1 - tgt) * -50}px)` }}>
          <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.2em", color: M.muted }}>TARGET</div>
          <div style={{ fontSize: 40, fontWeight: 900 }}>{p.target}{p.unit}</div>
          <div style={{ margin: "6px auto 0", width: 6, height: h + 30, background: M.text, borderRadius: 3, boxShadow: "0 0 12px rgba(255,255,255,.6)" }} />
        </div>
      ) : null}
    </Zone>
  );
};

// ------------------------------------------------------------------ flow
type FlowNode = Extract<Broll, { kind: "flow" }>["nodes"][number];
/** Cause -> effect chain: nodes pop in on their spoken word; edges draw from the cause into each effect. */
export const Flow: React.FC<Extract<Broll, { kind: "flow" }>> = (p) => {
  const { t } = useT();
  const rows = [0, 1].map((r) => p.nodes.filter((n) => n.row === r));
  const geo = new Map<string, { x: number; cy: number; w: number; h: number }>();
  rows.forEach((list, r) =>
    list.forEach((n, i) => {
      const w = r === 0 ? 340 : 280, h = r === 0 ? 156 : 140;
      geo.set(n.id, { x: 540 + (i - (list.length - 1) / 2) * (r === 0 ? 460 : 320), cy: r === 0 ? 168 : 418, w, h });
    }),
  );
  const edge = (n: FlowNode) => {
    if (!n.from || !geo.has(n.from)) return null;
    const A = geo.get(n.from)!, B = geo.get(n.id)!;
    const k = tw(t, n.at - 0.45, 0.45, 0, 1, ease.power2.inOut);
    if (k <= 0) return null;
    let d: string, end: number[], ang: number;
    if (A.cy === B.cy) {
      const x1 = A.x + A.w / 2 + 14, x2 = B.x - B.w / 2 - 22;
      d = `M${x1} ${A.cy} L${x2} ${B.cy}`; end = [x2, B.cy]; ang = 0;
    } else {
      const y1 = A.cy + A.h / 2 + 8, y2 = B.cy - B.h / 2 - 22, my = (y1 + y2) / 2;
      d = `M${A.x} ${y1} C${A.x} ${my} ${B.x} ${my} ${B.x} ${y2}`; end = [B.x, y2]; ang = 90;
    }
    const col = rgba(tc(n.tone), 0.85);
    return (
      <g key={`e-${n.id}`}>
        <path d={d} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        {k > 0.92 ? <path d="M-2 -13 L20 0 L-2 13 Z" fill={col} transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`} /> : null}
      </g>
    );
  };
  return (
    <Zone bg={p.bg}>
      <svg width={1080} height={ZB + 60} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{p.nodes.map(edge)}</svg>
      {p.nodes.map((n) => {
        const g = geo.get(n.id)!;
        const s = tw(t, n.at, 0.38, 0.75, 1, ease.back.out(1.9));
        const o = tw(t, n.at, 0.14, 0, 1);
        if (o <= 0) return null;
        const col = tc(n.tone);
        const ph = Math.max(0, t - n.at - 0.3) * 1.3 % 1;
        const pulse = n.tone === "attention" && !n.value ? ph : -1;
        const bob = n.arrow === "none" ? 0 : Math.sin((t - n.at) * 6) * 4 * (n.arrow === "up" ? -1 : 1);
        const big = g.h > 150;
        return (
          <div key={n.id} style={{ position: "absolute", left: g.x - g.w / 2, top: g.cy - g.h / 2, width: g.w, height: g.h, opacity: o, transform: `scale(${s})`, borderRadius: 24, background: M.glass, border: `2px solid ${rgba(col, 0.55)}`, boxShadow: pulse >= 0 ? `0 0 0 ${4 + 26 * pulse}px ${rgba(col, 0.35 * (1 - pulse))}, 0 18px 40px -16px rgba(0,0,0,.7)` : `0 18px 40px -16px rgba(0,0,0,.7)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: big ? 40 : 36, fontWeight: 900, letterSpacing: "0.06em" }}>{n.label}</div>
              {n.arrow !== "none" ? <div style={{ transform: `translateY(${bob}px)` }}><Tri dir={n.arrow} color={col} size={big ? 34 : 30} /></div> : null}
            </div>
            {n.value ? (
              /\d/.test(n.value) ? (
                <Odometer from={n.value.replace(/\d/g, "0")} to={n.value} t={t} at={n.at + 0.05} size={big ? 74 : 60} color={col} spins={1} />
              ) : (
                <div style={{ fontSize: big ? 60 : 50, fontWeight: 900, color: col }}>{n.value}</div>
              )
            ) : null}
            {n.sub ? <div style={{ fontSize: 26, fontWeight: 500, color: M.muted }}>{n.sub}</div> : null}
          </div>
        );
      })}
    </Zone>
  );
};

// ------------------------------------------------------------------ name tag (lowerThird placement "top")
/** Name card in the top zone: red bar grows, name wipes in from the left, role fades in above it. */
export const NameTag: React.FC<Extract<Broll, { kind: "lowerThird" }>> = (p) => {
  const { t } = useT();
  const bar = tw(t, 0, 0.28, 0, 1, ease.power3.out);
  const wipe = tw(t, 0.08, 0.45, 0, 100, ease.power3.out);
  const sub = tw(t, 0.25, 0.3, 0, 1, ease.power2.out);
  return (
    <Zone>
      <div style={{ position: "absolute", left: 72, top: 120, display: "flex", gap: 26, alignItems: "stretch" }}>
        <div style={{ width: 10, borderRadius: 5, background: M.red, transform: `scaleY(${bar})`, transformOrigin: "50% 0%", boxShadow: `0 0 18px ${rgba(M.red, 0.6)}` }} />
        <div>
          {p.sub ? <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: M.red, opacity: sub, transform: `translateY(${(1 - sub) * 10}px)` }}>{p.sub}</div> : null}
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "-0.01em", clipPath: `inset(0 ${100 - wipe}% 0 0)`, transform: `translateX(${(1 - wipe / 100) * -30}px)` }}>{p.title}</div>
        </div>
      </div>
    </Zone>
  );
};
