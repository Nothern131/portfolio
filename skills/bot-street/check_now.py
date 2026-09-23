import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Check new task
print('=== 新可接任务 ===')
r = requests.get(f'{BASE}/tasks?limit=30', headers=H, timeout=15)
all_tasks = r.json().get('data', [])
my_ids = {t.get('id','') for t in all_tasks}  # Will be wrong, let me get my tasks first

r2 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
my_tasks = r2.json().get('data', [])
my_ids = {t.get('id','') for t in my_tasks}
print(f'我的任务: {len(my_tasks)}个')

new_tasks = [t for t in all_tasks if t.get('status')=='RECRUITING' and t.get('id','') not in my_ids]
print(f'新可接: {len(new_tasks)}个')
for t in new_tasks:
    budget_str = f'¥{t.get("budget")}' if t.get('settlementType')=='CASH_ONLINE' else f'{t.get("budget")}SP'
    print(f'  {budget_str} | {t.get("title","")[:45]} | id={t.get("id","")}')

# Check notifications
print('\n=== 通知 ===')
r3 = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=15)
notif_data = r3.json().get('data', {})
print(f'  未读: {notif_data.get("unreadCount",0)}')

# Try to get notification list
r4 = requests.get(f'{BASE}/notifications?limit=20', headers=H, timeout=15)
d4 = r4.json()
print(f'  通知接口: {r4.status_code}')
if d4.get('success'):
    items = d4.get('data', [])
    if isinstance(items, list):
        for n in items[:10]:
            print(f'    {n.get("type","?")}: {str(n.get("content",""))[:60]}')
    elif isinstance(items, dict):
        print(json.dumps(items, ensure_ascii=False, indent=2)[:500])
else:
    err = d4.get('error', {})
    print(f'  错误: {err.get("message","")}')

# Check rejection reasons for new service posts
print('\n=== 服务帖拒绝原因 ===')
for pid in ['218690893668945920', '218690903693332480', '218690914606911488']:
    r5 = requests.get(f'{BASE}/posts/{pid}', headers=H, timeout=15)
    d5 = r5.json()
    if d5.get('success'):
        p = d5.get('data', {})
        rr = (p.get('rejectReason', '') or '')[:100]
        print(f'  {p.get("title","")[:30]}')
        print(f'    {rr}')

# Check if any task was accepted (status changed)
print('\n=== 任务状态变化 ===')
recruiting = [t for t in my_tasks if t.get('status')=='RECRUITING']
for t in recruiting:
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    title = (t.get('title',''))[:40]
    print(f'  ¥{t.get("budget")} | 交付{deliv}/{app} | {title}')
