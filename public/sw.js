/**
 * SERVICE WORKER PARA PWA
 * ====================== 
 * Implementación básica para cacheo y funcionalidad offline
 */

const CACHE_NAME = 'juan-samayoa-portfolio-v1';
const STATIC_CACHE_NAME = 'juan-samayoa-static-v1';

// Archivos críticos para cachear
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/assets/img/profile.webp',
  '/assets/img/profile-fallback.svg',
  '/assets/cv-juan-samayoa-es.pdf',
  '/assets/cv-juan-samayoa-en.pdf'
];

// Archivos dinámicos que se cachean bajo demanda
const DYNAMIC_CACHE_PATTERNS = [
  /^\/assets\/img\//,
  /^\/assets\/certificates\//,
  /^\/assets\/icons\//,
  /\.(?:js|css|webp|jpg|jpeg|png|svg)$/
];

// ================================
// INSTALACIÓN DEL SERVICE WORKER
// ================================
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Archivos estáticos cacheados correctamente');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch(error => {
        console.error('[SW] Error al cachear archivos estáticos:', error);
      })
  );
});

// ================================
// ACTIVACIÓN DEL SERVICE WORKER
// ================================
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Limpiar caches antiguos
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activado');
        return self.clients.claim(); // Tomar control inmediatamente
      })
      .catch(error => {
        console.error('[SW] Error durante la activación:', error);
      })
  );
});

// ================================
// INTERCEPTAR PETICIONES (FETCH)
// ================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo interceptar peticiones del mismo origen
  if (url.origin !== location.origin) {
    return;
  }
  
  // Estrategia: Cache First para assets estáticos
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estrategia: Network First para HTML y APIs
  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estrategia: Stale While Revalidate para otros recursos
  event.respondWith(staleWhileRevalidate(request));
});

// ================================
// ESTRATEGIAS DE CACHE
// ================================

/**
 * Cache First: Busca en cache primero, si no encuentra va a la red
 * Ideal para: CSS, JS, imágenes, fuentes
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error en Cache First:', error);
    return new Response('Recurso no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Network First: Intenta la red primero, si falla usa cache
 * Ideal para: HTML, APIs, contenido dinámico
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Red no disponible, buscando en cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline personalizada
    if (isNavigationRequest(request)) {
      return caches.match('/') || new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sin conexión - Juan Samayoa</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; }
              .offline { color: #666; }
            </style>
          </head>
          <body>
            <div class="offline">
              <h1>Sin conexión a internet</h1>
              <p>Por favor, verifica tu conexión e intenta de nuevo.</p>
              <button onclick="window.location.reload()">Reintentar</button>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('No disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Stale While Revalidate: Devuelve cache rápido y actualiza en background
 * Ideal para: Recursos que cambian ocasionalmente
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  });
  
  return cachedResponse || fetchPromise;
}

// ================================
// FUNCIONES AUXILIARES
// ================================

function isStaticAsset(url) {
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// ================================
// MANEJO DE MENSAJES
// ================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// ================================
// NOTIFICACIONES PUSH (Futuro)
// ================================
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/badge-72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver portafolio',
          icon: '/assets/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/assets/icons/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Juan Samayoa - Portafolio', options)
    );
  }
});

console.log('[SW] Service Worker cargado correctamente');
