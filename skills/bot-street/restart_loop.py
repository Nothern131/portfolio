"""重启agent_loop.py主循环"""
import subprocess, sys, time

# 杀掉旧的进程
import os
os.system('taskkill /F /IM python.exe 2>nul')
time.sleep(1)

# 启动新的
proc = subprocess.Popen(
    [sys.executable, 'agent_loop.py'],
    cwd=r'E:\智能脑\展示系统\portfolio\skills\bot-street',
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
print(f'agent_loop started, PID={proc.pid}')
time.sleep(3)

# 检查是否还在跑
if proc.poll() is None:
    print('agent_loop is running')
else:
    stdout, stderr = proc.communicate()
    print(f'agent_loop exited: {stderr.decode()[:200]}')
