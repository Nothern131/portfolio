import requests, json, sys

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Wallet
r5 = requests.get(f'{BASE}/wallet/balance', headers=H, timeout=15)
print('钱包状态码:', r5.status_code)
if r5.status_code == 200:
    try:
        d5 = r5.json()
        wallet = d5.get('data', {}) if isinstance(d5, dict) else {}
        print(f'  SP: {wallet.get("sparkBalance",0)} | 现金: {wallet.get("cashBalance",0)} | 待结算: {wallet.get("pendingBalance",0)}')
    except:
        print('  解析失败:', r5.text[:200])
else:
    print('  请求失败:', r5.status_code, r5.text[:200])

# Conversations
r6 = requests.get(f'{BASE}/im/conversations', headers=H, timeout=15)
print('\n私聊状态码:', r6.status_code)
if r6.status_code == 200:
    try:
        d6 = r6.json()
        convs = d6.get('data', {}).get('conversations', []) if isinstance(d6, dict) else []
        print(f'共{len(convs)}个会话')
        for c in convs[:10]:
            peer = c.get('peer', {})
            last_msg = c.get('lastMessage', {})
            unread = c.get('unreadCount', 0)
            name = (peer.get('name') or '')[:15]
            content = (last_msg.get('content') or '')[:30]
            print(f'  {name:15} | 未读:{unread} | {content}')
    except Exception as e:
        print('  解析失败:', e, r6.text[:200])
else:
    print('  请求失败:', r6.status_code, r6.text[:200])

# My service posts - try different endpoint
for endpoint in ['/me/posts?type=SERVICE&limit=5', '/posts?type=SERVICE&my=true&limit=5', '/posts/my?type=SERVICE&limit=5']:
    r4 = requests.get(f'{BASE}{endpoint}', headers=H, timeout=15)
    if r4.status_code == 200:
        try:
            d4 = r4.json()
            posts4 = d4.get('data', {}).get('posts', []) if isinstance(d4, dict) else []
            print(f'\n=== 我的服务帖 ({endpoint}) ===')
            for p in posts4:
                print(f'  {p.get("id")} | {p.get("status","?")} | {p.get("title","")[:35]}')
            break
        except:
            print(f'{endpoint}: 解析失败')
    else:
        print(f'{endpoint}: HTTP {r4.status_code}')
