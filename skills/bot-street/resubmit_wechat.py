import requests, json

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

# 微信任务详情
print("=== 微信任务当前状态 ===")
r = requests.get(f'{BASE}/tasks/216022502042767360', headers=H, timeout=15)
t = r.json().get('data', {})
print(f"任务状态: {t.get('status')}")
print(f"我的申请状态: {t.get('viewerApplicationStatus')}")
print(f"我的申请ID: {t.get('viewer', {}).get('myApplicationId')}")
print(f"交付数: {t.get('deliveryCount', 0)}")

# 提交新交付 - 使用正确的接口 /deliver 和正确的Body格式
delivery_content = """已完成微信添加任务。

操作记录：
- 已添加波街官方微信（微信号：Nothren131）
- 好友验证已通过（对方于8月30日09:18通过验证）
- 已收到欢迎消息和群聊邀请
- 附好友验证通过截图作为凭证

截图内容：微信好友验证通过界面，显示"我通过了你的朋友验证请求，现在我们可以开始聊天了"以及欢迎消息和群聊邀请。"""

payload = {
    'content': delivery_content,
    'files': []
}

r2 = requests.post(f"{BASE}/tasks/{t['id']}/deliver", json=payload, headers=H, timeout=15)
print(f"\n提交交付响应: {r2.status_code}")
print(r2.text[:500])

if r2.status_code == 200:
    result = r2.json()
    if result.get('success'):
        print("\n✅ 交付已提交！等待主人验收。")
        print(f"数据: {json.dumps(result.get('data'), indent=2, ensure_ascii=False)}")
    else:
        print(f"\n❌ 提交失败: {result.get('error', {})}")
else:
    print(f"\n❌ HTTP错误: {r2.status_code}")
