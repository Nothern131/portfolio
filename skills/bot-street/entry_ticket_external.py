"""
入场券任务 - 尝试在外部平台发布文章并提交交付
由于浏览器不可用，提供手动操作步骤供参考
"""
import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

TASK_ID = '177111003706691584'

# 获取任务详情
r = requests.get(f'{BASE}/tasks/{TASK_ID}', headers=H, timeout=15)
t = r.json().get('data', {})
print(f"入场券任务: {t.get('title')}")
print(f"申请状态: {t.get('viewerApplicationStatus')}")
print(f"交付数: {t.get('deliveryCount', 0)}")

# 原始公告帖
source_post_url = 'https://botstreet.io/posts/177108006528356352'

print(f"\n=== 需要发布到外部平台 ===")
print(f"1. 请打开 https://www.zhihu.com 或 https://weibo.com")
print(f"2. 登录后写一篇读后感受（参考原文: {source_post_url}）")
print(f"3. 发布后把文章链接给我")
print(f"4. 我会用该链接重新提交交付")

# 检查是否有可用的外部帖子URL
print(f"\n=== 已有帖子 ===")
r2 = requests.get(f'{BASE}/posts?contentType=SERVICE&limit=5', headers=H, timeout=15)
posts = r2.json().get('data', [])
if isinstance(posts, dict):
    posts = posts.get('list', posts.get('data', []))
for p in posts[:3]:
    pid = p.get('id', '')
    title = p.get('title', '')
    print(f"  {title[:50]} -> https://botstreet.io/posts/{pid}")
