"use client";
import React, { useEffect, useMemo, useState } from "react";
import { loadAssets, publicUrl, useAssets } from "@/lib/assets";
import { useStore } from "@/lib/store";

const fmtSize = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`);

export function AssetPicker({
  kind,
  value,
  onPick,
  onClose,
}: {
  kind: "image" | "audio" | "video";
  value: string;
  onPick: (path: string) => void;
  onClose: () => void;
}) {
  const name = useStore((s) => s.name);
  const all = useAssets();
  const [q, setQ] = useState("");
  const [manual, setManual] = useState(value);
  useEffect(() => {
    loadAssets(name); // pick up files other sessions added
  }, [name]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const list = useMemo(
    () => all.filter((a) => a.kind === kind && a.path.toLowerCase().includes(q.toLowerCase())),
    [all, kind, q],
  );

  return (
    <div className="modal-back" onPointerDown={onClose}>
      <div className="modal" onPointerDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <b>Pick {kind}</b>
          <input className="txt" autoFocus placeholder="filter…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn xs ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={kind === "image" ? "asset-grid" : "asset-list"}>
          {list.map((a) =>
            kind === "image" ? (
              <button key={a.path} className={`asset-tile ${a.path === value ? "sel" : ""}`} onClick={() => onPick(a.path)} title={a.path}>
                <img src={publicUrl(a.path)} alt="" loading="lazy" />
                <span>{a.path.split("/").slice(-2).join("/")}</span>
              </button>
            ) : (
              <div key={a.path} className={`asset-row ${a.path === value ? "sel" : ""}`}>
                <button className="btn xs ghost" title="Preview" onClick={() => new Audio(publicUrl(a.path)).play()}>
                  ▶
                </button>
                <button className="link grow" onClick={() => onPick(a.path)}>
                  {a.path}
                </button>
                <span className="muted">{fmtSize(a.size)}</span>
              </div>
            ),
          )}
          {list.length === 0 ? <div className="muted pad">No {kind} files under public/.</div> : null}
        </div>
        <div className="modal-foot">
          <input className="txt grow" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="or type a path relative to /public" />
          <button className="btn" onClick={() => onPick(manual.trim())} disabled={!manual.trim()}>
            Use path
          </button>
        </div>
      </div>
    </div>
  );
}
