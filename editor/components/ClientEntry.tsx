"use client";
import dynamic from "next/dynamic";

// The Remotion code touches window/fonts at import time, so the editor never renders on the server.
const EditorApp = dynamic(() => import("./EditorApp").then((m) => m.EditorApp), {
  ssr: false,
  loading: () => <div className="loading">Loading editor…</div>,
});

export function ClientEntry({ name }: { name: string }) {
  return <EditorApp name={name} />;
}
