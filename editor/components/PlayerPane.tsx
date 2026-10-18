"use client";
import { Player, type PlayerRef } from "@remotion/player";
import { Reel } from "@reel/components/Reel";
import type { Timeline } from "@reel/schema/timeline";
import React, { useEffect, useRef } from "react";
import { fpsOf, totalOf } from "@/lib/ops";
import { getPlayback, registerPlayer, seek, setPlayback, togglePlay, usePlayback } from "@/lib/playback";
import { useStore } from "@/lib/store";

export const fmt = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
};

const ReelComp = Reel as unknown as React.FC<Record<string, unknown>>;

export function PlayerPane() {
  const doc = useStore((s) => s.validDoc);
  const ref = useRef<PlayerRef>(null);
  const fps = fpsOf(doc);
  const total = totalOf(doc);
  const frames = Math.max(1, Math.round(total * fps));

  useEffect(() => {
    const p = ref.current;
    registerPlayer(p);
    if (!p) return;
    // a remounted player (hot reload, invalid->valid doc) starts at 0: put it back where the editor is
    const keep = getPlayback().frame;
    if (keep > 0) p.seekTo(Math.min(keep, frames - 1));
    setPlayback({ frame: Math.min(keep, frames - 1), playing: false });
    const onFrame = (e: { detail: { frame: number } }) => setPlayback({ frame: e.detail.frame });
    const onPlay = () => setPlayback({ playing: true });
    const onPause = () => setPlayback({ playing: false });
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("seeked", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    p.addEventListener("ended", onPause);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("seeked", onFrame);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
      p.removeEventListener("ended", onPause);
      registerPlayer(null);
    };
  }, [doc !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!doc) return <div className="player-empty">No valid timeline to preview yet.</div>;
  return (
    <div className="player-pane">
      <div className="player-box">
        <Player
          ref={ref}
          component={ReelComp}
          inputProps={doc as Timeline as unknown as Record<string, unknown>}
          durationInFrames={frames}
          fps={fps}
          compositionWidth={(doc.width as number) ?? 1080}
          compositionHeight={(doc.height as number) ?? 1920}
          style={{ width: "100%", height: "100%" }}
          controls
          clickToPlay
          spaceKeyToPlayOrPause={false}
          doubleClickToFullscreen
          showVolumeControls
          acknowledgeRemotionLicense
          errorFallback={({ error }) => (
            <div className="player-error">
              <b>Preview error</b>
              <pre>{error.message}</pre>
            </div>
          )}
        />
      </div>
      <Transport total={total} fps={fps} frames={frames} />
    </div>
  );
}

function Transport({ total, fps, frames }: { total: number; fps: number; frames: number }) {
  const frame = usePlayback((p) => p.frame);
  const playing = usePlayback((p) => p.playing);
  return (
    <div className="transport">
      <button className="btn icon" onClick={() => seek(0)} title="Start (Home)">
        ⏮
      </button>
      <button className="btn icon" onClick={() => seek(frame - 1)} title="Back one frame (←)">
        ◀︎
      </button>
      <button className="btn icon play" onClick={togglePlay} title="Play/pause (Space)">
        {playing ? "❚❚" : "▶"}
      </button>
      <button className="btn icon" onClick={() => seek(Math.min(frames - 1, frame + 1))} title="Forward one frame (→)">
        ▶︎
      </button>
      <span className="clock">
        <b>{fmt(frame / fps)}</b> / {fmt(total)}
        <span className="muted"> · f{frame}</span>
      </span>
      <input
        className="scrub"
        type="range"
        min={0}
        max={frames - 1}
        value={Math.min(frame, frames - 1)}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Scrub"
      />
    </div>
  );
}
