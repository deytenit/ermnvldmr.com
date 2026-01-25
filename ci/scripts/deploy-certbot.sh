#!/bin/bash
set -e

# Usage: ./deploy-certbot.sh [domain1] [domain2] ...
EMAIL="personal@ermnvldmr.com"
CLOUDFLARE_INI="/etc/letsencrypt/cloudflare.ini"

# Collect domains from arguments, fallback to default if none provided
if [ $# -eq 0 ]; then
    DOMAINS=("docs.ermnvldmr.com")
else
    DOMAINS=("$@")
fi

# Build domain arguments for certbot
DOMAIN_ARGS=()
for d in "${DOMAINS[@]}"; do
    DOMAIN_ARGS+=("-d" "$d")
done

echo "Installing certbot and Cloudflare DNS plugin..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-cloudflare

if [ ! -f "$CLOUDFLARE_INI" ]; then
    echo "Error: Cloudflare credentials file not found at $CLOUDFLARE_INI"
    echo "Please ensure it exists and has 600 permissions."
    exit 1
fi

echo "Requesting certificate for ${DOMAINS[*]} via Cloudflare DNS challenge..."
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials "$CLOUDFLARE_INI" \
  "${DOMAIN_ARGS[@]}" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

echo "Certificates for ${DOMAINS[*]} have been processed."

