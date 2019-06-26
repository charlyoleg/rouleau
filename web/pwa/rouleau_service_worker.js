// rouleau service-worker

//console.log('Hello from rouleau service-worker');

var CACHE = 'rouleau-cache-and-update';

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset:', evt.request.url);
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      './index.html',
      './rouleau_favicon.svg',
      './manifest.json',
      './rouleau_favicon_512x512.png',
      './rouleau_favicon_192x192.png',
      './rouleau_service_worker.js',
      './css/rouleau_style.css',
      './js/rouleau_sub.js',
      './js/rouleau_app.js',
      './img/mouse.svg',
      './img/antenne.svg',
      './img/thunder.svg',
      './img/boat.svg',
      './img/escargot.svg',
      './img/wurm.svg',
      './img/rouleau_header_title.svg',
      './img/man.svg',
      './img/bat.svg',
      './img/pirate.svg'
    ]);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

