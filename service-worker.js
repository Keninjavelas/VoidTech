self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('voidtech-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/assets/models/product-lowpoly.glb'
    ]))
  );
});