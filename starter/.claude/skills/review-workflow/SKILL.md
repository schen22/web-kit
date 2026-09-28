---
name: review-workflow
description: >-
  The review gates for THIS repository: gate commands, constraints, single-test
  command. Use before every commit and when integrating a lane. Extends the
  user-level `review-gates` skill — follow that first; this wins on conflict.
---

# Review workflow

Extends `~/.claude/skills/review-gates`. Only what's specific here.

| When | Command |
|---|---|
| While iterating | `npm run gate:fast` |
| Before each commit | `npm run gate` |
| Prove a new test fails first | `node --test --test-name-pattern "<name>" test/<file>.test.js` |

Constraints: those in `CLAUDE.md`. Visual sign-off is the user's; helpers take no
screenshots.
