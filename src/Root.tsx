import { Composition } from "remotion";
import { Reel } from "./components/Reel";
import { z } from "zod";
import { BrollItem } from "./components/Broll";
import {
  broll,
  timeline,
  totalSeconds,
  type Timeline,
} from "./schema/timeline";

// Placeholder props so Studio opens; real renders pass --props=public/projects/<name>/timeline.json
const defaults: Timeline = timeline.parse({
  source: "projects/demo/raw/clip.mp4",
  segments: [{ from: 0, to: 5 }],
});

const previewSchema = z.object({ item: broll });

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BrollPreview"
      component={({ item }: z.infer<typeof previewSchema>) => (
        <BrollItem item={item} />
      )}
      schema={previewSchema}
      defaultProps={{
        item: broll.parse({
          id: "demo",
          kind: "keyword",
          at: 0,
          duration: 2,
          text: "Rate hike",
        }),
      }}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={60}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.round(props.item.duration * 30),
      })}
    />
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
        durationInFrames: Math.max(
          1,
          Math.round(totalSeconds(props) * props.fps),
        ),
      })}
    />
  </>
);
