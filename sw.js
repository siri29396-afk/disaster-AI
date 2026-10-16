const CACHE_NAME = "disasterai-v1";

const OFFLINE_FILES = [
    "/",
    "/static/index.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(OFFLINE_FILES);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;

    // Never cache AI-generated API responses.
    if (
        request.method !== "GET" ||
        new URL(request.url).pathname.startsWith("/api/")
    ) {
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            return cached || fetch(request);
        })
    );
});