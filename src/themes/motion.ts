import { interpolate } from "remotion";

/** GSAP-compatible easings as (x:0..1)=>y so upstream tweens translate 1:1. */
const pow = (n: number) => ({
  in: (x: number) => Math.pow(x, n + 1),
  out: (x: number) => 1 - Math.pow(1 - x, n + 1),
  inOut: (x: number) =>
    x < 0.5 ? Math.pow(2 * x, n + 1) / 2 : 1 - Math.pow(2 * (1 - x), n + 1) / 2,
});
export const ease = {
  none: (x: number) => x,
  power1: pow(1), // quad
  power2: pow(2), // cubic
  power3: pow(3), // quart
  power4: pow(4), // quint
  expo: {
    in: (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
    out: (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  },
  sine: {
    in: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
    out: (x: number) => Math.sin((x * Math.PI) / 2),
    inOut: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  },
  back: {
    out:
      (s = 1.70158) =>
      (x: number) =>
        1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    in:
      (s = 1.70158) =>
      (x: number) =>
        (s + 1) * x * x * x - s * x * x,
  },
  elastic: {
    out:
      (a = 1, p = 0.3) =>
      (x: number) => {
        if (x === 0 || x === 1) return x;
        const amp = Math.max(1, a);
        const s = (p / (2 * Math.PI)) * Math.asin(1 / amp);
        return (
          amp * Math.pow(2, -10 * x) * Math.sin(((x - s) * (2 * Math.PI)) / p) +
          1
        );
      },
  },
  /** GSAP steps(n) */
  steps: (n: number) => (x: number) => Math.min(1, Math.floor(x * n) / n),
};

/**
 * Tween helper = GSAP `tl.fromTo(el, {v:from}, {v:to, duration, ease}, at)` evaluated at time `t` (seconds).
 * Holds `from` before `at` and `to` after `at + dur`.
 */
export const tw = (
  t: number,
  at: number,
  dur: number,
  from: number,
  to: number,
  e: (x: number) => number = ease.power2.out,
) =>
  interpolate(t, [at, at + Math.max(1e-6, dur)], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

/** Seeded PRNG (mulberry32), same family upstream uses, so seeded layouts stay stable per frame. */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
