// rouleau service-worker

//console.log('Hello from rouleau service-worker');

var CACHE = 'rouleau-cache-and-update';

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed! Super!!!');
  evt.waitUntil(precache().then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function(evt) {
  console.log('The service worker is being activated! Super!!!');
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset:', evt.request.url);
  //evt.respondWith(fromCache(evt.request));
  evt.respondWith(cacheOrNetwork(evt.request).catch(function () {
  //evt.respondWith(networkOrCache(evt.request).catch(function () {
  //evt.respondWith(fromNetworkTimeout(evt.request, 400).catch(function () { return fromCache(evt.request); }).catch(function () {
    console.log('Fallback of fallback for: ', evt.request.url);
    return useFallback();
  }));
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

function networkOrCache(request) {
  return fetch(request).then(function (response) {
    if (response.ok) {
      console.log('File from network: ', request.url);
      return response;
    } else {
      console.log('File from cache because network.nok: ', request.url);
      return fromCache(request);
    }
  })
  .catch(function () {
    console.log('File from cache because network error: ', request.url);
    return fromCache(request);
  });
}

//function cacheOrNetwork(request) {
//  return fromCache(request).catch(function (request) {
//    console.log('File not in cache, fallback to network: ', evt.request.url);
//    return fetch(request);
//  });
//}

function cacheOrNetwork(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (matching === null) {
        console.log('File not in cache, fallback to network: ', request.url);
        return fetch(request);
      } else {
        console.log('File in cache: ', request.url);
        return matching;
      }
    });
  });
}


function fromNetworkTimeout(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      console.log('From networkTimeout: ', request.url);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      console.log('From cache: ', request.url);
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('Update cache: ', request.url);
      return cache.put(request, response);
    });
  });
}

var FALLBACK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" stroke-linejoin="round">' +
    '  <path stroke="#DDD" stroke-width="25" d="M99,18 15,162H183z"/>' +
    '  <path stroke-width="17" fill="#FFF" d="M99,18 15,162H183z" stroke="#eee"/>' +
    '  <path d="M91,70a9,9 0 0,1 18,0l-5,50a4,4 0 0,1-8,0z" fill="#aaa"/>' +
    '  <circle cy="138" r="9" cx="100" fill="#aaa"/>' +
    '</svg>';

function useFallback() {
  return Promise.resolve(new Response(FALLBACK, { headers: {
    'Content-Type': 'image/svg+xml'
  }}));
}


