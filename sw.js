// 落實321 — Service Worker
// Versioned cache: bump VERSION whenever app shell or data content changes,
// otherwise already-installed PWA users will keep seeing stale content.
var VERSION = "v1.0.2";
var SHELL_CACHE = "ls321-shell-" + VERSION;
var DATA_CACHE = "ls321-data-" + VERSION;

var SHELL_FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",
  "./icon-72.png",
  "./icon-96.png",
  "./icon-128.png",
  "./icon-144.png",
  "./icon-152.png",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-384.png",
  "./icon-512.png",
  "./icon-1024.png",
  "./data.zh.index.json",
];

// 三語資料改為「索引檔＋十單元分包＋關鍵詞軌跡」：data.<lang>.index.json / data.<lang>.u1..u10.json / data.<lang>.tracks.json
var DATA_RE = /\/data\.[a-z]{2}\.[a-z0-9]+\.json$/;

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== SHELL_CACHE && k !== DATA_CACHE; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  // Never cache the AI companion proxy — always go live.
  if (url.hostname.indexOf("workers.dev") >= 0) return;

  var isData = DATA_RE.test(url.pathname);

  if (isData) {
    // stale-while-revalidate for content data (three-language JSON packs)
    event.respondWith(
      caches.open(DATA_CACHE).then(function (cache) {
        return cache.match(event.request).then(function (cached) {
          var fetchPromise = fetch(event.request).then(function (resp) {
            if (resp && resp.ok) cache.put(event.request, resp.clone());
            return resp;
          }).catch(function () { return cached; });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (resp) {
        if (resp && resp.ok && url.origin === location.origin) {
          var respClone = resp.clone();
          caches.open(SHELL_CACHE).then(function (cache) { cache.put(event.request, respClone); });
        }
        return resp;
      }).catch(function () {
        if (event.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ("focus" in list[i]) return list[i].focus(); }
    if (self.clients.openWindow) return self.clients.openWindow("./index.html#/today");
  }));
});
