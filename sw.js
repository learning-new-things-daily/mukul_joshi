const CACHE_NAME = 'mukul-site-v1';
const ASSETS = [
  './',
  './index.html',
  './projects.html',
  './resume.html',
  './resume-preview.html',
  './styles.css',
  './scripts/app.js',
  './favicon-16.png',
  './favicon-32.png',
  './favicon-48.png',
  './favicon-64.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
  './data/projects.json',
  './data/posts.json'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
