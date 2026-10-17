// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/references/{styles,layouts,frames}. Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { CardStage } from "./CardStage";
import { THEME_IDS } from "./palettes";
import { CARD_FRAMES, CARD_LAYOUTS, CARD_STYLES, CARD_ZONES, card, cardContent } from "./schema";

export const cardPreviewSchema = z.object({
  style: z.enum(CARD_STYLES),
  palette: z.enum(THEME_IDS),
  layout: z.enum(CARD_LAYOUTS),
  frame: z.enum(CARD_FRAMES),
  accentIndex: z.number().int().min(0).max(4),
  zone: z.enum(CARD_ZONES).optional(),
  content: cardContent,
});
export type CardPreviewProps = z.infer<typeof cardPreviewSchema>;

/** Stand-in for the speaker so layouts/frames are visible without footage. */
const MockVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(170deg,#3a4a63 0%,#1b2433 70%)" }}>
    <div style={{ position: "absolute", left: "50%", top: "30%", width: 360, height: 360, marginLeft: -180, borderRadius: "50%", background: "#c9a58a" }} />
    <div style={{ position: "absolute", left: "50%", top: "52%", width: 760, height: 1100, marginLeft: -380, borderRadius: "380px 380px 0 0", background: "#2c3a52" }} />
    <div style={{ position: "absolute", left: 24, top: 24, padding: "8px 14px", border: "2px solid rgba(255,255,255,.5)", color: "rgba(255,255,255,.75)", font: "700 26px/1 monospace", letterSpacing: ".14em" }}>VIDEO</div>
  </AbsoluteFill>
);

export const CardPreview: React.FC<CardPreviewProps> = (p) => {
  const c = React.useMemo(
    () => card.parse({ id: "preview", at: 0.2, duration: 5, style: p.style, layout: p.layout, frame: p.frame, accentIndex: p.accentIndex, zone: p.zone, content: p.content, frameLabel: "speaker · 2026" }),
    [p],
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CardStage cards={[c]} themeId={p.palette}>
        <MockVideo />
      </CardStage>
    </AbsoluteFill>
  );
};
