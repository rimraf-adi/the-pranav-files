"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getState, save, useStore } from "@/lib/store";

type Ev =
  | { type: "start"; project: string; command: string }
  | { type: "log"; line: string }
  | { type: "progress"; stage: string; pct: number; label: string }
  | { type: "done"; code: number | null; ok: boolean; output: string };

type RS = {
  phase: "idle" | "running" | "done" | "failed";
  pct: number;
  stage: string;
  label: string;
  command: string;
  lines: string[];
  output?: string;
  finishedAt?: number;
};

const empty: RS = { phase: "idle", pct: 0, stage: "", label: "", command: "", lines: [] };

export function RenderPanel({ onClose }: { onClose: () => void }) {
  const name = useStore((s) => s.name);
  const dirty = useStore((s) => s.dirty);
  const [rs, setRs] = useState<RS>(empty);
  const abort = useRef<AbortController | null>(null);
  const logBox = useRef<HTMLPreElement>(null);

  const consume = useCallback(async (res: Response) => {
    if (!res.body) return;
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    setRs({ ...empty, phase: "running" });
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n");
      buf = parts.pop() ?? "";
      for (const p of parts) {
        if (!p.trim()) continue;
        const e = JSON.parse(p) as Ev;
        setRs((r) => {
          switch (e.type) {
            case "start":
              return { ...r, command: e.command };
            case "log":
              return { ...r, lines: [...r.lines.slice(-300), e.line] };
            case "progress":
              return { ...r, pct: Math.max(r.pct, e.pct), stage: e.stage, label: e.label };
            case "done":
              return { ...r, phase: e.ok ? "done" : "failed", pct: e.ok ? 100 : r.pct, output: e.output, finishedAt: Date.now() };
          }
        });
      }
    }
  }, []);

  // re-attach to a render that is running (or just finished) for this project
  useEffect(() => {
    const ac = new AbortController();
    abort.current = ac;
    fetch(`/api/projects/${name}/render`, { signal: ac.signal })
      .then(async (res) => {
        if ((res.headers.get("content-type") ?? "").includes("ndjson")) await consume(res);
      })
      .catch(() => {});
    return () => ac.abort();
  }, [name, consume]);

  useEffect(() => {
    logBox.current?.scrollTo(0, logBox.current.scrollHeight);
  }, [rs.lines.length]);

  const start = async () => {
    if (getState().dirty) {
      const ok = window.confirm("The render reads timeline.json from disk. Save your changes first?");
      if (ok && !(await save())) return;
    }
    abort.current?.abort();
    const ac = new AbortController();
    abort.current = ac;
    setRs({ ...empty, phase: "running", label: "starting…" });
    try {
      const res = await fetch(`/api/projects/${name}/render`, { method: "POST", signal: ac.signal });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setRs({ ...empty, phase: "failed", lines: [b.error ?? `HTTP ${res.status}`] });
        return;
      }
      await consume(res);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setRs((r) => ({ ...r, phase: "failed", lines: [...r.lines, String(e)] }));
    }
  };

  const stop = async () => {
    await fetch(`/api/projects/${name}/render`, { method: "DELETE" });
  };

  return (
    <div className="modal-back" onPointerDown={onClose}>
      <div className="modal render" onPointerDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <b>Render preview</b>
          <span className="muted small">half scale, reads the saved timeline.json</span>
          <div className="spacer" />
          <button className="btn xs ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="pad">
          <code className="cmd">
            {rs.command ||
              `npx remotion render Reel out/preview.mp4 --props=public/projects/${name}/timeline.json --scale=0.5`}
          </code>
          {dirty && rs.phase !== "running" ? (
            <p className="warn-text small">You have unsaved edits; you'll be asked to save before rendering.</p>
          ) : null}
          <div className="progress">
            <div className={`bar ${rs.phase}`} style={{ width: `${rs.pct}%` }} />
          </div>
          <div className="row small">
            <span>
              {rs.phase === "idle" ? "Not started" : rs.phase === "running" ? `${rs.stage || "working"} · ${rs.pct}%` : null}
              {rs.phase === "done" ? "Done ✓" : null}
              {rs.phase === "failed" ? "Failed / stopped" : null}
            </span>
            <span className="muted ellipsis grow">{rs.label}</span>
          </div>
          <pre className="log" ref={logBox}>
            {rs.lines.join("\n") || " "}
          </pre>
          {rs.phase === "done" ? (
            <div className="render-out">
              <video src={`/api/render-output?t=${rs.finishedAt ?? 0}`} controls />
              <a className="link" href={`/api/render-output?t=${rs.finishedAt ?? 0}`} target="_blank" rel="noreferrer">
                open out/preview.mp4
              </a>
            </div>
          ) : null}
        </div>
        <div className="modal-foot">
          <div className="spacer" />
          {rs.phase === "running" ? (
            <button className="btn danger" onClick={stop}>
              Stop render
            </button>
          ) : (
            <button className="btn primary" onClick={start}>
              {rs.phase === "idle" ? "Start render" : "Render again"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
