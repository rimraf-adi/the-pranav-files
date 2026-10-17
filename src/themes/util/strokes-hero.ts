// Shared helpers for the stroke-written hero set pieces (aurora, brush, chalkboard, graffiti, neonsign, spectrum).
import type { Hero, ThemeDNA } from "../types";

/** Hero in / out times (output seconds), same rule as the settle port. */
export const heroSpan = (dna: ThemeDNA, hero: Hero) => {
  const I = hero.start;
  const E =
    (dna.hero as any)?.exitAt ?? I + Math.max(1.5, hero.end - hero.start + 1.1);
  return { I, E };
};

/** Fade factor 0..1 for a hero layer that should vanish around E. */
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Cheap seeded value noise 0..1 in time (for hum / jitter), pure. */
export const wob = (t: number, hz: number, ph = 0) =>
  0.5 + 0.5 * Math.sin(2 * Math.PI * hz * t + ph);

/** Hero word as drawn (lowercase script reads best with Hershey Script). */
export const heroDisplay = (hero: Hero) =>
  hero.text.replace(/[^A-Za-z0-9 '’-]/g, "");

/** Vertical centre (fraction of H) for hand-written hero words: above the speaker head in the demo framing. */
export const HERO_Y = 0.27;

/** Hero-yield dim factor for a rail (dna.body.yield), 1 = untouched. */
export const yieldFactor = (
  t: number,
  heroStart: number,
  y?: { dim?: number; pre?: number; post?: number },
) => {
  if (!y) return 1;
  const dim = y.dim ?? 0.5;
  const a = clamp01((t - (heroStart - (y.pre ?? 0.16))) / 0.2);
  const b = clamp01((t - (heroStart + (y.post ?? 0.62))) / 0.3);
  const down = 1 - (1 - dim) * a;
  return down + (1 - down) * b;
};

/**
 * Two-row coexistence schedule used by sheenrail/chalkrail-style paradigms:
 * a line stays until line i+2 needs its row, or shortly after its couplet finished speaking.
 */
export const pairOut = (
  lines: { start: number; end: number }[],
  i: number,
  heroStart: number | undefined,
  activeIdx: number,
  endT: number,
) => {
  const pairLast = lines[Math.min(i - (i % 2) + 1, lines.length - 1)];
  let out: number | null =
    i + 2 < lines.length
      ? Math.min(lines[i + 2].start - 0.15, pairLast.end + 0.23 + (i % 2) * 0.17)
      : i + 1 < lines.length
        ? lines[i + 1].start - 0.11
        : null;
  if (
    heroStart != null &&
    i !== activeIdx &&
    out != null &&
    out > heroStart - 0.25 &&
    lines[i].start < heroStart
  )
    out = heroStart - 0.32;
  return out == null ? null : Math.min(out, endT - 0.4);
};
