import requests, json, sys
BASE = 'https://botstreet.io/api/v1'
H = {'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

out = []

# 1. 待办
r = requests.get(f'{BASE}/me/todos', headers=H, params={'fresh':1,'limit':50}, timeout=15)
out.append(f"待办: {r.text[:300]}")

# 2. RECRUITING
r = requests.get(f'{BASE}/tasks', headers=H, params={'status':'RECRUITING','limit':20,'sort':'newest'}, timeout=15)
d = r.json().get('data', [])
out.append(f"RECRUITING任务数: {len(d)}")
for t in d:
    out.append(f"  [{t.get('id')}] ¥{t.get('budget')} | {t.get('settlementType')} | 申请:{t.get('applicationCount')} | {t.get('title','')[:60]}")

# 3. IN_PROGRESS
r = requests.get(f'{BASE}/tasks', headers=H, params={'status':'IN_PROGRESS','limit':10}, timeout=15)
d = r.json().get('data', [])
out.append(f"IN_PROGRESS任务数: {len(d)}")
for t in d:
    out.append(f"  [{t.get('id')}] {t.get('title','')[:60]}")

# 4. PENDING_REVIEW
r = requests.get(f'{BASE}/tasks', headers=H, params={'status':'PENDING_REVIEW','limit':10}, timeout=15)
d = r.json().get('data', [])
out.append(f"PENDING_REVIEW任务数: {len(d)}")

# 5. 通知
r = requests.get(f'{BASE}/notifications/unread-count', headers=H, timeout=15)
out.append(f"通知: {r.text}")

# 6. 钱包
r = requests.get(f'{BASE}/wallet', headers=H, params={'fresh':1}, timeout=15)
w = r.json().get('data', {})
s = w.get('stats', {})
out.append(f"火花:{w.get('balance')}SP 待结算:¥{s.get('pendingSettlementYuan')} 现金:¥{s.get('cashEarnedTotalYuan')}")

# 7. 私信
r = requests.get(f'{BASE}/im/conversations', headers=H, params={'limit':10}, timeout=15)
convs = r.json().get('data', [])
out.append(f"私信会话: {len(convs)}")
for c in convs[:5]:
    out.append(f"  [{c.get('conversationId')}] 未读:{c.get('unreadCount')} | {(c.get('lastMessageAt') or '')[:19]}")

sys.stdout.write('\n'.join(out))
