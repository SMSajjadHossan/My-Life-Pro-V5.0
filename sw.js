const CACHE_NAME = 'mylife-pro-v2-optimized';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Stale-While-Revalidate for CDNs (Fastest UX)
  if (url.hostname.includes('cdn.tailwindcss.com') || 
      url.hostname.includes('fonts.googleapis.com') || 
      url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('aistudiocdn.com') ||
      url.hostname.includes('lucide-react')) {
      
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
            return cachedResponse || fetchPromise;
          });
        })
      );
      return;
  }

  // Network First for API/App Code (Freshness Priority)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});