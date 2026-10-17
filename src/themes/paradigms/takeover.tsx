// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmTakeover() incl. the inline "colorflip" apex card. Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";

const Takeover: React.FC<ThemeCtx> = ({ dna, lines, words, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const hp = ((dna.hero as any)?.params ?? {}) as Record<string, any>;
  const pal = dna.palette;
  const heroWord = hero ? words[hero.index] : undefined;

  const cards = lines.map((L, i) => {
    const txt = L.words
      .map((w) => w.text.replace(/[.,?!]+$/g, ""))
      .join(" ")
      .toUpperCase();
    const isHero = !!heroWord && L.words.includes(heroWord);
    const hot = isHero || L.words.some((w) => w.emphasis);
    const target = isHero
      ? px((dna.hero as any)?.fontPx ?? 196)
      : px(hot ? b.sizes.minor : b.sizes.content);
    // portrait: wrap into balanced rows until the type is near its target size
    const ws = txt.split(" ");
    let rows: string[] = [txt];
    let size = Math.min(target, (W * 0.88) / (0.5 * Math.max(3, txt.length)));
    for (let r = 2; r <= 3 && size < target * 0.8 && ws.length >= r; r++) {
      const per = Math.ceil(txt.length / r);
      const rr: string[] = [];
      let cur = "";
      for (const w of ws) {
        if (cur && (cur + " " + w).length > per && rr.length < r - 1) {
          rr.push(cur);
          cur = w;
        } else cur = cur ? cur + " " + w : w;
      }
      rr.push(cur);
      rows = rr;
      size = Math.min(target, (W * 0.88) / (0.5 * Math.max(3, ...rr.map((x) => x.length))));
    }
    return {
      txt: rows.join("\n"),
      inT: L.start,
      outT: Math.max(L.start + 0.1, Math.min(L.end + 0.4, (lines[i + 1]?.start ?? Infinity) - 0.02)),
      size,
      hot,
      isHero,
      creep: false,
      last: i === lines.length - 1,
    };
  });
  for (let i = 0; i + 1 < cards.length; i++) {
    const gap = cards[i + 1].inT - lines[i].end;
    if (gap > 0.5) {
      cards[i].creep = true;
      cards[i].outT = cards[i + 1].inT - Math.min(0.6, gap * 0.45);
    }
  }

  // plate dim: base, kicked on the hero card
  let dim = tw(t, 0.05, 0.25, 0, b.baseDim, ease.power2.in);
  const hc = cards.find((c) => c.isHero);
  if (hc && t >= hc.inT) {
    const kick = hp.dimKick ?? b.baseDim;
    dim = tw(t, hc.inT + 0.12, 0.5, kick, b.baseDim, ease.power2.out);
  }
  dim *= tw(t, DUR - 0.27, 0.3, 1, 0, ease.power1.in);

  const flash = hc ? tw(t, hc.inT - 0.04, 0.12, (hp.flash ?? 0) * 0.5, 0, ease.power2.out) * (t >= hc.inT - 0.04 ? 1 : 0) : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#05070c", opacity: dim }} />
      {cards.map((c, ci) => {
        if (t < c.inT - 0.05 || t > c.outT + 0.1) return null;
        if (c.isHero ? t < c.inT - 0.04 : t < c.inT) return null;
        const [ax, ay] = b.anchors[ci % b.anchors.length] as number[];
        const x = W / 2 + (ax - 640) * (W / 1280);
        const y = H * 0.27 + (ay - 360) * px(1);
        const rot = (ci % 2 === 0 ? 1 : -1) * (0.8 + (ci % 3) * 0.7);
        let sx = 1;
        let sy = 1;
        let filter: string | undefined;
        let op = 1;
        const dt = t - c.inT;
        if (c.isHero) {
          if (t < c.inT + 0.07) {
            const k = tw(t, c.inT - 0.04, 0.11, hp.crushFrom ?? 2.6, 1, ease.power4.in);
            sx = sy = k;
            const bl = tw(t, c.inT - 0.04, 0.11, 10, 0, ease.power4.in);
            const br = tw(t, c.inT - 0.04, 0.11, 2.6, 1, ease.power4.in);
            filter = `blur(${bl}px) brightness(${br})`;
          } else {
            const k = tw(t, c.inT + 0.15, 0.45, 0, 1, ease.elastic.out(1.05, 0.36));
            sx = 1.1 + (1 - 1.1) * k;
            sy = 0.92 + (1 - 0.92) * k;
            const hold = tw(t, c.inT + 0.25, Math.max(0.2, c.outT - c.inT - 0.3), 1, 1.05, ease.power1.inOut);
            sx *= hold;
            sy *= hold;
          }
        } else if (c.hot) {
          sx = sy = tw(t, c.inT + 0.02, 0.22, b.hotSnap, 1, ease.back.out(1.8));
        } else {
          sx = sy = tw(
            t,
            c.inT + 0.01,
            Math.max(0.08, c.outT - c.inT - 0.02),
            0.94,
            c.creep ? b.creepScale : 1,
            c.creep ? ease.power1.in : ease.power2.out,
          );
        }
        if (c.last && hp.dissolveLast) {
          const k = tw(t, c.outT - 0.23, 0.32, 0, 1, ease.power2.in);
          op = 1 - k;
          filter = `${filter ?? ""} blur(${9 * k}px)`.trim();
        } else if (dt > c.outT - c.inT) op = 0;
        return (
          <div
            key={ci}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: op,
              whiteSpace: "pre",
              textAlign: "center",
              fontFamily: `'${dna.fonts.body}', sans-serif`,
              fontSize: c.size,
              lineHeight: 1,
              letterSpacing: "0.015em",
              color: c.hot ? pal.accent : pal.body,
              textShadow: c.hot
                ? `0 0 34px ${pal.accent}73, 0 4px 26px rgba(0,0,0,0.65)`
                : "0 4px 26px rgba(0,0,0,0.65)",
              transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sx}, ${sy})`,
              filter,
            }}
          >
            {c.txt}
          </div>
        );
      })}
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} /> : null}
    </AbsoluteFill>
  );
};

const paradigm: Paradigm = { Component: Takeover, heroInline: true };
export default paradigm;
