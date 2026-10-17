"""Shared helpers for the asset pipeline (stdlib only, HTTP via curl).

The local python.org Python has no CA certs, so urllib TLS fails; every
request goes through the curl binary instead. Secrets are passed to curl on
stdin (--config -) so they never appear in `ps` output or in error messages.
"""
import json
import os
import re
import subprocess
import sys
import time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UA = "motion-editor-asset-pipeline/1.0 (local Remotion video editor; contact: repo owner)"

# ---- license policy --------------------------------------------------------
# Free to use with no credit required (credit still recorded when known).
FREE = {"cc0", "pdm", "public-domain", "0bsd", "unlicense", "mit", "isc", "apache-2.0",
        "pexels", "pixabay"}
# MIT/ISC/Apache want the copyright notice kept with redistributed copies.
NOTICE = {"mit", "isc", "apache-2.0"}
# Usable only with --allow-attribution and a credit line in the manifest.
ATTRIBUTION = {"cc-by", "cc-by-sa"}
# Source-specific custom licenses (not SPDX); caveats live in the SKILL.
CUSTOM = {"pexels", "pixabay"}

SOURCE_HOSTS = {  # download_url host must end with one of these
    "iconify": ["api.iconify.design"],
    "openverse": None,  # arbitrary upstream hosts (flickr, wikimedia, freesound, ...)
    "wikimedia": ["upload.wikimedia.org", "thumb.wikimedia.org"],
    "pexels": ["images.pexels.com"],
    "pixabay": ["pixabay.com"],
    "freesound": ["freesound.org"],
}


def norm_license(raw, version=None):
    """Return (slug, version). Slug is lowercase SPDX-ish; 'unknown' if unsure."""
    s = (raw or "").strip().lower()
    if not s:
        return "unknown", version
    if "publicdomain/zero" in s or re.search(r"\bcc0\b|creative commons 0|cc-zero", s):
        return "cc0", "1.0"
    if "publicdomain/mark" in s or s in ("pdm", "public domain mark") or "public domain mark" in s:
        return "pdm", "1.0"
    m = re.search(r"creativecommons\.org/licenses/([a-z\-]+)/([\d.]+)", s)
    if m:
        return "cc-" + m.group(1), m.group(2)
    m = re.match(r"^cc[ -]by((?:[ -](?:sa|nc|nd))*)[ -]?([\d.]+)?", s)
    if m:
        parts = re.findall(r"sa|nc|nd", m.group(1))
        return "-".join(["cc-by"] + parts), m.group(2) or version
    m = re.match(r"^(cc-by(?:-sa|-nc|-nd)*)-([\d.]+)$", s)
    if m:
        return m.group(1), m.group(2)
    if s in ("pd", "public domain") or s.startswith("pd-") or s.startswith("pd ") or "public domain" in s:
        return "public-domain", version
    s = s.replace(" ", "-")
    if s in ("apache-2.0", "apache2", "apache-2"):
        return "apache-2.0", "2.0"
    return s, version


def policy(slug, allow_attribution=False):
    """Return (ok, reason)."""
    if slug in FREE:
        return True, "allowlisted"
    if slug in ATTRIBUTION:
        if allow_attribution:
            return True, "attribution required (credit will be recorded)"
        return False, "%s needs attribution; re-run with --allow-attribution if you will credit it" % slug
    return False, "license %r is not on the allowlist (free: %s; attribution: %s)" % (
        slug, ", ".join(sorted(FREE)), ", ".join(sorted(ATTRIBUTION)))


# ---- env / keys ------------------------------------------------------------
def load_env():
    env = dict(os.environ)
    for path in (os.path.join(os.getcwd(), ".env"), os.path.join(ROOT, ".env")):
        if os.path.isfile(path):
            for line in open(path, encoding="utf-8"):
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                v = v.strip().strip('"').strip("'")
                if v and not env.get(k.strip()):
                    env[k.strip()] = v
    return env


class MissingKey(Exception):
    pass


def need_key(name, source, signup):
    v = load_env().get(name)
    if not v:
        raise MissingKey("source '%s' needs %s (free key: %s). Put it in ./.env as %s=... "
                         "or export it. No-key sources: iconify, openverse, wikimedia."
                         % (source, name, signup, name))
    return v


# ---- HTTP via curl ---------------------------------------------------------
def _q(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def curl(url, headers=None, out=None, retries=3, timeout=90):
    """GET url. Returns bytes (or writes to `out` and returns b'')."""
    cfg = ["url = " + _q(url), "user-agent = " + _q(UA), "location", "silent", "show-error",
           "max-time = %d" % timeout, 'write-out = "\\n%{http_code}"']
    for k, v in (headers or {}).items():
        cfg.append("header = " + _q("%s: %s" % (k, v)))
    err = ""
    for attempt in range(retries):
        cmd = ["curl", "--config", "-"]
        if out:
            cmd += ["-o", out]
        p = subprocess.run(cmd, input="\n".join(cfg).encode(), capture_output=True)
        body = p.stdout
        code = 0
        if out:
            m = re.search(rb"(\d{3})\s*$", body)
            code = int(m.group(1)) if m else 0
        else:
            body, _, c = body.rpartition(b"\n")
            code = int(c) if c.strip().isdigit() else 0
        if code == 200:
            return b"" if out else body
        err = "HTTP %s %s" % (code, p.stderr.decode(errors="replace").strip()[:200])
        if code in (429, 500, 502, 503, 504, 0) and attempt < retries - 1:
            time.sleep(2 * (attempt + 1))
            continue
        break
    raise RuntimeError("request failed (%s): %s" % (err, redact(url)))


def redact(url):
    return re.sub(r"(token|key)=[^&]+", r"\1=***", url)


def get_json(url, headers=None):
    return json.loads(curl(url, headers).decode("utf-8"))


def die(msg, code=2):
    sys.stderr.write("error: %s\n" % msg)
    sys.exit(code)


def strip_html(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or "")).strip()
