import path from "node:path";
import { REPO_ROOT } from "@/lib/server/paths";
import { serveFile } from "@/lib/server/serve";

export const dynamic = "force-dynamic";

// The preview render target (fixed path, see the render route).
const OUT = path.join(REPO_ROOT, "out", "preview.mp4");

export const GET = (req: Request) => serveFile(OUT, req);
export const HEAD = (req: Request) => serveFile(OUT, req, true);
