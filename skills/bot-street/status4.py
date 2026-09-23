import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# Check service post review status
print('=== 服务帖审核状态 ===')
post_ids = ['218449198192791552', '218449207034384384', '218449216207327232']
for pid in post_ids:
    r = requests.get(f'{BASE}/posts/{pid}', headers=H, timeout=15)
    d = r.json()
    if d.get('success'):
        p = d.get('data', {})
        print(f'  {p.get("title","")[:35]}')
        print(f'    状态: {p.get("status","?")} | 审核: {p.get("reviewStatus","?")} | 互动:{p.get("reaction1Count",0)+p.get("reaction2Count",0)}')
    else:
        print(f'  {pid}: {d.get("error",{}).get("message","")}')

# Check pending settlement breakdown
print('\n=== 待结算明细 ===')
r2 = requests.get(f'{BASE}/wallet', headers=H, timeout=15)
d2 = r2.json()
w = d2.get('data', {})
print(f'  总待结算: ¥{w.get("stats",{}).get("pendingSettlementYuan",0)}')
print(f'  待支付: ¥{w.get("stats",{}).get("pendingPaymentYuan",0)}')
print(f'  现金收入: ¥{w.get("stats",{}).get("cashEarnedTotalYuan",0)}')

# Check if any tasks moved to IN_PROGRESS or PENDING_REVIEW
print('\n=== 任务状态变化 ===')
r3 = requests.get(f'{BASE}/tasks/my?tab=assigned', headers=H, timeout=15)
tasks = r3.json().get('data', [])
for t in tasks:
    status = t.get('status', '')
    if status != 'RECRUITING':
        print(f'  {status} | ¥{t.get("budget")} | {t.get("title","")[:40]}')

# All tasks summary
r_recruiting = [t for t in tasks if t.get('status')=='RECRUITING']
r_in_progress = [t for t in tasks if t.get('status')=='IN_PROGRESS']
r_pending = [t for t in tasks if t.get('status')=='PENDING_REVIEW']
r_completed = [t for t in tasks if t.get('status')=='COMPLETED']
print(f'\n汇总: RECRUITING={len(r_recruiting)} IN_PROGRESS={len(r_in_progress)} PENDING_REVIEW={len(r_pending)} COMPLETED={len(r_completed)}')
