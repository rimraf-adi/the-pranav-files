import { Composition } from "remotion";
import { z } from "zod";
import { BrollItem } from "./components/Broll";
import { Reel } from "./components/Reel";
import { CardPreview, cardPreviewSchema } from "./cards/CardPreview";
import { TitleView } from "./components/TitleStack";
import {
  broll,
  timeline,
  title,
  totalSeconds,
  type Timeline,
} from "./schema/timeline";

// Placeholder props so Studio opens; real renders pass --props=public/projects/<name>/timeline.json
const defaults: Timeline = timeline.parse({
  source: "projects/demo/raw/demo.mp4",
  segments: [{ from: 0, to: 5 }],
});

const brollPreview = z.object({ item: broll });
const titlePreview = z.object({ title });

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BrollPreview"
      component={({ item }: z.infer<typeof brollPreview>) => (
        <BrollItem item={item} />
      )}
      schema={brollPreview}
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
      id="TitlePreview"
      component={({ title: t }: z.infer<typeof titlePreview>) => (
        <TitleView title={t} />
      )}
      schema={titlePreview}
      defaultProps={{
        title: title.parse({
          id: "demo",
          at: 0,
          tone: "attention",
          lines: [
            { text: "100", level: "primary" },
            { text: "days", level: "secondary" },
            { text: "breakdown", level: "modifier" },
          ],
        }),
      }}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={54}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.round(props.title.duration * 30),
      })}
    />
    <Composition
      id="CardPreview"
      component={CardPreview}
      schema={cardPreviewSchema}
      defaultProps={{
        style: "minimal",
        palette: "noir",
        layout: "stack",
        frame: "clean",
        accentIndex: 0,
        content: {
          kicker: "TAKEAWAY",
          title: "Rates *fall*, EMIs follow",
          detail: "When the repo rate drops, loan costs drop with it.",
          tag: "",
        },
      }}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={150}
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
