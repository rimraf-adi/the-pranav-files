"use client";
// Editing operations shared by the timeline, the inspector and keyboard shortcuts.
import { firstAsset } from "./assets";
import { getPlayback } from "./playback";
import {
  brollSchemaFor,
  durationBounds,
  durationOf,
  elementSchema,
  makeDefault,
  type TrackKey,
} from "./schema";
import { apply, getState, select, setState, toast, type Doc, type Sel } from "./store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

export const TRACKS: TrackKey[] = ["broll", "cards", "words", "cuts", "sfx"];
export const POINT_TRACKS = new Set<TrackKey>(["cuts", "sfx"]);

export const fpsOf = (doc: Doc | null) => (doc?.fps as number) ?? 30;
export const totalOf = (doc: Doc | null) =>
  ((doc?.segments as { from: number; to: number }[]) ?? []).reduce((s, g) => s + (g.to - g.from), 0);
export const r3 = (x: number) => Math.round(x * 1000) / 1000;
export const quantize = (t: number, fps: number) => r3(Math.round(t * fps) / fps);
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const startOf = (track: TrackKey, it: Item): number => (track === "words" ? it.start : it.at) ?? 0;
export const endOf = (track: TrackKey, it: Item): number =>
  track === "words" ? it.end : POINT_TRACKS.has(track) ? it.at : it.at + durationOf(track, it);

export const nowSec = () => getPlayback().frame / fpsOf(getState().doc);

function uniqueId(list: Item[], base: string): string {
  const ids = new Set(list.map((x) => x.id));
  if (!ids.has(base)) return base;
  const stem = base.replace(/-\d+$/, "");
  let n = 2;
  while (ids.has(`${stem}-${n}`)) n++;
  return `${stem}-${n}`;
}

const list = (d: Doc, track: TrackKey): Item[] => {
  if (!Array.isArray(d[track])) d[track] = [];
  return d[track];
};

// ---- captionTheme.hero is an index into words[]; keep it on the same word ---------------

function heroShift(d: Doc, at: number, delta: 1 | -1) {
  const ct = d.captionTheme;
  if (!ct || typeof ct.hero !== "number") return;
  if (delta === 1 && ct.hero >= at) ct.hero += 1;
  if (delta === -1) {
    if (ct.hero === at) delete ct.hero;
    else if (ct.hero > at) ct.hero -= 1;
  }
}

// ---- add ----------------------------------------------------------------------------------

/** Editor-only starting content per kind, so a new item is visible and valid right away. */
const BROLL_START: Record<string, () => Item> = {
  stat: () => ({ label: "LABEL", from: 0, to: 100 }),
  keyword: () => ({ text: "Keyword" }),
  image: () => ({ src: firstAsset("image") ?? "" }),
  montage: () => ({ shots: [{ src: firstAsset("image") ?? "", word: "" }] }),
  product: () => ({ src: firstAsset("image") ?? "" }),
  lowerThird: () => ({ title: "Name", sub: "Role" }),
  chart: () => ({ items: [{ label: "A", value: 1 }, { label: "B", value: 2 }] }),
  map: () => ({}),
  trend: () => ({ plan: "PLAN", real: "REALITY", flipAt: 1 }),
  ticker: () => ({ label: "LABEL", to: 100 }),
  votes: () => ({ yes: 7, resultAt: 1 }),
  gauge: () => ({ label: "LABEL", value: 3, max: 5, valueAt: 1 }),
  flow: () => ({
    nodes: [
      { id: "a", label: "Cause", at: 0 },
      { id: "b", label: "Effect", at: 0.6, from: "a" },
    ],
  }),
};

export function newBroll(kind: string, d: Doc): Item {
  const fps = fpsOf(d);
  const base = makeDefault(brollSchemaFor(kind)) as Item;
  const { min, max } = durationBounds("broll", { kind });
  return {
    ...base,
    id: uniqueId(list(d, "broll"), kind.toLowerCase()),
    kind,
    at: quantize(nowSec(), fps),
    duration: clamp(2.5, min, max),
    ...BROLL_START[kind]?.(),
  };
}

export function addItem(track: TrackKey, kind?: string) {
  if (track === "words") return addWord();
  let newIndex = -1;
  apply((d) => {
    const fps = fpsOf(d);
    const at = quantize(nowSec(), fps);
    const arr = list(d, track);
    let item: Item;
    if (track === "broll") item = newBroll(kind ?? "keyword", d);
    else {
      item = { ...(makeDefault(elementSchema(track)) as Item), at };
      if (track === "cards") {
        item.id = uniqueId(arr, "card");
        item.content = { kicker: "", title: "New card", detail: "", tag: "" };
      }
      if (track === "sfx") {
        item.src = firstAsset("audio") ?? "";
        item.volume = 0.3;
      }
    }
    arr.push(item);
    newIndex = arr.length - 1;
  });
  if (newIndex >= 0) select({ track, index: newIndex });
}

export function addWord() {
  const s = getState();
  const words: Item[] = (s.doc?.words as Item[]) ?? [];
  const t = nowSec();
  const fps = fpsOf(s.doc);
  let i = words.findIndex((w) => w.start > t);
  if (i === -1) i = words.length;
  const prevEnd = i > 0 ? words[i - 1].end : 0;
  const nextStart = i < words.length ? words[i].start : totalOf(s.doc);
  const inside = i > 0 && t < words[i - 1].end;
  if (inside || nextStart - Math.max(prevEnd, t) < 2 / fps) {
    toast("No gap at the playhead. Split a word instead (S).", "error");
    return;
  }
  const start = r3(Math.max(prevEnd, t));
  const end = r3(Math.min(start + 0.3, nextStart));
  apply((d) => {
    list(d, "words").splice(i, 0, { text: "word", start, end, emphasis: false });
    heroShift(d, i, 1);
  });
  select({ track: "words", index: i });
  setState({ editingWord: i });
}

// ---- delete / duplicate / nudge ---------------------------------------------------------

/** A-roll segments re-time everything after them, so they're only edited from the inspector. */
const aRollGuard = (sel: Sel) => {
  if (sel?.track !== "segments") return false;
  toast("A-roll segments are edited in the inspector (from/to), not with shortcuts.", "info");
  return true;
};

/** Output-timeline [start, end] of each A-roll segment (segments play back to back). */
export function segmentSpans(doc: Doc | null): { start: number; end: number }[] {
  let c = 0;
  return ((doc?.segments as { from: number; to: number }[]) ?? []).map((s) => {
    const start = c;
    c += s.to - s.from;
    return { start, end: c };
  });
}

export function deleteSel(sel: Sel = getState().sel) {
  if (!sel || aRollGuard(sel)) return;
  const { track, index } = sel;
  apply((d) => {
    const arr = list(d, track);
    if (index >= arr.length) return;
    arr.splice(index, 1);
    if (track === "words") heroShift(d, index, -1);
  });
  const len = ((getState().doc?.[track] as Item[]) ?? []).length;
  select(len ? { track, index: Math.min(index, len - 1) } : null);
}

export function duplicateSel(sel: Sel = getState().sel) {
  if (!sel || aRollGuard(sel)) return;
  const { track, index } = sel;
  if (track === "words") return splitWord(index, undefined, true);
  let newIndex = -1;
  apply((d) => {
    const arr = list(d, track);
    const src = arr[index];
    if (!src) return;
    const copy: Item = JSON.parse(JSON.stringify(src));
    if ("id" in copy) copy.id = uniqueId(arr, String(copy.id));
    copy.at = r3(POINT_TRACKS.has(track) ? src.at + 0.5 : src.at + durationOf(track, src));
    arr.splice(index + 1, 0, copy);
    newIndex = index + 1;
  });
  if (newIndex >= 0) select({ track, index: newIndex });
}

export function nudgeSel(frames: number, sel: Sel = getState().sel) {
  if (!sel || sel.track === "segments") return;
  const { track, index } = sel;
  apply(
    (d) => {
      const fps = fpsOf(d);
      const dt = frames / fps;
      const arr = list(d, track);
      const it = arr[index];
      if (!it) return;
      if (track === "words") {
        const lo = index > 0 ? arr[index - 1].end : 0;
        const hi = index < arr.length - 1 ? arr[index + 1].start : totalOf(d);
        const len = it.end - it.start;
        const start = clamp(it.start + dt, lo, hi - len);
        it.start = r3(start);
        it.end = r3(start + len);
      } else {
        it.at = r3(Math.max(0, it.at + dt));
      }
    },
    { key: `nudge:${track}:${index}` },
  );
}

// ---- words: split / merge / hero --------------------------------------------------------

export function splitWord(i: number, at?: number, sameText = false) {
  const s = getState();
  const w = (s.doc?.words as Item[])?.[i];
  if (!w) return;
  const mid = at !== undefined && at > w.start + 0.02 && at < w.end - 0.02 ? at : (w.start + w.end) / 2;
  const tokens = String(w.text).trim().split(/\s+/);
  let a = w.text;
  let b = w.text;
  if (!sameText && tokens.length > 1) {
    const h = Math.ceil(tokens.length / 2);
    a = tokens.slice(0, h).join(" ");
    b = tokens.slice(h).join(" ");
  }
  apply((d) => {
    const words = list(d, "words");
    const cur = words[i];
    const second = { ...cur, text: b, start: r3(mid) };
    cur.text = a;
    cur.end = r3(mid);
    words.splice(i + 1, 0, second);
    heroShift(d, i + 1, 1);
  });
  select({ track: "words", index: i + 1 });
}

export function mergeWords(i: number) {
  const words = getState().doc?.words as Item[] | undefined;
  if (!words || i < 0 || i + 1 >= words.length) return;
  apply((d) => {
    const ws = list(d, "words");
    const a = ws[i];
    const b = ws[i + 1];
    a.text = `${a.text} ${b.text}`.replace(/\s+/g, " ").trim();
    a.end = b.end;
    a.emphasis = Boolean(a.emphasis || b.emphasis);
    ws.splice(i + 1, 1);
    const ct = d.captionTheme;
    if (ct && ct.hero === i + 1) ct.hero = i;
    else heroShift(d, i + 1, -1);
  });
  select({ track: "words", index: i });
}

export function setHero(i: number | undefined) {
  apply((d) => {
    if (!d.captionTheme) return;
    if (i === undefined) delete d.captionTheme.hero;
    else d.captionTheme.hero = i;
  });
}
