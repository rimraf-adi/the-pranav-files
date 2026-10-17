#!/usr/bin/env python3
"""Download one asset into public/projects/<project>/assets/ and record it.

  python3 scripts/assets/fetch.py result.json demo --color '#FFFFFF'
  python3 scripts/assets/search.py bank --type icon | python3 scripts/assets/fetch.py - demo --index 0 --color '#FFF'
  python3 scripts/assets/fetch.py lucide:landmark demo --color '#FFFFFF' --name bank   # icon shorthand
  python3 scripts/assets/fetch.py https://api.iconify.design/ph/rocket-fill.svg demo --color '#fff'

Input: a search-result JSON file ('-' = stdin; a list needs --index/--id), an
Iconify id 'prefix:name', or an Iconify SVG URL. The license is re-verified
against the source API and checked against the allowlist before anything is
saved. Prints the path to use in timeline.json (relative to public/).
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys
import urllib.parse as up

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SOURCE_HOSTS, MissingKey, curl, die, policy  # noqa: E402
from sources import SOURCES, iconify_search  # noqa: E402

EXT_BY_TYPE = {"icon": "svg", "photo": "jpg", "sfx": "mp3", "music": "mp3"}
DIR_BY_TYPE = {"icon": "icons", "photo": "photos", "sfx": "sfx", "music": "music"}


def recolor_svg(svg, color, height=None):
    """Force a single flat color on every painted element of an SVG."""
    c = color
    svg = svg.replace("currentColor", c)
    # explicit fill/stroke colors (attributes and inline style) -> color, keep 'none'
    svg = re.sub(r'(fill|stroke)="(?!none|url)[^"]*"', r'\1="%s"' % c, svg)
    svg = re.sub(r'(fill|stroke):\s*(?!none|url)[^;"]+', r'\1:%s' % c, svg)
    root = re.search(r"<svg\b[^>]*>", svg)
    if root and 'fill="' not in root.group(0) and "fill:" not in root.group(0):
        # paths with no explicit fill default to black; set the default on the root,
        # unless the icon is stroke-based (stroke attr present on root or children)
        if "stroke=" not in svg:
            svg = svg.replace("<svg", '<svg fill="%s"' % c, 1)
    if height and root:
        tag = root.group(0)
        vb = re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', tag)
        if vb:
            w = round(float(vb.group(1)) / float(vb.group(2)) * height, 2)
            new = re.sub(r'\s(width|height)="[^"]*"', "", tag)
            new = new.replace("<svg", '<svg width="%s" height="%s"' % (w, height), 1)
            svg = svg.replace(tag, new, 1)
    return svg


def load_input(a):
    src = a.input
    if re.match(r"^[a-z0-9\-]+:[a-z0-9\-]+$", src):  # iconify shorthand
        prefix, name = src.split(":")
        r = [x for x in iconify_search(name, "icon", 32, {"sets": [prefix]}) if x["id"] == src]
        if not r:
            die("icon %s not found via Iconify search" % src)
        return r[0]
    m = re.match(r"^https://api\.iconify\.design/([a-z0-9\-]+)/([a-z0-9\-]+)\.svg", src)
    if m:
        return load_input(argparse.Namespace(input="%s:%s" % m.groups()))
    if src.startswith("http"):
        die("raw URLs are refused (no license info). Use a search result, 'prefix:name' or an Iconify URL.")
    data = json.load(sys.stdin if src == "-" else open(src, encoding="utf-8"))
    if isinstance(data, list):
        if a.id:
            data = [x for x in data if x["id"] == a.id]
            if not data:
                die("no result with id %s" % a.id)
        elif a.index is None:
            if len(data) != 1:
                die("input is a list of %d results; choose with --index N or --id ID" % len(data))
            data = data[:1]
        else:
            data = [data[a.index]]
        data = data[0]
    return data


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "asset"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("project")
    ap.add_argument("--index", type=int)
    ap.add_argument("--id")
    ap.add_argument("--name", help="output file stem (default: derived from title)")
    ap.add_argument("--color", help="icons: recolor to one flat color, e.g. '#FFFFFF'")
    ap.add_argument("--size", type=int, default=256, help="icons: pixel height written into the SVG")
    ap.add_argument("--allow-attribution", action="store_true",
                    help="permit CC-BY / CC-BY-SA (credit is stored in the manifest; you must show it)")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    r = load_input(a)
    for k in ("id", "source", "type", "download_url", "license"):
        if not r.get(k):
            die("result is missing %r" % k)
    src = SOURCES.get(r["source"]) or die("unknown source %r" % r["source"])

    # 1. download host must match the source (blocks forged results)
    hosts = SOURCE_HOSTS.get(r["source"])
    host = up.urlparse(r["download_url"]).hostname or ""
    if hosts and not any(host == h or host.endswith("." + h) for h in hosts):
        die("download host %s is not an allowed host for source %s" % (host, r["source"]))
    if not r["download_url"].startswith("https://"):
        die("only https downloads are allowed")

    # 2. authoritative license re-check, then allowlist
    try:
        if src["verify"]:
            r = src["verify"](r)
    except MissingKey as e:
        die(str(e))
    except Exception as e:
        die("could not re-verify license with %s: %s" % (r["source"], e))
    ok, why = policy(r["license"], a.allow_attribution)
    if not ok:
        die("REFUSED %s/%s: %s" % (r["source"], r["id"], why), code=3)
    if r["license"] in ("pexels", "pixabay") or r["source"] in ("pexels", "pixabay"):
        sys.stderr.write("note: %s uses its own license (no CC0); see skills/find-assets/SKILL.md\n" % r["source"])
    if r.get("attribution_required") and not (r.get("author") and r.get("credit")):
        die("REFUSED: attribution required but author/credit unknown")

    # 3. download
    typ = r["type"]
    stem = slugify(a.name or r.get("title") or r["id"])
    if typ == "icon" and not a.name:
        stem = slugify(r["id"].replace(":", "-"))
    ext = EXT_BY_TYPE[typ]
    if typ in ("photo",):
        m = re.search(r"\.(jpe?g|png|webp)(\?|$)", r["download_url"], re.I)
        ext = m.group(1).lower().replace("jpeg", "jpg") if m else "jpg"
    if typ in ("sfx", "music"):
        m = re.search(r"\.(mp3|ogg|oga|wav|flac|opus)(\?|$)", r["download_url"], re.I)
        ext = m.group(1).lower() if m else "mp3"
    rel_dir = "projects/%s/assets/%s" % (a.project, DIR_BY_TYPE[typ])
    out_dir = os.path.join(ROOT, "public", rel_dir)
    rel_file = "%s/%s.%s" % (rel_dir, stem, ext)
    abs_file = os.path.join(ROOT, "public", rel_file)
    if a.dry_run:
        print(json.dumps({"would_save": rel_file, "license": r["license"], "reason": why}))
        return
    os.makedirs(out_dir, exist_ok=True)

    if typ == "icon":
        svg = curl(r["download_url"] + ("?" if "?" not in r["download_url"] else "&") + "height=%d" % a.size).decode("utf-8")
        if a.color:
            if not re.match(r"^#[0-9a-fA-F]{3,8}$", a.color):
                die("--color must be a hex like '#FFFFFF'")
            svg = recolor_svg(svg, a.color, a.size)
        open(abs_file, "w", encoding="utf-8").write(svg)
    else:
        curl(r["download_url"], out=abs_file, timeout=180)
    data = open(abs_file, "rb").read()
    if not data:
        os.remove(abs_file)
        die("empty download")
    if typ in ("photo",) and data[:5] in (b"<!DOC", b"<html", b"<?xml"):
        os.remove(abs_file)
        die("download was not an image")

    # 4. manifest
    mpath = os.path.join(ROOT, "public", "projects", a.project, "assets", "manifest.json")
    manifest = json.load(open(mpath)) if os.path.isfile(mpath) else []
    manifest = [e for e in manifest if e.get("file") != rel_file]
    manifest.append({
        "file": rel_file, "type": typ, "source": r["source"], "source_id": r["id"],
        "title": r.get("title", ""), "source_url": r.get("source_url") or r["download_url"],
        "download_url": r["download_url"], "author": r.get("author", ""),
        "author_url": r.get("author_url", ""), "license": r["license"],
        "license_version": r.get("license_version"), "license_url": r.get("license_url", ""),
        "attribution_required": bool(r.get("attribution_required")), "credit": r.get("credit", ""),
        "color": a.color if typ == "icon" else None, "notes": r.get("notes", ""),
        "sha256": hashlib.sha256(open(abs_file, "rb").read()).hexdigest(),
        "retrieved_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
    })
    json.dump(manifest, open(mpath, "w"), indent=2, ensure_ascii=False)
    print(rel_file)
    sys.stderr.write("saved %s (%s, %s%s)\n" % (rel_file, r["license"], r["source"],
                     "; CREDIT REQUIRED: " + r["credit"] if r.get("attribution_required") else ""))


if __name__ == "__main__":
    main()
