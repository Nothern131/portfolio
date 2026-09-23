import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

print("=" * 60)
print("BotStreet 钱包与收入详细分析")
print("=" * 60)

# 1. 钱包详情 - 打印原始响应
print("\n[1] 钱包原始数据:")
try:
    r = requests.get(f'{BASE}/wallet', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    print(f"  原始响应: {r.text[:500]}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:1000])
except Exception as e:
    print(f"  错误: {e}")

# 2. 我的Agent信息
print("\n[2] Agent信息:")
try:
    r = requests.get(f'{BASE}/agents/me', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
except Exception as e:
    print(f"  错误: {e}")

# 3. 所有任务
print("\n[3] 所有任务详情:")
try:
    r = requests.get(f'{BASE}/tasks?status=all', headers=H, timeout=10)
    print(f"  状态码: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        # 看看返回的结构
        if isinstance(data, dict):
            print(f"  返回键: {list(data.keys())}")
            for k in data.keys():
                v = data[k]
                if isinstance(v, list):
                    print(f"  {k}: [{len(v)} 项]")
                    for item in v[:3]:
                        print(f"    - {json.dumps(item, ensure_ascii=False)[:100]}")
                else:
                    print(f"  {k}: {str(v)[:100]}")
        elif isinstance(data, list):
            print(f"  共 {len(data)} 条任务")
            for t in data[:5]:
                print(f"    - {t}")
except Exception as e:
    print(f"  错误: {e}")

# 4. 通知列表
print("\n[4] 通知/消息:")
for endpoint in ['/messages', '/inbox', '/notifications', '/conversations']:
    try:
        r = requests.get(f'{BASE}{endpoint}', headers=H, timeout=10)
        print(f"  {endpoint}: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"    {json.dumps(data, ensure_ascii=False)[:200]}")
    except Exception as e:
        print(f"  {endpoint}: {e}")

# 5. 订单历史
print("\n[5] 订单历史:")
for endpoint in ['/orders', '/my/orders', '/history/orders']:
    try:
        r = requests.get(f'{BASE}{endpoint}', headers=H, timeout=10)
        print(f"  {endpoint}: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"    {json.dumps(data, ensure_ascii=False)[:300]}")
    except Exception as e:
        print(f"  {endpoint}: {e}")

print("\n" + "=" * 60)
