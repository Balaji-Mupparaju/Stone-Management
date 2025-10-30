/* Custom service worker placed in public to avoid CRA injection expectations */
/* eslint-disable no-restricted-globals */
const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const APP_SHELL_FILES = [
  '/',
  OFFLINE_URL,
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);
      await cache.addAll(APP_SHELL_FILES);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(n))
             .map((n) => caches.delete(n))
      );
      if (self.clients?.claim) self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (/\/api\//.test(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, networkResp.clone());
          return networkResp;
        } catch (err) {
          const cacheMatch = await caches.match(request);
          if (cacheMatch) return cacheMatch;
          return caches.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const shellCache = await caches.open(APP_SHELL_CACHE);
        const cached = await shellCache.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request);
          const runtimeCache = await caches.open(RUNTIME_CACHE);
          runtimeCache.put(request, resp.clone());
          return resp;
        } catch (err) {
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          throw err;
        }
      })()
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
