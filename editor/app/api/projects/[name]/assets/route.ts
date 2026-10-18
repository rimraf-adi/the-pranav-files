import fs from "node:fs/promises";
import path from "node:path";
import { PUBLIC_DIR, errorResponse, projectDir } from "@/lib/server/paths";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ name: string }> };

export type Asset = { path: string; kind: "image" | "audio" | "video"; size: number };

const KIND: Record<string, Asset["kind"]> = {
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".webp": "image",
  ".gif": "image",
  ".svg": "image",
  ".mp3": "audio",
  ".wav": "audio",
  ".m4a": "audio",
  ".aac": "audio",
  ".ogg": "audio",
  ".mp4": "video",
  ".webm": "video",
  ".mov": "video",
};

async function walk(dir: string, out: Asset[], depth: number) {
  if (depth > 5) return;
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(abs, out, depth + 1);
      continue;
    }
    const kind = KIND[path.extname(e.name).toLowerCase()];
    if (!kind) continue;
    const st = await fs.stat(abs);
    out.push({ path: path.relative(PUBLIC_DIR, abs).split(path.sep).join("/"), kind, size: st.size });
  }
}

/**
 * Media under public/ as /public-relative paths: this project's assets first, then public/shared/,
 * then other projects (timelines may reference another project's assets). renders/ is skipped.
 */
export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { name } = await ctx.params;
    const own = path.relative(PUBLIC_DIR, projectDir(name)).split(path.sep).join("/") + "/";
    const all: Asset[] = [];
    await walk(PUBLIC_DIR, all, -1);
    const rank = (p: string) =>
      p.startsWith(own) ? (p.includes("/assets/") ? 0 : 1) : p.startsWith("shared/") ? 2 : 3;
    const assets = all
      .filter((a) => !a.path.startsWith("renders/"))
      .sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path));
    return Response.json({ assets });
  } catch (e) {
    return errorResponse(e);
  }
}
