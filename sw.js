const CACHE_NAME = 'mukul-site-v1';
const ASSETS = [
  './',
  './index.html',
  './projects.html',
  './resume.html',
  './resume-preview.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/icons/favicon-16.png',
  './assets/icons/favicon-32.png',
  './assets/icons/favicon-48.png',
  './assets/icons/favicon-64.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './data/projects.json',
  './data/posts.json',
  './pages/projects.html',
  './pages/resume.html',
  './pages/resume-preview.html',
  './pages/post-terraform-modules.html',
  './pages/post-jenkins-k8s-ci.html'
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
