// web-kit 0.1.0 · scripts/browser-check.mjs
// Behaviour check for the header + theme toggle in a real browser. Copy it INTO a
// site that has puppeteer-core (imports resolve from the script's folder), build, run:
//   cp <web-kit>/scripts/browser-check.mjs scripts/wk-browser-check.mjs
//   node scripts/wk-browser-check.mjs [_site dir] [a page path that shows the header]
// CHROME_PATH overrides the Chrome binary. Exit 1 on any FAIL.
import puppeteer from "puppeteer-core";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
const root = process.argv[2] ?? "_site";
const path = process.argv[3] ?? "/about/";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const server = http.createServer(async (req, res) => {
  let p = join(root, req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  let body;
  try { body = await readFile(p); } catch { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[extname(p)] ?? "text/plain" }); res.end(body);
}).listen(0);
const origin = `http://localhost:${server.address().port}`;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage();
let failures = 0;
const check = (name, ok, detail = "") => (failures += !ok, console.log(`${ok ? "ok  " : "FAIL"} ${name} ${detail}`));
const iconOpacity = () => page.evaluate(() => ["light", "dark"].map((k) =>
  getComputedStyle(document.querySelector(`.wk-theme-toggle__icon--${k}`)).opacity));

await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }, { name: "prefers-reduced-motion", value: "reduce" }]);
await page.setViewport({ width: 1280, height: 800 });
await page.goto(origin + path, { waitUntil: "load" });
check("toggle visible with JS", await page.$eval(".wk-theme-toggle", (b) => getComputedStyle(b).display !== "none"));
check("light OS: pressed=false, light icon", (await page.$eval(".wk-theme-toggle", (b) => b.getAttribute("aria-pressed"))) === "false" && (await iconOpacity())[0] === "1");
await page.click(".wk-theme-toggle");
check("click → data-theme=dark, pressed=true, dark icon", await page.evaluate(() => document.documentElement.dataset.theme === "dark" && document.querySelector(".wk-theme-toggle").getAttribute("aria-pressed") === "true") && (await iconOpacity())[1] === "1");
await page.reload({ waitUntil: "load" });
check("choice persists across reload", await page.evaluate(() => document.documentElement.dataset.theme === "dark"));
await page.evaluate(() => localStorage.removeItem("theme")); await page.reload({ waitUntil: "load" });
await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }, { name: "prefers-reduced-motion", value: "reduce" }]);
await page.waitForFunction(() => document.querySelector(".wk-theme-toggle").getAttribute("aria-pressed") === "true", { timeout: 2000 }).then(() => check("live OS change updates pressed + icon", true), () => check("live OS change updates pressed", false));
check("dark OS, no choice: dark icon", (await iconOpacity())[1] === "1");
const tops = await page.evaluate(() => [".wk-wordmark", ".wk-nav", ".wk-theme-toggle"].map((s) => Math.round(document.querySelector(s).getBoundingClientRect().top)));
check("wide header is one row", Math.max(...tops) - Math.min(...tops) < 8, JSON.stringify(tops));
await page.setViewport({ width: 375, height: 700 });
await new Promise((r) => setTimeout(r, 50)); // let 0.01ms reduced-motion transitions settle
const narrow = await page.evaluate(() => {
  const r = (s) => document.querySelector(s).getBoundingClientRect();
  return { h: r(".wk-header").height, wm: r(".wk-wordmark").top, tg: r(".wk-theme-toggle").top, nav: r(".wk-nav").top, tap: r(".wk-nav__items a").height, over: document.documentElement.scrollWidth > innerWidth };
});
check("375px: toggle on row 1 beside wordmark, nav below", Math.abs(narrow.wm - narrow.tg) < 8 && narrow.nav > narrow.tg, JSON.stringify(narrow));
check("375px: no horizontal overflow; nav targets ≥ 24px", !narrow.over && narrow.tap >= 24);
const noJs = await browser.newPage(); await noJs.setJavaScriptEnabled(false);
await noJs.goto(origin + path); check("no JS → toggle hidden", await noJs.$eval(".wk-theme-toggle", (b) => getComputedStyle(b).display === "none"));
await browser.close(); server.close();
process.exitCode = failures ? 1 : 0;
