const CACHE_NAME = "vite-cache-v2";

// الملفات الأساسية
const STATIC_ASSETS = ["/", "/index.html"];

// Install — Cache static files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate — Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
      )
  );
});

// ⭐ Helper: Stale-While-Revalidate Strategy
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  const networkFetch = fetch(req)
    .then((res) => {
      // متخزنش response لو حصل خطأ
      if (res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);

  // رجع الكاش لو موجود، ولو مش موجود رجّع نتيجة الشبكة
  return cached || networkFetch;
}

// FETCH EVENT HANDLER
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // تجاهل نتايج Chrome extensions
  if (request.url.startsWith("chrome-extension")) return;

  // -----------------------------------
  // 1️⃣ Cache API JSON requests
  // -----------------------------------
  if (request.headers.get("accept")?.includes("application/json")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // -----------------------------------
  // 2️⃣ Cache images (png/jpg/webp/svg)
  // -----------------------------------
  if (request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // -----------------------------------
  // 3️⃣ Default static fallback
  // -----------------------------------
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
