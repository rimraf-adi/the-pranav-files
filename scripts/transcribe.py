#!/usr/bin/env python3
"""Word-level Roman-script Hinglish transcript via Groq Whisper (stdlib only).

usage: transcribe.py <video> <out.json> [--model whisper-large-v3] [--lang hi]
Needs GROQ_API_KEY in the environment or in ./.env.

Whisper is biased toward Roman output with a Hinglish prompt. Words still in
Devanagari get "needs_romanize": true so a later step can fix them WITHOUT
changing word count or timings.
"""
import argparse, json, os, re, subprocess, sys, tempfile, urllib.request, uuid

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

def multipart(fields, file_field, filename, data):
    b = uuid.uuid4().hex
    out = b""
    for name, val in fields:
        out += f'--{b}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{val}\r\n'.encode()
    out += (f'--{b}\r\nContent-Disposition: form-data; name="{file_field}"; filename="{filename}"\r\n'
            f'Content-Type: audio/flac\r\n\r\n').encode() + data + f"\r\n--{b}--\r\n".encode()
    return out, f"multipart/form-data; boundary={b}"

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--model", default="whisper-large-v3"); ap.add_argument("--lang", default="hi")
a = ap.parse_args()

flac = os.path.join(tempfile.mkdtemp(), "a.flac")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", a.video, "-vn", "-ac", "1",
                "-ar", "16000", flac], check=True)
data = open(flac, "rb").read()
if len(data) > 24 * 1024 * 1024:
    sys.exit("audio >24MB; split the video first (Groq upload limit)")

fields = [("model", a.model), ("language", a.lang), ("response_format", "verbose_json"),
          ("timestamp_granularities[]", "word"), ("temperature", "0"), ("prompt", PROMPT)]
body, ctype = multipart(fields, "file", "a.flac", data)
req = urllib.request.Request(URL, data=body, headers={
    "Authorization": f"Bearer {load_key()}", "Content-Type": ctype})
try:
    res = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f"Groq error {e.code}: {e.read().decode()[:500]}")

words = [{"text": w["word"].strip(), "start": round(w["start"], 3), "end": round(w["end"], 3),
          "needs_romanize": bool(DEVANAGARI.search(w["word"]))} for w in res.get("words", [])]
json.dump({"words": words}, open(a.out, "w"), ensure_ascii=False, indent=1)
print(f"{len(words)} words, {sum(w['needs_romanize'] for w in words)} in Devanagari -> {a.out}")
