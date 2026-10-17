#!/usr/bin/env python3
"""Word-level Roman-script Hinglish transcript.

usage: transcribe.py <video> <out.json> [--model large-v3] [--lang hi]

Whisper is biased toward Roman output with a Hinglish initial_prompt.
Any word still containing Devanagari is flagged in "needs_romanize" so a later
step (LLM or indic-transliteration) can fix it WITHOUT changing word count/timings.
Requires: pip install faster-whisper
"""
import json, re, subprocess, sys, tempfile, os, argparse

PROMPT = ("Haan toh aaj hum baat karenge ki kaise aap apna business grow kar sakte ho. "
          "Dekho, yeh simple hai, bas consistency chahiye.")
DEVANAGARI = re.compile(r"[ऀ-ॿ]")

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--model", default="large-v3"); ap.add_argument("--lang", default="hi")
a = ap.parse_args()

from faster_whisper import WhisperModel

wav = os.path.join(tempfile.mkdtemp(), "a.wav")
subprocess.run(["ffmpeg", "-y", "-i", a.video, "-ac", "1", "-ar", "16000", wav],
               check=True, capture_output=True)

model = WhisperModel(a.model, compute_type="int8")
segs, _ = model.transcribe(wav, language=a.lang, word_timestamps=True,
                           initial_prompt=PROMPT, vad_filter=True)
words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
         for s in segs for w in s.words]
for w in words:
    w["needs_romanize"] = bool(DEVANAGARI.search(w["text"]))

json.dump({"words": words}, open(a.out, "w"), ensure_ascii=False, indent=1)
bad = sum(w["needs_romanize"] for w in words)
print(f"{len(words)} words, {bad} still in Devanagari -> {a.out}")
