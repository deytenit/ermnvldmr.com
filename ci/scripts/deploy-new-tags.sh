#!/bin/bash
set -e

# Setup paths relative to the script location
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../deploy" && pwd)"
ENV_FILE="$DEPLOY_DIR/.env"
TEMPLATE_FILE="$DEPLOY_DIR/.env.template"

echo "Starting deployment for com-ermnvldmr..."

# 1. Load existing .env values as defaults (do NOT overwrite environment variables)
if [ -f "$ENV_FILE" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^# ]] || [[ -z "$line" ]] && continue
        
        key="${line%%=*}"
        val="${line#*=}"
        
        # Only export if the variable is not already set in the environment
        if [ -z "${!key}" ]; then
            export "$key"="$val"
        fi
    done < "$ENV_FILE"
fi

# 2. Apply final fallback defaults
export DOCS_TAG="${DOCS_TAG:-latest}"
export WWW_TAG="${WWW_TAG:-latest}"

# 3. Generate the .env file from template
# Explicitly list variables to substitute to avoid messing with other values
echo "Generating .env from template..."
envsubst '$DOCS_TAG $WWW_TAG' < "$TEMPLATE_FILE" > "$ENV_FILE"

# 4. Run Docker operations
cd "$DEPLOY_DIR"
echo "Pulling images..."
docker compose pull

echo "Starting containers..."
docker compose up -d --remove-orphans

echo "Pruning unused images..."
docker image prune -f

echo "Deployment complete."
