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
import { BlurText, Wash, clamp, fitSize, toneColor } from "./common";
import { FilmDust } from "./Effects";

const MAXW = 864;

const Card: React.FC<{ tone: Broll["tone"]; children: React.ReactNode }> = ({
  tone,
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
    <Wash tone={tone} height={100} strength={0.85} />
    <FilmDust />
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
  const num = `${p.prefix}${v.toFixed(p.decimals)}${p.suffix}`;
  const full = `${p.prefix}${p.to.toFixed(p.decimals)}${p.suffix}`;
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
      <Wash tone={p.tone} height={55} strength={0.9} />
      <FilmDust />
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

export const BrollItem: React.FC<{ item: Broll }> = ({ item }) => {
  if (item.kind === "stat") return <Stat {...item} />;
  if (item.kind === "keyword") return <Keyword {...item} />;
  return <Photo {...item} />;
};
