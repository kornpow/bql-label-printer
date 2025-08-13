#!/bin/bash

# Simple Tailwind CSS build script
# Usage: ./build.sh [watch]

if [ "$1" = "watch" ]; then
    echo "Starting Tailwind CSS watch mode..."
    npm run watch-css
else
    echo "Building Tailwind CSS..."
    npm run build-css
    echo "✓ CSS built successfully to static/out.css"
fi
