// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, setpieceDrawon(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";
import { StrokeWord, layoutStrokes, penAt } from "../util/strokes-svg";
import { HERO_Y, heroDisplay, heroSpan, wob } from "../util/strokes-hero";

const Drawon: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const p = ((dna.hero as any)?.params ?? {}) as Record<string, number | boolean>;
  const { I, E } = heroSpan(dna, hero);
  if (t < I - 0.7 || t > E + 0.3) return null;
  const WIN = (p.window as number) ?? 0.78;
  const DRAWN = I + WIN;
  const acc = dna.palette.accent as string;
  const tubeW = px((p.tubeWidth as number) ?? 7);
  const haloW = px((p.haloWidth as number) ?? 22);
  const tw0 = Math.min(px((p.targetWidth as number) ?? 640), W * 0.86);
  const layout = layoutStrokes(heroDisplay(hero).toLowerCase(), tw0, dna.fonts.strokeFont);
  const prog = Math.min(1, Math.max(0, (t - I) / WIN));
  const [pxn, pyn] = penAt(layout, prog);
  const fadeOut = tw(t, E, 0.25, 1, 0, ease.power1.in);
  const tube = tw(t, I - 0.6, 0.35, 0, 1, ease.none);
  const spill = tw(t, I, WIN + 0.2, 0, (p.spill as number) ?? 0.38, ease.power1.in);
  let halo = 0.9;
  let core = 1;
  if (p.hum && t > DRAWN + 0.08) {
    const k = t - DRAWN - 0.08;
    halo = 0.78 + 0.06 * Math.sin(2 * Math.PI * 9 * k) + 0.05 * Math.sin(2 * Math.PI * 13 * k + 1.1);
    const dip = E + ((p.buzzDipAt as number) ?? -0.18);
    if (t >= dip && t < dip + 1 / 30) core = 0.45;
  }
  const penOp = t < I - 0.01 ? 0 : t < DRAWN ? 1 : tw(t, DRAWN, 0.12, 1, 0, ease.power2.in);
  const penR = px(6) * (t < DRAWN ? 1 : tw(t, DRAWN, 0.12, 1, 2.2, ease.power2.in));
  const cx = W / 2;
  const cy = H * HERO_Y;
  const pad = 60;
  void wob;
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          left: cx - px(410),
          top: cy - px(220),
          width: px(820),
          height: px(440),
          borderRadius: "50%",
          opacity: spill,
          background: `radial-gradient(50% 50% at 50% 50%, ${acc}57 0%, ${acc}00 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - (layout.width + pad * 2) / 2,
          top: cy - (layout.height + pad * 2) / 2,
          transform: `rotate(${(p.rotate as number) ?? -3}deg)`,
        }}
      >
        {/* dim tube ghost */}
        <svg
          width={layout.width + pad * 2}
          height={layout.height + pad * 2}
          viewBox={`${-pad} ${-pad} ${layout.width + pad * 2} ${layout.height + pad * 2}`}
          style={{ position: "absolute", left: 0, top: 0, opacity: tube, overflow: "visible" }}
        >
          {layout.strokes.map((s, i) => (
            <path key={i} d={s.d} fill="none" stroke="rgba(255,235,245,0.16)" strokeWidth={tubeW + 1} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
        <StrokeWord
          layout={layout}
          progress={prog}
          style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 ${px(5)}px #fff) drop-shadow(0 0 ${px(16)}px ${acc})`, opacity: core }}
          layers={[{ width: tubeW, color: "#fff" }]}
        />
        <StrokeWord
          layout={layout}
          progress={prog}
          style={{ position: "absolute", left: 0, top: 0 }}
          layers={[{ width: haloW, color: acc, opacity: halo, blur: px(10) }]}
        />
        <svg
          width={layout.width + pad * 2}
          height={layout.height + pad * 2}
          viewBox={`${-pad} ${-pad} ${layout.width + pad * 2} ${layout.height + pad * 2}`}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: penOp, filter: `drop-shadow(0 0 ${px(8)}px #fff) drop-shadow(0 0 ${px(22)}px ${acc})` }}
        >
          <circle cx={pxn} cy={pyn} r={penR} fill="#fff" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Drawon };
export default setpiece;
