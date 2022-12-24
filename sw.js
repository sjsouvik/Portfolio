const cacheName = "v1";

const cacheAssets = [
  "index.html",
  "projects.html",
  "blogs.html",
  "blogs/things-i-wish-someone-told-me-during-my-college-days.html",
];

self.addEventListener("install", (event) => {
  console.log("Service worker is installed");

  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Caching assets");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
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
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
