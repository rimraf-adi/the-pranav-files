// Shared primitives for the "Caption 09-15" template ports (4 precomp text layers, each with a layer-level
// entrance: opacity / box blur / rotation / position keys, plus an optional text animator).
// Everything is a pure function of `t` (seconds on the template timeline).
import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { clamp01, lerp } from "./ae";

// Make sure the exact styles we use are requested (the theme font loader only asks for default styles).
loadInter("normal", { weights: ["700"], subsets: ["latin"] });
loadPlayfair("italic", { weights: ["400"], subsets: ["latin"] });

const FONTS = {
  // NHaasGroteskDSPro-75Bd -> Inter 700 (slightly wider, so tightened a little)
  sans: { family: "Inter", weight: 700, italic: false, asc: 0.96875, desc: 0.2412, ls: "-0.03em" },
  // PlayfairDisplay-Italic -> Playfair Display italic
  serif: { family: "Playfair Display", weight: 400, italic: true, asc: 1.082, desc: 0.251, ls: undefined as string | undefined },
};

/**
 * AE keys in these packs are "linear out, bezier in" with the in-influence set per property
 * (100% opacity/position/typewriter, 80% blur/rotation/counter): control points (1/3,1/3) and (1-influence,1).
 */
// The md extractor reports these keys as linear, and the bezier reading made the typewriter finish almost instantly, so linear it is.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const easeIn = (_influence: number) => (x: number) => x;
const seg = (lt: number, dur: number, a: number, b: number, infl: number) => lerp(a, b, easeIn(infl)(clamp01(lt / dur)));

export type Fx =
  | { kind: "none" }
  /** Range Selector Start 0->100 over `dur` s, animator Opacity 0, Based On chars-without-spaces */
  | { kind: "type"; dur: number; infl?: number }
  /** "Slide Down By Character": Offset -100->100 over 1 s, Ramp Up, Based On words, Position (0,100) + Opacity 0 */
  | { kind: "slide" }
  /** Expression selector: s = 220 cos(2*2pi*t)/e^(8t), unit k starts delay*k; Position (0,50), Opacity 0 (+ Rotation) */
  | { kind: "spring"; delay: number; unit: "word" | "char"; rot?: number };

export type CaptionItem = {
  text: string;
  color: string;
  font: "sans" | "serif";
  /** precomp (text comp) size in px, text justification inside it */
  comp: [number, number];
  just: "left" | "center" | "right";
  /** layer Anchor Point (default: centre of the precomp) */
  anchor?: [number, number];
  /** layer Position (static value, or start of the 1 s move to `posTo`) + the Main Position X/Y slider offset */
  pos: [number, number];
  posTo?: [number, number];
  slider: [number, number];
  /** Main Scale slider, percent */
  scale: number;
  /** layer in-point, seconds */
  tIn: number;
  /** layer Opacity 0->100 key over 1 s (default true) */
  fade?: boolean;
  /** Fast Box Blur 50 -> 0 over 1 s */
  blur?: boolean;
  /** layer Rotation from this angle to 0 over 1 s */
  rotFrom?: number;
  fx: Fx;
  /** baseline distance from the precomp top (default 72, the cap-height box AE sizes these comps to) */
  baseline?: number;
  /** horizontal nudge of the text inside the precomp */
  dx?: number;
  /** Number Counter (text 02 of caption 15): counts 0 -> parseInt(text) over 1 s */
  counter?: boolean;
  /** two stacked white Glow effects (radius 200 / 800) */
  glow?: boolean;
};

type Unit = { s: string; idx: number }; // idx: unit index for effects, -1 = whitespace / not animated

const splitUnits = (text: string, fx: Fx): Unit[] => {
  if (fx.kind === "none") return [{ s: text, idx: -1 }];
  const words = fx.kind === "slide" || (fx.kind === "spring" && fx.unit === "word");
  const parts = words ? text.split(/(\s+)/) : [...text];
  let n = 0;
  return parts.map((s) => {
    const isSpace = /^\s+$/.test(s);
    if (fx.kind === "spring" && !words) return { s, idx: n++ }; // Based On = characters: spaces count
    return { s, idx: isSpace ? -1 : n++ };
  });
};

const unitStyle = (fx: Fx, u: Unit, count: number, lt: number): React.CSSProperties => {
  if (fx.kind === "none" || u.idx < 0) return {};
  if (fx.kind === "type") {
    const S = easeIn(fx.infl ?? 1)(clamp01(lt / fx.dur)); // Start / 100
    return { opacity: clamp01(count * S - u.idx) };
  }
  if (fx.kind === "slide") {
    const uPos = (u.idx + 0.5) / count;
    const f = clamp01(uPos + 1 - 2 * lt); // ramp-up shape, offset -100 -> 100
    const k = f * f; // Ease Low 99
    return { display: "inline-block", opacity: 1 - k, transform: `translateY(${100 * k}px)` };
  }
  // spring
  const tt = lt - fx.delay * (u.idx + 1);
  const amount = tt >= 0 ? (220 * Math.cos(2 * tt * 2 * Math.PI)) / Math.exp(8 * tt) : 100; // percent
  const op = Math.min(1, Math.max(0, 1 - amount / 100));
  const rot = fx.rot ? (fx.rot * amount) / 100 : 0;
  return {
    display: "inline-block",
    opacity: op,
    transform: `translateY(${(50 * amount) / 100}px) rotate(${rot}deg)`,
  };
};

export const CaptionLayer: React.FC<{ it: CaptionItem; t: number; text?: string; color?: string }> = ({ it, t, text, color }) => {
  const lt = t - it.tIn;
  if (lt < 0) return null;
  const f = FONTS[it.font];
  const [w, h] = it.comp;
  const ax = it.anchor?.[0] ?? w / 2;
  const ay = it.anchor?.[1] ?? h / 2;
  const px = (it.posTo ? seg(lt, 1, it.pos[0], it.posTo[0], 1) : it.pos[0]) + it.slider[0];
  const py = (it.posTo ? seg(lt, 1, it.pos[1], it.posTo[1], 1) : it.pos[1]) + it.slider[1];
  const sc = it.scale / 100;
  const opacity = it.fade === false ? 1 : seg(lt, 1, 0, 1, 1);
  const blur = it.blur ? seg(lt, 1, 50, 0, 0.8) : 0;
  const rot = it.rotFrom ? seg(lt, 1, it.rotFrom, 0, 0.8) : 0;

  let content: string = text ?? it.text;
  if (it.counter) {
    const end = parseInt(content, 10) || 0;
    content = String(Math.round(end * easeIn(0.8)(clamp01(lt / 1))));
  }
  const units = splitUnits(content, it.fx);
  const count = units.filter((u) => u.idx >= 0).length;
  const baselineEm = (1 - (f.asc + f.desc)) / 2 + f.asc;
  const top = (it.baseline ?? 72) - 100 * baselineEm;

  return (
    <div
      style={{
        position: "absolute",
        left: px - ax,
        top: py - ay,
        width: w,
        height: h,
        transformOrigin: `${ax}px ${ay}px`,
        transform: `rotate(${rot}deg) scale(${sc})`,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: [
            blur > 0.05 ? `blur(${blur}px)` : "",
            it.glow ? "drop-shadow(0 0 22px rgba(255,255,255,0.55)) drop-shadow(0 0 70px rgba(255,255,255,0.35))" : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: it.dx ?? 0,
            top,
            width: w,
            textAlign: it.just,
            whiteSpace: "pre",
            fontFamily: `'${f.family}', sans-serif`,
            fontWeight: f.weight,
            fontStyle: f.italic ? "italic" : "normal",
            fontVariantNumeric: "lining-nums",
            fontSize: 100,
            lineHeight: "100px",
            letterSpacing: f.ls,
            color: color ?? it.color,
          }}
        >
          {units.map((u, i) => (
            <span key={i} style={unitStyle(it.fx, u, count, lt)}>
              {u.s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CaptionStack: React.FC<{ items: CaptionItem[]; t: number; texts: string[]; colors: string[] }> = ({ items, t, texts, colors }) => (
  <>
    {items.map((it, i) => (
      <CaptionLayer key={i} it={it} t={t} text={texts[i] ?? it.text} color={colors[i] ?? it.color} />
    ))}
  </>
);
