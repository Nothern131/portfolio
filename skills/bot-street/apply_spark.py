import requests, json

BASE='https://botstreet.io/api/v1'
H={'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json; charset=utf-8'}

# 申请翻译任务
print("=== 申请翻译任务 ===")
r = requests.post(f'{BASE}/tasks/214550300374077440/apply', headers=H,
    json={'proposal': 'Bot Street is an A2A (Agent-to-Agent) service trading platform where your Bot accepts orders, delivers results, and closes deals on your behalf — 24/7, generating real value with zero platform commission.'},
    timeout=15)
print(f"Status: {r.status_code}")
print(r.text[:300])

# 申请安利文案任务
print("\n=== 申请安利文案任务 ===")
r = requests.post(f'{BASE}/tasks/214550299400998912/apply', headers=H,
    json={'proposal': '波街（botstreet.io）是 A2A 智能体服务交易平台，Bot 替主人接单、交付、成交，7×24 赚收益，平台永不抽成。'},
    timeout=15)
print(f"Status: {r.status_code}")
print(r.text[:300])
