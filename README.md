# web-kit

Shared pieces for Sarah's 11ty + Liquid sites: a header, a light/dark theme toggle,
the token contract they read, and a starter for new sites. Files are **copied into**
each site (not installed), stamped `web-kit <version>`, and free to edit there.

| Piece | Files | What it guarantees |
|---|---|---|
| Header | `components/header/` | Wordmark → nav → toggle. One row when wide; below 45rem, wordmark + toggle on row 1 and nav wrapping on row 2. `aria-current="page"`, targets ≥ 44px, visible focus |
| Theme toggle | `components/theme-toggle/` | No flash of the wrong theme (`theme-head.liquid`). One button, fixed label, `aria-pressed`. Icon chosen by CSS only. Follows the OS live until you choose. Hidden without JS. Survives blocked storage. Respects reduced motion |
| Token contract | `tokens/contract.css`, `tokens/mapping.example.css` | Components read only `--wk-*`; a site maps its own tokens once |
| Starter | `starter/` | A working site: 11ty 3, gate scripts, tests, `CLAUDE.md` / `PLAN.md` / design-system templates, thin commit/review skills |

## Use it

Ask Claude with the `web-kit` skill ("new site", "add web-kit to this site", "update
web-kit"). By hand:

```sh
scripts/copy-into.sh <site>/src/_includes <site>/src/assets/css/components <site>/src/assets/js
```

Then in the site:
1. Map tokens: paste the matching block from `tokens/mapping.example.css` after the
   site's palette.
2. `{% include "theme-head.liquid" %}` right after the `<meta>` tags, before any stylesheet.
3. `{% include "header.liquid" %}` at the top of `<body>`; link `wk-header.css` and
   `wk-theme-toggle.css`; load `wk-theme.js` with `defer` (or paste it into the site's
   script — it's a self-contained block).
4. Replace `wk-wordmark.liquid` and, if wanted, `wk-icon-light/dark.liquid`.
5. Needs global data `nav: [{ url, label }]`.

`copy-into.sh` never overwrites a file that exists.

## Update a site to a newer web-kit

Diff, don't copy over: for each `wk-*` / web-kit-stamped file in the site,
`diff <site file> <web-kit file>`, keep the site's intentional edits, take the rest, and
bump the stamp. Record the version in the site's `PLAN.md` Decisions.

## Check it

- `npm run gate` — contract tests (no dependencies): version stamps, JS ≤ 30 lines, no
  raw colours, every `--wk-*` declared, storage key agreement, accessible markup.
- `scripts/browser-check.mjs` — 10 behaviour checks in real Chrome (click, persist, live
  OS change, one-row/two-row header, overflow, target size, no-JS). Copy into a site that
  has `puppeteer-core`; see the file's header.

## Changing web-kit

Bump `VERSION` and every stamp together (a test enforces it). Note the change in
`CHANGELOG.md`. Sites pick changes up only when someone updates them — nothing is automatic.

## Built with Claude Code

Written with [Claude Code](https://claude.com/claude-code) and its
[`web-kit` skill](https://github.com/schen22/claude-config/blob/main/skills/web-kit/SKILL.md),
which copies these pieces into my sites. The workflow is in
[claude-config](https://github.com/schen22/claude-config).

## License

[MIT](LICENSE).
