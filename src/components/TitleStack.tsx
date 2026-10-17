import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { Title } from "../schema/timeline";
import { BlurText, Wash, fitSize, toneColor } from "./common";
import style from "../../styles/gadzhi.json";

const ref = style.reference;

export const TitleView: React.FC<{ title: Title }> = ({ title }) => {
  const { width } = useVideoConfig();
  const maxW = (width * ref.titleZone.maxWidthPercent) / 100;
  const lineDelay = ref.title.anim.lineStaggerSec;
  return (
    <AbsoluteFill>
      <Wash tone={title.tone} />
      <div
        style={{
          position: "absolute",
          top: `${ref.titleZone.topPercent}%`,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        {title.lines.map((l, i) => {
          const size = fitSize(l.text, ref.title.sizes[l.level], maxW);
          const color = toneColor(
            l.tone ?? (l.level === "primary" ? title.tone : "neutral"),
          );
          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}
            >
              <BlurText
                text={l.text}
                size={size}
                color={
                  l.level === "primary" ? color : l.tone ? color : "#ffffff"
                }
                delaySec={i * lineDelay}
                seed={`${title.id}-${i}`}
                italic={l.italic}
                weight={l.level === "modifier" ? 900 : 900}
              />
              {l.icon ? (
                <Img
                  src={staticFile(l.icon)}
                  style={{
                    height: size * 1.1,
                    filter: "grayscale(1) brightness(1.4)",
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const TitleStack: React.FC<{ titles: Title[] }> = ({ titles }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {titles.map((t) => (
        <Sequence
          key={t.id}
          from={Math.round(t.at * fps)}
          durationInFrames={Math.round(t.duration * fps)}
        >
          <TitleView title={t} />
        </Sequence>
      ))}
    </>
  );
};
