import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("page contains all diagnostic screens", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const id of ["start-screen","identity-screen","route-screen","question-screen","result-screen"]) {
    assert.ok(html.includes('id="' + id + '"'), `missing ${id}`);
  }
  assert.match(html, /<progress[^>]+id="progress-value"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /type="module"/);
  assert.doesNotMatch(html, /ARKOM|Bilhon/i);
});

test("style includes mobile and accessibility protections", async () => {
  const css = await readFile(new URL("../css/diagnostico.css", import.meta.url), "utf8");
  assert.match(css, /#06142d/i);
  assert.match(css, /min-height:\s*44px/i);
  assert.match(css, /prefers-reduced-motion/i);
  assert.match(css, /:focus-visible/i);
});

test("privacy explains local and voluntary handling", async () => {
  const text = await readFile(new URL("../privacy.html", import.meta.url), "utf8");
  assert.match(text, /dispositivo/i);
  assert.match(text, /WhatsApp/i);
  assert.match(text, /reiniciar.*apagar/i);
  assert.match(text, /24 horas/i);
});

test("diagnostic has no invisible submission", async () => {
  const files = ["../index.html", "../js/app.js", "../js/state.js", "../js/whatsapp.js"];
  const content = (await Promise.all(files.map((path) => readFile(new URL(path, import.meta.url), "utf8")))).join("\n");
  assert.doesNotMatch(content, /fetch\s*\(|XMLHttpRequest|sendBeacon/i);
  assert.doesNotMatch(content, /<form[^>]+action=["']https?:/i);
});

test("PWA shell includes every diagnostic asset", async () => {
  const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  for (const asset of ["./index.html","./css/diagnostico.css","./js/site-config.js","./js/questions.js","./js/engine.js","./js/state.js","./js/whatsapp.js","./js/app.js","./terms.html","./privacy.html"]) {
    assert.ok(sw.includes(asset), `service worker missing ${asset}`);
  }
  const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
  assert.equal(manifest.name, "Diagnóstico AUREON");
  assert.equal(manifest.start_url, "./");
});

test("saved result is rendered again when a session resumes", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /session\.step === "result-screen"[\s\S]*renderResult/);
});

test("opening the site always stays on the landing screen", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(app, /clearSession\(localStorage\);[\s\S]*session = createSession\([\s\S]*show\("start-screen", \{ historyMode: "replace" \}\);/);
  assert.doesNotMatch(app, /if \(stored\?\.step && stored\.step !== "start-screen"\)/);
  assert.doesNotMatch(html, /Continuar diagnóstico\?/i);
});

test("browser and mobile back navigation stays inside the diagnostic flow", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /history\.pushState/);
  assert.match(app, /history\.replaceState/);
  assert.match(app, /addEventListener\("popstate"/);
  assert.match(app, /history\.back\(\)/);
  assert.match(app, /aureonDiagnostic:\s*true/);
});

test("service worker update bypasses browser cache", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(app, /updateViaCache:\s*"none"/);
  assert.match(html, /js\/app\.js\?v=20260923-10/);
});


test("service worker updates never reload or redirect the page automatically", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /controllerchange/);
  assert.doesNotMatch(app, /location\.reload\(/);
  assert.doesNotMatch(app, /location\.replace\(/);
});
