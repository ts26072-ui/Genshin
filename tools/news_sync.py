# HoYoLAB 원신 공식 소식(공지·이벤트·정보)을 받아 news/news.json으로 저장 (쿠키 없이 공개 목록만)
# 실행: python tools/news_sync.py news/news.json
# 내용이 같으면 파일을 건드리지 않음(받은 시각만 바뀌는 커밋을 만들지 않으려고)
import json, os, re, sys, time, urllib.request

OUT = sys.argv[1] if len(sys.argv) > 1 else 'news/news.json'
API = 'https://bbs-api-os.hoyolab.com/community/post/wapi/getNewsList?gids=2&page_size=15&type={}'
KINDS = {1: 'notice', 2: 'event', 3: 'info'}


def fetch(t):
    req = urllib.request.Request(API.format(t), headers={
        'x-rpc-language': 'ko-kr', 'Referer': 'https://www.hoyolab.com/', 'User-Agent': 'Mozilla/5.0 (genshin-party news)'})
    with urllib.request.urlopen(req, timeout=20) as r:
        d = json.load(r)
    if d.get('retcode') != 0:
        raise RuntimeError(d.get('message'))
    out = []
    for x in (d.get('data') or {}).get('list', []):
        p = x.get('post') or {}
        cover = next((c.get('url') for c in x.get('cover_list') or [] if c.get('url')), '') or (x.get('image_list') or [{}])[0].get('url', '')
        out.append({'id': str(p.get('post_id')), 't': (p.get('subject') or '').strip(), 'at': int(p.get('created_at') or 0),
                    'd': re.sub(r'\s+', ' ', re.sub(r'〓+', ' ', p.get('desc') or '')).strip()[:140], 'img': cover})
    return out


data = {}
for t, k in KINDS.items():
    try:
        data[k] = fetch(t)
    except Exception as e:
        print('fail', k, e)
old = {}
if os.path.exists(OUT):
    try:
        old = json.load(open(OUT, encoding='utf8'))
    except Exception:
        old = {}
# 실패한 종류는 예전 것 유지
for k in KINDS.values():
    if k not in data and k in old:
        data[k] = old[k]
if all(data.get(k) == old.get(k) for k in KINDS.values()):
    print('no change')
    sys.exit(0)
data['updated'] = time.strftime('%Y-%m-%dT%H:%M:%S+00:00', time.gmtime())
os.makedirs(os.path.dirname(OUT) or '.', exist_ok=True)
json.dump(data, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print({k: len(data.get(k, [])) for k in KINDS.values()})
