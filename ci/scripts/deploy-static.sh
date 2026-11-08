#!/bin/bash
set -e

echo "Deploying static service to S3..."

# Verify required environment variables
if [ -z "$S3_BUCKET" ]; then
    echo "Error: S3_BUCKET environment variable is not set"
    exit 1
fi

if [ -z "$AWS_REGION" ]; then
    echo "Error: AWS_REGION environment variable is not set"
    exit 1
fi

if [ -z "$S3_ENDPOINT_URL" ]; then
    echo "Error: S3_ENDPOINT_URL environment variable is not set"
    exit 1
fi

# Navigate to the dist directory
DIST_DIR="services/static/dist"

if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Build directory $DIST_DIR does not exist"
    exit 1
fi

# Configure AWS region
export AWS_DEFAULT_REGION="$AWS_REGION"
ENDPOINT_URL="${S3_ENDPOINT_URL%/}"

# Set S3 max_concurrent_requests to 1 to prevent race conditions on S3-compatible endpoints
aws configure set default.s3.max_concurrent_requests 1

# Upload all static files with retry
echo "Uploading static files..."
for attempt in 1 2 3; do
  echo "Attempt $attempt/3: syncing static files..."
  if aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET/" \
    --endpoint-url="$ENDPOINT_URL" \
    --cache-control "max-age=300"; then
    echo "Static files deployed successfully!"
    exit 0
  fi
  sleep 2
done

echo "Error: Failed to upload static files after 3 attempts."
exit 1
