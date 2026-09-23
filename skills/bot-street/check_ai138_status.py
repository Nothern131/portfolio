"""确认ai138.com提交状态和搜索URL"""
import requests, json, re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

# 1. 重新提交并获取完整响应（看是否有审核通过提示）
print("=== 重新获取提交页确认状态 ===")
r = requests.get('https://www.ai138.com/submit', headers=HEADERS, timeout=15)
resp = r.text

# 检查是否有"已提交"或"审核中"等状态提示
for pat in ['提交成功', '审核中', '已提交', '等待审核', '正在审核', '请等待审核', '已收录', '已提交审核']:
    if pat in resp:
        idx = resp.find(pat)
        context = resp[max(0,idx-100):idx+300]
        print(f"  找到'{pat}': ...{context[:250]}...")

# 2. 尝试各种搜索URL格式
print("\n=== 搜索URL探索 ===")
search_urls = [
    'https://www.ai138.com/s?q=botstreet',
    'https://www.ai138.com/search/botstreet',
    'https://www.ai138.com/tools/botstreet',
    'https://www.ai138.com/ai/botstreet',
    'https://www.ai138.com/tool/botstreet',
    'https://www.ai138.com/p/botstreet',
    'https://www.ai138.com/?s=botstreet',
    'https://www.ai138.com/?s=%E6%B3%A2%E8%A1%97',
]
for url in search_urls:
    try:
        r2 = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
        if r2.status_code == 200:
            found = 'botstreet' in r2.text.lower() or '波街' in r2.text
            print(f"  {url}: status={r2.status_code} {'✓找到' if found else '页面存在'}")
            if found:
                links = re.findall(r'href=["\']([^"\']*botstreet[^"\']*)["\']', r2.text, re.IGNORECASE)
                for link in links[:3]:
                    print(f"    {link}")
        else:
            print(f"  {url}: status={r2.status_code}")
    except Exception as e:
        print(f"  {url}: 错误 {e}")

# 3. 检查site:搜索（通过Google/Bing）
print("\n=== 搜索引擎site:查询 ===")
import urllib.parse
for engine, base in [('Google', 'https://www.google.com/search'), ('Bing', 'https://www.bing.com/search')]:
    q = urllib.parse.quote(f'site:ai138.com botstreet')
    try:
        r3 = requests.get(f'{base}?q={q}', headers={**HEADERS, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}, timeout=10, allow_redirects=True)
        has_result = 'botstreet' in r3.text.lower() and 'ai138.com' in r3.text.lower()
        print(f"  {engine}: status={r3.status_code} {'✓有收录' if has_result else '未找到收录记录'}")
    except Exception as e:
        print(f"  {engine}: 错误 {e}")

# 4. 检查AI聊天分类页面（看最新提交）
print("\n=== AI聊天分类（最新） ===")
for cat_url in ['https://www.ai138.com/cat/3', 'https://www.ai138.com/cat/ai-chat', 'https://www.ai138.com/ai-chat']:
    try:
        r4 = requests.get(cat_url, headers=HEADERS, timeout=10, allow_redirects=True)
        if 'botstreet' in r4.text.lower() or '波街' in r4.text:
            print(f"  {cat_url}: ✓ 找到BotStreet!")
            links = re.findall(r'href=["\']([^"\']+)["\']', r4.text, re.IGNORECASE)
            for link in links:
                if 'botstreet' in link.lower():
                    print(f"    {link}")
        else:
            # 检查是否有"审核中"或"待审核"提示
            if '审核' in r4.text:
                print(f"  {cat_url}: 页面存在，含审核相关内容（可能在审核中）")
            else:
                print(f"  {cat_url}: status={r4.status_code} (未找到BotStreet)")
    except Exception as e:
        print(f"  {cat_url}: 错误 {e}")

# 5. 检查提交后页面的完整状态
print("\n=== 提交页完整状态检查 ===")
# 检查页面上是否有关于提交状态的消息
status_patterns = re.findall(r'<[^>]*class=["\'][^"\']*notice[^"\']*["\'][^>]*>([^<]+)<', resp, re.IGNORECASE)
for p in status_patterns[:5]:
    print(f"  notice: {p.strip()[:100]}")

status_patterns2 = re.findall(r'<[^>]*class=["\'][^"\']*message[^"\']*["\'][^>]*>([^<]+)<', resp, re.IGNORECASE)
for p in status_patterns2[:5]:
    print(f"  message: {p.strip()[:100]}")

# 检查form是否还在（如果已提交，form可能被替换）
has_form = '<form' in resp.lower()
print(f"\n  页面上仍有表单: {has_form}")
if not has_form:
    print("  → 表单已被替换，提交可能已完成")

# 保存完整响应
with open(r'E:\智能脑\展示系统\portfolio\skills\bot-street\ai138_submit_final.html', 'w', encoding='utf-8') as f:
    f.write(resp)
print(f"\n  完整响应已保存 (size={len(resp)})")
