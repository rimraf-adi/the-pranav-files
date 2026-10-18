// Serves the repo's public/ folder so staticFile() paths work inside the Player.
import { insidePublic } from "@/lib/server/paths";
import { serveFile } from "@/lib/server/serve";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: Request, ctx: Ctx, head: boolean) {
  const { path } = await ctx.params;
  const abs = insidePublic(path.map(decodeURIComponent).join("/"));
  if (!abs) return new Response("not found", { status: 404 });
  return serveFile(abs, req, head);
}

export const GET = (req: Request, ctx: Ctx) => handle(req, ctx, false);
export const HEAD = (req: Request, ctx: Ctx) => handle(req, ctx, true);
