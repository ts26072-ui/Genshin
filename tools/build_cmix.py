# 캐릭터 스킬 계수표(genshin-db)에서 무기 점수에 필요한 것을 뽑아 tools/cmix.json으로 저장 (특성 Lv.10, 그 캐릭터의 핵심 특성만)
#   mix:  한 공격에 두 스탯이 함께 붙는 경우의 계수 합 [공격력, HP, 방어력, 원소 마스터리] (예: 나히다 = 공격력 + 마스터리)
#   hit:  핵심 스탯 기준 한 타 계수의 중앙값(스탯 비례 추가 피해를 '한 타 대비 몇 %'로 바꿀 때 씀)
#   atkFromHp / atkFromDef: 스킬로 'HP·방어력의 n%만큼 공격력 증가'(호두·노엘·이토)
#   flat: 본인 공격에 '스탯의 n%만큼 피해 증가'(코코미·아야토·세토스 등) [[스탯, 계수]]
#   team: 파티에 주는 '스탯의 n%만큼 피해·공격력 증가'(신학·운근·니콜·얀사) [[스탯, 계수]]
# genshin-db 받기:
#   git clone --depth 1 --filter=blob:none --sparse https://github.com/theBowja/genshin-db.git gdb
#   git -C gdb sparse-checkout set src/data/Korean/talents src/data/stats
# 실행(저장소 폴더에서): python tools/build_cmix.py <gdb 경로>
import json, os, re, sys, statistics

GDB = sys.argv[1]
root = os.getcwd()
D = os.path.join(GDB, 'src', 'data')
params = json.load(open(os.path.join(D, 'stats', 'talents.json'), encoding='utf8'))
src = open(os.path.join(root, 'chars.js'), encoding='utf8').read()
# 이름 → (id, 역할, 핵심 스탯, 핵심 특성)
rows = {m.group(2): (m.group(1), m.group(3), m.group(4), m.group(5)) for m in re.finditer(
    r"\['([\w-]+)','([^']+)',(?:'[^']*',){2}\d+,'([^']*)','([a-z]+)',\d+,\d+,'([NEQ]*)'", src)}

PREFIX = [('HP 최대치의', 1), ('방어력의', 2), ('원소 마스터리의', 3), ('공격력의', 0)]
NAMES = ['atk', 'hp', 'def', 'em']
TOKEN = re.compile(r'\{(param\d+):([^}]*)\}')
SKIP_NAME = re.compile(r'스태미나|지속 시간|대기시간|소모|회복|치유|흡수|에너지|감소|횟수|간격|확률|범위|보너스|스택|전환|증가')
LV = 9  # 특성 Lv.10

def at(vals, p):
    v = vals.get(p)
    return None if not v else (v[LV] if len(v) > LV else v[-1])

def parse(fmt, vals):
    """한 줄에서 스탯별 계수를 더함. '/'로 나뉜 대안은 첫 번째만, 끝의 x2·*3은 곱함"""
    out = [0.0, 0.0, 0.0, 0.0]
    first = fmt.split('/')[0] if '/' in fmt and not re.search(r'\)\s*[x*]', fmt) else fmt
    m = re.search(r'[x*](\d+)\s*$', first)
    mult = int(m.group(1)) if m else 1
    for tm in TOKEN.finditer(first):
        p, f = tm.group(1), tm.group(2)
        v = at(vals, p)
        if 'P' not in f or v is None: continue
        seg = re.split(r'[+(]', first[:tm.start()])[-1]
        idx = next((i for w, i in PREFIX if w in seg), 0)
        out[idx] += v * mult
    return out

out = {}
for fn in os.listdir(os.path.join(D, 'Korean', 'talents')):
    j = json.load(open(os.path.join(D, 'Korean', 'talents', fn), encoding='utf8'))
    key, name = fn[:-5], j.get('name', '')
    if key.startswith('traveler'):
        cid = 'traveler-' + key[8:]
        m = re.search(r"\['" + re.escape(cid) + r"','[^']+',(?:'[^']*',){2}\d+,'([^']*)','([a-z]+)',\d+,\d+,'([NEQ]*)'", src)
        if not m: continue
        role, scale, tal = m.group(1), m.group(2), m.group(3)
    elif name in rows:
        cid, role, scale, tal = rows[name]
    else:
        continue
    support = role.split('/')[0] in ('sup', 'heal', 'shield')
    P = params.get(key) or {}
    mix, hits, rec = [0.0] * 4, [], {}
    for ci, ck in enumerate(('combat1', 'combat2', 'combat3')):
        vals = P.get(ck) or {}
        core = not tal or 'NEQ'[ci] in tal
        for lab in ((j.get(ck) or {}).get('attributes') or {}).get('labels', []):
            if '|' not in lab: continue
            nm, fmt = lab.split('|', 1)
            # 스킬로 'HP·방어력의 n%만큼 공격력 증가'(핵심 특성이 아니어도 씀: 호두 스킬·노엘 폭발·이토 폭발)
            if re.search(r'^공격력 증가$', nm):
                m = re.search(r'(HP 최대치의|방어력의) \{(param\d+)', fmt)
                if m and at(vals, m.group(2)) is not None:
                    rec['atkFromHp' if 'HP' in m.group(1) else 'atkFromDef'] = round(at(vals, m.group(2)), 5)
                continue
            # '스탯의 n%만큼 피해 증가'(본인 또는 파티)
            if re.search(r'피해(량)? (추가 )?증가', nm):
                m = re.search(r'(HP 최대치의|방어력의|원소 마스터리의|공격력의) \{(param\d+)', fmt)
                if m and at(vals, m.group(2)) is not None and '반응' not in nm:
                    st = NAMES[next(i for w, i in PREFIX if w == m.group(1))]
                    stacks = 1
                    if '스택' in fmt: stacks = 3
                    # 파티 버프: '피해량 증가'(신학·운근처럼 파티원 공격에 붙음) 또는 서포터의 원소 피해 증가. 나머지는 본인 공격
                    team = nm == '피해량 증가' or (support and '원소 피해 증가' in nm)
                    rec.setdefault('team' if team else 'flat', []).append([st, round(at(vals, m.group(2)) * stacks, 5)])
                continue
            if not core: continue
            if not ('피해' in nm and not SKIP_NAME.search(nm)): continue
            v = parse(fmt, vals)
            if sum(1 for x in v if x > 0) > 1:
                for i, x in enumerate(v): mix[i] += x
            k = {'atk': 0, 'hp': 1, 'def': 2, 'em': 3}.get(scale, 0)
            if v[k] > 0 and sum(1 for x in v if x > 0) == 1:
                hits.append(v[k])
    if sum(mix) > 0: rec['mix'] = [round(x, 3) for x in mix]
    if hits: rec['hit'] = round(statistics.median(hits), 4)
    if rec: out[cid] = rec

json.dump(out, open(os.path.join(root, 'tools', 'cmix.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'), sort_keys=True)
print(len(out), 'chars')
for k, v in sorted(out.items()):
    if set(v) - {'hit'}: print(' ', k, v)
