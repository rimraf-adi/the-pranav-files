import type { Word } from "../schema/timeline";
import type { Hero, Line } from "./types";

/** Group words into display lines: break on pauses, sentence ends, or length. */
export const buildLines = (
  words: Word[],
  maxWords = 6,
  maxChars = 34,
  gap = 0.45,
): Line[] => {
  const lines: Line[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    lines.push({
      index: lines.length,
      words: cur,
      start: cur[0].start,
      end: cur[cur.length - 1].end,
    });
    cur = [];
  };
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const chars =
      cur.reduce((s, x) => s + x.text.length + 1, 0) + w.text.length;
    if (
      prev &&
      (w.start - prev.end > gap || cur.length >= maxWords || chars > maxChars)
    )
      flush();
    cur.push(w);
    if (/[.?!]$/.test(w.text)) flush();
  }
  flush();
  return lines;
};

/** Apex word: explicit index, else last `emphasis` word, else longest word in the last half. */
export const pickHero = (
  words: Word[],
  explicit?: number,
): Hero | undefined => {
  if (!words.length) return undefined;
  let i = explicit ?? -1;
  if (i < 0 || i >= words.length)
    i = words.map((w) => w.emphasis).lastIndexOf(true);
  if (i < 0) {
    const half = Math.floor(words.length / 2);
    i =
      half +
      words
        .slice(half)
        .reduce((b, w, k, a) => (w.text.length > a[b].text.length ? k : b), 0);
  }
  const w = words[i];
  return {
    index: i,
    text: w.text.replace(/[.,?!]+$/g, ""),
    start: w.start,
    end: w.end,
  };
};
