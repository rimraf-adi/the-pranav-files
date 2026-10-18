"use client";
import React, { useEffect, useRef, useState } from "react";
import { loadAssets } from "@/lib/assets";
import { deleteSel, duplicateSel, fpsOf, mergeWords, nowSec, nudgeSel, splitWord, totalOf } from "@/lib/ops";
import { getPlayback, seek, togglePlay } from "@/lib/playback";
import {
  apply,
  fetchDisk,
  getState,
  loadFromDisk,
  redo,
  reset,
  save,
  select,
  setState,
  toast,
  undo,
  useStore,
} from "@/lib/store";
import { Inspector } from "./Inspector";
import { PlayerPane } from "./PlayerPane";
import { Timeline } from "./Timeline";
import { TopBar } from "./TopBar";

export type Meta = { themes: string[]; styles: string[]; projects: string[] };
export const MetaContext = React.createContext<Meta>({ themes: [], styles: [], projects: [] });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function EditorApp({ name }: { name: string }) {
  const [meta, setMeta] = useState<Meta>({ themes: [], styles: [], projects: [] });
  const [error, setError] = useState<string | null>(null);
  const loaded = useStore((s) => s.doc !== null);
  const toastMsg = useStore((s) => s.toast);
  const conflict = useStore((s) => s.conflict);
  const [tlHeight, setTlHeight] = useState(320);

  // initial load
  useEffect(() => {
    // a hot-reload remount keeps the in-memory doc (and its unsaved edits)
    if (!(getState().name === name && getState().doc)) {
      reset(name);
      fetchDisk(name)
        .then(({ doc, hash }) => loadFromDisk(doc, hash))
        .catch((e) => setError(String(e.message ?? e)));
    }
    loadAssets(name);
    fetch("/api/meta")
      .then((r) => r.json())
      .then(setMeta)
      .catch(() => {});
  }, [name]);

  // reload when timeline.json changes on disk (another session / script)
  useEffect(() => {
    const es = new EventSource(`/api/projects/${name}/watch`);
    es.addEventListener("change", async (ev) => {
      const { hash } = JSON.parse((ev as MessageEvent).data) as { hash: string };
      while (getState().saving) await sleep(80);
      if (hash === getState().baseHash) return; // our own save
      let disk;
      try {
        disk = await fetchDisk(name);
      } catch {
        return;
      }
      const s = getState();
      if (disk.hash === s.baseHash) return;
      if (!s.dirty) {
        loadFromDisk(disk.doc, disk.hash);
        toast("Reloaded: timeline.json changed on disk", "info");
      } else {
        setState({ conflict: disk });
      }
    });
    return () => es.close();
  }, [name]);

  // optional autosave (debounced, only when valid and not in conflict)
  const autosave = useStore((s) => s.autosave);
  const doc = useStore((s) => s.doc);
  useEffect(() => {
    if (!autosave) return;
    const s = getState();
    if (!s.dirty || s.conflict) return;
    const t = setTimeout(() => {
      const cur = getState();
      if (cur.dirty && !cur.conflict && !cur.saving && !cur.issues.some((i) => i.level === "error")) save();
    }, 1200);
    return () => clearTimeout(t);
  }, [autosave, doc]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      if (mod && k === "s") {
        e.preventDefault();
        save();
        return;
      }
      if (typing) return;
      const s = getState();
      const fps = fpsOf(s.doc);
      if (mod && k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && k === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && k === "d") {
        e.preventDefault();
        duplicateSel();
        return;
      }
      if (mod) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          return;
        case "ArrowLeft":
        case "ArrowRight": {
          e.preventDefault();
          const n = (e.key === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 10 : 1);
          if (s.sel && s.sel.track !== "segments" && !e.altKey) nudgeSel(n);
          else seek(getPlayback().frame + n);
          return;
        }
        case "Delete":
        case "Backspace":
          if (s.sel) {
            e.preventDefault();
            deleteSel();
          }
          return;
        case "Escape":
          select(null);
          return;
        case "Home":
          seek(0);
          return;
        case "End":
          seek(Math.round(totalOf(s.doc) * fps) - 1);
          return;
        case "Enter":
          if (s.sel?.track === "words") {
            e.preventDefault();
            setState({ editingWord: s.sel.index });
          }
          return;
      }
      if (s.sel?.track === "words") {
        if (k === "s") splitWord(s.sel.index, nowSec());
        if (k === "m") mergeWords(s.sel.index);
        if (k === "e") {
          const i = s.sel.index;
          apply((d) => {
            d.words[i].emphasis = !d.words[i].emphasis;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // warn before closing with unsaved edits
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (getState().dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, []);

  const drag = useRef<{ y: number; h: number } | null>(null);

  if (error) {
    return (
      <div className="loading error">
        Could not open project “{name}”: {error}
      </div>
    );
  }
  if (!loaded) return <div className="loading">Loading {name}…</div>;

  return (
    <MetaContext.Provider value={meta}>
      <div className="app" style={{ gridTemplateRows: `auto auto minmax(0, 1fr) 6px ${tlHeight}px` }}>
        <TopBar />
        <div>{conflict ? <ConflictBanner /> : null}</div>
        <div className="main">
          <PlayerPane />
          <Inspector />
        </div>
        <div
          className="splitter"
          onPointerDown={(e) => {
            drag.current = { y: e.clientY, h: tlHeight };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const h = drag.current.h - (e.clientY - drag.current.y);
            setTlHeight(Math.max(160, Math.min(window.innerHeight - 260, h)));
          }}
          onPointerUp={() => (drag.current = null)}
          title="Drag to resize the timeline"
        />
        <Timeline />
      </div>
      {toastMsg ? (
        <div key={toastMsg.id} className={`toast ${toastMsg.kind}`}>
          {toastMsg.text}
        </div>
      ) : null}
    </MetaContext.Provider>
  );
}

function ConflictBanner() {
  const conflict = useStore((s) => s.conflict);
  if (!conflict) return null;
  return (
    <div className="banner">
      <span>
        <b>timeline.json changed on disk</b> (another session or script) while you have unsaved edits.
      </span>
      <button
        className="btn"
        onClick={() => {
          if (conflict.doc) {
            loadFromDisk(conflict.doc, conflict.hash, true);
            toast("Loaded the disk version (your edits are one undo away)", "info");
          }
        }}
        disabled={!conflict.doc}
      >
        Load disk version
      </button>
      <button
        className="btn danger"
        onClick={() => {
          if (window.confirm("Overwrite the newer timeline.json on disk with your version?")) save(true);
        }}
      >
        Overwrite with mine
      </button>
      <button className="btn ghost" onClick={() => setState({ conflict: null })}>
        Decide later
      </button>
    </div>
  );
}
