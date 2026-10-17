// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs, shared draw-on stroke rendering. Re-implemented for Remotion.
import React from "react";
import { drawn, layoutStrokes, penAt, type StrokeLayout } from "../strokes";

export { layoutStrokes, penAt };
export type { StrokeLayout };

/**
 * Hand-written word, revealed at constant pen speed. Renders one SVG of the given layout
 * with `layers` (each a stroke width/color/opacity/filter) stacked. progress 0..1.
 */
export const StrokeWord: React.FC<{
  layout: StrokeLayout;
  progress: number;
  layers: {
    width: number;
    color: string;
    opacity?: number;
    blur?: number;
    jitter?: (strokeIndex: number) => [number, number];
  }[];
  extra?: React.ReactNode;
  defs?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ layout, progress, layers, extra, defs, style }) => {
  const dr = drawn(layout, progress);
  const pad = 60;
  return (
    <svg
      width={layout.width + pad * 2}
      height={layout.height + pad * 2}
      viewBox={`${-pad} ${-pad} ${layout.width + pad * 2} ${layout.height + pad * 2}`}
      style={{ overflow: "visible", ...style }}
    >
      {defs ? <defs>{defs}</defs> : null}
      {layers.map((ly, li) => (
        <g
          key={li}
          style={ly.blur ? { filter: `blur(${ly.blur}px)` } : undefined}
          opacity={ly.opacity ?? 1}
        >
          {layout.strokes.map((s, i) => {
            if (dr[i] <= 0) return null;
            const j = ly.jitter?.(i) ?? [0, 0];
            return (
              <path
                key={i}
                d={s.d}
                transform={j[0] || j[1] ? `translate(${j[0]} ${j[1]})` : undefined}
                fill="none"
                stroke={ly.color}
                strokeWidth={ly.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${s.len + 1} ${s.len + 1}`}
                strokeDashoffset={s.len + 1 - dr[i]}
              />
            );
          })}
        </g>
      ))}
      {extra}
    </svg>
  );
};
