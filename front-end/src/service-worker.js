/* eslint-disable no-restricted-globals */
// Workbox-compatible service worker for CRA build.
// Precache manifest will be injected into self.__WB_MANIFEST.

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

clientsClaim();

// self.__WB_MANIFEST is injected at build time
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST || []);

const OFFLINE_FALLBACK = '/offline.html';

// Cache page navigations (NetworkFirst) fallback to offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 4,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 })
    ]
  })
);

// API network-first
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 6 })
);

// Images cache-first
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [ new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 7 * 24 * 3600 }) ]
  })
);

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('offline-fallback');
      try { await cache.add(OFFLINE_FALLBACK); } catch (e) { /* ignore */ }
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) return preload;
          return await fetch(event.request);
        } catch (err) {
          const cache = await caches.open('offline-fallback');
          const cached = await cache.match(OFFLINE_FALLBACK);
          return cached || new Response('Offline', { status: 503 });
        }
      })()
    );
  }
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
// Placeholder service worker file kept empty to avoid CRA Workbox injection conflicts.
