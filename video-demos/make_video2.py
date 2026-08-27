"""用 moviepy 从帧序列生成视频"""
import os
from moviepy import ImageSequenceClip

OUT_DIR = r"E:\智能脑\展示系统\portfolio\video-demos"
FRAME_DIR = r"E:\portfolio_vid_frames"
OUT_VIDEO = os.path.join(OUT_DIR, "portfolio-intro.mp4")

files = sorted([f for f in os.listdir(FRAME_DIR) if f.endswith(".png")])
print(f"Loading {len(files)} frames...")

clip = ImageSequenceClip([os.path.join(FRAME_DIR, f) for f in files], fps=24)
print(f"Duration: {clip.duration:.1f}s")
print("Writing video...")
clip.write_videofile(OUT_VIDEO, fps=24, codec="libx264", audio=False, preset="medium")
size = os.path.getsize(OUT_VIDEO)
print(f"OK: {OUT_VIDEO} ({size/1024/1024:.1f} MB)")
clip.close()
