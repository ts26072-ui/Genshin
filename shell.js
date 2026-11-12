// 모든 페이지 공용 상단바: 로고(→ 메인 로비) + 기능 메뉴. 각 페이지는 <body> 맨 앞에서 이 파일을 불러옴
// 메인 앱(index.html)은 탭을 바꿀 때 SHELL.mark('home' | 'party')로 현재 메뉴를 알려 줌
(() => {
  const PAGES = [
    { k: 'home', href: 'index.html#home', n: '홈' },
    { k: 'party', href: 'index.html#parties', n: '파티 감정' },
    { k: 'tier', href: 'tier.html', n: '티어표' },
    { k: 'dex', href: 'dex.html', n: '도감 · 비교' },
    { k: 'rate', href: 'rate.html', n: '성유물 감정' },
    { k: 'guide', href: 'guide.html', n: '성유물 추천' },
    { k: 'stats', href: 'stats.html', n: '종결 스탯' },
    { k: 'farm', href: 'farm.html', n: '재료 파밍' },
    { k: 'map', href: 'map.html', n: '지도' },
    { k: 'combo', href: 'combo.html', n: '캔슬 연습' },
  ];
  const css = `
.appbar { margin: 0 calc(-1 * max(16px, env(safe-area-inset-left, 0px))) 0; padding: max(8px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px));
  background: linear-gradient(180deg, rgb(10 14 26 / .92), rgb(18 24 39 / .75)); border-bottom: 1px solid color-mix(in srgb, #D3BC8E 45%, transparent); }
.appbar .in { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 6px 14px; flex-wrap: wrap; }
.appbar .brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #ECE5D8; font-weight: 900; font-size: 15.5px; letter-spacing: -0.01em; padding: 6px 0; white-space: nowrap; }
.appbar .brand i { font-style: normal; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; color: #1b1b1b;
  background: radial-gradient(circle at 35% 30%, #F4E8CC, #D3BC8E 60%, #9A7230); box-shadow: 0 0 0 1px rgb(211 188 142 / .6), 0 0 12px rgb(211 188 142 / .35); }
.appbar nav { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; flex: 1 1 auto; min-width: 0; }
.appbar nav::-webkit-scrollbar { display: none; }
.appbar nav a { text-decoration: none; color: #AEB3C2; font-weight: 600; font-size: 13.5px; padding: 10px 10px 9px; border-bottom: 2px solid transparent; white-space: nowrap; }
.appbar nav a:hover { color: #ECE5D8; }
.appbar nav a[aria-current="page"] { color: #ECE5D8; border-bottom-color: #D3BC8E; }
@media (max-width: 640px) { .appbar .in { gap: 0 10px; } .appbar nav { flex-basis: 100%; margin: 0 -4px; } .appbar nav a { padding: 8px 9px; font-size: 13px; } }
.sitenav { display: none !important; }`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  const file = (location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
  const pageKey = (PAGES.find(p => p.href === file) || {}).k || 'home';
  const bar = document.createElement('header');
  bar.className = 'appbar';
  bar.innerHTML = `<div class="in"><a class="brand" href="index.html#home"><i aria-hidden="true">✦</i>원신 파티 감정소</a>
    <nav aria-label="메뉴">${PAGES.map(p => `<a href="${p.href}" data-k="${p.k}">${p.n}</a>`).join('')}</nav></div>`;
  const mark = k => {
    for (const a of bar.querySelectorAll('nav a')) {
      if (a.dataset.k === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }
    // 좁은 화면에서 현재 메뉴가 가려지지 않게 메뉴 줄만 가로로 스크롤
    const nav = bar.querySelector('nav'), cur = nav.querySelector('[aria-current]');
    if (cur && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - nav.offsetLeft - 24;
  };
  const put = () => { document.body.prepend(bar); mark(pageKey); };
  if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
  window.SHELL = { mark, PAGES };
})();
