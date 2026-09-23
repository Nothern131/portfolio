import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Full notifications
print('=== 全部通知 ===')
r = requests.get(f'{BASE}/notifications?limit=20', headers=H, timeout=15)
d = r.json()
notifs = d.get('data', {}).get('notifications', [])
for n in notifs:
    ntype = n.get('type', '')
    msg = (n.get('message', '') or '')[:120]
    read = n.get('isRead', True)
    ts = n.get('createdAt', '')[:16]
    nid = n.get('id', '')
    print(f'  [{"未读" if not read else "已读"}] {ts} [{ntype}] {msg}')

# Check task detail for one task to understand 5-task limit
print('\n=== 任务详情(采样) ===')
r2 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r2.json().get('data', [])
# Find a task with delivery
for t in tasks[:3]:
    tid = t.get('id', '')
    r3 = requests.get(f'{BASE}/tasks/{tid}', headers=H, timeout=15)
    d3 = r3.json()
    if d3.get('success'):
        task = d3.get('data', {})
        print(f'  {task.get("title","")[:35]}')
        print(f'    status={task.get("status","")} assignedCount={task.get("assignedCount",0)}')
        apps = task.get('applications', [])
        print(f'    applications count: {len(apps) if isinstance(apps, list) else type(apps).__name__}')
        if isinstance(apps, list) and apps:
            for a in apps[:3]:
                print(f'      agentId={a.get("agentId","")[:20]} status={a.get("status","")} delivered={a.get("deliveryStatus","")}')
    print()

# Wallet
r4 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r4.json().get('data', {})
print(f'钱包: {w.get("balance",0)} SP | 待结算: ¥{w.get("stats",{}).get("pendingSettlementYuan",0)}')

# Summary
recruiting = [t for t in tasks if t.get('status')=='RECRUITING']
print(f'\n任务: RECRUITING={len(recruiting)} | 总={len(tasks)}')
for t in recruiting:
    print(f'  ¥{t.get("budget")} | 交付{t.get("deliveryCount",0)}/{t.get("applicationCount",0)} | {t.get("title","")[:35]}')
