import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/** The Remotion repo this editor belongs to (the folder above editor/ by default). */
export const REPO_ROOT = process.env.MOTION_REPO_ROOT
  ? path.resolve(process.env.MOTION_REPO_ROOT)
  : path.resolve(process.cwd(), "..");
export const PUBLIC_DIR = path.join(REPO_ROOT, "public");
export const PROJECTS_DIR = path.join(PUBLIC_DIR, "projects");

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function projectDir(name: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new HttpError(400, "bad project name");
  return path.join(PROJECTS_DIR, name);
}

export const timelinePath = (name: string) => path.join(projectDir(name), "timeline.json");

/** Resolve a /public-relative path; null if it escapes public/ or touches a dotfile. */
export function insidePublic(rel: string): string | null {
  const clean = rel.replace(/^\/+/, "");
  if (clean.split("/").some((seg) => seg.startsWith("."))) return null;
  const abs = path.resolve(PUBLIC_DIR, clean);
  return abs.startsWith(PUBLIC_DIR + path.sep) ? abs : null;
}

export const sha1 = (buf: Buffer | string) => crypto.createHash("sha1").update(buf).digest("hex");

export async function readTimeline(name: string): Promise<{ text: string; hash: string }> {
  const text = await fs.readFile(timelinePath(name), "utf8");
  return { text, hash: sha1(text) };
}

export const errorResponse = (e: unknown) => {
  if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
  const code = (e as NodeJS.ErrnoException)?.code;
  if (code === "ENOENT") return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ error: String((e as Error)?.message ?? e) }, { status: 500 });
};
