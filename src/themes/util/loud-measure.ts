// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// famMetrics()/wordPx() (baked char-width tables). Re-implemented for Remotion via canvas measureText.
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<string, number>();

/** Width in px of `text` set in `family` at `size` px, plus tracking `lsEm` (em) after every char. */
export const measureWidth = (
  text: string,
  family: string,
  size: number,
  lsEm = 0,
): number => {
  const font = `${size}px '${family}'`;
  const key = `${font}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit + lsEm * size * text.length;
  if (typeof document === "undefined") return text.length * size * 0.7;
  ctx = ctx ?? document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * size * 0.7;
  ctx.font = font;
  const w = ctx.measureText(text).width;
  // only cache once the web font is really loaded (otherwise this is a fallback measurement)
  if (document.fonts?.check(font)) cache.set(key, w);
  return w + lsEm * size * text.length;
};
