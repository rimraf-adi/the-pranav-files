import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Broll } from "../schema/timeline";
import style from "../../styles/default.json";
import { BlurText, clamp, fitSize, fontFamily, toneColor } from "./common";
import { Chart, LowerThird, MapScene } from "./BrollScenes";
import { TemplateScene } from "./TemplateScene";
import { Flow, Gauge, NameTag, Ticker, Trend, Votes } from "./Motion";

const MAXW = 864;

const Card: React.FC<{ tone: Broll["tone"]; children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#050507",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 28,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Stat: React.FC<Extract<Broll, { kind: "stat" }>> = (p) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [8, durationInFrames * 0.65], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const v = p.from + (p.to - p.from) * k;
  const arrow = p.to > p.from ? "▲" : p.to < p.from ? "▼" : "";
  const prefix = p.prefix ?? "";
  const suffix = p.suffix ?? "";
  const num = `${prefix}${v.toFixed(p.decimals)}${suffix}`;
  const full = `${prefix}${p.to.toFixed(p.decimals)}${suffix}`;
  return (
    <Card tone={p.tone}>
      <BlurText
        text={p.label}
        size={fitSize(p.label, 60, MAXW)}
        color="#ffffff"
        seed={`${p.id}-l`}
      />
      <BlurText
        text={`${arrow ? arrow + " " : ""}${num}`}
        size={fitSize(`${arrow} ${full}`, 260, MAXW)}
        color={toneColor(p.tone)}
        delaySec={0.12}
        seed={`${p.id}-n`}
      />
    </Card>
  );
};

const Keyword: React.FC<Extract<Broll, { kind: "keyword" }>> = (p) => (
  <Card tone={p.tone}>
    <BlurText
      text={p.text}
      size={fitSize(p.text, 260, MAXW)}
      color={toneColor(p.tone)}
      seed={`${p.id}-t`}
    />
    {p.sub ? (
      <BlurText
        text={p.sub}
        size={fitSize(p.sub, 64, MAXW)}
        color="#ffffff"
        delaySec={0.2}
        seed={`${p.id}-s`}
      />
    ) : null}
  </Card>
);

const Photo: React.FC<Extract<Broll, { kind: "image" }>> = (p) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={staticFile(p.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.1) brightness(0.85) saturate(1.05)",
          }}
        />
      </AbsoluteFill>
      {p.label ? (
        <div style={{ position: "absolute", top: "4%", left: 0, right: 0 }}>
          <BlurText
            text={p.label}
            size={fitSize(p.label, 170, MAXW)}
            color={toneColor(p.tone)}
            seed={`${p.id}-p`}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const slice = (frame: number, total: number, n: number) => Math.min(n - 1, Math.floor((frame / total) * n));

const Montage: React.FC<Extract<Broll, { kind: "montage" }>> = (p) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const i = slice(frame, durationInFrames, p.shots.length);
  const sliceFrames = durationInFrames / p.shots.length;
  const local = (frame - i * sliceFrames) / sliceFrames;
  const s = p.shots[i];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * local})` }}>
        <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.focus ?? "50% 50%", filter: "contrast(1.08) brightness(0.88)" }} />
      </AbsoluteFill>
      {/* caption bed: keeps the running captions readable over bright photos */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,.62) 0%, rgba(0,0,0,.35) 22%, rgba(0,0,0,0) 42%)" }} />
      {s.word ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: `${style.scenes.montage.captionTopPercent}%`, textAlign: "center", color: "#fff", fontFamily, fontWeight: 500, fontSize: style.scenes.montage.captionSizePx, textTransform: "lowercase", textShadow: "0 2px 12px rgba(0,0,0,.7)" }}>{s.word}</div>
      ) : null}
    </AbsoluteFill>
  );
};

const Product: React.FC<Extract<Broll, { kind: "product" }>> = (p) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const scroll = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const words = p.words ?? [];
  const word = words.length ? words[slice(frame, durationInFrames, words.length)] : "";
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${p.from ?? style.scenes.product.from}, ${p.to ?? style.scenes.product.to})`, justifyContent: "center", alignItems: "center" }}>
      {word ? (
        <div style={{ position: "absolute", top: "9%", left: 0, right: 0, textAlign: "center", color: "#fff", fontFamily, fontWeight: 500, fontSize: 60, textTransform: "lowercase" }}>{word}</div>
      ) : null}
      {(p.variant ?? "phone") === "phone" ? (
        <div style={{ width: 560, height: 1140, borderRadius: 84, background: "#0b0b0d", padding: 16, boxShadow: "0 40px 90px -20px rgba(0,0,0,.7), 0 0 0 3px #2a2a30", transform: `translateY(${(1 - enter) * 80}px)`, opacity: enter }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 70, overflow: "hidden", background: "#fff" }}>
            <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(1.08) translateY(${-scroll * 3}%)`, transformOrigin: "50% 0%" }} />
            <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -80, width: 160, height: 44, borderRadius: 22, background: "#0b0b0d" }} />
          </div>
        </div>
      ) : (
        <Img src={staticFile(p.src)} style={{ width: 420, height: 420, objectFit: "contain", borderRadius: 96, boxShadow: "0 30px 70px -18px rgba(0,0,0,.65)", transform: `scale(${0.9 + 0.1 * enter})`, opacity: enter }} />
      )}
    </AbsoluteFill>
  );
};

export const BrollItem: React.FC<{ item: Broll }> = ({ item }) => {
  if (item.kind === "stat") return <Stat {...item} />;
  if (item.kind === "keyword") return <Keyword {...item} />;
  if (item.kind === "montage") return <Montage {...item} />;
  if (item.kind === "product") return <Product {...item} />;
  if (item.kind === "lowerThird") return item.placement === "top" ? <NameTag {...item} /> : <LowerThird {...item} />;
  if (item.kind === "chart") return <Chart {...item} />;
  if (item.kind === "map") return <MapScene {...item} />;
  if (item.kind === "trend") return <Trend {...item} />;
  if (item.kind === "ticker") return <Ticker {...item} />;
  if (item.kind === "votes") return <Votes {...item} />;
  if (item.kind === "gauge") return <Gauge {...item} />;
  if (item.kind === "flow") return <Flow {...item} />;
  if (item.kind === "template") return <TemplateScene {...item} />;
  return <Photo {...item} />;
};
