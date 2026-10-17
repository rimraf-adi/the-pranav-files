// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/gen-stroke-path.py
// + assets/strokefonts (Hershey fonts, public-domain-style license, see THIRD_PARTY/hyperframes). Re-implemented for Remotion.
import script1 from "./strokefonts/hersheyScript1.json";
import scriptMed from "./strokefonts/hersheyScriptMed.json";

type Glyph = { a: number; s: number[][][] };
const FONTS: Record<string, Record<string, Glyph>> = {
  "HersheyScript1.svg": script1 as unknown as Record<string, Glyph>,
  "HersheyScriptMed.svg": scriptMed as unknown as Record<string, Glyph>,
};

export type Stroke = {
  d: string;
  len: number;
  /** cumulative length before this stroke */
  from: number;
  pts: [number, number][];
};
export type StrokeLayout = {
  strokes: Stroke[];
  total: number;
  width: number;
  /** glyph box (ascender top .. descender bottom) in output px, baseline at `baseline` */
  height: number;
  baseline: number;
  scale: number;
};

const ASC = 800;
const DESC = 230;

/** Lay out `text` so its advance width equals `targetWidth` px. Coordinates: x 0..width, y 0..height (y down). */
export const layoutStrokes = (
  text: string,
  targetWidth: number,
  font = "HersheyScript1.svg",
): StrokeLayout => {
  const g = FONTS[font] ?? script1;
  const space = (g as any)[" "]?.a ?? 300;
  let total = 0;
  for (const ch of text) total += (g[ch]?.a ?? space) || space;
  const s = targetWidth / Math.max(1, total);
  const baseline = ASC * s;
  const strokes: Stroke[] = [];
  let cursor = 0;
  let acc = 0;
  for (const ch of text) {
    const gl = g[ch];
    const adv = gl?.a ?? space;
    for (const st of gl?.s ?? []) {
      const pts = st.map(
        ([x, y]) => [(cursor + x) * s, baseline - y * s] as [number, number],
      );
      let len = 0;
      for (let i = 1; i < pts.length; i++)
        len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (len < 0.5) continue;
      strokes.push({
        d: pts
          .map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
          .join(" "),
        len,
        from: acc,
        pts,
      });
      acc += len;
    }
    cursor += adv;
  }
  return {
    strokes,
    total: acc,
    width: total * s,
    height: (ASC + DESC) * s,
    baseline,
    scale: s,
  };
};

/** Constant pen speed: how much of each stroke is drawn at progress p (0..1). Returns dashoffset-friendly drawn lengths. */
export const drawn = (L: StrokeLayout, p: number): number[] => {
  const at = Math.min(1, Math.max(0, p)) * L.total;
  return L.strokes.map((s) => Math.min(s.len, Math.max(0, at - s.from)));
};

/** Pen tip position at progress p. */
export const penAt = (L: StrokeLayout, p: number): [number, number] => {
  const at = Math.min(1, Math.max(0, p)) * L.total;
  for (const s of L.strokes) {
    if (at <= s.from + s.len || s === L.strokes[L.strokes.length - 1]) {
      let rem = Math.min(s.len, Math.max(0, at - s.from));
      for (let i = 1; i < s.pts.length; i++) {
        const seg = Math.hypot(
          s.pts[i][0] - s.pts[i - 1][0],
          s.pts[i][1] - s.pts[i - 1][1],
        );
        if (rem <= seg || i === s.pts.length - 1) {
          const k = seg ? Math.min(1, rem / seg) : 0;
          return [
            s.pts[i - 1][0] + (s.pts[i][0] - s.pts[i - 1][0]) * k,
            s.pts[i - 1][1] + (s.pts[i][1] - s.pts[i - 1][1]) * k,
          ];
        }
        rem -= seg;
      }
    }
  }
  return [0, 0];
};
