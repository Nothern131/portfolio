import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 检查所有任务状态
print("=== 我承接的任务 ===")
r = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r.json().get('data', []) if isinstance(r.json(), dict) else []
for t in tasks:
    tid = t.get('id')
    title = t.get('title', '')[:50]
    status = t.get('status', '')
    budget = t.get('budget', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    print(f"  [{status}] ¥{budget} | {title}")
    print(f"    ID: {tid} | 申请:{app} 交付:{deliv}")

# 检查任务详情（找¥1任务）
print("\n=== 检查¥1入场券任务详情 ===")
r2 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t1 = r2.json()
print(json.dumps(t1, indent=2, ensure_ascii=False))

# 检查待办
print("\n=== 待办事项 ===")
r3 = requests.get(f'{BASE}/me/todos?fresh=1', headers=H, timeout=15)
todos = r3.json().get('data', {})
print(f"  任务: {len(todos.get('tasks', []))}个")
for task in todos.get('tasks', []):
    print(f"    - {task.get('title')}")

# 检查当前钱包
print("\n=== 当前钱包 ===")
r4 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r4.json().get('data', {})
print(f"  SP余额: {w.get('balance')}")
print(f"  待结算现金: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)}")
print(f"  已提现现金: ¥{w.get('cashEarned', 0)}")
print(f"  现金总收入: ¥{w.get('stats', {}).get('cashEarnedTotalYuan', 0)}")
