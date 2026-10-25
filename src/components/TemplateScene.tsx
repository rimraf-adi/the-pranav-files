import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Broll } from "../schema/timeline";
import { templates } from "../templates/registry.generated";
import { useThemeFonts } from "../themes/fonts";

type P = Extract<Broll, { kind: "template" }>;

/** Renders a replicated motion template (src/templates) fitted to the canvas, as a pure function of the frame. */
export const TemplateScene: React.FC<P> = (p) => {
  const def = templates[p.template];
  const frame = useCurrentFrame();
  const { fps, width: W, height: H, durationInFrames } = useVideoConfig();
  const env = interpolate(frame, [0, Math.max(1, Math.round(p.fadeIn * fps)), durationInFrames - 8, durationInFrames], [p.fadeIn > 0 ? 0 : 1, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // eased falloff: fully opaque to `solid` px, then a long smoothstep-like fade to 0 at scrimHeight (no visible edge)
  const solid = p.solidHeight > 0 ? p.solidHeight : p.scrimHeight * 0.4;
  const fadeMask = `linear-gradient(to bottom, #000 0px, #000 ${solid}px, ${[
    [0.18, 0.88], [0.36, 0.68], [0.55, 0.45], [0.74, 0.24], [0.9, 0.08], [1, 0],
  ].map(([k, a]) => `rgba(0,0,0,${a}) ${solid + (p.scrimHeight - solid) * k}px`).join(", ")})`;
  useThemeFonts(Object.fromEntries((def?.fonts ?? []).map((f, i) => [`f${i}`, f])));
  if (!def) return null;
  const t = Math.min((frame / fps) * p.speed, def.durationSec);
  // fit the comp to the canvas width, centred; portrait comps map 1:1
  const fit = (W / def.w) * p.scale;
  return (
    <AbsoluteFill>
      {p.scrim > 0 || p.bg ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: p.scrimHeight, opacity: env, maskImage: fadeMask, WebkitMaskImage: fadeMask, overflow: "hidden" }}>
          {p.bg ? (
            <Img src={staticFile(p.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.bgFocus, filter: `brightness(${p.bgBrightness}) saturate(0.95) contrast(1.05)`, transform: `scale(${1.04 + 0.06 * (frame / Math.max(1, durationInFrames))})` }} />
          ) : null}
          {p.bg ? (
            // darken only the text side so the photo stays readable on the right
            <AbsoluteFill style={{ background: `linear-gradient(to right, rgba(5,6,10,${0.82 * p.scrim}) 0%, rgba(5,6,10,${0.6 * p.scrim}) 55%, rgba(5,6,10,${0.18 * p.scrim}) 100%)` }} />
          ) : (
            <AbsoluteFill style={{ background: `rgb(5,6,10)`, opacity: p.scrim }} />
          )}
        </div>
      ) : null}
      {p.icon ? (
        <Img src={staticFile(p.icon)} style={{ position: "absolute", right: 84, top: 64, width: 84, height: 84, opacity: env * 0.9, transform: `translateY(${(1 - env) * 14}px)` }} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: W / 2 - (def.w * fit) / 2 + p.x,
          top: H / 2 - (def.h * fit) / 2 + p.y,
          width: def.w,
          height: def.h,
          transformOrigin: "0 0",
          transform: `scale(${fit})`,
        }}
      >
        <def.Component t={t} texts={p.texts} colors={p.colors} />
      </div>
    </AbsoluteFill>
  );
};
