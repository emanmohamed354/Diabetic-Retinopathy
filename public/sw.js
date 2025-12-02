// Service Worker for offline support
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `dr-analysis-${CACHE_VERSION}`;

// 🔴 FILES TO CACHE - YOUR EXACT BUILD OUTPUT
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  
  // ✅ YOUR ACTUAL JS BUNDLES
  '/static/js/main.ab873dca.js',
  '/static/js/patientsList.cdbf374c.chunk.js',
  '/static/js/imageUpload.d3f4d801.chunk.js',
  '/static/js/diabeticInfo.b2bd0b34.chunk.js',
  '/static/js/settings.5534ce6f.chunk.js',
  '/static/js/714.dd6bc560.chunk.js',
  '/static/js/453.883c81e3.chunk.js',
  
  // ✅ YOUR ACTUAL CSS BUNDLES
  '/static/css/main.24a426a4.css',
  '/static/css/patientsList.28165dc8.chunk.css',
  '/static/css/imageUpload.b3cc5e6e.chunk.css',
  '/static/css/diabeticInfo.e381c156.chunk.css',
  '/static/css/settings.620f855d.chunk.css',
  '/static/css/714.20953556.chunk.css',
  
  // External CDN resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
];

function isCacheableUrl(url) {
  try {
    // Convert relative → absolute
    const urlObj = new URL(url, self.location.origin);

    const validSchemes = ['http:', 'https:'];
    if (!validSchemes.includes(urlObj.protocol)) {
      console.warn(`⚠️ Skipping uncacheable URL scheme: ${urlObj.protocol} - ${url}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn(`⚠️ Invalid URL: ${url}`, error);
    return false;
  }
}


// Install Event - Cache assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache opened:', CACHE_NAME);
        
        // Filter and cache only valid URLs
        const validUrls = urlsToCache.filter(isCacheableUrl);
        console.log(`📦 Caching ${validUrls.length} files...`);
        
        return Promise.allSettled(
          validUrls.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`⚠️ Could not cache ${url}:`, err.message);
            });
          })
        );
      })
      .catch((error) => {
        console.error('❌ Cache initialization failed:', error);
      })
  );
  
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch Event - Intelligent caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // 🔴 FILTER OUT INVALID SCHEMES
  if (!isCacheableUrl(event.request.url)) {
    console.warn(`⚠️ Skipping uncacheable request: ${event.request.url}`);
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // 🔴 STRATEGY 1: Network-first for API calls
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => {
              // 🔴 Only cache if valid URL
              if (isCacheableUrl(request.url)) {
                c.put(request, response.clone()).catch(err => {
                  console.warn(`⚠️ Failed to cache API response:`, err.message);
                });
              }
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cached => {
            return cached || new Response(
              JSON.stringify({ error: 'Offline - cached data not available' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // 🔴 STRATEGY 2: Cache-first for static assets
  if (
    url.pathname.includes('/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // 🔴 Only cache if valid URL
              if (isCacheableUrl(request.url)) {
                cache.put(request, responseToCache).catch(err => {
                  console.warn(`⚠️ Failed to cache static asset:`, err.message);
                });
              }
            });

            return response;
          })
          .catch(() => {
            console.warn('❌ Failed to fetch:', url.pathname);
            return null;
          });
      })
    );
    return;
  }

  // 🔴 STRATEGY 3: Network-first for HTML (SPA fallback)
  if (
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    !url.pathname.includes('.')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // 🔴 Only cache if valid URL
            if (isCacheableUrl(request.url)) {
              cache.put(request, responseToCache).catch(err => {
                console.warn(`⚠️ Failed to cache HTML:`, err.message);
              });
            }
          });

          return response;
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});