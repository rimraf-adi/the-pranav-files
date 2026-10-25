#!/usr/bin/env node
// Dumps the metadata of every replicated template (src/templates) to JSON: node scripts/templates/dump_templates.mjs [out.json]
import { buildSync } from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
const out = process.argv[2] ?? "out/templates_meta.json";
const r = buildSync({ entryPoints: ["src/templates/registry.generated.ts"], bundle: true, write: false, platform: "node", format: "cjs", external: ["react", "remotion", "react/jsx-runtime"], jsx: "automatic", logLevel: "error" });
const m = { exports: {} };
new Function("module", "exports", "require", r.outputFiles[0].text)(m, m.exports, createRequire(import.meta.url));
const meta = Object.values(m.exports.templates).map(({ Component, ...d }) => d);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(meta, null, 1));
console.log(meta.length, "templates ->", out);
