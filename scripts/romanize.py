#!/usr/bin/env python3
"""Convert Devanagari words in transcript.json to casual Roman Hinglish (Groq LLM).

usage: romanize.py <transcript.json> [--model openai/gpt-oss-120b]
Word count and timestamps are never changed: output must be a 1:1 array per chunk,
otherwise that chunk is retried, then falls back to the original words.
English words stay as-is. Needs GROQ_API_KEY (env or ./.env).
"""
import argparse, json, os, re, subprocess, sys, tempfile

URL = "https://api.groq.com/openai/v1/chat/completions"
DEVANAGARI = re.compile(r"[ऀ-ॿ]")
CHUNK = 30

def key():
    k = os.environ.get("GROQ_API_KEY")
    if not k and os.path.exists(".env"):
        for l in open(".env"):
            if l.startswith("GROQ_API_KEY="):
                k = l.split("=", 1)[1].strip()
    return k or sys.exit("GROQ_API_KEY missing")

def ask(model, words):
    system = ("You convert Hindi/Hinglish tokens to casual Roman-script Hinglish, the way people "
              "type on WhatsApp (e.g. 'बन्दे' -> 'bande', 'क्या सोचते हैं' -> 'kya sochte hain'). "
              "Keep English words and digits unchanged. Return ONLY a JSON array of strings with "
              f"EXACTLY {len(words)} items, one per input token, same order. Never merge or split tokens.")
    body = {"model": model, "temperature": 0,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": json.dumps(words, ensure_ascii=False)}]}
    f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
    json.dump(body, f, ensure_ascii=False); f.close()
    raw = subprocess.run(["curl", "-sS", URL, "-H", f"Authorization: Bearer {key()}",
                          "-H", "Content-Type: application/json", "-d", f"@{f.name}",
                          "--max-time", "120"], capture_output=True, text=True).stdout
    res = json.loads(raw)
    if "error" in res:
        sys.exit(f"Groq error: {res['error']}")
    txt = res["choices"][0]["message"]["content"]
    m = re.search(r"\[.*\]", txt, re.S)
    return json.loads(m.group(0))

ap = argparse.ArgumentParser()
ap.add_argument("path"); ap.add_argument("--model", default="openai/gpt-oss-120b")
a = ap.parse_args()

d = json.load(open(a.path)); words = d["words"]
fixed = fallback = 0
for i in range(0, len(words), CHUNK):
    chunk = words[i:i + CHUNK]
    if not any(DEVANAGARI.search(w["text"]) for w in chunk):
        continue
    out = None
    for _ in range(2):
        try:
            r = ask(a.model, [w["text"] for w in chunk])
            if len(r) == len(chunk) and all(isinstance(x, str) for x in r):
                out = r; break
        except (ValueError, KeyError):
            pass
    if out is None:
        fallback += len(chunk); continue
    for w, new in zip(chunk, out):
        if DEVANAGARI.search(w["text"]):
            w["text"] = new.strip(); fixed += 1
        w["needs_romanize"] = bool(DEVANAGARI.search(w["text"]))

json.dump(d, open(a.path, "w"), ensure_ascii=False, indent=1)
left = sum(DEVANAGARI.search(w["text"]) is not None for w in words)
print(f"romanized {fixed}, unfixed {left} (fallback chunks: {fallback} words)")
