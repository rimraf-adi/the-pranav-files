// Server-sent events: fires `change` whenever timeline.json's content changes on disk
// (another agent session, a python script, or our own save; the client compares hashes).
import fs from "node:fs";
import { projectDir, readTimeline } from "@/lib/server/paths";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ name: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { name } = await ctx.params;
  let dir: string;
  try {
    dir = projectDir(name);
  } catch {
    return new Response("bad project", { status: 400 });
  }
  const enc = new TextEncoder();
  const hashNow = async () => {
    try {
      return (await readTimeline(name)).hash;
    } catch {
      return null;
    }
  };

  let cleanup = () => {};
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          cleanup();
        }
      };
      let last = await hashNow();
      let timer: ReturnType<typeof setTimeout> | undefined;
      // Watch the folder, not the file: writers that replace the file (rename) would orphan a file watch.
      const watcher = fs.watch(dir, (_evt, filename) => {
        if (filename && filename !== "timeline.json") return;
        clearTimeout(timer);
        timer = setTimeout(async () => {
          const h = await hashNow();
          if (h && h !== last) {
            last = h;
            send("change", { hash: h });
          }
        }, 150);
      });
      const ping = setInterval(() => {
        try {
          controller.enqueue(enc.encode(`: ping\n\n`));
        } catch {
          cleanup();
        }
      }, 15000);
      cleanup = () => {
        watcher.close();
        clearInterval(ping);
        clearTimeout(timer);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      req.signal.addEventListener("abort", () => cleanup());
      send("hello", { hash: last });
    },
    cancel() {
      cleanup();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
