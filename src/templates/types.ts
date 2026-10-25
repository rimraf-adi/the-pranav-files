import type React from "react";

/** Props every template component receives. `t` is seconds on the TEMPLATE's own timeline (already speed-scaled). */
export type TemplateProps = {
  t: number;
  texts: string[];
  colors: string[];
};

/**
 * A replicated motion template (see skills/motion-templates). A template is a pure function of `t`:
 * no timers, no CSS animations, no Math.random() (use remotion `random(seed)`).
 * Coordinates are in the source comp's pixels; TemplateScene fits the comp to the 1080x1920 canvas.
 */
export type TemplateDef = {
  slug: string;
  name: string;
  /** source comp size and length */
  w: number;
  h: number;
  fps: number;
  durationSec: number;
  /** Google Fonts family names to load (swap non-Google fonts for the closest match) */
  fonts: string[];
  /** default text per text item, in order; user `texts` override by index */
  texts: string[];
  /** default colour per colour control, in order; user `colors` override by index */
  colors: string[];
  Component: React.FC<TemplateProps>;
};
