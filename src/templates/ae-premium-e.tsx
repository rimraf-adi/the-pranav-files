// Shared primitives for the "premium-text" pack ports (1920x1080 text title animations).
// Everything is a pure function of time `t` (seconds). One <PLayer> = one AE text layer with per-character
// animators, Gaussian Blur / Drop Shadow / Glow / CC Light Sweep / Gradient Ramp approximations.
import React from "react";
import { random } from "remotion";
import { bezier, clamp01, lerp, track } from "./ae";
import type { Key } from "./ae";

export type Bez = [number, number, number, number];

/** the script font standing in for Sloop Script Three */
export const SCRIPT = "Great Vibes";

/** progress 0..1 between two times, optionally bezier-eased */
export const prog = (t: number, t0: number, t1: number, b?: Bez) => {
  const k = clamp01((t - t0) / (t1 - t0));
  return b ? bezier(...b)(k) : k;
};

/** scalar track between two keys with a bezier */
export const between = (t: number, t0: number, v0: number, t1: number, v1: number, b?: Bez) =>
  lerp(v0, v1, prog(t, t0, t1, b));

/** hold (step) keyframes: [time, value] pairs */
export const holdTrack = (t: number, pairs: [number, number][]) =>
  track(t, pairs.map(([tt, v]): Key => ({ t: tt, v, hold: true })));

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Random-order ranks (AE "Randomize Order"): rank[i] in 0..n-1, a permutation determined by the seed */
export const ranks = (n: number, seed: string) => {
  const vals = Array.from({ length: n }, (_, i) => ({ i, r: random(`${seed}-${i}`) }));
  vals.sort((a, b) => a.r - b.r);
  const out = new Array<number>(n);
  vals.forEach((v, k) => (out[v.i] = k));
  return out;
};

/** Range Selector Start s (0..100), End 100: coverage 0..1 of the character at selection-order position `rank` */
export const startCov = (rank: number, n: number, s: number) => clamp01(rank + 1 - (s * n) / 100);

/** Range Selector End e (0..100), Start 0: coverage of char at order position `rank` */
export const endCov = (rank: number, n: number, e: number) => clamp01((e * n) / 100 - rank);

/**
 * Soft left-to-right reveal wave (Range Selector Offset sweeping with a smooth/ramp shape):
 * u 0 = every char still selected (hidden), u 1 = none selected. Returns the REVEALED amount 0..1.
 */
export const waveReveal = (i: number, n: number, u: number, feather = 0.5) => {
  const p = (i + 0.5) / n;
  const f = u * (1 + feather);
  return smooth(clamp01((f - p) / feather));
};

export type CharFx = {
  opacity?: number; // 0..1
  x?: number;
  y?: number;
  sx?: number; // 1 = 100%
  sy?: number;
  rot?: number;
  blur?: number; // css px
  ch?: string; // replacement glyph (Character Offset)
  track?: number; // extra px after the glyph
};

export type SweepP = {
  /** band centre across the text box width: 0 = left edge, 1 = right edge (may exceed) */
  k: number;
  /** half-width as fraction of box width */
  w?: number;
  /** peak opacity of the light, default .5 */
  a?: number;
  /** css gradient angle, default 105 (direction -30 deg) */
  angle?: number;
  color?: string;
};

export type PLayerProps = {
  text: string;
  font: string;
  weight?: number;
  italic?: boolean;
  upper?: boolean;
  size: number; // AE font size px (before layer scale)
  color: string;
  letterSpacing?: number;
  /** layer Position (comp px) and the Anchor Point's height above the baseline in text px (= -anchor.y) */
  pos: [number, number];
  anchorUp: number;
  /** layer Scale in percent [x, y] */
  scale: [number, number];
  rot?: number;
  opacity?: number; // 0..1, whole layer
  /** ratio of size where the middle of the capitals sits above the baseline (font dependent) */
  capMid?: number;
  /** vertical fudge in px (text px) to compensate for font metrics */
  dy?: number;
  blur?: number; // AE Gaussian Blur "Blurriness"
  shadow?: { d: number; s: number; o?: number };
  glow?: { r: number; a: number; color?: string }[];
  sweeps?: SweepP[];
  gradient?: [string, string, number];
  chars?: (i: number, n: number, ch: string) => CharFx;
  /** extra whole-layer css filter (e.g. brightness for strobe) */
  filter?: string;
  /** extra transform applied after layer scale (e.g. AE Transform effect), around layer origin */
  extraTransform?: string;
};

export const PLayer: React.FC<PLayerProps> = (p) => {
  const text = p.upper ? p.text.toUpperCase() : p.text;
  const glyphs = [...text];
  const live = glyphs.map((g, i) => (/\s/.test(g) ? -1 : i));
  const n = live.filter((i) => i >= 0).length;
  const capMid = p.capMid ?? 0.36;
  const opacity = p.opacity ?? 1;

  const body = (color: string, useGradient: boolean) =>
    glyphs.map((g, i) => {
      if (live[i] < 0) return <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>{g}</span>;
      const idx = live.filter((j) => j >= 0 && j < i).length;
      const fx = p.chars?.(idx, n, g) ?? {};
      const st: React.CSSProperties = {
        display: "inline-block",
        whiteSpace: "pre",
        opacity: fx.opacity ?? 1,
        transformOrigin: "50% 65%",
        transform: `translate(${fx.x ?? 0}px, ${fx.y ?? 0}px) scale(${fx.sx ?? 1}, ${fx.sy ?? fx.sx ?? 1}) rotate(${fx.rot ?? 0}deg)`,
        filter: fx.blur ? `blur(${fx.blur}px)` : undefined,
        marginRight: fx.track ? fx.track : undefined,
        color,
      };
      if (useGradient && p.gradient) {
        st.background = `linear-gradient(${p.gradient[2]}deg, ${p.gradient[0]}, ${p.gradient[1]})`;
        st.WebkitBackgroundClip = "text";
        st.backgroundClip = "text";
        st.color = "transparent";
        st.WebkitTextFillColor = "transparent";
      }
      return <span key={i} style={st}>{fx.ch ?? g}</span>;
    });

  const filters: string[] = [];
  (p.glow ?? []).forEach((g) => {
    const c = g.color ?? p.color;
    filters.push(`drop-shadow(0 0 ${g.r}px color-mix(in srgb, ${c} ${Math.round(g.a * 100)}%, transparent))`);
  });
  if (p.shadow) {
    const o = p.shadow.o ?? 0.5;
    const off = p.shadow.d * Math.SQRT1_2;
    filters.push(`drop-shadow(${off}px ${off}px ${p.shadow.s * 0.6}px rgba(0,0,0,${o}))`);
  }
  if (p.blur && p.blur > 0.05) filters.push(`blur(${p.blur * 0.5}px)`);
  if (p.filter) filters.push(p.filter);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity,
        transform: `translate(${p.pos[0]}px, ${p.pos[1]}px) rotate(${p.rot ?? 0}deg) scale(${p.scale[0] / 100}, ${p.scale[1] / 100}) ${p.extraTransform ?? ""}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "max-content",
          transform: `translate(-50%, -50%) translateY(${p.anchorUp - capMid * p.size + (p.dy ?? 0)}px)`,
          whiteSpace: "pre",
          fontFamily: `'${p.font}', sans-serif`,
          fontWeight: p.weight ?? 400,
          fontStyle: p.italic ? "italic" : "normal",
          fontSize: p.size,
          lineHeight: 1,
          letterSpacing: p.letterSpacing,
          filter: filters.length ? filters.join(" ") : undefined,
        }}
      >
        <div style={{ position: "relative" }}>
          {body(p.color, true)}
          {(p.sweeps ?? []).map((s, si) => {
            const c = s.k * 100;
            const w = (s.w ?? 0.18) * 100;
            const mask = `linear-gradient(${s.angle ?? 105}deg, transparent ${c - w}%, rgba(0,0,0,${s.a ?? 0.5}) ${c}%, transparent ${c + w}%)`;
            return (
              <div
                key={si}
                style={{ position: "absolute", left: 0, top: 0, WebkitMaskImage: mask, maskImage: mask, pointerEvents: "none" }}
              >
                {body(s.color ?? "#FFFAF0", false)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** AE Character Offset: shift a letter by `k` places within its alphabet (digits/other untouched) */
export const shiftChar = (ch: string, k: number) => {
  const c = ch.charCodeAt(0);
  const kk = Math.round(k);
  if (c >= 65 && c <= 90) return String.fromCharCode(65 + ((((c - 65 + kk) % 26) + 26) % 26));
  if (c >= 97 && c <= 122) return String.fromCharCode(97 + ((((c - 97 + kk) % 26) + 26) % 26));
  return ch;
};

/** AE "Overshoot" bounce on an Expression Selector: value = end + amp*sin(w t)/exp(decay t)/w, amount in percent */
export const bounceAmount = (tt: number, dur = 0.1, freq = 3, decay = 7) => {
  if (tt < 0) return 100;
  if (tt < dur) return lerp(100, 0, tt / dur);
  const amp = -100 / dur;
  const w = freq * Math.PI * 2;
  const x = tt - dur;
  return (amp * Math.sin(x * w)) / Math.exp(decay * x) / w;
};
