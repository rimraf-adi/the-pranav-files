import React from "react";
import { useVideoConfig } from "remotion";
import type { Word } from "../schema/timeline";
import { buildLines, pickHero } from "./lines";
import { useThemeFonts } from "./fonts";
import { dnas, paradigms, setpieces } from "./registry.generated";
import type { Hero, Line, ThemeCtx, ThemeDNA } from "./types";

export type ThemeSel = { name: string; hero?: number };

export const useThemeCtx = (
  words: Word[],
  sel?: ThemeSel,
): ThemeCtx | undefined => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return React.useMemo(() => {
    if (!sel) return undefined;
    const dna = dnas[sel.name];
    if (!dna)
      throw new Error(
        `Unknown caption theme "${sel.name}". Known: ${Object.keys(dnas).join(", ")}`,
      );
    // portrait stage is narrow: break lines shorter than the 16:9 upstream defaults
    const lines: Line[] = portrait
      ? buildLines(words, 4, 22)
      : buildLines(words);
    const hero: Hero | undefined = pickHero(words, sel.hero);
    return { dna, words, lines, hero };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, sel?.name, sel?.hero, portrait]);
};

export const themeDna = (name?: string): ThemeDNA | undefined =>
  name ? dnas[name] : undefined;

/**
 * Renders a theme's body paradigm and hero set piece on the right layer.
 *   behind = under the subject cutout   (bg body, set piece .Behind)
 *   front  = over the whole frame       (fg body, set piece .Front)
 * A paradigm/set piece that has not been ported yet is skipped, never crashes the render.
 */
export const ThemeLayers: React.FC<{
  ctx: ThemeCtx;
  layer: "behind" | "front";
}> = ({ ctx, layer }) => {
  const { dna, hero } = ctx;
  useThemeFonts(dna.fonts);
  const par = paradigms[dna.body.paradigm];
  const sp = dna.hero ? setpieces[dna.hero.setpiece] : undefined;
  const bodyHere = (dna.body.layer === "bg") === (layer === "behind");
  return (
    <>
      {bodyHere && par ? <par.Component {...ctx} /> : null}
      {hero && sp && layer === "behind" && sp.Behind ? (
        <sp.Behind {...ctx} hero={hero} />
      ) : null}
      {hero && sp && layer === "front" && sp.Front ? (
        <sp.Front {...ctx} hero={hero} />
      ) : null}
    </>
  );
};
