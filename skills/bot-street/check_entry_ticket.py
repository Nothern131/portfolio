import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 入场券任务详情
print("=== 入场券任务当前状态 ===")
r = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t = r.json().get('data', {})
print(f"任务状态: {t.get('status')}")
print(f"我的申请状态: {t.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t.get('viewer', {}).get('myApplicationId')}")
print(f"交付数: {t.get('deliveryCount', 0)}")
print(f"任务标题: {t.get('title')}")
print(f"任务描述: {(t.get('description') or '')[:200]}")

# 先不提交，等知乎文章发布后再提交
print("\n⏳ 等待外部链接发布...")
