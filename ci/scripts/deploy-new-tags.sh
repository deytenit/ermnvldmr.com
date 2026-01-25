#!/bin/bash
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/../deploy" && pwd)"

echo "Starting deployment for com-ermnvldmr..."

# Export current tags if they exist in .env to ensure continuity for services NOT being updated
if [ -f "$DEPLOY_DIR/.env" ]; then
    export $(grep -v '^#' "$DEPLOY_DIR/.env" | xargs)
fi

# Override with new tags provided via env (passed from GitHub)
# The variables DOCS_TAG and WWW_TAG should already be in the environment
export DOCS_TAG=${DOCS_TAG:-latest}
export WWW_TAG=${WWW_TAG:-latest}

# Generate new .env from template
echo "Generating .env from template..."
envsubst < "$DEPLOY_DIR/.env.template" > "$DEPLOY_DIR/.env"

# Run Docker Compose
cd "$DEPLOY_DIR"
echo "Pulling images..."
docker compose pull

echo "Starting containers..."
docker compose up --force-recreate --build -d --remove-orphans

echo "Pruning unused images..."
docker image prune -f

echo "Deployment complete."
