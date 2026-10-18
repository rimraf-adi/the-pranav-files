"use client";
// Property forms generated from the zod schema (src/schema/timeline.ts). Widgets are chosen
// from the field type; min/max/enum/defaults/descriptions all come from the schema.
import React, { useState } from "react";
import { firstAsset, publicUrl } from "@/lib/assets";
import { arrayBounds, makeDefault, numberBounds, typeOf, unwrap, type S } from "@/lib/schema";
import { apply, useStore } from "@/lib/store";
import { AssetPicker } from "./AssetPicker";

export type Path = (string | number)[];

const pathKey = (p: Path) => p.join(".");

/** Set (or with undefined, delete) a value deep inside the draft, creating parents as needed. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setIn(root: any, path: Path, value: unknown) {
  let cur = root;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (cur[k] === undefined || cur[k] === null) cur[k] = typeof path[i + 1] === "number" ? [] : {};
    cur = cur[k];
  }
  const last = path[path.length - 1];
  if (value === undefined) {
    if (Array.isArray(cur) && typeof last === "number") cur.splice(last, 1);
    else delete cur[last];
  } else cur[last] = value;
}

export const setField = (path: Path, value: unknown) =>
  apply((d) => setIn(d, path, value), { key: `f:${pathKey(path)}` });

function useIssues(path: Path, exact = true) {
  const key = pathKey(path);
  return useStore((s) => s.issues).filter((i) =>
    exact ? pathKey(i.path) === key : pathKey(i.path).startsWith(key + "."),
  );
}

const ASSET_KEYS = new Set(["src", "bg", "icon"]);
const LONG_KEYS = new Set(["detail", "quote"]);

const humanize = (k: string) => k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

// ---- object ---------------------------------------------------------------------------------

export function ObjectFields({
  schema,
  value,
  path,
  omit = [],
}: {
  schema: S;
  value: Record<string, unknown> | undefined;
  path: Path;
  omit?: string[];
}) {
  const shape = unwrap(schema).schema.shape as Record<string, S>;
  return (
    <div className="fields">
      {Object.entries(shape)
        .filter(([k]) => !omit.includes(k))
        .map(([k, f]) => (
          <Field key={k} name={k} schema={f} value={value?.[k]} path={[...path, k]} parent={value} />
        ))}
    </div>
  );
}

// ---- one field ------------------------------------------------------------------------------

export function Field({
  name,
  schema,
  value,
  path,
  parent,
  label,
}: {
  name: string;
  schema: S;
  value: unknown;
  path: Path;
  parent?: Record<string, unknown>;
  label?: string;
}) {
  const u = unwrap(schema);
  const t = typeOf(u.schema);
  const issues = useIssues(path);
  const shown = value === undefined && u.hasDefault ? u.defaultValue : value;
  const isDefault = value === undefined && u.hasDefault;
  const block = t === "object" || t === "array" || ASSET_KEYS.has(name) || name === "focus";

  let control: React.ReactNode;
  if (u.optional && value === undefined) {
    control = (
      <button className="btn xs ghost" onClick={() => setField(path, optionalStart(name, u.schema, path))}>
        + set {label ?? name}
      </button>
    );
  } else {
    control = <Widget name={name} schema={u.schema} value={shown} path={path} parent={parent} isDefault={isDefault} />;
  }

  return (
    <div className={`field ${block ? "block" : ""} ${issues.some((i) => i.level === "error") ? "has-err" : ""}`}>
      <div className="field-label">
        <label title={u.description}>{label ?? humanize(name)}</label>
        {u.optional && value !== undefined ? (
          <button className="link" title="Remove (unset)" onClick={() => setField(path, undefined)}>
            unset
          </button>
        ) : null}
        {u.hasDefault && value !== undefined ? (
          <button className="link" title={`Reset to default (${JSON.stringify(u.defaultValue)})`} onClick={() => setField(path, undefined)}>
            reset
          </button>
        ) : null}
      </div>
      <div className="field-control">{control}</div>
      {u.description ? <div className="field-help">{u.description}</div> : null}
      {issues.map((i, k) => (
        <div key={k} className={`field-err ${i.level}`}>
          {i.message}
        </div>
      ))}
    </div>
  );
}

function optionalStart(name: string, s: S, path: Path): unknown {
  if (ASSET_KEYS.has(name)) return firstAsset(path.includes("sfx") ? "audio" : "image") ?? "";
  if (name === "focus" && typeOf(s) === "array") return [-180, -60, 180, 80];
  const v = makeDefault(s);
  return v === undefined ? "" : v;
}

function Widget({
  name,
  schema,
  value,
  path,
  parent,
  isDefault,
}: {
  name: string;
  schema: S;
  value: unknown;
  path: Path;
  parent?: Record<string, unknown>;
  isDefault: boolean;
}) {
  const t = typeOf(schema);
  const cls = isDefault ? "is-default" : "";
  switch (t) {
    case "string": {
      const v = (value as string) ?? "";
      if (ASSET_KEYS.has(name)) {
        const kind = path[0] === "sfx" ? "audio" : "image";
        return <AssetField value={v} kind={kind} onChange={(p) => setField(path, p)} />;
      }
      if (name === "focus") {
        return <FocusField value={v} src={(parent?.src as string) ?? ""} onChange={(f) => setField(path, f)} />;
      }
      if (/^#[0-9a-f]{3,8}$/i.test(v)) {
        return (
          <span className="row">
            <input type="color" value={v.length === 7 ? v : "#000000"} onChange={(e) => setField(path, e.target.value)} />
            <input className={`txt ${cls}`} value={v} onChange={(e) => setField(path, e.target.value)} />
          </span>
        );
      }
      if (LONG_KEYS.has(name)) {
        return <textarea className={`txt ${cls}`} rows={3} value={v} onChange={(e) => setField(path, e.target.value)} />;
      }
      return <input className={`txt ${cls}`} value={v} onChange={(e) => setField(path, e.target.value)} />;
    }
    case "number":
      return <NumberInput schema={schema} value={value as number} path={path} className={cls} />;
    case "boolean":
      return (
        <label className={`check ${cls}`}>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => setField(path, e.target.checked)} />
          <span>{value ? "on" : "off"}</span>
        </label>
      );
    case "enum":
      return (
        <select className={cls} value={(value as string) ?? ""} onChange={(e) => setField(path, e.target.value)}>
          {(schema.options as string[]).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "literal":
      return <code>{String(schema.value)}</code>;
    case "object":
      return <ObjectFields schema={schema} value={value as Record<string, unknown>} path={path} />;
    case "array":
      return <ArrayField schema={schema} value={(value as unknown[]) ?? []} path={path} name={name} />;
    default:
      return <JsonField value={value} path={path} />;
  }
}

export function NumberInput({
  schema,
  value,
  path,
  className = "",
  step,
}: {
  schema: S;
  value: number | undefined;
  path: Path;
  className?: string;
  step?: number;
}) {
  const b = numberBounds(unwrap(schema).schema);
  const st = step ?? (b.int ? 1 : b.max !== undefined && b.min !== undefined && b.max - b.min <= 2 ? 0.01 : 0.01);
  const [draft, setDraft] = useState<string | null>(null);
  const slider = b.min !== undefined && b.max !== undefined && b.max - b.min <= 100;
  const commit = (s: string) => {
    if (s.trim() === "") return;
    const n = Number(s);
    if (Number.isFinite(n)) setField(path, b.int ? Math.round(n) : n);
  };
  return (
    <span className="row">
      {slider ? (
        <input
          type="range"
          min={b.min}
          max={b.max}
          step={st}
          value={value ?? b.min}
          onChange={(e) => setField(path, b.int ? Math.round(Number(e.target.value)) : Number(e.target.value))}
        />
      ) : null}
      <input
        className={`num ${className}`}
        type="number"
        step={st}
        min={b.min}
        max={b.max}
        value={draft ?? (value === undefined ? "" : String(value))}
        onChange={(e) => {
          setDraft(e.target.value);
          commit(e.target.value);
        }}
        onBlur={() => setDraft(null)}
      />
    </span>
  );
}

// ---- arrays ---------------------------------------------------------------------------------

function ArrayField({ schema, value, path, name }: { schema: S; value: unknown[]; path: Path; name: string }) {
  const el = schema.element as S;
  const elT = typeOf(unwrap(el).schema);
  const { min = 0, max = Infinity } = arrayBounds(schema);
  const fixed = min === max;
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const childIssues = useIssues(path, false);

  const mutate = (fn: (arr: unknown[]) => void) =>
    apply((d) => {
      let cur = d;
      for (const k of path) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((cur as any)[k] === undefined) (cur as any)[k] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cur = (cur as any)[k];
      }
      fn(cur as unknown as unknown[]);
    });

  const newEl = () => {
    if (elT === "object" && unwrap(el).schema.shape.src) {
      return { ...(makeDefault(el) as object), src: firstAsset("image") ?? "" };
    }
    if (elT === "object" && name === "nodes") {
      const ids = new Set((value as { id: string }[]).map((n) => n.id));
      let i = value.length;
      while (ids.has(`n${i}`)) i++;
      return { ...(makeDefault(el) as object), id: `n${i}`, label: "Node" };
    }
    return makeDefault(el);
  };

  if (elT === "number" || elT === "string") {
    return (
      <div className="arr-inline">
        {value.map((v, i) => (
          <span key={i} className="arr-cell">
            {elT === "number" ? (
              <NumberInput schema={el} value={v as number} path={[...path, i]} />
            ) : (
              <input className="txt" value={(v as string) ?? ""} onChange={(e) => setField([...path, i], e.target.value)} />
            )}
            {!fixed && value.length > min ? (
              <button className="btn xs ghost" title="Remove" onClick={() => mutate((a) => a.splice(i, 1))}>
                ✕
              </button>
            ) : null}
          </span>
        ))}
        {!fixed && value.length < max ? (
          <button className="btn xs" onClick={() => mutate((a) => a.push(newEl()))}>
            + add
          </button>
        ) : null}
      </div>
    );
  }

  // compact table for small objects of primitives (chart items, map pins)
  const shape = elT === "object" ? (unwrap(el).schema.shape as Record<string, S>) : null;
  const primitiveOnly =
    shape &&
    Object.keys(shape).length <= 3 &&
    !Object.keys(shape).some((k) => ASSET_KEYS.has(k) || k === "focus") &&
    Object.values(shape).every((f) => ["string", "number"].includes(typeOf(unwrap(f).schema)));

  return (
    <div className="arr">
      {childIssues.length ? <div className="field-err error">{childIssues.length} issue(s) inside</div> : null}
      {value.map((item, i) => {
        const summary =
          item && typeof item === "object"
            ? String(
                (item as Record<string, unknown>).label ??
                  (item as Record<string, unknown>).text ??
                  (item as Record<string, unknown>).id ??
                  ((item as Record<string, unknown>).src as string | undefined)?.split("/").pop() ??
                  "",
              )
            : String(item);
        const controls = (
          <span className="arr-ctl">
            <button className="btn xs ghost" disabled={i === 0} title="Move up" onClick={() => mutate((a) => a.splice(i - 1, 0, a.splice(i, 1)[0]))}>
              ↑
            </button>
            <button
              className="btn xs ghost"
              disabled={i === value.length - 1}
              title="Move down"
              onClick={() => mutate((a) => a.splice(i + 1, 0, a.splice(i, 1)[0]))}
            >
              ↓
            </button>
            <button
              className="btn xs ghost"
              disabled={value.length >= max}
              title="Duplicate"
              onClick={() => mutate((a) => a.splice(i + 1, 0, JSON.parse(JSON.stringify(a[i]))))}
            >
              ⧉
            </button>
            <button className="btn xs ghost" disabled={value.length <= min} title="Remove" onClick={() => mutate((a) => a.splice(i, 1))}>
              ✕
            </button>
          </span>
        );
        if (primitiveOnly && shape) {
          return (
            <div key={i} className="arr-row">
              {Object.entries(shape).map(([k, f]) => (
                <span key={k} className="arr-cell grow">
                  <span className="mini-label">{k}</span>
                  {typeOf(unwrap(f).schema) === "number" ? (
                    <NumberInput schema={f} value={(item as Record<string, number>)?.[k]} path={[...path, i, k]} />
                  ) : (
                    <input
                      className="txt"
                      value={((item as Record<string, string>)?.[k] as string) ?? ""}
                      onChange={(e) => setField([...path, i, k], e.target.value)}
                    />
                  )}
                </span>
              ))}
              {controls}
            </div>
          );
        }
        const isOpen = open[i] ?? false;
        return (
          <div key={i} className="arr-item">
            <div className="arr-head" onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}>
              <span className="caret">{isOpen ? "▾" : "▸"}</span>
              <b>#{i}</b> <span className="muted ellipsis">{summary}</span>
              <span onClick={(e) => e.stopPropagation()}>{controls}</span>
            </div>
            {isOpen ? <Widget name={name} schema={unwrap(el).schema} value={item} path={[...path, i]} isDefault={false} /> : null}
          </div>
        );
      })}
      {value.length < max ? (
        <button
          className="btn xs"
          onClick={() => {
            mutate((a) => a.push(newEl()));
            setOpen((o) => ({ ...o, [value.length]: true }));
          }}
        >
          + add {name === "shots" ? "shot" : "item"}
        </button>
      ) : null}
    </div>
  );
}

function JsonField({ value, path }: { value: unknown; path: Path }) {
  const [text, setText] = useState(JSON.stringify(value, null, 1));
  const [bad, setBad] = useState(false);
  return (
    <textarea
      className={`txt mono ${bad ? "bad" : ""}`}
      rows={4}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        try {
          setField(path, JSON.parse(e.target.value));
          setBad(false);
        } catch {
          setBad(true);
        }
      }}
    />
  );
}

// ---- asset + focus widgets ------------------------------------------------------------------

export function AssetField({
  value,
  kind,
  onChange,
}: {
  value: string;
  kind: "image" | "audio" | "video";
  onChange: (p: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="asset-field">
      {kind === "image" && value ? <img className="thumb" src={publicUrl(value)} alt="" /> : null}
      <input className="txt" value={value} onChange={(e) => onChange(e.target.value)} placeholder="path relative to /public" />
      <button className="btn xs" onClick={() => setOpen(true)}>
        Browse…
      </button>
      {kind === "audio" && value ? (
        <button className="btn xs ghost" title="Play" onClick={() => new Audio(publicUrl(value)).play()}>
          ▶
        </button>
      ) : null}
      {open ? (
        <AssetPicker
          kind={kind}
          value={value}
          onClose={() => setOpen(false)}
          onPick={(p) => {
            onChange(p);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function FocusField({ value, src, onChange }: { value: string; src: string; onChange: (v: string) => void }) {
  const m = value.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  const x = m ? Number(m[1]) : 50;
  const y = m ? Number(m[2]) : 50;
  const set = (nx: number, ny: number) => onChange(`${Math.round(nx)}% ${Math.round(ny)}%`);
  return (
    <div className="focus-field">
      {src ? (
        <div
          className="focus-src"
          title="Click to set the crop focus"
          onClick={(e) => {
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            set(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
          }}
        >
          <img src={publicUrl(src)} alt="" />
          <span className="focus-dot" style={{ left: `${x}%`, top: `${y}%` }} />
        </div>
      ) : null}
      {src ? (
        <div className="focus-crop" title="9:16 crop as rendered">
          <img src={publicUrl(src)} alt="" style={{ objectPosition: `${x}% ${y}%` }} />
        </div>
      ) : null}
      <div className="focus-sliders">
        <label>
          x <input type="range" min={0} max={100} value={x} onChange={(e) => set(Number(e.target.value), y)} /> {Math.round(x)}%
        </label>
        <label>
          y <input type="range" min={0} max={100} value={y} onChange={(e) => set(x, Number(e.target.value))} /> {Math.round(y)}%
        </label>
        <input className="txt" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
