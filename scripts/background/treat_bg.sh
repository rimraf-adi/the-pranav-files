#!/usr/bin/env bash
# Thin shim for macOS/Linux; the real (cross-platform) driver is scripts/background/treat_bg.py.
exec python3 "$(dirname "$0")/treat_bg.py" "$@"
