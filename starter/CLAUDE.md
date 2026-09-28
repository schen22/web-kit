# SITE_NAME — agent brief

Personal site. 11ty 3 + Liquid, plain CSS, static output in `_site/`. Rules for every
project are in `~/.claude/CLAUDE.md`; this file adds only what's specific here.

## Start here

1. Read `PLAN.md` — what's in progress, what's next, every decision so far.
2. Before any CSS work, read `docs/design-system.md`. Where it disagrees with
   `src/assets/css/tokens.css`, the tokens file wins and the doc gets corrected.

## Constraints

- Priorities, in order: performance & accessibility → maintainability → visual polish.
- Custom JS under 50 lines total (a test enforces it). Prefer CSS.
- `prefers-reduced-motion` respected; visible `:focus-visible`; touch targets ≥ 24px;
  every non-decorative image or SVG has alt text.
- `npm run gate` must pass before committing (known failures listed in `PLAN.md`).

## web-kit

Header and theme toggle come from `~/Documents/projects/web-kit` (files stamped
`web-kit <version>`, prefixed `wk-`). Edit them freely here; to take a newer web-kit,
follow the `web-kit` skill's "Update" steps — never overwrite local edits blindly.
Site-specific pieces: `wk-wordmark.liquid`, `wk-icon-light.liquid`, `wk-icon-dark.liquid`,
and the `--wk-*` mapping at the end of `tokens.css`.

## Docs — one job each (don't add a file without the user's agreement)

| File | Job |
|---|---|
| `CLAUDE.md` | Rules for any agent session (keep under ~80 lines) |
| `PLAN.md` | Now / Next / Later / Done + dated Decisions |
| `docs/design-system.md` | Live CSS rules |
| `.claude/skills/` | This repo's additions to the user-level `commit` / `review-gates` skills |

## End of every session

Update `PLAN.md`, then sort lessons: project-specific → **Lessons** below; applies to
every project → `~/.claude` (see `~/.claude/CLAUDE.md`).

## Lessons
