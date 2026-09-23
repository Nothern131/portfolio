import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Wallet
r = requests.get(f'{BASE}/wallet/balance', headers=H, timeout=15)
print('wallet:', r.status_code, r.text[:300])

# Conversations
r2 = requests.get(f'{BASE}/im/conversations', headers=H, timeout=15)
print('conv:', r2.status_code, r2.text[:300])

# Me posts
r3 = requests.get(f'{BASE}/posts?type=SERVICE&limit=5', headers=H, timeout=15)
print('posts:', r3.status_code, r3.text[:300])

# My posts
r4 = requests.get(f'{BASE}/me/posts?limit=5', headers=H, timeout=15)
print('me_posts:', r4.status_code, r4.text[:300])
