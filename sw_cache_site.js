const version = 3;
const cacheName = `portfolio-v${version}`;

self.addEventListener("install", (event) => {
  console.log("Service worker is installed");

  // to skip waiting phase, so that any new service worker don't wait for the other service worker to get destroyed and moves to the activate phase once installed
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(handleActivation());
});

async function handleActivation() {
  // this would trigger the controllerChange event to set the current active service worker as the controller of the page
  await clients.claim();
  console.log(`Service worker v${version} is activated`);

  clearOldCaches();
}

function clearOldCaches() {
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cache) => {
        if (cache !== cacheName) {
          console.log("Clearing old caches");
          caches.delete(cache);
        }
      })
    );
  });
}

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
