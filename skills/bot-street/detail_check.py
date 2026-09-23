import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

print("=" * 60)
print("BotStreet 已取消/已完成任务详情")
print("=" * 60)

# 查询所有任务（不分状态）
for status in ['all', 'completed', 'cancelled', 'refunded']:
    try:
        r = requests.get(f'{BASE}/tasks?status={status}&limit=50', headers=H, timeout=10)
        print(f"\n[status={status}] 状态码: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            items = data.get('data', []) if isinstance(data, dict) else []
            if not items and isinstance(data, list):
                items = data
            print(f"  数量: {len(items)}")
            for t in items[:10]:
                title = t.get('title', '')[:40]
                budget = t.get('budget', t.get('price', 0))
                t_status = t.get('status', 'unknown')
                created = t.get('createdAt', t.get('created_at', ''))[:10]
                print(f"    [{t_status}] ¥{budget} | {created} | {title}")
        else:
            print(f"  错误: {r.text[:200]}")
    except Exception as e:
        print(f"  错误: {e}")

# 查看任务ID对应的详情
print("\n\n[已取消任务详情 - 抽样检查]:")
cancelled_ids = [
    '194856167279693824',
    '194856143950974976',
    '194856180441419776',
    '194856153564319744',
    '194855972072591360',
    '194856160782716928',
    '194856006931451904',
    '216022502042767360',
    '177111003706691584',
    '194856173852168192',
    '213854529018400768',
    '214550300374077440',
    '214550299400998912',
]
for tid in cancelled_ids[:5]:
    try:
        r = requests.get(f'{BASE}/tasks/{tid}', headers=H, timeout=10)
        if r.status_code == 200:
            data = r.json()
            t = data.get('data', {})
            print(f"\n  任务 {tid}:")
            print(f"    标题: {t.get('title', 'N/A')}")
            print(f"    状态: {t.get('status', 'N/A')}")
            print(f"    预算: ¥{t.get('budget', t.get('price', 'N/A'))}")
            print(f"    创建: {t.get('createdAt', 'N/A')}")
            print(f"    完成: {t.get('completedAt', t.get('finishedAt', 'N/A'))}")
            print(f"    接单Bot: {t.get('assignedAgentId', t.get('botId', 'N/A'))}")
            print(f"    完整数据: {json.dumps(t, ensure_ascii=False)[:500]}")
        else:
            print(f"\n  任务 {tid}: 错误 {r.status_code}")
    except Exception as e:
        print(f"\n  任务 {tid}: 错误 {e}")

# 查订单历史（私信内成交的订单）
print("\n\n[订单历史 - 全部状态]:")
for status in ['all', 'completed', 'cancelled', 'refunded']:
    try:
        r = requests.get(f'{BASE}/orders?role=all&status={status}&limit=50', headers=H, timeout=10)
        print(f"\n  status={status}: 状态码 {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            items = data.get('items', data.get('data', [])) if isinstance(data, dict) else []
            print(f"    数量: {len(items)}")
            for o in items[:5]:
                title = o.get('title', '')[:30]
                amount = o.get('amount', o.get('price', 0))
                o_status = o.get('status', 'unknown')
                print(f"    [{o_status}] ¥{amount} | {title}")
        else:
            print(f"    错误: {r.text[:200]}")
    except Exception as e:
        print(f"  错误: {e}")

print("\n" + "=" * 60)
