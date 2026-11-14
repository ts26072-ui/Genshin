// 모든 페이지 공용 메뉴. 큰 묶음 5개(홈 · 내 계정 · 캐릭터 · 장비 · 탐험) + 지금 묶음의 작은 탭 줄 + AI 상담 버튼
// 휴대폰(좁은 화면)에서는 큰 묶음이 화면 아래 탭바로 내려감. 각 페이지는 <body> 맨 앞에서 이 파일을 불러옴
// ?embed=… 로 다른 페이지 안(캐릭터 한 화면 등)에 들어가면 메뉴를 그리지 않고, 높이를 바깥에 알려 주고, 다른 페이지 링크는 바깥 창에서 엶
(() => {
  const ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/>',
    acct: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    char: '<path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
    gear: '<path d="M12 3 4.5 6.5v5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5v-5z"/>',
    world: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  };
  const GROUPS = [
    { k: 'home', n: '홈', pages: [['index.html#home', '홈']] },
    { k: 'acct', n: '내 계정', pages: [['index.html#parties', '파티 순위'], ['index.html#roster', '내 캐릭터'], ['index.html#growth', '성장 우선순위'], ['index.html#meta', '메타 · 엔진'], ['index.html#friends', '친구']] },
    { k: 'char', n: '캐릭터', pages: [['tier.html', '티어표'], ['dex.html', '도감 · 비교'], ['stats.html', '종결 스탯'], ['char.html', '캐릭터 정보', true]] },
    { k: 'gear', n: '장비', pages: [['rate.html', '성유물 감정'], ['rate.html#cmp', '성유물 비교'], ['guide.html', '성유물 추천'], ['dex.html#wcmp', '무기 비교']] },
    { k: 'world', n: '탐험', pages: [['map.html', '지도'], ['farm.html', '재료 파밍'], ['combo.html', '캔슬 연습']] },
  ];
  const AI = 'index.html#ai';
  // 옛 코드 호환(PAGES 목록)
  const PAGES = GROUPS.flatMap(g => g.pages.map(([href, n]) => ({ k: href, href, n, g: g.k })));
  const file = () => (location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '') || 'index.html';
  const params = new URLSearchParams(location.search);
  const EMBED = params.has('embed');

  if (EMBED) {
    document.documentElement.classList.add('embed');
    // 안쪽 내용 높이(창 높이에 끌려가지 않게 body 기준)
    const tell = () => { try { const b = document.body; parent.postMessage({ type: 'gp-h', h: Math.ceil(b.getBoundingClientRect().height + parseFloat(getComputedStyle(b).marginTop) + parseFloat(getComputedStyle(b).marginBottom)), src: file() }, '*'); } catch (e) {} };
    const watch = () => { tell(); new ResizeObserver(tell).observe(document.body); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
    addEventListener('load', tell);
    // 다른 페이지로 가는 링크는 바깥 창(캐릭터 한 화면 등)을 바꿈
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      e.preventDefault();
      try { top.location.href = u.pathname.split('/').pop() + u.hash; } catch (er) { location.href = a.href; }
    }, true);
    window.SHELL = { mark() {}, PAGES, GROUPS, EMBED };
    return;
  }

  const css = `
.appbar { margin: 0 calc(-1 * max(16px, env(safe-area-inset-left, 0px))) 0; padding: max(8px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px));
  background: linear-gradient(180deg, rgb(10 14 26 / .92), rgb(18 24 39 / .75)); border-bottom: 1px solid color-mix(in srgb, #D3BC8E 45%, transparent); }
.appbar .in { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 6px 14px; flex-wrap: wrap; }
.appbar .brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #ECE5D8; font-weight: 900; font-size: 15.5px; letter-spacing: -0.01em; padding: 6px 0; white-space: nowrap; }
.appbar .brand i { font-style: normal; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; color: #1b1b1b;
  background: radial-gradient(circle at 35% 30%, #F4E8CC, #D3BC8E 60%, #9A7230); box-shadow: 0 0 0 1px rgb(211 188 142 / .6), 0 0 12px rgb(211 188 142 / .35); }
.appbar .groups { display: flex; gap: 2px; flex: 1 1 auto; }
.appbar .groups a { display: inline-flex; align-items: center; gap: 6px; text-decoration: none; color: #AEB3C2; font-weight: 700; font-size: 14px; padding: 10px 12px 9px; border-bottom: 2px solid transparent; white-space: nowrap; }
.appbar .groups a svg, .gp-bottom a svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; stroke-linecap: round; }
.appbar .groups a:hover { color: #ECE5D8; }
.appbar .groups a[aria-current="true"] { color: #ECE5D8; border-bottom-color: #D3BC8E; }
.appbar .subs { flex-basis: 100%; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 8px 0 10px; margin-top: -2px; }
.appbar .subs:empty { display: none; }
.appbar .subs::-webkit-scrollbar { display: none; }
.appbar .subs a { text-decoration: none; color: #C9CCD6; font-weight: 600; font-size: 13px; padding: 6px 12px; border-radius: 999px; border: 1px solid rgb(211 188 142 / .25); white-space: nowrap; background: rgb(255 255 255 / .03); }
.appbar .subs a:hover { border-color: rgb(211 188 142 / .6); }
.appbar .subs a[aria-current="page"] { background: #D3BC8E; color: #1b1b1b; border-color: #D3BC8E; }
.gp-ai { position: fixed; right: max(16px, env(safe-area-inset-right, 0px)); bottom: max(18px, env(safe-area-inset-bottom, 0px)); z-index: 40; display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none; font-weight: 800; font-size: 14px; color: #1b1b1b; padding: 11px 16px; border-radius: 999px;
  background: radial-gradient(circle at 30% 25%, #F4E8CC, #D3BC8E 60%, #9A7230); box-shadow: 0 6px 18px rgb(0 0 0 / .35), 0 0 0 1px rgb(211 188 142 / .7); }
.gp-ai[hidden] { display: none; }
.gp-bottom { display: none; }
.gp-index .tabs[role="tablist"] { display: none !important; }
.sitenav { display: none !important; }
@media (max-width: 640px) {
  .appbar .in { gap: 0 10px; }
  .appbar .groups { display: none; }
  .appbar .subs { padding-top: 4px; }
  .gp-bottom { display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; left: 0; right: 0; bottom: 0; z-index: 41;
    padding: 4px max(6px, env(safe-area-inset-right, 0px)) max(6px, env(safe-area-inset-bottom, 0px)) max(6px, env(safe-area-inset-left, 0px));
    background: rgb(12 16 28 / .96); border-top: 1px solid rgb(211 188 142 / .35); backdrop-filter: blur(8px); }
  .gp-bottom a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: #8F95A6; font-size: 11px; font-weight: 700; padding: 6px 0 4px; }
  .gp-bottom a svg { width: 22px; height: 22px; }
  .gp-bottom a[aria-current="true"] { color: #D3BC8E; }
  body { padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px)) !important; }
  .gp-ai { bottom: calc(72px + env(safe-area-inset-bottom, 0px)); padding: 10px 14px; font-size: 13px; }
}`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  if (file() === 'index.html') document.documentElement.classList.add('gp-index');

  // 지금 위치: 파일 + (메뉴에 있는 #이면) 해시
  const here = () => {
    const f = file(), h = location.hash.slice(1).split(/[=/&]/)[0];
    const full = f + '#' + h;
    if (PAGES.some(p => p.href === full)) return full;
    if (f === 'index.html') return 'index.html#home';
    return f;
  };
  const groupOf = href => (GROUPS.find(g => g.pages.some(p => p[0] === href)) || GROUPS[0]);
  let LAST = {};
  try { LAST = JSON.parse(localStorage.getItem('gp-nav-last') || '{}') || {}; } catch (e) {}
  const gHref = g => (LAST[g.k] && g.pages.some(p => p[0] === LAST[g.k] && !p[2])) ? LAST[g.k] : g.pages[0][0];
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

  const bar = document.createElement('header');
  bar.className = 'appbar';
  const bottom = document.createElement('nav');
  bottom.className = 'gp-bottom';
  bottom.setAttribute('aria-label', '메뉴');
  const ai = document.createElement('a');
  ai.className = 'gp-ai'; ai.href = AI; ai.innerHTML = '✦ AI 상담'; ai.setAttribute('aria-label', 'AI 상담');

  const draw = () => {
    const cur = here(), g = groupOf(cur);
    LAST[g.k] = cur;
    try { localStorage.setItem('gp-nav-last', JSON.stringify(LAST)); } catch (e) {}
    const groups = GROUPS.map(x => `<a href="${gHref(x)}" data-g="${x.k}"${x.k === g.k ? ' aria-current="true"' : ''}>${svg(x.k)}${x.n}</a>`).join('');
    const subs = g.pages.length > 1 ? g.pages.filter(p => !p[2] || p[0] === cur).map(([href, n]) => `<a href="${href}"${href === cur ? ' aria-current="page"' : ''}>${n}</a>`).join('') : '';
    bar.innerHTML = `<div class="in"><a class="brand" href="index.html#home"><i aria-hidden="true">✦</i>원신 파티 감정소</a>
      <nav class="groups" aria-label="메뉴">${groups}</nav><nav class="subs" aria-label="${g.n} 메뉴">${subs}</nav></div>`;
    bottom.innerHTML = groups;
    ai.hidden = cur === AI || location.hash === '#ai';
    const sn = bar.querySelector('.subs'), on = sn.querySelector('[aria-current]');
    if (on && sn.scrollWidth > sn.clientWidth) sn.scrollLeft = on.offsetLeft - sn.offsetLeft - 24;
  };
  // 메인 앱이 탭을 바꿀 때 알려 줌: SHELL.mark('roster') 또는 'index.html#roster'
  const mark = () => draw();
  addEventListener('hashchange', draw);
  const put = () => { document.body.prepend(bar); document.body.append(bottom, ai); draw(); };
  if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
  window.SHELL = { mark, PAGES, GROUPS, EMBED };
})();
