// 앱(홈 화면에 추가)용 서비스 워커: 오프라인에서도 열리게 페이지·스크립트를 저장해 둠
// 페이지·스크립트는 네트워크 먼저(항상 최신), 안 되면 저장본. 지도 타일·아이콘·글꼴·캐릭터 이미지는 저장본 먼저(데이터 절약)
const CACHE = 'gp-20261029b';
const CORE = ['./', 'index.html', 'tier.html', 'combo.html', 'farm.html', 'map.html', 'rate.html', 'guide.html', 'stats.html',
  'common.css', 'chars.js', 'builds.js', 'weapons.js', 'gear.js', 'farm.js', 'rot.js', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gp-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const cacheFirst = /\/map\/(tiles|icons)\/|\/vendor\/|\.png$|\.webp$|fonts\.(googleapis|gstatic)\.com|enka\.network/;
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  if (!same && !cacheFirst.test(req.url)) return; // AI·외부 API는 건드리지 않음
  if (cacheFirst.test(req.url)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    })));
    return;
  }
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
