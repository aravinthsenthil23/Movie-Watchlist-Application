const CACHE_NAME = 'movie-app-v1';
const ASSETS = [
    'index.html',
    'css/index.css',
    'js/index.js',
    'js/watchlist.js',
    'pages/watchList.html',
    'img/home-background.png',
    'img/start-exploring.png',
    'img/unableToFind.png',
    'icon-192.png',
    'icon-512.png'
];

self.addEventListener('install', (e) =>{
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});