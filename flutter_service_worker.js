'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "234fbc2eb8100655e25cd782e35ac581",
"assets/AssetManifest.bin.json": "eaa06e2691b691cb9e6a69ca11ce1b5b",
"assets/AssetManifest.json": "5693b91abed1e087bc01261a69aa5367",
"assets/assets/fonts/iconfont.ttf": "5ee36226024657b16f2f8bb7c159f494",
"assets/assets/icons/icon230621.png": "2a2217eefe7c1e2305dbbdcf85853561",
"assets/assets/icons/icon230622.jpeg": "b6bba1978c4823e4a5a66917b6b3ee12",
"assets/FontManifest.json": "91a8d354b558323850a3048e219b3632",
"assets/fonts/MaterialIcons-Regular.otf": "e72c1e8303fe991c9528b60eccd7647f",
"assets/lib/icons/logo.jpeg": "b6bba1978c4823e4a5a66917b6b3ee12",
"assets/lib/images/ball1.png": "5fc7e0c498f2dde52eefb1b88d982003",
"assets/lib/images/ball10.png": "1f65b3aef0f7b1f08182a257068c789c",
"assets/lib/images/ball11.png": "7a962c80d33c1910a3ea4a147924beb1",
"assets/lib/images/ball12.png": "f6456e2c6344893162fa6e4efdd87352",
"assets/lib/images/ball13.png": "9fde2fa52a032145078b49c9dcc3e71a",
"assets/lib/images/ball14.png": "69e567aab1623a7a78ccfb24cadd1fbd",
"assets/lib/images/ball15.png": "515a2aedb3a97ff50cc9e02c2ab238d9",
"assets/lib/images/ball16.png": "bee537a20fe2996c74b159b77bb2e7d6",
"assets/lib/images/ball17.png": "518277633d6c94558adb40db43fd2db7",
"assets/lib/images/ball2.png": "be5b0b360c486763c214ffef54995325",
"assets/lib/images/ball3.png": "107d344372effda9a15852b88c059ead",
"assets/lib/images/ball4.png": "eafa2bce1b2948481fafb38730b1c909",
"assets/lib/images/ball5.png": "a8e1d149105fd39056be582d2265cacc",
"assets/lib/images/ball6.png": "0c25f3fdd50cf1701faa056ce6624263",
"assets/lib/images/ball7.png": "fd0afcff12cbae774f18477ab90b9dc8",
"assets/lib/images/ball8.png": "c5bdb7cd9a4b535e9c2a4a4d540db813",
"assets/lib/images/ball9.png": "37335c49d556fec017744a7469dbbd8e",
"assets/NOTICES": "a2ab4db837f1404c1db5d63f8bb8653a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.jpeg": "b6bba1978c4823e4a5a66917b6b3ee12",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "cc7ea6f5990a97b13b7a280ca237aaa2",
"icons/Icon-512.png": "f3bc856282f8bbdefdc8f57bde6dafc9",
"icons/Icon-maskable-192.png": "cc7ea6f5990a97b13b7a280ca237aaa2",
"icons/Icon-maskable-512.png": "f3bc856282f8bbdefdc8f57bde6dafc9",
"index.html": "daa4795330433a1f885e093aea2ad749",
"/": "daa4795330433a1f885e093aea2ad749",
"main.dart.js": "ed4251ca682c18af34f1e8f31552b4f5",
"manifest.json": "06454901c64536294375342ac9243f6f",
"version.json": "a071affd2e3b84687a7902f032bd8b58"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
