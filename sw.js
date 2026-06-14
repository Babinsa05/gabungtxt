// Nama cache untuk aplikasi Anda
const CACHE_NAME = 'txt-combiner-v1';

// Daftar file yang ingin di-cache agar bisa offline
const urlsToCache = [
  '/gabungtxt/',
  '/gabungtxt/index.html',
  '/gabungtxt/manifest.json',
  '/gabungtxt/icon-192.png',
  '/gabungtxt/icon-512.png'
];

// Menginstal Service Worker dan menyimpan cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Mengambil file dari cache jika tersedia, jika tidak ambil dari jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Membersihkan cache lama saat aktivasi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
