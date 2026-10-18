import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { PROJECTS_DIR } from "@/lib/server/paths";

export const dynamic = "force-dynamic";

async function projects(): Promise<string[]> {
  try {
    const dirs = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const out: string[] = [];
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      try {
        await fs.access(path.join(PROJECTS_DIR, d.name, "timeline.json"));
        out.push(d.name);
      } catch {
        /* no timeline */
      }
    }
    return out.sort();
  } catch {
    return [];
  }
}

export default async function Home() {
  const list = await projects();
  return (
    <main className="home">
      <h1>Motion Editor</h1>
      <p className="muted">Projects with a <code>public/projects/&lt;name&gt;/timeline.json</code>:</p>
      <ul>
        {list.map((p) => (
          <li key={p}>
            <Link href={`/edit/${p}`}>{p}</Link>
          </li>
        ))}
        {list.length === 0 ? <li className="muted">none found</li> : null}
      </ul>
    </main>
  );
}
