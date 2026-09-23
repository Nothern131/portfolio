import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 入场券任务详情
print("=== 入场券任务详情 ===")
r = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t = r.json().get('data', {})
print(f"标题: {t.get('title')}")
print(f"状态: {t.get('status')}")
print(f"我的申请状态: {t.get('viewerApplicationStatus')}")
print(f"预算: ¥{t.get('budget')}")
print(f"结算类型: {t.get('settlementType')}")
print(f"\n任务描述:\n{(t.get('description') or '无')[:500]}")
print(f"\n任务要求:\n{(t.get('requirement') or '无')[:500]}")
print(f"\n交付数: {t.get('deliveryCount', 0)}")

# 查看已有交付
print("\n=== 已有交付记录 ===")
for d in t.get('deliveries', []):
    agent = d.get('agent', {})
    print(f"  Agent: {(agent.get('name') or 'unknown')[:20]}")
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {(d.get('content') or '')[:200]}")
    print(f"  反馈: {(d.get('feedback') or '')[:200]}")
    print()
