// Shared by the browser (inline errors) and the save route (authoritative check before writing).
// The schema itself is imported from ../src, never duplicated here.
import { timeline } from "@reel/schema/timeline";

export type Issue = {
  path: (string | number)[];
  message: string;
  /** "error" blocks saving; "warning" is shown but does not */
  level: "error" | "warning";
};

const DEVANAGARI = /[ऀ-ॿ꣠-ꣿ]/;

type Loose = Record<string, unknown>;
const arr = (v: unknown): Loose[] => (Array.isArray(v) ? (v as Loose[]) : []);

/** Fields that hold a /public path and break the render when empty. */
const assetPaths = (doc: Loose): { path: (string | number)[]; value: unknown }[] => {
  const out: { path: (string | number)[]; value: unknown }[] = [];
  arr(doc.broll).forEach((b, i) => {
    if (["image", "product"].includes(b.kind as string)) out.push({ path: ["broll", i, "src"], value: b.src });
    if (b.kind === "montage") arr(b.shots).forEach((s, k) => out.push({ path: ["broll", i, "shots", k, "src"], value: s.src }));
    if ("bg" in b) out.push({ path: ["broll", i, "bg"], value: b.bg });
  });
  arr(doc.sfx).forEach((s, i) => out.push({ path: ["sfx", i, "src"], value: s.src }));
  arr(doc.cards).forEach((c, i) => {
    const media = arr((c.content as Loose | undefined)?.media);
    media.forEach((m, k) => out.push({ path: ["cards", i, "content", "media", k, "src"], value: m.src }));
  });
  return out;
};

export function validateTimeline(doc: unknown, knownFiles?: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const r = timeline.safeParse(doc);
  if (!r.success) {
    for (const i of r.error.issues) {
      issues.push({
        path: i.path.filter((p): p is string | number => typeof p !== "symbol"),
        message: i.message,
        level: "error",
      });
    }
  }
  if (!doc || typeof doc !== "object") return issues;
  const d = doc as Loose;

  // AGENTS.md: captions are Roman-script Hinglish, never Devanagari.
  arr(d.words).forEach((w, i) => {
    if (typeof w.text === "string" && DEVANAGARI.test(w.text)) {
      issues.push({ path: ["words", i, "text"], message: "Devanagari in a caption: use Roman-script Hinglish", level: "error" });
    }
  });

  // The Reel keys b-roll <Sequence>s by id; duplicates mis-render.
  for (const key of ["broll", "cards"] as const) {
    const seen = new Map<string, number>();
    arr(d[key]).forEach((b, i) => {
      const id = b.id as string;
      if (typeof id !== "string") return;
      if (seen.has(id)) issues.push({ path: [key, i, "id"], message: `Duplicate id "${id}"`, level: "error" });
      else seen.set(id, i);
    });
  }

  for (const a of assetPaths(d)) {
    if (a.value === undefined) continue;
    if (typeof a.value === "string" && a.value.trim() === "") {
      issues.push({ path: a.path, message: "Pick a file (empty path breaks the render)", level: "error" });
    } else if (knownFiles && typeof a.value === "string" && !knownFiles.has(a.value.replace(/^\/+/, ""))) {
      issues.push({ path: a.path, message: `File not found in public/: ${a.value}`, level: "warning" });
    }
  }
  return issues;
}

export const blocking = (issues: Issue[]) => issues.filter((i) => i.level === "error");
