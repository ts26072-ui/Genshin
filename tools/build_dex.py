# 캐릭터 도감 자료(dex/)를 genshin-db 원본 데이터에서 만듦
#   dex/stats.js  — 레벨·돌파별 기초 HP·공격력·방어력과 돌파 스탯 계산용 표(모든 페이지가 바로 씀)
#   dex/<id>.json — 캐릭터 한 명의 소개·특성·고유 특성·운명의 자리(한국어). 도감에서 그 캐릭터를 열 때만 받음
# genshin-db npm/API는 신캐 반영이 늦어 GitHub 저장소를 직접 받아 씀:
#   git clone --depth 1 --filter=blob:none --sparse https://github.com/theBowja/genshin-db.git gdb
#   git -C gdb sparse-checkout set src/data/Korean/characters src/data/Korean/talents src/data/Korean/constellations src/data/stats src/data/curve
# 실행: py tools/build_dex.py <gdb 경로> chars.js dex
import json, os, re, sys

GDB, CHARS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
D = os.path.join(GDB, 'src', 'data')
src = open(CHARS, encoding='utf8').read()
ours = {m.group(2): m.group(1) for m in re.finditer(r"\['([\w-]+)','([^']+)'", src)}  # 한국어 이름 → id


def load(*p):
    with open(os.path.join(D, *p), encoding='utf8') as f:
        return json.load(f)


# genshin-db 파일 이름 ↔ 우리 id: 한국어 이름으로 맞춤(여행자는 원소별 파일)
files = {}
for fn in os.listdir(os.path.join(D, 'Korean', 'characters')):
    c = load('Korean', 'characters', fn)
    if c['name'] in ours:
        files[ours[c['name']]] = fn[:-5]
for el in ('pyro', 'hydro', 'anemo', 'electro', 'dendro', 'cryo', 'geo'):
    files['traveler-' + el] = 'traveler' + el
missing = sorted(set(ours.values()) - set(files))
print('matched', len(files), 'missing', missing)

PROP = {'FIGHT_PROP_HP_PERCENT': 'HP%', 'FIGHT_PROP_ATTACK_PERCENT': '공격력%', 'FIGHT_PROP_DEFENSE_PERCENT': '방어력%',
        'FIGHT_PROP_CRITICAL': '치명타 확률', 'FIGHT_PROP_CRITICAL_HURT': '치명타 피해', 'FIGHT_PROP_CHARGE_EFFICIENCY': '원소 충전 효율',
        'FIGHT_PROP_ELEMENT_MASTERY': '원소 마스터리', 'FIGHT_PROP_HEAL_ADD': '치유 보너스', 'FIGHT_PROP_PHYSICAL_ADD_HURT': '물리 피해%',
        'FIGHT_PROP_FIRE_ADD_HURT': '불 피해%', 'FIGHT_PROP_WATER_ADD_HURT': '물 피해%', 'FIGHT_PROP_WIND_ADD_HURT': '바람 피해%',
        'FIGHT_PROP_ELEC_ADD_HURT': '번개 피해%', 'FIGHT_PROP_GRASS_ADD_HURT': '풀 피해%', 'FIGHT_PROP_ICE_ADD_HURT': '얼음 피해%',
        'FIGHT_PROP_ROCK_ADD_HURT': '바위 피해%'}
stats = load('stats', 'characters.json')
curve = load('curve', 'characters.json')
r4 = lambda x: round(x, 4)
# 성장 곡선: 레벨 1~90의 배율(HP·방어력은 HP 곡선, 공격력은 공격력 곡선)
CURVES = {}
for name in ('GROW_CURVE_HP_S4', 'GROW_CURVE_ATTACK_S4', 'GROW_CURVE_HP_S5', 'GROW_CURVE_ATTACK_S5'):
    CURVES[name] = [r4(curve[str(lv)][name]) for lv in range(1, 91)]
ST = {}
for id_, fn in files.items():
    key = 'aether' if id_.startswith('traveler') else fn
    s = stats.get(key)
    if not s:
        print('no stats', id_); continue
    b, cv, pr = s['base'], s['curve'], s['promotion']
    ST[id_] = [r4(b['hp']), r4(b['attack']), r4(b['defense']), cv['hp'], cv['attack'], PROP.get(s['specialized'], s['specialized']),
               [[r4(p['hp']), r4(p['attack']), r4(p['defense']), r4(p.get('specialized', 0))] for p in pr]]
os.makedirs(OUT, exist_ok=True)
with open(os.path.join(OUT, 'stats.js'), 'w', encoding='utf8') as f:
    f.write('// 캐릭터 기초 스탯(genshin-db, tools/build_dex.py가 만듦): id → [HP, 공격력, 방어력(Lv.1), HP 곡선, 공격력 곡선, 돌파 스탯, 돌파 0~6단계 가산 [HP, 공격력, 방어력, 돌파 스탯]]\n')
    f.write('const DEX_CURVE = ' + json.dumps(CURVES, separators=(',', ':')) + ';\n')
    f.write('const DEX_STATS = ' + json.dumps(ST, ensure_ascii=False, separators=(',', ':')) + ';\n')


# 설명문: genshin-db의 **굵게** 표기만 남기고 나머지는 글자 그대로
def text(s):
    return (s or '').strip()


KIND = {'combat1': '일반 공격', 'combat2': '원소전투 스킬', 'combatsp': '대체 질주', 'combat3': '원소폭발'}
n = 0
for id_, fn in files.items():
    try:
        tal = load('Korean', 'talents', fn + '.json')
        con = load('Korean', 'constellations', fn + '.json')
    except FileNotFoundError as e:
        print('skip', id_, e); continue
    ch = load('Korean', 'characters', ('aether' if id_.startswith('traveler') else fn) + '.json')
    out = {
        'title': ch.get('title', ''), 'desc': text(ch.get('description')), 'region': ch.get('region', ''),
        'aff': ch.get('affiliation', ''), 'cons_name': ch.get('constellation', ''), 'birthday': ch.get('birthday', ''),
        'skills': [{'k': KIND[k], 'n': tal[k]['name'], 'd': text(tal[k].get('description'))} for k in ('combat1', 'combat2', 'combatsp', 'combat3') if tal.get(k)],
        'passives': [{'n': tal[k]['name'], 'd': text(tal[k].get('description'))} for k in ('passive1', 'passive2', 'passive3', 'passive4') if tal.get(k)],
        'cons': [{'n': con[k]['name'], 'd': text(con[k].get('description'))} for k in ('c1', 'c2', 'c3', 'c4', 'c5', 'c6') if con.get(k)],
    }
    with open(os.path.join(OUT, id_ + '.json'), 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    n += 1
print('wrote', n, 'characters')

# ───────── 무기: dex/weapons.js (도감 비교용) ─────────
# 무기 이름(한국어) → [성급, 기초 공격력(Lv.1), 공격력 곡선, 부옵, 부옵 Lv.1 값, 부옵 곡선, 돌파 0~6단계 공격력 가산, 효과 이름, 효과 틀({0}·{1}… 자리), 재련 1~5 값]
# 받을 때 sparse-checkout에 src/data/Korean/weapons 도 넣어야 함
wdir = os.path.join(D, 'Korean', 'weapons')
if os.path.isdir(wdir):
    wstats = load('stats', 'weapons.json')
    wcurve = load('curve', 'weapons.json')
    W, used = {}, set()
    for fn in sorted(os.listdir(wdir)):
        w = load('Korean', 'weapons', fn)
        s = wstats.get(fn[:-5])
        if not s or w.get('rarity', 0) < 3:
            continue
        cv = s['curve']
        used.update(v for v in cv.values() if v)
        tpl = re.sub(r'</?color[^>]*>', '', w.get('effectTemplateRaw') or '')
        W[w['name']] = [w['rarity'], r4(s['base']['attack']), cv['attack'], PROP.get(s.get('specialized'), s.get('specialized') or ''),
                        r4(s['base'].get('specialized') or 0), cv.get('specialized') or '', [r4(p.get('attack', 0)) for p in s['promotion']],
                        w.get('effectName', ''), tpl, [(w.get(f'r{i}') or {}).get('values', []) for i in range(1, 6)]]
    WC = {name: [r4(wcurve[str(lv)][name]) for lv in range(1, 91)] for name in sorted(used)}
    with open(os.path.join(OUT, 'weapons.js'), 'w', encoding='utf8') as f:
        f.write('// 무기 기초 스탯·효과(genshin-db, tools/build_dex.py가 만듦): 이름 → [성급, 기초 공격력, 공격력 곡선, 부옵, 부옵 Lv.1 값, 부옵 곡선, 돌파 0~6단계 공격력 가산, 효과 이름, 효과 틀, 재련 1~5 값]\n')
        f.write('const DEX_WCURVE = ' + json.dumps(WC, separators=(',', ':')) + ';\n')
        f.write('const DEX_WEAPONS = ' + json.dumps(W, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('weapons', len(W))

# ───────── 성유물 세트: dex/artifacts.js (도감 비교·성유물 추천 사진용) ─────────
# 세트 이름(한국어) → [2세트 효과, 4세트 효과, 꽃 아이콘 이름(enka.network/ui/<이름>.png), 세트 번호(Enka setId — tools/enka_sync.py가 이름 찾을 때 씀)]
# 받을 때 sparse-checkout에 src/data/Korean/artifacts 와 src/data/image 도 넣어야 함
adir = os.path.join(D, 'Korean', 'artifacts')
if os.path.isdir(adir):
    imgs = load('image', 'artifacts.json') if os.path.exists(os.path.join(D, 'image', 'artifacts.json')) else {}
    A = {}
    for fn in sorted(os.listdir(adir)):
        a = load('Korean', 'artifacts', fn)
        icon = ((imgs.get(fn[:-5]) or {}).get('flower') or '').rsplit('/', 1)[-1].replace('.png', '')
        if not icon and a.get('id'):  # 이미지 표에 없으면 세트 번호로(꽃이 없는 기도 세트는 왕관 _3)
            icon = f"UI_RelicIcon_{a['id']}_{4 if a.get('flower') else 3}"
        A[a['name']] = [a.get('effect2Pc', ''), a.get('effect4Pc', ''), icon, a.get('id')]
    with open(os.path.join(OUT, 'artifacts.js'), 'w', encoding='utf8') as f:
        f.write('// 성유물 세트 효과·아이콘(genshin-db, tools/build_dex.py가 만듦): 세트 이름 → [2세트 효과, 4세트 효과, 꽃 아이콘 이름]\n')
        f.write('const DEX_SETS = ' + json.dumps(A, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('artifact sets', len(A))
