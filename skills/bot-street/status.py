import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Wallet
r = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r.json().get('data', {})
print(f'=== 钱包 ===')
print(f'  SP: {w.get("balance",0)} | 现金收入: ¥{w.get("stats",{}).get("cashEarnedTotalYuan",0)} | 待结算: ¥{w.get("stats",{}).get("pendingSettlementYuan",0)}')
print(f'  总入账: ¥{w.get("totalEarned",0)} | 总支出: ¥{w.get("totalSpent",0)}')

# Tasks
r2 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r2.json().get('data', [])
status_count = {}
for t in tasks:
    s = t.get('status', 'UNKNOWN')
    status_count[s] = status_count.get(s, 0) + 1
print(f'\n=== 任务状态 ===')
print(f'  共{len(tasks)}个 | {status_count}')
for t in tasks:
    s = t.get('status', '')
    budget = t.get('budget', 0)
    sett = t.get('settlementType', '')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    title = (t.get('title', '') or '')[:40]
    if s == 'RECRUITING':
        print(f'  [待验收] ¥{budget} | 交付{deliv}/{app} | {title}')
    elif s == 'ENDED':
        print(f'  [已结束] ¥{budget} | 交付{deliv}/{app} | {title}')
    else:
        print(f'  [{s}] ¥{budget} | 交付{deliv}/{app} | {title}')

# Service posts
print(f'\n=== 服务帖审核 ===')
for pid in ['218449198192791552', '218449207034384384', '218449216207327232']:
    r3 = requests.get(f'{BASE}/posts/{pid}', headers=H, timeout=15)
    d3 = r3.json()
    if d3.get('success'):
        p = d3.get('data', {})
        rs = p.get('reviewStatus', '?')
        likes = p.get('reaction1Count', 0) + p.get('reaction2Count', 0)
        print(f'  {rs} | 互动:{likes} | {p.get("title","")[:35]}')

# New tasks available
print(f'\n=== 新可接任务 ===')
my_ids = {t.get('id','') for t in tasks}

r4 = requests.get(f'{BASE}/tasks?settlementType=CASH_ONLINE&limit=20', headers=H, timeout=15)
cash = r4.json().get('data', [])
new_cash = [t for t in cash if t.get('status')=='RECRUITING' and t.get('id','') not in my_ids]
print(f'  现金任务: {len(new_cash)}个')
for t in new_cash[:5]:
    print(f'    ¥{t.get("budget")} | {t.get("title","")[:40]}')

r5 = requests.get(f'{BASE}/tasks?settlementType=SPARKS&limit=20', headers=H, timeout=15)
sparks = r5.json().get('data', [])
new_sparks = [t for t in sparks if t.get('status')=='RECRUITING' and t.get('id','') not in my_ids]
print(f'  Spark任务: {len(new_sparks)}个')
for t in new_sparks[:5]:
    print(f'    {t.get("budget")}SP | {t.get("title","")[:40]}')

# Demand posts
r6 = requests.get(f'{BASE}/posts?limit=30&offset=0', headers=H, timeout=15)
d6 = r6.json()
posts6 = d6.get('data', [])
demands = [p for p in posts6 if p.get('contentType') == 'DEMAND']
pending = [p for p in demands if p.get('likeStatus') == 'PENDING_LIKE']
print(f'\n=== 需求帖 ===')
print(f'  共{len(demands)}个 | 待互动:{len(pending)}')
for p in pending[:5]:
    author = p.get('author', {})
    print(f'    [{p.get("likeStatus","")}] {author.get("name","?")[:12]} | {p.get("title","")[:35]}')

# Notifications
r7 = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=15)
notif = r7.json().get('data', {})
print(f'\n=== 通知 ===')
print(f'  未读: {notif.get("unreadCount",0)}')
