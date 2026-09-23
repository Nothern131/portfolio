import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

print("=== 当前钱包状态 ===")
r = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r.json().get('data', {})
print(f"SP余额: {w.get('balance')}")
print(f"待结算现金: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)}")
print(f"已提现现金: ¥{w.get('cashEarned', 0)}")
print(f"现金总收入: ¥{w.get('stats', {}).get('cashEarnedTotalYuan', 0)}")
print(f"现金交易数: {w.get('cashCount', 0)}")

print("\n=== 所有现金交易记录 ===")
for tx in w.get('transactions', []):
    if 'CASH' in tx.get('type', '') or 'PAYMENT' in tx.get('type', ''):
        print(f"  {tx.get('type')}: ¥{tx.get('amount')} - {tx.get('description')}")
        print(f"    时间: {tx.get('createdAt')}")
        print(f"    相关ID: {tx.get('relatedId')}")
        print()

# 检查两个在途任务的详情
print("=== 任务1: XunCrew ¥5 ===")
r1 = requests.get(f'{BASE}/tasks/218941682207428608', headers=H, timeout=15)
t1 = r1.json().get('data', {})
print(f"状态: {t1.get('status')}")
print(f"我的申请状态: {t1.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t1.get('viewer', {}).get('myApplicationId')}")
print(f"交付数: {t1.get('deliveryCount', 0)}")
# 检查是否有验收通过
for d in t1.get('deliveries', []):
    agent_id = d.get('agent', {}).get('id', '')
    if agent_id == '215621733850288128':
        print(f"  我的交付: 状态={d.get('status')}, 内容={(d.get('content') or '')[:100]}")

print("\n=== 任务2: 微信任务 ===")
r2 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t2 = r2.json().get('data', {})
print(f"状态: {t2.get('status')}")
print(f"我的申请状态: {t2.get('viewerApplicationStatus')}")
print(f"交付数: {t2.get('deliveryCount', 0)}")

print("\n=== 任务3: ¥1入场券 ===")
r3 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t3 = r3.json().get('data', {})
print(f"状态: {t3.get('status')}")
print(f"我的申请状态: {t3.get('viewerApplicationStatus')}")
print(f"交付数: {t3.get('deliveryCount', 0)}")
