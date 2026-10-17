// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/layouts/{split,stack,pip,overlay}.html and SKILL.md (zones). Re-implemented for Remotion.
import type { CardFrame, CardLayout, CardZone } from "./schema";

export type Rect = { x: number; y: number; w: number; h: number };

/** All values are for the 1080x1920 portrait canvas; scaled for other sizes by CardStage. */
export const BASE_W = 1080;
export const BASE_H = 1920;
export const FULL: Rect = { x: 0, y: 0, w: BASE_W, h: BASE_H };

export const LAYOUTS: Record<CardLayout, { video: Rect; card: Rect; zone: CardZone }> = {
  // portrait flips 50/50 to top/bottom: video bottom half, card on top. The card runs BLEED.split px under the video, whose top edge fades into it (no hard seam)
  split: { video: { x: 0, y: 960, w: 1080, h: 960 }, card: { x: 0, y: 0, w: 1080, h: 1160 }, zone: "side-panel" },
  // video top 44%, card below
  stack: { video: { x: 0, y: 0, w: 1080, h: 844 }, card: { x: 0, y: 858, w: 1080, h: 1062 }, zone: "lower-third" },
  // card fills canvas; 9:16 source pill top-right (upstream "portrait, 9:16 source video")
  pip: { video: { x: 738, y: 28, w: 312, h: 555 }, card: FULL, zone: "fullscreen" },
  // video full-bleed, glass card floats on the bottom band
  overlay: { video: FULL, card: { x: 24, y: 1280, w: 1032, h: 564 }, zone: "video-overlay" },
};

/** Soft seam: px (at 1080 wide) the video's leading edge fades into the card beneath. Keep <= the card overlap. */
export const BLEED: Partial<Record<CardLayout, number>> = { split: 200 };

/** Portrait zone bounds (used when a card sets `zone` explicitly). */
export const ZONES: Record<CardZone, Rect> = {
  fullscreen: FULL,
  "whiteboard-area": { x: 0, y: 1056, w: 1080, h: 864 }, // bottom 45%
  "lower-third": { x: 0, y: 1344, w: 1080, h: 576 }, // bottom 30%
  "side-panel": { x: 0, y: 1152, w: 1080, h: 768 }, // bottom 40%
  "video-overlay": { x: 24, y: 1280, w: 1032, h: 564 },
};

export const cardRectFor = (layout: CardLayout, zone?: CardZone): Rect => (zone ? ZONES[zone] : LAYOUTS[layout].card);
/** Cards in these zones paint above the video; all others sit beneath it. */
export const isFront = (layout: CardLayout, zone?: CardZone) => (zone ?? LAYOUTS[layout].zone) === "video-overlay";

export const scaleRect = (r: Rect, W: number, H: number): Rect => ({ x: (r.x * W) / BASE_W, y: (r.y * H) / BASE_H, w: (r.w * W) / BASE_W, h: (r.h * H) / BASE_H });
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });

/** Frames: how the outer layout rect maps to the rect the video actually fills. */
export const innerRect = (outer: Rect, frame: CardFrame, layout: CardLayout): Rect => {
  if (layout === "overlay" || frame !== "polaroid") return outer;
  const k = Math.min(1, outer.w / 1080);
  const inset = 24 * k, pad = 14 * k, bottom = 64 * k;
  return { x: outer.x + inset + pad, y: outer.y + inset + pad, w: outer.w - 2 * (inset + pad), h: outer.h - 2 * inset - pad - bottom };
};
