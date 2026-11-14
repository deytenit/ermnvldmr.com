#!/bin/bash
set -euo pipefail

MODE="version"
SERVICE=""
COMMIT="HEAD"
EXPLICIT_VERSION=""

if [ $# -ge 2 ] && [ "$1" = "tag" ]; then
    MODE="tag"
    SERVICE="$2"
    COMMIT="${3:-HEAD}"
    EXPLICIT_VERSION="${4:-}"
elif [ $# -ge 1 ]; then
    SERVICE="$1"
fi

YEAR_MONTH=$(date -u +'%Y.%m')
git fetch --tags --quiet 2>/dev/null || true

if [ -n "$SERVICE" ]; then
    PREFIX="services/${SERVICE}/"
    if [ -n "$EXPLICIT_VERSION" ]; then
        VERSION="$EXPLICIT_VERSION"
    else
        MAX_MICRO=0
        for CAND_PREFIX in "services/${SERVICE}/" "services/${SERVICE}-"; do
            LATEST_TAG=$(git tag -l "${CAND_PREFIX}${YEAR_MONTH}.*" | sort -V | tail -n1 || echo "")
            if [ -n "$LATEST_TAG" ]; then
                LATEST_MICRO="${LATEST_TAG#"${CAND_PREFIX}${YEAR_MONTH}."}"
                if [[ "$LATEST_MICRO" =~ ^[0-9]+$ ]] && [ "$LATEST_MICRO" -gt "$MAX_MICRO" ]; then
                    MAX_MICRO="$LATEST_MICRO"
                fi
            fi
        done
        MICRO=$((MAX_MICRO + 1))
        VERSION="${YEAR_MONTH}.${MICRO}"
    fi
    TAG_NAME="${PREFIX}${VERSION}"
else
    if [ -n "$EXPLICIT_VERSION" ]; then
        VERSION="$EXPLICIT_VERSION"
    else
        PATTERN="${YEAR_MONTH}.*"
        LATEST_TAG=$(git tag -l "$PATTERN" | sort -V | tail -n1 || echo "")
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
        VERSION="${YEAR_MONTH}.${MICRO}"
    fi
    TAG_NAME="$VERSION"
fi

if [ "$MODE" = "tag" ]; then
    ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
    if git rev-parse -q --verify "refs/tags/$TAG_NAME" >/dev/null; then
        EXISTING_COMMIT=$(git rev-parse "refs/tags/$TAG_NAME")
        if [ "$EXISTING_COMMIT" = "$(git rev-parse "$COMMIT")" ]; then
            echo "Tag $TAG_NAME already points to $COMMIT"
        else
            echo "Tag $TAG_NAME exists but points to $EXISTING_COMMIT, skipping create"
        fi
    else
        echo "Creating tag $TAG_NAME on $COMMIT..."
        git tag "$TAG_NAME" "$COMMIT"
    fi
    echo "Pushing tag $TAG_NAME..."
    python3 "$ROOT_DIR/ci/scripts/git_write.py" "refs/tags/$TAG_NAME"
    echo "Successfully created and pushed tag $TAG_NAME"
fi
echo "$VERSION"
