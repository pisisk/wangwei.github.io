const CACHE_NAME = 'v1-game-cache';
const assetsToCache = [
  './',
  './index.html',
  './game.js',
  './manifest.json',
  './avatar.jpg',
  'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser-arcade-physics.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});