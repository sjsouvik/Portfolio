if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    initServiceWorker();
    showConnectivityStatus();
  });
}

function initServiceWorker() {
  navigator.serviceWorker
    .register("sw_cache_site.js")
    .then(() => console.log("Service worker is registered successfully"))
    .catch((error) =>
      console.error(`failed to register service worker, error: ${error}`)
    );

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log(
      "Service worker is changed, currently controlled by",
      navigator.serviceWorker.controller
    );
  });
}

function showConnectivityStatus() {
  let isOnline = navigator.onLine;
  const statusSec = document.getElementById("onlineStatus");

  if (!isOnline) {
    statusSec.textContent = "You're currently offline.";
  }

  window.addEventListener("online", () => {
    statusSec.textContent = "Your internet conection was restored.";
    isOnline = true;
  });

  window.addEventListener("offline", () => {
    statusSec.textContent = "You're currently offline.";
    isOnline = false;
  });
}
