// Service Worker for 과외 트래커 PWA
// 오프라인 지원 + 빠른 재방문
const CACHE = 'tutor-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Supabase API와 외부 CDN은 SW 우회 (항상 네트워크)
  if (url.hostname.includes('supabase') || url.hostname.includes('jsdelivr.net')) {
    return;
  }
  // HTML 문서: 네트워크 우선, 실패 시 캐시 (앱 업데이트가 빨리 반영됨)
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // 그 외 정적 파일: 캐시 우선
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
