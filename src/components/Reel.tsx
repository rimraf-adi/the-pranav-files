import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import type { Timeline } from "../schema/timeline";
import { Captions } from "./Captions";

const PunchLayer: React.FC<{ punchIns: Timeline["punchIns"]; children: React.ReactNode }> = ({ punchIns, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let scale = 1;
  for (const p of punchIns) {
    if (t >= p.at && t <= p.at + p.duration) {
      const k = (t - p.at) / p.duration;
      // fast ease-in, hold, then back out
      scale = interpolate(k, [0, 0.15, 0.85, 1], [1, p.scale, p.scale, 1]);
    }
  }
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

export const Reel: React.FC<Timeline> = (tl) => {
  const { fps } = useVideoConfig();
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <PunchLayer punchIns={tl.punchIns}>
        {tl.segments.map((seg, i) => {
          const dur = Math.round((seg.to - seg.from) * fps);
          const from = cursor;
          cursor += dur;
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <Video
                src={staticFile(tl.source)}
                trimBefore={Math.round(seg.from * fps)}
                trimAfter={Math.round(seg.to * fps)}
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </Sequence>
          );
        })}
      </PunchLayer>
      <Captions words={tl.words} />
    </AbsoluteFill>
  );
};
