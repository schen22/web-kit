---
name: commit-workflow
description: >-
  How Claude commits in THIS repository. Use whenever about to commit, including
  helpers in a worktree lane. Extends the user-level `commit` skill — follow that
  first; this wins on conflict.
---

# Commit workflow

Extends `~/.claude/skills/commit`. Only what's specific here.

- Working branch: local `main`. Helpers: `lane/<name>` in their worktree.
- Verified line: `Verified: npm run gate <pass>/<total>; <pages inspected>.`
