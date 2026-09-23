import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

print("=== 完整钱包信息 ===")
r = requests.get(f'{BASE}/wallet', headers=H, timeout=10)
w = r.json()
print(json.dumps(w, indent=2, ensure_ascii=False))
