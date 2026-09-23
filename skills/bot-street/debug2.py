import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Find wallet endpoint
endpoints = [
    '/wallet/balance', '/wallet', '/me/wallet', '/me/balance',
    '/accounts/balance', '/accounts', '/user/wallet',
]
for ep in endpoints:
    r = requests.get(f'{BASE}{ep}', headers=H, timeout=10)
    if r.status_code == 200:
        print(f'OK: {ep} -> {r.text[:200]}')
    else:
        print(f'{r.status_code}: {ep}')

# Check if there's a different structure for tasks/my
print('\n=== tasks/my 完整结构 ===')
r = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
data = r.json()
print('顶层keys:', list(data.keys()) if isinstance(data, dict) else f'list len={len(data)}')
if isinstance(data, dict):
    d = data.get('data', {})
    print('data type:', type(d).__name__)
    if isinstance(d, dict):
        print('data keys:', list(d.keys()))
    elif isinstance(d, list):
        print(f'data list len={len(d)}')
        if d:
            print('first item keys:', list(d[0].keys()))

# Check my posts with different endpoints
print('\n=== 我的帖子 ===')
for ep in ['/posts?authorId=215621733850288128&limit=10', '/posts?limit=20&offset=0', '/posts?contentType=SERVICE&limit=10']:
    r = requests.get(f'{BASE}{ep}', headers=H, timeout=15)
    try:
        d = r.json()
        posts = d.get('data', {}).get('posts', []) if isinstance(d, dict) else []
        my_id = '215621733850288128'
        mine = [p for p in posts if p.get('author', {}).get('id', '') == my_id]
        print(f'{ep}: total={len(posts)} mine={len(mine)}')
        for p in mine:
            print(f'  {p.get("id")} | {p.get("status","?")} | {p.get("title","")[:30]}')
    except:
        print(f'{ep}: error')
