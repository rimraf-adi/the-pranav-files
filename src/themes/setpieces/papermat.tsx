// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpiecePapermat() (kraft mat slap, torn letter chips dropping with stepped gravity, 8fps wobble, table-bump scatter). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import { useStage } from "../stage";
import { stepQ, tornPoly, useHeroWin } from "../util/craft-shared";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const Papermat: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H, s } = useStage();
  const { I, E } = useHeroWin(dna, hero, 2.0);
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const pal = dna.palette;
  const STEP = p.step ?? 0.09;
  const text = hero.text.toUpperCase();
  const chars = [...text];
  const N = chars.length;
  // fit portrait: chips must span <= 86% of the width
  const fpx = Math.min(px((dna.hero as any)?.fontPx ?? 130) * 1.0, (W * 0.82) / Math.max(3, N * 0.68));
  const tileW = fpx * 0.62;
  const tileH = fpx * 1.04;
  const pitch = tileW * 1.08;
  const matW = N * pitch + fpx * 0.9;
  const matH = fpx * 1.95;
  const cx = W / 2;
  const cy = H * 0.3;
  const matT = Math.max(0.02, I - 0.212);
  const SCAT = Math.max(I + (N - 1) * STEP + 0.5, E - 0.45);
  const VIG = p.vig ?? 0.3;
  const seed = p.seed ?? 151515;

  const geo = React.useMemo(() => {
    const prnd = mulberry32(seed);
    const mat = {
      a: tornPoly(matW, matH, 12 * s, 12, 4, prnd),
      b: tornPoly(matW - 14 * s, matH - 14 * s, 10 * s, 12, 4, prnd),
    };
    const ch = chars.map(() => ({
      dx: (prnd() - 0.5) * 8 * s,
      jy: (prnd() - 0.5) * 8 * s,
      r0: (prnd() - 0.5) * 6,
      a: tornPoly(tileW, tileH, 8 * s, 6, 7, prnd),
      b: tornPoly(tileW - 10 * s, tileH - 10 * s, 6 * s, 6, 7, prnd),
      sx: (250 + prnd() * 200) * s,
      sy: H * 0.6 + prnd() * 110 * s,
      sr: 28 + prnd() * 24,
    }));
    return { mat, ch };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, W, H, seed]);

  if (t < matT - 0.05 || t > SCAT + 1.0) return null;

  // mat: steps(2) slap, then table jitter; swept off at the end
  const dropM = -(cy + matH / 2 + 50);
  let my = 0;
  let mrot = 0;
  let msx = 1;
  let msy = 1;
  const slap = stepQ((t - matT) / 0.14, 2);
  if (t < matT + 0.14) {
    my = dropM + (6 * s - dropM) * slap;
    mrot = -5 + 3.8 * slap;
  } else if (t < matT + 0.223) {
    my = 6 * s;
    mrot = -1.2;
    msx = 1.02;
    msy = 0.97;
  } else {
    my = 0;
    mrot = -1.2;
    if (t > matT + 0.54 && t < SCAT - 0.08) {
      const k = Math.floor((t - matT - 0.54) / 0.25);
      my = (mulberry32(seed + k * 3)() - 0.5) * 1.6 * s;
      mrot = -1.2 + (mulberry32(seed + k * 5)() - 0.5) * 0.7;
    }
  }
  let mx = 0;
  const sweepT = SCAT + 0.21;
  if (t > sweepT) {
    const q = stepQ((t - sweepT) / 0.26, 3);
    mx = 430 * s * q;
    my += (H - 40 - cy) * q;
    mrot += 14 * q;
  }
  const shadOp = t >= matT + 0.14 && t < SCAT + 0.25 ? 0.32 : 0;
  const vig =
    tw(t, matT, 0.24, 0, VIG, ease.power2.in) *
    (t > SCAT - 0.11 ? tw(t, SCAT - 0.11, 0.35, 1, 0, ease.power1.in) : 1);
  const bump = t > SCAT - 0.041 && t < SCAT + 0.001 ? 4 * s : 0;
  const loom = tw(t, I + 0.83, 2.2, 1, 1.016, ease.sine.inOut);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: vig,
          background: `radial-gradient(120% 105% at 50% ${((cy / H) * 100).toFixed(0)}%, rgba(0,0,0,0) 38%, rgba(26,16,5,0.85) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 0,
          height: 0,
          transform: `translateY(${bump}px) scale(${t < SCAT ? loom : 1})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -matW / 2 + 2,
            top: matH / 2 - 18 * s,
            width: matW + 6,
            height: 30 * s,
            opacity: shadOp,
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(25,15,5,0.55) 0%, rgba(25,15,5,0) 72%)",
            filter: "blur(5px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -matW / 2,
            top: -matH / 2,
            width: matW,
            height: matH,
            transformOrigin: "50% 100%",
            transform: `translate(${mx}px, ${my}px) rotate(${mrot}deg) scale(${msx}, ${msy})`,
            opacity: t < matT ? 0 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(178deg,#bd9d6c 0%,#b08f5d 55%,#a17f4c 100%)",
              clipPath: geo.mat.a,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 7 * s,
              background: "rgba(140,110,62,0.35)",
              clipPath: geo.mat.b,
            }}
          />
        </div>
        {chars.map((ch, i) => {
          if (ch === " ") return null;
          const g = geo.ch[i];
          const x0 = (i - (N - 1) / 2) * pitch + g.dx;
          const C = I + i * STEP;
          const dropL = -(cy + tileH / 2 + 100);
          if (t < C - 0.21) return null;
          let y = 0;
          let rot = g.r0;
          let sx = 1;
          let sy = 1;
          let ox = 0;
          let shadOpC = 0;
          let shadSx = 1;
          if (t < C) {
            const q = stepQ((t - (C - 0.21)) / 0.21, 3);
            y = dropL + (8 * s - dropL) * q;
            rot = g.r0 - 8 + 8 * q;
            shadOpC = 0.16;
            shadSx = 1.35;
          } else {
            shadOpC = 0.5;
            if (t < C + 0.0833) {
              y = 8 * s;
              sx = 1.07;
              sy = 0.9;
            } else if (t < C + 0.1667) {
              y = -4 * s;
              sx = 0.97;
              sy = 1.05;
            } else if (t < C + 0.25) {
              y = 2 * s;
              sx = 1.01;
              sy = 0.98;
            }
            if (t >= C + 0.3) shadOpC = tw(t, C + 0.3, 0.3, 0.5, 0.34, ease.power1.out);
            if (t >= C + 0.5) {
              const k = Math.floor((t - C - 0.5) / 0.125);
              const rr = mulberry32(seed + i * 131 + k * 17);
              rot = g.r0 + (rr() - 0.5) * 1.4;
              ox = (rr() - 0.5) * 1.4 * s;
              y = (rr() - 0.5) * 1.4 * s;
            }
          }
          const S = SCAT + i * 0.045;
          if (t >= S) {
            const q = stepQ((t - S) / 0.3, 4);
            ox += g.sx * q;
            y += (g.sy - cy) * q;
            rot += g.sr * q;
            if (t > S + 0.06) shadOpC = 0;
          }
          if (t > S + 0.35) return null;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: x0 - (tileW * 1.08) / 2,
                  top: tileH / 2 + 3 * s + g.jy * 0.3,
                  width: tileW * 1.08,
                  height: 24 * s,
                  opacity: shadOpC,
                  transform: `scaleX(${shadSx})`,
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(28,17,6,0.6) 0%, rgba(28,17,6,0) 70%)",
                  filter: "blur(4px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x0 - tileW / 2,
                  top: -tileH / 2 + g.jy,
                  width: tileW,
                  height: tileH,
                  transformOrigin: "50% 100%",
                  transform: `translate(${ox}px, ${y}px) rotate(${rot}deg) scale(${sx}, ${sy})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: pal.paper ?? "#f8f0dd",
                    clipPath: g.a,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 5 * s,
                    top: 5 * s,
                    width: tileW - 10 * s,
                    height: tileH - 10 * s,
                    background: pal.paper2 ?? "#efe3c6",
                    clipPath: g.b,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: `'${dna.fonts.hero}', sans-serif`,
                    fontSize: fpx,
                    lineHeight: 1,
                    color: pal.ink ?? "#2b241b",
                  }}
                >
                  {ch}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Papermat };
export default setpiece;
