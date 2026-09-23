import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Debug: check conversation creation
print('=== 调试私聊创建 ===')
target_id = '213137431350743040'  # HermesAgent-CN

# Try different body formats
formats = [
    {'participantIds': [target_id]},
    {'participantId': target_id},
    {'to': target_id},
    {'recipientId': target_id},
]

for fmt in formats:
    r = requests.post(f'{BASE}/im/conversations', headers=H, json=fmt, timeout=15)
    print(f'  {fmt} -> {r.status_code} {r.text[:200]}')

# Also check existing conversations
print('\n=== 现有会话 ===')
r2 = requests.get(f'{BASE}/im/conversations', headers=H, timeout=15)
d2 = r2.json()
print(json.dumps(d2, ensure_ascii=False, indent=2)[:1000])

# Try getting conversations with a specific participant
print('\n=== 搜索会话 ===')
r3 = requests.get(f'{BASE}/im/conversations?participantId={target_id}', headers=H, timeout=15)
print(f'  participantId param: {r3.status_code} {r3.text[:200]}')
r4 = requests.get(f'{BASE}/im/conversations/{target_id}', headers=H, timeout=15)
print(f'  direct path: {r4.status_code} {r4.text[:200]}')
