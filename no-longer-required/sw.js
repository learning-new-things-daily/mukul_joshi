const PRECACHE = 'mukul-precache-v3';
const RUNTIME = 'mukul-runtime-v3';
const BASE = new URL('.', self.location).pathname; // e.g., '/devops-hub/' or '/'
const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'offline.html',
  BASE + 'assets/css/styles.css',
  BASE + 'assets/js/app.js',
  BASE + 'assets/icons/icon-192.png',
  BASE + 'assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => ![PRECACHE, RUNTIME].includes(k)).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Strategy helpers
async function staleWhileRevalidate(request){
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((response) => {
    try { cache.put(request, response.clone()); } catch(e){}
    return response;
  }).catch(() => cached);
  return cached || networkPromise;
}

async function networkFirst(request){
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err){
    const cached = await cache.match(request);
    return cached || caches.match(BASE + 'offline.html');
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Handle navigation requests (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // Stale-while-revalidate for static assets
  if (url.pathname.includes('/assets/')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Network-first for frequently updated JSON data
  if (url.pathname.includes('/data/')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
