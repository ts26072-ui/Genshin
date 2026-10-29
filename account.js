// 계정 불러오기 공용 로직: HoYoLAB 동기화 파일(account/hoyolab.json)과 GOOD 파일(Genshin Optimizer 형식)을
// 이 사이트의 성유물 표기 { slot, set, level, rarity, main: [스탯, 값], subs: [[스탯, 값], ...] }로 바꿈. names.js 다음에 불러옴
const ACCT = (() => {
  const onSite = /github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
  const HOYO_URL = (onSite ? '' : 'https://ts26072-ui.github.io/Genshin/') + 'account/hoyolab.json';
  const BAG_KEY = 'genshin-party-appraiser-v1:bag';
  // GOOD 스탯 키 → gear.js 표기
  const STAT = { hp: 'HP', hp_: 'HP%', atk: '공격력', atk_: '공격력%', def: '방어력', def_: '방어력%', eleMas: '원소 마스터리',
    enerRech_: '원소 충전 효율', critRate_: '치명타 확률', critDMG_: '치명타 피해', heal_: '치유 보너스', physical_dmg_: '물리 피해%',
    pyro_dmg_: '불 피해%', hydro_dmg_: '물 피해%', anemo_dmg_: '바람 피해%', electro_dmg_: '번개 피해%', dendro_dmg_: '풀 피해%',
    cryo_dmg_: '얼음 피해%', geo_dmg_: '바위 피해%' };
  // 5성 +20 주옵 수치(GOOD 파일에는 주옵 값이 없어 레벨로 계산할 때 씀)
  const MAIN20 = { 'HP': 4780, '공격력': 311, 'HP%': 46.6, '공격력%': 46.6, '방어력%': 58.3, '원소 마스터리': 186.5, '원소 충전 효율': 51.8,
    '치명타 확률': 31.1, '치명타 피해': 62.2, '치유 보너스': 35.9, '물리 피해%': 58.3 };
  const main20 = s => MAIN20[s] ?? (/피해%$/.test(s) ? 46.6 : 0);
  const mainAt = (s, lv, r) => +(main20(s) * (0.155 + 0.845 * lv / 20) * (r >= 5 ? 1 : 0.8)).toFixed(1);
  const EL_GOOD = { Anemo: 'anemo', Geo: 'geo', Electro: 'electro', Dendro: 'dendro', Hydro: 'hydro', Pyro: 'pyro', Cryo: 'cryo' };
  const N = typeof GOOD_NAMES === 'object' ? GOOD_NAMES : { characters: {}, weapons: {}, artifacts: {} };

  function goodArt(a) {
    const main = STAT[a.mainStatKey] || a.mainStatKey;
    return {
      slot: a.slotKey, set: N.artifacts[a.setKey] || a.setKey, level: a.level ?? 0, rarity: a.rarity ?? 5,
      main: [main, mainAt(main, a.level ?? 0, a.rarity ?? 5)],
      subs: (a.substats || []).filter(s => s.key && s.value).map(s => [STAT[s.key] || s.key, +s.value]),
      loc: a.location || '', lock: !!a.lock,
    };
  }
  // GOOD 캐릭터 키 → 한국어 이름(여행자는 'traveler-원소'로 따로)
  function goodChar(key) {
    const m = /^Traveler(\w+)$/.exec(key);
    if (m && EL_GOOD[m[1]]) return { traveler: EL_GOOD[m[1]] };
    return { name: N.characters[key] || '' };
  }
  // GOOD 파일 전체 → { chars: [...], bag: [성유물...] }
  function parseGood(j) {
    if (!j || (j.format !== 'GOOD' && !Array.isArray(j.artifacts))) throw new Error('GOOD 형식이 아닙니다');
    const arts = (j.artifacts || []).map(goodArt);
    const weaponAt = {};
    for (const w of j.weapons || []) if (w.location) weaponAt[w.location] = w;
    const chars = (j.characters || []).map(c => {
      const w = weaponAt[c.key];
      return {
        ...goodChar(c.key), key: c.key, level: c.level || 1, ascension: c.ascension ?? null, cons: c.constellation || 0,
        talents: [c.talent?.auto || 1, c.talent?.skill || 1, c.talent?.burst || 1],
        weapon: w ? { name: N.weapons[w.key] || w.key, level: w.level || 1, ref: w.refinement || 1, asc: w.ascension } : null,
        arts: arts.filter(a => a.loc === c.key),
      };
    });
    return { chars, bag: arts };
  }
  // 장착 성유물만으로 치명·원충을 대략 계산(무기 부옵·돌파 스탯은 빠짐)
  function statsFromArts(arts) {
    const sum = s => arts.reduce((t, a) => t + (a.main[0] === s ? a.main[1] : 0) + a.subs.filter(x => x[0] === s).reduce((u, x) => u + x[1], 0), 0);
    return { '치명타 확률': 5 + sum('치명타 확률'), '치명타 피해': 50 + sum('치명타 피해'), '원소 충전 효율': 100 + sum('원소 충전 효율'), '원소 마스터리': sum('원소 마스터리') };
  }
  const loadBag = () => { try { return JSON.parse(localStorage.getItem(BAG_KEY) || 'null'); } catch (e) { return null; } };
  const saveBag = bag => { try { localStorage.setItem(BAG_KEY, JSON.stringify({ at: new Date().toISOString(), arts: bag })); return true; } catch (e) { return false; } };
  async function fetchHoyo() {
    const r = await fetch(HOYO_URL + '?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw Object.assign(new Error('http ' + r.status), { status: r.status });
    return r.json();
  }
  function readFile(file) {
    return new Promise((ok, bad) => { const fr = new FileReader(); fr.onload = () => { try { ok(JSON.parse(fr.result)); } catch (e) { bad(new Error('JSON 파일이 아닙니다')); } }; fr.onerror = () => bad(fr.error); fr.readAsText(file); });
  }
  return { HOYO_URL, parseGood, goodArt, statsFromArts, loadBag, saveBag, fetchHoyo, readFile, EL_HOYO: { Fire: 'pyro', Water: 'hydro', Wind: 'anemo', Electric: 'electro', Grass: 'dendro', Ice: 'cryo', Rock: 'geo' } };
})();
