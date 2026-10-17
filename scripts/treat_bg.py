#!/usr/bin/env python3
"""Subject matte + background treatment (macOS / Linux / Windows).

  python scripts/treat_bg.py --setup [--cuda]   one-time: .venv-matte, pinned deps, RVM code + weights
  python scripts/treat_bg.py <video> <project_dir> [bgblur flags, e.g. --blur 20 --dim 0.35]

Writes <project_dir>/matte.mp4 and <project_dir>/base_bg.mp4 (drop-in source: same res/fps/audio).
Needs: Python 3.10+, ffmpeg + ffprobe on PATH, curl (ships with Windows 10+, macOS, most Linux).
Linux note: PyPI's torch is the multi-GB CUDA build, so --setup uses PyTorch's CPU index there
unless --cuda is given.
"""
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENV = ROOT / ".venv-matte"
RVM = VENV / "rvm"
PY = VENV / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
RAW = "https://raw.githubusercontent.com/PeterL1n/RobustVideoMatting/master/model/"
WEIGHTS = "https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3.pth"
MODULES = ["__init__", "model", "decoder", "deep_guided_filter", "fast_guided_filter",
           "lraspp", "mobilenetv3", "resnet"]


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 0:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if shutil.which("curl"):  # python.org builds on macOS lack CA certs, so prefer curl
        subprocess.check_call(["curl", "-fsSL", "-o", str(dest), url])
    else:
        urllib.request.urlretrieve(url, dest)


def setup(cuda):
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH (install ffmpeg first)")
    if not PY.exists():
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV)])
    pip = [str(PY), "-m", "pip", "install", "-q"]
    req = str(ROOT / "scripts" / "requirements-matte.txt")
    if sys.platform.startswith("linux") and not cuda:
        subprocess.check_call(pip + ["-r", req, "--extra-index-url", "https://download.pytorch.org/whl/cpu"])
    else:
        subprocess.check_call(pip + ["-r", req])
    for m in MODULES:
        fetch(RAW + m + ".py", RVM / (m + ".py"))
    fetch(WEIGHTS, RVM / "rvm_mobilenetv3.pth")
    print("setup ok")


def main():
    args = sys.argv[1:]
    if args[:1] == ["--setup"]:
        return setup("--cuda" in args)
    if len(args) < 2:
        sys.exit(__doc__)
    video, proj, extra = args[0], Path(args[1]), args[2:]
    if not (RVM / "rvm_mobilenetv3.pth").exists() or not PY.exists():
        sys.exit("run first: python scripts/treat_bg.py --setup")
    proj.mkdir(parents=True, exist_ok=True)
    here = Path(__file__).parent
    subprocess.check_call([str(PY), str(here / "matte.py"), video, str(proj / "matte.mp4")])
    subprocess.check_call([sys.executable, str(here / "bgblur.py"), video,
                           str(proj / "matte.mp4"), str(proj / "base_bg.mp4"), *extra])


if __name__ == "__main__":
    main()
