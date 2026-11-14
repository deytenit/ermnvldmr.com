#!/bin/bash
set -euo pipefail

SERVICE=$1
TAG=$2
RELEASE_TAG="${3:-services/${SERVICE}/${TAG}}"

if [ -z "$SERVICE" ] || [ -z "$TAG" ]; then
    echo "Usage: $0 <service: www|docs|exp> <tag> [release_tag]"
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="$ROOT_DIR/ci/k8s/apps/$SERVICE"

if [ ! -d "$APP_DIR" ]; then
    echo "Error: Application directory '$APP_DIR' does not exist."
    exit 1
fi

echo "Updating Kustomize image tag for '$SERVICE' to '$TAG'..."
cd "$APP_DIR"
IMAGE="git.ermnvldmr.com/deytenit/ermnvldmr.com/${SERVICE}"
if [[ "$TAG" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    kustomize edit set image "${IMAGE}=${IMAGE}@${TAG}"
elif [[ "$TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]]; then
    kustomize edit set image "${IMAGE}=${IMAGE}:${TAG}"
else
    echo "Invalid image digest or tag" >&2
    exit 1
fi

cd "$ROOT_DIR"
git config user.name "APEX CI"
git config user.email "adam@ermnvldmr.com"
git add "ci/k8s/apps/${SERVICE}/kustomization.yaml"

if git diff --staged --quiet; then
    echo "No manifest changes to commit for $SERVICE."
else
    git commit --no-gpg-sign -m "chore(release): promote ${RELEASE_TAG} to production stage [skip ci]"
    python3 "$ROOT_DIR/ci/scripts/git_write.py" HEAD:next
    echo "Successfully deployed $SERVICE ($TAG) via GitOps."
fi
