#!/usr/bin/env bash
# usage: contact_sheet.sh <video.mp4> <out.png> [every_n_seconds=1]
# Tiles frames into one PNG so the agent can inspect the edit with the Read tool.
set -euo pipefail
in="$1"; out="$2"; n="${3:-1}"
ffmpeg -y -loglevel error -i "$in" -vf "fps=1/$n,scale=216:-1,tile=8x4" -frames:v 1 "$out"
echo "$out"
