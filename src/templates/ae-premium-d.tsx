import React from "react";
import { random } from "remotion";
import { clamp01, lerp } from "./ae";

/**
 * Primitives for the "premium-text" lyrics/title templates (1920x1080 comps).
 * A PLayer is one AE text layer: centred text with per-character animator amounts (0..1, may overshoot),
 * drop shadow, glow (blurred duplicate), CC Light Sweep (gradient clipped to the text) and layer transform.
 * Pure functions of the props: no timers, no Math.random.
 */

export type From = {
  /** opacity at amount=1 (0..1) */
  opacity?: number;
  /** scale percent at amount=1 (100 = unchanged) */
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  x?: number;
  y?: number;
  rot?: number;
  blur?: number;
};

export type Shadow = { dist: number; soft: number; op: number; dir?: number };
/** Glow approximated as a blurred rounded blob around the text box. padX/padY are in final comp px (after layer scale). */
export type Glow = { padX: number; padY: number; blur: number; opacity: number; lighten?: number; color?: string };
export type Sweep = { p: number; width: number; intensity: number; color?: string; dir?: 1 | -1; angle?: number };

export type PLayerProps = {
  text: string;
  font: string;
  weight?: number;
  italic?: boolean;
  size?: number;
  color: string;
  caps?: boolean;
  /** AE layer position (comp px) and anchor-point y (AE value, negative = above the baseline) */
  pos: [number, number];
  anchorY?: number;
  /** cap height as a fraction of font size, to place the baseline like AE does */
  capH?: number;
  scale?: number | [number, number];
  opacity?: number;
  blur?: number;
  letterSpacing?: number;
  /** per-character animator amount 0..1 (1 = fully in the animator "from" state) */
  amount?: (i: number, n: number) => number;
  from?: From;
  /** Character Offset scramble: shifts letters by this many alphabet steps times amount */
  scramble?: number;
  shadow?: Shadow;
  glow?: Glow;
  sweep?: Sweep;
  /** layer box width in comp px (must exceed the text) */
  W?: number;
  hidden?: boolean;
};

const hexRgb = (hex: string): [number, number, number] | null => {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return [v >> 16, (v >> 8) & 255, v & 255];
};
const mix = (hex: string, k: number) => {
  const c = hexRgb(hex);
  if (!c) return hex;
  const r = c.map((x) => Math.round(lerp(x, 255, k)));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
};
const rgba = (hex: string, a: number) => {
  const c = hexRgb(hex);
  if (!c) return hex;
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
};

export const PLayer: React.FC<PLayerProps> = (p) => {
  if (p.hidden) return null;
  const size = p.size ?? 134;
  const W = p.W ?? 1800;
  const H = size * 1.5;
  const [sx, sy] = Array.isArray(p.scale) ? p.scale : [p.scale ?? 100, p.scale ?? 100];
  const fx = sx / 100, fy = sy / 100;
  if (fx <= 0.0001 || fy <= 0.0001 || (p.opacity ?? 1) <= 0) return null;
  const text = p.caps ? p.text.toUpperCase() : p.text;
  const chars = [...text];
  const letters = chars.filter((c) => c.trim() !== "");
  const n = letters.length;
  // AE anchor y (negative) puts baseline at pos.y + |a|*scale; the cap middle sits capH/2 above the baseline
  const a = -(p.anchorY ?? -size * 0.33);
  const cap = (p.capH ?? 0.74) * size;
  const cy = p.pos[1] + (a - cap / 2) * fy;
  const from = p.from ?? {};
  const fo = from.opacity ?? 0;

  const render = (opts: { styled: boolean }) => {
    let li = -1;
    return chars.map((ch, i) => {
      if (ch.trim() === "") return <span key={i}>{ch}</span>;
      li++;
      const am = p.amount ? p.amount(li, n) : 0;
      const amc = Math.max(0, am);
      let shown = ch;
      if (p.scramble && amc > 0.001 && /[A-Za-z]/.test(ch)) {
        const base = ch >= "a" ? 97 : 65;
        const off = Math.round(p.scramble * amc);
        shown = String.fromCharCode(base + ((((ch.charCodeAt(0) - base + off) % 26) + 26) % 26));
      }
      const op = clamp01(1 + am * (fo - 1));
      const scx = Math.max(0, 1 + am * ((from.scaleX ?? from.scale ?? 100) / 100 - 1));
      const scy = Math.max(0, 1 + am * ((from.scaleY ?? from.scale ?? 100) / 100 - 1));
      const blur = from.blur ? Math.abs(am) * from.blur : 0;
      void opts;
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: op,
            filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
            transform: `translate(${am * (from.x ?? 0)}px, ${am * (from.y ?? 0)}px) rotate(${am * (from.rot ?? 0)}deg) scale(${scx}, ${scy})`,
          }}
        >
          {shown}
        </span>
      );
    });
  };

  const layer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre",
    fontFamily: `'${p.font}', sans-serif`,
    fontWeight: p.weight ?? 400,
    fontStyle: p.italic ? "italic" : "normal",
    fontSize: size,
    lineHeight: 1,
    letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
  };

  const sh = p.shadow;
  const shDir = ((sh?.dir ?? 135) * Math.PI) / 180;
  const textShadow = sh
    ? `${(Math.sin(shDir) * sh.dist).toFixed(2)}px ${(-Math.cos(shDir) * sh.dist).toFixed(2)}px ${sh.soft * 0.6}px rgba(0,0,0,${clamp01(sh.op / 255)})`
    : undefined;

  const g = p.glow;
  const bodyColor = g?.lighten ? mix(p.color, g.lighten) : p.color;

  // light sweep: gradient in the layer's local box, travelling along the beam normal
  let sweepEl: React.ReactNode = null;
  if (p.sweep && p.sweep.p > 0 && p.sweep.p < 1) {
    const s = p.sweep;
    const ang = ((s.angle ?? 30) * Math.PI) / 180;
    const css = (Math.atan2(Math.cos(ang), -Math.sin(ang)) * 180) / Math.PI;
    const th = (css * Math.PI) / 180;
    const L = Math.abs(W * Math.sin(th)) + Math.abs(H * Math.cos(th));
    const hw = s.width * 1.6 + 25;
    const k = s.dir === -1 ? 1 - s.p : s.p;
    const c = lerp(-hw, L + hw, k);
    const al = clamp01(s.intensity / 70);
    const col = s.color ?? "#FFFAF0";
    // average visibility so the sweep does not show on not-yet-revealed letters
    let vis = 1;
    if (p.amount) {
      let acc = 0;
      for (let i = 0; i < n; i++) acc += clamp01(1 - p.amount(i, n) * (1 - fo));
      vis = n ? acc / n : 1;
    }
    sweepEl = (
      <div
        style={{
          ...layer,
          color: "transparent",
          opacity: vis * (p.opacity ?? 1),
          backgroundImage: `linear-gradient(${css}deg, ${rgba(col, 0)} ${c - hw}px, ${rgba(col, al)} ${c}px, ${rgba(col, 0)} ${c + hw}px)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {chars.map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: p.pos[0] - W / 2,
        top: cy - H / 2,
        width: W,
        height: H,
        transform: `scale(${fx}, ${fy})`,
        transformOrigin: "50% 50%",
        opacity: p.opacity ?? 1,
        filter: p.blur && p.blur > 0.05 ? `blur(${p.blur}px)` : undefined,
      }}
    >
      {g && (
        <div style={{ ...layer, color: "transparent" }}>
          <span
            style={{
              display: "inline-block",
              padding: `${g.padY / fy}px ${g.padX / fx}px`,
              borderRadius: Math.min(g.padX / fx, g.padY / fy) * 1.6,
              background: g.color ?? p.color,
              opacity: g.opacity,
              filter: `blur(${g.blur / Math.max(fx, fy)}px)`,
            }}
          >
            {render({ styled: false })}
          </span>
        </div>
      )}
      <div style={{ ...layer, color: bodyColor, textShadow }}>{render({ styled: true })}</div>
      {sweepEl}
    </div>
  );
};

/* ---------- animator amount helpers (AE selector semantics) ---------- */

/** Range Selector Start 0->100 with Randomize Order: char i leaves the "from" state when the range passes it. */
export const randomReveal =
  (p: number, seed: string, rate = 0, t = 0) =>
  (i: number, n: number) => {
    const key = `${seed}-${rate ? Math.floor(t * rate) : 0}`;
    const r = (j: number) => random(`${key}-${j}`);
    const mine = r(i);
    let rank = 0;
    for (let j = 0; j < n; j++) if (r(j) < mine) rank++;
    return clamp01(rank + 1 - p * n);
  };

/** Range Selector Start 0->100, normal (left to right) order. */
export const seqReveal = (p: number) => (i: number, n: number) => clamp01(i + 1 - p * n);

/** Offset-driven ramp wave: first letters resolve first, `spread` = how much the wave is smeared over the word. */
export const waveReveal =
  (p: number, spread = 0.8) =>
  (i: number, n: number) => {
    const f = (i + 0.5) / Math.max(1, n);
    return 1 - clamp01(p * (1 + spread) - f * spread);
  };

/** Expression Selector "Amount" spring from the Caption/Lyrics packs. textIndex is 1-based over non-space chars. */
export const springAmount =
  (t: number, inPt: number, delay: number, freq: number, amp: number, decay: number) =>
  (i: number) => {
    const tt = t - inPt - delay * (i + 1);
    if (tt < 0) return 1;
    return (amp * Math.cos(freq * tt * 2 * Math.PI)) / Math.exp(decay * tt) / 100;
  };

/** "inertial bounce" amount used by put-lyrics: linear 100->0 over `dur`, then damped sine. */
export const bounceAmount =
  (t: number, inPt: number, retard: number, freq: number, decay: number, dur: number) =>
  (i: number) => {
    const tt = t - (inPt + retard * (i + 1));
    if (tt < 0) return 1;
    if (tt < dur) return 1 - tt / dur;
    const w = freq * Math.PI * 2;
    const amp = -1 / dur;
    return (amp * Math.sin((tt - dur) * w)) / Math.exp(decay * (tt - dur)) / w;
  };
