#!/bin/bash
set -euo pipefail

SERVICE=$1
TAG=$2

if [ -z "$SERVICE" ] || [ -z "$TAG" ]; then
    echo "Usage: $0 <service: www|docs|umami> <tag>"
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
kustomize edit set image "ghcr.io/deytenit/ermnvldmr.com/${SERVICE}=ghcr.io/deytenit/ermnvldmr.com/${SERVICE}:${TAG}"

cd "$ROOT_DIR"
git config user.name "adam-at-deytenit"
git config user.email "221188529+adam-at-deytenit@users.noreply.github.com"
git add "ci/k8s/apps/${SERVICE}/kustomization.yaml"

if git diff --staged --quiet; then
    echo "No manifest changes to commit for $SERVICE."
else
    git commit -m "chore(release): deploy ${SERVICE} ${TAG} [skip ci]"
    git push origin next
    echo "Successfully deployed $SERVICE ($TAG) via GitOps."
fi
