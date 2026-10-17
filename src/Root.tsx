import { Composition } from "remotion";
import { Reel } from "./components/Reel";
import { timeline, totalSeconds, type Timeline } from "./schema/timeline";

// Placeholder props so Studio opens; real renders pass --props=public/projects/<name>/timeline.json
const defaults: Timeline = timeline.parse({
  source: "projects/demo/raw/clip.mp4",
  segments: [{ from: 0, to: 5 }],
});

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    schema={timeline}
    defaultProps={defaults}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={150}
    calculateMetadata={({ props }) => ({
      fps: props.fps,
      width: props.width,
      height: props.height,
      durationInFrames: Math.max(1, Math.round(totalSeconds(props) * props.fps)),
    })}
  />
);
