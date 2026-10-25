// Shared primitives for the Hook 01-05 ports (Premiere "Hooks & Captions" pack). Pure functions of time.
// AE layer = precomp placed by Position / Anchor / Scale / Rotation; child layers (Media parents) nest inside it.
import React from "react";
import { bezier, clamp01, lerp } from "./ae";

export type BZ = [number, number, number, number];
/** AE temporal ease -> cubic bezier. oi/ii = out/in influence (0-1); os/is = out/in speed normalised to the segment's
 * average speed (0 = zero speed, 1 = linear). */
export const bz = (oi: number, os: number, ii: number, is: number): BZ => [oi, os * oi, 1 - ii, 1 - is * ii];
export const LIN: BZ = [0, 0, 1, 1];
/** linear out (16.67%) -> in influence 100, zero speed: the pack's usual "pop in" */
export const POP: BZ = bz(1 / 6, 1, 1, 0);

/** scalar keyframes [time s, value] with one bezier per segment (holds outside) */
export const kf = (t: number, keys: [number, number][], bzs: BZ[] = []): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t < t1) return lerp(v0, v1, bezier(...(bzs[i] ?? LIN))(clamp01((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
};

export const smooth = (a: number) => a * a * (3 - 2 * a);

export type Fam = { family: string; weight: number; italic?: boolean; baseline: number };
/** baseline distance from the top of a line box with line-height = font-size, as a fraction of font size */
export const INTER: Fam = { family: "Inter", weight: 700, baseline: 0.8637 };
export const PLAYFAIR: Fam = { family: "Playfair Display", weight: 700, italic: true, baseline: 0.9155 };

/** An AE layer: translate(pos) rotate scale translate(-anchor), children live in the layer's own pixel space. */
export const Lyr: React.FC<{
  pos: [number, number];
  anchor: [number, number];
  scale?: number;
  rot?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({ pos, anchor, scale = 100, rot = 0, opacity = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      transformOrigin: "0 0",
      opacity,
      transform: `translate(${pos[0]}px, ${pos[1]}px) rotate(${rot}deg) scale(${scale / 100}) translate(${-anchor[0]}px, ${-anchor[1]}px)`,
    }}
  >
    {children}
  </div>
);

export type Line = { text: string; fam: Fam; size: number };

export type SlideTextProps = {
  lines: Line[];
  color: string;
  /** text origin: x (centre for "center", left edge for "left") and first baseline y, in the precomp's pixels */
  ox: number;
  base: number;
  leading?: number;
  align?: "center" | "left";
  /** "Slide Down By Character" animator: range Offset in [-1,1] (percent/100). Word amount hides -> shows. */
  inO?: number;
  inY?: number;
  /** "Blur & Fade Out" animator: completion 0..1, per-word to-state */
  outC?: number;
  outPos?: [number, number];
  outRot?: number;
  outBlur?: number;
  tracking?: string;
};

/** Text layer with the pack's word-based animators (range selector ramps swept by an Offset, Based On = Words). */
export const SlideText: React.FC<SlideTextProps> = (p) => {
  const leading = p.leading ?? 100;
  const toks = p.lines.map((l) => l.text.split(/(\s+)/));
  const n = Math.max(1, toks.flat().filter((s) => s.trim() !== "").length);
  let wi = 0;
  return (
    <>
      {p.lines.map((l, li) => (
        <div
          key={li}
          style={{
            position: "absolute",
            left: p.align === "left" ? p.ox : p.ox - 2000,
            top: p.base + li * leading - l.fam.baseline * l.size,
            width: p.align === "left" ? undefined : 4000,
            height: l.size,
            lineHeight: `${l.size}px`,
            display: "flex",
            justifyContent: p.align === "left" ? "flex-start" : "center",
            whiteSpace: "pre",
            fontFamily: `'${l.fam.family}', sans-serif`,
            fontWeight: l.fam.weight,
            fontStyle: l.fam.italic ? "italic" : "normal",
            fontSize: l.size,
            letterSpacing: p.tracking ?? (l.fam === INTER ? "-0.025em" : undefined),
            color: p.color,
          }}
        >
          {toks[li].map((s, i) => {
            if (s.trim() === "") return <span key={i}>{s}</span>;
            const x = (wi++ + 0.5) / n;
            const a = p.inO === undefined ? 0 : smooth(clamp01(x - p.inO));
            const b = p.outC === undefined ? 0 : smooth(clamp01(2 * p.outC - x));
            const op = p.outPos ?? [0, 0];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: 1 - a,
                  filter: b > 0.001 && p.outBlur ? `blur(${b * p.outBlur * 0.25}px)` : undefined,
                  transform: `translate(${op[0] * b}px, ${(p.inY ?? 100) * a + op[1] * b}px) rotate(${(p.outRot ?? 0) * b}deg) scale(${1 - b})`,
                }}
              >
                {s}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
};

export const STROKE = "#FFFFFF";

/** AE rounded rectangle shape (stroke only: the fill is a track matte for the empty Media placeholder), centred on (0,0). */
export const RRect: React.FC<{ w: number; h: number; r: number; sw: number; cx?: number; cy?: number }> = ({ w, h, r, sw, cx = 0, cy = 0 }) =>
  w < 0.05 || h < 0.05 ? null : (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: Math.min(r, w / 2, h / 2),
        border: sw > 0.02 ? `${sw}px solid ${STROKE}` : undefined,
      }}
    />
  );

/** clips its children (laid out in the parent's coordinate space) to a rounded rectangle centred on (cx,cy) */
export const ClipRect: React.FC<{ cx: number; cy: number; w: number; h: number; r: number; children?: React.ReactNode }> = ({ cx, cy, w, h, r, children }) => {
  if (w < 0.05 || h < 0.05) return null;
  const left = cx - w / 2;
  const top = cy - h / 2;
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, overflow: "hidden", borderRadius: Math.min(r, w / 2, h / 2) }}>
      <div style={{ position: "absolute", left: -left, top: -top, width: 0, height: 0 }}>{children}</div>
    </div>
  );
};

export const lines = (text: string, fam: Fam = INTER, size = 100): Line[] => text.split(/\r|\n/).map((t) => ({ text: t, fam, size }));
