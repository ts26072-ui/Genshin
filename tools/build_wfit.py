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
PASS_RE = re.compile(r'(치명타 확률|치명타 피해|원소 마스터리|원소 충전 효율|공격력|방어력|HP 최대치|HP|피해)(?:가|이)? (?:추가로 )?\{(\d)\}(pt)? 증가')
STACK_RE = re.compile(r'최대 (?:중첩수: )?(\d)(?:스택|중첩|회|층)')
EDMG_RE = re.compile(r'원소의? 피해 보너스를 \{(\d)\} 획득')
KEYS = {'HP 최대치': 'hpP', '치명타 확률': 'cr', '치명타 피해': 'cd', '원소 마스터리': 'em', '원소 충전 효율': 'er', '공격력': 'atkP', '방어력': 'defP', 'HP': 'hpP', '피해': 'dmg'}
wpass = {}
for name, v in WD.items():
    tpl, vals = (v[8] or ''), (v[9][0] if len(v) > 9 and v[9] else [])
    got = {}
    # 문장마다: 같은 문장(또는 바로 다음 문장)에 '최대 N스택'이 있으면 그 효과는 N배
    sents = re.split(r'(?<=[.다])\s+', tpl)
    for si, sent in enumerate(sents):
      st = STACK_RE.search(sent)
      for nx in sents[si + 1:si + 3]:
        if st or PASS_RE.search(nx): break
        st = STACK_RE.search(nx)
      mult = int(st.group(1)) if st else 1
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
        got[k] = max(got.get(k, 0), round(val, 4))
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
