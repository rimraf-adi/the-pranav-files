import fs from "node:fs/promises";
import { errorResponse, readTimeline, sha1, timelinePath } from "@/lib/server/paths";
import { blocking, validateTimeline } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ name: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { name } = await ctx.params;
    const { text, hash } = await readTimeline(name);
    let doc: unknown;
    try {
      doc = JSON.parse(text);
    } catch {
      // Usually another process is mid-write; the client retries.
      return Response.json({ error: "timeline.json is not valid JSON (being written?)", hash }, { status: 503 });
    }
    return Response.json({ doc, hash });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Body: { doc, baseHash, force? }. Validates, refuses stale writes (409) unless forced, writes atomically. */
export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { name } = await ctx.params;
    const body = (await req.json()) as { doc: unknown; baseHash?: string; force?: boolean };
    const issues = blocking(validateTimeline(body.doc));
    if (issues.length) return Response.json({ error: "invalid timeline", issues }, { status: 422 });

    const file = timelinePath(name);
    let current: { text: string; hash: string } | null = null;
    try {
      current = await readTimeline(name);
    } catch {
      current = null;
    }
    if (current && !body.force && body.baseHash !== current.hash) {
      let doc: unknown = null;
      try {
        doc = JSON.parse(current.text);
      } catch {
        doc = null;
      }
      return Response.json({ error: "timeline.json changed on disk", hash: current.hash, doc }, { status: 409 });
    }

    // Same layout as the python scripts write (indent 2, UTF-8, trailing newline).
    const text = JSON.stringify(body.doc, null, 2) + "\n";
    const tmp = `${file}.editor-${process.pid}.tmp`;
    await fs.writeFile(tmp, text, "utf8");
    await fs.rename(tmp, file);
    return Response.json({ hash: sha1(text) });
  } catch (e) {
    return errorResponse(e);
  }
}
