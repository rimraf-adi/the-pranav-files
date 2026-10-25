import { Composition } from "remotion";
import { z } from "zod";
import { BrollItem } from "./components/Broll";
import { Reel } from "./components/Reel";
import { TemplateScene } from "./components/TemplateScene";
import { templates } from "./templates/registry.generated";
import { EngravingFilm, filmSchema } from "./films/engraving/EngravingFilm";
import { CardPreview, cardPreviewSchema } from "./cards/CardPreview";
import {
  broll,
  timeline,
  totalSeconds,
  type Timeline,
} from "./schema/timeline";

// Placeholder props so Studio opens; real renders pass --props=public/projects/<name>/timeline.json
const defaults: Timeline = timeline.parse({
  source: "projects/demo/raw/demo.mp4",
  segments: [{ from: 0, to: 5 }],
});

const brollPreview = z.object({ item: broll });
const templatePreview = z.object({ template: z.string(), speed: z.number().default(1) });

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
      id="TemplatePreview"
      component={({ template, speed }: z.infer<typeof templatePreview>) => (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(#15161b, #0a0a0d)" }}>
          <TemplateScene id="p" kind="template" at={0} duration={4} tone="neutral" template={template} texts={[]} colors={[]} x={0} y={0} scale={1} speed={speed} fadeIn={0.27} bgBrightness={0.66} bgFocus="50% 50%" scrim={0} solidHeight={0} scrimHeight={760} />
        </div>
      )}
      schema={templatePreview}
      defaultProps={{ template: "hooks-captions-caption-01", speed: 1 }}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={300}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(1, Math.round((templates[props.template]?.durationSec ?? 5) * 30 / props.speed)),
      })}
    />
    <Composition
      id="EngravingIntro"
      component={EngravingFilm}
      schema={filmSchema}
      defaultProps={{ name: "Better Call PJ", tagline: ["Sound knowledge,", "steady profit."] }}
      fps={30}
      width={1920}
      height={1080}
      durationInFrames={435}
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
