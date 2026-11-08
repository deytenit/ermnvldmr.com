#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-com-ermnvldmr-debian-12-k3s-amd64.qcow2}"
mv output-qemu/com-ermnvldmr-debian-12-k3s-amd64.qcow2 "output-qemu/${IMAGE_NAME}"

if [ -n "${S3_BUCKET:-}" ] && [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
  ENDPOINT_FLAG=""
  [ -n "${S3_ENDPOINT:-}" ] && ENDPOINT_FLAG="--endpoint-url=${S3_ENDPOINT}"
  echo "Cleaning up older images in dev/images/ to free bucket storage..."
  aws ${ENDPOINT_FLAG} s3 rm "s3://${S3_BUCKET}/dev/images/" --recursive --exclude "*" --include "com-ermnvldmr-debian-12-k3s-*.qcow2" || true
  aws ${ENDPOINT_FLAG} s3 cp "output-qemu/${IMAGE_NAME}" "s3://${S3_BUCKET}/dev/images/${IMAGE_NAME}"
  echo "Golden image uploaded to s3://${S3_BUCKET}/dev/images/${IMAGE_NAME}"
else
  echo "S3 storage secrets not provided; skipping remote S3 upload. Image artifact is preserved in workflow run artifacts."
fi
