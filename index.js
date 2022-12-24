if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw_cache_site.js")
      .then(() => console.log("Service worker is registered successfully"))
      .catch((error) =>
        console.error(`failed to register service worker, error: ${error}`)
      );
  });
}
