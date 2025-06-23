#!/bin/bash

# Image optimization script for dndaux.de
# Optimizes PNG, JPG, and WebP files in assets/images directory
# Uses git for version control instead of manual backups

set -e

IMAGES_DIR="assets/images"

echo "🖼️  Starting image optimization..."

# Function to optimize PNG files
optimize_pngs() {
    local count=0
    echo "🔄 Optimizing PNG files..."

    for png_file in "$IMAGES_DIR"/*.png; do
        if [ -f "$png_file" ]; then
            local filename=$(basename "$png_file")

            # Get original size
            local original_size=$(stat --format=%s "$png_file")

            # Optimize with optipng
            echo "⚡ Optimizing: $filename"
            optipng -quiet -o7 "$png_file"

            # Get new size and calculate savings
            local new_size=$(stat --format=%s "$png_file")
            local saved=$((original_size - new_size))
            local percent=$((saved * 100 / original_size))

            if [ $saved -gt 0 ]; then
                echo "✅ $filename: saved ${saved} bytes (${percent}%)"
            else
                echo "ℹ️  $filename: already optimized"
            fi

            count=$((count + 1))
        fi
    done

    echo "📊 Optimized $count PNG files"
}

# Function to optimize JPG files
optimize_jpgs() {
    local count=0
    echo "🔄 Optimizing JPG files..."

    for jpg_file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
        if [ -f "$jpg_file" ]; then
            local filename=$(basename "$jpg_file")

            # Get original size
            local original_size=$(stat --format=%s "$jpg_file")

            # Optimize with jpegoptim (quality 85, strip metadata)
            echo "⚡ Optimizing: $filename"
            jpegoptim --max=85 --strip-all --quiet "$jpg_file"

            # Get new size and calculate savings
            local new_size=$(stat --format=%s "$jpg_file")
            local saved=$((original_size - new_size))
            local percent=$((saved * 100 / original_size))

            if [ $saved -gt 0 ]; then
                echo "✅ $filename: saved ${saved} bytes (${percent}%)"
            else
                echo "ℹ️  $filename: already optimized"
            fi

            count=$((count + 1))
        fi
    done

    echo "📊 Optimized $count JPG files"
}

# Function to optimize WebP files (if cwebp is available)
optimize_webps() {
    local count=0

    # Check if cwebp is available
    if ! command -v cwebp &> /dev/null; then
        echo "ℹ️  WebP optimization skipped (cwebp not installed)"
        return
    fi

    echo "🔄 Optimizing WebP files..."

    for webp_file in "$IMAGES_DIR"/*.webp; do
        if [ -f "$webp_file" ]; then
            local filename=$(basename "$webp_file")

            # Get original size
            local original_size=$(stat --format=%s "$webp_file")

            # Create temporary file for optimization
            local temp_file="${webp_file}.tmp"

            # Optimize with cwebp (quality 85, lossless for graphics)
            echo "⚡ Optimizing: $filename"
            cwebp -q 85 -quiet "$webp_file" -o "$temp_file"

            # Check if optimization was successful and file is smaller
            if [ -f "$temp_file" ]; then
                local new_size=$(stat --format=%s "$temp_file")

                if [ $new_size -lt $original_size ]; then
                    local saved=$((original_size - new_size))
                    local percent=$((saved * 100 / original_size))

                    mv "$temp_file" "$webp_file"
                    echo "✅ $filename: saved ${saved} bytes (${percent}%)"
                else
                    rm "$temp_file"
                    echo "ℹ️  $filename: already optimized"
                fi
            else
                echo "⚠️  $filename: optimization failed"
            fi

            count=$((count + 1))
        fi
    done

    echo "📊 Optimized $count WebP files"
}

# Function to show optimization summary
show_summary() {
    echo ""
    echo "📈 Optimization Summary:"
    echo "================================"
    echo "✨ Image optimization complete!"
}

# Main execution
if [ ! -d "$IMAGES_DIR" ]; then
    echo "❌ Error: $IMAGES_DIR directory not found!"
    exit 1
fi

optimize_pngs
optimize_jpgs
optimize_webps
show_summary
