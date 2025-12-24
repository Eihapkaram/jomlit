const CACHE_NAME = "vite-vue-cache-v1";

const ASSETS = [
  "/", // important for SPA
  "/index.html",
  "/manifest.webmanifest",
];

// ========== INSTALL ==========
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ========== ACTIVATE ==========
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// ========== FETCH ==========
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Cache First strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).catch(() => {
          // لو الصفحة اتفتحت Offline
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
