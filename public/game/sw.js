/* Minimal offline cache for the web build. The Android app bundles all
   assets inside the APK, so this only matters in the browser. */
const CACHE = "astravolt-v2";
const ASSETS = ["./", "./index.html", "./astravolt-3d.js", "./vendor/three.module.min.js", "./vendor/GLTFLoader.js", "./vendor/BufferGeometryUtils.js", "./models/player-ship.glb"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
