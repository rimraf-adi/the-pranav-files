// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmPoem() (+ setpiece assembly particles, which upstream emits inside the poem). Re-implemented for Remotion.
import React from "react";
import { useVideoConfig } from "remotion";
import { ease, mulberry32, tw } from "../motion";
import { useStage } from "../stage";
import type { Line, Paradigm, ThemeCtx } from "../types";

type Letter = { ch: string; sx: number; sy: number; delay: number; dx: number; dy: number; ddelay: number; last: boolean };
type Particle = { s: number; tx: number; ty: number; fx: number; fy: number; at: number; dur: number };
type WordD = { text: string; st: number; cls: "" | "em" | "big"; letters: Letter[]; particles: Particle[] };
type LineD = { key: number; slot: number; si: number; words: WordD[]; line: Line };

const clean = (s: string) => s.replace(/[.,?!]+$/g, "");

const Poem: React.FC<ThemeCtx> = ({ dna, lines, words, hero }) => {
  const { t, px, W } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const hp = ((dna.hero as any)?.params ?? {}) as Record<string, number>;
  const disperse = (dna.linkages ?? []).includes("disperse-on-last-word");
  const lastWordStart = words[words.length - 1]?.start ?? 0;
  const heroWord = hero ? words[hero.index] : undefined;

  const data = React.useMemo(() => {
    // stanzas: break after sentence-ending line, or after 3 lines (3 slots)
    const stanzas: Line[][] = [[]];
    lines.forEach((L, i) => {
      const cur = stanzas[stanzas.length - 1];
      cur.push(L);
      const last = L.words[L.words.length - 1].text;
      if (i < lines.length - 1 && (/[.!?]$/.test(last) || cur.length >= b.stanzaTops.length)) stanzas.push([]);
    });
    const rnd = mulberry32(b.seed ?? 777);
    const out: LineD[][] = stanzas.map((s, si) =>
      s.map((L, li) => ({
        key: L.index,
        slot: li,
        si,
        line: L,
        words: L.words.map((w) => {
          const cls: WordD["cls"] = w === heroWord ? "big" : w.emphasis ? "em" : "";
          const txt = clean(w.text);
          const spread = cls === "big" ? (hp.spread ?? 150) : 46;
          const letters: Letter[] = [...txt].map((ch, i) => ({
            ch,
            sx: (rnd() - 0.5) * 2 * spread,
            sy: (rnd() - 0.5) * 2 * spread * 0.7,
            delay: -0.04 + i * (cls === "big" ? 0.03 : 0.016),
            dx: 0,
            dy: 0,
            ddelay: 0,
            last: si === stanzas.length - 1,
          }));
          const particles: Particle[] = [];
          if (cls === "big") {
            for (let i = 0; i < (hp.particles ?? 22); i++) {
              const s = 2 + Math.round(rnd() * 3);
              const tx = rnd();
              const ty = rnd();
              const fx = (rnd() - 0.5) * 560;
              const fy = (rnd() - 0.5) * 380;
              particles.push({ s, tx, ty, fx, fy, dur: 0.5 + rnd() * 0.2, at: -0.05 + rnd() * 0.3 });
            }
          }
          return { text: txt, st: w.start, cls, letters, particles };
        }),
      })),
    );
    // dispersal params for the final stanza's letters (same draw order as upstream)
    out[out.length - 1]?.forEach((L) =>
      L.words.forEach((w) =>
        w.letters.forEach((l) => {
          l.dx = (rnd() - 0.5) * 260;
          l.dy = (rnd() - 0.5) * 200 - 40;
          l.ddelay = rnd() * 0.05;
        }),
      ),
    );
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, words, heroWord, b.seed]);

  const left = W * 0.08;
  const NZ = Math.min(lastWordStart + 0.06, DUR - 0.58);
  const DDUR = Math.min(0.42, Math.max(0.24, DUR - NZ - 0.14));
  const baseFont = px(b.fontPx ?? 58);
  const scrimOp = b.scrim
    ? tw(t, 0.15, 0.6, 0, 1, ease.power1.out) * tw(t, lastWordStart + 0.15, 0.4, 1, 0, ease.power1.in)
    : 0;
  const familyStyle = `'${dna.fonts.body}', serif`;

  return (
    <>
      {b.scrim ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scrimOp,
            background: `linear-gradient(180deg, rgba(4,8,16,${b.scrim.opacity}) 0%, rgba(4,8,16,${b.scrim.opacity * 0.6}) 22%, rgba(4,8,16,0) 40%)`,
          }}
        />
      ) : null}
      {data.map((stanza, si) => {
        const nextIn = data[si + 1]?.[0].words[0].st;
        return stanza.map((L, k) => {
          const first = L.words[0].st;
          if (t < first - 0.1) return null;
          if (nextIn !== undefined && t > nextIn + 0.1) return null;
          const exitAt = nextIn !== undefined ? nextIn - 0.62 + k * 0.12 : Infinity;
          // fit the whole line (em/big words are larger) to the column
          const mult = (c: string) => (c === "big" ? (b.bigScale ?? 2) : c === "em" ? (b.emScale ?? 1.38) : 1);
          const estW = L.words.reduce(
            (a, w) => a + w.text.length * 0.42 * baseFont * mult(w.cls) + 0.28 * baseFont,
            0,
          );
          const f = Math.min(1, (W * 0.9 - left) / Math.max(1, estW));
          const top = px(b.stanzaTops[Math.min(L.slot, b.stanzaTops.length - 1)] ?? 110) + L.si * px(16);
          return (
            <div
              key={L.key}
              style={{
                position: "absolute",
                left,
                top,
                whiteSpace: "nowrap",
                fontFamily: familyStyle,
                fontWeight: 600,
                fontSize: baseFont * f,
                lineHeight: 1,
                color: dna.palette.body,
                textShadow: "0 0 14px rgba(255,244,214,0.5), 0 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              {L.words.map((w, wi) => {
                const big = w.cls === "big";
                const wordSize = baseFont * f * mult(w.cls);
                const wrapped = (
                  <span
                    key={wi}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginLeft: wi > 0 ? "0.28em" : 0,
                      fontSize: w.cls ? wordSize : undefined,
                      fontStyle: w.cls ? "italic" : undefined,
                      fontWeight: w.cls ? 700 : undefined,
                    }}
                  >
                    {w.letters.map((l, i) => {
                      const dur = big ? 0.7 : 0.5;
                      const u0 = w.st + l.delay;
                      const p = tw(t, u0, dur, 0, 1, ease.power2.out);
                      let x = l.sx * (1 - p) * px(1);
                      let y = l.sy * (1 - p) * px(1);
                      let op = p;
                      let blur = 6 * (1 - p) * px(1);
                      let shadow: string | undefined;
                      // exit: earlier stanzas drift out
                      if (nextIn !== undefined) {
                        const e = tw(t, exitAt + i * 0.008, 0.5, 0, 1, ease.power1.in);
                        y += -10 * e;
                        op *= 1 - e;
                        blur += 4 * e;
                      }
                      // final stanza disperses on the last word
                      if (disperse && l.last && t >= NZ + l.ddelay) {
                        const ts = NZ + l.ddelay;
                        const p0 = tw(ts, u0, dur, 0, 1, ease.power2.out);
                        const d = tw(t, ts, DDUR, 0, 1, ease.power2.in);
                        x = l.sx * (1 - p0) * px(1) * (1 - d) + l.dx * px(1) * d;
                        y = l.sy * (1 - p0) * px(1) * (1 - d) + l.dy * px(1) * d;
                        op = p0 * (1 - d);
                        blur = (6 * (1 - p0) * (1 - d) + 7 * d) * px(1);
                      }
                      if (big) {
                        const g = tw(t, w.st + 0.55, 0.8, 0, 1, ease.power1.out);
                        const r = 30 + (18 - 30) * g;
                        const a = 0.9 + (0.55 - 0.9) * g;
                        shadow = `0 0 ${r}px rgba(255,244,214,${a}), 0 2px 12px rgba(0,0,0,0.5)`;
                      }
                      return (
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            opacity: op,
                            transform: `translate(${x}px, ${y}px)`,
                            filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                            textShadow: shadow,
                          }}
                        >
                          {l.ch}
                        </span>
                      );
                    })}
                    {big
                      ? w.particles.map((pt, pi) => {
                          const ts = w.st + pt.at;
                          if (t < ts || t > ts + pt.dur) return null;
                          const u = ease.power2.in((t - ts) / pt.dur);
                          const tx = pt.tx * w.text.length * wordSize * 0.42;
                          const ty = pt.ty * wordSize * 0.8;
                          const fx = tx + pt.fx * (px(1));
                          const fy = ty + pt.fy * (px(1));
                          const mid = u < 0.5 ? u * 2 : 1;
                          const px1 = u < 0.5 ? (tx - fx) * 0.6 * mid : (tx - fx) * (0.6 + 0.4 * (u - 0.5) * 2);
                          const py1 = u < 0.5 ? (ty - fy) * 0.6 * mid : (ty - fy) * (0.6 + 0.4 * (u - 0.5) * 2);
                          const o = u < 0.5 ? 0.95 * (u * 2) : 0.95 * (1 - (u - 0.5) * 2);
                          const sz = pt.s * px(1);
                          return (
                            <div
                              key={pi}
                              style={{
                                position: "absolute",
                                left: fx,
                                top: fy,
                                width: sz,
                                height: sz,
                                borderRadius: "50%",
                                background: "#fff7e0",
                                opacity: o,
                                transform: `translate(${px1}px, ${py1}px)`,
                                boxShadow: "0 0 8px rgba(255,247,224,0.9)",
                              }}
                            />
                          );
                        })
                      : null}
                  </span>
                );
                return wrapped;
              })}
            </div>
          );
        });
      })}
    </>
  );
};

const paradigm: Paradigm = { Component: Poem, heroInline: true };
export default paradigm;
