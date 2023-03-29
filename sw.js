const cacheName = "v1";

const cacheAssets = [
  "index.html",
  "projects.html",
  "blogs.html",
  "styles.css",
  "index.js",
  "blogs/things-i-wish-someone-told-me-during-my-college-days.html",
  "images/hero.svg",
  "images/heroProject.svg",
  "images/heroBlog.svg",
  "images/heroBlogCollege.svg",
];

self.addEventListener("install", (event) => {
  console.log("Service worker is installed");

  // caching all the assets during install event, this is also known as precaching
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
