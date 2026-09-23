import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

def api(method, path, data=None, params=None):
    url = BASE + path
    try:
        if method == 'GET':
            r = requests.get(url, headers=H, params=params, timeout=15)
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

# 1. 获取所有我的任务
print("=== 获取我的任务列表 ===")
r = api('GET', '/tasks/my?tab=assigned')
tasks = r.get('data', []) if isinstance(r, dict) else []
print(f"共 {len(tasks)} 个任务")

ended_tasks = [t for t in tasks if t.get('status') == 'ENDED']
recruiting_tasks = [t for t in tasks if t.get('status') == 'RECRUITING']
in_progress = [t for t in tasks if t.get('status') == 'IN_PROGRESS']

print(f"\n  ENDED: {len(ended_tasks)} 个")
print(f"  RECRUITING: {len(recruiting_tasks)} 个")
print(f"  IN_PROGRESS: {len(in_progress)} 个")

print("\n=== ENDED 任务详情 ===")
for t in ended_tasks:
    tid = t.get('id')
    title = (t.get('title') or '')[:40]
    budget = t.get('budget', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    print(f"  ID={tid} | ¥{budget} | 交付:{deliv}/{app} | {title}")

print("\n=== RECRUITING 任务详情 ===")
for t in recruiting_tasks:
    tid = t.get('id')
    title = (t.get('title') or '')[:40]
    budget = t.get('budget', '?')
    deliv = t.get('deliveryCount', 0)
    app = t.get('applicationCount', 0)
    sett = t.get('settlementType', '')
    print(f"  ID={tid} | ¥{budget} | {sett} | 交付:{deliv}/{app} | {title}")

# 2. 尝试删除 ENDED 任务（释放名额）
print("\n=== 尝试删除 ENDED 任务 ===")
for t in ended_tasks:
    tid = t.get('id')
    title = (t.get('title') or '')[:30]
    r = api('DELETE', f'/tasks/{tid}')
    if r and r.get('success'):
        print(f"  ✅ 已删除: {title}")
    else:
        err = r.get('error', {}).get('message', 'unknown') if r else 'no response'
        print(f"  ❌ 删除失败: {title} | {err}")

# 3. 检查最新可用现金任务
print("\n=== 最新可用现金任务 ===")
r = api('GET', '/tasks', params={'settlementType': 'CASH_ONLINE', 'limit': 20})
all_tasks = r.get('data', []) if isinstance(r, dict) else []
my_ids = {str(t.get('id', '')) for t in tasks}
new_cash = [t for t in all_tasks if t.get('status') == 'RECRUITING' and str(t.get('id', '')) not in my_ids]
print(f"  可接现金任务: {len(new_cash)} 个")
for t in new_cash[:10]:
    tid = t.get('id')
    title = (t.get('title') or '')[:40]
    budget = t.get('budget', '?')
    apps = t.get('applicationCount', 0)
    print(f"    ¥{budget} | 申请:{apps} | {title}")

print("\n=== 最新可用Spark任务 ===")
r = api('GET', '/tasks', data=None, params={'settlementType': 'SPARKS', 'limit': 20})
sparks = r.get('data', []) if isinstance(r, dict) else []
new_sparks = [t for t in sparks if t.get('status') == 'RECRUITING' and str(t.get('id', '')) not in my_ids]
print(f"  可接Spark任务: {len(new_sparks)} 个")
for t in new_sparks[:10]:
    tid = t.get('id')
    title = (t.get('title') or '')[:40]
    budget = t.get('budget', '?')
    apps = t.get('applicationCount', 0)
    print(f"    {budget}SP | 申请:{apps} | {title}")

# 4. 钱包
print("\n=== 当前钱包 ===")
r = api('GET', '/wallet')
w = r.get('data', {})
print(f"  SP: {w.get('balance', 0)} | 待结算: ¥{w.get('stats', {}).get('pendingSettlementYuan', 0)} | 已提现: ¥{w.get('cashEarned', 0)}")
