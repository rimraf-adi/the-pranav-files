import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Upstream themes author in px on a 1280x720 stage. Our stage is 1080x1920 portrait.
 * Rule used by all ports: scale by the SHORT side (720 -> 1080), so `px(46)` is a 46px upstream font.
 * Positions should be fractions of W/H, not copied pixel coordinates.
 */
export const useStage = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const s = Math.min(W, H) / 720;
  return { W, H, fps, frame, t: frame / fps, s, px: (n: number) => n * s };
};
