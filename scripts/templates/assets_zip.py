#!/usr/bin/env python3
"""Inspect and replicate the zip packs in assets/.

usage:
  python3 -I scripts/templates/assets_zip.py inspect   [zips_dir=library/zips] [--json out.json]
  python3 -I scripts/templates/assets_zip.py replicate [zips_dir=library/zips] [out_dir=library/extracted]

inspect    lists every zip: entry types, sizes, unsafe paths, executables, macOS junk, and peeks inside
           .mogrt (nested zip: definition.json), .mp4 (ffprobe) and text files. Nothing is executed.
replicate  extracts each zip to <out_dir>/<zip name>/ with the structure kept, skipping __MACOSX/.DS_Store,
           refusing any path that escapes the target, verifying CRCs, and writing manifest.json (sha256 per file).
Zips are untrusted data: this reads bytes only and never runs, imports or opens anything inside them.
"""
import hashlib
import io
import json
import posixpath
import subprocess
import sys
import zipfile
from collections import Counter
from pathlib import Path

JUNK = ("__MACOSX/", ".DS_Store")
RISKY = {"exe", "dll", "bat", "cmd", "sh", "command", "app", "scpt", "js", "jar", "msi", "dmg", "pkg", "py"}


def ext(name):
    base = name.rsplit("/", 1)[-1]
    return base.rsplit(".", 1)[-1].lower() if "." in base else ""


def is_junk(name):
    return name.startswith("__MACOSX/") or name.rsplit("/", 1)[-1] == ".DS_Store" or name.rsplit("/", 1)[-1].startswith("._")


def unsafe(name):
    p = posixpath.normpath(name)
    return name.startswith("/") or "\\" in name or p == ".." or p.startswith("../") or ":" in name.split("/")[0]


def mb(n):
    return round(n / 1048576, 1)


def peek_mogrt(data):
    try:
        z = zipfile.ZipFile(io.BytesIO(data))
        names = z.namelist()
        info = {"files": len(names)}
        if "definition.json" in names:
            d = json.loads(z.read("definition.json"))
            info["name"] = d.get("capsuleName") or d.get("name")
            info["premiere_version"] = d.get("minSupportedVersion") or d.get("version")
            info["params"] = len(d.get("clientControls", []))
        info["has_preview"] = any(n.lower().startswith("thumb") or n.lower().endswith((".png", ".jpg")) for n in names)
        return info
    except Exception as e:  # corrupt or unusual mogrt
        return {"error": str(e)}


def peek_mp4(z, member, tmp_dir):
    """ffprobe reads the member from a temp copy kept outside the repo tree."""
    p = Path(tmp_dir) / "probe.mp4"
    with z.open(member) as src, open(p, "wb") as dst:
        for chunk in iter(lambda: src.read(1 << 20), b""):
            dst.write(chunk)
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration", "-of", "json", str(p)],
        capture_output=True, text=True,
    )
    p.unlink(missing_ok=True)
    try:
        j = json.loads(r.stdout)
        s = j["streams"][0]
        return {"w": s["width"], "h": s["height"], "fps": s["r_frame_rate"], "sec": round(float(j["format"]["duration"]), 1)}
    except Exception:
        return {"error": "ffprobe failed"}


def inspect_zip(path, tmp_dir):
    z = zipfile.ZipFile(path)
    infos = [i for i in z.infolist() if not i.is_dir()]
    kept = [i for i in infos if not is_junk(i.filename)]
    rep = {
        "zip": path.name,
        "zip_mb": mb(path.stat().st_size),
        "unpacked_mb": mb(sum(i.file_size for i in kept)),
        "files": len(kept),
        "junk_skipped": len(infos) - len(kept),
        "types": dict(Counter(ext(i.filename) or "(none)" for i in kept).most_common()),
        "unsafe_paths": [i.filename for i in infos if unsafe(i.filename)],
        "risky_files": [i.filename for i in kept if ext(i.filename) in RISKY],
        "crc_bad": z.testzip(),
        "items": [],
    }
    for i in kept:
        item = {"path": i.filename, "mb": mb(i.file_size)}
        e = ext(i.filename)
        if e == "mogrt" and i.file_size < 64 * 1048576:
            item["mogrt"] = peek_mogrt(z.read(i))
        elif e == "mp4":
            item["video"] = peek_mp4(z, i, tmp_dir)
        elif e in ("txt", "md"):
            item["text_head"] = z.read(i)[:300].decode("utf-8", "replace")
        rep["items"].append(item)
    return rep


def cmd_inspect(assets, json_out):
    import tempfile

    reports = []
    with tempfile.TemporaryDirectory() as tmp:
        for zp in sorted(assets.glob("*.zip")):
            r = inspect_zip(zp, tmp)
            reports.append(r)
            print(f"\n== {r['zip']}  ({r['zip_mb']} MB zipped, {r['unpacked_mb']} MB unpacked, {r['files']} files, {r['junk_skipped']} junk skipped)")
            print("   types:", r["types"])
            if r["unsafe_paths"]:
                print("   UNSAFE PATHS:", r["unsafe_paths"])
            if r["risky_files"]:
                print("   executable-type files (not run):", r["risky_files"])
            if r["crc_bad"]:
                print("   CORRUPT MEMBER:", r["crc_bad"])
            for it in r["items"]:
                extra = it.get("mogrt") or it.get("video") or ""
                print(f"   - {it['path']}  {it['mb']} MB  {extra}")
    if json_out:
        Path(json_out).write_text(json.dumps(reports, indent=1))
        print("\nreport ->", json_out)


def cmd_replicate(assets, out):
    for zp in sorted(assets.glob("*.zip")):
        z = zipfile.ZipFile(zp)
        bad = z.testzip()
        if bad:
            print(f"SKIP {zp.name}: corrupt member {bad}")
            continue
        base = out / zp.stem
        base.mkdir(parents=True, exist_ok=True)
        root = base.resolve()
        manifest, skipped = [], 0
        for i in z.infolist():
            if i.is_dir():
                continue
            if is_junk(i.filename):
                skipped += 1
                continue
            if unsafe(i.filename):
                print(f"REFUSED unsafe path in {zp.name}: {i.filename}")
                continue
            dest = (base / i.filename).resolve()
            if root not in dest.parents:
                print(f"REFUSED path escape in {zp.name}: {i.filename}")
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            h = hashlib.sha256()
            with z.open(i) as src, open(dest, "wb") as dst:
                for chunk in iter(lambda: src.read(1 << 20), b""):
                    h.update(chunk)
                    dst.write(chunk)
            assert dest.stat().st_size == i.file_size, f"size mismatch {i.filename}"
            manifest.append({"path": i.filename, "bytes": i.file_size, "sha256": h.hexdigest()})
        (base / "manifest.json").write_text(json.dumps({"source_zip": zp.name, "files": manifest}, indent=1))
        print(f"{zp.name} -> {base}  ({len(manifest)} files, {skipped} junk skipped, sizes verified)")


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a or a[0] not in ("inspect", "replicate"):
        sys.exit(__doc__)
    cmd = a[0]
    jo = a[a.index("--json") + 1] if "--json" in a else None
    pos = [x for x in a[1:] if x != "--json" and x != jo]
    assets = Path(pos[0] if pos else "library/zips")
    if cmd == "inspect":
        cmd_inspect(assets, jo)
    else:
        cmd_replicate(assets, Path(pos[1] if len(pos) > 1 else "library/extracted"))
