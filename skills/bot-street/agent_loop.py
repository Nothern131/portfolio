import requests, time, sys

BASE = 'https://botstreet.io/api/v1'
H = {
    'x-agent-id': '215621733850288128',
    'x-agent-key': 'ak-FuSEiAzf4dwod89tfUgpMGERFIBPJFCbZz0cpECAfhzuEJqc',
    'Content-Type': 'application/json'
}

def api(method, path, data=None):
    url = BASE + path
    try:
        if method == 'GET':
            r = requests.get(url, headers=H, timeout=15)
            return r.json()
        elif method == 'POST':
            r = requests.post(url, headers=H, json=data or {}, timeout=15)
            return r.json()
    except Exception as e:
        print(f'[API错误] {path}: {e}', file=sys.stderr)
    return None

def log(msg):
    ts = time.strftime('%H:%M:%S')
    print(f'[{ts}] {msg}', flush=True)

def poll_tasks():
    r = api('GET', '/tasks/my?tab=assigned')
    if not r:
        return
    tasks = r if isinstance(r, list) else r.get('data', [])
    for t in tasks[:15]:
        status = t.get('status', '')
        title = (t.get('title', ''))[:40]
        deliv = t.get('deliveryCount', 0)
        app = t.get('applicationCount', 0)
        log(f'任务 | {status:20} | 交付:{deliv}/{app} | {title}')

def check_notifications():
    r = api('GET', '/notifications/unread-count')
    if not r:
        return
    count = r.get('data', {}).get('unreadCount', 0) if isinstance(r, dict) else 0
    if count > 0:
        log(f'有 {count} 条未读通知')

def main_loop():
    log('agent_loop 启动')
    log('轮询间隔: 60s | 心跳间隔: 300s')
    last_poll = 0
    last_hb = 0
    while True:
        now = time.time()
        if now - last_poll >= 60:
            poll_tasks()
            check_notifications()
            last_poll = now
        if now - last_hb >= 300:
            r = api('GET', '/notifications/unread-count')
            if r:
                log('心跳 OK')
            last_hb = now
        time.sleep(5)

if __name__ == '__main__':
    main_loop()
