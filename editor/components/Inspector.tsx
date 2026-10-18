"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  deleteSel,
  duplicateSel,
  fpsOf,
  mergeWords,
  newBroll,
  segmentSpans,
  nowSec,
  setHero,
  splitWord,
  totalOf,
} from "@/lib/ops";
import { seek, usePlayback } from "@/lib/playback";
import { brollKinds, itemSchema, timelineShape, unwrap, type TrackKey } from "@/lib/schema";
import { apply, getState, select, setState, useStore, type Doc } from "@/lib/store";
import { MetaContext } from "./EditorApp";
import { Field, NumberInput, ObjectFields, setField } from "./SchemaForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

const TITLE: Record<TrackKey, string> = {
  segments: "A-roll segment",
  words: "Caption word",
  broll: "B-roll",
  cards: "Card",
  titles: "Title",
  cuts: "Cut",
  sfx: "Sound effect",
};

type Tab = "inspector" | "transcript" | "project";

const NO_WORDS: Item[] = [];

export function Inspector() {
  const sel = useStore((s) => s.sel);
  const [tab, setTab] = useState<Tab>("inspector");
  useEffect(() => {
    if (sel) setTab((t) => (t === "project" ? "inspector" : t));
  }, [sel]);
  return (
    <div className="side">
      <div className="tabs">
        {(["inspector", "transcript", "project"] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t === "inspector" ? "Inspector" : t === "transcript" ? "Transcript" : "Project"}
          </button>
        ))}
      </div>
      <div className="side-body">
        {tab === "inspector" ? sel ? <Selection /> : <ProjectPanel hint /> : null}
        {tab === "transcript" ? <Transcript /> : null}
        {tab === "project" ? <ProjectPanel /> : null}
      </div>
    </div>
  );
}

function Selection() {
  const sel = useStore((s) => s.sel)!;
  const item = useStore((s) => (s.doc?.[sel.track] as Item[] | undefined)?.[sel.index]);
  const doc = useStore((s) => s.doc) as Doc;
  if (!item) return <div className="muted pad">Nothing selected.</div>;
  const schema = itemSchema(sel.track, item);
  const path = [sel.track, sel.index];
  const omit = sel.track === "broll" ? ["kind"] : [];
  const span = sel.track === "segments" ? segmentSpans(doc)[sel.index] : null;
  const startSec = span ? span.start : sel.track === "words" ? item.start : item.at;
  return (
    <div className="inspector">
      <div className="insp-head">
        <div>
          <div className="insp-title">
            {TITLE[sel.track]} <span className="muted">#{sel.index}</span>
            {item.id ? <span className="pill">{item.id}</span> : null}
          </div>
          <div className="muted small">
            {span
              ? `output ${span.start.toFixed(2)}s → ${span.end.toFixed(2)}s`
              : sel.track === "words"
                ? `${item.start}s → ${item.end}s`
                : `@ ${item.at}s`}
            {" · "}
            <button className="link" onClick={() => seek(Math.ceil(startSec * fpsOf(doc)))}>
              jump to
            </button>
          </div>
        </div>
        <div className="insp-actions" hidden={sel.track === "segments"}>
          <button className="btn sm" onClick={() => duplicateSel()} title="Duplicate (⌘D)">
            {sel.track === "words" ? "Split in two" : "Duplicate"}
          </button>
          <button className="btn sm danger" onClick={() => deleteSel()} title="Delete (Del)">
            Delete
          </button>
        </div>
      </div>
      {sel.track === "broll" ? <KindSwitch item={item} index={sel.index} /> : null}
      {sel.track === "words" ? <WordTools index={sel.index} item={item} doc={doc} /> : null}
      {sel.track === "segments" ? (
        <p className="warn-text small">
          A-roll from <code>{doc.source}</code>
          {doc.subject ? (
            <>
              {" "}
              (+ cutout <code>{doc.subject}</code>)
            </>
          ) : null}
          . <b>from/to are SOURCE-video seconds.</b> Changing them changes the reel length and shifts every caption,
          b-roll, card, cut and sfx after this segment; those are not re-timed for you. For re-cuts use{" "}
          <code>scripts/build_timeline.py --keep</code>.
        </p>
      ) : null}
      <ObjectFields schema={schema} value={item} path={path} omit={omit} />
    </div>
  );
}

function KindSwitch({ item, index }: { item: Item; index: number }) {
  return (
    <div className="field">
      <div className="field-label">
        <label>Kind</label>
      </div>
      <select
        value={item.kind}
        onChange={(e) => {
          const kind = e.target.value;
          if (!window.confirm(`Convert "${item.id}" to ${kind}? Fields that ${kind} doesn't have are dropped.`)) return;
          apply((d) => {
            const fresh = newBroll(kind, d);
            const keep = { id: item.id, at: item.at, duration: item.duration, tone: item.tone, leak: item.leak };
            const next: Item = { ...fresh, ...Object.fromEntries(Object.entries(keep).filter(([, v]) => v !== undefined)) };
            next.kind = kind;
            d.broll[index] = next;
          });
        }}
      >
        {brollKinds.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </div>
  );
}

function WordTools({ index, item, doc }: { index: number; item: Item; doc: Doc }) {
  const n = (doc.words as Item[]).length;
  const hero = doc.captionTheme?.hero;
  return (
    <div className="word-tools">
      <button className="btn sm" onClick={() => setState({ editingWord: index })} title="Edit text on the timeline (Enter)">
        Edit inline
      </button>
      <button className="btn sm" onClick={() => splitWord(index, nowSec())} title="Split at the playhead, or in the middle (S)">
        Split
      </button>
      <button className="btn sm" disabled={index === 0} onClick={() => mergeWords(index - 1)} title="Merge with the previous word">
        ⇤ Merge
      </button>
      <button className="btn sm" disabled={index >= n - 1} onClick={() => mergeWords(index)} title="Merge with the next word (M)">
        Merge ⇥
      </button>
      <button
        className={`btn sm ${item.emphasis ? "on" : ""}`}
        onClick={() => setField(["words", index, "emphasis"], !item.emphasis)}
        title="Toggle emphasis (E)"
      >
        Emphasis
      </button>
      {doc.captionTheme ? (
        <button
          className={`btn sm ${hero === index ? "on" : ""}`}
          onClick={() => setHero(hero === index ? undefined : index)}
          title="captionTheme.hero: the climax word"
        >
          ★ Hero
        </button>
      ) : null}
      <span className="muted small">
        {index > 0 ? (
          <button className="link" onClick={() => select({ track: "words", index: index - 1 })}>
            ← {(doc.words as Item[])[index - 1].text}
          </button>
        ) : null}{" "}
        {index < n - 1 ? (
          <button className="link" onClick={() => select({ track: "words", index: index + 1 })}>
            {(doc.words as Item[])[index + 1].text} →
          </button>
        ) : null}
      </span>
    </div>
  );
}

// ---- transcript -----------------------------------------------------------------------------

function Transcript() {
  const words = useStore((s) => (s.doc?.words as Item[] | undefined) ?? NO_WORDS);
  const sel = useStore((s) => s.sel);
  const editing = useStore((s) => s.editingWord);
  const hero = useStore((s) => s.doc?.captionTheme?.hero);
  const fps = useStore((s) => fpsOf(s.doc));
  const issues = useStore((s) => s.issues);
  const box = useRef<HTMLDivElement>(null);
  const frame = usePlayback((p) => p.frame);
  const t = frame / fps;

  // highlight the spoken word without re-rendering every chip
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.querySelectorAll(".chip.playing").forEach((c) => c.classList.remove("playing"));
    const i = words.findIndex((w) => t >= w.start && t < w.end);
    if (i >= 0) el.querySelector(`[data-i="${i}"]`)?.classList.add("playing");
  }, [t, words]);

  const bad = new Set(issues.filter((i) => i.path[0] === "words").map((i) => i.path[1]));
  return (
    <div className="transcript" ref={box}>
      <p className="muted small">
        Click a word to select and jump to it, double-click to fix its text. Shift-click toggles emphasis. Captions stay
        Roman-script Hinglish.
      </p>
      <div className="chips">
        {words.map((w, i) =>
          editing === i ? (
            <ChipInput key={i} index={i} initial={w.text} />
          ) : (
            <span
              key={i}
              data-i={i}
              className={`chip ${w.emphasis ? "emph" : ""} ${sel?.track === "words" && sel.index === i ? "sel" : ""} ${bad.has(i) ? "err" : ""}`}
              onClick={(e) => {
                if (e.shiftKey) setField(["words", i, "emphasis"], !w.emphasis);
                select({ track: "words", index: i });
                seek(Math.ceil(w.start * fps));
              }}
              onDoubleClick={() => setState({ editingWord: i })}
            >
              {hero === i ? "★" : ""}
              {w.text}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function ChipInput({ index, initial }: { index: number; initial: string }) {
  const [v, setV] = useState(initial);
  const done = useRef(false);
  const commit = (next: number | null) => {
    if (done.current) return;
    done.current = true;
    if (v.trim() && v.trim() !== initial) setField(["words", index, "text"], v.trim());
    const n = (getState().doc?.words as Item[]).length;
    if (next !== null && next >= 0 && next < n) {
      select({ track: "words", index: next });
      setState({ editingWord: next });
    } else setState({ editingWord: null });
  };
  return (
    <input
      className="chip-input"
      autoFocus
      size={Math.max(4, v.length + 1)}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit(null);
        if (e.key === "Escape") {
          done.current = true;
          setState({ editingWord: null });
        }
        if (e.key === "Tab") {
          e.preventDefault();
          commit(index + (e.shiftKey ? -1 : 1));
        }
      }}
      onBlur={() => commit(null)}
    />
  );
}

// ---- project (global fields) ----------------------------------------------------------------

function ProjectPanel({ hint }: { hint?: boolean }) {
  const doc = useStore((s) => s.doc) as Doc;
  const sel = useStore((s) => s.sel);
  const meta = useContext(MetaContext);
  const total = totalOf(doc);
  const ct = doc.captionTheme as { name: string; hero?: number } | undefined;
  const styles = Array.from(new Set([...(meta.styles ?? []), doc.style ?? "gadzhi"]));
  const themes = Array.from(new Set([...(meta.themes ?? []), ...(ct ? [ct.name] : [])]));
  const ctSchema = unwrap(timelineShape.captionTheme).schema;
  return (
    <div className="inspector">
      {hint ? <p className="muted small">Nothing selected. Click an item on the timeline to edit it. Project settings:</p> : null}
      <div className="insp-title">Project</div>
      <div className="fields">
        <div className="field">
          <div className="field-label">
            <label title={timelineShape.style.description}>Style</label>
          </div>
          <select value={doc.style ?? "gadzhi"} onChange={(e) => setField(["style"], e.target.value)}>
            {styles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="field-help">styles/&lt;name&gt;.json</div>
        </div>
        <Field name="grade" schema={timelineShape.grade} value={doc.grade} path={["grade"]} />
        <Field name="dust" schema={timelineShape.dust} value={doc.dust} path={["dust"]} />
        <Field name="pushInPercent" schema={timelineShape.pushInPercent} value={doc.pushInPercent} path={["pushInPercent"]} />
        <Field name="headroomPercent" schema={timelineShape.headroomPercent} value={doc.headroomPercent} path={["headroomPercent"]} />
        <Field name="cardPalette" schema={timelineShape.cardPalette} value={doc.cardPalette} path={["cardPalette"]} />

        <div className="field block">
          <div className="field-label">
            <label title={timelineShape.captionTheme.description}>Caption theme</label>
          </div>
          <select
            value={ct?.name ?? ""}
            onChange={(e) => {
              const name = e.target.value;
              apply((d) => {
                if (!name) delete d.captionTheme;
                else d.captionTheme = { ...(d.captionTheme ?? {}), name };
              });
            }}
          >
            <option value="">(none: default captions)</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="field-help">{ctSchema.shape.name.description}</div>
          {ct ? (
            <div className="row hero-row">
              <span className="mini-label">hero</span>
              {ct.hero === undefined ? (
                <span className="muted small">auto</span>
              ) : (
                <NumberInput schema={ctSchema.shape.hero} value={ct.hero} path={["captionTheme", "hero"]} />
              )}
              {ct.hero !== undefined ? (
                <span className="muted small">“{(doc.words as Item[])?.[ct.hero]?.text ?? "?"}”</span>
              ) : null}
              <button
                className="btn xs"
                disabled={sel?.track !== "words"}
                onClick={() => sel && setHero(sel.index)}
                title="Make the selected caption word the hero"
              >
                use selected word
              </button>
              {ct.hero !== undefined ? (
                <button className="btn xs ghost" onClick={() => setHero(undefined)}>
                  auto
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="insp-title">Source (read-only)</div>
      <table className="kv">
        <tbody>
          <tr>
            <td>source</td>
            <td>{doc.source}</td>
          </tr>
          <tr>
            <td>subject</td>
            <td>{doc.subject ?? "–"}</td>
          </tr>
          <tr>
            <td>size</td>
            <td>
              {doc.width ?? 1080}×{doc.height ?? 1920} @ {doc.fps ?? 30}fps
            </td>
          </tr>
          <tr>
            <td>duration</td>
            <td>
              {total.toFixed(2)}s from {(doc.segments ?? []).length} segments
            </td>
          </tr>
          <tr>
            <td>counts</td>
            <td>
              {(doc.words ?? []).length} words · {(doc.broll ?? []).length} b-roll · {(doc.cards ?? []).length} cards ·{" "}
              {(doc.titles ?? []).length} titles · {(doc.cuts ?? []).length} cuts · {(doc.sfx ?? []).length} sfx
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
