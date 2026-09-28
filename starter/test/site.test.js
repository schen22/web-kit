// Structure and budget checks on the built site. The gate passes SITE_OUT;
// run alone, this builds to a temp dir first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out =
  process.env.SITE_OUT ??
  (() => {
    const dir = join(mkdtempSync(join(tmpdir(), "site-")), "site");
    execSync(`npx @11ty/eleventy --output=${dir} --quiet`, { stdio: "ignore" });
    return dir;
  })();
const pages = readdirSync(out, { recursive: true })
  .filter((f) => f.endsWith(".html"))
  .map((f) => [f, readFileSync(join(out, f), "utf8")]);

test("site builds pages", () => assert.ok(pages.length > 0));

test("every page: lang, one h1, title, description, skip link to main", () => {
  for (const [f, html] of pages) {
    assert.match(html, /<html lang="[a-z-]+"/, f);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${f}: h1 count`);
    assert.match(html, /<title>[^<]+<\/title>/, f);
    assert.match(html, /<meta name="description" content="[^"]+"/, f);
    assert.match(html, /href="#main"[\s\S]*id="main"/, f);
  }
});

test("theme script runs before any stylesheet", () => {
  for (const [f, html] of pages) {
    assert.ok(html.indexOf('localStorage.getItem("theme")') < html.indexOf('rel="stylesheet"'), f);
  }
});

test("header marks exactly the current page", () => {
  for (const [f, html] of pages) {
    const current = html.match(/aria-current="page"/g) ?? [];
    assert.ok(current.length <= 1, f);
  }
  const about = pages.find(([f]) => f.startsWith("about"));
  assert.match(about[1], /href="\/about\/" aria-current="page"/);
});

test("custom JS stays under 50 lines", () => {
  const dir = new URL("../src/assets/js/", import.meta.url).pathname;
  const lines = readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .flatMap((f) => readFileSync(join(dir, f), "utf8").split("\n"))
    .filter((l) => l.trim() && !l.trim().startsWith("//"));
  assert.ok(lines.length < 50, `${lines.length} lines`);
});
