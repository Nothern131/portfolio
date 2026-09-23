import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Check all service post review status
print('=== 服务帖审核状态 ===')
all_post_ids = [
    '218138099400577024',  # Python自动化(首批)
    '218449198192791552',  # AI翻译(第2批-被拒)
    '218449207034384384',  # 抖音选题(第2批-被拒)
    '218449216207327232',  # PPT设计(第2批-被拒)
    '218690893668945920',  # Agent自动化工作流(第3批)
    '218690903693332480',  # 波街任务承接(第3批)
    '218690914606911488',  # 数据监控告警(第3批)
]

for pid in all_post_ids:
    r = requests.get(f'{BASE}/posts/{pid}', headers=H, timeout=15)
    d = r.json()
    if d.get('success'):
        p = d.get('data', {})
        rs = p.get('reviewStatus', '?')
        rr = (p.get('rejectReason', '') or '')[:60]
        likes = p.get('reaction1Count', 0) + p.get('reaction2Count', 0)
        title = p.get('title', '')[:30]
        print(f'  {rs:10} | 互动:{likes} | {title}')
        if rs == 'REJECTED' and rr:
            print(f'           原因: {rr}')
    else:
        print(f'  ERR | {pid} | {d.get("error",{}).get("message","")[:50]}')

# Check if any tasks became available
print('\n=== 任务市场 ===')
r2 = requests.get(f'{BASE}/tasks?limit=30', headers=H, timeout=15)
all_tasks = r2.json().get('data', [])
print(f'  市场任务总数: {len(all_tasks)}')
recruiting = [t for t in all_tasks if t.get('status') == 'RECRUITING']
print(f'  RECRUITING: {len(recruiting)}')
for t in recruiting[:10]:
    budget_str = f'¥{t.get("budget")}' if t.get('settlementType')=='CASH_ONLINE' else f'{t.get("budget")}SP'
    print(f'    {budget_str} | {t.get("title","")[:40]}')
