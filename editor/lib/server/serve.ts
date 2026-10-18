import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".geojson": "application/geo+json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".md": "text/markdown; charset=utf-8",
};

export const contentType = (file: string) =>
  TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";

/** Serve a file with HTTP Range support (the Player's video decoders seek with ranges). */
export async function serveFile(abs: string, req: Request, head = false): Promise<Response> {
  let stat;
  try {
    stat = await fs.stat(abs);
  } catch {
    return new Response("not found", { status: 404 });
  }
  if (!stat.isFile()) return new Response("not found", { status: 404 });

  const size = stat.size;
  const headers: Record<string, string> = {
    "Content-Type": contentType(abs),
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
    "Last-Modified": stat.mtime.toUTCString(),
  };
  const range = req.headers.get("range");
  let start = 0;
  let end = size - 1;
  let status = 200;
  const m = range ? range.match(/bytes=(\d*)-(\d*)/) : null;
  if (m) {
    if (m[1] === "" && m[2] !== "") {
      start = Math.max(0, size - Number(m[2]));
    } else {
      start = Number(m[1] || 0);
      if (m[2] !== "") end = Math.min(Number(m[2]), size - 1);
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }
  headers["Content-Length"] = String(end - start + 1);
  if (head || size === 0) return new Response(null, { status, headers });
  const stream = Readable.toWeb(createReadStream(abs, { start, end })) as ReadableStream;
  return new Response(stream, { status, headers });
}
