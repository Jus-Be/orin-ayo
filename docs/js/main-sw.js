const staticOrinAyo = "orinayo-v1";
const assets = [
  "/",
  "/index.html",
  "/js/main.js",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticOrinAyo).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
