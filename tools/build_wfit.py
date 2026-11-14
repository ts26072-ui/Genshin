# 무기 옵션 점수용 작은 표(wfit.js)를 dex/weapons.js · dex/stats.js에서 만듦
# WSTAT: 무기 이름 → [성급, Lv.90 기초 공격력, 부옵 이름, Lv.90 부옵 값(%는 0.441처럼 비율)]
# CBASE: 캐릭터 id → [Lv.90 HP, 공격력, 방어력, 돌파 스탯 이름, 돌파 스탯 값]
# 사용: python tools/build_wfit.py  (저장소 폴더에서)
import json, os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

def consts(path):
    s = open(os.path.join(root, path), encoding='utf8').read()
    out = {}
    for m in re.finditer(r'^const (\w+) = (.*?);\s*$', s, re.M | re.S):
        out[m.group(1)] = json.loads(m.group(2))
    return out

w = consts('dex/weapons.js')
st = consts('dex/stats.js')
WC, WD = w['DEX_WCURVE'], w['DEX_WEAPONS']
CC, CD = st['DEX_CURVE'], st['DEX_STATS']
at90 = lambda curves, name: curves[name][89] if name in curves else 1

wstat = {}
for name, v in WD.items():
    r, a, ca, sp, sv, cs, pr = v[:7]
    wstat[name] = [r, round(a * at90(WC, ca) + (pr[6] if len(pr) > 6 else 0), 1), sp or '', round(sv * (at90(WC, cs) if cs else 1), 4)]

# 무기 효과 속 스탯 증가(재련 1 값): "치명타 피해가 {0} 증가", "원소 마스터리가 {1}pt 증가" 같은 문장만 뽑음. 같은 스탯이 여러 번이면 큰 값
PASS_RE = re.compile(r'(치명타 확률|치명타 피해|원소 마스터리|원소 충전 효율|공격력|방어력|HP 최대치|HP|피해)(?:가|이|은|는)? (?:추가로 )?\{(\d)\}(pt)? 증가')
STACK_RE = re.compile(r'최대 (?:중첩수: )?(\d)(?:스택|중첩|회|층)')
EDMG_RE = re.compile(r'원소의? 피해 보너스를 \{(\d)\} 획득')
KEYS = {'HP 최대치': 'hpP', '치명타 확률': 'cr', '치명타 피해': 'cd', '원소 마스터리': 'em', '원소 충전 효율': 'er', '공격력': 'atkP', '방어력': 'defP', 'HP': 'hpP', '피해': 'dmg'}
# 효과 문장 분류: 다른 파티원에게만 주는 버프(교체해 들어온 캐릭터 등) / 본인 포함 파티 전체 / 본인만
TEAM_ONLY = re.compile(r'새로 등장한 캐릭터|등장하는 캐릭터|파티 내 다른 캐릭터|다른 파티원|장착 캐릭터 외')
TEAM_ALL = re.compile(r'파티 내 모든 캐릭터|모든 파티원|파티 내 캐릭터 전원|주변에 있는 파티 내 모든|파티 전체|유식의 잎사귀|주변의 모든 파티')
# 팀 버프를 '팀 딜 배율'로 바꾸는 값(대략): 공격력% 0.6, 원소 마스터리 1pt = 1/700, 피해% 0.5, 치명 확률 1.0, 치명 피해 0.5, 그 밖 0.2~0.3. 유지율 60%
TEAM_CONV = {'atkP': 0.6, 'em': 1 / 700, 'dmg': 0.5, 'cr': 1.0, 'cd': 0.5, 'hpP': 0.3, 'defP': 0.2, 'er': 0.3}
# 문장 틀로 못 읽는 파티 버프(직접 넣음): 성현의 열쇠 = HP의 0.2%만큼 파티 마스터리(HP 35,000 기준 약 70)
TEAM_EXTRA = {'성현의 열쇠': 70 / 700 * 0.6}
wpass = {}
for name, v in WD.items():
    tpl, vals = (v[8] or ''), (v[9][0] if len(v) > 9 and v[9] else [])
    got, team = {}, 0.0
    # 스탯이 아닌 효과: 원소 구슬(입자) 생성 → 원충, 스킬 재사용 대기시간 초기화 → 스킬 한 번 더
    if re.search(r'원소 구슬이 생성', tpl): got['energy'] = 1
    if re.search(r'대기시간이 초기화', tpl): got['reset'] = 1
    # 문장마다: 같은 문장(또는 바로 다음 문장)에 '최대 N스택'이 있으면 그 효과는 N배
    sents = re.split(r'(?<=[.다])\s+', tpl)
    for si, sent in enumerate(sents):
      st = STACK_RE.search(sent)
      for nx in sents[si + 1:si + 3]:
        if st or PASS_RE.search(nx): break
        st = STACK_RE.search(nx)
      mult = int(st.group(1)) if st else 1
      only_team, all_team = bool(TEAM_ONLY.search(sent)), bool(TEAM_ALL.search(sent))
      # '이때 …'로 이어지는 문장은 앞 문장의 대상(파티 전체 등)을 이어받음
      if si and sent.startswith('이때'):
        prev = sents[si - 1]
        only_team, all_team = only_team or bool(TEAM_ONLY.search(prev)), all_team or bool(TEAM_ALL.search(prev))
      for m in EDMG_RE.finditer(sent):
        i = int(m.group(1))
        if i < len(vals) and str(vals[i]).endswith('%'):
          try: got['edmg'] = max(got.get('edmg', 0), float(str(vals[i]).rstrip('%')) / 100)
          except ValueError: pass
      for m in PASS_RE.finditer(sent):
        i = int(m.group(2))
        if i >= len(vals): continue
        raw = str(vals[i]).strip()
        pct = raw.endswith('%')
        try: num = float(raw.rstrip('%pt'))
        except ValueError: continue
        k = KEYS[m.group(1)]
        if k == 'em' and pct: continue
        if k == 'dmg' and '슬라임' in tpl: continue  # 특정 적에게만 붙는 피해는 뺌
        if k != 'em' and not pct: continue  # 고정 수치(공격력 +48 등)는 뺌
        val = (num / 100 if pct else num) * mult
        # 바로 앞에 '장착 캐릭터'가 있으면 본인 버프(예: 파티원 HP가 변하면 장착 캐릭터 HP 증가)
        own = re.search(r'장착(한)? 캐릭터', sent[max(0, m.start() - 30):m.start()])
        if (only_team or all_team) and not own: team += TEAM_CONV.get(k, 0.2) * val * 0.6
        if own or not only_team: got[k] = max(got.get(k, 0), round(val, 4))
    team += TEAM_EXTRA.get(name, 0)
    if team: got['team'] = round(min(team, 0.4), 4)
    if got: wpass[name] = got

cbase = {}
for cid, v in CD.items():
    h, a, d, ch, ca, sp, pr = v
    p = pr[6] if len(pr) > 6 else [0, 0, 0, 0]
    cbase[cid] = [round(h * at90(CC, ch) + p[0]), round(a * at90(CC, ca) + p[1], 1), round(d * at90(CC, ch) + p[2], 1), sp or '', round(p[3], 4)]

js = ('// 무기 옵션 점수용 Lv.90 스탯표(tools/build_wfit.py가 dex/weapons.js · dex/stats.js에서 만듦)\n'
      '// WSTAT: 무기 → [성급, 기초 공격력, 부옵, 부옵 값] · CBASE: 캐릭터 → [HP, 공격력, 방어력, 돌파 스탯, 돌파 스탯 값]\n'
      'const WSTAT = ' + json.dumps(wstat, ensure_ascii=False, separators=(',', ':')) + ';\n'
      'const CBASE = ' + json.dumps(cbase, ensure_ascii=False, separators=(',', ':')) + ';\n'
      '// WPASS: 무기 효과 속 스탯 증가(재련 1) { cr, cd, em, er, atkP, hpP, defP, dmg }\n'
      'const WPASS = ' + json.dumps(wpass, ensure_ascii=False, separators=(',', ':')) + ';\n')
js += open(os.path.join(root, 'tools', 'wfit_fn.js'), encoding='utf8').read()
open(os.path.join(root, 'wfit.js'), 'w', encoding='utf8').write(js)
print(len(wpass), 'passives', len(wstat), 'weapons', len(cbase), 'chars', len(js), 'bytes')
