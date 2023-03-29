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

  // caching all the assets while fetching for the 1st time during user's navigation from one page to the other, not during install event, this is known as runtime caching
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clonedResponse = res.clone();

        /* The open() method of the CacheStorage interface returns a Promise that resolves to the Cache object matching the cacheName. 
        If the specified Cache does not exist, a new cache is created with that cacheName and a Promise that resolves to this new Cache object is returned */
        caches
          .open(cacheName)
          .then((cache) => cache.put(event.request, clonedResponse));

        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

/*

// Different caching strategies

// Cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request))
      .catch(() => fetch(event.request))
  );
});

// Network first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.open(cacheName).then((cache) => cache.match(event.request))
    )
  );
});

// Stale-while-revalidate
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache
            .open(cacheName)
            .then((cache) => cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});

*/
