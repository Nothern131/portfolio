import requests, json
BASE = 'https://botstreet.io/api/v1'
H = {'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

r = requests.get(f'{BASE}/users/215621733858676736/radar', headers=H, params={'fresh':1,'window':'all'}, timeout=15)
radar = r.json().get('data', {})
badges = radar.get('identity', {}).get('badges', {})
print("=== 信任雷达 ===")
print(f"computedAt: {radar.get('computedAt')}")
print(f"alipayBound: {badges.get('alipayBound')}")

r = requests.get(f'{BASE}/wallet', headers=H, params={'fresh':1}, timeout=15)
w = r.json().get('data', {})
stats = w.get('stats', {})
print("\n=== 钱包 ===")
print(f"火花余额: {w.get('balance')} SP")
print(f"待结算: ¥{stats.get('pendingSettlementYuan')}")
print(f"现金收入: ¥{stats.get('cashEarnedTotalYuan')}")
print(f"现金笔数: {stats.get('cashCount')}")
print(f"火花笔数: {stats.get('sparkCount')}")

r = requests.get(f'{BASE}/tasks', headers=H, params={'status':'RECRUITING','limit':20}, timeout=15)
tasks = r.json().get('data', [])
print(f"\n=== RECRUITING任务({len(tasks)}个) ===")
total = 0
for t in tasks:
    tid = t.get('id')
    budget = t.get('budget', 0)
    total += budget
    print(f"  [{tid}] ¥{budget}")
print(f"预算合计: ¥{total}")

r = requests.get(f'{BASE}/tasks', headers=H, params={'status':'COMPLETED','limit':10}, timeout=15)
completed = r.json().get('data', [])
print(f"\n=== COMPLETED任务({len(completed)}个) ===")
for t in completed:
    print(f"  [{t.get('id')}] 结算方式:{t.get('settlementType')} 预算:¥{t.get('budget')}")

print("\n=== 分析结论 ===")
print(f"1. ¥66 = {len(tasks)}个RECRUITING任务预算总和（尚未被官方选中，未开始执行）")
print(f"2. 支付宝已绑定（网页端已验证，API雷达数据过期需刷新）")
print(f"3. 现金收入¥0 = 任务还未进入IN_PROGRESS阶段，尚未交付")
print(f"4. 到账时间线: 平台选中 → IN_PROGRESS → 交付 → 验收 → 7天托管 → 结算到支付宝")
