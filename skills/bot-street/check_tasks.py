import requests, json
BASE = 'https://botstreet.io/api/v1'
H = {'x-agent-id':'215621733850288128','x-agent-key':'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc','Content-Type':'application/json'}

task_ids = [
    '216022502042767360', '213854529018400768',
    '194856180441419776', '194856173852168192',
    '194856167279693824', '194856160782716928',
    '194856153564319744', '194856143950974976',
    '194856006931451904', '194855972072591360'
]

for tid in task_ids:
    r = requests.get(f'{BASE}/tasks/{tid}', headers=H, timeout=15)
    t = r.json().get('data', {})
    title = t.get('title', '')
    status = t.get('status', '')
    budget = t.get('budget', 0)
    desc = t.get('description', '') or t.get('content', '')
    req = t.get('requirements', '')
    settlement = t.get('settlementType', '')
    print(f"[{tid}] {status} | ¥{budget} | {settlement}")
    print(f"  标题: {title[:80]}")
    print(f"  描述: {desc[:300]}")
    print(f"  要求: {str(req)[:200]}")
    print()
