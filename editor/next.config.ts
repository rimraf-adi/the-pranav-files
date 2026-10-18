import path from "node:path";
import type { NextConfig } from "next";

const appDir = __dirname;
const repoRoot = path.resolve(appDir, "..");

const config: NextConfig = {
  // The Reel composition and the zod schema live in ../src (outside this app).
  experimental: { externalDir: true },
  outputFileTracingRoot: repoRoot,
  devIndicators: false,
  webpack: (cfg) => {
    // ../src imports "remotion", "zod" and "@remotion/*". Resolve every bare import from this app's
    // node_modules first, so the Player and the Reel share ONE remotion instance (two copies break
    // remotion's React contexts and the player shows nothing).
    cfg.resolve.modules = [
      path.join(appDir, "node_modules"),
      ...(cfg.resolve.modules ?? ["node_modules"]),
    ];
    return cfg;
  },
  async rewrites() {
    // staticFile("projects/demo/x.jpg") resolves to "/projects/demo/x.jpg" inside the Player.
    // Anything Next doesn't own is served from the repo's public/ folder.
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/:path*", destination: "/api/static/:path*" }],
    };
  },
};

export default config;
