#!/bin/sh
# Copy web-kit components into a site. Never overwrites an existing file, so a
# site's own icons and wordmark survive; to update, diff instead (see README).
#
# Usage: scripts/copy-into.sh <includes-dir> <css-dir> <js-dir>
#   e.g. scripts/copy-into.sh ../my-site/src/_includes ../my-site/src/assets/css/components ../my-site/src/assets/js
set -eu
[ $# -eq 3 ] || { sed -n 2,7p "$0"; exit 2; }
kit=$(cd "$(dirname "$0")/.." && pwd)
inc=$1 css=$2 js=$3
mkdir -p "$inc" "$css" "$js"

copy() { # src dest
  if [ -e "$2" ]; then echo "kept     $2 (exists)"; else cp "$1" "$2" && echo "copied   $2"; fi
}
for f in "$kit"/components/*/*.liquid; do copy "$f" "$inc/$(basename "$f")"; done
for f in "$kit"/components/*/*.css; do copy "$f" "$css/wk-$(basename "$f")"; done
copy "$kit/components/theme-toggle/theme.js" "$js/wk-theme.js"
echo "web-kit $(cat "$kit/VERSION") ($(git -C "$kit" rev-parse --short HEAD 2>/dev/null || echo uncommitted))"
echo "Next: map tokens (tokens/mapping.example.css), include theme-head.liquid first in <head>, header.liquid in <body>."
