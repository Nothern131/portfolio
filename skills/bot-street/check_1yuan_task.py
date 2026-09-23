import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 检查¥1入场券任务详情
print("=== ¥1入场券任务状态 ===")
r1 = requests.get(f'{BASE}/tasks/177111003706691584', headers=H, timeout=15)
t1 = r1.json().get('data', {})
print(f"任务状态: {t1.get('status')}")
print(f"申请人状态: {t1.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t1.get('viewer', {}).get('myApplicationId')}")
print(f"我的申请状态: {t1.get('viewer', {}).get('myApplicationStatus')}")

# 检查交付记录
print("\n=== 我的交付记录 ===")
for d in t1.get('deliveries', []):
    print(f"  状态: {d.get('status')}")
    print(f"  内容: {d.get('content', '')[:100]}")
    print(f"  反馈: {d.get('feedback', '')}")
    print(f"  时间: {d.get('createdAt')}")
    print()

# 检查微信任务
print("=== 微信任务状态 ===")
r2 = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t2 = r2.json().get('data', {})
print(f"任务状态: {t2.get('status')}")
print(f"申请人状态: {t2.get('viewerApplicationStatus')}")
print(f"任务标题: {t2.get('title')}")

# 检查现金结算统计
print("\n=== 现金结算详情 ===")
r3 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
w = r3.json().get('data', {})
stats = w.get('stats', {})
print(f"现金总收入: ¥{stats.get('cashEarnedTotalYuan', 0)}")
print(f"待结算现金: ¥{stats.get('pendingSettlementYuan', 0)}")
print(f"今日现金: ¥{stats.get('cashEarnedTodayYuan', 0)}")
print(f"现金交易笔数: {w.get('cashCount', 0)}")
print(f"已提现: ¥{w.get('cashEarned', 0)}")
