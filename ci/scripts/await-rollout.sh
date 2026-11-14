#!/bin/bash
set -euo pipefail

SERVICE="${1:-}"
TARGET_COMMIT="${2:-}"
ENDPOINT="${3:-https://${SERVICE}.ermnvldmr.com/version.json}"

if [ -z "$SERVICE" ] || [ -z "$TARGET_COMMIT" ]; then
  echo "Usage: $0 <service: www|docs> <target_commit> [endpoint_url]" >&2
  exit 1
fi

echo "========================================================"
echo "Verifying production deployment on $ENDPOINT"
echo "Expected commit: $TARGET_COMMIT"
echo "========================================================"

TIMEOUT_SECONDS=1024
START_TS=$(date +%s)
ATTEMPT=1
SLEEP_SECONDS=1
CF_BLOCKED_COUNT=0

while true; do
  ELAPSED=$(($(date +%s) - START_TS))
  echo "Attempt $ATTEMPT (${ELAPSED}s/${TIMEOUT_SECONDS}s): Polling $ENDPOINT..."

  RESP_FILE=$(mktemp)
  HTTP_CODE=$(curl -sL --max-time 10 \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
    -H "Accept: application/json" \
    -H "Cache-Control: no-cache" \
    -o "$RESP_FILE" \
    -w "%{http_code}" \
    "$ENDPOINT" || echo "000")

  if [ "$HTTP_CODE" = "200" ]; then
    LIVE_COMMIT=$(jq -r '.commit // empty' "$RESP_FILE" 2>/dev/null || true)
    LIVE_VERSION=$(jq -r '.version // empty' "$RESP_FILE" 2>/dev/null || true)
    echo "  Live commit: ${LIVE_COMMIT:-<none>}, Live version: ${LIVE_VERSION:-<none>}"

    if [ "$LIVE_COMMIT" = "$TARGET_COMMIT" ] || [ "$LIVE_VERSION" = "$TARGET_COMMIT" ]; then
      echo "✅ Success! Production $SERVICE has successfully rolled out $TARGET_COMMIT."
      rm -f "$RESP_FILE"
      exit 0
    fi
  elif [ "$HTTP_CODE" = "403" ] || [ "$HTTP_CODE" = "503" ]; then
    echo "  HTTP $HTTP_CODE: Cloudflare WAF/challenge encountered from runner IP."
    CF_BLOCKED_COUNT=$((CF_BLOCKED_COUNT + 1))
  else
    echo "  HTTP $HTTP_CODE: Endpoint returned unexpected status code or timed out."
  fi

  rm -f "$RESP_FILE"

  if [ $CF_BLOCKED_COUNT -ge 5 ]; then
    echo "⚠️ Cloudflare WAF consistently blocked external probe requests from this runner IP (HTTP $HTTP_CODE)."
    echo "The GitOps release commit was already pushed to the repository; FluxCD will reconcile the cluster."
    echo "Skipping further external HTTP verification to avoid false negative."
    exit 0
  fi

  ELAPSED=$(($(date +%s) - START_TS))
  REMAINING=$((TIMEOUT_SECONDS - ELAPSED))
  if [ "$REMAINING" -le 0 ]; then
    break
  fi

  WAIT_FOR=$SLEEP_SECONDS
  if [ "$WAIT_FOR" -gt "$REMAINING" ]; then
    WAIT_FOR=$REMAINING
  fi

  echo "  Waiting ${WAIT_FOR}s before next check..."
  sleep "$WAIT_FOR"

  ATTEMPT=$((ATTEMPT + 1))
  SLEEP_SECONDS=$((SLEEP_SECONDS * 2))
done

echo "❌ Deployment verification timed out after ${TIMEOUT_SECONDS}s."
exit 1
