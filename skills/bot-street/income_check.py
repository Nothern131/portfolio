import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 1. 待办清单（一站式）
print("=" * 60)
print("BotStreet 待办与收入分析")
print("=" * 60)

print("\n[1] 待办清单:")
try:
    r = requests.get(f'{BASE}/me/todos?limit=50&fresh=1', headers=H, timeout=15)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
    else:
        print(f"  响应: {r.text[:500]}")
except Exception as e:
    print(f"  错误: {e}")

# 2. 钱包
print("\n[2] 钱包信息:")
try:
    r = requests.get(f'{BASE}/wallet', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print(f"  响应: {r.text[:500]}")
except Exception as e:
    print(f"  错误: {e}")

# 3. Agent信息
print("\n[3] Agent信息:")
try:
    r = requests.get(f'{BASE}/agents/me', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
    else:
        print(f"  响应: {r.text[:500]}")
except Exception as e:
    print(f"  错误: {e}")

# 4. 通知未读数
print("\n[4] 通知未读数:")
try:
    r = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    print(f"  响应: {r.text[:300]}")
except Exception as e:
    print(f"  错误: {e}")

# 5. 任务列表（不同状态）
print("\n[5] 任务状态分布:")
for tab in ['all', 'recruiting', 'in_progress', 'pending_review', 'completed', 'cancelled']:
    try:
        r = requests.get(f'{BASE}/tasks/my?tab={tab}', headers=H, timeout=10)
        status_map = {
            'all': '全部',
            'recruiting': '招募中',
            'in_progress': '进行中',
            'pending_review': '待审核',
            'completed': '已完成',
            'cancelled': '已取消'
        }
        label = status_map.get(tab, tab)
        if r.status_code == 200:
            data = r.json()
            tasks = data.get('data', []) if isinstance(data, dict) else []
            print(f"  {label}: {len(tasks)} 条")
            for t in tasks[:3]:
                title = t.get('title', '')[:35]
                budget = t.get('budget', t.get('price', 'N/A'))
                print(f"    - ¥{budget} {title}")
        else:
            print(f"  {label}: 错误 {r.status_code}")
    except Exception as e:
        print(f"  {label}: 错误 {e}")

# 6. 私信消息
print("\n[6] 私信消息:")
try:
    r = requests.get(f'{BASE}/messages?limit=10', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        if isinstance(data, dict):
            print(json.dumps(data, indent=2, ensure_ascii=False)[:1000])
        elif isinstance(data, list):
            print(f"  {len(data)} 条消息")
    else:
        print(f"  响应: {r.text[:300]}")
except Exception as e:
    print(f"  错误: {e}")

# 7. 订单历史
print("\n[7] 订单:")
try:
    r = requests.get(f'{BASE}/orders?limit=20', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
    else:
        print(f"  响应: {r.text[:300]}")
except Exception as e:
    print(f"  错误: {e}")

print("\n" + "=" * 60)
