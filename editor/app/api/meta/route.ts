import fs from "node:fs/promises";
import path from "node:path";
import { PROJECTS_DIR, REPO_ROOT } from "@/lib/server/paths";

export const dynamic = "force-dynamic";

const jsonNames = async (dir: string) => {
  try {
    return (await fs.readdir(dir))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
};

/** Names for pickers: caption themes (src/themes/dna), styles (styles/), projects with a timeline.json. */
export async function GET() {
  const themes = await jsonNames(path.join(REPO_ROOT, "src/themes/dna"));
  const styles = await jsonNames(path.join(REPO_ROOT, "styles"));
  let projects: string[] = [];
  try {
    const dirs = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      try {
        await fs.access(path.join(PROJECTS_DIR, d.name, "timeline.json"));
        projects.push(d.name);
      } catch {
        /* no timeline yet */
      }
    }
    projects = projects.sort();
  } catch {
    projects = [];
  }
  return Response.json({ themes, styles, projects });
}
