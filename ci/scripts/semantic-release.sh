#!/bin/bash
set -e

MODE=$1
TARGET=$2
INCREMENT_MAJOR=${3:-false}

if [ -z "$MODE" ] || [ -z "$TARGET" ]; then
    echo "Usage: $0 <mode: checkout|rc|release> <target: service_path|branch_name> [increment_major: true|false]"
    exit 1
fi

case $MODE in
    checkout)
        SERVICE_PATH=$TARGET
        SERVICE_NAME=$(basename "$SERVICE_PATH")

        # Ensure we have the latest tags and branches
        git fetch --all --tags --quiet 2>/dev/null || true

        BRANCH_NAME=$(node -e '
          const { execSync } = require("child_process");
          const serviceName = process.argv[1];
          const servicePath = process.argv[2];
          const incrementMajor = process.argv[3] === "true" || process.argv[3] === "major" || process.argv[3] === "1";

          let rawBranchesAndTags = "";
          try {
            const remoteBranches = execSync(`git branch -r --list "origin/releases/${serviceName}/v*"`, { encoding: "utf8" });
            const localBranches = execSync(`git branch --list "releases/${serviceName}/v*"`, { encoding: "utf8" });
            const tags = execSync(`git tag -l "releases/${serviceName}/v*"`, { encoding: "utf8" });
            rawBranchesAndTags = `${remoteBranches}\n${localBranches}\n${tags}`;
          } catch (e) {}

          const versionMatches = Array.from(rawBranchesAndTags.matchAll(/releases\/[^\/]+\/v([0-9]+)\.([0-9]+)/g));

          if (versionMatches.length === 0) {
            let pkgVersion = "1.0";
            try {
              pkgVersion = require(`./${servicePath}/package.json`).version.split(".").slice(0, 2).join(".");
            } catch (e) {}
            console.log(`releases/${serviceName}/v${pkgVersion}`);
            process.exit(0);
          }

          let maxMajor = 1;
          let maxMinor = 0;
          for (const match of versionMatches) {
            const maj = parseInt(match[1], 10);
            const min = parseInt(match[2], 10);
            if (!isNaN(maj) && !isNaN(min)) {
              if (maj > maxMajor || (maj === maxMajor && min > maxMinor)) {
                maxMajor = maj;
                maxMinor = min;
              }
            }
          }

          if (incrementMajor) {
            console.log(`releases/${serviceName}/v${maxMajor + 1}.0`);
          } else {
            console.log(`releases/${serviceName}/v${maxMajor}.${maxMinor + 1}`);
          }
        ' "$SERVICE_NAME" "$SERVICE_PATH" "$INCREMENT_MAJOR")

        echo "$BRANCH_NAME"
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
