/* ═══════════════════════════════════════════════════════
   Play For You — Service Worker v2.0
   Enables: PWA install, offline shell, background audio
═══════════════════════════════════════════════════════ */
const CACHE = 'pfy-v2';
const SHELL = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Let media, YouTube, iTunes, APIs pass through — only cache shell
  if (
    url.hostname.includes('youtube') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('itunes') ||
    url.hostname.includes('allorigins') ||
    url.hostname.includes('googlevideo') ||
    e.request.url.includes('/api/')
  ) {
    return; // network only
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── Media Session message relay ──
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
