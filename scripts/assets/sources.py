"""Per-source adapters: search() -> normalized results, verify() -> re-check license.

Normalized result keys: id, source, type, title, preview_url, download_url,
license (slug), license_version, license_url, author, author_url, source_url,
width, height, duration, attribution_required, credit, notes.
"""
import urllib.parse as up

from common import (curl, get_json, load_env, need_key, norm_license, policy, strip_html,
                    MissingKey, ATTRIBUTION)

DEFAULT_ICON_SETS = ["lucide", "tabler", "ph", "mdi", "material-symbols", "heroicons", "ri",
                     "carbon", "mingcute"]  # all MIT / ISC / Apache-2.0 (verified via /collections)


def mk(source, type_, id_, title, preview, download, lic, lic_ver, lic_url, author, author_url,
       source_url, width=None, height=None, duration=None, notes=""):
    attrib = lic in ATTRIBUTION
    who = author or "unknown"
    lname = (lic.upper() + (" " + lic_ver if lic_ver else "")) if lic else "?"
    credit = '"%s" by %s (%s), %s' % (title, who, source, lname) if (attrib or author) else ""
    return {"id": str(id_), "source": source, "type": type_, "title": title,
            "preview_url": preview, "download_url": download, "license": lic,
            "license_version": lic_ver, "license_url": lic_url, "author": author,
            "author_url": author_url, "source_url": source_url, "width": width,
            "height": height, "duration": duration, "attribution_required": attrib,
            "credit": credit, "notes": notes}


# ---------------------------------------------------------------- iconify
def _iconify_licenses(prefixes):
    d = get_json("https://api.iconify.design/collections?prefixes=" + ",".join(prefixes))
    return {p: v for p, v in d.items()}


def iconify_search(q, type_, limit, opts):
    sets = opts.get("sets") or DEFAULT_ICON_SETS
    d = get_json("https://api.iconify.design/search?query=%s&limit=%d&prefixes=%s"
                 % (up.quote(q), max(limit, 32), ",".join(sets)))
    cols = d.get("collections", {})
    out = []
    for full in d.get("icons", [])[:limit]:
        prefix, name = full.split(":", 1)
        c = cols.get(prefix, {})
        lic = c.get("license", {})
        slug, ver = norm_license(lic.get("spdx") or lic.get("title"))
        out.append(mk("iconify", "icon", full, name,
                      "https://api.iconify.design/%s/%s.svg?height=128&color=%%23ffffff" % (prefix, name),
                      "https://api.iconify.design/%s/%s.svg" % (prefix, name),
                      slug, ver, lic.get("url", ""), (c.get("author") or {}).get("name", ""),
                      (c.get("author") or {}).get("url", ""),
                      "https://icon-sets.iconify.design/%s/%s/" % (prefix, name),
                      notes="set: %s (%s)" % (c.get("name", prefix), lic.get("title", "?"))))
    return out


def iconify_verify(r):
    prefix = r["id"].split(":")[0]
    c = _iconify_licenses([prefix]).get(prefix)
    if not c:
        raise RuntimeError("unknown icon set " + prefix)
    lic = c.get("license", {})
    slug, ver = norm_license(lic.get("spdx") or lic.get("title"))
    r.update(license=slug, license_version=ver, license_url=lic.get("url", ""))
    r["attribution_required"] = slug in ATTRIBUTION
    return r


# -------------------------------------------------------------- openverse
def _ov_licenses(opts):
    return "cc0,pdm" + (",by,by-sa" if opts.get("allow_attribution") else "")


def openverse_search(q, type_, limit, opts):
    kind = "images" if type_ in ("photo", "icon") else "audio"
    url = "https://api.openverse.org/v1/%s/?q=%s&license=%s&page_size=%d&mature=false" % (
        kind, up.quote(q), _ov_licenses(opts), min(limit, 20))  # anon page_size cap
    if kind == "images":
        url += "&category=photograph&extension=jpg,png,webp" if type_ == "photo" else ""
        if opts.get("orientation"):
            url += "&aspect_ratio=" + {"portrait": "tall", "landscape": "wide",
                                       "square": "square"}[opts["orientation"]]
    else:
        # category is unset for most CC0 audio (freesound), so filter by length instead
        url += "&length=" + ("shortest" if type_ == "sfx" else "medium,long")
    out = []
    for x in get_json(url).get("results", []):
        slug, ver = norm_license(x.get("license"), x.get("license_version"))
        out.append(mk("openverse", type_, x["id"], x.get("title") or x["id"],
                      x.get("thumbnail") or x.get("url"), x["url"], slug, ver,
                      x.get("license_url", ""), x.get("creator") or "", x.get("creator_url") or "",
                      x.get("foreign_landing_url") or "", x.get("width"), x.get("height"),
                      (x.get("duration") or 0) / 1000.0 or None,
                      notes="upstream provider: %s; %s" % (x.get("provider"), x.get("attribution", ""))))
        out[-1]["_verify_url"] = "https://api.openverse.org/v1/%s/%s/" % (kind, x["id"])
    return out


def openverse_verify(r):
    kind = "images" if r["type"] in ("photo", "icon") else "audio"
    x = get_json("https://api.openverse.org/v1/%s/%s/" % (kind, r["id"]))
    slug, ver = norm_license(x.get("license"), x.get("license_version"))
    r.update(license=slug, license_version=ver, license_url=x.get("license_url", ""),
             download_url=x["url"], attribution_required=slug in ATTRIBUTION)
    return r


# -------------------------------------------------------------- wikimedia
WM = "https://commons.wikimedia.org/w/api.php"


def _wm_item(p, type_, width_cap=1920):
    i = (p.get("imageinfo") or [{}])[0]
    m = i.get("extmetadata", {})
    g = lambda k: strip_html((m.get(k) or {}).get("value", ""))
    slug, ver = norm_license(g("LicenseShortName") or g("License"))
    title = p["title"][5:] if p["title"].startswith("File:") else p["title"]
    w = i.get("width")
    dl = i.get("thumburl") if (type_ == "photo" and w and w > width_cap and i.get("thumburl")) else i.get("url")
    notes = []
    if g("Restrictions"):
        notes.append("restrictions: " + g("Restrictions"))
    notes.append("check trademarks/people in frame; Commons only vets copyright")
    r = mk("wikimedia", type_, p["title"], title, i.get("thumburl") or i.get("url"), dl, slug, ver,
           g("LicenseUrl"), g("Artist"), "", i.get("descriptionurl", ""), w, i.get("height"),
           i.get("duration"), notes="; ".join(notes))
    r["credit_html_stripped"] = True
    return r


def wikimedia_search(q, type_, limit, opts):
    ft = "bitmap" if type_ == "photo" else "audio"
    d = get_json(WM + "?action=query&generator=search&gsrsearch=%s&gsrnamespace=6&gsrlimit=%d"
                 "&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1920&format=json&formatversion=2"
                 % (up.quote("%s filetype:%s" % (q, ft)), min(limit * 3, 50)))
    out = []
    for p in sorted(d.get("query", {}).get("pages", []), key=lambda p: p.get("index", 0)):
        if "imageinfo" not in p:
            continue
        r = _wm_item(p, type_)
        if opts.get("min_width") and (r["width"] or 0) < opts["min_width"]:
            continue
        # Commons has no license filter in search: drop disallowed ones client-side.
        if not policy(r["license"], opts.get("allow_attribution"))[0]:
            continue
        out.append(r)
    return out[:limit]


def wikimedia_verify(r):
    d = get_json(WM + "?action=query&titles=%s&prop=imageinfo&iiprop=url|extmetadata|size|mime"
                 "&iiurlwidth=1920&format=json&formatversion=2" % up.quote(r["id"]))
    v = _wm_item(d["query"]["pages"][0], r["type"])
    for k in ("license", "license_version", "license_url", "attribution_required", "credit",
              "download_url", "author"):
        r[k] = v[k]
    return r


# ----------------------------------------------------------------- pexels
def pexels_search(q, type_, limit, opts):
    if type_ != "photo":
        raise RuntimeError("pexels only supplies photos/videos here")
    key = need_key("PEXELS_API_KEY", "pexels", "https://www.pexels.com/api/")
    url = "https://api.pexels.com/v1/search?query=%s&per_page=%d" % (up.quote(q), min(limit, 80))
    if opts.get("orientation"):
        url += "&orientation=" + opts["orientation"]
    out = []
    for x in get_json(url, {"Authorization": key}).get("photos", []):
        r = mk("pexels", "photo", x["id"], x.get("alt") or "pexels %s" % x["id"],
               x["src"]["medium"], x["src"]["large2x"], "pexels", None,
               "https://www.pexels.com/license/", x.get("photographer", ""),
               x.get("photographer_url", ""), x["url"], x.get("width"), x.get("height"),
               notes="Pexels License: no identifiable people in a bad light, no implied endorsement")
        r["credit"] = "Photo by %s on Pexels" % x.get("photographer", "unknown")
        if not opts.get("min_width") or (r["width"] or 0) >= opts["min_width"]:
            out.append(r)
    return out


# ---------------------------------------------------------------- pixabay
def pixabay_search(q, type_, limit, opts):
    if type_ != "photo":
        raise RuntimeError("pixabay: only photo search implemented (no audio API verified)")
    key = need_key("PIXABAY_API_KEY", "pixabay", "https://pixabay.com/api/docs/")
    url = "https://pixabay.com/api/?key=%s&q=%s&image_type=photo&safesearch=true&per_page=%d" % (
        key, up.quote(q), max(3, min(limit, 200)))
    if opts.get("orientation") in ("landscape", "portrait"):
        url += "&orientation=" + ("horizontal" if opts["orientation"] == "landscape" else "vertical")
    out = []
    for x in get_json(url).get("hits", [])[:limit]:
        r = mk("pixabay", "photo", x["id"], (x.get("tags") or "pixabay").split(",")[0],
               x.get("webformatURL"), x.get("largeImageURL"), "pixabay", None,
               "https://pixabay.com/service/license-summary/", x.get("user", ""),
               "https://pixabay.com/users/%s-%s/" % (x.get("user"), x.get("user_id")),
               x.get("pageURL", ""), x.get("imageWidth"), x.get("imageHeight"),
               notes="Pixabay Content License: no standalone resale, careful with brands/people")
        r["credit"] = "Image by %s from Pixabay" % x.get("user", "unknown")
        if not opts.get("min_width") or (r["width"] or 0) >= opts["min_width"]:
            out.append(r)
    return out


# -------------------------------------------------------------- freesound
def freesound_search(q, type_, limit, opts):
    if type_ not in ("sfx", "music"):
        raise RuntimeError("freesound is audio only")
    key = need_key("FREESOUND_API_KEY", "freesound", "https://freesound.org/apiv2/apply")
    lic = '"Creative Commons 0"' + (' OR "Attribution"' if opts.get("allow_attribution") else "")
    flt = "license:(%s)" % lic
    if type_ == "sfx":
        flt += " duration:[0 TO %s]" % opts.get("max_duration", 6)
    else:
        flt += " duration:[20 TO *]"
    url = ("https://freesound.org/apiv2/search/text/?query=%s&filter=%s&page_size=%d"
           "&fields=id,name,username,license,previews,url,duration&token=%s"
           % (up.quote(q), up.quote(flt), min(limit, 50), key))
    out = []
    for x in get_json(url).get("results", []):
        slug, ver = norm_license(x.get("license"))
        pv = x.get("previews", {})
        out.append(mk("freesound", type_, x["id"], x.get("name", ""), pv.get("preview-lq-mp3"),
                      pv.get("preview-hq-mp3"), slug, ver, x.get("license", ""),
                      x.get("username", ""), "https://freesound.org/people/%s/" % x.get("username"),
                      x.get("url", ""), duration=x.get("duration"),
                      notes="preview-quality mp3 (originals need OAuth2)"))
    return out


def freesound_verify(r):
    key = need_key("FREESOUND_API_KEY", "freesound", "https://freesound.org/apiv2/apply")
    x = get_json("https://freesound.org/apiv2/sounds/%s/?fields=license,previews&token=%s" % (r["id"], key))
    slug, ver = norm_license(x.get("license"))
    r.update(license=slug, license_version=ver, license_url=x.get("license", ""),
             download_url=x["previews"]["preview-hq-mp3"], attribution_required=slug in ATTRIBUTION)
    return r


# ---------------------------------------------------------------- registry
SOURCES = {
    "iconify": {"types": ["icon"], "key": None, "search": iconify_search, "verify": iconify_verify},
    "openverse": {"types": ["photo", "sfx", "music"], "key": None,
                  "search": openverse_search, "verify": openverse_verify},
    "wikimedia": {"types": ["photo", "sfx", "music"], "key": None,
                  "search": wikimedia_search, "verify": wikimedia_verify},
    "pexels": {"types": ["photo"], "key": "PEXELS_API_KEY", "search": pexels_search, "verify": None},
    "pixabay": {"types": ["photo"], "key": "PIXABAY_API_KEY", "search": pixabay_search, "verify": None},
    "freesound": {"types": ["sfx", "music"], "key": "FREESOUND_API_KEY",
                  "search": freesound_search, "verify": freesound_verify},
}
DEFAULT_SOURCE = {"icon": "iconify", "photo": "openverse", "sfx": "openverse", "music": "openverse"}
