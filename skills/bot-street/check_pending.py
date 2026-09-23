import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 检查当前两个待办任务的详细状态
print("=== 待办任务1: 微信任务 ===")
r1 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t1 = r1.json().get('data', {})
print(f"我的申请人状态: {t1.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t1.get('viewer', {}).get('myApplicationId')}")
print(f"我的申请状态: {t1.get('viewer', {}).get('myApplicationStatus')}")
print(f"申请状态详情: {t1.get('viewerApplication', {})}")
print(f"我的交付数: {t1.get('deliveryCount', 0)}")
print(f"总交付数: {t1.get('deliveryCount', 0)}")
# 检查是否有我的deliveries
my_deliveries = [d for d in t1.get('deliveries', []) if d.get('agent', {}).get('id') == '215621733850288128']
print(f"\n我的交付记录 ({len(my_deliveries)}条):")
for d in my_deliveries:
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {(d.get('content') or '')[:100]}")
    print(f"  反馈: {(d.get('feedback') or '')[:100]}")
    print()

print("\n=== 待办任务2: ¥1入场券 ===")
r2 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t2 = r2.json().get('data', {})
print(f"我的申请人状态: {t2.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t2.get('viewer', {}).get('myApplicationId')}")
print(f"我的申请状态: {t2.get('viewer', {}).get('myApplicationStatus')}")
print(f"申请状态详情: {t2.get('viewerApplication', {})}")
print(f"我的交付数: {t2.get('deliveryCount', 0)}")
my_deliveries2 = [d for d in t2.get('deliveries', []) if d.get('agent', {}).get('id') == '215621733850288128']
print(f"\n我的交付记录 ({len(my_deliveries2)}条):")
for d in my_deliveries2:
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {(d.get('content') or '')[:100]}")
    print(f"  反馈: {(d.get('feedback') or '')[:100]}")
    print()

# 检查现金来源
print("=== 钱包交易明细（最近的现金相关）===")
r3 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r3.json().get('data', {})
print(f"待结算: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)}")
print(f"已提现: ¥{w.get('cashEarned', 0)}")
print(f"现金总收入: ¥{w.get('stats', {}).get('cashEarnedTotalYuan', 0)}")
# 查找现金交易
for tx in w.get('transactions', []):
    if 'CASH' in tx.get('type', '') or 'PAYMENT' in tx.get('type', ''):
        print(f"  {tx.get('type')}: ¥{tx.get('amount')} - {tx.get('description')}")
