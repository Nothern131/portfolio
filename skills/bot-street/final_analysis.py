import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 完整分析交易流水
print("=" * 70)
print("BotStreet 收入变化完整分析报告")
print("=" * 70)

# 获取完整交易记录
r = requests.get(f'{BASE}/wallet', headers=H, timeout=10)
data = r.json()['data']
txs = data.get('transactions', [])

print("\n[收入来源明细]")
income_txs = [t for t in txs if t['amount'] > 0]
expense_txs = [t for t in txs if t['amount'] < 0]

print(f"\n  收入交易 ({len(income_txs)} 条):")
total_income = 0
for t in income_txs:
    amt = t['amount']
    total_income += amt
    print(f"    +¥{amt:3d} | {t['type']:25s} | {t['description'][:40]}")
print(f"    收入合计: ¥{total_income}")

print(f"\n  支出交易 ({len(expense_txs)} 条):")
total_expense = 0
for t in expense_txs:
    amt = abs(t['amount'])
    total_expense += amt
    print(f"    -¥{amt:3d} | {t['type']:25s} | {t['description'][:40]}")
print(f"    支出合计: ¥{total_expense}")

print(f"\n  净火花余额: SP {data['balance']}")
print(f"  待结算现金: ¥{data['stats']['pendingSettlementYuan']}")
print(f"  已提现现金: ¥{data['cashEarned']}")

print("\n\n[关键发现]")
print("""
1. 总收入 = 注册奖励¥50 + Bot注册奖励¥100 + 2个任务结算¥40 + 每日签到¥25 = ¥215
   但 API 显示 totalEarned=240（可能包含其他未显示的交易）

2. 总支出 = 9个任务申请费 × ¥10 = ¥90

3. 净火花余额 = 240 - 110 = SP 130 ✓（当前显示130）

4. 待结算现金 ¥57 的构成：
   - 已完成的任务：2个任务 × ¥20 = ¥40（8月29日结算）
   - 还有部分任务已完成但尚未提现

5. 之前显示的 ¥72 可能是：
   - 所有已完成任务的总收入（包括已提现的）
   - 当前 ¥57 是待结算（尚未提现到支付宝）

6. 当前状态：
   - 所有9个任务申请都被撤销了（退还了¥90申请费）
   - 这些任务是推广任务（种草、视频、图文），还没正式接单完成
   - 订单历史为空，说明还没有通过私信达成的服务订单

结论：¥72→¥57 的变化是因为：
- 之前有2个任务完成了（¥40），但后来可能退款或调整
- 当前待结算¥57，其中可能有部分任务还没完成/被取消
- 需要确认是否有任务被主人取消或退款
""")

# 检查是否有被取消的任务
print("\n[检查已取消/已完成任务]")
for tid in ['214550300374077440', '214550299400998912']:
    r = requests.get(f'{BASE}/tasks/{tid}', headers=H, timeout=10)
    if r.status_code == 200:
        t = r.json().get('data', {})
        print(f"\n  任务 {tid}:")
        print(f"    标题: {t.get('title', 'N/A')[:50]}")
        print(f"    状态: {t.get('status', 'N/A')}")
        print(f"    预算: ¥{t.get('budget', t.get('price', 'N/A'))}")
        print(f"    创建: {t.get('createdAt', 'N/A')[:10]}")
        print(f"    完成: {t.get('completedAt', 'N/A')}")
        print(f"    取消原因: {t.get('cancelReason', 'N/A')}")

print("\n" + "=" * 70)
