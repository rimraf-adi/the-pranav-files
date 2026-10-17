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
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Corner: React.FC<{ pos: React.CSSProperties; rot: number }> = ({
  pos,
  rot,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 10], [0.4, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  return (
    <div
      style={{
        position: "absolute",
        width: 90,
        height: 90,
        borderTop: `8px solid ${ACCENT}`,
        borderLeft: `8px solid ${ACCENT}`,
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: 0.9,
        ...pos,
      }}
    />
  );
};

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = interpolate(
    frame,
    [0, 5, durationInFrames - 5, durationInFrames],
    [0, 1, 1, 0],
    clamp,
  );
  const glowX = 50 + Math.sin(frame / 22) * 14;
  const glowY = 42 + Math.cos(frame / 30) * 6;
  const drift = frame * 0.8;
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        backgroundColor: "#07070a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: font,
        fontWeight: 900,
        color: "white",
        textAlign: "center",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${ACCENT}40 0%, ${ACCENT}00 52%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${drift}px ${drift}px`,
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black 0%, transparent 70%)",
        }}
      />
      <Corner pos={{ top: 110, left: 70 }} rot={0} />
      <Corner pos={{ top: 110, right: 70 }} rot={90} />
      <Corner pos={{ bottom: 110, right: 70 }} rot={180} />
      <Corner pos={{ bottom: 110, left: 70 }} rot={270} />
      {children}
    </AbsoluteFill>
  );
};

const Sub: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 10,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 8], [0, 1], clamp);
  const y = interpolate(frame, [delay, delay + 8], [24, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  if (!text) return null;
  return (
    <div
      style={{
        marginTop: 56,
        fontSize: 52,
        letterSpacing: 5,
        textTransform: "uppercase",
        opacity: o * 0.9,
        transform: `translateY(${y}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Stat: React.FC<Extract<Broll, { kind: "stat" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [8, durationInFrames * 0.65], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const v = p.from + (p.to - p.from) * k;
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const R = 290;
  const C = 2 * Math.PI * R;
  const arrow = p.to > p.from ? "▲" : p.to < p.from ? "▼" : "";
  return (
    <Frame>
      <div
        style={{
          position: "relative",
          width: 720,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${0.85 + 0.15 * pop})`,
        }}
      >
        <svg
          width={720}
          height={720}
          style={{ position: "absolute", transform: "rotate(-90deg)" }}
        >
          <circle
            cx={360}
            cy={360}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={22}
          />
          <circle
            cx={360}
            cy={360}
            r={R}
            fill="none"
            stroke={ACCENT}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - k * 0.85)}
          />
        </svg>
        <div style={{ fontSize: 64, color: ACCENT, lineHeight: 1 }}>
          {arrow}
        </div>
        <div style={{ fontSize: 150, lineHeight: 1.15, color: "white" }}>
          {p.prefix}
          {v.toFixed(p.decimals)}
          {p.suffix}
        </div>
      </div>
      <Sub text={p.label} />
    </Frame>
  );
};

const Keyword: React.FC<Extract<Broll, { kind: "keyword" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 240 } });
  const wipe = interpolate(frame, [0, 9], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Frame>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: "10px 44px",
          transform: `scale(${interpolate(slam, [0, 1], [1.8, 1])}) rotate(-2deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ACCENT,
            borderRadius: 14,
            transform: `scaleX(${wipe})`,
            transformOrigin: "left center",
          }}
        />
        <span
          style={{
            position: "relative",
            fontSize: p.text.length > 8 ? 150 : 200,
            lineHeight: 1.1,
            textTransform: "uppercase",
            color: "#0a0a0a",
          }}
        >
          {p.text}
        </span>
      </div>
      <Sub text={p.sub} />
    </Frame>
  );
};

export const BrollItem: React.FC<{ item: Broll }> = ({ item }) =>
  item.kind === "stat" ? <Stat {...item} /> : <Keyword {...item} />;
