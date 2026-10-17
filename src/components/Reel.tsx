import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { OffthreadVideo } from "remotion";
import { timeline, type Timeline } from "../schema/timeline";
import { Captions } from "./Captions";
import { BrollItem } from "./Broll";
import { TitleStack } from "./TitleStack";
import { FilmDust, GradeOverlay, LightLeak, gradeFilter } from "./Effects";
import { PlateFx } from "../themes/PlateFx";
import { ThemeLayers, useThemeCtx } from "../themes/ThemeLayers";

/** Shot-based camera: each cut resets scale; a slow push-in runs inside each shot. */
const Camera: React.FC<{
  tl: Timeline;
  total: number;
  children: React.ReactNode;
}> = ({ tl, total, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shots = [
    { at: 0, scale: 1, originY: 0.4, leak: false },
    ...[...tl.cuts].sort((a, b) => a.at - b.at),
  ];
  let i = 0;
  shots.forEach((s, k) => {
    if (t >= s.at) i = k;
  });
  const shot = shots[i];
  const end = shots[i + 1]?.at ?? total;
  const prog = interpolate(
    t - shot.at,
    [0, Math.min(3.5, Math.max(0.5, end - shot.at))],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const zoom = shot.scale * (1 + (tl.pushInPercent / 100) * prog);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${tl.headroomPercent}%) scale(${zoom})`,
        transformOrigin: `50% ${shot.originY * 100}%`,
        filter: tl.grade ? gradeFilter : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** The source clip, cut into its kept segments. `transparent` is for the alpha subject cutout. */
const Segments: React.FC<{
  tl: Timeline;
  src: string;
  transparent?: boolean;
}> = ({ tl, src, transparent }) => {
  const { fps } = useVideoConfig();
  let cursor = 0;
  return (
    <>
      {tl.segments.map((seg, i) => {
        const dur = Math.round((seg.to - seg.from) * fps);
        const from = cursor;
        cursor += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {transparent ? (
              <OffthreadVideo
                src={staticFile(src)}
                transparent
                muted
                trimBefore={Math.round(seg.from * fps)}
                trimAfter={Math.round(seg.to * fps)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Video
                src={staticFile(src)}
                trimBefore={Math.round(seg.from * fps)}
                trimAfter={Math.round(seg.to * fps)}
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Sequence>
        );
      })}
    </>
  );
};

export const Reel: React.FC<Timeline> = (raw) => {
  // --props JSON bypasses zod, so apply schema defaults here
  const tl = React.useMemo(() => timeline.parse(raw), [raw]);
  const { fps } = useVideoConfig();
  const total = tl.segments.reduce((s, g) => s + (g.to - g.from), 0);
  const theme = useThemeCtx(tl.words, tl.captionTheme);
  const leaks = [
    ...tl.cuts.filter((c) => c.leak).map((c) => c.at),
    ...tl.broll.filter((b) => b.leak).flatMap((b) => [b.at, b.at + b.duration]),
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <PlateFx dna={theme?.dna} hero={theme?.hero}>
        <Camera tl={tl} total={total}>
          <Segments tl={tl} src={tl.source} />
        </Camera>
        {theme ? <ThemeLayers ctx={theme} layer="behind" /> : null}
        {theme && tl.subject ? (
          <Camera tl={tl} total={total}>
            <Segments tl={tl} src={tl.subject} transparent />
          </Camera>
        ) : null}
      </PlateFx>
      {tl.grade ? <GradeOverlay /> : null}
      {tl.dust ? <FilmDust /> : null}
      <TitleStack titles={tl.titles} />
      {tl.broll.map((b) => (
        <Sequence
          key={b.id}
          from={Math.round(b.at * fps)}
          durationInFrames={Math.round(b.duration * fps)}
        >
          <BrollItem item={b} />
        </Sequence>
      ))}
      <LightLeak times={leaks} />
      {theme ? (
        <ThemeLayers ctx={theme} layer="front" />
      ) : (
        <Captions words={tl.words} />
      )}
    </AbsoluteFill>
  );
};
