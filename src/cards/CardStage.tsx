// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/SKILL.md (Layout Compositions, Video Framing Reference) + references/frames/*.html. Re-implemented for Remotion.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, tw } from "../themes/motion";
import { FONT } from "./fonts";
import { BASE_H, BASE_W, BLEED, FULL, LAYOUTS, cardRectFor, innerRect, isFront, lerpRect, scaleRect, type Rect } from "./layouts";
import { alpha, getPalette } from "./palettes";
import type { Card } from "./schema";
import { CARD_STYLE_COMPONENTS } from "./styles";
import { useClock, useExit } from "./anim";

const TRANS = 0.6; // video move between full-bleed and its layout bounds (upstream: 0.5-0.7s power2.inOut)
const CHAIN = 0.15; // cards closer than this keep the video in layout bounds between them
const BACKDROP = "#0a0c12";

const end = (c: Card) => c.at + c.duration;

type VState = { card: Card | null; outer: Rect; p: number };

/** Where the video is at output time `t`, and how far it has moved into its layout (0..1). */
const videoState = (cards: Card[], t: number, W: number, H: number): VState => {
  let cur: Card | null = null;
  for (const c of cards) if (t >= c.at && t < end(c) && (!cur || c.at >= cur.at)) cur = c;
  if (!cur) return { card: null, outer: scaleRect(FULL, W, H), p: 0 };
  const to = (c: Card) => scaleRect(LAYOUTS[c.layout].video, W, H);
  const full = scaleRect(FULL, W, H);
  const c0 = cur;
  const prev = cards.filter((c) => c !== c0 && end(c) <= c0.at + 1e-6 && c0.at - end(c) <= CHAIN).sort((a, b) => end(b) - end(a))[0];
  const next = cards.filter((c) => c !== c0 && c.at >= end(c0) - 1e-6 && c.at - end(c0) <= CHAIN)[0];
  const enter = tw(t, c0.at, TRANS, 0, 1, ease.power2.inOut);
  const exit = next ? 1 : tw(t, end(c0) - TRANS, TRANS, 1, 0, ease.power2.inOut);
  const from = prev ? to(prev) : full;
  const rIn = lerpRect(from, to(c0), enter);
  const outer = exit < 1 ? lerpRect(full, rIn, exit) : rIn;
  return { card: c0, outer, p: exit * (prev ? 1 : enter) };
};

/** Cover-fit + focus crop of the full-frame video into `rect`. */
const VideoClip: React.FC<{ rect: Rect; W: number; H: number; radius: number; focusY: number; bleedTop?: number; children: React.ReactNode }> = ({ rect, W, H, radius, focusY, bleedTop = 0, children }) => {
  const identity = Math.abs(rect.w - W) < 0.5 && Math.abs(rect.h - H) < 0.5 && Math.abs(rect.x) < 0.5 && Math.abs(rect.y) < 0.5;
  const s = Math.max(rect.w / W, rect.h / H);
  const l = (rect.w - W * s) / 2;
  const tp = -(H * s - rect.h) * focusY;
  const mask = bleedTop > 1 ? `linear-gradient(to bottom, transparent 0, rgba(0,0,0,.12) ${bleedTop * 0.3}px, rgba(0,0,0,.55) ${bleedTop * 0.7}px, #000 ${bleedTop}px)` : undefined;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, overflow: "hidden", borderRadius: identity ? 0 : radius, WebkitMaskImage: mask, maskImage: mask }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: identity ? undefined : `translate(${l}px, ${tp}px) scale(${s})` }}>{children}</div>
    </div>
  );
};

const Chrome: React.FC<{ card: Card; outer: Rect; inner: Rect; p: number; accent: string; part: "back" | "front" }> = ({ card, outer, inner, p, accent, part }) => {
  if (card.layout === "overlay" || p <= 0.001) return null;
  const k = Math.min(1, outer.w / 1080);
  if (card.frame === "polaroid") {
    const inset = 24 * k;
    if (part === "back")
      return (
        <div style={{ position: "absolute", left: outer.x + inset, top: outer.y + inset, width: outer.w - 2 * inset, height: outer.h - 2 * inset, background: "#fefefe", boxShadow: "0 28px 60px -18px rgba(0,0,0,.55), 0 4px 12px rgba(0,0,0,.12)", opacity: p }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14 * k, textAlign: "center", font: `700 ${Math.round(36 * k)}px/1 ${FONT.hand}`, color: "#1d1c1a" }}>{card.frameLabel}</div>
        </div>
      );
    return <div style={{ position: "absolute", left: outer.x + outer.w * 0.2, top: outer.y + 12 * k, width: 120 * k, height: 28 * k, background: "rgba(180,210,235,.85)", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,.3) 6px 7px)", boxShadow: "0 3px 8px rgba(0,0,0,.15)", opacity: p }} />;
  }
  if (part === "back") return null;
  if (card.frame === "hairline") {
    const tick = (pos: React.CSSProperties) => <span style={{ position: "absolute", width: 24 * k, height: 24 * k, ...pos }} />;
    const b = `${4 * k}px solid ${accent}`;
    return (
      <div style={{ position: "absolute", left: inner.x, top: inner.y, width: inner.w, height: inner.h, pointerEvents: "none", opacity: p, boxShadow: `inset 0 0 0 ${2 * k}px ${accent}, inset 0 0 0 ${6 * k}px ${alpha(accent, 0.13)}, 0 0 0 1px rgba(0,0,0,.1)` }}>
        {tick({ top: -3, left: -3, borderTop: b, borderLeft: b })}
        {tick({ top: -3, right: -3, borderTop: b, borderRight: b })}
        {tick({ bottom: -3, left: -3, borderBottom: b, borderLeft: b })}
        {tick({ bottom: -3, right: -3, borderBottom: b, borderRight: b })}
      </div>
    );
  }
  // clean + pip: layout-level pill treatment
  if (card.layout === "pip")
    return <div style={{ position: "absolute", left: inner.x, top: inner.y, width: inner.w, height: inner.h, borderRadius: 22, opacity: p, boxShadow: "0 24px 60px -20px rgba(0,0,0,.55), 0 0 0 4px rgba(255,255,255,.75), 0 0 0 5px rgba(0,0,0,.18)" }} />;
  return null;
};

/** One card: style component at its zone rect, with a shell entrance/exit. */
export const CardBox: React.FC<{ card: Card; themeId: string; W: number; H: number }> = ({ card, themeId, W, H }) => {
  const { t } = useClock();
  const ex = useExit(0.4);
  const pal = getPalette(themeId);
  const r = scaleRect(cardRectFor(card.layout, card.zone), W, H);
  const Style = CARD_STYLE_COMPONENTS[card.style];
  const a = (n: number) => pal.accents[(card.accentIndex + n) % 5];
  const enter = tw(t, 0, 0.35, 0, 1, ease.power2.out);
  const front = isFront(card.layout, card.zone);
  const dy = front ? (1 - enter) * 60 : 0;
  return (
    <div style={{
      position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden",
      opacity: enter * ex, transform: `translateY(${dy + (1 - ex) * 30}px)`, filter: ex < 1 ? `blur(${(1 - ex) * 8}px)` : undefined,
      borderRadius: front ? 28 : 0, boxShadow: front ? "0 30px 80px -20px rgba(0,0,0,.55)" : undefined,
    }}>
      <Style content={card.content} palette={pal} accent={a(0)} accent2={a(1)} accent3={a(2)} w={r.w} h={r.h} />
    </div>
  );
};

const CardSeq: React.FC<{ cards: Card[]; themeId: string; W: number; H: number; front: boolean }> = ({ cards, themeId, W, H, front }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cards.filter((c) => isFront(c.layout, c.zone) === front).map((c) => (
        <Sequence key={c.id} from={Math.round(c.at * fps)} durationInFrames={Math.max(1, Math.round(c.duration * fps))}>
          <CardBox card={c} themeId={themeId} W={W} H={H} />
        </Sequence>
      ))}
    </>
  );
};

/**
 * Wraps the finished video plate. While a card is on screen the plate animates between full-bleed and the card's layout bounds
 * (with frame chrome); the card draws beneath it (split/stack/pip) or above it (overlay).
 */
export const CardStage: React.FC<{ cards: Card[]; themeId: string; focusY?: number; children: React.ReactNode }> = ({ cards, themeId, focusY = 0.4, children }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;
  const sorted = React.useMemo(() => [...cards].sort((a, b) => a.at - b.at), [cards]);
  const { card, outer, p } = videoState(sorted, t, W, H);
  const pal = getPalette(themeId);
  const accent = card ? pal.accents[card.accentIndex % 5] : "#ffffff";
  const inner = card ? innerRect(outer, card.frame, card.layout) : outer;
  const radius = card?.layout === "pip" ? 22 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: BACKDROP, opacity: p > 0 && card?.layout !== "overlay" ? Math.min(1, p * 3) : 0 }} />
      <CardSeq cards={sorted} themeId={themeId} W={W} H={H} front={false} />
      {card ? <Chrome card={card} outer={outer} inner={inner} p={p} accent={accent} part="back" /> : null}
      <VideoClip rect={inner} W={W} H={H} radius={radius} focusY={card?.layout === "split" ? 0.62 : focusY} bleedTop={card && card.frame === "clean" ? (BLEED[card.layout] ?? 0) * (W / BASE_W) * p : 0}>{children}</VideoClip>
      {card ? <Chrome card={card} outer={outer} inner={inner} p={p} accent={accent} part="front" /> : null}
      {card?.layout === "overlay" ? <AbsoluteFill style={{ pointerEvents: "none", opacity: legibility(t, card), background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 22%, transparent 50%, rgba(0,0,0,.72) 100%)" }} /> : null}
      <CardSeq cards={sorted} themeId={themeId} W={W} H={H} front />
    </AbsoluteFill>
  );
};

const legibility = (t: number, c: Card) => tw(t, c.at, 0.4, 0, 1) * tw(t, end(c) - 0.4, 0.4, 1, 0);

/** Fades the caption layer out while a card with `hideCaptions` is up. */
export const CaptionGate: React.FC<{ cards: Card[]; children: React.ReactNode }> = ({ cards, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let o = 1;
  for (const c of cards) if (c.hideCaptions) o = Math.min(o, 1 - tw(t, c.at, 0.2, 0, 1) * tw(t, end(c) - 0.2, 0.2, 1, 0));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export { BASE_H, BASE_W };
