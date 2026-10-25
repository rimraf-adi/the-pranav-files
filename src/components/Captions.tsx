import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../schema/timeline";
import { fontFamily } from "./common";
import style from "../../styles/default.json";

const c = style.captions;
type Chunk = { text: string; start: number; end: number };

// 1-3 short words per chunk; break on pauses and sentence punctuation.
export const chunkWords = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({
      text: cur
        .map((w) => w.text.replace(/[.,?!]+$/g, ""))
        .join(" "),
      start: cur[0].start,
      end: cur[cur.length - 1].end,
    });
    cur = [];
  };
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const chars = cur.reduce((s, x) => s + x.text.length, 0) + w.text.length;
    if (
      prev &&
      (w.start - prev.end > 0.35 ||
        cur.length >= 3 ||
        chars > 14 ||
        /[.?!]$/.test(prev.text))
    )
      flush();
    cur.push(w);
    if (/[.?!]$/.test(w.text)) flush();
  }
  flush();
  return out;
};

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => chunkWords(words), [words]);
  const i = chunks.findIndex(
    (ch, k) =>
      t >= ch.start && t < Math.max(ch.end + 0.12, chunks[k + 1]?.start ?? 0),
  );
  if (i < 0) return null;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: `${c.topPercent}%`,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontWeight: c.weight,
          fontSize: (width * c.fontPercentOfWidth) / 100,
          color: c.color,
          textShadow: c.shadow,
          letterSpacing: 0.5,
        }}
      >
        {chunks[i].text}
      </div>
    </AbsoluteFill>
  );
};
