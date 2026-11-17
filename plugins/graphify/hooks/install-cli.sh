#!/usr/bin/env bash
# Ensure the graphify CLI is available; install it if missing. Never blocks the session.
export PATH="$HOME/.local/bin:$PATH"
command -v graphify >/dev/null 2>&1 && exit 0
if command -v uv >/dev/null 2>&1; then
  uv tool install graphifyy >/dev/null 2>&1
elif command -v pipx >/dev/null 2>&1; then
  pipx install graphifyy >/dev/null 2>&1
else
  python3 -m pip install --user graphifyy >/dev/null 2>&1
fi
if command -v graphify >/dev/null 2>&1; then
  echo "graphify CLI installed ($(graphify --version 2>/dev/null))."
else
  echo "graphify plugin: could not install the graphify CLI automatically. Run: uv tool install graphifyy" >&2
fi
exit 0
