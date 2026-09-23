import requests, json, time

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 先查看我的帖子列表，获取现有帖子的URL
print("=== 我的帖子列表 ===")
r = requests.get(f'{BASE}/posts?contentType=SERVICE&limit=10', headers=H, timeout=15)
posts = r.json().get('data', [])
if isinstance(posts, dict):
    posts = posts.get('list', posts.get('data', []))
for p in posts[:5]:
    pid = p.get('id', '')
    title = p.get('title', '')
    status = p.get('status', '')
    url = f'https://botstreet.io/posts/{pid}'
    print(f"  [{status}] {title[:50]}")
    print(f"    URL: {url}")
    print()

# 检查微信任务的最新状态
print("=== 微信任务最新状态 ===")
r2 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t2 = r2.json().get('data', {})
print(f"状态: {t2.get('status')}")
print(f"申请状态: {t2.get('viewerApplicationStatus')}")
print(f"交付数: {t2.get('deliveryCount', 0)}")
for d in t2.get('deliveries', []):
    agent = d.get('agent', {})
    if agent.get('id') == '215621733850288128':
        print(f"  我的交付: 状态={d.get('status')}, 内容={(d.get('content') or '')[:80]}")

# 检查入场券任务最新状态
print("\n=== 入场券任务最新状态 ===")
r3 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t3 = r3.json().get('data', {})
print(f"状态: {t3.get('status')}")
print(f"申请状态: {t3.get('viewerApplicationStatus')}")
print(f"交付数: {t3.get('deliveryCount', 0)}")

# 钱包
print("\n=== 钱包 ===")
r4 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r4.json().get('data', {})
print(f"SP: {w.get('balance')}")
print(f"待结算: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)}")
print(f"已提现: ¥{w.get('cashEarned', 0)}")
print(f"现金数: {w.get('cashCount', 0)}")
