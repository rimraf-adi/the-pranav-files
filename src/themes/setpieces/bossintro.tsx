// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceBossintro() (Behind: dim, edge glow, WARNING, pixel-block assembly, strobe word; Front: letterbox bars + HI-SCORE odometer). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import type { Hero, Setpiece, ThemeCtx } from "../types";
import { F24, ff, fitPx, heroExit, heroXY, useRetro } from "../util/retro-common";

type P = ThemeCtx & { hero: Hero };

const geom = (dna: P["dna"], hero: Hero, W: number, H: number, s: number, dur: number) => {
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, any>;
  const fontPx = fitPx(hero.text.length, (dna.hero as any)?.fontPx * s || 84 * s, 1.0, W * 0.9);
  const { x, y } = heroXY(dna, W, H);
  const I = hero.start;
  const FLASH = I + (p.flashDelay ?? 0.14);
  const OUT = heroExit(hero, p.hold ?? 1.24, dur, dna) + 0.2;
  return { p, fontPx, x, y, I, FLASH, OUT };
};

const Behind: React.FC<P> = ({ dna, hero, words }) => {
  const { t, s, px, W, H, dur } = useRetro();
  const { p, fontPx, x, y, I, FLASH, OUT } = geom(dna, hero, W, H, s, dur);
  const CY = dna.palette.accent;
  const MG = dna.palette.magenta ?? "#FF2E88";
  const YL = dna.palette.yellow ?? "#FFE600";
  const ROWS = p.rows ?? 4;
  const CW = Math.round(fontPx * 0.7);
  const CH = Math.round(fontPx * 0.5);
  const COLS = Math.ceil((hero.text.length * fontPx + px(100)) / CW);
  const X0 = Math.round(x - (COLS * CW) / 2);
  const Y0 = Math.round(y - (ROWS * CH) / 2);

  const blocks = React.useMemo(() => {
    const r = mulberry32(p.seed ?? 13013);
    const out: any[] = [];
    for (let c = 0; c < COLS; c++)
      for (let ro = 0; ro < ROWS; ro++) {
        const sz = 8 + Math.round(r() * 6);
        const jx = Math.round((r() - 0.5) * 6);
        const jy = Math.round((r() - 0.5) * 6);
        const pc = r();
        const col = pc < 0.4 ? CY : pc < 0.78 ? MG : pc < 0.93 ? YL : "#fff";
        const start = Math.min(I - 0.15 + c * 0.01 + r() * 0.04, FLASH - 0.1);
        let d = 0.12 + r() * 0.06;
        if (start + d > FLASH - 0.02) d = FLASH - 0.02 - start;
        const fall = 240 + r() * 260;
        const t1 = FLASH + 0.11 + r() * 0.45;
        const t2 = FLASH + 0.61 + r() * 0.4;
        const tE = OUT + r() * 0.15;
        const eFall = 220 + r() * 140;
        const eDur = 0.2 + r() * 0.1;
        out.push({ c, ro, sz, jx, jy, col, start, d, fall, t1, t2, tE, eFall, eDur });
      }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero.text, I, FLASH, OUT, COLS, ROWS]);

  // scene reaction pulses (last emphasis before the boss, magenta on the final word)
  const minorsBefore = words.filter((w) => w.emphasis && w.start < I - 0.3);
  const pulseT = minorsBefore.length ? minorsBefore[minorsBefore.length - 1].start : null;
  const last = words[words.length - 1];
  const endPulse = last && last.start + 0.384 < dur - 0.02 && last.start > OUT + 0.4 ? last.start : null;

  let edgeC = t >= 0.05 ? 0.28 : 0;
  if (pulseT != null && t >= pulseT && t < pulseT + 0.084) edgeC = 0.62;
  if (t >= FLASH) edgeC = t < FLASH + 0.08 ? 0.8 : tw(t, FLASH + 0.08, 0.6, 0.8, 0.34, ease.power2.out);
  let edgeM = 0;
  if (t >= FLASH + 0.084) edgeM = tw(t, FLASH + 0.126, 0.25, 0.5, 0, ease.power1.out);
  if (endPulse != null && t >= endPulse) edgeM = Math.max(edgeM, t < endPulse + 0.084 ? 0.55 : tw(t, endPulse + 0.084, 0.3, 0.55, 0, ease.power1.out));

  const dimOp = tw(t, I - 0.15, 0.12, 0, dna.plate.dim ?? 0.58, ease.power2.out) * tw(t, OUT + 0.1, 0.35, 1, 0, ease.power1.inOut);

  const warn = (t >= I - 0.135 && t < I - 0.05) || (t >= I + 0.035 && t < I + 0.12);

  // word
  let sx = 1;
  let sy = 1;
  if (t >= FLASH) {
    if (t < FLASH + 0.1) sx = sy = tw(t, FLASH, 0.1, 1.15, 1, ease.steps(3));
    else if (t < FLASH + 0.142) {
      sx = 1.07;
      sy = 0.92;
    } else {
      const k = tw(t, FLASH + 0.142, 0.3, 0, 1, ease.elastic.out(1, 0.38));
      sx = 1.07 + (1 - 1.07) * k;
      sy = 0.92 + (1 - 0.92) * k;
    }
    if (t >= FLASH + 0.61) {
      const q = Math.min(1, (t - (FLASH + 0.61)) / 0.4);
      const tri = t < FLASH + 1.01 ? q : Math.max(0, 1 - (t - (FLASH + 1.01)) / 0.4);
      const br = 1 + 0.016 * ease.sine.inOut(Math.min(1, tri));
      sx *= br;
      sy *= br;
    }
  }
  const wordOn = t >= FLASH && t < OUT + 0.17;
  const mainColor =
    t < FLASH + 0.042 ? "#fff" : t < FLASH + 0.084 ? CY : t < FLASH + 0.126 ? MG : "#fff";
  const HALO = `0 ${px(6)}px 0 rgba(0,0,0,0.6), 0 0 ${px(16)}px rgba(0,0,0,0.9), 0 0 ${px(5)}px rgba(0,0,0,0.85)`;
  let glow = "";
  for (const [dt, gc] of [[0.2, CY], [0.5, MG], [0.8, CY]] as const)
    if (t >= FLASH + dt && FLASH + dt < OUT) glow = `0 0 ${px(22)}px ${gc}d9, `;
  const wf = `${ff(dna.fonts.hero)}, monospace`;
  const lettersOut = (i: number) => t >= (i % 2 === 0 ? OUT : OUT + 0.083);
  const ghostOp = t >= FLASH && t < OUT + 0.042 ? 0.85 : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${px(130)}px ${CY}4d`, opacity: edgeC }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${px(130)}px ${MG}52`, opacity: edgeM }} />
      <AbsoluteFill
        style={{
          opacity: dimOp,
          background:
            "linear-gradient(180deg, rgba(2,3,12,0.66) 0%, rgba(2,3,12,0.40) 55%, rgba(2,3,12,0.30) 100%)",
        }}
      />
      {blocks.map((b, k) => {
        if (t < b.start || t > b.tE + b.eDur + 0.05) return null;
        const land = b.start + b.d;
        const by = tw(t, b.start, b.d, -b.fall * s, 0, ease.steps(3));
        const ey = tw(t, b.tE, b.eDur, 0, b.eFall * s, ease.steps(3));
        let op = t < land ? 0.9 : 0.85;
        let col = b.col;
        if (t >= land && t < land + F24) {
          col = "#fff";
          op = 0.9;
        }
        if (t >= b.t1 && t < b.t1 + 0.083 && b.t1 + 0.083 < OUT) op = 0.5;
        if (t >= b.t2 && t < b.t2 + 0.083 && b.t2 + 0.083 < OUT) op = 0.55;
        op *= tw(t, b.tE, b.eDur, 1, 0, ease.steps(3));
        const sz = b.sz * s;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              width: sz,
              height: sz,
              left: X0 + b.c * CW + (CW - sz) / 2 + b.jx * s,
              top: Y0 + b.ro * CH + (CH - sz) / 2 + b.jy * s,
              background: col,
              opacity: op,
              transform: `translateY(${by + ey}px)`,
            }}
          />
        );
      })}
      {warn ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y - fontPx * 1.43,
            transform: "translate(-50%,-50%)",
            fontFamily: `${ff(dna.fonts.tag)}, monospace`,
            fontSize: Math.min(px(26), (W * 0.9) / (((p.tag ?? "WARNING") as string).length * 1.4)),
            letterSpacing: "0.4em",
            color: MG,
            whiteSpace: "nowrap",
            textShadow: "0 0 14px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9), 0 4px 0 rgba(0,0,0,0.8)",
          }}
        >
          {p.tag ?? "WARNING"}
        </div>
      ) : null}
      {wordOn ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `translate(-50%,-50%) scale(${sx}, ${sy})`,
            fontFamily: wf,
            fontSize: fontPx,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {[
            { c: CY, dx: -4 * s },
            { c: MG, dx: 4 * s },
          ].map((g, gi) => (
            <div
              key={gi}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translateX(${g.dx}px)`,
                color: g.c,
                opacity: ghostOp,
              }}
            >
              {hero.text.toUpperCase()}
            </div>
          ))}
          <div style={{ position: "relative", color: mainColor, textShadow: glow + HALO }}>
            {hero.text
              .toUpperCase()
              .split("")
              .map((ch, i) => (
                <span key={i} style={{ display: "inline-block", opacity: lettersOut(i) ? 0 : 1 }}>
                  {ch === " " ? " " : ch}
                </span>
              ))}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Front: React.FC<P> = ({ dna, hero }) => {
  const { t, s, px, W, H, dur } = useRetro();
  const { p, I, FLASH, OUT } = geom(dna, hero, W, H, s, dur);
  const lb = px(p.letterbox ?? 44);
  const overshoot = t >= I - 0.02 && t < I + 0.022 ? px(4) : 0;
  const barH = t < OUT + 0.13
    ? tw(t, I - 0.15, 0.12, 0, lb, ease.steps(3)) + (t >= I - 0.02 ? overshoot : 0)
    : tw(t, OUT + 0.13, 0.15, lb, 0, ease.steps(3));
  const score = React.useMemo(() => {
    const r = mulberry32((p.seed ?? 13013) + 7);
    const arr: [number, number][] = [];
    let sc = 1370;
    for (let tt = FLASH + 0.09; tt < OUT - 0.03; tt += 0.066) {
      sc += 4000 + Math.round(r() * 5500);
      arr.push([tt, sc]);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FLASH, OUT]);
  const cur = [...score].reverse().find(([tt]) => tt <= t);
  const hiOn = t >= FLASH + 0.03 && t < OUT + 0.122;
  const hiScale = tw(t, FLASH + 0.03, 0.1, 0, 1, ease.steps(2));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: barH, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: barH, background: "#000" }} />
      {hiOn ? (
        <div
          style={{
            position: "absolute",
            right: px(36),
            top: H * 0.085,
            transform: `scale(${hiScale})`,
            transformOrigin: "100% 50%",
            whiteSpace: "nowrap",
            fontFamily: `${ff(dna.fonts.tag)}, monospace`,
            fontSize: px(18),
            color: t >= OUT + 0.08 ? "#fff" : undefined,
            textShadow: "0 3px 0 rgba(0,0,0,0.75), 0 0 10px rgba(0,0,0,0.6)",
          }}
        >
          <span style={{ color: dna.palette.accent, marginRight: "0.5em" }}>HI-SCORE</span>
          <span style={{ color: dna.palette.yellow ?? "#FFE600" }}>
            {String(cur ? cur[1] : 1370).padStart(7, "0")}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind, Front };
export default setpiece;
