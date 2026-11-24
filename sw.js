const CACHE_NAME="john-morales-v2";
const CORE_FILES=[
  "./","./index.html","./styles.css","./script.js","./manifest.webmanifest",
  "./assets/icon-192.png","./assets/icon-512.png","./assets/icon.svg",
  "./assets/john-morales-retrato.jpg","./assets/john-morales-medicion.jpg","./assets/john-morales-cocina.jpg"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_FILES)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{
      if(response&&response.status===200&&new URL(event.request.url).origin===self.location.origin){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(()=>caches.match("./index.html"));
  }));
});