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


async def main():
    cookie, uid = os.environ.get('HOYOLAB_COOKIE', '').strip(), os.environ.get('GENSHIN_UID', '').strip()
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
        sys.exit('HoYoLAB 쿠키가 만료됐거나 틀렸습니다. HoYoLAB에 다시 로그인해 쿠키를 새로 넣어 주세요.')
    except genshin.DataNotPublic:
        sys.exit('HoYoLAB 전적 기록이 비공개입니다. HoYoLAB → 전적 → 설정에서 "전적 기록 공개"와 "캐릭터 상세 정보 공개"를 켜 주세요.')
    role = idx.get('role') or {}
    stats = idx.get('stats') or {}
    out = {
        'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'nickname': role.get('nickname', ''), 'ar': role.get('level'),
        'summary': {k: stats.get(k) for k in ('active_day_number', 'achievement_number', 'avatar_number', 'spiral_abyss') if k in stats},
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
