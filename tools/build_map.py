# HoYoLAB 공식 지도(테이와트, map_id 2)의 지도 그림과 특산물·광물·워프 위치를 받아 이 사이트에 올림.
# 일부 네트워크에서 HoYoverse 이미지 서버가 막혀 공식 지도가 안 보이므로, 지도 조각을 GitHub Pages에서 직접 내보냄.
# GitHub Actions(.github/workflows/map.yml)에서 실행. 결과: map/tiles/{z}/{x}_{y}.webp, map/icons/{label}.png, map/mapdata.js
import io, json, os, shutil, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

API = 'https://sg-public-api-static.hoyolab.com/common/map_user/ys_obc/v1/map/'
Q = 'map_id=2&app_sn=ys_obc&lang=ko-kr'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'map'
TILE, ZMAX = 256, 5          # z5 = 원본의 1/2 크기, 줌 하나 내려갈 때마다 절반
GROUPS = {1: 'warp', 10: 'spec', 11: 'ore'}
WARP = {2, 3, 154}           # 일곱신상, 워프 포인트, 비경

def get(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.read()
        except Exception as e:
            if i == tries - 1: raise
def api(path): return json.loads(get(API + path + ('&' if '?' in path else '?') + Q))['data']

info = api('info')['info']; detail = json.loads(info['detail'])
tree = api('label/tree')['tree']; points = api('point/list')['point_list']

# 1) 지도 조각 → 타일 피라미드
slices = detail['slices']
shutil.rmtree(f'{OUT}/tiles', ignore_errors=True)
os.makedirs(f'{OUT}/tiles/{ZMAX}', exist_ok=True)
# 조각 그림의 실제 크기와 상관없이, 지도 전체(total_size)의 1/2 크기에 맞춰 늘이거나 줄임
SW = detail['total_size'][0] // len(slices[0]) // 2; SH = detail['total_size'][1] // len(slices) // 2
def do_slice(rc):
    r, c = rc
    im = Image.open(io.BytesIO(get(slices[r][c]['url']))).convert('RGBA')
    w, h = SW, SH
    if (r, c) == (0, 0): print('slice size', im.size, '→', (w, h))
    if im.size != (w, h): im = im.resize((w, h), Image.LANCZOS)
    per = w // TILE
    for ty in range((h + TILE - 1) // TILE):
        for tx in range(per):
            t = im.crop((tx * TILE, ty * TILE, tx * TILE + TILE, ty * TILE + TILE))
            if t.getextrema()[3][1] == 0: continue  # 완전히 투명한 조각은 저장 안 함
            t.save(f'{OUT}/tiles/{ZMAX}/{c * per + tx}_{r * per + ty}.webp', 'WEBP', quality=72, method=6)
    return per
with ThreadPoolExecutor(6) as ex:
    list(ex.map(do_slice, [(r, c) for r in range(len(slices)) for c in range(len(slices[0]))]))
W = detail['total_size'][0] // 2 // TILE; H = detail['total_size'][1] // 2 // TILE
for z in range(ZMAX - 1, -1, -1):
    os.makedirs(f'{OUT}/tiles/{z}', exist_ok=True)
    W, H = (W + 1) // 2, (H + 1) // 2
    for y in range(H):
        for x in range(W):
            canvas, any_ = Image.new('RGBA', (TILE * 2, TILE * 2)), False
            for dy in (0, 1):
                for dx in (0, 1):
                    f = f'{OUT}/tiles/{z + 1}/{2 * x + dx}_{2 * y + dy}.webp'
                    if os.path.exists(f): canvas.paste(Image.open(f), (dx * TILE, dy * TILE)); any_ = True
            if any_: canvas.resize((TILE, TILE), Image.LANCZOS).save(f'{OUT}/tiles/{z}/{x}_{y}.webp', 'WEBP', quality=72, method=6)

# 2) 표시할 라벨(워프·특산물·광물)과 아이콘
labels, routes = {}, {}
for top in tree:
    g = GROUPS.get(top['id'])
    if not g: continue
    for ch in top['children']:
        if g == 'warp' and ch['id'] not in WARP: continue
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

# 3) 위치: 지도 그림 기준 원본 픽셀 좌표(= 좌표 + origin + padding)
ox, oy = detail['origin'][0] + detail['padding'][0], detail['origin'][1] + detail['padding'][1]
pts = {}
for p in points:
    if p['label_id'] in labels:
        pts.setdefault(p['label_id'], []).append([round(p['x_pos'] + ox), round(p['y_pos'] + oy)])
data = {'size': detail['total_size'], 'zmax': ZMAX, 'labels': labels, 'points': pts, 'routes': routes, 'at': points and max(p['ctime'] for p in points)[:10]}
with open(f'{OUT}/mapdata.js', 'w', encoding='utf8') as f:
    f.write('// HoYoLAB 공식 지도(테이와트) 위치 자료 — tools/build_map.py가 만듦. 좌표는 지도 그림 원본 픽셀\n')
    f.write('const MAPDATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('labels', len(labels), 'points', sum(map(len, pts.values())))
