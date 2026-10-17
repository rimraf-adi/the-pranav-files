// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, paradigmHolorail(). Re-implemented for Remotion.
import React from "react";
import { useVideoConfig } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Paradigm, ThemeCtx } from "../types";
import { holoGeom, kf, projectorCut } from "../util/calm-holo";

const clean = (s: string) => s.replace(/[.,?!]+$/g, "");

const HoloRail: React.FC<ThemeCtx> = ({ dna, lines, hero }) => {
  const { t, px, W, H } = useStage();
  const { durationInFrames, fps } = useVideoConfig();
  const DUR = durationInFrames / fps;
  const b = dna.body as Record<string, any>;
  const pal = dna.palette as Record<string, string>;
  const A = pal.accent;
  const MG = pal.magenta ?? "#ff5fd6";
  const { plateW, plateH, plateY } = holoGeom(W, H, px, b);
  const lineY = plateY + px(b.lineDy ?? 9);
  const shadowBase = `-1.5px 0 0 ${A}8c, 1.5px 0 0 ${MG}6b, 0 0 16px ${A}80, 0 2px 8px rgba(1,10,16,0.85)`;
  const shadowEm = `-1.5px 0 0 ${A}cc, 1.5px 0 0 ${MG}99, 0 0 26px ${pal.glowEm ?? "#A0F2FF"}d9, 0 2px 8px rgba(1,10,16,0.85)`;
  const font = `'${dna.fonts.body}', sans-serif`;

  // rail yields while the apex lands
  const yld = b.yield as { dim: number; pre?: number; post?: number } | undefined;
  let railOp = 1;
  if (hero && yld) {
    const d = tw(t, hero.start - (yld.pre ?? 0.18), 0.18, 1, yld.dim, ease.power1.in);
    const r = tw(t, hero.start + (yld.post ?? 0.37), 0.22, 0, 1, ease.power1.out);
    railOp = d + (1 - d) * r;
  }

  // plate: projector boot, breathe, end cut
  const pCut = DUR - 0.14;
  let plateOp = 0;
  let plateSy = 1;
  let plateSx = 1;
  if (t >= 0.1) {
    plateSy = tw(t, 0.1, 0.13, 0.03, 1, ease.expo.out);
    plateOp = t < 0.155 ? 1 : t < 0.195 ? 0.35 : 1;
    if (t >= 0.5) {
      const u = (t - 0.5) / 0.8;
      plateOp = 1 - 0.07 * (0.5 - 0.5 * Math.cos(Math.PI * u));
    }
  }
  const plateBright = t >= pCut;
  if (t >= pCut + 0.005) plateSy = tw(t, pCut + 0.005, 0.07, 1, 0.03, ease.power3.in);
  if (t >= pCut + 0.08) plateSx = tw(t, pCut + 0.08, 0.05, 1, 0.012, ease.power3.in);
  if (t >= pCut + 0.12) plateOp = 0;

  const cr = px(11);
  const corner = (extra: React.CSSProperties) => (
    <div style={{ position: "absolute", width: cr, height: cr, ...extra }} />
  );
  const bd = `${Math.max(2, px(2))}px solid ${A}cc`;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: railOp }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - plateW / 2,
          top: plateY - plateH / 2,
          width: plateW,
          height: plateH,
          opacity: plateOp,
          borderRadius: 3,
          background: "linear-gradient(180deg, rgba(4,22,33,0.62) 0%, rgba(6,30,44,0.72) 100%)",
          border: `1px solid ${A}52`,
          boxShadow: `0 0 26px rgba(60,170,210,0.20), inset 0 0 38px ${A}0f`,
          transform: `scale(${plateSx}, ${plateSy})`,
          filter: plateBright ? "brightness(2.2)" : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(180deg, ${A}00 0px, ${A}00 ${px(3)}px, ${A}12 ${px(3)}px, ${A}12 ${px(4)}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: px(14),
            top: px(7),
            fontFamily: `'${dna.fonts.tag ?? dna.fonts.body}', sans-serif`,
            fontSize: px(11),
            letterSpacing: "0.32em",
            color: `${A}99`,
          }}
        >
          {b.tag ?? "VOLUMETRIC FEED // CH-07"}
        </div>
        {corner({ left: -1, top: -1, borderLeft: bd, borderTop: bd })}
        {corner({ right: -1, top: -1, borderRight: bd, borderTop: bd })}
        {corner({ left: -1, bottom: -1, borderLeft: bd, borderBottom: bd })}
        {corner({ right: -1, bottom: -1, borderRight: bd, borderBottom: bd })}
      </div>
      {lines.map((L, i) => {
        const next = lines[i + 1];
        const out = next
          ? Math.max(L.end + 0.1, Math.min(L.end + 0.5, next.start - 0.02))
          : Math.min(L.end + 0.5, DUR - 0.05);
        const ex = next ? out - 0.15 : Math.min(out + 0.07, DUR - 0.18);
        const exit = Math.max(L.end + 0.08, ex);
        if (t < L.words[0].start - 0.03 || t > exit + 0.16) return null;
        const cut = projectorCut(t, exit, 0.07, 0.06);
        const dS = L.words[0].start + 0.08;
        const dD = Math.max(0.3, exit - dS - 0.04);
        const rotY = kf(t, dS, dD, [-3.5, 3.5, -2.5]);
        const maxW = plateW * 0.94;
        const chars = L.words.reduce((a, w) => a + clean(w.text).length + 0.45, 0);
        const fontPx = Math.min(px(b.fontPx ?? 38), maxW / Math.max(6, chars * 0.8));
        return (
          <div
            key={L.index}
            style={{
              position: "absolute",
              left: W / 2,
              top: lineY,
              whiteSpace: "nowrap",
              fontFamily: font,
              fontWeight: 500,
              fontSize: fontPx,
              lineHeight: 1.15,
              letterSpacing: b.letterSpacing ?? "0.02em",
              transform: `translate(-50%,-50%) perspective(700px) rotateY(${rotY}deg) scale(${cut.sx}, ${cut.sy})`,
              filter: cut.bright ? "brightness(2.2)" : undefined,
            }}
          >
            {L.words.map((w, wi) => {
              const st = w.start;
              const em = !!w.emphasis;
              if (t < st) return <span key={wi} style={{ display: "inline-block", opacity: 0, marginRight: wi < L.words.length - 1 ? "0.3em" : 0 }}>{clean(w.text)}</span>;
              const sweep = tw(t, st, 0.15, 100, -30, ease.power2.out);
              const clip = t < st + 0.16 ? `inset(-20% -10% ${sweep}% -10%)` : "none";
              const x = t >= st + 0.13 ? 0 : t >= st + 0.09 ? -2 : t >= st + 0.05 ? 2 : 0;
              let op = 1;
              let color = `${pal.body}ed`;
              let sh = shadowBase;
              if (em) {
                const d = Math.min(b.emphDelay ?? 0.34, exit - st - 0.183);
                if (d >= 0.083) {
                  if (t >= st + d && t < st + d + 0.083) op = 0.2;
                  if (t >= st + d + 0.083) {
                    color = pal.em ?? "#f4feff";
                    sh = shadowEm;
                    const sb = st + d + 0.51;
                    if (sb < exit - 0.05 && t >= sb) {
                      const k = tw(t, sb, Math.min(0.4, DUR - 0.04 - sb), 0, 1, ease.power1.in);
                      if (k >= 1) {
                        color = `${pal.body}ed`;
                        sh = shadowBase;
                      }
                    }
                  }
                }
              }
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: wi < L.words.length - 1 ? "0.3em" : 0,
                    opacity: op,
                    color,
                    textShadow: sh,
                    clipPath: clip,
                    transform: `translateX(${x * px(1)}px)`,
                  }}
                >
                  {clean(w.text)}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const paradigm: Paradigm = { Component: HoloRail };
export default paradigm;
