"use client";
// A small undoable store. `doc` is the raw timeline.json object exactly as on disk plus edits
// (schema defaults are NOT expanded, so saves keep the file's shape).
import { produce, type Draft } from "immer";
import { useSyncExternalStore } from "react";
import type { TrackKey } from "./schema";
import { blocking, validateTimeline, type Issue } from "./validate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Doc = Record<string, any>;
export type Sel = { track: TrackKey; index: number } | null;
export type Toast = { text: string; kind: "info" | "error" | "ok"; id: number };

export type State = {
  name: string;
  doc: Doc | null;
  /** last doc with no blocking issues; this is what the Player renders */
  validDoc: Doc | null;
  issues: Issue[];
  baseHash: string | null;
  savedJson: string;
  dirty: boolean;
  past: Doc[];
  future: Doc[];
  lastKey: string | null;
  lastKeyAt: number;
  sel: Sel;
  conflict: { hash: string; doc: Doc | null } | null;
  saving: boolean;
  toast: Toast | null;
  knownFiles: Set<string> | null;
  editingWord: number | null;
  autosave: boolean;
};

const initial = (name: string): State => ({
  name,
  doc: null,
  validDoc: null,
  issues: [],
  baseHash: null,
  savedJson: "",
  dirty: false,
  past: [],
  future: [],
  lastKey: null,
  lastKeyAt: 0,
  sel: null,
  conflict: null,
  saving: false,
  toast: null,
  knownFiles: null,
  editingWord: null,
  autosave: false,
});

let state: State = initial("");
const listeners = new Set<() => void>();

export const getState = () => state;
export function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(state),
    () => sel(state),
  );
}

function derive(doc: Doc, s: State): Partial<State> {
  const issues = validateTimeline(doc, s.knownFiles ?? undefined);
  const ok = blocking(issues).length === 0;
  return {
    issues,
    validDoc: ok ? doc : s.validDoc,
    dirty: JSON.stringify(doc) !== s.savedJson,
  };
}

export function reset(name: string) {
  const autosave = typeof window !== "undefined" && window.localStorage?.getItem("motion-editor:autosave") === "1";
  state = { ...initial(name), autosave };
  listeners.forEach((l) => l());
}

/** Replace the document with what is on disk. History is cleared: undo must never resurrect a stale file. */
export function loadFromDisk(doc: Doc, hash: string, keepHistory = false) {
  const s = state;
  const savedJson = JSON.stringify(doc);
  const base = { ...s, savedJson };
  const sel = s.sel && Array.isArray(doc[s.sel.track]) && s.sel.index < doc[s.sel.track].length ? s.sel : null;
  setState({
    doc,
    baseHash: hash,
    savedJson,
    past: keepHistory && s.doc ? [...s.past, s.doc] : [],
    future: [],
    lastKey: null,
    conflict: null,
    sel,
    ...derive(doc, base),
  });
}

/**
 * Apply an immer recipe. Edits sharing `key` coalesce into one undo step: keys starting
 * with "g:" (a drag gesture) always coalesce, other keys (typing in a field) within 1.2s.
 */
export function apply(recipe: (d: Draft<Doc>) => void, opts: { key?: string } = {}) {
  const s = state;
  if (!s.doc) return;
  const next = produce(s.doc, recipe);
  if (next === s.doc) return;
  const now = Date.now();
  const k = opts.key ?? null;
  const coalesce = k !== null && s.lastKey === k && (k.startsWith("g:") || now - s.lastKeyAt < 1200);
  setState({
    doc: next,
    past: coalesce ? s.past : [...s.past, s.doc].slice(-300),
    future: [],
    lastKey: k,
    lastKeyAt: now,
    ...derive(next, s),
  });
}

export function undo() {
  const s = state;
  if (!s.doc || !s.past.length) return;
  const prev = s.past[s.past.length - 1];
  setState({
    doc: prev,
    past: s.past.slice(0, -1),
    future: [s.doc, ...s.future],
    lastKey: null,
    sel: fixSel(prev, s.sel),
    ...derive(prev, s),
  });
}

export function redo() {
  const s = state;
  if (!s.doc || !s.future.length) return;
  const next = s.future[0];
  setState({
    doc: next,
    past: [...s.past, s.doc],
    future: s.future.slice(1),
    lastKey: null,
    sel: fixSel(next, s.sel),
    ...derive(next, s),
  });
}

const fixSel = (doc: Doc, sel: Sel): Sel =>
  sel && Array.isArray(doc[sel.track]) && sel.index < doc[sel.track].length ? sel : null;

export const select = (sel: Sel) => setState({ sel, editingWord: null });

let toastId = 0;
export function toast(text: string, kind: Toast["kind"] = "info") {
  const id = ++toastId;
  setState({ toast: { text, kind, id } });
  setTimeout(() => {
    if (state.toast?.id === id) setState({ toast: null });
  }, kind === "error" ? 6000 : 3000);
}

export function setKnownFiles(files: Set<string>) {
  setState((s) => ({ knownFiles: files, ...(s.doc ? derive(s.doc, { ...s, knownFiles: files }) : {}) }));
}

export function setAutosave(on: boolean) {
  try {
    window.localStorage.setItem("motion-editor:autosave", on ? "1" : "0");
  } catch {
    /* storage blocked */
  }
  setState({ autosave: on });
}

// ---- persistence --------------------------------------------------------------------------

export async function save(force = false): Promise<boolean> {
  const s = state;
  if (!s.doc || s.saving) return false;
  const errs = blocking(s.issues);
  if (errs.length) {
    toast(`Not saved: ${errs.length} validation error${errs.length > 1 ? "s" : ""}`, "error");
    return false;
  }
  const doc = s.doc;
  setState({ saving: true });
  try {
    const res = await fetch(`/api/projects/${s.name}/timeline`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc, baseHash: s.baseHash, force }),
    });
    const body = await res.json();
    if (res.status === 409) {
      setState({ conflict: { hash: body.hash, doc: body.doc } });
      toast("timeline.json changed on disk; not saved", "error");
      return false;
    }
    if (res.status === 422) {
      setState({ issues: body.issues });
      toast("Server rejected the timeline (validation)", "error");
      return false;
    }
    if (!res.ok) throw new Error(body.error ?? res.statusText);
    const savedJson = JSON.stringify(doc);
    setState((cur) => ({
      baseHash: body.hash,
      savedJson,
      conflict: null,
      dirty: JSON.stringify(cur.doc) !== savedJson,
    }));
    toast("Saved timeline.json", "ok");
    return true;
  } catch (e) {
    toast(`Save failed: ${(e as Error).message}`, "error");
    return false;
  } finally {
    setState({ saving: false });
  }
}

export async function fetchDisk(name: string): Promise<{ doc: Doc; hash: string }> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`/api/projects/${name}/timeline`, { cache: "no-store" });
    if (res.ok) return res.json();
    // 503 = file is mid-write by another process; retry briefly.
    if (res.status !== 503 || attempt > 8) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.error ?? `HTTP ${res.status}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}
