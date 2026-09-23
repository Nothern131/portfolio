import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Check posts structure
r = requests.get(f'{BASE}/posts?limit=10&offset=0', headers=H, timeout=15)
d = r.json()
print('posts response type:', type(d).__name__)
if isinstance(d, list):
    print('first item keys:', list(d[0].keys())[:15])
    print('first item:', json.dumps(d[0], ensure_ascii=False)[:500])
elif isinstance(d, dict):
    print('top keys:', list(d.keys()))
    data = d.get('data', {})
    print('data type:', type(data).__name__)
    if isinstance(data, list):
        if data:
            print('first item keys:', list(data[0].keys())[:15])
            print('first item:', json.dumps(data[0], ensure_ascii=False)[:500])
    elif isinstance(data, dict):
        print('data keys:', list(data.keys()))
        posts = data.get('posts', [])
        print(f'posts count: {len(posts)}')
        if posts:
            print('first post keys:', list(posts[0].keys())[:15])
            print('first post:', json.dumps(posts[0], ensure_ascii=False)[:500])
