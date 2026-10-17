#!/usr/bin/env python3
"""Search copyright-safe asset sources. Prints a JSON list to stdout.

  python3 scripts/assets/search.py client --type icon
  python3 scripts/assets/search.py "federal reserve building" --type photo --source wikimedia
  python3 scripts/assets/search.py whoosh --type sfx --source openverse --limit 5
  python3 scripts/assets/search.py "oil refinery" --type photo --source all

Each result: id, source, type, title, preview_url, download_url, license,
license_version, license_url, author, source_url, attribution_required, credit...
Results whose license is not allowlisted are dropped unless --all-licenses.
Pipe one result (or the whole list plus --index N) to fetch.py.
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import MissingKey, die, policy  # noqa: E402
from sources import SOURCES, DEFAULT_SOURCE  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query")
    ap.add_argument("--type", required=True, choices=["icon", "photo", "sfx", "music"])
    ap.add_argument("--source", help="%s | all (default per type)" % ", ".join(SOURCES))
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--orientation", choices=["landscape", "portrait", "square"])
    ap.add_argument("--min-width", type=int, help="photos: minimum pixel width")
    ap.add_argument("--sets", help="icons: comma list of Iconify set prefixes (default: safe sets)")
    ap.add_argument("--max-duration", type=float, help="sfx: max seconds (freesound)")
    ap.add_argument("--allow-attribution", action="store_true",
                    help="also return CC-BY / CC-BY-SA results (credit is mandatory)")
    ap.add_argument("--all-licenses", action="store_true", help="debug: do not drop disallowed licenses")
    a = ap.parse_args()

    names = [a.source or DEFAULT_SOURCE[a.type]]
    if names[0] == "all":
        names = [n for n, s in SOURCES.items() if a.type in s["types"]]
    opts = {"allow_attribution": a.allow_attribution, "orientation": a.orientation,
            "min_width": a.min_width, "sets": a.sets.split(",") if a.sets else None}
    if a.max_duration:
        opts["max_duration"] = a.max_duration

    results, errors = [], []
    for n in names:
        s = SOURCES.get(n) or die("unknown source %r (have: %s)" % (n, ", ".join(SOURCES)))
        if a.type not in s["types"]:
            errors.append("%s does not provide %s (it provides: %s)" % (n, a.type, ", ".join(s["types"])))
            continue
        try:
            results += s["search"](a.query, a.type, a.limit, opts)
        except MissingKey as e:
            errors.append(str(e))
        except Exception as e:  # network/API error: report, keep other sources
            errors.append("%s: %s" % (n, e))
    if not a.all_licenses:
        kept = [r for r in results if policy(r["license"], a.allow_attribution)[0]]
        if len(kept) != len(results):
            errors.append("dropped %d result(s) with non-allowlisted licenses" % (len(results) - len(kept)))
        results = kept
    for e in errors:
        sys.stderr.write("note: %s\n" % e)
    if not results and errors:
        sys.exit(1)
    for r in results:
        r.pop("_verify_url", None)
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
