import requests, json, time
from datetime import datetime

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

print("=" * 60)
print("BotStreet 收入变化分析报告")
print("=" * 60)

# 1. 当前钱包状态
print("\n[1] 当前钱包状态:")
try:
    r = requests.get(f'{BASE}/wallet', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        print(f"  火花(SP): {data.get('balance', 'N/A')}")
        print(f"  待结算金额: {data.get('pending_settlement', 'N/A')}")
        print(f"  现金收入: {data.get('cash_earned', 'N/A')}")
        print(f"  总收入: {data.get('total_income', 'N/A')}")
        print(f"  总支出: {data.get('total_expenses', 'N/A')}")
    else:
        print(f"  错误: {r.status_code} {r.text[:200]}")
except Exception as e:
    print(f"  错误: {e}")

# 2. 所有任务列表（包含已完成和已取消）
print("\n[2] 所有任务状态统计:")
try:
    r = requests.get(f'{BASE}/tasks?status=all', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        tasks = data.get('data', [])
        if not tasks:
            tasks = data.get('tasks', [])
        
        status_count = {}
        total_amount = 0
        for t in tasks:
            s = t.get('status', 'unknown')
            status_count[s] = status_count.get(s, 0) + 1
            try:
                amount = float(t.get('budget', 0) or t.get('price', 0) or 0)
                total_amount += amount
            except:
                pass
        
        print(f"  任务总数: {len(tasks)}")
        print(f"  状态分布:")
        for s, c in sorted(status_count.items()):
            print(f"    {s}: {c}")
        print(f"  总金额: {total_amount}")
        
        # 详细列出已完成和已取消的任务
        print(f"\n  已完成/已取消任务详情:")
        for t in tasks:
            s = t.get('status', '')
            if s in ['COMPLETED', 'CANCELLED', 'REJECTED', 'DISPUTED']:
                title = t.get('title', '')[:40]
                amount = t.get('budget', t.get('price', 0))
                print(f"    [{s}] {title} - ¥{amount}")
    else:
        print(f"  错误: {r.status_code} {r.text[:200]}")
except Exception as e:
    print(f"  错误: {e}")

# 3. 已取消/已退款任务
print("\n[3] 已取消/退款任务:")
for status in ['CANCELLED', 'REFUNDED', 'REJECTED']:
    try:
        r = requests.get(f'{BASE}/tasks?status={status}', headers=H, timeout=10)
        if r.status_code == 200:
            data = r.json()
            tasks = data.get('data', []) if isinstance(data, dict) else []
            if not tasks and isinstance(data, list):
                tasks = data
            print(f"  {status}: {len(tasks)} 个")
            for t in tasks[:5]:
                title = t.get('title', '')[:30]
                print(f"    - {title}")
    except Exception as e:
        print(f"  {status}: 错误 - {e}")

# 4. 交易记录
print("\n[4] 交易记录（最近10条）:")
try:
    r = requests.get(f'{BASE}/transactions?limit=10', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        transactions = data.get('data', [])
        if not transactions:
            transactions = data.get('transactions', [])
        
        print(f"  交易数: {len(transactions)}")
        for tx in transactions[:10]:
            amount = tx.get('amount', 'N/A')
            tx_type = tx.get('type', tx.get('transaction_type', 'unknown'))
            desc = tx.get('description', tx.get('note', ''))[:30]
            created = tx.get('created_at', tx.get('created_time', 'N/A'))
            print(f"    [{tx_type}] ¥{amount} - {desc} ({created})")
    else:
        print(f"  错误: {r.status_code} {r.text[:200]}")
except Exception as e:
    print(f"  错误: {e}")

# 5. 通知/消息
print("\n[5] 未读通知:")
try:
    r = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        print(f"  未读数: {data.get('count', data.get('unread_count', 'N/A'))}")
except Exception as e:
    print(f"  错误: {e}")

try:
    r = requests.get(f'{BASE}/notifications?limit=5', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        notifs = data.get('data', [])
        if not notifs:
            notifs = data.get('notifications', [])
        print(f"  最近通知:")
        for n in notifs[:5]:
            msg = n.get('message', n.get('content', ''))[:50]
            print(f"    - {msg}")
except Exception as e:
    print(f"  错误: {e}")

# 6. 提现记录
print("\n[6] 提现记录:")
try:
    r = requests.get(f'{BASE}/withdrawals?limit=5', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        withdrawals = data.get('data', [])
        if not withdrawals:
            withdrawals = data.get('withdrawals', [])
        print(f"  提现数: {len(withdrawals)}")
        for w in withdrawals[:5]:
            amount = w.get('amount', 'N/A')
            status = w.get('status', 'unknown')
            created = w.get('created_at', w.get('created_time', 'N/A'))
            print(f"    ¥{amount} [{status}] ({created})")
    else:
        print(f"  错误: {r.status_code} {r.text[:200]}")
except Exception as e:
    print(f"  错误: {e}")

# 7. 服务帖子状态
print("\n[7] 服务帖子状态:")
try:
    r = requests.get(f'{BASE}/posts?type=service', headers=H, timeout=10)
    if r.status_code == 200:
        data = r.json()
        posts = data.get('data', [])
        if not posts:
            posts = data.get('posts', [])
        print(f"  服务帖子数: {len(posts)}")
        for p in posts:
            title = p.get('title', '')[:30]
            status = p.get('status', 'unknown')
            print(f"    [{status}] {title}")
    else:
        print(f"  错误: {r.status_code} {r.text[:200]}")
except Exception as e:
    print(f"  错误: {e}")

print("\n" + "=" * 60)
print("分析完成")
print("=" * 60)
