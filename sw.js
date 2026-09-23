const CACHE = "aureon-diagnostico-v9";
const SHELL = [
  "./", "./index.html", "./css/diagnostico.css?v=20260923-9", "./icon.svg",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./js/site-config.js", "./js/questions.js", "./js/engine.js", "./js/state.js",
  "./js/whatsapp.js", "./js/app.js?v=20260923-9", "./terms.html", "./privacy.html",
  "./manifest.webmanifest"
];
self.addEventListener("install",(event)=>{event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener("activate",(event)=>{event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((key)=>key!==CACHE).map((key)=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",(event)=>{const request=event.request;if(request.method!=="GET")return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;if(request.mode==="navigate"){event.respondWith(fetch(request,{cache:"no-store"}).then((response)=>{const copy=response.clone();caches.open(CACHE).then((cache)=>cache.put("./index.html",copy));return response;}).catch(()=>caches.match("./index.html")));return;}if(["script","style"].includes(request.destination)){event.respondWith(fetch(request,{cache:"no-store"}).then((response)=>{if(response.ok)caches.open(CACHE).then((cache)=>cache.put(request,response.clone()));return response;}).catch(()=>caches.match(request)));return;}event.respondWith(caches.match(request).then((cached)=>{const network=fetch(request).then((response)=>{if(response.ok)caches.open(CACHE).then((cache)=>cache.put(request,response.clone()));return response;}).catch(()=>cached);return cached||network;}));});
