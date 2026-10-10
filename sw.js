/* Service worker: appka sa otvorí aj pri slabom internete. Zmeň VER, keď nahráš novú verziu. */
var VER="vyprava-v1",SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png",
 "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(VER).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==VER}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||r.headers.has("range")||u.pathname.indexOf("/media/")>=0||u.hostname.indexOf("tile.openstreetmap")>=0)return;
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(function(x){var y=x.clone();caches.open(VER).then(function(c){c.put(r,y)});return x}).catch(function(){return caches.match(r).then(function(m){return m||caches.match("index.html")})}));
  }else if(u.hostname==="cdnjs.cloudflare.com"){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(x){var y=x.clone();caches.open(VER).then(function(c){c.put(r,y)});return x})}));
  }
});
