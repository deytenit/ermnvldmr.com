#!/bin/bash
set -euo pipefail

PNPM_VERSION="${1:-9.12.3}"
NODE_VERSION="${2:-20}"

# Configure pnpm
case "$PNPM_VERSION" in
  8|9|9.12.3) ;;
  *) echo "Unsupported pnpm version: $PNPM_VERSION" >&2; exit 1 ;;
esac

PNPM_BIN="/opt/ci/pnpm/$PNPM_VERSION/bin"
if [ -d "$PNPM_BIN" ]; then
  if [ -n "${GITHUB_PATH:-}" ]; then
    echo "$PNPM_BIN" >> "$GITHUB_PATH"
  fi
  export PATH="$PNPM_BIN:$PATH"
fi

# Configure Node.js
case "$NODE_VERSION" in
  18*) major=18 ;;
  20*) major=20 ;;
  22*) major=22 ;;
  *) echo "Unsupported node version: $NODE_VERSION" >&2; exit 1 ;;
esac

NODE_BIN="/opt/ci/node/$major/bin"
if [ -d "$NODE_BIN" ]; then
  if [ -n "${GITHUB_PATH:-}" ]; then
    echo "$NODE_BIN" >> "$GITHUB_PATH"
  fi
  export PATH="$NODE_BIN:$PATH"
fi
