// 원신 파티 감정소 공용 캐릭터 데이터 (genshin-party.html의 RAW·PERF 블록에서 추출)
// id, 이름, 원소, 무기, 성급, 역할(첫째가 주역할), 핵심 스탯, 원충 목표, 치명 의존, 핵심 특성(N/E/Q), 추정 여부
const RAW = [
 ['hutao','호두','pyro','polearm',5,'main','hp',100,1,'NE'],
 ['diluc','다이루크','pyro','claymore',5,'main','atk',120,1,'NEQ'],
 ['yoimiya','요이미야','pyro','bow',5,'main','atk',110,1,'NE'],
 ['lyney','리니','pyro','bow',5,'main','atk',110,1,'NQ'],
 ['arlecchino','아를레키노','pyro','polearm',5,'main','atk',100,1,'NE'],
 ['mavuika','마비카','pyro','claymore',5,'main','atk',100,1,'EQ'],
 ['klee','클레','pyro','catalyst',5,'main','atk',120,1,'NQ'],
 ['dehya','데히야','pyro','claymore',5,'sub/shield','atk',130,1,'EQ'],
 ['xiangling','향릉','pyro','polearm',4,'sub','atk',180,1,'Q'],
 ['bennett','베넷','pyro','sword',4,'sup/heal','hp',200,0,'Q'],
 ['thoma','토마','pyro','polearm',4,'shield','hp',200,0,'Q'],
 ['yanfei','연비','pyro','catalyst',4,'main','atk',110,1,'NQ'],
 ['chevreuse','슈브르즈','pyro','polearm',4,'sup/heal','hp',140,0,'EQ'],
 ['gaming','가명','pyro','claymore',4,'main','atk',110,1,'E'],
 ['xingqiu','행추','hydro','sword',4,'sub','atk',180,1,'Q'],
 ['yelan','야란','hydro','bow',5,'sub','hp',170,1,'Q'],
 ['mona','모나','hydro','catalyst',5,'sup','atk',180,0,'Q'],
 ['kokomi','산고노미야 코코미','hydro','catalyst',5,'heal/sub','hp',140,0,'NEQ'],
 ['barbara','바바라','hydro','catalyst',4,'heal','hp',140,0,'EQ'],
 ['neuvillette','느비예트','hydro','catalyst',5,'main','hp',100,1,'N'],
 ['furina','푸리나','hydro','sword',5,'sub/sup','hp',180,1,'EQ'],
 ['ayato','카미사토 아야토','hydro','sword',5,'main','atk',110,1,'EQ'],
 ['tartaglia','타르탈리아','hydro','bow',5,'main','atk',140,1,'NEQ'],
 ['nilou','닐루','hydro','sword',5,'sup','hp',100,0,'E'],
 ['candace','캔디스','hydro','polearm',4,'sup','hp',160,0,'Q'],
 ['sigewinne','시그윈','hydro','bow',5,'heal/sub','hp',140,1,'E'],
 ['mualani','말라니','hydro','catalyst',5,'main','hp',100,1,'E'],
 ['kazuha','카에데하라 카즈하','anemo','sword',5,'sup','em',160,0,'EQ'],
 ['sucrose','설탕','anemo','catalyst',4,'sup','em',150,0,'Q'],
 ['venti','벤티','anemo','bow',5,'sup','em',160,0,'Q'],
 ['jean','진','anemo','sword',5,'heal/sup','atk',170,0,'EQ'],
 ['wanderer','방랑자','anemo','catalyst',5,'main','atk',100,1,'NE'],
 ['xiao','소','anemo','polearm',5,'main','atk',120,1,'NQ'],
 ['faruzan','파루잔','anemo','bow',4,'sup','atk',250,0,'Q'],
 ['xianyun','한운','anemo','catalyst',5,'heal/sup','atk',160,0,'Q'],
 ['sayu','사유','anemo','claymore',4,'heal/sup','em',150,0,'EQ'],
 ['lynette','리넷','anemo','sword',4,'sup','atk',140,1,'E'],
 ['chasca','차스카','anemo','bow',5,'main','atk',110,1,'E'],
 ['heizou','시카노인 헤이조','anemo','catalyst',4,'main/sub','atk',120,1,'EQ'],
 ['raiden','라이덴 쇼군','electro','polearm',5,'main/sub','atk',250,1,'Q'],
 ['fischl','피슬','electro','bow',4,'sub','atk',120,1,'E'],
 ['beidou','북두','electro','claymore',4,'sub/shield','atk',170,1,'Q'],
 ['keqing','각청','electro','sword',5,'main','atk',110,1,'NEQ'],
 ['yae','야에 미코','electro','catalyst',5,'sub','atk',120,1,'EQ'],
 ['shinobu','쿠키 시노부','electro','sword',4,'heal/sup','em',130,0,'E'],
 ['cyno','사이노','electro','polearm',5,'main','atk',140,1,'EQ'],
 ['clorinde','클로린드','electro','sword',5,'main','atk',100,1,'E'],
 ['sethos','세토스','electro','bow',4,'main','atk',120,1,'N'],
 ['lisa','리사','electro','catalyst',4,'sub','atk',150,1,'Q'],
 ['ororon','올로룬','electro','bow',4,'sub','atk',150,1,'EQ'],
 ['varesa','바레사','electro','catalyst',5,'main','atk',100,1,'NQ'],
 ['iansan','얀사','electro','polearm',4,'sup','atk',160,0,'Q'],
 ['nahida','나히다','dendro','catalyst',5,'sub/sup','em',130,1,'E'],
 ['alhaitham','알하이탐','dendro','sword',5,'main','atk',120,1,'EQ'],
 ['tighnari','타이나리','dendro','bow',5,'main','atk',110,1,'N'],
 ['baizhu','백출','dendro','catalyst',5,'heal/sup','hp',150,0,'Q'],
 ['collei','콜레이','dendro','bow',4,'sub','atk',160,1,'Q'],
 ['kirara','키라라','dendro','sword',4,'shield','hp',150,0,'EQ'],
 ['yaoyao','요요','dendro','polearm',4,'heal','hp',150,0,'Q'],
 ['emilie','에밀리','dendro','polearm',5,'sub','atk',130,1,'EQ'],
 ['kinich','키니치','dendro','claymore',5,'main','atk',110,1,'E'],
 ['ganyu','감우','cryo','bow',5,'main/sub','atk',110,1,'NQ'],
 ['ayaka','카미사토 아야카','cryo','sword',5,'main','atk',130,1,'EQ'],
 ['shenhe','신학','cryo','polearm',5,'sup','atk',160,0,'EQ'],
 ['rosaria','로자리아','cryo','polearm',4,'sub','atk',140,1,'Q'],
 ['eula','유라','cryo','claymore',5,'main','atk',120,1,'NQ'],
 ['layla','레일라','cryo','sword',4,'shield','hp',140,0,'E'],
 ['diona','디오나','cryo','bow',4,'shield/heal','hp',160,0,'EQ'],
 ['wriothesley','라이오슬리','cryo','catalyst',5,'main','atk',110,1,'N'],
 ['charlotte','샤를로트','cryo','catalyst',4,'heal','atk',150,0,'Q'],
 ['citlali','시틀라리','cryo','catalyst',5,'sup/shield','em',160,0,'EQ'],
 ['escoffier','에스코피에','cryo','polearm',5,'sup/heal','atk',150,1,'EQ'],
 ['skirk','스커크','cryo','sword',5,'main','atk',100,1,'NE'],
 ['mika','미카','cryo','polearm',4,'heal/sup','hp',140,0,'E'],
 ['zhongli','종려','geo','polearm',5,'shield/sup','hp',120,0,'E'],
 ['navia','나비아','geo','claymore',5,'main','atk',120,1,'E'],
 ['albedo','알베도','geo','sword',5,'sub','def',120,1,'E'],
 ['itto','아라타키 이토','geo','claymore',5,'main','def',130,1,'NQ'],
 ['gorou','고로','geo','bow',4,'sup','def',160,0,'EQ'],
 ['yunjin','운근','geo','polearm',4,'sup','def',160,0,'Q'],
 ['noelle','노엘','geo','claymore',4,'main/shield','def',120,1,'NQ'],
 ['chiori','치오리','geo','sword',5,'sub','def',120,1,'E'],
 ['xilonen','실로닌','geo','sword',5,'sup/heal','def',160,0,'E'],
 ['ningguang','응광','geo','catalyst',4,'main','atk',120,1,'N'],
 // 여행자
 ['traveler-pyro','불 원소 여행자','pyro','sword',5,'sub','atk',150,1,'EQ'],
 ['traveler-hydro','물 원소 여행자','hydro','sword',5,'sub','hp',150,1,'EQ'],
 ['traveler-anemo','바람 원소 여행자','anemo','sword',5,'sup','em',150,0,'EQ'],
 ['traveler-electro','번개 원소 여행자','electro','sword',5,'sup','atk',200,0,'Q'],
 ['traveler-dendro','풀 원소 여행자','dendro','sword',5,'sub','atk',160,1,'Q'],
 ['traveler-cryo','얼음 원소 여행자','cryo','sword',5,'sub','atk',150,1,'EQ'],
 ['traveler-geo','바위 원소 여행자','geo','sword',5,'sub','atk',160,1,'Q'],
 // 초기 · 기타 캐릭터
 ['amber','엠버','pyro','bow',4,'sub','atk',140,1,'Q'],
 ['xinyan','신염','pyro','claymore',4,'shield/sup','def',140,0,'E'],
 ['razor','레이저','electro','claymore',4,'main','atk',130,1,'NE'],
 ['sara','쿠죠 사라','electro','bow',4,'sup','atk',200,0,'Q'],
 ['dori','도리','electro','claymore',4,'heal/sup','hp',180,0,'Q'],
 ['kaveh','카베','dendro','claymore',4,'sub','em',140,0,'E'],
 ['kaeya','케이아','cryo','sword',4,'sub','atk',140,1,'EQ'],
 ['chongyun','중운','cryo','claymore',4,'sub/sup','atk',140,1,'EQ'],
 ['qiqi','치치','cryo','sword',5,'heal','atk',140,0,'EQ'],
 ['aloy','에일로이','cryo','bow',5,'sub','atk',140,1,'NE'],
 ['freminet','프레미네','cryo','claymore',4,'main','atk',120,1,'E'],
 ['kachina','카치나','geo','polearm',4,'sub','def',140,1,'E'],
 ['lanyan','남연','anemo','catalyst',4,'shield/sup','atk',140,0,'E'],
 ['mizuki','유메미즈키 미즈키','anemo','catalyst',5,'sub/heal','em',140,0,'E'],
 ['ifa','이파','anemo','catalyst',4,'heal/sup','em',140,0,'E'],
 ['dahlia','달리아','hydro','sword',4,'shield/sup','hp',160,0,'EQ'],
 ['aino','아이노','hydro','claymore',4,'sub/sup','atk',160,1,'Q'],
 ['ineffa','이네파','electro','polearm',5,'sub/shield','atk',140,1,'EQ'],
 ['flins','플린스','electro','polearm',5,'main','atk',150,1,'EQ'],
 ['lauma','라우마','dendro','catalyst',5,'sup/heal','em',160,0,'EQ'],
 ['nefer','네페르','dendro','catalyst',5,'main','em',120,1,'NE'],
 // 최신 캐릭터 — 역할은 나무위키 평가 문서 기준, 핵심 스탯·무기는 확인 못 한 값이 섞여 있음
 ['durin','두린','pyro','sword',5,'sub','atk',150,1,'Q'],
 ['nicole','니콜','pyro','catalyst',5,'sup/shield','atk',160,0,'EQ'],
 ['columbina','콜롬비나','hydro','catalyst',5,'sub/sup','hp',160,1,'EQ'],
 ['vodyanitsa','보댜니차','hydro','catalyst',5,'heal/sup','hp',150,0,'E'],
 ['jahoda','야호다','anemo','bow',4,'heal/sup','em',160,0,'EQ'],
 ['barca','바르카','anemo','claymore',5,'main','atk',130,1,'EQ'],
 ['prune','프루네','anemo','catalyst',4,'sup','em',160,0,'EQ'],
 ['vesna','베스나','anemo','sword',5,'main','atk',140,1,'EQ'],
 ['alyosha','알료샤','electro','polearm',4,'sup','atk',160,0,'Q'],
 ['valery','발레리','electro','sword',4,'sup/shield','atk',160,0,'NE'],
 ['mitya','미탸','electro','catalyst',5,'main/sub','em',120,1,'NE'],
 ['roen','로엔','cryo','polearm',5,'main','atk',130,1,'EQ'],
 ['sandrone','산드로네','cryo','claymore',5,'main','atk',130,1,'NE'],
 ['odette','오데트','cryo','sword',5,'sub/sup','atk',150,1,'EQ'],
 ['illuga','일루가','geo','polearm',4,'sup','em',160,0,'EQ'],
 ['zibai','자백','geo','sword',5,'main','def',130,1,'EQ'],
 ['linnea','린네아','geo','bow',5,'sup/heal','def',160,1,'EQ'],
];
const PERF_NAMU = {
  'traveler-pyro':55, 'traveler-hydro':20, 'traveler-anemo':30, 'traveler-electro':30, 'traveler-dendro':52, 'traveler-cryo':70, 'traveler-geo':25,
  amber:20, xiangling:78, bennett:92, diluc:45, klee:45, xinyan:25, hutao:75, yanfei:50, yoimiya:50, thoma:55, dehya:55, lyney:72, chevreuse:72, gaming:62, arlecchino:85, mavuika:92, durin:82, nicole:85,
  barbara:35, xingqiu:85, mona:55, tartaglia:68, kokomi:70, ayato:60, yelan:85, candace:35, nilou:68, neuvillette:88, furina:93, sigewinne:50, mualani:72, dahlia:50, aino:58, columbina:95, vodyanitsa:80,
  sucrose:65, jean:50, venti:62, xiao:50, kazuha:90, sayu:30, heizou:35, faruzan:72, wanderer:62, lynette:30, xianyun:75, chasca:75, lanyan:62, mizuki:70, ifa:45, jahoda:60, barca:70, prune:70, vesna:78,
  lisa:30, razor:35, beidou:60, fischl:72, keqing:55, sara:55, raiden:78, yae:65, shinobu:62, dori:30, cyno:60, sethos:45, clorinde:72, ororon:60, iansan:72, varesa:75, ineffa:85, flins:85, alyosha:50, valery:60, mitya:75,
  collei:35, tighnari:50, nahida:88, yaoyao:45, alhaitham:68, kaveh:35, baizhu:68, kirara:55, emilie:70, kinich:65, lauma:88, nefer:85,
  kaeya:35, chongyun:40, qiqi:50, diona:55, ganyu:62, rosaria:45, eula:35, ayaka:62, aloy:10, shenhe:65, layla:55, mika:40, freminet:40, wriothesley:72, charlotte:45, citlali:85, escoffier:88, skirk:90, roen:80, sandrone:82, odette:85,
  ningguang:40, noelle:40, zhongli:72, albedo:60, gorou:50, itto:55, yunjin:55, navia:68, chiori:45, kachina:30, xilonen:88, illuga:60, zibai:82, linnea:85,
};
const GG = {
  'traveler-pyro':'B', 'traveler-hydro':'D', 'traveler-anemo':'D', 'traveler-electro':'C', 'traveler-dendro':'B', 'traveler-cryo':'SS', 'traveler-geo':'D',
  amber:'D', xiangling:'A+', bennett:'SS', diluc:'C', klee:'A', xinyan:'D', hutao:'B', yanfei:'D', yoimiya:'C', thoma:'B', dehya:'B', lyney:'B', chevreuse:'S', gaming:'B', arlecchino:'A', mavuika:'SS', durin:'S', nicole:'SS',
  barbara:'C', xingqiu:'A+', mona:'A+', tartaglia:'B', kokomi:'A', ayato:'C', yelan:'A+', candace:'C', nilou:'A', neuvillette:'A', furina:'S', sigewinne:'B', mualani:'A+', dahlia:'C', aino:'A', columbina:'SS', vodyanitsa:'S',
  sucrose:'SS', jean:'A', venti:'A+', xiao:'B', kazuha:'A+', sayu:'C', heizou:'D', faruzan:'S', wanderer:'B', lynette:'B', xianyun:'A', chasca:'A+', lanyan:'A', mizuki:'SS', ifa:'C', jahoda:'A', barca:'S', prune:'A+', vesna:'SS',
  lisa:'C', razor:'B', beidou:'B', fischl:'S', keqing:'C', sara:'B', raiden:'A', yae:'SS', shinobu:'A', dori:'C', cyno:'SS', sethos:'C', clorinde:'B', ororon:'A', iansan:'SS', varesa:'A+', ineffa:'SS', flins:'SS', alyosha:'S',
  collei:'B', tighnari:'C', nahida:'A+', yaoyao:'A', alhaitham:'B', kaveh:'D', baizhu:'A', kirara:'A', emilie:'A+', kinich:'A+', lauma:'SS', nefer:'SS',
  kaeya:'B', chongyun:'C', qiqi:'S', diona:'A', ganyu:'B', rosaria:'A', eula:'C', ayaka:'A', aloy:'D', shenhe:'A+', layla:'A', mika:'C', freminet:'D', wriothesley:'SS', charlotte:'A', citlali:'SS', escoffier:'S', skirk:'S', roen:'A+', sandrone:'SS', odette:'SS',
  ningguang:'D', noelle:'C', zhongli:'A', albedo:'A+', gorou:'A', itto:'C', yunjin:'B', navia:'B', chiori:'A', kachina:'C', xilonen:'S', illuga:'A+', zibai:'SS', linnea:'SS',
  mitya:'SS', valery:'S',
};
const GG_SCORE = { SS: 92, S: 84, 'A+': 76, A: 68, B: 56, C: 44, D: 30 };
// GamsGo 7.2 종합 티어표의 역할별 등급 '메인/서브/서포터'(- = 그 칸에 없음). 티어표 페이지가 한 캐릭터를 여러 칸에 나눠 보여 줄 때 씀
const GG_ROLE = {
  sandrone:'SS/-/-', odette:'-/SS/SS', mitya:'SS/-/SS', yae:'-/SS/-', columbina:'-/SS/SS', vesna:'SS/-/-', 'traveler-cryo':'SS/-/-', ineffa:'-/SS/SS',
  linnea:'-/SS/SS', wriothesley:'SS/-/-', lauma:'-/SS/SS', cyno:'SS/-/-', nicole:'-/-/SS', mizuki:'SS/-/B', bennett:'-/-/SS', zibai:'SS/-/-',
  iansan:'-/-/SS', mavuika:'SS/S/-', citlali:'-/-/SS', nefer:'SS/-/-', flins:'SS/-/-', sucrose:'-/A/SS', skirk:'S/-/-', durin:'-/S/-',
  vodyanitsa:'-/-/S', barca:'S/-/-', alyosha:'-/-/S', furina:'-/S/S', valery:'-/-/S', escoffier:'-/S/S', qiqi:'-/-/S', fischl:'-/S/-',
  chevreuse:'-/-/S', xilonen:'-/-/S', faruzan:'-/-/S', mualani:'A+/-/-', venti:'A/A+/-', nahida:'-/A+/A+', varesa:'A+/-/-', prune:'-/A/A+',
  chasca:'A+/-/-', emilie:'-/A+/-', mona:'-/A/A+', roen:'A+/-/-', yelan:'-/A+/-', illuga:'-/-/A+', kinich:'A+/-/-', xingqiu:'-/A+/-', kazuha:'-/-/A+',
  xiangling:'-/A+/-', shenhe:'-/-/A+', albedo:'-/A+/-', arlecchino:'A/-/-', raiden:'B/A/-', xianyun:'-/-/A', neuvillette:'A/-/-', nilou:'-/A/-',
  baizhu:'-/-/A', klee:'A/-/-', shinobu:'-/A/A', zhongli:'-/-/A', ayaka:'A/-/-', ororon:'-/A/-', jean:'-/-/A', aino:'-/A/-', lanyan:'-/-/A',
  kokomi:'-/B/A', gorou:'-/-/A', diona:'-/-/A', chiori:'-/A/-', yaoyao:'-/-/A', jahoda:'-/A/B', charlotte:'-/-/A', rosaria:'-/A/C', layla:'-/-/A',
  kirara:'-/-/A', clorinde:'B/-/-', thoma:'-/B/B', gaming:'B/-/-', ganyu:'C/B/-', yunjin:'-/-/B', razor:'B/-/-', collei:'-/B/-', sara:'-/-/B',
  navia:'B/-/-', 'traveler-pyro':'-/B/-', alhaitham:'B/-/-', sigewinne:'-/-/B', lyney:'B/-/-', beidou:'-/B/-', hutao:'B/-/-', kaeya:'-/B/-',
  dehya:'D/C/B', xiao:'B/-/-', 'traveler-dendro':'-/B/-', lynette:'-/B/-', tartaglia:'B/-/-', wanderer:'B/-/-', yoimiya:'C/-/-', kachina:'-/C/-',
  mika:'-/-/C', diluc:'C/-/-', sayu:'-/C/C', itto:'C/-/-', lisa:'-/C/D', dahlia:'-/-/C', ayato:'C/-/-', chongyun:'-/C/D', barbara:'-/-/C',
  'traveler-electro':'-/-/C', tighnari:'C/-/-', sethos:'C/-/-', candace:'-/-/C', ifa:'C/-/-', dori:'-/-/C', keqing:'C/-/-', noelle:'C/-/D',
  eula:'C/-/-', yanfei:'D/-/-', xinyan:'D/D/D', heizou:'D/-/-', 'traveler-geo':'-/D/-', kaveh:'D/-/-', amber:'-/D/-', freminet:'D/-/-',
  'traveler-anemo':'-/D/-', ningguang:'D/-/-', 'traveler-hydro':'-/D/-', aloy:'D/-/-',
};
// GamsGo 7.2 명함(C0) 티어표의 역할별 등급 '메인/서브/서포터'
const GG_ROLE_C0 = {
  sandrone:'SS/-/-', odette:'-/SS/SS', mitya:'SS/-/SS', columbina:'-/SS/SS', vesna:'SS/-/-', ineffa:'-/SS/SS', 'traveler-cryo':'SS/-/-',
  lauma:'-/SS/SS', zibai:'SS/-/-', linnea:'-/SS/SS', nicole:'-/-/SS', mavuika:'SS/S/-', yae:'-/SS/-', nefer:'SS/-/-', bennett:'-/-/SS', flins:'SS/-/-',
  iansan:'-/-/SS', citlali:'-/-/SS', wriothesley:'S/-/-', vodyanitsa:'-/-/S', cyno:'S/-/-', furina:'-/S/S', qiqi:'-/-/S', mizuki:'S/-/C',
  escoffier:'-/S/S', skirk:'S/-/-', durin:'-/S/-', xilonen:'-/-/S', barca:'S/-/-', sucrose:'-/A/S', chevreuse:'-/-/S', mualani:'A+/-/-',
  yelan:'-/A+/-', nahida:'-/A+/A+', varesa:'A+/-/-', fischl:'-/A+/-', mona:'-/A/A+', chasca:'A+/-/-', kazuha:'-/-/A+', roen:'A+/-/-', albedo:'-/A+/-',
  xianyun:'-/-/A+', kinich:'A+/-/-', emilie:'-/A+/-', baizhu:'-/-/A+', xingqiu:'-/A+/-', zhongli:'-/-/A+', xiangling:'-/A+/-', shenhe:'-/-/A+',
  venti:'A/A+/-', arlecchino:'A/-/-', raiden:'B/A/-', prune:'-/A/A', neuvillette:'A/-/-', nilou:'-/A/-', alyosha:'-/-/A', klee:'A/-/-',
  shinobu:'-/A/A', valery:'-/-/A', ayaka:'A/-/-', ororon:'-/A/-', jean:'-/-/A', kokomi:'-/B/A', yaoyao:'-/-/A', lanyan:'-/-/A', aino:'-/A/-',
  layla:'-/-/A', chiori:'-/A/-', illuga:'-/-/A', clorinde:'B/-/-', rosaria:'-/B/C', sigewinne:'-/-/B', gaming:'B/-/-', ganyu:'C/B/-', diona:'-/-/B',
  navia:'B/-/-', faruzan:'-/-/B', alhaitham:'B/-/-', 'traveler-pyro':'-/B/-', yunjin:'-/-/B', lyney:'B/-/-', thoma:'-/B/C', gorou:'-/-/B',
  hutao:'B/-/-', beidou:'-/B/-', charlotte:'-/-/B', xiao:'B/-/-', collei:'-/B/-', kirara:'-/-/B', razor:'B/-/-', jahoda:'-/B/C', dehya:'D/C/B',
  lynette:'-/B/-', sara:'-/-/B', tartaglia:'B/-/-', 'traveler-dendro':'-/B/-', wanderer:'B/-/-', kaeya:'-/B/-', yoimiya:'C/-/-', kachina:'-/C/-',
  diluc:'C/-/-', mika:'-/-/C', itto:'C/-/-', lisa:'-/C/D', ayato:'C/-/-', chongyun:'-/C/D', dahlia:'-/-/C', sayu:'-/C/C', barbara:'-/-/C',
  tighnari:'C/-/-', sethos:'C/-/-', candace:'-/-/C', ifa:'C/-/-', keqing:'C/-/-', noelle:'C/-/D', eula:'C/-/-', yanfei:'D/-/-', xinyan:'D/D/D',
  dori:'-/-/D', heizou:'D/-/-', amber:'-/D/-', kaveh:'D/-/-', 'traveler-geo':'-/D/-', freminet:'D/-/-', 'traveler-anemo':'-/D/-',
  'traveler-electro':'-/-/D', ningguang:'D/-/-', 'traveler-hydro':'-/D/-', aloy:'D/-/-',
};

// GamsGo 7.2 풀돌(C6) 티어표의 역할별 등급 '메인/서브/서포터'
const GG_ROLE_C6 = {
  sandrone:'SS/-/-', odette:'-/SS/SS', nicole:'-/-/SS', mitya:'SS/-/SS', columbina:'-/SS/SS', vesna:'SS/-/-', furina:'A+/SS/SS', zibai:'SS/-/-',
  durin:'-/SS/-', mavuika:'SS/SS/S', vodyanitsa:'-/-/SS', mualani:'SS/-/-', yae:'-/SS/-', chasca:'SS/-/-', citlali:'-/-/SS', skirk:'SS/-/-',
  lauma:'-/S/SS', flins:'SS/-/-', linnea:'-/S/SS', nefer:'SS/-/-', ineffa:'-/S/SS', 'traveler-cryo':'SS/-/-', xilonen:'-/-/SS', wriothesley:'SS/-/-',
  escoffier:'-/S/SS', cyno:'SS/-/-', barca:'S/-/-', nahida:'-/S/S', neuvillette:'S/-/-', bennett:'-/-/S', arlecchino:'S/-/-', iansan:'-/-/S',
  mizuki:'S/-/B', prune:'-/A+/S', navia:'S/-/-', yelan:'A+/S/-', sucrose:'-/A/S', varesa:'S/-/-', qiqi:'-/-/S', roen:'S/-/-', fischl:'-/S/-',
  chevreuse:'-/-/S', emilie:'-/S/-', kazuha:'-/-/S', albedo:'-/S/-', alyosha:'-/-/S', valery:'-/-/S', shenhe:'-/-/S', chiori:'A+/A/-', nilou:'-/A+/-',
  xianyun:'A/-/A+', kinich:'A+/-/-', raiden:'A/A+/-', baizhu:'-/-/A+', mona:'-/A+/A+', clorinde:'A+/-/-', xiangling:'-/A+/-', faruzan:'-/-/A+',
  lyney:'A+/-/-', xingqiu:'-/A+/-', illuga:'-/-/A+', venti:'A+/A+/-', zhongli:'-/-/A+', wanderer:'A+/-/-', jean:'-/-/A+', xiao:'A+/-/-',
  shinobu:'-/A+/A', klee:'A+/-/-', ayaka:'A+/-/-', gaming:'A/-/-', ororon:'-/A/-', kokomi:'-/B/A', alhaitham:'A/-/-', aino:'-/A/-', lanyan:'-/-/A',
  hutao:'A/-/-', gorou:'-/-/A', diona:'-/-/A', ayato:'A/-/-', rosaria:'-/A/C', yaoyao:'-/-/A', ganyu:'B/A/-', charlotte:'-/-/A', itto:'A/-/-',
  razor:'A/-/-', layla:'-/-/A', tighnari:'A/-/-', kirara:'-/-/A', sigewinne:'-/-/B', eula:'B/-/-', thoma:'-/B/B', jahoda:'-/-/B', diluc:'B/-/-',
  collei:'-/B/-', yunjin:'-/-/B', tartaglia:'B/-/-', 'traveler-pyro':'-/B/-', sara:'-/-/B', yoimiya:'B/-/-', beidou:'-/B/-', sethos:'B/-/-',
  dehya:'C/B/B', ifa:'B/-/-', kaeya:'-/B/-', lynette:'-/B/-', 'traveler-dendro':'-/B/-', keqing:'C/-/-', kachina:'-/C/-', mika:'-/-/C', noelle:'C/-/D',
  lisa:'-/C/D', sayu:'-/C/C', yanfei:'C/-/-', chongyun:'-/C/D', dahlia:'-/-/C', barbara:'-/-/C', heizou:'C/-/-', candace:'-/-/C', kaveh:'C/-/-',
  'traveler-electro':'-/-/C', ningguang:'C/-/-', freminet:'C/-/-', dori:'-/-/C', xinyan:'D/D/D', 'traveler-geo':'-/D/-', amber:'-/D/-',
  'traveler-anemo':'-/D/-', 'traveler-hydro':'-/D/-',
};

// 직전 티어표(순위·점수 변동 표시용). 매주 업데이트에서 GG가 바뀌면 바뀌기 전 GG를 tier로 옮기고 v·at을 그 표의 버전·날짜로 고침
// PERF_NAMU(나무위키 점수)를 바꿀 때는 바뀌기 전 값을 namu: { id: 점수 }로 함께 남김(바뀐 캐릭터만 넣어도 됨)
const GG_NOW = { v: '7.2', at: '2026-11-04' };
const GG_PREV = { v: '7.1', at: '2026-09-23', tier: {
  'traveler-pyro':'B', 'traveler-hydro':'D', 'traveler-anemo':'D', 'traveler-electro':'C', 'traveler-dendro':'B', 'traveler-cryo':'SS', 'traveler-geo':'D',
  amber:'D', xiangling:'A+', bennett:'S', diluc:'C', klee:'A', xinyan:'D', hutao:'B', yanfei:'D', yoimiya:'C', thoma:'B', dehya:'B', lyney:'B', chevreuse:'S', gaming:'B', arlecchino:'A', mavuika:'SS', durin:'S', nicole:'SS',
  barbara:'C', xingqiu:'A+', mona:'A+', tartaglia:'B', kokomi:'A', ayato:'C', yelan:'A+', candace:'C', nilou:'A', neuvillette:'A', furina:'S', sigewinne:'B', mualani:'A+', dahlia:'C', aino:'A', columbina:'SS', vodyanitsa:'S',
  sucrose:'SS', jean:'A', venti:'A+', xiao:'B', kazuha:'A+', sayu:'C', heizou:'D', faruzan:'A', wanderer:'B', lynette:'B', xianyun:'A', chasca:'A+', lanyan:'A', mizuki:'S', ifa:'C', jahoda:'A', barca:'S', prune:'A+', vesna:'SS',
  lisa:'C', razor:'B', beidou:'B', fischl:'S', keqing:'C', sara:'B', raiden:'A', yae:'SS', shinobu:'A', dori:'C', cyno:'SS', sethos:'C', clorinde:'B', ororon:'A', iansan:'SS', varesa:'A+', ineffa:'SS', flins:'SS', alyosha:'S',
  collei:'B', tighnari:'C', nahida:'A+', yaoyao:'A', alhaitham:'B', kaveh:'D', baizhu:'A', kirara:'A', emilie:'A+', kinich:'A+', lauma:'SS', nefer:'SS',
  kaeya:'B', chongyun:'C', qiqi:'S', diona:'A', ganyu:'B', rosaria:'A', eula:'C', ayaka:'B', aloy:'D', shenhe:'A+', layla:'A', mika:'C', freminet:'D', wriothesley:'S', charlotte:'A', citlali:'SS', escoffier:'S', skirk:'S', roen:'A+', sandrone:'SS', odette:'SS',
  ningguang:'D', noelle:'C', zhongli:'A', albedo:'A+', gorou:'A', itto:'C', yunjin:'B', navia:'B', chiori:'A', kachina:'C', xilonen:'S', illuga:'A+', zibai:'SS', linnea:'SS',
} };
// 두 점수의 평균. 단 그 등급 칸(위·아래 등급 점수의 가운데까지)을 넘지 않게 묶어서 아래 등급이 위 등급을 넘지 못함
// 칸: SS 88~100 · S 80~87 · A+ 72~79 · A 62~71 · B 50~61 · C 37~49 · D 0~36 (예: 92와 92 → 92, 92와 85 → 89)
const GG_BAND = (() => { const v = Object.values(GG_SCORE).sort((a, b) => b - a), o = {};
  v.forEach((s, i) => { o[s] = [i < v.length - 1 ? Math.ceil((s + v[i + 1]) / 2) : 0, i ? Math.ceil((s + v[i - 1]) / 2) - 1 : 100]; }); return o; })();
const blendScore = (g, n) => { if (g == null) return n; if (n == null) return g; const b = GG_BAND[g] || [0, 100]; return Math.max(b[0], Math.min(b[1], Math.round((g + n) / 2))); };
const PERF = {};
for (const id of new Set([...Object.keys(PERF_NAMU), ...Object.keys(GG)])) {
  const n = PERF_NAMU[id], g = GG[id] ? GG_SCORE[GG[id]] : null;
  PERF[id] = blendScore(g, n);
}
const PERF_DEFAULT = 60;
const GP = { EL: { pyro:'불', hydro:'물', anemo:'바람', electro:'번개', dendro:'풀', cryo:'얼음', geo:'바위' },
  ROLE: { main:'메인 딜러', sub:'서브 딜러', sup:'서포터', heal:'힐러', shield:'보호막' },
  WPN: { sword:'한손검', claymore:'양손검', polearm:'장병기', catalyst:'법구', bow:'활' }, DB: {} };
for (const [id, name, el, wp, r, roles, scale, er, crit, tal, guess] of RAW)
  GP.DB[id] = { id, name, el, wp, r, roles: roles.split('/'), scale, er, crit: !!crit, guess: !!guess, perf: PERF[id] ?? PERF_DEFAULT };
GP.ORDER = Object.keys(GP.EL);
GP.KEY = 'genshin-party-appraiser-v1';
// 메인 앱(파티 감정소)에 저장된 내 캐릭터 목록. 없거나 읽을 수 없으면 빈 객체
// 파티 감정소(감정 마스터)가 저장해 둔 육성 점수·오버롤: { id: { s: 육성, o: OVR, p: 성능 } }
GP.appraisal = () => { try { return JSON.parse(localStorage.getItem(GP.KEY + ':appraisal')) || {}; } catch (e) { return {}; } };
GP.roster = () => { try { return (JSON.parse(localStorage.getItem(GP.KEY)) || {}).roster || {}; } catch (e) { return {}; } };
GP.esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
// 캐릭터 아이콘 파일 이름(게임 내부 이름, enka.network 제공 · © HoYoverse). index.html의 ICON과 같은 표 — 신캐 추가 시 둘 다 고칠 것
const ICON = {
  hutao:'Hutao', diluc:'Diluc', yoimiya:'Yoimiya', lyney:'Liney', arlecchino:'Arlecchino', mavuika:'Mavuika', klee:'Klee', dehya:'Dehya',
  xiangling:'Xiangling', bennett:'Bennett', thoma:'Tohma', yanfei:'Feiyan', chevreuse:'Chevreuse', gaming:'Gaming', xingqiu:'Xingqiu', yelan:'Yelan',
  mona:'Mona', kokomi:'Kokomi', barbara:'Barbara', neuvillette:'Neuvillette', furina:'Furina', ayato:'Ayato', tartaglia:'Tartaglia', nilou:'Nilou',
  candace:'Candace', sigewinne:'Sigewinne', mualani:'Mualani', kazuha:'Kazuha', sucrose:'Sucrose', venti:'Venti', jean:'Qin', wanderer:'Wanderer',
  xiao:'Xiao', faruzan:'Faruzan', xianyun:'Liuyun', sayu:'Sayu', lynette:'Linette', chasca:'Chasca', heizou:'Heizo', raiden:'Shougun', fischl:'Fischl',
  beidou:'Beidou', keqing:'Keqing', yae:'Yae', shinobu:'Shinobu', cyno:'Cyno', clorinde:'Clorinde', sethos:'Sethos', lisa:'Lisa', ororon:'Olorun',
  varesa:'Varesa', iansan:'Iansan', nahida:'Nahida', alhaitham:'Alhatham', tighnari:'Tighnari', baizhu:'Baizhuer', collei:'Collei', kirara:'Momoka',
  yaoyao:'Yaoyao', emilie:'Emilie', kinich:'Kinich', ganyu:'Ganyu', ayaka:'Ayaka', shenhe:'Shenhe', rosaria:'Rosaria', eula:'Eula', layla:'Layla',
  diona:'Diona', wriothesley:'Wriothesley', charlotte:'Charlotte', citlali:'Citlali', escoffier:'Escoffier', skirk:'SkirkNew', mika:'Mika',
  zhongli:'Zhongli', navia:'Navia', albedo:'Albedo', itto:'Itto', gorou:'Gorou', yunjin:'Yunjin', noelle:'Noel', chiori:'Chiori', xilonen:'Xilonen',
  ningguang:'Ningguang', amber:'Ambor', xinyan:'Xinyan', razor:'Razor', sara:'Sara', dori:'Dori', kaveh:'Kaveh', kaeya:'Kaeya', chongyun:'Chongyun',
  qiqi:'Qiqi', aloy:'Aloy', freminet:'Freminet', kachina:'Kachina', lanyan:'Lanyan', mizuki:'Mizuki', ifa:'Ifa', dahlia:'Dahlia', aino:'Aino',
  ineffa:'Ineffa', flins:'Flins', lauma:'Lauma', nefer:'Nefer', durin:'Durin', nicole:'Nicole', columbina:'Columbina', vodyanitsa:'Vodyanitsa',
  jahoda:'Jahoda', barca:'Varka', prune:'Prune', vesna:'Vesna', alyosha:'Alyosha', roen:'Lohen', sandrone:'MarionetteNew', odette:'Odette',
  illuga:'Illuga', zibai:'Zibai', linnea:'Linnea', mitya:'Mitya', valery:'Valeriy',
};
GP.iconUrl = id => { const n = ICON[id] || (id.startsWith('traveler') ? 'PlayerGirl' : null); return n ? `https://enka.network/ui/UI_AvatarIcon_${n}.png` : null; };

// ───────── 역할별 · 운명의 자리별 성능 ─────────
// 칸 점수 = 그 칸 GamsGo 등급 점수와 나무위키 평가 점수의 평균(등급 칸 안으로 묶음)
GP.POS = [['main', '메인 딜러'], ['sub', '서브 딜러'], ['sup', '서포터 · 힐러 · 보호막']];
GP.roleScore = (id, t) => blendScore(GG_SCORE[t], PERF_NAMU[id] ?? null);
// 운명의 자리 가치 곡선(C0 → C6 사이를 채우는 비율): 5성은 1돌·2돌이 크고 뒤로 갈수록 작음, 4성은 고르게
GP.CONS_W = { 5: [0, .35, .55, .65, .75, .85, 1], 4: [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1] };
const roleArr = s => s ? s.split('/').map(x => x === '-' ? null : x) : null;
// 캐릭터가 들어갈 칸들. cons = null이면 종합 표, 0·6이면 명함·풀돌 표, 1~5는 두 표 사이를 곡선으로 채운 추정
// → [{ pos, tier, perf, est, alt }]  (alt: 그 캐릭터의 가장 높은 칸이 아님)
GP.slotsAt = (id, cons = null) => {
  const d = GP.DB[id], out = [];
  const fallback = () => [{ pos: d.roles[0] === 'heal' || d.roles[0] === 'shield' ? 'sup' : d.roles[0], tier: null, perf: d.perf, est: false }];
  if (cons == null) {
    const g = roleArr(GG_ROLE[id]);
    if (!g) return markAlt(fallback());
    g.forEach((t, i) => t && out.push({ pos: GP.POS[i][0], tier: t, perf: GP.roleScore(id, t), est: false }));
    return markAlt(out);
  }
  const a = roleArr(GG_ROLE_C0[id]) || roleArr(GG_ROLE[id]), b = roleArr(GG_ROLE_C6[id]) || a;
  if (!a) return markAlt(fallback());
  const w = GP.CONS_W[d.r === 5 ? 5 : 4][cons];
  for (let i = 0; i < 3; i++) {
    const ta = a[i], tb = b[i];
    if (!(ta && w < 1) && !(tb && w >= 0.5)) continue;
    const sa = ta ? GP.roleScore(id, ta) : null, sb = tb ? GP.roleScore(id, tb) : null;
    const perf = sa != null && sb != null ? Math.round(sa + (sb - sa) * w) : (sa ?? sb);
    out.push({ pos: GP.POS[i][0], tier: cons === 0 ? ta : cons === 6 ? tb : null, perf, est: cons > 0 && cons < 6 && ta !== tb });
  }
  return markAlt(out.length ? out : fallback());
};
function markAlt(sl) {
  const top = Math.max(...sl.map(x => x.perf)), first = sl.findIndex(x => x.perf === top);
  sl.forEach((x, i) => x.alt = i !== first);
  return sl;
}
GP.perfAt = (id, cons = null) => Math.max(...GP.slotsAt(id, cons).map(x => x.perf));
// 직전 티어표 대비 변동: 종합 점수(GamsGo 등급 점수와 나무위키 평가의 평균, 등급 칸 안) 기준. 점수가 오르면 올라감, 떨어지면 내려감(등급이 같아도)
// 직전 점수 = 직전 등급(GG_PREV.tier) + 직전 나무위키 점수(GG_PREV.namu, 없으면 지금 PERF_NAMU)
const TIER_ORDER = ['D', 'C', 'B', 'A', 'A+', 'S', 'SS'];
GP.prevScore = id => {
  const t = GG_PREV.tier[id];
  if (!t) return null;
  const n = (GG_PREV.namu && GG_PREV.namu[id] != null) ? GG_PREV.namu[id] : (PERF_NAMU[id] ?? null);
  return blendScore(GG_SCORE[t], n);
};
// 점수 순 전체 순위(같은 점수는 같은 순위)
const rankOf = get => {
  const xs = Object.keys(GP.DB).map(id => [id, get(id)]).filter(x => x[1] != null).sort((a, b) => b[1] - a[1]), m = {};
  xs.forEach(([id, v], i) => { m[id] = i && v === xs[i - 1][1] ? m[xs[i - 1][0]] : i + 1; });
  m._n = xs.length;
  return m;
};
let RANKS = null;
// → { now, prev(등급), sNow, sPrev(점수), ds(점수 차), rNow, rPrev(전체 순위), dr(순위 계단, +면 올라감), d(점수 방향 -1·0·1), isNew }
GP.tierChange = id => {
  const now = GG[id];
  if (!now) return null;
  if (!RANKS) RANKS = { now: rankOf(x => GG[x] ? GP.DB[x].perf : null), prev: rankOf(GP.prevScore) };
  const sNow = GP.DB[id].perf, sPrev = GP.prevScore(id), rNow = RANKS.now[id], nNow = RANKS.now._n, nPrev = RANKS.prev._n;
  if (sPrev == null) return { now, prev: null, sNow, sPrev: null, ds: 0, rNow, rPrev: null, dr: 0, d: 0, isNew: true, nNow, nPrev };
  const rPrev = RANKS.prev[id], ds = sNow - sPrev;
  return { now, prev: GG_PREV.tier[id], sNow, sPrev, ds, rNow, rPrev, dr: rPrev - rNow, d: Math.sign(ds), isNew: false, nNow, nPrev };
};
