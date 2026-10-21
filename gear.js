// 성유물 수치 계산 공용 로직 (chars.js, builds.js 다음에 불러옴)

// 5성 성유물 부옵 1회 상승치 최댓값. 실제 상승치는 이 값의 70·80·90·100% 중 하나
const ROLL_MAX = { 'HP': 298.75, '공격력': 19.45, '방어력': 23.15, 'HP%': 5.83, '공격력%': 5.83, '방어력%': 7.29,
  '원소 마스터리': 23.31, '원소 충전 효율': 6.48, '치명타 확률': 3.89, '치명타 피해': 7.77 };
const SUB_STATS = Object.keys(ROLL_MAX);
const ELEM_DMG = ['불 피해%', '물 피해%', '바람 피해%', '번개 피해%', '풀 피해%', '얼음 피해%', '바위 피해%', '물리 피해%'];
const SLOTS = {
  flower: { n: '생명의 꽃', main: ['HP'] },
  plume: { n: '죽음의 깃털', main: ['공격력'] },
  sands: { n: '시간의 모래', main: ['공격력%', 'HP%', '방어력%', '원소 마스터리', '원소 충전 효율'] },
  goblet: { n: '공간의 성배', main: ['공격력%', 'HP%', '방어력%', '원소 마스터리', ...ELEM_DMG] },
  circlet: { n: '이성의 왕관', main: ['치명타 확률', '치명타 피해', '공격력%', 'HP%', '방어력%', '원소 마스터리', '치유 보너스'] },
};
// +20 성유물의 부옵 상승 횟수: 시작 3~4줄 + 4레벨마다 1회(총 5회) → 8~9회, 평균 상승치는 최댓값의 85%
const AVG_ROLL = 0.85;
const FULL_ROLLS = 8.5;
const FLAT = { 'HP': 'HP%', '공격력': '공격력%', '방어력': '방어력%' };

// 캐릭터별 부옵 가중치: 추천 부옵 우선순위 순서대로 1 · 1 · 0.8 · 0.6 · 0.45 · 0.3, 치명 두 옵션은 함께 1,
// 깡옵(HP·공격력·방어력)은 같은 % 옵션 가중치의 40%(목록에 따로 있으면 그 값과 비교해 큰 쪽)
const POS_W = [1, 1, 0.8, 0.6, 0.45, 0.3];
const GENERIC_W = { '치명타 확률': 1, '치명타 피해': 1, '공격력%': 0.6, '원소 충전 효율': 0.4, '원소 마스터리': 0.4, '공격력': 0.24 };
function subWeights(id) {
  const b = id && BUILDS[id];
  if (!b) return { ...GENERIC_W };
  const w = {};
  b.subs.forEach((s, i) => { const name = s === '치명타' ? '치명타 확률' : s; w[name] = Math.max(w[name] || 0, POS_W[i] ?? 0.3); if (s === '치명타') w['치명타 피해'] = w[name]; });
  if (w['치명타 확률'] || w['치명타 피해']) { const c = Math.max(w['치명타 확률'] || 0, w['치명타 피해'] || 0); w['치명타 확률'] = c; w['치명타 피해'] = c; }
  for (const [flat, pct] of Object.entries(FLAT)) if (w[pct]) w[flat] = Math.max(w[flat] || 0, w[pct] * 0.4);
  return w;
}

// 성유물 한 개 평가. art = { slot, main, level, subs: [[stat, value], ...] }
function rateArtifact(art, id) {
  const w = subWeights(id);
  const subs = art.subs.filter(([s, v]) => s && v > 0);
  const rows = subs.map(([s, v]) => {
    const max = ROLL_MAX[s];
    const units = v / max;                                   // 최대 상승치 기준 몇 번 분량인지
    const rolls = clamp(Math.round(v / (max * AVG_ROLL)), 1, 6);  // 실제 상승 횟수 추정(시작값 포함)
    const weight = w[s] || 0;
    return { s, v, units, rolls, weight, eff: units * weight };
  });
  const eff = rows.reduce((a, r) => a + r.eff, 0);
  const cv = 2 * (subs.find(x => x[0] === '치명타 확률')?.[1] || 0) + (subs.find(x => x[0] === '치명타 피해')?.[1] || 0);
  // 남은 강화: 4레벨마다 1회. 기대 증가분 = 남은 횟수 × 평균 상승치 × (현재 부옵 가중치 평균)
  const left = Math.floor((20 - clamp(art.level, 0, 20)) / 4);
  const avgW = rows.length ? rows.reduce((a, r) => a + r.weight, 0) / Math.max(rows.length, 4) : 0;
  const projected = eff + left * AVG_ROLL * avgW;
  const mainOk = mainVerdict(art.slot, art.main, id);
  return { rows, eff, cv, left, projected, mainOk, grade: gradeOf(art.level >= 20 ? eff : projected) };
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
// 유효 옵션 수(최대 상승치 환산) 기준 등급. +20 성유물이 가질 수 있는 유효 옵션은 이론상 9회, 현실적 상한은 7회 안팎
function gradeOf(e) {
  if (e >= 6.5) return { g: 'SS', n: '종결급', c: 'var(--gold)', say: '바꿀 이유가 거의 없는 성유물입니다. 잠금을 걸어 두세요.' };
  if (e >= 5) return { g: 'S', n: '우수', c: 'var(--good)', say: '오래 쓸 수 있는 좋은 성유물입니다.' };
  if (e >= 3.5) return { g: 'A', n: '실전용', c: 'var(--hydro)', say: '당장 쓰기에 충분합니다. 더 좋은 것이 나오면 교체하세요.' };
  if (e >= 2) return { g: 'B', n: '임시', c: 'var(--warn)', say: '임시로만 쓰고, 교체 대상 1순위로 두세요.' };
  return { g: 'C', n: '강화 재료', c: 'var(--bad)', say: '유효 옵션이 거의 없어 강화 재료로 쓰는 편이 낫습니다.' };
}
// 주옵이 추천 목록에 있는지: 'best'(1순위) / 'ok'(대안) / 'bad'(비추천) / 'fixed'(꽃·깃털)
function mainVerdict(slot, main, id) {
  if (slot === 'flower' || slot === 'plume') return 'fixed';
  const b = id && BUILDS[id];
  if (!b) return slot === 'circlet' && (main === '치명타 확률' || main === '치명타 피해') ? 'best' : 'ok';
  const list = b.main[slot] || [];
  // 치명타 확률·피해 왕관은 부옵 비율에 따라 고르는 것이라 둘 다 목록에 있으면 같은 순위로 봄
  const norm = s => s === '치명타' || s === '치명타 피해' ? '치명타 확률' : s;
  main = norm(main);
  const i = [...new Set(list.map(norm))].indexOf(main);
  return i === 0 ? 'best' : i > 0 ? 'ok' : 'bad';
}

// ───────── 종결 스탯 ─────────
// 출처의 추천 주옵·부옵과 앱의 역할 데이터로 계산한 목표치(합격선 / 종결). 커뮤니티에서 흔히 쓰는 기준치를 단순화한 근사값
const KEY_NAME = { atk: '공격력', hp: '최대 HP', def: '방어력', em: '원소 마스터리' };
function endgame(id) {
  const d = GP.DB[id], b = BUILDS[id];
  if (!d) return null;
  const role = d.roles[0];
  const circ = b ? b.main.circlet : [];
  // 서포터·힐러·보호막은 출처가 치명 왕관을 첫째로 적어도(베넷 등) 캐릭터 데이터가 치명 의존일 때만 치명 목표를 둠
  const critCirclet = circ[0] === '치명타 확률' || circ[0] === '치명타 피해';
  const crit = d.crit || (critCirclet && (role === 'main' || role === 'sub'));
  const sands0 = b?.main.sands[0];
  let scale = d.scale;
  if (sands0 === 'HP%') scale = 'hp'; else if (sands0 === '방어력%') scale = 'def'; else if (sands0 === '원소 마스터리' && !crit) scale = 'em';
  const dealer = role === 'main', sub = role === 'sub';
  const t = {};
  if (crit) {
    t.cr = dealer ? [60, 75] : [55, 70];
    t.cd = dealer ? [150, 210] : sub ? [130, 180] : [100, 150];
  }
  const erFirst = b && b.subs[0] === '원소 충전 효율';
  t.er = [Math.max(100, d.er - 10), d.er + (erFirst ? 15 : 0)];
  const K = {
    atk: dealer ? [2000, 2400] : sub ? [1800, 2200] : [1500, 1900],
    hp: dealer ? [33000, 40000] : sub ? [30000, 38000] : [28000, 36000],
    def: dealer ? [2200, 2800] : [2000, 2600],
    em: crit ? [300, 500] : [700, 1000],
  };
  t.key = K[scale];
  t.scale = scale;
  // 반응 딜러: 치명 + 부옵 상위 3개에 마스터리가 있으면 보조 마스터리 목표
  if (crit && scale !== 'em' && b && b.subs.slice(0, 3).includes('원소 마스터리')) t.em2 = [100, 200];
  t.crit = crit;
  return t;
}
// 현재 값이 목표 대비 어디쯤인지: 'end'(종결) / 'pass'(합격) / 'short'(부족)
const stage = (v, [pass, end]) => v >= end ? 'end' : v >= pass ? 'pass' : 'short';
const STAGE_TXT = { end: ['종결', 'ok'], pass: ['합격', 'mid'], short: ['부족', 'low'] };
