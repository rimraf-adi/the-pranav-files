"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { blocking } from "@/lib/validate";
import { redo, save, select, setAutosave, undo, useStore } from "@/lib/store";
import type { TrackKey } from "@/lib/schema";
import { RenderPanel } from "./RenderPanel";

const TRACKS = new Set(["segments", "words", "broll", "cards", "titles", "cuts", "sfx"]);

export function TopBar() {
  const name = useStore((s) => s.name);
  const dirty = useStore((s) => s.dirty);
  const saving = useStore((s) => s.saving);
  const issues = useStore((s) => s.issues);
  const canUndo = useStore((s) => s.past.length > 0);
  const canRedo = useStore((s) => s.future.length > 0);
  const autosave = useStore((s) => s.autosave);
  const [showIssues, setShowIssues] = useState(false);
  const [showRender, setShowRender] = useState(false);
  const errs = blocking(issues);
  const warns = issues.length - errs.length;
  const pop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showIssues) return;
    const close = (e: PointerEvent) => {
      if (!pop.current?.contains(e.target as Node)) setShowIssues(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [showIssues]);

  const status = saving
    ? { t: "Saving…", c: "info" }
    : errs.length
      ? { t: `${errs.length} error${errs.length > 1 ? "s" : ""}: not saveable`, c: "error" }
      : dirty
        ? { t: "Unsaved changes", c: "warn" }
        : { t: "Saved", c: "ok" };

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        Motion Editor
      </Link>
      <span className="proj">
        public/projects/<b>{name}</b>/timeline.json
      </span>
      <span className={`status ${status.c}`}>{status.t}</span>
      <div className="spacer" />
      <button className="btn" onClick={undo} disabled={!canUndo} title="Undo (⌘Z)">
        ↶ Undo
      </button>
      <button className="btn" onClick={redo} disabled={!canRedo} title="Redo (⇧⌘Z)">
        ↷ Redo
      </button>
      <div className="issues-wrap" ref={pop}>
        <button
          className={`btn ${errs.length ? "danger" : warns ? "warnbtn" : ""}`}
          onClick={() => setShowIssues((v) => !v)}
          title="Schema validation (src/schema/timeline.ts)"
        >
          {issues.length ? `${errs.length} errors · ${warns} warnings` : "✓ Valid"}
        </button>
        {showIssues ? (
          <div className="issues-pop">
            {issues.length === 0 ? <div className="muted pad">timeline.json validates against the schema.</div> : null}
            {issues.map((i, k) => (
              <button
                key={k}
                className={`issue ${i.level}`}
                onClick={() => {
                  if (TRACKS.has(String(i.path[0])) && typeof i.path[1] === "number") {
                    select({ track: i.path[0] as TrackKey, index: i.path[1] });
                  }
                  setShowIssues(false);
                }}
              >
                <code>{i.path.join(".") || "(root)"}</code> {i.message}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <label className="check" title="Save automatically ~1s after each valid edit">
        <input type="checkbox" checked={autosave} onChange={(e) => setAutosave(e.target.checked)} /> Autosave
      </label>
      <button className="btn primary" onClick={() => save()} disabled={saving || !dirty || errs.length > 0} title="Save (⌘S)">
        Save
      </button>
      <button className="btn" onClick={() => setShowRender(true)} title="npx remotion render … --scale=0.5">
        Render preview
      </button>
      {showRender ? <RenderPanel onClose={() => setShowRender(false)} /> : null}
    </header>
  );
}
