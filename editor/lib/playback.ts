"use client";
// Current frame / play state, kept outside the main store so playback (30 updates/s)
// re-renders only the playhead and the clock, not the whole editor.
import type { PlayerRef } from "@remotion/player";
import { useSyncExternalStore } from "react";

type P = { frame: number; playing: boolean };
let p: P = { frame: 0, playing: false };
const ls = new Set<() => void>();
let player: PlayerRef | null = null;

export const setPlayback = (patch: Partial<P>) => {
  p = { ...p, ...patch };
  ls.forEach((l) => l());
};
export const getPlayback = () => p;
export const usePlayback = <T,>(sel: (p: P) => T) =>
  useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    () => sel(p),
    () => sel(p),
  );

export const registerPlayer = (r: PlayerRef | null) => {
  player = r;
};

export function seek(frame: number) {
  const f = Math.max(0, Math.round(frame));
  player?.seekTo(f);
  setPlayback({ frame: f });
}
export function togglePlay() {
  if (!player) return;
  if (player.isPlaying()) player.pause();
  else player.play();
}
export const pause = () => player?.pause();
