"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { audioDuration } from "@/lib/assets";
import {
  POINT_TRACKS,
  TRACKS,
  addItem,
  clamp,
  endOf,
  fpsOf,
  quantize,
  r3,
  segmentSpans,
  startOf,
  totalOf,
} from "@/lib/ops";
import { getPlayback, pause, seek, usePlayback } from "@/lib/playback";
import { brollKinds, durationBounds, type TrackKey } from "@/lib/schema";
import { apply, getState, select, setState, useStore, type Doc } from "@/lib/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

const HEAD_W = 112;
const LANE_H = 24;
const RULER_H = 26;
const SNAP_PX = 7;

const TRACK_LABEL: Record<TrackKey, string> = {
  segments: "A-roll",
  broll: "B-roll",
  cards: "Cards",
  words: "Captions",
  cuts: "Cuts",
  sfx: "SFX",
};

const KIND_GROUP: Record<string, string> = {
  image: "photo",
  montage: "photo",
  product: "photo",
  keyword: "text",
  lowerThird: "text",
  stat: "text",
  chart: "graphic",
  map: "graphic",
  trend: "motion",
  ticker: "motion",
  votes: "motion",
  gauge: "motion",
  flow: "motion",
};

const basename = (p: string) => (p ?? "").split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";

function labelFor(track: TrackKey, it: Item): string {
  switch (track) {
    case "broll": {
      const s =
        it.text ?? it.label ?? it.title ?? it.plan ?? (it.shots ? it.shots.map((x: Item) => basename(x.src)).join(", ") : "");
      return `${it.kind} · ${s || it.id}`;
    }
    case "cards":
      return `${it.style ?? "minimal"} · ${it.content?.title || it.id}`;
    case "cuts":
      return `×${(it.scale ?? 1).toFixed(2)}`;
    case "sfx":
      return basename(it.src);
    case "segments":
      return `src ${Number(it.from).toFixed(2)}–${Number(it.to).toFixed(2)}s`;
    default:
      return it.text;
  }
}

type Block = { track: TrackKey; index: number; start: number; end: number; lane: number; item: Item };

/** Greedy lane packing so overlapping items stack instead of hiding each other. */
function pack(items: { start: number; end: number; index: number }[], minSec: number): Map<number, number> {
  const lanes: number[] = [];
  const out = new Map<number, number>();
  [...items]
    .sort((a, b) => a.start - b.start)
    .forEach((it) => {
      const end = Math.max(it.end, it.start + minSec);
      let l = lanes.findIndex((e) => e <= it.start + 1e-6);
      if (l === -1) {
        l = lanes.length;
        lanes.push(end);
      } else lanes[l] = end;
      out.set(it.index, l);
    });
  return out;
}

type Drag = {
  mode: "move" | "start" | "end";
  track: TrackKey;
  index: number;
  x0: number;
  orig: { start: number; end: number };
  gesture: string;
  moved: boolean;
};

let gestureSeq = 0;

export function Timeline() {
  const doc = useStore((s) => s.doc) as Doc;
  const sel = useStore((s) => s.sel);
  const editingWord = useStore((s) => s.editingWord);
  const issues = useStore((s) => s.issues);
  const fps = fpsOf(doc);
  const total = totalOf(doc);
  const scroller = useRef<HTMLDivElement>(null);
  const [pps, setPps] = useState(90); // pixels per second
  const [guide, setGuide] = useState<number | null>(null);
  const [, bump] = useState(0); // re-render when sfx durations load
  const drag = useRef<Drag | null>(null);
  const width = Math.max(1, total * pps);

  // fit to width on first mount
  useEffect(() => {
    const w = scroller.current?.clientWidth ?? 0;
    // fit, but never so tight that caption words become unreadable slivers
    if (w > 0 && total > 0) setPps(Math.max(80, clamp((w - HEAD_W - 30) / total, 10, 800)));
  }, [total > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const words: Item[] = useMemo(() => doc.words ?? [], [doc.words]);
  const snapPoints = useMemo(() => {
    const pts: number[] = [0, total];
    for (const w of words) pts.push(w.start, w.end);
    return pts;
  }, [words, total]);

  const errIdx = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of issues) {
      if (typeof i.path[1] === "number") {
        const k = `${i.path[0]}:${i.path[1]}`;
        if (!m.has(k) || i.level === "error") m.set(k, `${i.level}: ${i.path.slice(2).join(".")} ${i.message}`);
      }
    }
    return m;
  }, [issues]);

  // build blocks per track
  const rows = useMemo(() => {
    const segs = segmentSpans(doc);
    return (["segments", ...TRACKS] as TrackKey[]).map((track) => {
      const arr: Item[] = doc[track] ?? [];
      const spans = arr.map((it, index) => {
        if (track === "segments") return { ...segs[index], index };
        const start = startOf(track, it);
        let end = endOf(track, it);
        if (track === "sfx") end = start + (audioDuration(it.src, () => bump((x) => x + 1)) ?? 0.25);
        if (track === "cuts") end = start;
        return { start, end, index };
      });
      const minSec = 14 / pps;
      const lanesOf = track === "words" || track === "segments" ? new Map(spans.map((s) => [s.index, 0])) : pack(spans, minSec);
      const blocks: Block[] = spans.map((s) => ({
        track,
        index: s.index,
        start: s.start,
        end: s.end,
        lane: lanesOf.get(s.index) ?? 0,
        item: arr[s.index],
      }));
      const lanes = Math.max(1, ...blocks.map((b) => b.lane + 1));
      return { track, blocks, lanes };
    });
  }, [doc, pps]); // eslint-disable-line react-hooks/exhaustive-deps

  const segBounds = useMemo(() => {
    const out: number[] = [];
    let c = 0;
    for (const s of (doc.segments ?? []) as { from: number; to: number }[]) {
      c += s.to - s.from;
      out.push(c);
    }
    return out.slice(0, -1);
  }, [doc.segments]);

  // ---- drag / trim -------------------------------------------------------------------

  const snap = (t: number, alt: boolean, exclude?: [number, number]): { t: number; d: number; hit: boolean } => {
    if (alt) return { t: quantize(t, fps), d: Infinity, hit: false };
    const thr = SNAP_PX / pps;
    const now = getPlayback().frame / fps;
    let best: number | null = null;
    for (const p of [...snapPoints, now]) {
      if (exclude && (Math.abs(p - exclude[0]) < 1e-6 || Math.abs(p - exclude[1]) < 1e-6)) continue;
      if (Math.abs(p - t) < thr && (best === null || Math.abs(p - t) < Math.abs(best - t))) best = p;
    }
    return best === null ? { t: quantize(t, fps), d: Infinity, hit: false } : { t: r3(best), d: Math.abs(best - t), hit: true };
  };

  const onMove = (e: PointerEvent) => {
    const g = drag.current;
    if (!g) return;
    const dx = e.clientX - g.x0;
    if (g.track === "segments") return; // A-roll is read-only here (re-times everything after it)
    if (!g.moved && Math.abs(dx) < 3) return;
    g.moved = true;
    const dt = dx / pps;
    const d = getState().doc as Doc;
    const arr: Item[] = d[g.track] ?? [];
    const it = arr[g.index];
    if (!it) return;
    const { start: s0, end: e0 } = g.orig;
    const len = e0 - s0;
    const own: [number, number] | undefined = g.track === "words" ? [s0, e0] : undefined;
    let lo = 0;
    let hi = total;
    if (g.track === "words") {
      lo = g.index > 0 ? arr[g.index - 1].end : 0;
      hi = g.index < arr.length - 1 ? arr[g.index + 1].start : total;
    }
    const bounds = g.track === "words" ? { min: 1 / fps, max: Infinity } : durationBounds(g.track, it);
    let ns = s0;
    let ne = e0;
    let gl: number | null = null;

    if (g.mode === "move" || POINT_TRACKS.has(g.track)) {
      const a = snap(s0 + dt, e.altKey, own);
      const b = POINT_TRACKS.has(g.track) ? null : snap(e0 + dt, e.altKey, own);
      if (b && b.hit && b.d < a.d) {
        ns = b.t - len;
        gl = b.t;
      } else {
        ns = a.t;
        gl = a.hit ? a.t : null;
      }
      ns = clamp(ns, lo, Math.max(lo, hi - (POINT_TRACKS.has(g.track) ? 0 : len)));
      ne = ns + len;
    } else if (g.mode === "start") {
      const a = snap(s0 + dt, e.altKey, own);
      gl = a.hit ? a.t : null;
      ns = clamp(a.t, Math.max(lo, e0 - bounds.max), e0 - bounds.min);
    } else {
      const a = snap(e0 + dt, e.altKey, own);
      gl = a.hit ? a.t : null;
      ne = clamp(a.t, s0 + bounds.min, Math.min(hi, s0 + bounds.max));
    }
    setGuide(gl);
    const key = `g:${g.gesture}`;
    apply(
      (dd) => {
        const x = dd[g.track][g.index];
        if (g.track === "words") {
          x.start = r3(ns);
          x.end = r3(ne);
        } else if (POINT_TRACKS.has(g.track)) {
          x.at = r3(Math.max(0, ns));
        } else {
          x.at = r3(Math.max(0, ns));
          if (g.mode !== "move") x.duration = r3(ne - ns);
        }
      },
      { key },
    );
  };

  const onUp = () => {
    const g = drag.current;
    drag.current = null;
    setGuide(null);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (g && !g.moved) {
      // plain click: bring the playhead onto the item if it isn't already
      const it = (getState().doc as Doc)[g.track]?.[g.index];
      if (!it) return;
      const now = getPlayback().frame / fps;
      const span = g.track === "segments" ? segmentSpans(getState().doc)[g.index] : null;
      const s = span ? span.start : startOf(g.track, it);
      const en = span ? span.end : POINT_TRACKS.has(g.track) ? s : endOf(g.track, it);
      if (now < s - 1e-6 || now > en + 1e-6) seek(Math.ceil(s * fps));
    }
  };

  const startDrag = (e: React.PointerEvent, b: Block, mode: Drag["mode"]) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    pause();
    select({ track: b.track, index: b.index });
    drag.current = {
      mode,
      track: b.track,
      index: b.index,
      x0: e.clientX,
      orig: { start: b.start, end: b.track === "segments" ? b.end : POINT_TRACKS.has(b.track) ? b.start : endOf(b.track, b.item) },
      gesture: String(++gestureSeq),
      moved: false,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // ---- scrubbing on the ruler / empty lanes ------------------------------------------

  const xToSec = (clientX: number) => {
    const el = scroller.current!;
    const r = el.getBoundingClientRect();
    return clamp((clientX - r.left + el.scrollLeft - HEAD_W) / pps, 0, total);
  };
  const scrub = (e: React.PointerEvent, deselect: boolean) => {
    if (e.button !== 0) return;
    if (deselect) select(null);
    seek(Math.round(xToSec(e.clientX) * fps));
    const move = (ev: PointerEvent) => seek(Math.round(xToSec(ev.clientX) * fps));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // ctrl/cmd + wheel zooms around the cursor
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - HEAD_W;
      setPps((p) => {
        const t = (x + el.scrollLeft) / p;
        const np = clamp(p * Math.exp(-e.deltaY * 0.002), 10, 800);
        requestAnimationFrame(() => (el.scrollLeft = t * np - x));
        return np;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const fit = () => {
    const w = scroller.current?.clientWidth ?? 800;
    setPps(clamp((w - HEAD_W - 30) / Math.max(1, total), 10, 800));
  };

  return (
    <div className="timeline">
      <div className="tl-toolbar">
        <span className="muted">Timeline</span>
        <button className="btn sm" onClick={() => setPps((p) => clamp(p / 1.4, 10, 800))} title="Zoom out (Ctrl/⌘ + wheel)">
          −
        </button>
        <button className="btn sm" onClick={() => setPps((p) => clamp(p * 1.4, 10, 800))} title="Zoom in (Ctrl/⌘ + wheel)">
          +
        </button>
        <button className="btn sm" onClick={fit}>
          Fit
        </button>
        <span className="muted hint">
          Drag to move · drag edges to trim · snaps to word boundaries (hold Alt to disable) · double-click a caption to
          edit · ←/→ nudge one frame
        </span>
      </div>
      <div className="tl-scroll" ref={scroller}>
        <div className="tl-inner" style={{ width: HEAD_W + width + 40 }}>
          <div className="tl-ruler" style={{ height: RULER_H }}>
            <div className="tl-head ruler-head">{total.toFixed(2)}s</div>
            <div className="tl-ruler-area" style={{ width }} onPointerDown={(e) => scrub(e, false)}>
              <Ruler pps={pps} total={total} />
              {segBounds.map((t, i) => (
                <div key={i} className="seg-bound" style={{ left: t * pps }} title={`jump cut @ ${t.toFixed(2)}s`} />
              ))}
            </div>
          </div>
          {rows.map(({ track, blocks, lanes }) => (
            <div className={`tl-row tr-${track}`} key={track} style={{ height: lanes * LANE_H + 6 }}>
              <div className="tl-head">
                <span>{TRACK_LABEL[track]}</span>
                {track === "segments" ? (
                  <span className="muted small" title={`source: ${doc.source}${doc.subject ? `\nsubject cutout: ${doc.subject}` : ""}`}>
                    ⓘ
                  </span>
                ) : (
                  <AddButton track={track} />
                )}
              </div>
              <div className="tl-area" style={{ width }} onPointerDown={(e) => scrub(e, true)}>
                {blocks.map((b) => {
                  const selected = sel?.track === track && sel.index === b.index;
                  const point = track === "cuts";
                  const left = b.start * pps;
                  const w = point ? 12 : Math.max(4, (b.end - b.start) * pps);
                  const err = errIdx.get(`${track}:${b.index}`);
                  const hero = track === "words" && doc.captionTheme?.hero === b.index;
                  const cls = [
                    "blk",
                    `blk-${track}`,
                    track === "broll" ? `g-${KIND_GROUP[b.item.kind] ?? "text"}` : "",
                    track === "words" && b.item.emphasis ? "emph" : "",
                    selected ? "sel" : "",
                    err ? (err.startsWith("error") ? "err" : "warn") : "",
                  ].join(" ");
                  return (
                    <div
                      key={`${track}-${b.index}`}
                      className={cls}
                      style={{
                        left: point ? left - 6 : left,
                        width: w,
                        top: 3 + b.lane * LANE_H,
                        height: LANE_H - 3,
                      }}
                      title={`${labelFor(track, b.item)}\n${b.start.toFixed(2)}s${point ? "" : ` → ${b.end.toFixed(2)}s`}${err ? `\n${err}` : ""}`}
                      onPointerDown={(e) => startDrag(e, b, "move")}
                      onDoubleClick={() => {
                        if (track === "words") setState({ editingWord: b.index });
                      }}
                    >
                      {track === "sfx" ? (
                        <span className="vol" style={{ height: `${Math.round((b.item.volume ?? 0.3) * 100)}%` }} />
                      ) : null}
                      {track === "words" && editingWord === b.index ? (
                        <WordInput index={b.index} initial={b.item.text} />
                      ) : (
                        <span className="blk-label">
                          {hero ? "★ " : ""}
                          {labelFor(track, b.item)}
                        </span>
                      )}
                      {!point && track !== "sfx" && track !== "segments" ? (
                        <>
                          <span className="h h-l" onPointerDown={(e) => startDrag(e, b, "start")} />
                          <span className="h h-r" onPointerDown={(e) => startDrag(e, b, "end")} />
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {guide !== null ? <div className="snap-guide" style={{ left: HEAD_W + guide * pps }} /> : null}
          <Playhead pps={pps} fps={fps} scroller={scroller} />
        </div>
      </div>
    </div>
  );
}

function Ruler({ pps, total }: { pps: number; total: number }) {
  const steps = [0.1, 0.25, 0.5, 1, 2, 5, 10, 30];
  const step = steps.find((s) => s * pps >= 64) ?? 30;
  const minor = step / (step >= 1 && step !== 2 ? 5 : 4);
  const ticks: React.ReactNode[] = [];
  for (let t = 0; t <= total + 1e-6; t += minor) {
    const major = Math.abs(t / step - Math.round(t / step)) < 1e-6;
    ticks.push(
      <div key={t.toFixed(3)} className={major ? "tick major" : "tick"} style={{ left: t * pps }}>
        {major ? <span>{t >= 60 ? `${Math.floor(t / 60)}:${(t % 60).toFixed(step < 1 ? 1 : 0).padStart(2, "0")}` : `${+t.toFixed(2)}s`}</span> : null}
      </div>,
    );
  }
  return <>{ticks}</>;
}

function Playhead({ pps, fps, scroller }: { pps: number; fps: number; scroller: React.RefObject<HTMLDivElement | null> }) {
  const frame = usePlayback((p) => p.frame);
  const playing = usePlayback((p) => p.playing);
  const x = HEAD_W + (frame / fps) * pps;
  useEffect(() => {
    const el = scroller.current;
    if (!el || !playing) return;
    if (x < el.scrollLeft + HEAD_W || x > el.scrollLeft + el.clientWidth - 40) el.scrollLeft = x - HEAD_W - 60;
  }, [x, playing, scroller]);
  return <div className="playhead" style={{ left: x }} />;
}

function AddButton({ track }: { track: TrackKey }) {
  const [at, setAt] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!at) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.(".menu")) setAt(null);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [at]);
  if (track !== "broll") {
    return (
      <button
        className="btn xs"
        title={track === "words" ? "Add a word at the playhead" : `Add to ${TRACK_LABEL[track]} at the playhead`}
        onClick={() => addItem(track)}
      >
        +
      </button>
    );
  }
  return (
    <>
      <button
        className="btn xs"
        title="Add b-roll at the playhead"
        onClick={(e) => setAt(at ? null : (e.currentTarget as HTMLElement).getBoundingClientRect())}
      >
        +
      </button>
      {at
        ? createPortal(
            // portal + fixed: the sticky track headers would otherwise paint over the menu
            <div className="menu" style={{ position: "fixed", left: at.left, bottom: window.innerHeight - at.top + 4 }}>
              <div className="menu-title">Add b-roll at playhead</div>
              {brollKinds.map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setAt(null);
                    addItem("broll", k);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function WordInput({ index, initial }: { index: number; initial: string }) {
  const [v, setV] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const commit = (next: number | null) => {
    if (done.current) return;
    done.current = true;
    const text = v.trim();
    if (text && text !== initial) {
      apply((d) => {
        d.words[index].text = text;
      });
    }
    const n = (getState().doc?.words as Item[] | undefined)?.length ?? 0;
    if (next !== null && next >= 0 && next < n) {
      select({ track: "words", index: next });
      setState({ editingWord: next });
    } else setState({ editingWord: null });
  };
  return (
    <input
      ref={ref}
      className="word-input"
      value={v}
      onChange={(e) => setV(e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") commit(null);
        if (e.key === "Escape") {
          done.current = true;
          setState({ editingWord: null });
        }
        if (e.key === "Tab") {
          e.preventDefault();
          commit(index + (e.shiftKey ? -1 : 1));
        }
      }}
      onBlur={() => commit(null)}
    />
  );
}
