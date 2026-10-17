// Design tokens ported from heygen-com/hyperframes (Apache-2.0) themes/*.css, see THIRD_PARTY/hyperframes.
import bold from "./tokens/bold.json";
import editorial from "./tokens/editorial.json";
import neutral from "./tokens/neutral.json";

export type TokenSet = { name: string; tokens: Record<string, string> };
export const tokenSets: Record<string, TokenSet> = { bold, editorial, neutral };

/** "1.4cqmin" -> pixels on a stage whose short side is `shortSide` px. Other units pass through as numbers/strings. */
export const cqmin = (v: string, shortSide: number): number => {
  const m = /^(-?[\d.]+)cqmin$/.exec(v.trim());
  return m ? (parseFloat(m[1]) / 100) * shortSide : parseFloat(v);
};
