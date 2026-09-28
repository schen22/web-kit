#!/bin/sh
# Contract tests in ~3 lines. Exit status is the test run's.
cd "$(dirname "$0")/.." || exit 1
log=$(mktemp); trap 'rm -f "$log"' EXIT
node --test test/*.test.js > "$log" 2>&1; status=$?
grep -E "^ℹ (tests|pass|fail) |^✖ [a-z]" "$log" | grep -v "failing tests:" | sort -u
exit $status
