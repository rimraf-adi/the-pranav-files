// Shared primitives for the Caption 02-08 ports (Premiere "Hooks & Captions" pack).
// A caption line is an AE precomp layer: a text layer inside a small precomp (justification, text origin), placed on
// the 1080x1920 comp by Position / Anchor / Scale, with optional layer effects (Fast Box Blur, Geometry2) and an
// optional per-word Expression-Selector animator. Everything here is a pure function of time.
import React from "react";
import { bezier, clamp01, expoOut, lerp } from "./ae";
import type { Reveal } from "./ae";

/** AE keyframe ease: out influence 16.67%, in influence 100% with zero in-speed, linear-average out speed. */
export const SLIDE = bezier(1 / 6, 1 / 6, 0, 1);
/** same but out speed 0 (e.g. a position key whose first-key out speed is 0) */
export const SLIDE0 = bezier(1 / 6, 0, 0, 1);

/** value moving a -> b between t0 and t1 seconds with an AE bezier ease (holds outside) */
export const key = (t: number, t0: number, t1: number, a: number, b: number, e: (x: number) => number = SLIDE) =>
  lerp(a, b, e(clamp01((t - t0) / (t1 - t0))));

export type Fam = { family: string; weight: number; italic?: boolean; baseline: number };
/** baseline distance from the top of a 100px, line-height:1 line box, as a fraction of font size */
export const INTER: Fam = { family: "Inter", weight: 700, baseline: 0.8637 };
export const PLAYFAIR_ITALIC: Fam = { family: "Playfair Display", weight: 400, italic: true, baseline: 0.915 };

export type CapLayerProps = {
  t: number;
  text: string;
  color: string;
  fam?: Fam;
  /** precomp size */
  w: number;
  h: number;
  just: "left" | "center" | "right";
  /** text origin (baseline point of the justification edge) in precomp px: textPos - textAnchor */
  origin: [number, number];
  /** layer Anchor Point in precomp px, layer Position in comp px (Main Position already added), Scale in percent */
  anchor: [number, number];
  pos: [number, number];
  scale: number;
  /** layer in-point, seconds */
  at: number;
  /** Fast Box Blur radius at this time */
  blur?: number;
  /** Geometry2: content offset (px, within the layer box, clipped) and uniform scale percent about geoAnchor */
  geoOffset?: [number, number];
  geoScale?: number;
  geoAnchor?: [number, number];
  /** Expression-Selector text animator (per word) */
  reveal?: { from: Reveal; delayF: number; durF: number; fps: number };
  /** typewriter cursor glyph opacity (0/1); undefined = no cursor */
  cursor?: number;
};

const SIZE = 100;
const PAD = 8;

export const CapLayer: React.FC<CapLayerProps> = (p) => {
  const fam = p.fam ?? INTER;
  const sc = p.scale / 100;
  const geo = p.geoOffset !== undefined || p.geoScale !== undefined;
  const [ox, oy] = p.origin;
  const [gx, gy] = p.geoAnchor ?? [0, 0];
  const [dx, dy] = p.geoOffset ?? [0, 0];
  const gs = (p.geoScale ?? 100) / 100;
  const frame = p.reveal ? (p.t - p.at) * p.reveal.fps : 0;

  const parts = p.reveal ? p.text.split(/(\s+)/) : [p.text];
  const live = parts.map((s, i) => (/^\s+$/.test(s) || s === "" ? -1 : i)).filter((i) => i >= 0);

  const lineStyle: React.CSSProperties = {
    position: "absolute",
    top: oy - fam.baseline * SIZE,
    width: 4000,
    left: p.just === "left" ? ox : p.just === "right" ? ox - 4000 : ox - 2000,
    textAlign: p.just,
    whiteSpace: "pre",
    fontFamily: `'${fam.family}', sans-serif`,
    fontWeight: fam.weight,
    fontStyle: fam.italic ? "italic" : "normal",
    fontSize: SIZE,
    lineHeight: 1,
    color: p.color,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: p.pos[0] - p.anchor[0] * sc,
        top: p.pos[1] - p.anchor[1] * sc,
        width: p.w,
        height: p.h,
        transformOrigin: "0 0",
        transform: `scale(${sc})`,
        opacity: p.t < p.at ? 0 : 1,
        filter: p.blur && p.blur > 0.05 ? `blur(${p.blur}px)` : undefined,
      }}
    >
      {/* Geometry2 clips to the layer box; PAD gives Inter's taller x-height a little room vs the source font */}
      <div style={{ position: "absolute", left: 0, right: 0, top: geo ? -PAD : 0, bottom: geo ? -PAD : 0, overflow: geo ? "hidden" : "visible" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: geo ? PAD : 0,
            bottom: geo ? -PAD : 0,
            transformOrigin: "0 0",
            transform: geo ? `translate(${dx}px, ${dy}px) translate(${gx}px, ${gy}px) scale(${gs}) translate(${-gx}px, ${-gy}px)` : undefined,
          }}
        >
          <div style={lineStyle}>
            {parts.map((s, i) => {
              if (!p.reveal) return <span key={i}>{s}</span>;
              const n = live.indexOf(i);
              if (n < 0) return <span key={i}>{s}</span>;
              const { from, delayF, durF } = p.reveal;
              const k = expoOut(clamp01((frame - n * delayF) / durF));
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: lerp((from.opacity ?? 100) / 100, 1, k),
                    filter: from.blur ? `blur(${lerp(from.blur * 0.25, 0, k)}px)` : undefined,
                    transform: `translate(${lerp(from.x ?? 0, 0, k)}px, ${lerp(from.y ?? 0, 0, k)}px) scale(${lerp((from.scale ?? 100) / 100, 1, k)}) rotate(${lerp(from.rotation ?? 0, 0, k)}deg)`,
                  }}
                >
                  {s}
                </span>
              );
            })}
            {p.cursor !== undefined && <span style={{ opacity: p.cursor }}>|</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
