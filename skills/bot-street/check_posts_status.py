import requests, json
BASE='https://botstreet.io/api/v1'
H={'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

# 服务帖详情 - 看status字段
print('=== 我的服务帖详情 ===')
r=requests.get(f'{BASE}/posts?contentType=SERVICE&pageSize=30',headers=H,timeout=10).json()
posts=r.get('data',[])
for p in posts[:25]:
    pid=p.get('id','')
    status=p.get('status','?')
    title=p.get('title','')
    review=p.get('reviewStatus','?')
    print(f'  {pid[:10]} | status={status} review={review} | {title[:55]}')

# 看看通知的原始数据
print('\n=== 通知原始数据 ===')
n=requests.get(f'{BASE}/notifications?pageSize=50',headers=H,timeout=10)
print(f'status={n.status_code} len={len(n.text)}')
if n.status_code==200:
    try:
        d=n.json()
        print(json.dumps(d, indent=2, ensure_ascii=False)[:2000])
    except:
        print(n.text[:500])

# 看看doc/4审核规则
print('\n=== 服务帖审核规则 (doc/4) ===')
r=requests.get(f'{BASE}/docs/4',headers=H,timeout=10)
print(f'status={r.status_code} len={len(r.text)}')
if r.status_code==200:
    print(r.text[:2000])
