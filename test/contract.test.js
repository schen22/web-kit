// Static contract checks — no dependencies. Behaviour (clicks, OS changes) is
// tested in each site's browser tests, where the components actually run.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), "utf8");
const version = read("VERSION").trim();
const componentFiles = readdirSync(join(root, "components"), { recursive: true })
  .filter((f) => /\.(liquid|css|js)$/.test(f))
  .map((f) => join("components", f));
const css = componentFiles.filter((f) => f.endsWith(".css")).map((f) => [f, read(f)]);

test("every component file carries the current version stamp", () => {
  for (const f of [...componentFiles, "tokens/contract.css", "tokens/mapping.example.css"]) {
    assert.match(read(f), new RegExp(`web-kit ${version.replace(/\./g, "\\.")} · `), f);
  }
});

test("theme.js stays small (≤ 30 code lines)", () => {
  const code = read("components/theme-toggle/theme.js")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("//"));
  assert.ok(code.length <= 30, `${code.length} lines`);
});

test("component CSS uses no raw colours", () => {
  for (const [f, text] of css) {
    const body = text.replace(/\/\*[\s\S]*?\*\//g, "");
    assert.doesNotMatch(body, /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i, f);
  }
});

test("every --wk-* token used is declared in the contract", () => {
  const declared = new Set(read("tokens/contract.css").match(/--wk-[a-z-]+(?=:)/g));
  for (const [f, text] of css) {
    for (const used of text.match(/--wk-[a-z-]+/g) ?? []) assert.ok(declared.has(used), `${f}: ${used}`);
  }
});

test("head script and toggle agree on the storage key and values", () => {
  const head = read("components/theme-toggle/theme-head.liquid");
  const js = read("components/theme-toggle/theme.js");
  for (const src of [head, js]) assert.match(src, /localStorage\.(get|set)Item\("theme"/);
  assert.match(head, /theme === "light" \|\| theme === "dark"/);
});

test("toggle markup is an accessible two-state button", () => {
  const html = read("components/theme-toggle/theme-toggle.liquid");
  assert.match(html, /<button type="button"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /aria-label="[^"]+"/);
  for (const icon of ["wk-icon-light", "wk-icon-dark"]) {
    assert.match(read(`components/theme-toggle/${icon}.liquid`), /aria-hidden="true"[^>]*focusable="false"/, icon);
  }
});

test("header marks the current page and names its nav", () => {
  const html = read("components/header/header.liquid");
  assert.match(html, /aria-current="page"/);
  assert.match(html, /<nav[^>]*aria-label="Main"/);
});

test("motion respects prefers-reduced-motion; focus is visible", () => {
  const toggle = read("components/theme-toggle/theme-toggle.css");
  assert.match(toggle, /prefers-reduced-motion: reduce/);
  for (const [f, text] of css) assert.match(text, /:focus-visible/, f);
});
