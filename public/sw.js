/**
 * SERVICE WORKER - PWA
 * Cache strategies + offline support + security hardening
 */

const CACHE_NAME = "juan-samayoa-portfolio-v2";
const STATIC_CACHE_NAME = "juan-samayoa-static-v2";

// Critical assets for offline (imágenes principales vía Cloudinary, no locales)
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.svg",
];

// Dynamic cache patterns
const DYNAMIC_CACHE_PATTERNS = [
  /^\/assets\/img\//,
  /^\/assets\/icons\//,
  /\.(?:js|css|webp|jpg|jpeg|png|svg)$/,
];

// Max cache entries for dynamic cache
const MAX_DYNAMIC_ENTRIES = 50;

// ================================
// INSTALL
// ================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => {}),
  );
});

// ================================
// ACTIVATE
// ================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim())
      .catch(() => {}),
  );
});

// ================================
// FETCH
// ================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests
  if (url.origin !== location.origin) return;

  // Never cache sensitive files
  if (isSensitivePath(url.pathname)) return;

  // Cache First for static assets
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network First for HTML navigation
  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stale While Revalidate for everything else
  event.respondWith(staleWhileRevalidate(request));
});

// ================================
// CACHE STRATEGIES
// ================================

async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
      await limitCacheSize(cache, MAX_DYNAMIC_ENTRIES);
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (isNavigationRequest(request)) {
      const offlineHome = await caches.match("/");
      if (offlineHome) return offlineHome;

      return new Response(
        `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexion</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:50px;color:#666}</style></head><body><h1>Sin conexion a internet</h1><p>Verifica tu conexion e intenta de nuevo.</p><button onclick="location.reload()">Reintentar</button></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }

    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
        await limitCacheSize(cache, MAX_DYNAMIC_ENTRIES);
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// ================================
// HELPERS
// ================================

function isStaticAsset(url) {
  return DYNAMIC_CACHE_PATTERNS.some((p) => p.test(url));
}

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  );
}

function isSensitivePath(pathname) {
  const sensitive = ["/sw.js", "/.well-known/", "/_headers"];
  return sensitive.some((s) => pathname.startsWith(s));
}

async function limitCacheSize(cache, maxEntries) {
  const keys = await cache.keys();
  while (keys.length > maxEntries) {
    const oldest = keys.shift();
    await cache.delete(oldest);
  }
}

// ================================
// MESSAGES
// ================================
self.addEventListener("message", (event) => {
  // Only accept messages from same origin
  if (event.origin && event.origin !== self.location.origin) return;

  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "GET_VERSION") {
    event.ports?.[0]?.postMessage({ version: CACHE_NAME });
  }
});

// ================================
// PUSH NOTIFICATIONS
// ================================
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const rawText = event.data.text();
    let bodyText = "";
    let titleText = "Juan Samayoa - Portafolio";

    try {
      const payload = JSON.parse(rawText);
      if (typeof payload === "object" && payload !== null) {
        bodyText = String(payload.body || "");
        if (payload.title) {
          titleText = String(payload.title).replace(/[^a-zA-Z0-9 ._#-]/g, "");
        }
      } else {
        bodyText = String(payload);
      }
    } catch {
      bodyText = rawText;
    }

    const sanitizedBody = bodyText.replace(/[^a-zA-Z0-9 ._#-]/g, "").slice(0, 250);

    event.waitUntil(
      self.registration.showNotification(titleText, {
        body: sanitizedBody,
        icon: "/assets/icons/icon-192.png",
        badge: "/assets/icons/icon-192.png",
        vibrate: [100, 50, 100],
        data: { dateOfArrival: Date.now(), primaryKey: 1 },
      }),
    );
  } catch {
    // Silently fail on push errors
  }
});
