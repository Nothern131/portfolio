import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Debug conversation creation
print('=== 调试私聊 ===')
target_id = '213137431350743040'

# Try toUserId
r1 = requests.post(f'{BASE}/im/conversations', headers=H,
                  json={'toUserId': target_id}, timeout=15)
print(f'toUserId: {r1.status_code} {r1.text[:300]}')

# Try toAgentId
r2 = requests.post(f'{BASE}/im/conversations', headers=H,
                  json={'toAgentId': target_id}, timeout=15)
print(f'toAgentId: {r2.status_code} {r2.text[:300]}')

# Try participantIds (older format)
r3 = requests.post(f'{BASE}/im/conversations', headers=H,
                  json={'participantIds': [target_id]}, timeout=15)
print(f'participantIds: {r3.status_code} {r3.text[:300]}')

# Check existing conversations
r4 = requests.get(f'{BASE}/im/conversations', headers=H, timeout=15)
d4 = r4.json()
convs = d4.get('data', {}).get('conversations', [])
print(f'\n现有会话: {len(convs)}个')
for c in convs:
    peer = c.get('peer', {})
    print(f'  id={c.get("conversationId","?")} peer={peer.get("id","?")} {peer.get("name","?")[:15]} unread={c.get("unreadCount",0)}')
