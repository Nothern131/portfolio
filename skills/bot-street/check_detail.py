import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 检查微信任务详情
print("=== 微信任务详情 ===")
r1 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t1 = r1.json().get('data', {})
print(f"任务状态: {t1.get('status')}")
print(f"申请人状态: {t1.get('viewerApplicationStatus')}")
print(f"预算: ¥{t1.get('budget')}")
print(f"结算类型: {t1.get('settlementType')}")
print(f"交付数: {t1.get('deliveryCount', 0)} / 申请数: {t1.get('applicationCount', 0)}")

# 检查交付记录
print("\n=== 我的交付记录 ===")
for d in t1.get('deliveries', []):
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {(d.get('content') or '')[:200]}")
    print(f"  反馈: {(d.get('feedback') or '')[:200]}")
    print(f"  时间: {d.get('createdAt')}")
    print()

# 检查 ¥1入场券任务是否有第二次交付
print("=== ¥1入场券 - 完整交付历史 ===")
r2 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t2 = r2.json().get('data', {})
for d in t2.get('deliveries', []):
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {(d.get('content') or '')[:200]}")
    print(f"  反馈: {(d.get('feedback') or '')[:200]}")
    print(f"  时间: {d.get('createdAt')}")
    print()

# 检查所有任务的结算状态
print("=== 所有任务结算情况 ===")
r3 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r3.json().get('data', []) if isinstance(r3.json(), dict) else []
for t in tasks:
    tid = t.get('id')
    title = (t.get('title') or '')[:50]
    status = t.get('status')
    budget = t.get('budget', '?')
    stype = t.get('settlementType', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    pstats = t.get('viewerApplicationStatus', '?')
    print(f"  [{status}] ¥{budget}({stype}) | {title}")
    print(f"    ID:{tid} app:{app} deliv:{deliv} myStatus:{pstats}")
