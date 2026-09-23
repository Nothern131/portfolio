import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

def api(method, path, data=None):
    url = BASE + path
    try:
        if method == 'GET':
            r = requests.get(url, headers=H, timeout=15)
            return r.json()
        elif method == 'POST':
            r = requests.post(url, headers=H, json=data or {}, timeout=15)
            return r.json()
        elif method == 'DELETE':
            r = requests.delete(url, headers=H, timeout=15)
            return r.json()
    except Exception as e:
        print(f'[错误] {path}: {e}')
    return None

# 1. 获取所有任务
r = api('GET', '/tasks/my?tab=assigned')
tasks = r.get('data', []) if isinstance(r, dict) else []

recruiting = [t for t in tasks if t.get('status') == 'RECRUITING']
ended = [t for t in tasks if t.get('status') == 'ENDED']
in_progress = [t for t in tasks if t.get('status') == 'IN_PROGRESS']

print(f"总计: {len(tasks)} 个")
print(f"  RECRUITING: {len(recruiting)} 个")
print(f"  ENDED: {len(ended)} 个")
print(f"  IN_PROGRESS: {len(in_progress)} 个")

# 2. 列出所有 RECRUITING 任务的详情
print("\n=== RECRUITING 任务 ===")
for t in recruiting:
    tid = t.get('id')
    title = (t.get('title') or '')[:50]
    budget = t.get('budget', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    sett = t.get('settlementType', '')
    print(f"  ID={tid}")
    print(f"    ¥{budget} | {sett} | 交付:{deliv}/{app}")
    print(f"    {title}")
    print()

# 3. 检查哪些任务是"我已接单但还没完成"的（有 application）
# 通过检查 applicationCount > 0 来区分
print("=== 已接任务分析 ===")
my_applied = []
for t in recruiting:
    app = t.get('applicationCount', 0)
    deliv = t.get('deliveryCount', 0)
    # 如果 deliveryCount >= applicationCount 说明已完成交付
    # 如果 applicationCount > 0 说明有人申请过
    if deliv >= app and app > 0:
        my_applied.append(t)
        print(f"  ✅ 已完成交付: ¥{t.get('budget')} | {t.get('title','')[:40]}")
    elif app > 0:
        print(f"  ⏳ 等待交付: ¥{t.get('budget')} | {t.get('title','')[:40]} | deliv:{deliv}/{app}")

# 4. 尝试"withdraw"（撤销申请）来释放名额
print("\n=== 尝试撤销任务申请 ===")
# 先找出哪些任务是我们申请过的
r2 = api('GET', '/tasks/my?tab=assigned')
tasks2 = r2.get('data', [])
for t in tasks2:
    tid = t.get('id')
    status = t.get('status', '')
    app_count = t.get('applicationCount', 0)

    # 对于已经 DELIVERED 的任务，尝试 withdraw 释放名额
    if status == 'RECRUITING' and app_count > 0:
        # 检查是否已经交付完成
        tdetail = api('GET', f'/tasks/{tid}')
        if tdetail:
            dt = tdetail.get('data', {})
            deliv_count = dt.get('deliveryCount', 0)
            if deliv_count >= app_count:
                print(f"  尝试撤回: ¥{t.get('budget')} | {dt.get('title','')[:40]} (已交付{deliv_count}次)")
                r_w = api('POST', f'/tasks/{tid}/withdraw')
                if r_w and r_w.get('success'):
                    print(f"    ✅ 撤回成功")
                else:
                    err = r_w.get('error', {}).get('message', 'unknown') if r_w else 'no response'
                    print(f"    ❌ 撤回失败: {err}")
                time.sleep(2)

import time
print("\n=== 当前钱包 ===")
r3 = api('GET', '/wallet')
w = r3.get('data', {})
print(f"  SP: {w.get('balance', 0)} | 待结算: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)} | 已提现: ¥{w.get('cashEarned', 0)}")

print("\n=== 新可接任务 ===")
r4 = api('GET', '/tasks', data=None, params={'settlementType': 'CASH_ONLINE', 'limit': 20})
all_tasks = r4.get('data', []) if isinstance(r4, dict) else []
my_ids = {str(t.get('id', '')) for t in tasks2}
new_cash = [t for t in all_tasks if t.get('status') == 'RECRUITING' and str(t.get('id', '')) not in my_ids]
print(f"  可接现金任务: {len(new_cash)} 个")
for t in new_cash[:5]:
    print(f"    ¥{t.get('budget')} | 申请:{t.get('applicationCount',0)} | {t.get('title','')[:40]}")
