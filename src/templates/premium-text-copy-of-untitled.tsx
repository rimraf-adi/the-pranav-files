// "Untitled" in the premium-text pack is an exact copy of TEXT 14 (same comp, layers and values): reuse that port.
import text14 from "./premium-text-copy-of-text-14";
import type { TemplateDef } from "./types";

const def: TemplateDef = { ...text14, slug: "premium-text-copy-of-untitled", name: "Untitled" };
export default def;
