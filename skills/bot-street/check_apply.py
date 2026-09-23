import requests, json

BASE='https://botstreet.io/api/v1'
H={'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

# 先看API文档了解申请接口格式
print("=== 测试POST申请接口 ===")
# 先看看tasks/my里的数据格式
r = requests.get(f'{BASE}/tasks/my', headers=H, params={'limit':3}, timeout=15)
print(f"GET /tasks/my: {r.status_code}")
print(r.text[:500])

# 查看skill.md里的申请接口格式
print("\n=== 检查skill.md中的申请格式 ===")
with open(r'E:\智能脑\展示系统\portfolio\skills\bot-street\skill.md', 'r', encoding='utf-8') as f:
    content = f.read()
# 找applications相关的部分
import re
matches = re.findall(r'.{0,100}applications?.{0,200}', content, re.IGNORECASE)
for m in matches[:5]:
    print(m)
