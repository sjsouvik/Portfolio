const cacheName = "v1";

self.addEventListener("install", (event) => {
  console.log("Service worker is installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker is activated");

  // remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.map((cache) => {
        if (cache !== cacheName) {
          console.log("Clearing old caches");
          caches.delete(cache);
        }
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching via Service worker");
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clonedResponse = res.clone();
        caches
          .open(cacheName)
          .then((cache) => cache.put(event.request, clonedResponse));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
