// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmHolorail()/setpieceHoloboot() shared helpers. Re-implemented for Remotion.
import { tw } from "../motion";

/** GSAP `keyframes: {prop:[a,b,c...]}` with ease none: equal-spaced linear segments over [at, at+dur]. */
export const kf = (t: number, at: number, dur: number, vals: number[]) => {
  if (t <= at) return vals[0];
  if (t >= at + dur) return vals[vals.length - 1];
  const u = ((t - at) / dur) * (vals.length - 1);
  const i = Math.min(vals.length - 2, Math.floor(u));
  return vals[i] + (vals[i + 1] - vals[i]) * (u - i);
};

/** Geometry shared by the holorail plate and the holoboot body-zone projector. */
export const holoGeom = (W: number, H: number, px: (n: number) => number, b: Record<string, any>) => {
  const plateW = Math.min(W * 0.92, px(b.plateW ?? 980));
  const plateH = px(b.plateH ?? 96);
  // portrait: plate rides at ~83% of the frame height (safe zone, above the 88% line)
  const plateY = H * 0.83;
  return { plateW, plateH, plateY, plateBot: plateY + plateH / 2 };
};

/** Projector-cut factors (brightness pop -> slit -> dot) at time t for a cut starting at ex. */
export const projectorCut = (t: number, ex: number, slitDur: number, dotDur: number) => {
  const easeIn3 = (x: number) => x * x * x * x;
  const sy = t < ex ? 1 : 1 + (0.045 - 1) * easeIn3(tw(t, ex + 0.005, slitDur, 0, 1, (x) => x));
  const sx = 1 + (0.015 - 1) * easeIn3(tw(t, ex + 0.08, dotDur, 0, 1, (x) => x));
  return { sy: t < ex + 0.005 ? 1 : sy, sx: t < ex + 0.08 ? 1 : sx, bright: t >= ex };
};
