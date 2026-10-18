// Runs the half-scale preview render and streams progress as NDJSON:
//   npx remotion render Reel out/preview.mp4 --props=public/projects/<name>/timeline.json --scale=0.5
// One render at a time. DELETE stops only the process group this route spawned.
import { spawn, type ChildProcess } from "node:child_process";
import { REPO_ROOT, errorResponse, projectDir } from "@/lib/server/paths";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ name: string }> };

export type RenderEvent =
  | { type: "start"; project: string; command: string }
  | { type: "log"; line: string }
  | { type: "progress"; stage: string; pct: number; label: string }
  | { type: "done"; code: number | null; ok: boolean; output: string };

type Job = {
  project: string;
  child: ChildProcess;
  events: RenderEvent[];
  listeners: Set<(e: RenderEvent) => void>;
  finished: boolean;
};

const g = globalThis as unknown as { __motionRenderJob?: Job };

const OUTPUT = "out/preview.mp4";

/** Remotion's CLI progress lines -> overall percent. Bundling ~10%, rendering ~80%, encoding ~10%. */
function parseProgress(line: string): RenderEvent | null {
  let m = line.match(/Bundl\w*[^\d]*(\d+)%/i);
  if (m) return { type: "progress", stage: "bundling", pct: Math.round(Number(m[1]) * 0.1), label: line.trim() };
  m = line.match(/Rendered\s+(\d+)\s*\/\s*(\d+)/i) ?? line.match(/Rendering[^\d]*(\d+)\s*\/\s*(\d+)/i);
  if (m) {
    const r = Number(m[1]) / Math.max(1, Number(m[2]));
    return { type: "progress", stage: "rendering", pct: Math.round(10 + r * 80), label: line.trim() };
  }
  m = line.match(/(?:Encoded|Stitched|Encoding)[^\d]*(\d+)\s*\/\s*(\d+)/i);
  if (m) {
    const r = Number(m[1]) / Math.max(1, Number(m[2]));
    return { type: "progress", stage: "encoding", pct: Math.round(90 + r * 10), label: line.trim() };
  }
  return null;
}

// Strip ANSI colour codes from CLI output.
// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]/g;

function startJob(project: string): Job {
  const args = [
    "remotion",
    "render",
    "Reel",
    OUTPUT,
    `--props=public/projects/${project}/timeline.json`,
    "--scale=0.5",
  ];
  // Don't leak Next's own dev-server env into the CLI.
  const env: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (k === "NODE_ENV" || k.startsWith("__NEXT") || k.startsWith("NEXT_") || k === "NODE_OPTIONS") continue;
    env[k] = v;
  }
  env.FORCE_COLOR = "0";
  env.CI = "1";
  const child = spawn("npx", args, { cwd: REPO_ROOT, env: env as NodeJS.ProcessEnv, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  const job: Job = { project, child, events: [], listeners: new Set(), finished: false };
  const emit = (e: RenderEvent) => {
    job.events.push(e);
    if (job.events.length > 600) job.events.splice(1, job.events.length - 600);
    job.listeners.forEach((l) => l(e));
  };
  emit({ type: "start", project, command: `npx ${args.join(" ")}` });
  const onData = (buf: Buffer) => {
    for (const raw of buf.toString("utf8").split(/[\r\n]+/)) {
      const line = raw.replace(ANSI, "").trimEnd();
      if (!line.trim()) continue;
      const p = parseProgress(line);
      if (p) emit(p);
      else emit({ type: "log", line });
    }
  };
  child.stdout?.on("data", onData);
  child.stderr?.on("data", onData);
  const finish = (code: number | null) => {
    if (job.finished) return;
    job.finished = true;
    emit({ type: "done", code, ok: code === 0, output: OUTPUT });
  };
  child.on("error", (err) => {
    emit({ type: "log", line: `failed to start: ${err.message}` });
    finish(-1);
  });
  child.on("close", (code) => finish(code));
  return job;
}

function streamJob(job: Job, signal: AbortSignal): Response {
  const enc = new TextEncoder();
  let off = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const write = (e: RenderEvent) => {
        try {
          controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
          if (e.type === "done") {
            off();
            controller.close();
          }
        } catch {
          off();
        }
      };
      job.events.forEach(write);
      if (job.finished) return;
      job.listeners.add(write);
      off = () => job.listeners.delete(write);
      signal.addEventListener("abort", () => off());
    },
    cancel() {
      off();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
  });
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { name } = await ctx.params;
    projectDir(name); // validates the name
    const cur = g.__motionRenderJob;
    if (cur && !cur.finished) {
      return Response.json({ error: `a render of "${cur.project}" is already running` }, { status: 409 });
    }
    g.__motionRenderJob = startJob(name);
    return streamJob(g.__motionRenderJob, req.signal);
  } catch (e) {
    return errorResponse(e);
  }
}

/** Re-attach to the current (or last) render, e.g. after a page reload. */
export async function GET(req: Request, ctx: Ctx) {
  const { name } = await ctx.params;
  const cur = g.__motionRenderJob;
  if (!cur || cur.project !== name) return Response.json({ idle: true });
  return streamJob(cur, req.signal);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { name } = await ctx.params;
  const cur = g.__motionRenderJob;
  if (!cur || cur.finished || cur.project !== name) return Response.json({ stopped: false });
  try {
    // Negative pid = the process group we spawned (npx + remotion + its browser), nothing else.
    if (cur.child.pid) process.kill(-cur.child.pid, "SIGTERM");
  } catch {
    cur.child.kill("SIGTERM");
  }
  return Response.json({ stopped: true });
}
