# GOOD 파일(Genshin Optimizer 형식)의 영어 키 → 한국어 이름 표(names.js)를 genshin-db에서 만듦
# GOOD 키 = 영어 이름의 각 단어 첫 글자를 대문자로 하고 글자·숫자 말고는 모두 뺀 것 (예: "Wolf's Gravestone" → "WolfsGravestone")
# 실행: py tools/build_names.py names.js
import json, re, sys, urllib.request

API = 'https://genshin-db-api.vercel.app/api/v5/'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'names.js'


def get(folder, lang):
    url = f'{API}{folder}?query=names&matchCategories=true&verboseCategories=true&resultLanguage={lang}'
    req = urllib.request.Request(url, headers={'User-Agent': 'genshin-party-names'})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.loads(r.read())


def good_key(name):
    name = re.sub(r"['’]", '', name)
    return ''.join(w[:1].upper() + w[1:] for w in re.split(r'[^0-9A-Za-z]+', name) if w)


out = {}
for folder in ('characters', 'weapons', 'artifacts'):
    en, ko = get(folder, 'English'), get(folder, 'Korean')
    by_id = {x['id']: x['name'] for x in ko if 'id' in x}
    m = {}
    for x in en:
        if x.get('id') in by_id:
            m[good_key(x['name'])] = by_id[x['id']]
    out[folder] = m
    print(folder, len(m))
with open(OUT, 'w', encoding='utf8') as f:
    f.write('// GOOD 파일(Genshin Optimizer 형식) 영어 키 → 한국어 이름. tools/build_names.py가 genshin-db에서 만듦\n')
    f.write('const GOOD_NAMES = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
