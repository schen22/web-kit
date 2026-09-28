#!/bin/sh
# Gate in ~5 lines: scratch build, stray .md check, filtered test summary.
# Exit status is the test run's.
cd "$(dirname "$0")/.." || exit 1
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT

npx @11ty/eleventy --output="$out/site" --quiet 2>&1 | tail -1
echo "md in output: $(find "$out/site" -name '*.md' | wc -l | tr -d ' ')"

SITE_OUT="$out/site" node --test test/*.test.js > "$out/test.log" 2>&1
status=$?
grep -E "^ℹ (tests|pass|fail) |^✖ [a-z]" "$out/test.log" | grep -v "failing tests:" | sort -u
exit $status
