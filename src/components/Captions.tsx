import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Word } from "../schema/timeline";
import style from "../../styles/gadzhi.json";

const s = style.captions;

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // group into pages of N words
  const pages: Word[][] = [];
  for (let i = 0; i < words.length; i += s.wordsPerPage) {
    pages.push(words.slice(i, i + s.wordsPerPage));
  }
  const page = pages.find(
    (p) => t >= p[0].start && t < p[p.length - 1].end + 0.15,
  );
  if (!page) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: `${s.bottomPercent}%`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 24px",
          maxWidth: "88%",
          fontFamily: `${style.font}, Arial Black, sans-serif`,
          fontWeight: 900,
          fontSize: s.fontSize,
          lineHeight: 1.1,
          textAlign: "center",
          textTransform: s.uppercase ? "uppercase" : "none",
        }}
      >
        {page.map((w, i) => {
          const active = t >= w.start;
          const pop = spring({
            frame: frame - Math.round(w.start * fps),
            fps,
            config: { damping: 12, stiffness: 220 },
          });
          const scale = active ? interpolate(pop, [0, 1], [0.7, 1]) : 0;
          return (
            <span
              key={`${w.start}-${i}`}
              style={{
                display: "inline-block",
                transform: `scale(${scale})`,
                opacity: active ? 1 : 0,
                color: w.emphasis ? s.emphasisColor : s.color,
                WebkitTextStroke: `${s.strokeWidth}px ${s.strokeColor}`,
                paintOrder: "stroke fill",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
