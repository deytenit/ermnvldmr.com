#!/bin/bash
set -euo pipefail

YEAR_MONTH=$(date -u +'%Y.%m')
git fetch --tags --quiet 2>/dev/null || true

# Find highest MICRO version for current YYYY.MM (matching tags formatted like YYYY.MM.MICRO)
LATEST_TAG=$(git tag -l "${YEAR_MONTH}.*" | sort -V | tail -n1 || echo "")

if [ -z "$LATEST_TAG" ]; then
    MICRO=0
else
    LATEST_MICRO="${LATEST_TAG#"${YEAR_MONTH}."}"
    if [[ "$LATEST_MICRO" =~ ^[0-9]+$ ]]; then
        MICRO=$((LATEST_MICRO + 1))
    else
        MICRO=0
    fi
fi

echo "${YEAR_MONTH}.${MICRO}"
