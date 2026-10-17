#!/usr/bin/env python3
"""Expose skills/<name>/ to Claude Code, Codex and Antigravity (macOS / Linux / Windows).

usage: python scripts/link_skills.py [--copy] [--clean]

Canonical skills live in skills/ (agent-agnostic). Each agent discovers skills from its own folder, so this
creates one link per skill in:
  .claude/skills/<name>   Claude Code   (https://code.claude.com/docs/en/skills)
  .agents/skills/<name>   Codex CLI     (shared by several agents; check developers.openai.com/codex/skills)
  .agent/skills/<name>    Antigravity   (workspace scope; see codelabs.developers.google.com antigravity skills)
Symlinks are relative. On Windows without symlink rights it tries a directory junction, then falls back to a copy.
--copy forces copies (re-run after editing a skill). --clean removes only links/copies this script made.
Generated folders are gitignored; run this after cloning. Existing real directories are never overwritten.
"""
import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / "skills"
TARGETS = [".claude/skills", ".agents/skills", ".agent/skills"]
MARK = ".linked-by-link_skills"


def made_by_us(p):
    return p.is_symlink() or (p.is_dir() and (p / MARK).exists())


def remove(p):
    if p.is_symlink() or p.is_file():
        p.unlink()
    elif p.is_dir():
        if sys.platform == "win32" and not (p / MARK).exists():
            os.rmdir(p)  # junction
        else:
            shutil.rmtree(p)


def link(src, dst, force_copy):
    if not force_copy:
        try:
            dst.symlink_to(os.path.relpath(src, dst.parent), target_is_directory=True)
            return "symlink"
        except OSError:
            if sys.platform == "win32":
                r = subprocess.run(["cmd", "/c", "mklink", "/J", str(dst), str(src)], capture_output=True)
                if r.returncode == 0:
                    return "junction"
    shutil.copytree(src, dst)
    (dst / MARK).write_text("generated copy of skills/" + src.name + "\n")
    return "copy"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--copy", action="store_true")
    ap.add_argument("--clean", action="store_true")
    a = ap.parse_args()
    names = sorted(d.name for d in SKILLS.iterdir() if (d / "SKILL.md").is_file())
    for t in TARGETS:
        base = ROOT / t
        for n in names:
            dst = base / n
            if dst.exists() or dst.is_symlink():
                if made_by_us(dst) or (sys.platform == "win32" and dst.is_dir() and dst.stat().st_nlink):
                    remove(dst)
                else:
                    print(f"skip {t}/{n}: real directory exists")
                    continue
            if a.clean:
                continue
            base.mkdir(parents=True, exist_ok=True)
            print(f"{link(SKILLS / n, dst, a.copy):8s} {t}/{n}")
    if a.clean:
        print("cleaned")


if __name__ == "__main__":
    main()
