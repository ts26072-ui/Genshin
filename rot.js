// 파티 사이클(로테이션) 자료. 2026년 10월 조사: GameWith·Game8·Prydwen·KQM 팀 가이드와 커뮤니티에서 흔히 쓰는 사이클.
// ROT[id] = [단계, '행동', '메모'] — 단계 0: 맨 먼저 깔기(보호막·장판·오래가는 효과), 1: 후방 딜·원소 부착, 2: 딜러 직전 버프·몹몰이, 3: 필드 딜러
// E = 원소전투 스킬, Q = 원소폭발, 평타 = 일반 공격, 강공 = 강공격, 낙공 = 낙하 공격. 표에 없는 캐릭터는 역할로 정한 기본 행동을 씀
const ROT = {
  // 불
  hutao: [3, 'E → 강공 캔슬(평타 1 + 강공) 반복 → 끝나기 전 Q', 'E 지속 약 9초 안에 강공을 몰아 침. HP 50% 이하에서 피해 증가'],
  diluc: [3, 'Q → E 3타 → 평타 사이사이 E', ''],
  yoimiya: [3, 'Q → E → 평타 연타', 'Q는 필드 나가기 전에 써도 후방에서 터짐'],
  lyney: [3, 'Q → 강공(조준) 반복 → E로 마무리', ''],
  arlecchino: [3, 'E → (서포터 사이클) → 강공으로 핏값 회수 → 평타 연타 → Q', 'E 표식은 5초 기다린 뒤 강공으로 회수'],
  mavuika: [3, 'E(오토바이 모드) → Q → 평타·강공', '전투 의지가 차 있으면 Q 먼저도 가능'],
  klee: [3, 'E → 평타 1 + 강공 반복 → Q', ''],
  dehya: [0, 'E 깔기 → Q는 필요할 때', 'E 장판이 피격 경직을 막아 줌'],
  xiangling: [1, 'Q → E(구오바)', '베넷 Q 위에서 쓰면 피해 증가'],
  bennett: [2, 'Q → E', 'Q 장판 안에서 딜러로 교체'],
  thoma: [0, 'Q → E', ''],
  yanfei: [3, '평타 3 + 강공 반복 → E → Q', ''],
  chevreuse: [2, '홀드 E → Q', '과부하 파티 전용 버프'],
  gaming: [3, 'E → 낙공 연타 → Q', ''],
  amber: [1, 'Q → E', ''],
  xinyan: [0, 'E → Q', ''],
  durin: [1, 'E → Q', ''],
  nicole: [0, 'E → Q', ''],
  // 물
  xingqiu: [1, 'Q → E', 'Q 비검은 필드 캐릭터의 평타에 반응'],
  yelan: [1, 'Q → E', ''],
  mona: [2, 'E → Q', 'Q 거품을 딜러 바로 앞에서 터뜨림'],
  kokomi: [1, 'E → (필요하면 Q 후 평타)', ''],
  barbara: [0, 'E', ''],
  neuvillette: [3, 'E → 강공(빔) → Q → 강공', '물방울을 주워 강공 충전을 줄임'],
  furina: [0, 'E → Q', '사이클 맨 처음에. 파티 HP 변동으로 Q 스택이 쌓임'],
  ayato: [3, 'E → 평타 연타(약 6초) → Q', ''],
  tartaglia: [3, 'E(근접) → 평타 연타 → E 해제 → Q', ''],
  nilou: [1, 'E → 평타 3(검무) → Q', '풀·물 파티 전용'],
  candace: [2, 'Q → 홀드 E', ''],
  sigewinne: [1, 'E → Q', ''],
  mualani: [3, 'E(서핑) → 평타 3번(상어 미사일) → Q', ''],
  dahlia: [0, 'E → Q', ''],
  aino: [1, 'E → Q', ''],
  columbina: [0, 'E → Q', '월반응 파티에서 사이클 맨 처음'],
  vodyanitsa: [1, 'E → Q', ''],
  // 바람
  kazuha: [2, '홀드 E → 낙공 → Q → (탭 E → 낙공)', '원소 부착이 끝난 뒤에 써야 원소 피해 버프가 붙음'],
  sucrose: [2, 'E → Q → E', '마스터리 공유를 위해 딜러 바로 앞에'],
  venti: [2, 'Q → E', ''],
  jean: [2, 'Q → E', ''],
  wanderer: [3, 'E(비행) → 평타·강공 → Q', ''],
  xiao: [3, 'E 2번 → Q → 낙공 연타', ''],
  faruzan: [2, 'E → 조준 강공 → Q', ''],
  xianyun: [2, 'E → Q', '딜러의 낙공 피해 증가'],
  sayu: [1, 'Q → E', ''],
  lynette: [2, 'E → Q', ''],
  chasca: [3, 'E(비행) → 홀드 강공 반복 → Q', ''],
  heizou: [3, '홀드 E → 평타 → Q', ''],
  lanyan: [0, 'E → Q', ''],
  mizuki: [3, 'E(꿈결) → Q', ''],
  ifa: [2, 'E → Q', ''],
  jahoda: [1, 'E → Q', ''],
  barca: [3, 'E → 평타·강공 → Q', ''],
  prune: [2, 'E → Q', ''],
  vesna: [3, 'E(강화 상태) → 평타·강공으로 특수 스킬 충전 → 특수 E 반복 → Q', '스텔라 확산 파티. 오데트 E 2번 → 보댜니차로 시작하는 구성이 많음'],
  // 번개
  raiden: [3, 'E → (다른 멤버 사이클) → Q → 평타·강공', 'E로 켜 둔 뇌벌의 눈이 후방에서 계속 협동 공격'],
  fischl: [1, 'E 또는 Q(오즈)', 'E와 Q를 번갈아 써 오즈 유지'],
  beidou: [1, 'Q → E', ''],
  keqing: [3, 'E → E(순간이동) → 평타 2 + 강공 반복 → Q', ''],
  yae: [1, 'E 3번 → Q → E 3번', '살생앵 3개를 유지'],
  shinobu: [1, 'E', ''],
  cyno: [3, 'Q → 평타·E 반복', 'Q 지속 시간 안에 E를 2~3번'],
  clorinde: [3, 'E → 평타(사격) 반복 → Q', ''],
  sethos: [3, 'E → 홀드 강공(관통) → Q', ''],
  lisa: [1, 'Q → E', ''],
  ororon: [1, 'E → Q', ''],
  varesa: [3, '낙공 → 평타 → E → Q(낙공 상태)', ''],
  iansan: [2, 'Q → E', ''],
  razor: [3, 'E → Q → 평타 연타', ''],
  sara: [2, 'Q → E', '딜러 직전'],
  dori: [1, 'Q → E', ''],
  ineffa: [0, 'E (Q는 선택)', '월전 파티에서 사이클 처음'],
  flins: [3, 'E → 평타 → E → 특수 Q', ''],
  alyosha: [1, 'E → Q', ''],
  valery: [1, 'E → Q', ''],
  mitya: [3, 'E → Q → 평타·강공', '아직 출시 전 — 추정'],
  // 풀
  nahida: [1, 'Q → 홀드 E', 'E 표식은 적이 많을 때 홀드로'],
  alhaitham: [3, 'E → 평타·강공 연타 → Q', ''],
  tighnari: [3, 'E → Q → 강공(조준) 연사', ''],
  baizhu: [0, 'Q → E', ''],
  collei: [1, 'Q → E', ''],
  kirara: [0, 'E(탭) → Q', ''],
  yaoyao: [0, 'Q → E', ''],
  emilie: [1, 'E → Q', ''],
  kinich: [3, 'E(그랩) → 평타 → E → Q', ''],
  kaveh: [3, 'Q → 평타 연타', ''],
  lauma: [0, 'Q → 홀드 E', '월개화 파티에서 사이클 처음. 이슬 3개가 쌓이면 홀드 E 다시'],
  nefer: [3, '강공 콤보 반복 → Q', ''],
  // 얼음
  ganyu: [3, 'E → Q → 강공(조준) 연사', ''],
  ayaka: [3, 'E → Q → 대시 → 평타', '빙결 파티'],
  shenhe: [2, '홀드 E → Q', ''],
  rosaria: [1, 'E → Q', ''],
  eula: [3, 'E 홀드 → Q → 평타 연타 → Q 폭발', ''],
  layla: [0, 'E', ''],
  diona: [0, 'E(탭 또는 홀드) → Q', ''],
  wriothesley: [3, 'E → 평타 연타 → 강공 → Q', ''],
  charlotte: [0, 'E → Q', ''],
  citlali: [2, 'E → Q', '딜러 직전'],
  escoffier: [1, 'E → Q', '오래가는 효과부터 깔고 에스코피에로 마무리하는 경우가 많음'],
  skirk: [3, '평타 몇 번 → E(탭) → Q → 강화 평타', ''],
  mika: [2, 'E → Q', ''],
  kaeya: [1, 'Q → E', ''],
  chongyun: [2, 'E → Q', ''],
  qiqi: [0, 'E → Q', ''],
  aloy: [3, 'E → 평타 연타 → Q', ''],
  freminet: [3, '홀드 E → 평타 → Q', ''],
  roen: [3, 'E → Q → 평타', ''],
  sandrone: [3, '(강공 → E) 3번 → Q', '야에 미코나 오데트로 시작'],
  odette: [0, 'E 2번', '스텔라 파티에서 사이클 처음'],
  // 바위
  zhongli: [0, '홀드 E', '보호막을 맨 먼저'],
  navia: [3, 'E 홀드(파편 모은 뒤) → Q → 평타 → E', ''],
  albedo: [0, 'E', ''],
  itto: [3, 'Q → 평타 연타 → 강공(아라타키 참)', ''],
  gorou: [2, 'Q → E', ''],
  yunjin: [2, 'Q → E', ''],
  noelle: [3, 'E → Q → 평타 연타', ''],
  chiori: [1, 'E → Q', ''],
  xilonen: [2, 'E → 평타 → Q', ''],
  ningguang: [3, 'E → 평타·강공 → Q', ''],
  kachina: [1, 'E → Q', ''],
  illuga: [2, 'Q → E', ''],
  zibai: [3, 'E → 평타 4 → E → 평타 1 → Q → E → 평타 4 → E', ''],
  linnea: [1, 'E (회복이 필요할 때만 Q)', ''],
};
// 연구된 실전 사이클(멤버가 거의 같으면 이걸 우선 보여 줌). [멤버, [[id, 행동], ...], 출처]
const TEAM_ROT = [
  [['columbina', 'linnea', 'illuga', 'zibai'], [['columbina', 'E → Q'], ['linnea', 'E'], ['illuga', 'Q → E'], ['zibai', 'E → 평타 4 → E → 평타 1 → Q → E → 평타 4 → E → 평타 4']], 'Prydwen 자백'],
  [['lauma', 'columbina', 'sucrose', 'nefer'], [['lauma', 'Q → 홀드 E'], ['columbina', 'E → Q'], ['sucrose', 'E(또는 평타) → Q'], ['nefer', '강공 콤보'], ['sucrose', 'E']], 'GameWith 콜롬비나'],
  [['ineffa', 'columbina', 'sucrose', 'flins'], [['ineffa', 'E (Q 선택)'], ['columbina', 'E → Q'], ['sucrose', 'E(또는 평타) → Q'], ['flins', 'E 2번 → 특수 Q'], ['sucrose', 'E']], 'GameWith 콜롬비나'],
  [['lauma', 'aino', 'yelan', 'flins'], [['lauma', 'Q → 홀드 E'], ['aino', 'E → Q'], ['yelan', 'Q → E'], ['flins', 'E → 평타 → E → 특수 Q'], ['lauma', '이슬 3개면 홀드 E']], 'Game8 플린스'],
  [['furina', 'escoffier', 'shenhe', 'skirk'], [['furina', 'E → Q'], ['escoffier', 'E → Q'], ['shenhe', '홀드 E → Q'], ['skirk', '평타 몇 번 → E(탭) → Q → 강화 평타']], 'Game8 스커크'],
  [['furina', 'columbina', 'ineffa', 'neuvillette'], [['furina', 'E → Q'], ['columbina', 'E → Q'], ['ineffa', 'E → Q'], ['neuvillette', 'E → Q → 강공']], 'GameWith 콜롬비나'],
  [['odette', 'yae', 'escoffier', 'sandrone'], [['odette', 'E 2번'], ['yae', 'E 3번'], ['escoffier', 'E'], ['sandrone', '(강공 → E) 3번 → Q']], 'Prydwen 산드로네'],
  [['odette', 'vodyanitsa', 'vesna'], [['odette', 'E 2번'], ['vodyanitsa', 'E → Q'], ['vesna', 'E(강화 상태) → 평타·강공으로 충전 → 특수 E 반복 → Q']], 'GameWith 베스나'],
  [['raiden', 'xiangling', 'xingqiu', 'bennett'], [['raiden', 'E'], ['xingqiu', 'Q → E'], ['bennett', 'Q → E'], ['xiangling', 'Q → E'], ['raiden', 'Q → 평타·강공']], '커뮤니티 국대 파티'],
  [['hutao', 'xingqiu', 'yelan', 'zhongli'], [['zhongli', '홀드 E'], ['xingqiu', 'Q → E'], ['yelan', 'Q → E'], ['hutao', 'E → 강공 캔슬 반복 → Q']], '커뮤니티 호두 이중 물'],
  [['nahida', 'fischl', 'kazuha', 'bennett'], [['nahida', 'Q → 홀드 E'], ['fischl', 'E'], ['bennett', 'Q → E'], ['kazuha', '홀드 E → 낙공 → Q']], '커뮤니티 격화'],
];
const ROT_STAGE = ['먼저 깔기', '후방 딜·부착', '딜러 직전 버프', '필드 딜'];
// 파티 사이클 만들기: 실전 사이클의 멤버가 모두 들어 있으면 그것을(남는 멤버는 맨 앞에), 아니면 단계 순서로 조립
function partyRotation(ids, DBX) {
  ids = ids.filter(Boolean);
  if (!ids.length) return null;
  const roleOf = id => (DBX[id] ? DBX[id].roles : ['sup']);
  const known = TEAM_ROT.filter(([m]) => m.every(x => ids.includes(x))).sort((a, b) => b[0].length - a[0].length)[0];
  if (known) {
    const extra = ids.filter(id => !known[0].includes(id)).map(id => ({ id, act: ROT[id] ? ROT[id][1] : 'E → Q', note: '추가 멤버 — 사이클 처음에 기술만 쓰고 교체' }));
    const seen = new Set();
    return { steps: [...extra, ...known[1].map(([id, act]) => ({ id, act, note: seen.has(id) ? '' : (seen.add(id), (ROT[id] || [])[2] || '') }))], src: known[2], exact: true };
  }
  const stage = id => ROT[id] ? ROT[id][0] : ({ main: 3, sub: 1, sup: 2, heal: 0, shield: 0 })[roleOf(id)[0]] ?? 1;
  // 필드 딜러는 한 명만: 단계 3이 여럿이면 성능 점수가 높은 쪽을 마지막에, 나머지는 후방 딜로
  const mains = ids.filter(id => stage(id) === 3).sort((a, b) => (DBX[b]?.perf || 0) - (DBX[a]?.perf || 0));
  const st = id => (stage(id) === 3 && id !== mains[0]) ? 1 : stage(id);
  const order = ids.slice().sort((a, b) => st(a) - st(b));
  const steps = order.map(id => ({ id, act: ROT[id] ? (st(id) !== stage(id) ? 'E → Q (사이클 중간에 짧게)' : ROT[id][1]) : (st(id) === 3 ? 'E → Q → 평타·강공' : 'E → Q'), note: ROT[id] ? ROT[id][2] : '자료가 없어 역할로 정한 기본 행동', stage: st(id) }));
  return { steps, src: '', exact: false, main: mains[0] || null };
}
