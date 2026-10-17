#!/usr/bin/env python3
"""Audit public/projects/<project>/assets/manifest.json. Exit 1 on any failure.

  python3 scripts/assets/license_check.py demo
  python3 scripts/assets/license_check.py demo --credits    # also write assets/CREDITS.md

Fails on: missing/unknown/disallowed license, attribution required without a
credit line, missing source_url, listed file missing, file not in manifest
(untracked asset), or a file changed since download (sha256 mismatch).
Warns (exit 0) for MIT/ISC/Apache icons (keep notice) and custom licenses.
"""
import argparse
import hashlib
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ATTRIBUTION, CUSTOM, FREE, NOTICE, ROOT  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--credits", action="store_true")
    a = ap.parse_args()
    adir = os.path.join(ROOT, "public", "projects", a.project, "assets")
    mpath = os.path.join(adir, "manifest.json")
    if not os.path.isfile(mpath):
        print("FAIL: no manifest at %s" % os.path.relpath(mpath, ROOT))
        sys.exit(1)
    manifest = json.load(open(mpath))
    fails, warns, listed = [], [], set()
    for e in manifest:
        f, lic = e.get("file", "?"), (e.get("license") or "").lower()
        listed.add(f)
        p = os.path.join(ROOT, "public", f)
        if not os.path.isfile(p):
            fails.append("%s: file missing" % f)
        elif e.get("sha256") and hashlib.sha256(open(p, "rb").read()).hexdigest() != e["sha256"]:
            fails.append("%s: file changed since download (sha256 mismatch)" % f)
        if not lic or lic == "unknown":
            fails.append("%s: missing/unknown license" % f)
        elif lic not in FREE and lic not in ATTRIBUTION:
            fails.append("%s: license %r not on allowlist" % (f, lic))
        if not e.get("source_url"):
            fails.append("%s: no source_url" % f)
        if lic in ATTRIBUTION or e.get("attribution_required"):
            if not (e.get("credit") and e.get("author")):
                fails.append("%s: attribution required but no author/credit" % f)
            else:
                warns.append("%s: ATTRIBUTION REQUIRED -> show: %s" % (f, e["credit"]))
        if lic in NOTICE:
            warns.append("%s: %s notice - keep in CREDITS (%s)" % (f, lic, e.get("license_url", "")))
        if lic in CUSTOM:
            warns.append("%s: %s custom license; avoid identifiable people in bad light / implied endorsement" % (f, lic))
    for root, _, files in os.walk(adir):
        for n in files:
            rel = os.path.relpath(os.path.join(root, n), os.path.join(ROOT, "public"))
            if n in ("manifest.json", "CREDITS.md") or n.startswith("."):
                continue
            if rel not in listed:
                fails.append("%s: not in manifest (unknown provenance)" % rel)
    if a.credits:
        lines = ["# Asset credits", ""]
        for e in manifest:
            lines.append("- `%s` - %s - %s %s - %s" % (e["file"], e.get("credit") or e.get("author") or "n/a",
                         e["license"], e.get("license_version") or "", e.get("source_url", "")))
        open(os.path.join(adir, "CREDITS.md"), "w").write("\n".join(lines) + "\n")
    for w in warns:
        print("warn: " + w)
    for f in fails:
        print("FAIL: " + f)
    print("%d asset(s), %d failure(s), %d warning(s)" % (len(manifest), len(fails), len(warns)))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
