// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// setpieceSettle(). Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease, tw } from "../motion";
import { useStage } from "../stage";
import type { Hero, Setpiece, ThemeCtx } from "../types";

const Settle: React.FC<ThemeCtx & { hero: Hero }> = ({ dna, hero }) => {
  const { t, px, W, H } = useStage();
  const I = hero.start;
  const E =
    (dna.hero as any)?.exitAt ?? I + Math.max(1.4, hero.end - hero.start + 1.0);
  if (t < I - 0.4 || t > E + 0.5) return null;
  const fontPx = px((dna.hero as any)?.fontPx ?? 150);
  const text = hero.text.toUpperCase();
  const wordW = text.length * fontPx * 0.62;
  const ruleW = wordW * 0.62;
  const holdDur = Math.max(0.4, E - I - 0.85);

  const dim = dna.plate.dim as number | undefined;
  const dimOp = dim
    ? tw(t, I - 0.3, 0.35, 0, dim, ease.power2.in) *
      tw(t, E + 0.02, 0.4, 1, 0, ease.power1.in)
    : 0;

  const op =
    tw(t, I, 0.09, 0, 1, ease.power1.out) *
    tw(t, E, 0.24, 1, 0, ease.power2.in);
  const y =
    tw(t, I, 0.45, 14, 0, ease.power3.out) +
    tw(t, E, 0.24, 0, -10, ease.power2.in);
  const sc =
    tw(t, I, 0.45, 1.05, 1, ease.power3.out) *
    tw(t, I + 0.6, holdDur, 1, 1.018, ease.power1.inOut);
  const blur =
    t < E - 0.02
      ? tw(t, I, 0.45, 9, 0, ease.power3.out)
      : tw(t, E - 0.02, 0.22, 0, 5, ease.power1.in);
  const rule =
    tw(t, I + 0.28, 0.35, 0, ruleW, ease.expo.out) *
    (t > E - 0.05 ? tw(t, E - 0.05, 0.2, 1, 0, ease.power2.in) : 1);

  return (
    <AbsoluteFill>
      {dim ? (
        <AbsoluteFill style={{ background: "#06080c", opacity: dimOp }} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: H * 0.4,
          transform: `translate(-50%, -50%) translateY(${y * px(1)}px) scale(${sc})`,
          opacity: op,
        }}
      >
        <div
          style={{
            fontFamily: `'${dna.fonts.hero}', sans-serif`,
            fontWeight: 700,
            fontSize: fontPx,
            lineHeight: 1,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            color: dna.palette.body,
            filter: `blur(${blur}px)`,
            textShadow:
              "0 2px 18px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.35)",
          }}
        >
          {text}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -px(20),
            transform: "translateX(-50%)",
            width: rule,
            height: px(3),
            borderRadius: 2,
            background: dna.palette.accent,
            opacity: 0.85,
            boxShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const setpiece: Setpiece = { Behind: Settle };
export default setpiece;
