import React from "react";
import { Img, interpolate, staticFile, useVideoConfig } from "remotion";
import { useClock } from "../anim";
import { FONT } from "../fonts";
import type { StyleProps } from "./types";

/** B-roll card: shots fill the card box (top half in the `split` layout, over the speaker's soft seam). One shot per equal slice of the card's duration. */
export const Media: React.FC<StyleProps> = ({ content: c, palette, w, h }) => {
  const { t } = useClock();
  const { durationInFrames, fps } = useVideoConfig();
  const shots = c.media ?? [];
  if (!shots.length) return <div style={{ width: w, height: h, background: palette.bg }} />;
  const dur = durationInFrames / fps;
  const slice = dur / shots.length;
  const i = Math.min(shots.length - 1, Math.floor(t / slice));
  const local = (t - i * slice) / slice;
  const zoom = interpolate(local, [0, 1], [1, 1.04]);
  const s = shots[i];
  return (
    <div style={{ width: w, height: h, position: "relative", overflow: "hidden", background: palette.bg }}>
      <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "contrast(1.06) brightness(0.92)" }} />
      {s.word ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: h * 0.2, textAlign: "center", color: "#fff", fontFamily: FONT.sans, fontWeight: 600, fontSize: Math.round(w * 0.045), letterSpacing: "0.01em", textTransform: "lowercase", textShadow: "0 2px 10px rgba(0,0,0,.65)" }}>{s.word}</div>
      ) : null}
    </div>
  );
};
