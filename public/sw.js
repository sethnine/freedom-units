// cacheURLS = ["_next/static/"];
self.addEventListener("install", (e) => {
  console.log("Service Worker Installed...");
  e.waitUntil(
    (async () => {
      const cache = await caches.open("static");
      //   await cache.addAll(cacheURLS);
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker Activated...");
});

self.addEventListener("message", async (e) => {
  if (e.data !== "reload") {
    console.warn("Message event ignored.", e);
    return;
  }
  console.log("Reload requested");
  // clear the cache
  await caches.delete("static");
  console.log("Cache cleared");
});

self.addEventListener("fetch", (e) => {
  if (e.type !== "fetch") {
    console.warn("Fetch event ignored.", e);
    return;
  }
  e.respondWith(
    (async () => {
      const cache = await caches.open("static");
      const cachedResponse = await cache.match(e.request);
      // If the response is in the cache, return it
      if (cachedResponse !== undefined) {
        if (navigator.onLine) {
          // update the cache only if online
          fetch(e.request)
            .then((response) => {
              cache.put(e.request, response.clone());
            })
            .catch((error) => {
              console.error("Error fetching:", error);
            });
        }

        // return the cached response before fetching a new one
        return cachedResponse;
      }
      // Otherwise, fetch the response
      const response = await fetch(e.request);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
