import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Broll } from "../schema/timeline";
import style from "../../styles/gadzhi.json";

const font = `${style.font}, Arial Black, sans-serif`;
const ACCENT = style.captions.emphasisColor;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = interpolate(
    frame,
    [0, 5, durationInFrames - 5, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        background:
          "radial-gradient(circle at 50% 40%, #1b1b22 0%, #08080b 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: font,
        fontWeight: 900,
        color: "white",
        textAlign: "center",
        padding: 80,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Stat: React.FC<Extract<Broll, { kind: "stat" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [8, durationInFrames * 0.65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const v = p.from + (p.to - p.from) * k;
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <Frame>
      <div
        style={{
          fontSize: 56,
          letterSpacing: 6,
          opacity: 0.75,
          textTransform: "uppercase",
        }}
      >
        {p.label}
      </div>
      <div
        style={{
          fontSize: 260,
          lineHeight: 1.1,
          color: ACCENT,
          transform: `scale(${0.8 + 0.2 * pop})`,
        }}
      >
        {p.prefix}
        {v.toFixed(p.decimals)}
        {p.suffix}
      </div>
    </Frame>
  );
};

const Keyword: React.FC<Extract<Broll, { kind: "keyword" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 240 } });
  return (
    <Frame>
      <div
        style={{
          fontSize: p.text.length > 10 ? 150 : 210,
          lineHeight: 1,
          textTransform: "uppercase",
          color: ACCENT,
          transform: `scale(${interpolate(slam, [0, 1], [2.2, 1])})`,
        }}
      >
        {p.text}
      </div>
      {p.sub ? (
        <div style={{ fontSize: 60, marginTop: 40, opacity: 0.8 }}>{p.sub}</div>
      ) : null}
    </Frame>
  );
};

export const BrollItem: React.FC<{ item: Broll }> = ({ item }) =>
  item.kind === "stat" ? <Stat {...item} /> : <Keyword {...item} />;
