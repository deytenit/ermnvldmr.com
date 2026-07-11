#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATIC_DIR="$SCRIPT_DIR/../../services/www/public/static"

if [ ! -d "$STATIC_DIR" ]; then
    echo "Directory $STATIC_DIR does not exist. Skipping."
    exit 0
fi

echo "Optimizing images in $STATIC_DIR using cwebp..."

# Find all png, jpg, jpeg files
find "$STATIC_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read -r file; do
    # Determine output path (replace extension with .webp)
    dir=$(dirname "$file")
    base=$(basename "$file")
    ext="${base##*.}"
    name="${base%.*}"
    output="$dir/$name.webp"

    # Check if webp already exists and is newer
    if [ -f "$output" ] && [ "$output" -nt "$file" ]; then
        echo "Skipping $file (already optimized)"
    else
        echo "Optimizing: $file -> $output"
        cwebp -q 80 "$file" -o "$output"
    fi
done

echo "Image optimization complete!"
