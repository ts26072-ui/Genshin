# HoYoLAB 공식 지도(테이와트, map_id 2)의 지도 타일과 특산물·광물·워프 위치를 받아 이 사이트에 올림.
# 일부 네트워크에서 HoYoverse 이미지 서버가 막혀 공식 지도가 안 보이므로, 지도 타일을 GitHub Pages에서 직접 내보냄.
# GitHub Actions(.github/workflows/map.yml)에서 실행. 결과: map/tiles/{z}/{x}_{y}.webp, map/icons/{label}.png, map/mapdata.js
# 공식 지도와 같은 방식: 지도 픽셀 = 위치 좌표 + detail_v2.origin, 타일은 map_manage/map/{id}/{map_version}/{x}_{y}_{N3..P0}.webp
import io, json, os, shutil, sys, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

API = 'https://sg-public-api-static.hoyolab.com/common/map_user/ys_obc/v1/map/'
TILE_BASE = 'https://act-webstatic.hoyoverse.com/map_manage/map/'
Q = 'map_id=2&app_sn=ys_obc&lang=ko-kr'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'map'
LEVELS = [-3, -2, -1]        # 공식 줌 단계 중 받을 것. 이 사이트의 줌 0,1,2가 됨(줌 2 = 원본의 1/2 크기)
GROUPS = {1: 'warp', 4: 'oculus', 10: 'spec', 11: 'ore'}
WARP = {2, 3, 154}           # 일곱신상, 워프 포인트, 비경
OCULI = {5, 6, 194, 403, 508, 626, 694, 833, 141}  # 원소별 신의 눈동자 + 진홍의 옥수

def get(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://act.hoyolab.com/'})
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (403, 404): return None   # 바다 등 타일이 없는 칸
            if i == tries - 1: raise
        except Exception:
            if i == tries - 1: raise
def api(path): return json.loads(get(API + path + ('&' if '?' in path else '?') + Q))['data']

info = api('info')['info']; v2 = info['detail_v2']
tree = api('label/tree')['tree']; points = api('point/list')['point_list']

# 1) 지도 타일
shutil.rmtree(f'{OUT}/tiles', ignore_errors=True)
W, H = v2['total_size']
jobs = []
for z in LEVELS:
    zz = z - LEVELS[0]
    os.makedirs(f'{OUT}/tiles/{zz}', exist_ok=True)
    n = 256 / 2 ** z  # 타일 하나가 덮는 지도 픽셀
    for y in range(int(-(-H // n))):
        for x in range(int(-(-W // n))):
            jobs.append((z, zz, x, y))
def do_tile(job):
    z, zz, x, y = job
    tag = ('N' if z < 0 else 'P') + str(abs(z))
    b = get(f"{TILE_BASE}{info['id']}/{v2['map_version']}/{x}_{y}_{tag}.webp")
    if not b: return 0
    im = Image.open(io.BytesIO(b)).convert('RGBA')
    if im.getextrema()[3][1] == 0: return 0
    im.save(f'{OUT}/tiles/{zz}/{x}_{y}.webp', 'WEBP', quality=75, method=6)
    return 1
with ThreadPoolExecutor(16) as ex: saved = sum(ex.map(do_tile, jobs))
print('tiles', saved, '/', len(jobs))

# 2) 표시할 라벨(워프·특산물·광물)과 아이콘
labels, routes = {}, {}
for top in tree:
    g = GROUPS.get(top['id'])
    if not g: continue
    for ch in top['children']:
        if g == 'warp' and ch['id'] not in WARP: continue
        if g == 'oculus' and ch['id'] not in OCULI: continue
        labels[ch['id']] = [ch['name'], g]
        rl = ch.get('recommend_route_list') or []
        if rl: routes[ch['id']] = rl[0]['url'].replace('lang=zh-cn', 'lang=ko-kr')
os.makedirs(f'{OUT}/icons', exist_ok=True)
def do_icon(lid):
    ch = next(c for t in tree for c in t['children'] if c['id'] == lid)
    try:
        Image.open(io.BytesIO(get(ch['icon']))).convert('RGBA').resize((48, 48), Image.LANCZOS).save(f'{OUT}/icons/{lid}.png', optimize=True)
    except Exception as e: print('icon fail', lid, e)
with ThreadPoolExecutor(8) as ex: list(ex.map(do_icon, labels))

# 3) 위치: 지도 픽셀 좌표(= 좌표 + origin). 지상(z_level 0)만
ox, oy = v2['origin']
pts = {}
for p in points:
    if p['label_id'] in labels and not p.get('z_level'):
        pts.setdefault(p['label_id'], []).append([round(p['x_pos'] + ox), round(p['y_pos'] + oy)])
data = {'size': v2['total_size'], 'zmax': len(LEVELS) - 1, 'labels': labels, 'points': pts, 'routes': routes, 'version': v2['map_version']}
with open(f'{OUT}/mapdata.js', 'w', encoding='utf8') as f:
    f.write('// HoYoLAB 공식 지도(테이와트) 위치 자료 — tools/build_map.py가 만듦. 좌표는 지도 픽셀(원본 크기)\n')
    f.write('const MAPDATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('labels', len(labels), 'points', sum(map(len, pts.values())))
