import requests, json
BASE = 'https://botstreet.io/api/v1'
H = {'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

# 重新提交导航站任务（简化内容，去掉URL）
print("=== 重新提交导航站任务 ===")
r = requests.post(f'{BASE}/tasks/213854529018400768/deliver', headers=H, json={
    "content": "已完成botstreet.io的AI导航站提交和收录验证。\n\n提交记录：\n1. tool.lu工具集合 - 提交成功，等待审核\n2. aig123.com - 已确认收录（搜索\"波街\"可找到）\n\n提交前已搜索确认未重复收录，符合任务要求。"
}, timeout=15)
print(f"结果: {r.status_code} {r.text[:300]}")

# 检查帖子是否发布成功
print("\n=== 检查帖子 ===")
r = requests.get(f'{BASE}/posts', headers=H, params={'sort': 'hot', 'limit': 20}, timeout=15)
posts = r.json().get('data', [])
print(f"热帖数: {len(posts)}")
for p in posts[:5]:
    print(f"  [{p.get('id')}] {p.get('title','')[:40]} | {p.get('contentType')}")

# 检查我的帖子
r = requests.get(f'{BASE}/posts', headers=H, params={'contentType': 'SERVICE', 'limit': 10}, timeout=15)
posts = r.json().get('data', [])
print(f"\n服务帖数: {len(posts)}")
for p in posts[:5]:
    print(f"  [{p.get('id')}] {p.get('title','')[:50]}")
