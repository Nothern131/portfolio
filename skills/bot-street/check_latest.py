import requests, json

AGENT_ID = '215621733850288128'
AGENT_KEY = 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc'
BASE = 'https://botstreet.io/api/v1'
H = {'x-agent-id': AGENT_ID, 'x-agent-key': AGENT_KEY, 'Content-Type': 'application/json; charset=utf-8'}

# 1. 查看私信最新消息
print("=== 私信最新消息 ===")
r = requests.get(f'{BASE}/im/conversations/215621955531837440/messages?limit=10', headers=H, timeout=15)
msgs = r.json().get('data', {}).get('messages', [])
print(f'  消息数: {len(msgs)}')
for m in msgs:
    role = 'me' if m.get('senderId') == AGENT_ID else 'other'
    content = m.get('content', '') or m.get('text', '') or ''
    mid = m.get('id', '')
    ts = m.get('createdAt', '')
    print(f'  [{role}] [{ts[:19]}] {mid}: {content[:200]}')

# 2. 查看会话详情
print('\n=== 会话详情 ===')
r2 = requests.get(f'{BASE}/im/conversations/215621955531837440', headers=H, timeout=15)
conv = r2.json().get('data', {})
other = conv.get('otherParty', {})
print(f'  other: {json.dumps(other, ensure_ascii=False)}')
print(f'  unreadCount: {conv.get("unreadCount")}')
print(f'  requestStatus: {conv.get("requestStatus")}')

# 3. 如果对方有回复，发送回复
if len(msgs) > 0:
    last_msg = msgs[-1]
    last_role = 'me' if last_msg.get('senderId') == AGENT_ID else 'other'
    if last_role == 'other':
        last_content = last_msg.get('content', '') or last_msg.get('text', '') or ''
        print(f'\n  对方最后消息: {last_content[:300]}')

# 4. 查我的delivery历史
print('\n=== 检查delivery API ===')
for tid in ['213854529018400768', '194856173852168192']:
    r3 = requests.get(f'{BASE}/tasks/{tid}', headers=H, timeout=15)
    task = r3.json().get('data', {})
    app = task.get('viewerApplication', {})
    print(f'\n  任务 {tid[:12]}...:')
    print(f'    viewerApplication: {json.dumps(app, ensure_ascii=False)[:200]}')
    # 也检查是否有deliveries字段
    if 'deliveries' in task:
        print(f'    deliveries: {json.dumps(task["deliveries"], ensure_ascii=False)[:200]}')
    # 检查是否有myDeliveries
    for k in task.keys():
        if 'deliver' in k.lower() or 'myapp' in k.lower():
            print(f'    {k}: {str(task[k])[:200]}')

# 5. 查看所有通知详情
print('\n=== 最新通知 ===')
r4 = requests.get(f'{BASE}/notifications?limit=10', headers=H, timeout=15)
notifs = r4.json().get('data', {}).get('notifications', [])
for n in notifs[:8]:
    msg = n.get('message', '')[:100].replace('\n', ' ')
    print(f'  [{n.get("type")}] {msg}')

# 6. 检查导航站收录状态
print('\n=== 导航站收录验证 ===')
import urllib.parse
site_q = urllib.parse.quote('site:ai138.com botstreet')
import requests as rq
r5 = rq.get(f'https://www.bing.com/search?q={site_q}', headers={'User-Agent': 'Mozilla/5.0'}, timeout=10, allow_redirects=True)
has_result = 'botstreet' in r5.text.lower() and 'ai138.com' in r5.text.lower()
print(f'  Bing site搜索: {"已收录" if has_result else "未收录/审核中"}')

r6 = rq.get('https://www.ai138.com/search/botstreet', headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
print(f'  ai138搜索页: HTTP {r6.status_code} {"✓可见" if r6.status_code==200 else "✗不可见"}')
