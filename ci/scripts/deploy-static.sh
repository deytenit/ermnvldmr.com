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
ENDPOINT_URL="$S3_ENDPOINT_URL"

# Upload all static files
echo "Uploading static files..."
aws s3 cp "$DIST_DIR/" "s3://$S3_BUCKET/" \
  --recursive \
  --endpoint-url="$ENDPOINT_URL" \
  --cache-control "max-age=300" \
  --metadata-directive REPLACE

echo "Static files deployed successfully!"
