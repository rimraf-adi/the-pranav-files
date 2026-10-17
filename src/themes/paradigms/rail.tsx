// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmRail() (entrances: fade | stamp | bootflick | flick; exits: fade | drop | powercut). Re-implemented for Remotion.
import React from "react";
import { interpolateColors, random } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";

const Rail: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const b = dna.body as Record<string, any>;
  const pal = dna.palette;
  const family = `'${dna.fonts.body}', sans-serif`;
  const baseFont = px(b.fontPx ?? 46);
  const yld = b.yield as
    | { dim: number; pre?: number; post?: number }
    | undefined;

  return (
    <>
      {lines.map((L, i) => {
        const inT = L.start;
        const outT = Math.max(
          L.end + 0.05,
          Math.min(L.end + 0.5, (lines[i + 1]?.start ?? Infinity) - 0.02),
        );
        if (t < inT - 0.05 || t > outT + 0.2) return null;
        const xo = outT - 0.17;
        let op = 1;
        let ly = 0;
        // exit variants (upstream: fade | drop | powercut)
        const F = 1 / 30;
        if (b.exit === "fade") {
          op = tw(t, xo, 0.15, 1, 0, ease.power1.in);
          ly = tw(t, xo, 0.15, 0, px(6), ease.power1.in);
        } else if (b.exit === "drop") {
          const xd = outT - 0.18;
          op = tw(t, xd, 0.16, 1, 0, ease.power2.in);
          ly = tw(t, xd, 0.16, 0, px(34), ease.power2.in);
        } else {
          const xp = outT - 0.17;
          op = t < xp ? 1 : t < xp + F ? 0.5 : t < xp + 3 * F ? 0.12 : 0;
        }
        // yield: rail dims while the hero lands
        if (
          hero &&
          yld &&
          L.start < hero.start + 0.9 &&
          L.end > hero.start - 0.3
        ) {
          const dimT = Math.max(hero.start - (yld.pre ?? 0.2), L.start + 0.05);
          const resT = hero.start + (yld.post ?? 0.9);
          const y = tw(t, dimT, 0.2, 1, yld.dim, ease.none) * 1; // dim
          const back = tw(t, resT, 0.25, 0, 1, ease.none);
          op *= y + (1 - y) * back;
        }
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: H - px(b.bottomPx ?? 96) - H * 0.12,
              transform: `translate(-50%, -100%) translateY(${ly}px)`,
              opacity: op,
              whiteSpace: "nowrap",
              fontFamily: family,
              fontSize: Math.min(
                baseFont,
                (W * 0.88) /
                  Math.max(
                    8,
                    L.words.reduce((n, w) => n + w.text.length + 1.3, 0) * 0.56,
                  ),
              ),
              lineHeight: 1,
              letterSpacing: b.letterSpacing ?? "0.02em",
              color: pal.body,
              textShadow:
                b.glow ??
                "0 3px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              const minor = w.emphasis;
              const HOT = pal.hot ?? pal.accent;
              const BONE = pal.body;
              const rnd = random(`rail-${L.index}-${wi}`);
              let opacity = 0;
              let dy = 0;
              let sx = 1;
              let sy = 1;
              let dx = 0;
              let color: string | undefined = minor
                ? (pal.em ?? pal.accent)
                : undefined;
              let weight: number | undefined = minor ? 700 : undefined;
              let shadow: string | undefined;
              const F2 = 1 / 30;
              if (t >= st) {
                if (b.entrance === "stamp") {
                  const big = minor ? 2.1 : 1.28;
                  const sc = tw(t, st + 0.01, 0.11, big, 1, ease.power3.in);
                  const sq =
                    t >= st + 0.12
                      ? tw(
                          t,
                          st + 0.16,
                          0.22,
                          1.05,
                          1,
                          ease.elastic.out(1, 0.45),
                        )
                      : 1;
                  opacity = 1;
                  sx = sc * (t >= st + 0.12 ? sq : 1);
                  sy = sc * (t >= st + 0.12 ? 2 - sq : 1);
                  const cool = tw(
                    t,
                    st + 0.15,
                    minor ? 0.6 : 0.32,
                    0,
                    1,
                    ease.power1.in,
                  );
                  const to = minor ? (pal.minorCool ?? "#F2CFA0") : BONE;
                  color = interpolateColors(cool, [0, 1], [HOT, to]);
                  weight = minor ? 700 : undefined;
                  dy = minor
                    ? tw(t, st + 0.06, 0.18, px(4), 0, ease.power2.out)
                    : tw(t, st + 0.06, 0.18, px(2), 0, ease.power2.out);
                } else if (b.entrance === "bootflick") {
                  const glitch = rnd < 0.45;
                  if (t < st + F2) {
                    opacity = 0.6;
                    color = "#00F0FF";
                    dx = px(2);
                  } else if (glitch && t < st + 2 * F2) {
                    opacity = 0.15;
                    dx = -px(2);
                    color = "#00F0FF";
                  } else {
                    opacity = 1;
                    color = BONE;
                  }
                  if (minor) {
                    const k = tw(t, st + F2, 0.25, 1.18, 1, ease.power2.out);
                    sx = sy = k;
                    if (t >= st + 2 * F2)
                      shadow =
                        "2px 0 0 #00F0FF, -2px 0 0 #FF003C, 0 2px 10px rgba(0,0,0,0.75)";
                  }
                } else if (b.entrance === "fade") {
                  opacity = tw(t, st, 0.12, 0, 1, ease.power2.out);
                  dy = tw(t, st, 0.12, px(4), 0, ease.power2.out);
                  if (minor) sx = sy = tw(t, st, 0.3, 1.07, 1, ease.power2.out);
                } else {
                  // flick: tube lights with seeded double-flicks
                  opacity = 0.35;
                  if (rnd < 0.35)
                    opacity = t < st + F2 ? 0.35 : t < st + 2 * F2 ? 0.08 : 1;
                  else opacity = t < st + F2 ? 0.35 : 1;
                  if (minor)
                    sx = sy = tw(
                      t,
                      st + F2,
                      0.3,
                      b.emScale ?? 1.18,
                      1,
                      ease.power2.out,
                    );
                }
              }
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    margin: "0 0.14em",
                    opacity,
                    transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
                    transformOrigin: "50% 80%",
                    color,
                    fontWeight: weight,
                    textShadow: shadow,
                  }}
                >
                  {w.text.replace(/[.,?!]+$/g, "")}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const paradigm: Paradigm = { Component: Rail };
export default paradigm;
