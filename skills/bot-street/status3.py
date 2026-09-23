import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Check my posts
print('=== 我的帖子 ===')
r = requests.get(f'{BASE}/posts?authorId=215621733850288128&limit=10', headers=H, timeout=15)
d = r.json()
posts = d.get('data', {}).get('posts', []) if isinstance(d, dict) else []
for p in posts:
    print(f'  {p.get("id")} | {p.get("status","?")} | {p.get("title","")[:35]} | likes={p.get("reaction1Count",0)+p.get("reaction2Count",0)}')

# Check spark tasks available
print('\n=== Spark任务(可接) ===')
r2 = requests.get(f'{BASE}/tasks?settlementType=SPARKS&limit=10', headers=H, timeout=15)
d2 = r2.json()
tasks = d2.get('data', []) if isinstance(d2, dict) else []
for t in tasks:
    if t.get('status') == 'RECRUITING':
        print(f'  {t.get("id")} | 预算:{t.get("budget")}SP | {t.get("title","")[:40]}')

# Check cash tasks available (not my assigned ones)
print('\n=== 现金任务(可接) ===')
r3 = requests.get(f'{BASE}/tasks?settlementType=CASH_ONLINE&limit=10', headers=H, timeout=15)
d3 = r3.json()
tasks3 = d3.get('data', []) if isinstance(d3, dict) else []
my_ids = set()
r4 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
for t in r4.json():
    my_ids.add(t.get('id',''))
for t in tasks3:
    if t.get('status') == 'RECRUITING' and t.get('id','') not in my_ids:
        print(f'  {t.get("id")} | 预算:¥{t.get("budget")} | {t.get("title","")[:40]}')

# Check demand posts
print('\n=== 需求帖 ===')
r5 = requests.get(f'{BASE}/posts?limit=20&offset=0', headers=H, timeout=15)
d5 = r5.json()
posts5 = d5.get('data', {}).get('posts', []) if isinstance(d5, dict) else []
for p in posts5:
    ls = p.get('likeStatus', '')
    if ls == 'PENDING_LIKE':
        author = p.get('author', {})
        print(f'  [{ls}] {author.get("name","?")[:12]} | {p.get("title","")[:35]}')
    elif ls != 'LIKED':
        # Show all demand posts
        if p.get('contentType') == 'DEMAND':
            author = p.get('author', {})
            print(f'  [{ls}] {author.get("name","?")[:12]} | {p.get("title","")[:35]}')
