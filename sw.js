// 설치 시 바로 적용
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// 활성화 시 모든 기존 캐시 삭제 (🔥 중요)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// 요청 시 캐시 확인 후 없으면 네트워크에서 받아오기
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
