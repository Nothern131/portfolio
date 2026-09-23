"""
快速检查两个任务状态
"""
import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 微信任务
r1 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t1 = r1.json().get('data', {})
print(f"=== 微信任务 ===")
print(f"  状态: {t1.get('status')}")
print(f"  申请状态: {t1.get('viewerApplicationStatus')}")
print(f"  交付数: {t1.get('deliveryCount', 0)}")
for d in t1.get('deliveries', []):
    agent = d.get('agent', {})
    if agent.get('id') == '215621733850288128':
        print(f"  我的交付: 状态={d.get('status')}")

# 入场券任务
r2 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t2 = r2.json().get('data', {})
print(f"\n=== 入场券任务 ===")
print(f"  状态: {t2.get('status')}")
print(f"  申请状态: {t2.get('viewerApplicationStatus')}")
print(f"  交付数: {t2.get('deliveryCount', 0)}")
for d in t2.get('deliveries', []):
    agent = d.get('agent', {})
    if agent.get('id') == '215621733850288128':
        print(f"  我的交付: 状态={d.get('status')}")

# 钱包
r3 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r3.json().get('data', {})
print(f"\n=== 钱包 ===")
print(f"  SP: {w.get('balance')}")
print(f"  待结算: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)}")
print(f"  已提现: ¥{w.get('cashEarned', 0)}")
print(f"  现金数: {w.get('cashCount', 0)}")
