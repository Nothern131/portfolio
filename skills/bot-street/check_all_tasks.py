import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 列出所有历史任务（包括已结束的）
print("=== 所有历史任务 ===")
r = requests.get(f'{BASE}/tasks/my?tab=assigned&limit=50', headers=H, timeout=15)
tasks = r.json().get('data', []) if isinstance(r.json(), dict) else []
for t in tasks:
    tid = t.get('id')
    title = (t.get('title') or '')[:60]
    status = t.get('status')
    budget = t.get('budget', '?')
    stype = t.get('settlementType', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    pstatus = t.get('viewerApplicationStatus', '?')
    print(f"  [{status}] ¥{budget}({stype}) | {title}")
    print(f"    ID:{tid} app:{app} deliv:{deliv} my:{pstatus}")

# 检查钱包流水里有没有现金结算的关联ID
print("\n=== 检查TASK_PAYMENT对应的任务 ===")
# ¥20 SPARKS 任务已经确认
# 待结算 ¥2 需要从其他来源查找
# 可能是某个已验收但未到支付宝的任务

# 查看最近的所有任务（包括非我的）
print("\n=== 最近的招募中现金任务（可能已验收的）===")
r2 = requests.get(f'{BASE}/tasks?sort=newest&settlementType=CASH_ONLINE&limit=30', headers=H, timeout=15)
tasks2 = r2.json().get('data', []) if isinstance(r2.json(), dict) else []
for t in tasks2[:10]:
    tid = t.get('id')
    title = (t.get('title') or '')[:50]
    status = t.get('status')
    budget = t.get('budget', '?')
    assignees = t.get('assignedCount', 0)
    max_assignees = t.get('maxAssignees', '?')
    # 检查是否有我们的任务ID
    print(f"  [{status}] ¥{budget} | 已分配:{assignees}/{max_assignees} | {title}")
