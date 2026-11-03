// Only public, versioned app-shell files are eligible for offline responses.
const CACHE = "aureon-diagnostico-v11";
const CACHE_PREFIX = "aureon-diagnostico-";
const SHELL = [
  "./", "./index.html", "./css/diagnostico.css?v=20260923-10", "./icon.svg",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./js/site-config.js", "./js/questions.js", "./js/engine.js", "./js/state.js",
  "./js/whatsapp.js", "./js/app.js?v=20260923-10", "./terms.html", "./privacy.html",
  "./manifest.webmanifest"
];
const shellURLs = new Set(SHELL.map(path => new URL(path, self.registration.scope).href));
const homeURL = new URL("./index.html", self.registration.scope).href;
const homePaths = new Set(["./", "./index.html"].map(path => new URL(path, self.registration.scope).pathname));
const legalPaths = new Map(["./terms.html", "./privacy.html"].map(path => {
  const url = new URL(path, self.registration.scope);
  return [url.pathname, url.href];
}));

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation query parameters (e.g. UTM) are never cached. Only known public
  // pages may fall back to the pre-cached shell when the network is unavailable.
  const fallback = request.mode === "navigate"
    ? (homePaths.has(url.pathname) ? homeURL : legalPaths.get(url.pathname))
    : (shellURLs.has(url.href) ? url.href : null);
  if (!fallback) return;

  event.respondWith(
    fetch(request, { cache: "no-store" }).catch(async () =>
      (await caches.match(fallback)) || Response.error()
    )
  );
});
