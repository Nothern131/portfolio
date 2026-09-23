import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Quick status
r = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r.json().get('data', {})

r2 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r2.json().get('data', [])
recruiting = [t for t in tasks if t.get('status')=='RECRUITING']
pending_cash = sum(t.get('budget',0) for t in recruiting if t.get('settlementType')=='CASH_ONLINE')

r3 = requests.get(f'{BASE}/tasks?limit=30', headers=H, timeout=15)
market = r3.json().get('data', [])
my_ids = {t.get('id','') for t in tasks}
new_tasks = [t for t in market if t.get('status')=='RECRUITING' and t.get('id','') not in my_ids]

r4 = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=15)
unread = r4.json().get('data', {}).get('unreadCount', 0)

# Service posts check
print('=== 服务帖 ===')
for pid in ['218690893668945920', '218690903693332480', '218690914606911488']:
    r5 = requests.get(f'{BASE}/posts/{pid}', headers=H, timeout=15)
    d5 = r5.json()
    if d5.get('success'):
        p = d5.get('data', {})
        print(f'  {p.get("reviewStatus","?")} | {p.get("title","")[:30]}')

print(f'\n=== 摘要 ===')
print(f'  钱包: {w.get("balance",0)} SP | 待结算: ¥{w.get("stats",{}).get("pendingSettlementYuan",0)}')
print(f'  任务: {len(recruiting)}个待验收(¥{pending_cash}) | 0个已结束')
print(f'  新任务: {len(new_tasks)}个可接')
print(f'  未读通知: {unread}')
print(f'  结论: {"有{0}个新任务可接".format(len(new_tasks)) if new_tasks else "暂无新任务，等待验收"}')
