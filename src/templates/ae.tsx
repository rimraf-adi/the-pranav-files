import React from "react";
import { random } from "remotion";

/**
 * Small After Effects toolkit for template ports. Everything is a pure function of time.
 * Units follow AE: scale and opacity are percent, rotation degrees, blur in AE pixels.
 */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** CSS-style cubic-bezier(x1,y1,x2,y2) as (x)=>y, solved with Newton + bisection. */
export const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let u = x;
  for (let i = 0; i < 8; i++) {
    const e = ((ax * u + bx) * u + cx) * u - x;
    const d = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
    u -= e / d;
  }
  let lo = 0, hi = 1;
  u = Math.min(1, Math.max(0, u));
  for (let i = 0; i < 24; i++) {
    const e = ((ax * u + bx) * u + cx) * u - x;
    if (Math.abs(e) < 1e-6) break;
    if (e > 0) hi = u; else lo = u;
    u = (lo + hi) / 2;
  }
  return ((ay * u + by) * u + cy);
};

/** expression from the AE templates: 1 - 2^(-10x), "expo out" */
export const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const cubicOut = (x: number) => 1 - Math.pow(1 - x, 3);

export type Key = { t: number; v: number; bez?: [number, number, number, number]; hold?: boolean };

/** Evaluate a scalar keyframe track (times in seconds, optional bezier to the NEXT key, hold = step). */
export const track = (t: number, keys: Key[]): number => {
  if (!keys.length) return 0;
  if (t <= keys[0].t) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b.t) {
      if (a.hold) return a.v;
      const k = (t - a.t) / (b.t - a.t);
      return lerp(a.v, b.v, a.bez ? bezier(...a.bez)(k) : k);
    }
  }
  return keys[keys.length - 1].v;
};

export type Reveal = {
  x?: number; y?: number; scale?: number; rotation?: number; opacity?: number; blur?: number;
};

export type AnimTextProps = {
  text: string;
  font: string;
  weight?: number;
  size: number;
  color: string;
  /** text box in comp px (the precomp the text lives in) */
  box: { w: number; h: number };
  /** layer placement: Position and Anchor Point in comp px, Scale in percent */
  pos: [number, number];
  anchor: [number, number];
  scale?: number;
  /** template time in seconds, and the layer's in-point */
  t: number;
  at?: number;
  /** comp fps: delays/durations below are in comp frames, as in the AE expression */
  fps: number;
  delayF: number;
  durF: number;
  unit?: "char" | "word" | "line";
  order?: "seq" | "random";
  ease?: (x: number) => number;
  /** the from-state each unit eases AWAY from (AE animator values at 100%) */
  from: Reveal;
  align?: "left" | "center" | "right";
  letterSpacing?: string;
  shadow?: string;
  seed?: string;
};

const split = (text: string, unit: "char" | "word" | "line") => {
  if (unit === "line") return text.split(/\r|\n/);
  if (unit === "word") return text.split(/(\s+)/);
  return [...text];
};

/**
 * One AE text layer with an Expression-Selector animator: unit i starts `delayF` frames after unit i-1 and eases
 * from `from` to rest over `durF` frames. This is the mechanic of the Caption/Hook packs.
 */
export const AnimText: React.FC<AnimTextProps> = (p) => {
  const unit = p.unit ?? "char";
  const ease = p.ease ?? expoOut;
  const frame = (p.t - (p.at ?? 0)) * p.fps;
  const parts = split(p.text, unit);
  const idxs = parts.map((s, i) => (/^\s+$/.test(s) ? -1 : i));
  const live = idxs.filter((i) => i >= 0);
  const rank = (i: number) => {
    const n = live.indexOf(i);
    if (p.order !== "random") return n;
    return Math.floor(random(`${p.seed ?? p.text}-${i}`) * live.length);
  };
  const sc = (p.scale ?? 100) / 100;
  return (
    <div
      style={{
        position: "absolute",
        left: p.pos[0] - p.anchor[0] * sc,
        top: p.pos[1] - p.anchor[1] * sc,
        width: p.box.w,
        height: p.box.h,
        transformOrigin: "0 0",
        transform: `scale(${sc})`,
        display: "flex",
        alignItems: "center",
        justifyContent: p.align === "center" ? "center" : p.align === "right" ? "flex-end" : "flex-start",
        whiteSpace: "pre",
        fontFamily: `'${p.font}', sans-serif`,
        fontWeight: p.weight ?? 700,
        fontSize: p.size,
        lineHeight: 1,
        letterSpacing: p.letterSpacing,
        color: p.color,
        textShadow: p.shadow,
        opacity: frame < 0 ? 0 : 1,
      }}
    >
      {parts.map((s, i) => {
        if (idxs[i] < 0) return <span key={i}>{s}</span>;
        const x = clamp01((frame - rank(i) * p.delayF) / p.durF);
        const k = ease(x);
        const f = p.from;
        const o = (f.opacity ?? 100) / 100;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: lerp(o, 1, k),
              filter: f.blur ? `blur(${lerp(f.blur * 0.25, 0, k)}px)` : undefined,
              transform: `translate(${lerp(f.x ?? 0, 0, k)}px, ${lerp(f.y ?? 0, 0, k)}px) scale(${lerp((f.scale ?? 100) / 100, 1, k)}) rotate(${lerp(f.rotation ?? 0, 0, k)}deg)`,
            }}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
};
