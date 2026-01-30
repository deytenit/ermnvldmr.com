#!/bin/bash
set -e

MODE=$1
TARGET=$2

if [ -z "$MODE" ] || [ -z "$TARGET" ]; then
    echo "Usage: $0 <mode: checkout|rc|release> <target: service_path|branch_name>"
    exit 1
fi

case $MODE in
    checkout)
        SERVICE_PATH=$TARGET
        SERVICE_NAME=$(basename "$SERVICE_PATH")
        VERSION=$(node -p "require('./$SERVICE_PATH/package.json').version")
        MAJOR_MINOR=$(echo "$VERSION" | cut -d. -f1,2)
        echo "releases/$SERVICE_NAME/v$MAJOR_MINOR"
        ;;
    rc|release)
        BRANCH_NAME=$TARGET
        # Extract service name and major.minor from branch: releases/www/v1.2
        if [[ ! $BRANCH_NAME =~ ^releases/([^/]+)/v([0-9]+\.[0-9]+)$ ]]; then
            echo "Error: Branch name must follow 'releases/<service>/v<major>.<minor>' format"
            exit 1
        fi
        SERVICE_NAME="${BASH_REMATCH[1]}"
        MAJOR_MINOR="${BASH_REMATCH[2]}"
        
        TAG_PREFIX="releases/$SERVICE_NAME/v$MAJOR_MINOR"
        
        # Ensure we have the latest tags
        git fetch --tags --quiet
        
        # Find the latest patch version for this Major.Minor
        LATEST_TAG=$(git tag -l "$TAG_PREFIX.*" | grep -v "\-rc" | sort -V | tail -n1 || echo "")
        
        if [ -z "$LATEST_TAG" ]; then
            PATCH=0
        else
            LATEST_VERSION=${LATEST_TAG#"$TAG_PREFIX."}
            PATCH=$((LATEST_VERSION + 1))
        fi
        
        VERSION_TAG="$MAJOR_MINOR.$PATCH"
        
        if [ "$MODE" == "release" ]; then
            echo "$VERSION_TAG"
        else
            # Calculate RC based on commit count since last tag
            # This ensures unique, increasing RC numbers without needing to tag every RC
            LAST_SERVICE_TAG=$(git describe --tags --match "releases/$SERVICE_NAME/*" --abbrev=0 HEAD 2>/dev/null || echo "")

            if [ -z "$LAST_SERVICE_TAG" ]; then
                COMMITS_COUNT=$(git rev-list --count HEAD)
            else
                COMMITS_COUNT=$(git rev-list --count "$LAST_SERVICE_TAG"..HEAD)
            fi

            RC=$((COMMITS_COUNT + 1))
            echo "$VERSION_TAG-rc.$RC"
        fi
        ;;
    *)
        echo "Unknown mode: $MODE"
        exit 1
        ;;
esac
