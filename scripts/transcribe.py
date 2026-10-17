#!/usr/bin/env python3
"""Word-level Roman-script Hinglish transcript via Groq Whisper (uses curl).

usage: transcribe.py <video> <out.json> [--model whisper-large-v3] [--lang hi]
Needs GROQ_API_KEY in the environment or in ./.env.

Whisper is biased toward Roman output with a Hinglish prompt. Words still in
Devanagari get "needs_romanize": true so a later step can fix them WITHOUT
changing word count or timings.
"""
import argparse, json, os, re, subprocess, sys, tempfile

PROMPT = ("Haan toh aaj hum baat karenge ki kaise aap apna business grow kar sakte ho. "
          "Dekho, yeh simple hai, bas consistency chahiye.")
DEVANAGARI = re.compile(r"[ऀ-ॿ]")
URL = "https://api.groq.com/openai/v1/audio/transcriptions"

def load_key():
    k = os.environ.get("GROQ_API_KEY")
    if not k and os.path.exists(".env"):
        for line in open(".env"):
            if line.startswith("GROQ_API_KEY="):
                k = line.split("=", 1)[1].strip()
    if not k:
        sys.exit("GROQ_API_KEY missing (set env var or .env)")
    return k

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--model", default="whisper-large-v3"); ap.add_argument("--lang", default="hi")
a = ap.parse_args()

CHUNK = 10  # seconds; longer calls let Whisper silently drop stretches of speech
tmp = tempfile.mkdtemp()
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "default=nw=1:nk=1", a.video], capture_output=True, text=True).stdout)

def transcribe_chunk(offset):
    flac = os.path.join(tmp, f"a{int(offset)}.flac")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(offset), "-t", str(CHUNK),
                    "-i", a.video, "-vn", "-ac", "1", "-ar", "16000", flac], check=True)
    cmd = ["curl", "-sS", "-X", "POST", URL, "-H", f"Authorization: Bearer {load_key()}",
           "-F", f"file=@{flac}", "-F", f"model={a.model}", "-F", f"language={a.lang}",
           "-F", "response_format=verbose_json", "-F", "timestamp_granularities[]=word",
           "-F", "temperature=0", "-F", f"prompt={PROMPT}", "--max-time", "300"]
    res = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
    if "error" in res:
        sys.exit(f"Groq error: {res['error']}")
    return res.get("words", [])

words = []
off = 0.0
while off < dur - 0.2:
    for w in transcribe_chunk(off):
        start = off + w["start"]
        end = min(off + w["end"], start + 2.0)  # clamp stretched timestamps
        words.append({"text": w["word"].strip(), "start": round(start, 3), "end": round(end, 3),
                      "needs_romanize": bool(DEVANAGARI.search(w["word"]))})
    off += CHUNK

# sanity: report any hole in the speech so it's never silent
for p, n in zip(words, words[1:]):
    if n["start"] - p["end"] > 2.5:
        print(f"WARNING: {n['start'] - p['end']:.1f}s with no words at {p['end']:.1f}s")

json.dump({"words": words}, open(a.out, "w"), ensure_ascii=False, indent=1)
print(f"{len(words)} words, {sum(w['needs_romanize'] for w in words)} in Devanagari -> {a.out}")
