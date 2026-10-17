// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// shared helpers of paperrail/papermat/popuprail/centerfold/planktonrail/carbonstrip. Re-implemented for Remotion.
import { useVideoConfig } from "remotion";
import { mulberry32 } from "../motion";
import type { Hero, Line, ThemeDNA } from "../types";

/** Seeded torn-paper polygon (CSS clip-path) on a w x h box, as in upstream torn(). */
export const tornPoly = (
  w: number,
  h: number,
  jag: number,
  sx: number,
  sy: number,
  rr: () => number,
): string => {
  const pts: [number, number][] = [];
  const j = () => Math.min(jag, Math.max(0, jag * 0.5 + (rr() - 0.5) * jag));
  for (let i = 0; i <= sx; i++) pts.push([(w / sx) * i, j()]);
  for (let i = 1; i <= sy; i++) pts.push([w - j(), (h / sy) * i]);
  for (let i = sx - 1; i >= 0; i--) pts.push([(w / sx) * i, h - j()]);
  for (let i = sy - 1; i >= 1; i--) pts.push([j(), (h / sy) * i]);
  return (
    "polygon(" +
    pts.map((q) => `${q[0].toFixed(1)}px ${q[1].toFixed(1)}px`).join(",") +
    ")"
  );
};

export const starPoints = (
  cx: number,
  cy: number,
  n: number,
  R: number,
  r: number,
  rot: number,
): string => {
  const p: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (Math.PI * i) / n;
    const rad = i % 2 === 0 ? R : r;
    p.push(
      `${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`,
    );
  }
  return p.join(" ");
};

export const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

/** GSAP steps(n) as a 0..1 progress quantizer. */
export const stepQ = (x: number, n: number) =>
  Math.min(1, Math.floor(Math.max(0, Math.min(1, x)) * n) / n);

/** Seeded signed noise in [-0.5, 0.5) from a string/number seed (deterministic per frame). */
export const rnd = (seed: number, k: number) => mulberry32(seed + k * 7919)();

/** When a line leaves: after its last word, but before the next line starts. */
export const lineOut = (lines: Line[], i: number) => {
  const L = lines[i];
  return Math.max(
    L.end + 0.05,
    Math.min(L.end + 0.5, (lines[i + 1]?.start ?? Infinity) - 0.02),
  );
};

/** Hero window: I = apex word start, E = when the set piece finishes (clamped to clip end). */
export const useHeroWin = (dna: ThemeDNA, hero: Hero, minHold = 1.6) => {
  const { durationInFrames, fps } = useVideoConfig();
  const dur = durationInFrames / fps;
  const I = hero.start;
  const exitAt = (dna.hero as any)?.exitAt as number | undefined;
  const E = Math.min(
    exitAt ?? I + Math.max(minHold, hero.end - hero.start + 1.0),
    dur - 0.12,
  );
  return { I, E: Math.max(E, I + 0.9), dur };
};

/** The word in a line that is the hero apex (for the rail star hand-off). */
export const isHeroWord = (
  hero: Hero | undefined,
  w: { start: number; text: string },
) => !!hero && Math.abs(w.start - hero.start) < 1e-6;
