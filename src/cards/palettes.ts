// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/SKILL.md (themeId palettes table). Re-implemented for Remotion.

export const THEME_IDS = ["classic", "noir", "mint", "craft", "slate", "mono"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export type Palette = {
  id: ThemeId;
  /** accent-0..accent-4 */
  accents: [string, string, string, string, string];
  /** board background */
  bg: string;
  /** text colour */
  text: string;
};

export const PALETTES: Record<ThemeId, Palette> = {
  classic: { id: "classic", accents: ["#1971c2", "#e03131", "#2f9e44", "#e8590c", "#9c36b5"], bg: "#FFF9E3", text: "#1e1e1e" },
  noir: { id: "noir", accents: ["#4cc9f0", "#f72585", "#4ade80", "#fb923c", "#a78bfa"], bg: "#1a1a1a", text: "#f1f1f1" },
  mint: { id: "mint", accents: ["#0077b6", "#d62828", "#2d6a4f", "#e76f51", "#7209b7"], bg: "#e8faf0", text: "#1b4332" },
  craft: { id: "craft", accents: ["#bf5700", "#d62728", "#6c757d", "#e9b54a", "#3d5a80"], bg: "#f6efe1", text: "#2d2d2d" },
  slate: { id: "slate", accents: ["#0ea5e9", "#ef4444", "#22c55e", "#f97316", "#a855f7"], bg: "#1e293b", text: "#f1f5f9" },
  mono: { id: "mono", accents: ["#000000", "#555555", "#888888", "#aaaaaa", "#cccccc"], bg: "#ffffff", text: "#000000" },
};

export const getPalette = (id: string | undefined): Palette =>
  PALETTES[(id as ThemeId) ?? "noir"] ?? PALETTES.noir;

// ---- colour helpers (so palette accents stay legible on a style's fixed paper/ink) ----
const parse = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number];
};
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => {
  const A = parse(a), B = parse(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
export const lum = (hex: string) => {
  const [r, g, b] = parse(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
/** Nudge `color` toward black/white until it reads (>= `min`) on `bg`. */
export const readable = (color: string, bg: string, min = 3) => {
  if (contrast(color, bg) >= min) return color;
  const target = lum(bg) > 0.4 ? "#000000" : "#ffffff";
  for (let t = 0.1; t <= 1.001; t += 0.1) {
    const c = mix(color, target, t);
    if (contrast(c, bg) >= min) return c;
  }
  return target;
};
/** Black or white text for a solid `bg` fill. */
export const onColor = (bg: string) => (lum(bg) > 0.45 ? "#111111" : "#ffffff");
export const alpha = (hex: string, a: number) => {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${a})`;
};
