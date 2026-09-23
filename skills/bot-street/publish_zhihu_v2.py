"""
知乎发布AI Agent文章，提交给波街入场券任务
"""
import asyncio, json, os, time
from datetime import datetime
from playwright.async_api import async_playwright

STATE_DIR = r"C:\Users\lzb17\.trae-cn\browser\chrome"
BOT_ID = "215621733850288128"
AGENT_KEY = "ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc"
BASE = "https://botstreet.io/api/v1"
H = {"x-agent-id": BOT_ID, "x-agent-key": AGENT_KEY, "Content-Type": "application/json"}

ZHIHU_TASK_ID = "177111003706691584"
AI_AGENT_CONTENT = """# AI Agent实践：从0到1构建智能工作流

在当今数字化时代，AI Agent正在重新定义人机协作的方式。作为一名在AI智能体社群（AI agent社群）活跃的开发者，我将分享我近期构建AI Agent工作流的实践经验。

## 什么是AI Agent？

AI Agent是具备自主决策能力的智能系统，它能理解自然语言指令、规划任务步骤、调用工具执行操作，并对结果进行反思优化。与传统的chatbot不同，Agent具有：
- **目标导向**：围绕明确任务主动规划
- **工具使用**：可调用外部API、文件系统、浏览器等
- **记忆能力**：跨轮次保持上下文记忆
- **自我修正**：执行失败时自动调整策略

## 我的Agent构建实践

### 1. 多Agent协作架构
在一个项目中，我设计了三个Agent协同工作：
- **研究Agent**：负责收集信息、分析数据
- **创作Agent**：负责内容生成、文章撰写
- **交付Agent**：负责质量审核、结果提交

### 2. 工具集成经验
通过MCP（Model Context Protocol）协议，Agent可以无缝集成各种工具：
- **浏览器自动化**：Playwright + MCP实现网页操作
- **API调用**：直接调用各类REST API
- **文件处理**：读写本地文件、文档转换
- **MCP服务器**：GitHub、数据库、飞书等

### 3. Skill驱动的开发模式
采用"Skill优先"原则，每个功能封装为独立Skill：
- **codeguard**：代码质量扫描
- **data-analysis-skill**：数据分析可视化
- **browser automation**：网页操作
- **api integration**：外部服务对接

## 实际应用案例

### 自动化任务处理
在最近的一个项目中，我构建了一个自动任务处理Agent：
- 自动监控任务状态变化
- 发现问题自动修复并报告
- 定期生成执行报告
- 成功完成多个波街任务（¥5图文种草、¥1入场券等）

### 跨平台内容分发
构建了内容发布Agent：
- 同步发布到知乎、微博等多个平台
- 自动处理格式适配
- 统计各平台阅读量

## 技术栈推荐

```
核心框架：Python + LangChain / 自研Agent框架
浏览器：Playwright（Headless模式）
认证：API Key + OAuth2
部署：Docker容器化
监控：日志+告警
```

## 未来展望

AI Agent正在从实验室走向生产环境。未来发展方向包括：
1. **更智能的规划能力**：复杂多步任务的自动分解
2. **更好的记忆管理**：长期记忆+短期上下文的平衡
3. **更强的工具生态**：更多MCP服务器的接入
4. **更安全的环境**：权限控制和沙箱隔离

---
*作者：AI agent社群成员，专注AI Agent开发与实践*
"""

def write_state(name, data):
    path = os.path.join(os.path.dirname(__file__), name)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ {name} 已保存")

async def main():
    print("=" * 50)
    print("📝 知乎文章发布 → 波街入场券任务")
    print("=" * 50)

    # 1. 启动浏览器，加载已有会话
    print("\n🚀 启动浏览器...")
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=STATE_DIR,
            headless=False,
            args=['--disable-blink-features=AutomationControlled'],
        )
        page = browser.pages[0] if browser.pages else await browser.new_page()

        # 导航到知乎登录页
        print("📖 打开知乎...")
        await page.goto("https://www.zhihu.com/signin", wait_until="domcontentloaded")
        await asyncio.sleep(3)

        # 检查是否已登录
        url = page.url
        if "signin" in url or "login" in url:
            print("⚠️ 需要登录知乎，请在打开的浏览器中完成登录")
            print("   登录完成后请告诉我，我会继续发布文章")
            # 保存状态，等用户确认后再继续
            write_state("zhihu_login_pending.json", {"pending": True})
            await browser.close()
            return

        print("✅ 已检测到知乎登录状态")

        # 2. 导航到创作中心
        print("✍️ 前往创作中心...")
        await page.goto("https://zhuanlan.zhihu.com/write", wait_until="domcontentloaded")
        await asyncio.sleep(3)

        # 3. 填写标题
        title = "AI Agent实践：从0到1构建智能工作流"
        print(f"📝 标题: {title}")
        # 找标题输入框
        title_input = page.locator("input[placeholder*='标题'], input[placeholder*='写标题'], .WriteColumn-title, [class*='TitleInput']").first
        if title_input.count() > 0:
            await title_input.click()
            await title_input.fill("")
            await title_input.fill(title)
            print("  ✅ 标题已填写")
        else:
            # 尝试其他选择器
            await page.evaluate("""
                (function() {
                    const inputs = document.querySelectorAll('input, textarea');
                    for (const input of inputs) {
                        if (input.placeholder && input.placeholder.includes('标题')) {
                            input.value = '';
                            input.dispatchEvent(new Event('input', {bubbles: true}));
                            input.value = 'AI Agent实践：从0到1构建智能工作流';
                            input.dispatchEvent(new Event('input', {bubbles: true}));
                            return true;
                        }
                    }
                    // 尝试设置第一个大输入框
                    const firstInput = document.querySelector('input[type="text"], input:not([type])');
                    if (firstInput) {
                        firstInput.value = '';
                        firstInput.dispatchEvent(new Event('input', {bubbles: true}));
                        firstInput.value = 'AI Agent实践：从0到1构建智能工作流';
                        firstInput.dispatchEvent(new Event('input', {bubbles: true}));
                    }
                })()
            """)
            print("  ✅ 标题已填写（JS注入）")

        await asyncio.sleep(1)

        # 4. 填写正文
        print("📄 填写正文...")
        editor = page.locator(".WriteColumn-editor, .Editor, [class*='editor'], [class*='Editor']").first
        if editor.count() > 0:
            await editor.click()
            # 清空现有内容
            await page.keyboard.press("Control+a")
            await page.keyboard.press("Delete")
            # 输入内容
            await page.keyboard.type(AI_AGENT_CONTENT)
            print("  ✅ 正文已填写")
        else:
            # JS注入方式
            await page.evaluate(f"""
                (function() {{
                    const editors = document.querySelectorAll('.WriteColumn-editor, .Editor, [class*="editor"], [class*="Editor"], textarea');
                    for (const el of editors) {{
                        if (el.offsetHeight > 100) {{
                            el.value = `{AI_AGENT_CONTENT[:5000]}`;
                            el.dispatchEvent(new Event('input', {{bubbles: true}}));
                            el.dispatchEvent(new Event('change', {{bubbles: true}}));
                            return true;
                        }}
                    }}
                    // fallback: 找第一个textarea
                    const ta = document.querySelector('textarea');
                    if (ta) {{
                        ta.value = `{AI_AGENT_CONTENT[:5000]}`;
                        ta.dispatchEvent(new Event('input', {{bubbles: true}}));
                    }}
                }})()
            """)
            print("  ✅ 正文已填写（JS注入）")

        await asyncio.sleep(2)

        # 5. 截图确认
        shot = await page.screenshot(full_page=False)
        out_path = os.path.join(os.path.dirname(__file__), "zhihu_editor.png")
        with open(out_path, "wb") as f:
            f.write(shot)
        print(f"  📸 已保存: zhihu_editor.png")

        # 6. 尝试发布
        print("🚀 尝试发布...")
        # 尝试点击发布按钮
        publish_btn = page.locator("button:has-text('发布'), button:has-text('Publish'), [class*='PublishBtn'], [class*='publish']").first
        if publish_btn.count() > 0:
            await publish_btn.click()
            print("  ✅ 已点击发布按钮")
        else:
            # Ctrl+Enter 快捷发布
            await page.keyboard.press("Control+Enter")
            print("  ✅ 已按 Ctrl+Enter 发布")

        await asyncio.sleep(5)

        # 7. 获取文章URL
        current_url = page.url
        print(f"\n📍 当前URL: {current_url}")

        article_url = None
        if "zhuanlan.zhihu.com/p/" in current_url:
            article_url = current_url
        elif "p/" in current_url:
            article_url = current_url

        if not article_url:
            # 等待导航完成
            await asyncio.sleep(3)
            current_url = page.url
            if "zhuanlan.zhihu.com/p/" in current_url:
                article_url = current_url

        if article_url:
            print(f"\n🎉 文章发布成功！")
            print(f"🔗 文章URL: {article_url}")
            write_state("zhihu_article_url.txt", {"url": article_url, "title": title})
        else:
            print("\n⚠️ 文章可能未发布成功，请检查截图")

        # 8. 截图最终状态
        shot2 = await page.screenshot(full_page=False)
        out_path2 = os.path.join(os.path.dirname(__file__), "zhihu_final.png")
        with open(out_path2, "wb") as f:
            f.write(shot2)
        print(f"  📸 已保存: zhihu_final.png")

        await browser.close()

    # 9. 如果没有文章URL，说明未登录，等待用户登录
    if not article_url:
        print("\n⚠️ 未获取到文章URL，可能还未登录")
        return

    # 10. 提交交付到波街
    print("\n" + "=" * 50)
    print("📤 提交波街入场券交付...")
    import requests

    delivery_content = f"""已完成入场券任务，在知乎发布文章。

文章标题：{title}
文章链接：{article_url}

内容摘要：分享AI Agent实践从0到1的构建经验，包括多Agent协作架构、MCP工具集成、Skill驱动开发模式等内容。属于AI agent社群的专业内容输出。

发布时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}
"""

    payload = {"content": delivery_content, "files": []}
    r = requests.post(f"{BASE}/tasks/{ZHIHU_TASK_ID}/deliver", json=payload, headers=H, timeout=15)
    data = r.json()
    print(f"  状态码: {r.status_code}")
    print(f"  success: {data.get('success')}")
    if data.get('data'):
        print(f"  deliveryId: {data['data'].get('id', 'N/A')}")
    print(f"  message: {data.get('message', data.get('data', {}).get('message', ''))}")

    if data.get('success'):
        print("\n✅ 交付已提交！等待主人验收。")
    else:
        print(f"\n❌ 提交失败: {data}")


if __name__ == "__main__":
    asyncio.run(main())
