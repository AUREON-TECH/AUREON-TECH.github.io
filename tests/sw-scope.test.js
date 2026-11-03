import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/portal/';

function worker({ offline = false } = {}) {
  const handlers = new Map();
  const calls = [];
  const deleted = [];
  const store = new Map([
    ['aureon-diagnostico-v10', new Map()],
    ['board-v11', new Map([['x', 'other app']])],
  ]);
  const cache = new Map([
    [new URL('./index.html', scope).href, 'offline-home'],
    [new URL('./js/app.js?v=20260923-10', scope).href, 'offline-app'],
    [new URL('./privacy.html', scope).href, 'offline-privacy'],
  ]);
  store.set('aureon-diagnostico-v11', cache);
  const caches = {
    keys: async () => [...store.keys()],
    delete: async key => { deleted.push(key); return store.delete(key); },
    open: async key => ({ addAll: async files => { calls.push(['precache', key, files.length]); } }),
    match: async key => cache.get(key),
  };
  const self = {
    registration: { scope }, location: { origin: new URL(scope).origin },
    clients: { claim: () => {} }, skipWaiting: () => {},
    addEventListener: (type, cb) => handlers.set(type, cb),
  };
  const fetch = async (request, options) => {
    calls.push(['fetch', request.url, options?.cache]);
    if (offline) throw Error('network unavailable');
    return 'network-response';
  };
  runInNewContext(source, { self, caches, fetch, URL, Response: { error: () => 'offline-error' } });
  function dispatch(url, mode = 'cors', method = 'GET') {
    const event = { request: { url, mode, method }, response: null,
      respondWith(promise) { this.response = promise; },
      waitUntil(promise) { this.response = promise; } };
    handlers.get('fetch')(event);
    return event.response;
  }
  return { handlers, dispatch, calls, deleted, store };
}

test('unknown GET, API, personal data, and cross-origin requests are not intercepted', () => {
  const w = worker();
  for (const url of [
    'https://example.test/portal/api/private?token=abc',
    'https://example.test/portal/clientes.json',
    'https://example.test/portal/other-app/index.html',
    'https://other.test/portal/index.html',
    'https://example.test/portal/js/app.js?v=unrecognized',
  ]) assert.equal(w.dispatch(url), null, url);
  assert.equal(w.dispatch('https://example.test/portal/index.html', 'navigate', 'POST'), null);
  assert.equal(w.calls.length, 0);
});

test('offline public landing page supports UTM parameters without caching them', async () => {
  const w = worker({ offline: true });
  const response = w.dispatch('https://example.test/portal/?utm_source=campaign&name=private', 'navigate');
  assert.equal(await response, 'offline-home');
  assert.equal(w.calls.length, 1);
  assert.equal(w.calls[0][2], 'no-store');
});

test('offline versioned static assets and privacy page use only the known shell', async () => {
  const w = worker({ offline: true });
  assert.equal(await w.dispatch('https://example.test/portal/js/app.js?v=20260923-10', 'script'), 'offline-app');
  assert.equal(await w.dispatch('https://example.test/portal/privacy.html?utm_source=x', 'navigate'), 'offline-privacy');
  assert.equal(w.dispatch('https://example.test/portal/private?token=x', 'navigate'), null);
});

test('activation removes only this app older cache, preserving other apps', async () => {
  const w = worker();
  const event = { response: null, waitUntil(promise) { this.response = promise; } };
  w.handlers.get('activate')(event);
  await event.response;
  assert.deepEqual(w.deleted, ['aureon-diagnostico-v10']);
  assert.equal(w.store.has('board-v11'), true);
  assert.equal(w.store.has('aureon-diagnostico-v11'), true);
});

test('successful public shell requests use the network without runtime cache writes', async () => {
  const w = worker();
  assert.equal(await w.dispatch('https://example.test/portal/index.html', 'navigate'), 'network-response');
  assert.equal(w.calls[0][2], 'no-store');
});
