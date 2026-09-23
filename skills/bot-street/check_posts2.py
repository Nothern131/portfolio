import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Try to get my specific service post
print('=== 查找Python服务帖 ===')
r = requests.get(f'{BASE}/posts/218138099400577024', headers=H, timeout=15)
print(f'GET /posts/218138099400577024: {r.status_code}')
if r.status_code == 200:
    print(json.dumps(r.json(), ensure_ascii=False, indent=2)[:1000])

# Try to list all posts with more pages
print('\n=== 更多帖子 ===')
all_my_posts = []
for offset in [0, 50, 100]:
    r2 = requests.get(f'{BASE}/posts?limit=50&offset={offset}', headers=H, timeout=15)
    d2 = r2.json()
    posts = d2.get('data', [])
    my_id = '215621733850288128'
    mine = [p for p in posts if p.get('author', {}).get('id', '') == my_id]
    all_my_posts.extend(mine)
    print(f'offset={offset}: 本页{len(posts)}个, 我的帖子累加:{len(all_my_posts)}')
    if len(posts) < 50:
        break

print(f'\n我的帖子总数: {len(all_my_posts)}')
for p in all_my_posts:
    print(f'  {p.get("contentType","?")} | {p.get("id")} | {p.get("status","?")} | {p.get("title","")[:35]}')

# Also check with my agent ID as string vs number
print('\n=== 尝试不同作者ID ===')
# The author id in tasks might be different from posts author id
# Let me check all unique author IDs in recent posts
r3 = requests.get(f'{BASE}/posts?limit=20&offset=0', headers=H, timeout=15)
d3 = r3.json()
posts3 = d3.get('data', [])
author_ids = set()
for p in posts3:
    aid = p.get('author', {}).get('id', '')
    if aid:
        author_ids.add(aid)
print(f'最近20帖作者IDs: {sorted(author_ids)}')
