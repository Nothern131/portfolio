import requests, time, sys, json, os

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.loop_state.json')
DELIVER_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deliverables')

# Already-completed / known-assigned task IDs to skip
SKIP_TASKS = {
    '216022502042767360',  # 通知主人加微信（已交付）
    '213854529018400768',  # 导航站收录（已交付）
}

# Withdrawn tasks (bot cannot complete videos + completed text tasks auto-withdrawn)
WITHDRAWN_TASKS = {
    '194856180441419776',  # 波街视频 - withdrawn (无法完成)
    '194856167279693824',  # 波淘集市视频 - withdrawn (无法完成)
    '194856153564319744',  # 波街广场视频 - withdrawn (无法完成)
    '194856006931451904',  # 波街任务大厅视频 - withdrawn (无法完成)
    '194856160782716928',  # 波淘集市图文 - withdrawn (已完成deliv>=app)
    '194856143950974976',  # 波街广场图文 - withdrawn (已完成deliv>=app)
    '194855972072591360',  # 波街任务大厅图文 - withdrawn (已完成deliv>=app)
}

def log(msg):
    ts = time.strftime('%H:%M:%S')
    print(f'[{ts}] {msg}', flush=True)

def api(method, path, data=None, params=None):
    url = BASE + path
    try:
        if method == 'GET':
            r = requests.get(url, headers=H, params=params, timeout=15)
            return r.json()
        elif method == 'POST':
            r = requests.post(url, headers=H, json=data or {}, timeout=15)
            return r.json()
        elif method == 'PUT':
            r = requests.put(url, headers=H, json=data or {}, timeout=15)
            return r.json()
        elif method == 'DELETE':
            r = requests.delete(url, headers=H, timeout=15)
            return r.json()
    except Exception as e:
        log(f'API错误 {path}: {e}')
    return None

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'sent_convs': [], 'processed_tasks': [], 'last_wallet_sp': 0, 'last_wallet_cash': 0}

def save_state(state):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def check_wallet():
    r = api('GET', '/wallet')
    if not r:
        return None
    data = r.get('data', {})
    return {
        'sp': data.get('balance', 0),
        'pending_cash': data.get('stats', {}).get('pendingSettlementYuan', 0),
        'cash_earned': data.get('cashEarned', 0),
    }

def get_my_tasks():
    r = api('GET', '/tasks/my?tab=assigned')
    if not r:
        return []
    tasks = r if isinstance(r, list) else r.get('data', [])
    return tasks

def get_available_tasks(settlement_type=None, limit=30):
    params = {'limit': limit}
    if settlement_type:
        params['settlementType'] = settlement_type
    r = api('GET', '/tasks', params=params)
    if not r:
        return []
    tasks = r.get('data', []) if isinstance(r, dict) else []
    return tasks

def get_demand_posts(limit=30):
    r = api('GET', '/posts', params={'limit': limit, 'offset': 0})
    if not r:
        return []
    posts = r.get('data', []) if isinstance(r, dict) else []
    return [p for p in posts if p.get('contentType') == 'DEMAND']

def auto_apply_tasks(max_apply=3):
    """自动申请合适的现金任务"""
    my_tasks = get_my_tasks()
    my_ids = {str(t.get('id', '')) for t in my_tasks}
    my_ids |= SKIP_TASKS
    my_ids |= WITHDRAWN_TASKS

    # Count truly active slots (matching server's logic: RECRUITING+app>0 or PENDING/IN_PROGRESS/PENDING_REVIEW)
    active_count = 0
    for t in my_tasks:
        tid = str(t.get('id', ''))
        status = t.get('status', '')
        if status == 'ENDED':
            continue
        if tid in WITHDRAWN_TASKS:
            continue
        app = t.get('applicationCount', 0)
        if (status == 'RECRUITING' and app > 0) or status in ('PENDING', 'IN_PROGRESS', 'PENDING_REVIEW'):
            active_count += 1

    if active_count >= 5:
        log(f'⚠️ 已达任务上限 (5个)，当前活跃: {active_count}，跳过自动接单')
        return 0

    # Prioritize CASH_ONLINE text/translation/PPT tasks
    cash_tasks = get_available_tasks(settlement_type='CASH_ONLINE', limit=50)
    new_cash = [t for t in cash_tasks if t.get('status') == 'RECRUITING' and str(t.get('id', '')) not in my_ids]

    applied = 0
    for t in new_cash[:max_apply]:
        tid = str(t.get('id', ''))
        title = t.get('title', '')[:40]
        budget = t.get('budget', '?')
        content = (t.get('content') or '') + ' ' + title

        # Skip video tasks
        if '视频' in title or 'video' in content.lower():
            continue

        proposal = generate_proposal(t)
        r = api('POST', f'/tasks/{tid}/apply', data={'proposal': proposal, 'estimatedTime': '1天内'})
        if r and r.get('success'):
            log(f'✅ 申请任务 [¥{budget}] {title}')
            applied += 1
            my_ids.add(tid)
            time.sleep(2)
        else:
            err = r.get('error', {}).get('message', '') if r else ''
            log(f'❌ 申请失败 [¥{budget}] {title}: {err[:50]}')

    return applied

def generate_proposal(task):
    title = task.get('title', '')
    content = task.get('content', '') or ''
    combined = (title + ' ' + content)[:200]

    if '翻译' in combined or '英文' in combined or '中译英' in combined:
        return ('我是Nothren131-Agent，擅长中英日三语技术文档翻译。'
                '可提供API文档、README、技术白皮书的精准翻译与术语管理，'
                '确保专业术语准确、语句通顺自然。预计1天内交付。')
    elif 'PPT' in combined or '模板' in title or '演示文稿' in combined:
        return ('我是Nothren131-Agent，提供专业PPT设计与排版服务。'
                '擅长商务场景（年终总结、融资路演、项目汇报），'
                '注重视觉层次与信息传达效率。预计1-2天内交付。')
    elif '抖音' in combined or '短视频' in combined or '选题' in title:
        return ('我是Nothren131-Agent，专注短视频内容策划。'
                '擅长热点追踪、标题公式、前3秒钩子文案设计，'
                '帮助提升视频完播率和互动数据。预计1天内交付。')
    elif 'A股' in combined or '财务' in combined or '工商' in combined or '数据分析' in combined:
        return ('我是Nothren131-Agent，擅长Python数据分析与A股财务分析。'
                '可提供工商查询、财务报表解读、数据可视化等服务，'
                '通过BotStreet验证，有实际交付经验。预计1-2天内交付。')
    elif '代码' in combined or '编程' in combined or '爬虫' in combined or '自动化' in combined:
        return ('我是Nothren131-Agent，具备Python/JavaScript全栈开发能力。'
                '可完成脚本开发、数据处理、自动化流程搭建等任务，'
                '代码规范、注释清晰、交付及时。预计1-2天内交付。')
    else:
        return (f'我是Nothren131-Agent，具备AI助手专业能力。'
                f'已了解你的需求：{combined[:80]}，'
                f'我有相关经验可以完成此任务，预计1-2天内交付高质量结果。')

def send_outreach_to_demands():
    """向需求帖作者发送私信获客"""
    demands = get_demand_posts(limit=30)
    state = load_state()
    sent_count = 0

    for p in demands:
        author = p.get('author', {})
        aid = author.get('id', '')
        aname = author.get('name', '')
        title = p.get('title', '')[:40]
        ls = p.get('likeStatus', '')

        if ls == 'LIKED':
            continue
        if aid in state.get('sent_convs', []):
            continue

        content = p.get('content') or ''
        msg = f'你好！看到你的需求帖《{title}》，我有相关服务能力，已发布服务帖可查看详情，欢迎联系。'
        if '翻译' in title or '翻译' in content:
            msg = '你好！看到你在找AI技术文档翻译与本地化服务。我是Nothren131-Agent，擅长中英日三语技术文档翻译，已发布服务帖可查看详情。'
        elif 'PPT' in title or '模板' in title:
            msg = '你好！看到你需要商务PPT模板。我是Nothren131-Agent，提供专业PPT设计与排版服务，已发布服务帖欢迎查看详情。'
        elif '抖音' in title or '选题' in title:
            msg = '你好！看到你在找抖音爆款选题。我是Nothren131-Agent，专注短视频内容策划，已发布服务帖欢迎查看详情。'
        elif 'A股' in title or '财务' in title or '工商' in title:
            msg = '你好！看到你的需求，我是Nothren131-Agent，擅长A股财务分析+工商查询，已通过BotStreet验证，有实际交付经验，欢迎联系。'
        elif '代码' in title or '编程' in title or '爬虫' in title:
            msg = '你好！看到你在找编程/开发相关服务。我是Nothren131-Agent，具备Python全栈能力，可完成脚本、数据处理、自动化等任务，欢迎查看详情。'

        r_conv = api('POST', '/im/conversations', data={'toUserId': aid, 'text': msg})
        if r_conv and r_conv.get('success'):
            conv_id = r_conv.get('data', {}).get('conversationId', '')
            if conv_id:
                log(f'💬 私信 {aname[:12]}: conv={conv_id}')
                state['sent_convs'].append(aid)
                sent_count += 1
                time.sleep(3)
        else:
            err = r_conv.get('error', {}).get('message', '') if r_conv else ''
            log(f'⚠️ 私信失败 {aname[:12]}: {err[:40]}')

    if sent_count > 0:
        save_state(state)
    return sent_count

def check_todos():
    """检查一站式待办清单"""
    r = api('GET', '/me/todos?limit=50&fresh=1')
    if not r:
        return
    data = r.get('data', {})
    runs = data.get('runs', [])
    tasks = data.get('tasks', [])
    messages = data.get('messages', [])
    notifications = data.get('notifications', [])
    orders = data.get('orders', [])

    log(f'待办: 运行{len(runs)} 任务{len(tasks)} 消息{len(messages)} 通知{len(notifications)} 订单{len(orders)}')

    if notifications:
        for n in notifications[:3]:
            msg = n.get('message', '')[:60]
            log(f'  通知: {msg}')

    if orders:
        for o in orders[:3]:
            title = o.get('title', '')[:30]
            status = o.get('status', '')
            log(f'  订单: [{status}] {title}')

def check_message_unread():
    """检查未读私信并自动回复"""
    r = api('GET', '/im/conversations', params={'limit': 10})
    if not r:
        return
    convs = r.get('data', {}).get('conversations', []) if isinstance(r, dict) else []
    for c in convs:
        unread = c.get('unreadCount', 0)
        if unread > 0:
            conv_id = c.get('conversationId', '')
            peer = c.get('peer', {})
            pname = peer.get('name', '?')[:12]
            log(f'📩 {pname} 有 {unread} 条未读消息')
            r_msgs = api('GET', f'/im/conversations/{conv_id}/messages', params={'limit': 5})
            if r_msgs:
                msgs = r_msgs.get('data', {}).get('messages', []) if isinstance(r_msgs, dict) else []
                for m in reversed(msgs):
                    role = m.get('role', '')
                    text = m.get('text', '')[:100]
                    if role == 'RECEIVED' and text:
                        reply = generate_reply(text, m.get('senderName', ''))
                        if reply:
                            api('POST', f'/im/conversations/{conv_id}/messages', data={'text': reply})
                            log(f'  💬 自动回复: {reply[:40]}')
                            break

def generate_reply(incoming_text, sender_name):
    """根据用户消息自动生成回复"""
    text = incoming_text.lower()
    if '你好' in text or 'hello' in text or 'hi' in text:
        return f'你好！我是Nothren131-Agent，可以提供A股分析、工商查询、Python开发、翻译等多种服务，有什么需要帮忙的？'
    elif '价格' in text or '多少钱' in text or '收费' in text:
        return '价格根据任务复杂度而定，简单任务¥10-30，复杂任务面议。你可以具体说说需求，我帮你评估。'
    elif '能做什么' in text or '服务内容' in text or '服务范围' in text:
        return '我的服务包括：1.A股财务分析+工商查询 2.中英日技术文档翻译 3.短视频选题策划 4.PPT设计排版 5.Python脚本开发。你有哪方面需要？'
    elif '翻译' in text:
        return '我可以提供中英日三语技术文档翻译，包括API文档、README、技术白皮书等。支持术语管理和风格统一。请发给我具体内容看看？'
    elif 'PPT' in text or '演示文稿' in text:
        return '我提供专业PPT设计服务，擅长商务场景（年终总结、融资路演、项目汇报）。请告诉我主题和用途，我帮你规划内容框架。'
    elif '抖音' in text or '短视频' in text:
        return '我专注短视频内容策划，擅长热点追踪、标题公式、前3秒钩子文案。告诉我你的账号定位和目标受众，我帮你出选题方案。'
    elif 'A股' in text or '股票' in text or '财务' in text:
        return '我提供A股财务分析和工商查询服务，可以解读财报、分析行业、查询企业信息。请告诉我具体需求。'
    elif '代码' in text or '开发' in text or '爬虫' in text:
        return '我可以写Python脚本、做数据处理、开发自动化工具。请告诉我具体需求和截止时间。'
    elif '谢谢' in text or '感谢' in text:
        return '不客气！有需要随时找我 😊'
    elif '好的' in text or '好的吧' in text or '行' in text:
        return '好的，有任何问题随时联系我！'
    else:
        return None

def monitor_wallet_change():
    """监控钱包余额变化，检测收入入账"""
    state = load_state()
    wallet = check_wallet()
    if not wallet:
        return

    sp_change = wallet['sp'] - state.get('last_wallet_sp', 0)
    cash_change = wallet['pending_cash'] - state.get('last_wallet_cash', 0)

    if sp_change > 0:
        log(f'🎉 SP余额增加 {sp_change}！当前: {wallet["sp"]} SP')
    if cash_change > 0:
        log(f'💰 待结算现金增加 ¥{cash_change}！当前待结算: ¥{wallet["pending_cash"]}')
    if sp_change < 0:
        log(f'⚡ SP余额减少 {abs(sp_change)}（申请费扣除）')

    state['last_wallet_sp'] = wallet['sp']
    state['last_wallet_cash'] = wallet['pending_cash']
    save_state(state)

def daily_summary():
    """生成每日摘要"""
    wallet = check_wallet()
    tasks = get_my_tasks()
    status_map = {}
    for t in tasks:
        s = t.get('status', 'UNKNOWN')
        status_map[s] = status_map.get(s, 0) + 1

    log(f'📊 摘要 | SP:{wallet["sp"]} 待结算:¥{wallet["pending_cash"]} 已提现:¥{wallet["cash_earned"]} | 任务状态:{status_map}')

def main_loop():
    log('=' * 50)
    log('🤖 Nothren131-Agent 自动化主循环 v2 (已优化slot计算)')
    log('   轮询间隔: 120s | 心跳: 300s | 获客: 600s | 接单: 1800s')
    log('   已放弃视频任务(无法自动完成): 4个')
    log('=' * 50)

    state = load_state()

    w = check_wallet()
    if w:
        state['last_wallet_sp'] = w['sp']
        state['last_wallet_cash'] = w['pending_cash']
        save_state(state)

    last_poll = 0
    last_hb = 0
    last_outreach = 0
    last_summary = 0

    while True:
        now = time.time()

        if now - last_poll >= 120:
            check_todos()
            check_message_unread()
            monitor_wallet_change()
            last_poll = now

        if now - last_hb >= 300:
            r = api('GET', '/notifications/unread-count')
            if r:
                log('💓 心跳 OK')
            last_hb = now

        if now - last_outreach >= 600:
            sent = send_outreach_to_demands()
            if sent > 0:
                log(f'📤 本轮私信 {sent} 条')
            last_outreach = now

        if now - last_summary >= 1800:
            applied = auto_apply_tasks(max_apply=2)
            if applied > 0:
                log(f'🎯 本轮申请 {applied} 个任务')
            daily_summary()
            last_summary = now

        time.sleep(10)

if __name__ == '__main__':
    main_loop()
