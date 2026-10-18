"use client";
import { useSyncExternalStore } from "react";
import { setKnownFiles } from "./store";

export type Asset = { path: string; kind: "image" | "audio" | "video"; size: number };

let assets: Asset[] = [];
const ls = new Set<() => void>();

export async function loadAssets(name: string) {
  const res = await fetch(`/api/projects/${name}/assets`, { cache: "no-store" });
  if (!res.ok) return;
  const body = (await res.json()) as { assets: Asset[] };
  assets = body.assets;
  ls.forEach((l) => l());
  setKnownFiles(new Set(assets.map((a) => a.path)));
}

export const getAssets = () => assets;
export const useAssets = () =>
  useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    () => assets,
    () => assets,
  );

/** First photo-like asset (prefers assets/photos/, skips svg icons). */
export function firstAsset(kind: Asset["kind"]): string | undefined {
  const list = assets.filter((a) => a.kind === kind);
  if (kind === "image") {
    return (list.find((a) => a.path.includes("/photos/")) ?? list.find((a) => !a.path.endsWith(".svg")) ?? list[0])?.path;
  }
  if (kind === "audio") return (list.find((a) => a.path.includes("/sfx/")) ?? list[0])?.path;
  return list[0]?.path;
}

/** URL the browser can load for a /public-relative path (same thing staticFile() produces). */
export const publicUrl = (p: string) =>
  "/" +
  p
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");

// audio durations for drawing sfx blocks at their real length
const durations = new Map<string, number>();
const pending = new Set<string>();
export function audioDuration(src: string, onReady: () => void): number | undefined {
  if (durations.has(src)) return durations.get(src);
  if (!pending.has(src) && typeof Audio !== "undefined") {
    pending.add(src);
    const a = new Audio();
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      durations.set(src, Number.isFinite(a.duration) ? a.duration : 0.3);
      onReady();
    };
    a.onerror = () => durations.set(src, 0.3);
    a.src = publicUrl(src);
  }
  return undefined;
}
