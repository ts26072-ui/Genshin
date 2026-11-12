# HoYoLAB 전적 기록에서 내 캐릭터 전부(레벨·돌파·특성·무기·착용 성유물·최종 스탯)를 받아 account/hoyolab.json에 저장.
# GitHub Actions(.github/workflows/hoyolab.yml)에서 실행. 저장소 Secrets 두 개가 필요:
#   HOYOLAB_COOKIE  — HoYoLAB 쿠키 문자열(ltoken_v2=...; ltuid_v2=...; ltmid_v2=...)
#   GENSHIN_UID     — 원신 UID(9~10자리)
# 쿠키와 UID는 결과 파일에 넣지 않음. HoYoLAB 요청 서명은 genshin.py(pip install genshin)가 처리
import asyncio, datetime, json, os, re, sys
import genshin

OUT = sys.argv[1] if len(sys.argv) > 1 else 'account/hoyolab.json'
# 게임 속성 번호(FightProp) → 이 사이트의 스탯 이름(gear.js와 같은 표기)
PROP = {2: 'HP', 3: 'HP%', 5: '공격력', 6: '공격력%', 8: '방어력', 9: '방어력%', 20: '치명타 확률', 22: '치명타 피해',
        23: '원소 충전 효율', 26: '치유 보너스', 28: '원소 마스터리', 30: '물리 피해%', 40: '불 피해%', 41: '번개 피해%',
        42: '물 피해%', 43: '풀 피해%', 44: '바람 피해%', 45: '바위 피해%', 46: '얼음 피해%',
        2000: '최대 HP', 2001: '공격력', 2002: '방어력'}
SLOT = {1: 'flower', 2: 'plume', 3: 'sands', 4: 'goblet', 5: 'circlet'}


def foreign_guard(out_path):
    """Fork에서 원본 주인의 계정 파일이 그대로 남아 있으면(이 저장소가 받은 적 없는 파일) 빈 파일로 바꿔 주인 계정이 보이지 않게 함."""
    repo = os.environ.get('GITHUB_REPOSITORY', '')
    if not repo:
        return
    try:
        with open(out_path, encoding='utf8') as fh:
            old = json.load(fh)
    except (OSError, ValueError):
        return
    if old.get('repo') == repo or (not old.get('repo') and repo == 'ts26072-ui/Genshin'):
        return
    with open(out_path, 'w', encoding='utf8') as fh:
        json.dump({'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'repo': repo, 'none': True, 'chars': []},
                  fh, ensure_ascii=False, separators=(',', ':'))
    print('원본 저장소의 계정 파일이 남아 있어 비웠습니다. 내 UID를 Secret(GENSHIN_UID)에 넣으면 내 계정으로 채워집니다.')


def num(s):
    m = re.search(r'-?[\d.,]+', str(s or ''))
    return float(m.group().replace(',', '')) if m else 0.0


def prop_name(p, pmap):
    t = p.get('property_type')
    if t in PROP:
        return PROP[t]
    return (pmap.get(str(t)) or {}).get('name') or str(t)


def talents(skills):
    # 액티브 스킬(skill_type 1)은 평타·E·(일부 캐릭터의 대체 질주)·Q 순서 — 평타, E, 마지막(Q)을 씀
    act = [s for s in skills if s.get('skill_type') == 1]
    if len(act) < 3:
        return [s.get('level', 1) for s in act] + [1] * (3 - len(act))
    return [act[0].get('level', 1), act[1].get('level', 1), act[-1].get('level', 1)]


def char_row(c, pmap):
    base = c.get('base', {})
    w = c.get('weapon') or base.get('weapon') or {}
    stats = {}
    for group in ('base_properties', 'selected_properties', 'extra_properties', 'element_properties'):
        for p in c.get(group) or []:
            stats[prop_name(p, pmap)] = num(p.get('final'))
    arts = []
    for r in c.get('relics') or []:
        mp = r.get('main_property') or {}
        arts.append({
            'slot': SLOT.get(r.get('pos'), str(r.get('pos'))), 'set': (r.get('set') or {}).get('name', ''),
            'name': r.get('name', ''), 'level': r.get('level', 0), 'rarity': r.get('rarity', 5),
            'main': [prop_name(mp, pmap), num(mp.get('value'))],
            'subs': [[prop_name(s, pmap), num(s.get('value')), s.get('times', 0)] for s in r.get('sub_property_list') or []],
        })
    return {
        'hid': base.get('id'), 'name': base.get('name', ''), 'element': base.get('element', ''), 'rarity': base.get('rarity'),
        'level': base.get('level', 1), 'cons': base.get('actived_constellation_num', 0),
        'talents': talents(c.get('skills') or []),
        'weapon': {'name': w.get('name', ''), 'rarity': w.get('rarity'), 'level': w.get('level', 1),
                   'ref': w.get('affix_level', 1), 'asc': w.get('promote_level')},
        'arts': arts, 'stats': stats,
    }


def fix_cookie(raw):
    """손으로 옮겨 적다 생기는 흔한 실수를 고침: 이름 첫 글자를 소문자 l 대신 대문자 I·숫자 1로 적음(Itoken_v2), 대소문자, 따옴표·줄바꿈·'Cookie:' 머리말."""
    QUOTES = chr(34) + chr(39)
    raw = raw.strip().strip(QUOTES).replace(chr(10), ';')
    if raw.lower().startswith('cookie:'):
        raw = raw[7:]
    out = []
    for part in raw.split(';'):
        if '=' not in part:
            continue
        k, v = part.split('=', 1)
        k, v = k.strip(), v.strip().strip(QUOTES)
        m = re.fullmatch(r'[lLI1|](token|tuid|tmid)(_v2)?', k, re.I)
        if m:
            k = 'l' + m.group(1).lower() + (m.group(2) or '').lower()
        if k and v:
            out.append(f'{k}={v}')
    return '; '.join(out)


def cookie_hint(cookie, uid):
    """쿠키가 거절된 이유 추정. 쿠키 값은 절대 출력하지 않고 항목 이름만 봄."""
    names = {p.split('=', 1)[0].strip() for p in cookie.replace('\n', ';').split(';') if '=' in p}
    tips = []
    server = {'1': '중국', '2': '중국', '3': '중국', '5': '중국(B 서버)', '6': '미국', '7': '유럽', '8': '아시아', '9': 'TW·HK·MO'}.get(uid[:1] if len(uid) == 9 else uid[1:2] if len(uid) == 10 else '', '')
    if server.startswith('중국'):
        tips.append(f'UID가 {server} 서버라 HoYoLAB(글로벌) 쿠키로는 조회할 수 없습니다(미유셰 쿠키가 필요). HOYOLAB_COOKIE를 지우면 UID 쇼케이스로 받습니다.')
    need = ['ltoken_v2', 'ltuid_v2', 'ltmid_v2']
    miss = [n for n in need if n not in names]
    if miss:
        tips.append(f'쿠키에 {", ".join(miss)} 항목이 없습니다(들어 있는 항목: {", ".join(sorted(names)) or "없음"}). '
                    'ltoken_v2는 HttpOnly라 주소창 javascript:document.cookie 로는 안 보입니다 — PC 브라우저 개발자 도구 → Application(저장소) → Cookies → hoyolab.com 에서 복사하세요.')
    if any(c in cookie for c in '"\'') or cookie.strip().lower().startswith('cookie'):
        tips.append('값에 따옴표나 "Cookie:" 같은 글자가 섞여 있습니다. ltoken_v2=값; ltuid_v2=값; ltmid_v2=값 형식만 넣으세요.')
    if not tips:
        tips.append('항목은 다 있으니 만료된 쿠키일 가능성이 큽니다. hoyolab.com에서 로그아웃하면 쿠키가 바로 무효가 되니, 다시 로그인해 새로 복사한 뒤 로그아웃하지 마세요. '
                    'ltuid_v2가 그 UID의 HoYoverse 계정 번호와 같은지도 확인하세요(다른 계정 쿠키면 거절됨).')
    return ' '.join(tips)


def fallback_enka():
    """쿠키가 안 되면 UID 쇼케이스(Enka)로라도 받음 — 아무것도 안 들어오는 것보다 낫게."""
    print('쿠키 대신 UID 쇼케이스(Enka)로 받습니다.')
    import runpy
    runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'enka_sync.py'), run_name='__main__')


async def main():
    foreign_guard(OUT)
    cookie, uid = fix_cookie(os.environ.get('HOYOLAB_COOKIE', '')), os.environ.get('GENSHIN_UID', '').strip()
    if not cookie or not uid.isdigit():
        # 아직 설정 전이면 실패 알림이 쌓이지 않게 조용히 건너뜀
        print('Secrets HOYOLAB_COOKIE / GENSHIN_UID 가 비어 있어 건너뜀. 저장소 Settings → Secrets and variables → Actions 에 넣어 주세요.')
        return
    client = genshin.Client(cookie, lang='ko-kr', game=genshin.Game.GENSHIN)
    uid = int(uid)
    try:
        idx = await client._request_genshin_record('index', uid, payload={'avatar_list_type': 0})
        lst = await client._request_genshin_record('character/list', uid, method='POST')
        ids = [c['id'] for c in lst.get('list', [])]
        details = {'list': [], 'property_map': {}}
        for i in range(0, len(ids), 30):  # 한 번에 너무 많이 묻지 않도록 나눠서
            d = await client.get_genshin_detailed_characters(uid, characters=ids[i:i + 30], return_raw_data=True)
            details['list'] += d.get('list', [])
            details['property_map'].update(d.get('property_map', {}))
    except genshin.InvalidCookies:
        print('::warning::HoYoLAB 쿠키가 거절됐습니다. ' + cookie_hint(cookie, str(uid)))
        return fallback_enka()
    except genshin.DataNotPublic:
        print('::warning::HoYoLAB 전적 기록이 비공개입니다. HoYoLAB → 전적 → 설정에서 "전적 기록 공개"와 "캐릭터 상세 정보 공개"를 켜 주세요.')
        return fallback_enka()
    role = idx.get('role') or {}
    stats = idx.get('stats') or {}
    out = {
        'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'repo': os.environ.get('GITHUB_REPOSITORY', ''), 'nickname': role.get('nickname', ''), 'ar': role.get('level'),
        # 숫자 통계 전부(신의 눈동자 원소별 개수 *culus_number, 보물상자 종류별 개수 *_chest_number 등) + 나선 비경
        'summary': {k: v for k, v in stats.items() if isinstance(v, (int, float)) and not isinstance(v, bool) or k == 'spiral_abyss'},
        # 지역별 탐사도(%) — 지도에 보여 줌
        'explore': [{'name': w.get('name', ''), 'pct': round((w.get('exploration_percentage') or 0) / 10, 1)}
                    for w in idx.get('world_explorations') or [] if w.get('name')],
        'chars': [char_row(c, details['property_map']) for c in details['list']],
    }
    # 내용이 그대로면 파일을 건드리지 않음(갱신 시각만 바뀐 커밋이 쌓이지 않게)
    try:
        with open(OUT, encoding='utf8') as f:
            old = json.load(f)
        if {k: v for k, v in old.items() if k != 'updated'} == {k: v for k, v in out.items() if k != 'updated'}:
            print('no change'); return
    except (OSError, ValueError):
        pass
    os.makedirs(os.path.dirname(OUT) or '.', exist_ok=True)
    with open(OUT, 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    print('characters', len(out['chars']), 'artifacts', sum(len(c['arts']) for c in out['chars']))


asyncio.run(main())
