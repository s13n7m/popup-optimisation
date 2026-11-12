#!/usr/bin/env bash
# Refresh template/ from this repo's guide/. Run from the repo root.
# Keeps the template's own example content, config and README.
set -euo pipefail
SRC=guide
DST=.claude/skills/project-guide/template
[ -d "$SRC" ] || { echo "Run from the repo root (guide/ not found)." >&2; exit 1; }
mkdir -p "$DST"
tar -C "$SRC" \
  --exclude=./node_modules --exclude=./dist --exclude=./.env \
  --exclude=./src/content --exclude=./src/config.ts --exclude=./README.md \
  -cf - . | tar -C "$DST" -xf -
echo "Template refreshed from $SRC. Review the diff before committing."
