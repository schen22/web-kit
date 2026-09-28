# The design system

If a value isn't here, it shouldn't be in your CSS. `src/assets/css/tokens.css` is the
source of truth; keep this page in step with it.

## Palette — verify every pair in light and dark

| Pair | Light | Dark | Needs |
| :--- | ---: | ---: | ---: |
| ink on bg | ? | ? | 4.5 |
| muted on bg | ? | ? | 4.5 |
| accent on bg | ? | ? | 4.5 |
| accent vs ink (links read as links) | ? | ? | 1.5 |
| line on bg | ? | ? | 3.0 |

## Type

Body size set once on `body`; everything else inherits unless listed here.

## Space

Space between groups must exceed space within a group. `--space-s` one thing,
`--space-m` related but separate (default), `--space-l` different sections.

## Files — one job each

`tokens.css` values · `base.css` elements · `components/wk-*.css` web-kit components.
