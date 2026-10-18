// Introspection over the zod schema in ../src/schema/timeline.ts. Forms, defaults and
// drag limits are all read from it, so a schema change shows up here without edits.
import { broll, timeline } from "@reel/schema/timeline";

/** zod v4 schemas, accessed structurally (def.type, shape, element, minValue, ...). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type S = any;

export type Unwrapped = {
  schema: S;
  optional: boolean;
  hasDefault: boolean;
  defaultValue: unknown;
  description?: string;
};

export function unwrap(s: S): Unwrapped {
  let cur = s;
  let optional = false;
  let hasDefault = false;
  let defaultValue: unknown;
  let description: string | undefined = s?.description;
  for (;;) {
    const t = cur?.def?.type;
    if (t === "optional" || t === "nullable") {
      optional = true;
      cur = cur.unwrap();
    } else if (t === "default" || t === "prefault") {
      hasDefault = true;
      defaultValue = cur.def.defaultValue;
      cur = cur.unwrap();
    } else break;
    description ??= cur?.description;
  }
  return { schema: cur, optional, hasDefault, defaultValue, description };
}

export const typeOf = (s: S): string => s?.def?.type ?? "unknown";

export function arrayBounds(s: S): { min?: number; max?: number } {
  const out: { min?: number; max?: number } = {};
  for (const c of s?.def?.checks ?? []) {
    const d = c?._zod?.def;
    if (!d) continue;
    if (d.check === "min_length") out.min = d.minimum;
    if (d.check === "max_length") out.max = d.maximum;
    if (d.check === "length_equals") out.min = out.max = d.length;
  }
  return out;
}

export function numberBounds(s: S): { min?: number; max?: number; int: boolean } {
  const min = s?.minValue;
  const max = s?.maxValue;
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
    int: Boolean(s?.isInt),
  };
}

const clone = <T,>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

/**
 * Smallest value that satisfies `s`. Keys with a schema default are left out (zod fills
 * them at render time), which keeps timeline.json as terse as the scripts write it.
 */
export function makeDefault(s: S): unknown {
  const u = unwrap(s);
  if (u.hasDefault) return clone(u.defaultValue);
  if (u.optional) return undefined;
  const t = typeOf(u.schema);
  switch (t) {
    case "object": {
      const o: Record<string, unknown> = {};
      for (const [k, f] of Object.entries(u.schema.shape as Record<string, S>)) {
        const fu = unwrap(f);
        if (fu.optional || fu.hasDefault) continue;
        o[k] = makeDefault(f);
      }
      return o;
    }
    case "array": {
      const { min } = arrayBounds(u.schema);
      return Array.from({ length: min ?? 0 }, () => makeDefault(u.schema.element));
    }
    case "string":
      return "";
    case "number": {
      const b = numberBounds(u.schema);
      if (b.min !== undefined && b.min > 0) return b.min;
      if (b.max !== undefined && b.max < 0) return b.max;
      return 0;
    }
    case "boolean":
      return false;
    case "enum":
      return u.schema.options[0];
    case "literal":
      return u.schema.value;
    case "union":
      return makeDefault(u.schema.options[0]);
    default:
      return undefined;
  }
}

/** Value zod would use for a key that is absent in the raw JSON. */
export function effective(s: S, v: unknown): unknown {
  if (v !== undefined) return v;
  const u = unwrap(s);
  return u.hasDefault ? u.defaultValue : undefined;
}

// ---- the concrete element schemas -------------------------------------------------------

const shape = timeline.shape as Record<string, S>;
export const timelineShape = shape;
export const elementSchema = (key: string): S => unwrap(shape[key]).schema.element;

export const brollKinds: string[] = (broll as S).options.map((o: S) => o.shape.kind.value);
export const brollSchemaFor = (kind: string): S =>
  (broll as S).options.find((o: S) => o.shape.kind.value === kind);

/** "segments" is the A-roll: source-video ranges (SOURCE seconds), shown read-only on the timeline. */
export type TrackKey = "segments" | "words" | "broll" | "cards" | "titles" | "cuts" | "sfx";

export function itemSchema(track: TrackKey, item?: { kind?: string }): S {
  if (track === "broll") return brollSchemaFor(item?.kind ?? "keyword");
  return elementSchema(track);
}

/** min/max of an item's `duration` from its schema (b-roll 0.8-12, cards 1.5-60, titles 0.8-3.5). */
export function durationBounds(track: TrackKey, item?: { kind?: string }): { min: number; max: number } {
  const s = itemSchema(track, item);
  const d = s?.shape?.duration;
  if (!d) return { min: 0, max: Infinity };
  const b = numberBounds(unwrap(d).schema);
  return { min: b.min ?? 0, max: b.max ?? Infinity };
}

/** Default duration zod applies when `duration` is absent (cards 5s, titles 1.8s). */
export function durationOf(track: TrackKey, item: { duration?: number; kind?: string }): number {
  if (typeof item.duration === "number") return item.duration;
  const d = itemSchema(track, item)?.shape?.duration;
  const u = d ? unwrap(d) : null;
  return typeof u?.defaultValue === "number" ? u.defaultValue : 1;
}
