// ───────── 무기 옵션 점수(사용률·추천 순위가 아니라 무기 스탯 기준) ─────────
// 그 캐릭터의 추천 주옵(시계·성배·왕관)과 추천 부옵 순서로 만든 기준 성유물을 낀 Lv.90 캐릭터에 무기만 바꿔 끼웠을 때의
// '딜 지수'를 계산하고, 그 무기 종류에서 가장 높은 무기 대비 비율을 점수로 씀.
// 무기 효과: 스탯 증가('치명타 피해 +24%' 등)와 스탯 비례('HP의 0.8%만큼 공격력' 등)는 75%, 원소 구슬 생성·스킬 초기화는 원충·스킬 딜로, 파티 버프는 '팀 딜'로 바꿔 넣음
// d = { id, scale: 'atk'|'hp'|'def'|'em', crit: bool, er: 원충 목표(%), roles: [...] }
const WFIT = (() => {
  const K = { '공격력%': 'atkP', 'HP%': 'hpP', '방어력%': 'defP', '원소 마스터리': 'em', '원소 충전 효율': 'er', '치명타 확률': 'cr', '치명타 피해': 'cd', '물리 피해%': 'phys' };
  const MAIN = { atkP: 0.466, hpP: 0.466, defP: 0.583, em: 187, er: 0.518, cr: 0.311, cd: 0.622, dmg: 0.466, phys: 0.583 };
  const ROLL = { atkP: 0.0496, hpP: 0.0496, defP: 0.062, em: 19.8, er: 0.055, cr: 0.033, cd: 0.066 };
  const PHYS = ['eula', 'razor', 'freminet', 'xinyan'];
  const SUPPORT = r => r === 'sup' || r === 'heal' || r === 'shield';
  const keyOf = d => d.scale === 'em' ? 'em' : d.scale + 'P';
  const stat = n => K[n] || (/피해%$/.test(n) ? 'dmg' : null);
  // 기준 성유물(무기 빼고): 부옵 20회(추천 부옵 순서대로 6·5·4·3·2회) + 주옵 후보(추천 시계·성배·왕관 목록).
  // 무기마다 그 무기에 가장 잘 맞는 주옵 조합을 고름(예: 원충 무기를 끼면 원충 시계 대신 HP 시계를 쓸 수 있음)
  const base = {};
  function artOf(d) {
    if (base[d.id]) return base[d.id];
    const B = typeof BUILDS !== 'undefined' && BUILDS[d.id], key = keyOf(d);
    const list = (arr, fb) => { const l = (arr || []).map(stat).filter(Boolean); return l.length ? [...new Set(l)] : fb; };
    const sands = list(B && B.main.sands, [key]);
    const goblet = list(B && B.main.goblet, [PHYS.includes(d.id) ? 'phys' : 'dmg']);
    const circ = list(B && B.main.circlet, d.crit ? ['cr', 'cd'] : [key]);
    const subs = (B ? B.subs.map(stat) : d.crit ? ['cr', 'cd', key, 'er'] : [key, 'er', 'em']).filter(k => k && ROLL[k]).slice(0, 5);
    const s = { atkP: 0, hpP: 0, defP: 0, em: 0, er: 0, cr: 0, cd: 0, dmg: 0, phys: 0 };
    subs.forEach((k, i) => { s[k] += ROLL[k] * [6, 5, 4, 3, 2][i]; });
    const combos = [];
    for (const a of sands) for (const b of goblet) for (const c of circ) combos.push([a, b, c]);
    return (base[d.id] = { s, combos });
  }
  function index(d, wn) {
    const w = WSTAT[wn], cb = CBASE[d.id]; if (!w || !cb) return null;
    const A = artOf(d);
    let best = 0;
    // 주옵 조합(시계 × 성배 × 왕관 후보) 중 가장 높은 쪽
    for (const mains of A.combos) {
      const s = { ...A.s, er: A.s.er + 1, cr: A.s.cr + 0.05, cd: A.s.cd + 0.5 };
      for (const m of mains) s[m] += MAIN[m];
      if (K[cb[3]]) s[K[cb[3]]] += cb[4]; else if (/피해/.test(cb[3])) s.dmg += cb[4];
      if (K[w[2]]) s[K[w[2]]] += w[3];
      const ps = (typeof WPASS !== 'undefined' && WPASS[wn]) || {};
      for (const [pk, pv] of Object.entries(ps)) if (pk in s) s[pk] += pv * (pk === 'dmg' ? 0.4 : 0.75); else if (pk === 'edmg') s.dmg += pv; // 모든 원소 피해 보너스는 그대로
      // 스탯이 아닌 효과: 원소 구슬(페보니우스류) → 본인 원충 약 +20%(치명 없는 캐릭터는 덜 터져 60%),
      // 스킬 재사용 대기시간 초기화(제례류) → 스킬을 한 번 더 써서 원충 +10%, 스킬 딜 +10%
      if (ps.energy) s.er += 0.2 * (d.crit ? 1 : 0.6);
      if (ps.reset) { s.er += 0.1; s.dmg += 0.1; }
      // 예초의 번개: 원충 100% 넘는 부분의 28%만큼 공격력%(최대 80%)
      if (wn === '예초의 번개') s.atkP += Math.min(0.8, 0.28 * Math.max(0, s.er - 1));
      let atk = (cb[1] + w[1]) * (1 + s.atkP) + 311 + 40;
      const hp = cb[0] * (1 + s.hpP) + 4780, def = cb[2] * (1 + s.defP) + 40;
      // 스탯 비례 효과(예: 성현의 열쇠 = HP의 0.36%만큼 마스터리 + 파티에 HP의 0.2%, 호마 = HP의 0.8%만큼 공격력). 본인 몫은 75%
      let teamAdd = 0;
      const srcOf = k => ({ hp, atk, def, em: s.em, er: s.er * 100 })[k] || 0;
      for (const [from, to, r, tm] of ps.conv || []) {
        const v = srcOf(from) * r;
        if (tm) teamAdd += (to === 'em' ? v / 700 : v / 2500) * 0.6; // 파티 마스터리 700pt ≈ 팀 딜 +100%, 파티 공격력 2500 ≈ +100% 기준 환산, 유지율 60%
        else if (to === 'em') s.em += v * 0.75; else atk += v * 0.75;
      }
      // 마스터리 캐릭터: 치명 딜러(나히다·미탸 등)는 (공격력 + 마스터리 × 2) × 촉진·격화류 반응 배율, 치명 없는 반응 캐릭터는 반응 배율만
      const emK = d.crit ? (atk + 2 * s.em) * (1 + 5 * s.em / (s.em + 1200)) : 1 + 16 * s.em / (s.em + 2000);
      let key = { atk, hp, def, em: emK }[d.scale] || atk;
      if (d.id === 'bennett') key = cb[1] + w[1]; // 베넷 버프는 기초 공격력(캐릭터 + 무기)만 따라감
      const crit = d.crit ? 1 + Math.min(1, s.cr) * s.cd : 1;
      // 원충: 목표까지 모자란 만큼은 딜(폭발 횟수)에 크게(폭발이 핵심인 서브 딜러·서포터는 더 크게), 넘치면 조금만
      const need = Math.max(1, (d.er || 100) / 100);
      const erF = Math.min(s.er, need) / need * (SUPPORT(d.roles[0]) || d.roles[0] === 'sub' ? 0.6 : 0.35) + (SUPPORT(d.roles[0]) || d.roles[0] === 'sub' ? 0.4 : 0.65) + Math.max(0, s.er - need) * 0.05;
      // 물리 딜러는 물리 피해%, 라이덴 쇼군은 원충 100% 넘는 1%마다 번개 피해 +0.4%(고유 특성)
      // 스탯 비례 추가 피해(예: 방어력의 40%만큼 스킬 피해 증가): 한 타 피해를 핵심 스탯 × 2 정도로 보고 비율로 환산, 일부 공격에만 붙어 50%
      const keyRaw = { atk, hp, def, em: s.em }[d.scale] || atk;
      const flatF = (ps.flat || []).reduce((a, [from, r]) => a + srcOf(from) * r / (2 * keyRaw) * 0.5, 0);
      const dmg = 1 + s.dmg + flatF + (PHYS.includes(d.id) ? s.phys : 0) + (d.id === 'raiden' ? 0.4 * Math.max(0, s.er - 1) : 0);
      // 파티 버프(교체해 들어온 캐릭터·파티 전체): 서포터는 그대로, 서브 딜러 70%, 메인 딜러 40%만큼 '팀 딜'로 더함
      // 원소 구슬은 다른 파티원 원충도 채워 줘서 팀 딜 +4%
      const teamF = 1 + (Math.min(0.4, (ps.team || 0) + teamAdd) + (ps.energy ? 0.04 : 0)) * (SUPPORT(d.roles[0]) ? 1 : d.roles[0] === 'sub' ? 0.7 : 0.4);
      best = Math.max(best, key * crit * erF * dmg * teamF);
    }
    return best;
  }
  const top = {};
  function bestOf(d, names) {
    if (top[d.id] != null) return top[d.id];
    let m = 0; for (const n of names) { const r = WSTAT[n]; if (r && r[0] >= 4) { const v = index(d, n); if (v > m) m = v; } }
    return (top[d.id] = m || null);
  }
  // 점수 0.1~1: 딜 지수 비율을 1.2배로 벌림(딜 90% → 0.88, 80% → 0.76, 60% → 0.52). 서포터는 무기 영향이 작아 절반만 깎음
  function value(d, wn, names) {
    const v = index(d, wn), b = bestOf(d, names);
    if (v == null || !b) return null;
    const ratio = Math.min(1, v / b), cut = (1 - ratio) * 1.2 * (SUPPORT(d.roles[0]) ? 0.5 : 1);
    return { v: Math.max(0.1, 1 - cut), ratio };
  }
  return { index, value };
})();
