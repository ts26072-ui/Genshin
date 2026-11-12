# 쿠키 없이 UID만으로: Enka.Network 공개 API에서 원신 프로필의 '캐릭터 쇼케이스'(게임 안에서 고른 최대 12명)를 받아
# account/hoyolab.json과 같은 형식으로 저장. 레벨·돌파·특성·운명의 자리·무기·착용 성유물·최종 스탯이 들어 있음
# GitHub Actions(.github/workflows/hoyolab.yml)에서 HOYOLAB_COOKIE가 없을 때 실행. 필요한 Secret: GENSHIN_UID 하나
# 게임에서: 프로필 → 캐릭터 쇼케이스에 캐릭터를 올리고 '캐릭터 상세 정보 표시'를 켜야 상세 정보가 나옴
import datetime, json, os, sys, urllib.request

OUT = sys.argv[1] if len(sys.argv) > 1 else 'account/hoyolab.json'
STORE = 'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/gi/'
UA = {'User-Agent': 'genshin-party-appraiser (github.com/ts26072-ui/Genshin)'}
PROP = {'FIGHT_PROP_HP': 'HP', 'FIGHT_PROP_HP_PERCENT': 'HP%', 'FIGHT_PROP_ATTACK': '공격력', 'FIGHT_PROP_ATTACK_PERCENT': '공격력%',
        'FIGHT_PROP_DEFENSE': '방어력', 'FIGHT_PROP_DEFENSE_PERCENT': '방어력%', 'FIGHT_PROP_CRITICAL': '치명타 확률', 'FIGHT_PROP_CRITICAL_HURT': '치명타 피해',
        'FIGHT_PROP_CHARGE_EFFICIENCY': '원소 충전 효율', 'FIGHT_PROP_ELEMENT_MASTERY': '원소 마스터리', 'FIGHT_PROP_HEAL_ADD': '치유 보너스',
        'FIGHT_PROP_PHYSICAL_ADD_HURT': '물리 피해%', 'FIGHT_PROP_FIRE_ADD_HURT': '불 피해%', 'FIGHT_PROP_WATER_ADD_HURT': '물 피해%',
        'FIGHT_PROP_WIND_ADD_HURT': '바람 피해%', 'FIGHT_PROP_ELEC_ADD_HURT': '번개 피해%', 'FIGHT_PROP_GRASS_ADD_HURT': '풀 피해%',
        'FIGHT_PROP_ICE_ADD_HURT': '얼음 피해%', 'FIGHT_PROP_ROCK_ADD_HURT': '바위 피해%'}
# 최종 스탯(fightPropMap 번호) → 이름, 비율(0.62)이면 ×100
FIGHT = {'2000': ('최대 HP', 1), '2001': ('공격력', 1), '2002': ('방어력', 1), '20': ('치명타 확률', 100), '22': ('치명타 피해', 100),
         '23': ('원소 충전 효율', 100), '28': ('원소 마스터리', 1), '26': ('치유 보너스', 100), '30': ('물리 피해%', 100),
         '40': ('불 피해%', 100), '41': ('번개 피해%', 100), '42': ('물 피해%', 100), '43': ('풀 피해%', 100), '44': ('바람 피해%', 100),
         '45': ('바위 피해%', 100), '46': ('얼음 피해%', 100)}
SLOT = {'EQUIP_BRACER': 'flower', 'EQUIP_NECKLACE': 'plume', 'EQUIP_SHOES': 'sands', 'EQUIP_RING': 'goblet', 'EQUIP_DRESS': 'circlet'}
EL = {'Fire': 'pyro', 'Water': 'hydro', 'Wind': 'anemo', 'Electric': 'electro', 'Grass': 'dendro', 'Ice': 'cryo', 'Rock': 'geo'}


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


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return json.loads(r.read())


def main():
    foreign_guard(OUT)
    uid = os.environ.get('GENSHIN_UID', '').strip()
    if not uid.isdigit():
        print('Secret GENSHIN_UID 가 비어 있어 건너뜀. 저장소 Settings → Secrets and variables → Actions 에 원신 UID를 넣어 주세요.')
        return
    try:
        d = get(f'https://enka.network/api/uid/{uid}/')
    except urllib.error.HTTPError as e:
        sys.exit({400: 'UID 형식이 틀렸습니다.', 404: '그 UID의 플레이어를 찾지 못했습니다.', 424: 'Enka가 게임 점검 중입니다. 나중에 다시 실행하세요.',
                  429: 'Enka 요청이 너무 많습니다. 잠시 뒤 다시 실행하세요.'}.get(e.code, f'Enka 오류 {e.code}'))
    avatars, loc = get(STORE + 'avatars.json'), get(STORE + 'locs.json')['ko']
    # 성유물 세트 이름은 Enka 이름표에 없어서 도감 자료(dex/artifacts.js)의 세트 번호로 찾음
    sets = {}
    try:
        txt = open(os.path.join(os.path.dirname(OUT) or '.', '..', 'dex', 'artifacts.js'), encoding='utf8').read()
        for name, v in json.loads(txt[txt.index('{'):txt.rindex('}') + 1]).items():
            if len(v) > 3 and v[3]:
                sets[int(v[3])] = name
    except (OSError, ValueError) as e:
        print('dex/artifacts.js 를 읽지 못해 세트 이름이 빠질 수 있음:', e)
    pi = d.get('playerInfo', {})
    rows = []
    for a in d.get('avatarInfoList') or []:
        aid = str(a['avatarId'])
        key = f"{aid}-{a.get('skillDepotId')}" if f"{aid}-{a.get('skillDepotId')}" in avatars else aid
        av = avatars.get(key) or avatars.get(aid) or {}
        pm = a.get('propMap', {})
        order = av.get('SkillOrder') or list((a.get('skillLevelMap') or {}).keys())
        sl = a.get('skillLevelMap') or {}
        tal = [sl.get(str(s), 1) for s in order][:3] + [1] * max(0, 3 - len(order))
        row = {'hid': a['avatarId'], 'name': loc.get(str(av.get('NameTextMapHash')), ''), 'element': av.get('Element', ''),
               'level': int(pm.get('4001', {}).get('val', 1)), 'ascension': int(pm.get('1002', {}).get('val', 0)),
               'cons': len(a.get('talentIdList') or []), 'talents': tal, 'weapon': None, 'arts': [], 'stats': {}}
        if a['avatarId'] in (10000005, 10000007):
            row['traveler'] = EL.get(av.get('Element'), '')
        for k, v in (a.get('fightPropMap') or {}).items():
            if k in FIGHT:
                nm, mul = FIGHT[k]
                row['stats'][nm] = round(v * mul, 1)
        for e in a.get('equipList') or []:
            f = e.get('flat', {})
            if 'weapon' in e:
                w = e['weapon']
                row['weapon'] = {'name': loc.get(str(f.get('nameTextMapHash')), ''), 'rarity': f.get('rankLevel'), 'level': w.get('level', 1),
                                 'ref': (list((w.get('affixMap') or {0: 0}).values())[0] or 0) + 1, 'asc': w.get('promoteLevel', 0)}
            elif 'reliquary' in e:
                ms = f.get('reliquaryMainstat') or {}
                row['arts'].append({'slot': SLOT.get(f.get('equipType'), ''), 'set': sets.get(f.get('setId')) or loc.get(str(f.get('setNameTextMapHash')), ''),
                                    'level': max(0, e['reliquary'].get('level', 1) - 1), 'rarity': f.get('rankLevel', 5),
                                    'main': [PROP.get(ms.get('mainPropId'), ms.get('mainPropId', '')), ms.get('statValue', 0)],
                                    'subs': [[PROP.get(s['appendPropId'], s['appendPropId']), s['statValue']] for s in f.get('reliquarySubstats') or []]})
        rows.append(row)
    out = {'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'source': 'enka', 'repo': os.environ.get('GITHUB_REPOSITORY', ''),
           'nickname': pi.get('nickname', ''), 'ar': pi.get('level'), 'summary': {'achievement_number': pi.get('finishAchievementNum')},
           'chars': rows}
    if not rows:
        print('쇼케이스에 상세 정보가 공개된 캐릭터가 없습니다. 게임 프로필에서 캐릭터 쇼케이스에 캐릭터를 올리고 상세 정보 표시를 켜 주세요.')
    try:
        with open(OUT, encoding='utf8') as fh:
            old = json.load(fh)
        if {k: v for k, v in old.items() if k != 'updated'} == {k: v for k, v in out.items() if k != 'updated'}:
            print('no change'); return
    except (OSError, ValueError):
        pass
    os.makedirs(os.path.dirname(OUT) or '.', exist_ok=True)
    with open(OUT, 'w', encoding='utf8') as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))
    print('showcase characters', len(rows), 'artifacts', sum(len(r['arts']) for r in rows))


main()
