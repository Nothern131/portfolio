import * as THREE from "three";
import { ARCHIVES, GROUPS, type Archive } from "./data.ts";

// ─── state ──────────────────────────────────────────
let colIdx = 0;
let cardIdx = 0;
let detailOpen = false;

// ─── 3D scene setup ─────────────────────────────────
const sceneEl = document.getElementById("scene")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sceneEl.clientWidth, sceneEl.clientHeight);
renderer.setClearColor(0x0a0a0a);
sceneEl.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, sceneEl.clientWidth / sceneEl.clientHeight, 0.1, 100);
camera.position.set(0, 0.8, 8);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0a0a, 12, 20);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const keyLight = new THREE.DirectionalLight(0xf0a500, 0.35);
keyLight.position.set(4, 6, 8);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x33ff88, 0.15, 20);
fillLight.position.set(-4, 2, 4);
scene.add(fillLight);

// ─── geometry constants ─────────────────────────────
const CARD_W = 2.2, CARD_H = 3.0, CARD_D = 0.12;
const CARD_GAP = 0.35;

// ─── build 3D archive cabinet ────────────────────────
const cabinetGroup = new THREE.Group();
scene.add(cabinetGroup);

// base platform
const platformGeo = new THREE.BoxGeometry(12, 0.15, 5);
const platformMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
const platform = new THREE.Mesh(platformGeo, platformMat);
platform.position.y = -1.2;
cabinetGroup.add(platform);

// back wall
const backWallGeo = new THREE.BoxGeometry(12, 8, 0.1);
const backWallMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.95 });
const backWall = new THREE.Mesh(backWallGeo, backWallMat);
backWall.position.set(0, 2.5, -2.5);
cabinetGroup.add(backWall);

// side walls
const sideMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.95 });
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 8, 5), sideMat);
leftWall.position.set(-6, 2.5, 0);
cabinetGroup.add(leftWall);
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 8, 5), sideMat);
rightWall.position.set(6, 2.5, 0);
cabinetGroup.add(rightWall);

// shelf
const shelfGeo = new THREE.BoxGeometry(11.8, 0.08, 4.8);
const shelfMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.2 });
const shelf = new THREE.Mesh(shelfGeo, shelfMat);
shelf.position.y = -0.6;
cabinetGroup.add(shelf);

// amber edge glow on shelf front
const edgeGlowGeo = new THREE.BoxGeometry(11.8, 0.04, 0.05);
const edgeGlowMat = new THREE.MeshBasicMaterial({ color: 0xf0a500, transparent: true, opacity: 0.4 });
const edgeGlow = new THREE.Mesh(edgeGlowGeo, edgeGlowMat);
edgeGlow.position.set(0, -0.58, 2.35);
cabinetGroup.add(edgeGlow);

// ─── archive cards (3D boxes on shelf) ───────────────
interface CardMesh {
  mesh: THREE.Mesh;
  texture: THREE.CanvasTexture;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetRotY: number;
}

const cards: CardMesh[] = [];

function makeCardTexture(a: Archive, focused: boolean): THREE.CanvasTexture {
  const w = 512, h = 680;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;

  // bg
  ctx.fillStyle = focused ? "#1a1505" : "#151515";
  ctx.fillRect(0, 0, w, h);
  // border
  ctx.strokeStyle = focused ? "#f0a500" : "#2a2a2a";
  ctx.lineWidth = focused ? 4 : 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);

  // number
  ctx.font = "bold 64px Courier New";
  ctx.fillStyle = focused ? "#f0a500" : "#666";
  ctx.textAlign = "left";
  ctx.fillText(a.no, 32, 76);

  // tag
  ctx.font = "16px Courier New";
  ctx.fillStyle = "#666";
  ctx.fillText(a.tag, 32, 110);

  // name
  ctx.font = "bold 36px Courier New";
  ctx.fillStyle = focused ? "#c8c8c8" : "#888";
  ctx.fillText(a.name, 32, 170);

  // brief
  ctx.font = "14px Courier New";
  ctx.fillStyle = "#666";
  const briefLines = wrapText(ctx, a.brief, 440);
  briefLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, 32, 210 + i * 22);
  });

  // divider
  ctx.strokeStyle = focused ? "#7a5400" : "#2a2a2a";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(32, 290); ctx.lineTo(w - 32, 290); ctx.stroke();

  // tech
  ctx.font = "13px Courier New";
  ctx.fillStyle = "#555";
  const techStr = a.tech.slice(0, 3).join(" · ");
  ctx.fillText(techStr, 32, 320);

  // status
  ctx.font = "13px Courier New";
  ctx.fillStyle = focused ? "#33ff88" : "#444";
  ctx.fillText("● 已归档", 32, 360);

  // detail hint
  ctx.font = "11px Courier New";
  ctx.fillStyle = focused ? "#7a5400" : "#333";
  ctx.fillText("ENTER → 打开档案", 32, h - 40);
  ctx.fillText("↑ ↓ 切换档案", 32, h - 20);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split("");
  const lines: string[] = [];
  let line = "";
  for (const ch of words) {
    if (ctx.measureText(line + ch).width > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function calcCardTarget(group: string, idx: number, totalInGroup: number): { x: number; y: number; z: number; ry: number } {
  // columns: col-ai → left side, col-qa → right side
  const isLeft = group === "col-ai";
  const groupCenterX = isLeft ? -2.5 : 2.5;

  // spread cards within a column
  const spread = totalInGroup > 1 ? totalInGroup * (CARD_W + CARD_GAP) : 0;
  const startOff = spread > 0 ? -spread / 2 + CARD_W / 2 + CARD_GAP / 2 : 0;
  const x = groupCenterX + startOff + idx * (CARD_W + CARD_GAP);

  // z: slight stagger for depth
  const z = 0.5 + (idx % 2) * 0.15;
  const y = -0.6 + CARD_H / 2; // sit on shelf

  // slight rotation toward camera for front cards
  const ry = 0;

  return { x, y, z, ry };
}

ARCHIVES.forEach((a) => {
  const inGroup = ARCHIVES.filter((x) => x.group === a.group);
  const idxInGroup = inGroup.indexOf(a);
  const target = calcCardTarget(a.group, idxInGroup, inGroup.length);

  const geo = new THREE.BoxGeometry(CARD_W, CARD_H, CARD_D);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x151515,
    roughness: 0.85,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(target.x, target.y, target.z);
  mesh.rotation.y = target.ry;
  mesh.userData.archiveNo = a.no;
  cabinetGroup.add(mesh);

  // front face texture (label plate)
  const texture = makeCardTexture(a, false);
  const labelGeo = new THREE.PlaneGeometry(CARD_W * 0.95, CARD_H * 0.95);
  const labelMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.85,
    metalness: 0.05,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.z = CARD_D / 2 + 0.005;
  mesh.add(label);

  // edge frame (thin box)
  const frameGeo = new THREE.BoxGeometry(CARD_W + 0.04, CARD_H + 0.04, CARD_D - 0.02);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.5,
    metalness: 0.6,
    transparent: true,
    opacity: 0.5,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  mesh.add(frame);

  cards.push({ mesh, texture, targetX: target.x, targetY: target.y, targetZ: target.z, targetRotY: target.ry });
});

// ─── focused card logic ─────────────────────────────
function refresh3D() {
  const g = GROUPS[colIdx];
  const groupArchives = ARCHIVES.filter((a) => a.group === g.id);
  const a = groupArchives[cardIdx];
  if (!a) return;

  // update targets
  cards.forEach((c) => {
    const ar = ARCHIVES.find((x) => x.no === c.mesh.userData.archiveNo)!;
    const inGroup = ARCHIVES.filter((x) => x.group === ar.group);
    const idxInGroup = inGroup.indexOf(ar);
    const isFocused = ar.no === a.no;
    const t = calcCardTarget(ar.group, idxInGroup, inGroup.length);

    // focused card comes forward
    if (isFocused) {
      c.targetX = t.x;
      c.targetY = t.y + 0.3; // lift up
      c.targetZ = 3.5; // closer to camera
      c.targetRotY = 0;
      // update texture to focused state
      c.texture = makeCardTexture(ar, true);
      const label = c.mesh.children[0] as unknown as THREE.Mesh;
      (label.material as THREE.MeshStandardMaterial).map = c.texture;
      (label.material as THREE.MeshStandardMaterial).needsUpdate = true;
      // edge glow
      const frame = c.mesh.children[1] as unknown as THREE.Mesh;
      (frame.material as THREE.MeshStandardMaterial).color.setHex(0xf0a500);
      (frame.material as THREE.MeshStandardMaterial).opacity = 0.8;
    } else {
      c.targetX = t.x;
      c.targetY = t.y;
      c.targetZ = t.z;
      c.targetRotY = t.ry;
      c.texture = makeCardTexture(ar, false);
      const label = c.mesh.children[0] as unknown as THREE.Mesh;
      (label.material as THREE.MeshStandardMaterial).map = c.texture;
      (label.material as THREE.MeshStandardMaterial).needsUpdate = true;
      const frame = c.mesh.children[1] as unknown as THREE.Mesh;
      (frame.material as THREE.MeshStandardMaterial).color.setHex(0x2a2a2a);
      (frame.material as THREE.MeshStandardMaterial).opacity = 0.5;
    }
  });

  // HUD
  document.getElementById("hud-no")!.textContent = a.no;
  document.getElementById("hud-title")!.textContent = a.name;
  document.getElementById("hud-pos")!.textContent = `${g.label} · ${cardIdx + 1}/${groupArchives.length}`;

  // target camera position — look at focused card
  cameraTarget.copy(cards.find((c) => c.mesh.userData.archiveNo === a.no)!.mesh.position);
}

// camera target lerp
const cameraTarget = new THREE.Vector3(0, 0.5, 1.5);
let camFocus = new THREE.Vector3(0, 0.5, 1.5);

// ─── detail ─────────────────────────────────────────
function openDetail(no: string) {
  const a = ARCHIVES.find((x) => x.no === no);
  if (!a) return;
  detailOpen = true;

  document.getElementById("detail-no")!.textContent = a.no;
  document.getElementById("detail-tag")!.textContent = a.tag;
  document.getElementById("detail-name")!.textContent = a.name;
  document.getElementById("detail-group")!.textContent =
    GROUPS.find((g) => g.id === a.group)?.label ?? "";
  document.getElementById("detail-summary")!.innerHTML = formatText(a.summary);
  document.getElementById("detail-tech")!.innerHTML = a.tech
    .map((t) => `<span style="display:inline-block;padding:2px 8px;border:1px solid var(--border);font-size:11px;margin:2px 4px 2px 0">${t}</span>`)
    .join("");
  document.getElementById("detail-metrics")!.innerHTML = a.metrics
    .map((m) => `<div style="margin-bottom:6px">▸ ${m}</div>`)
    .join("");
  document.getElementById("detail-content")!.innerHTML = a.content.map(formatText).join("");

  const links = document.getElementById("detail-links")!;
  links.innerHTML = a.links
    .map(
      (l) =>
        `<a href="${l.url}" target="_blank" rel="noopener" class="detail-link">${l.label}</a>`
    )
    .join("");

  const all = ARCHIVES;
  const cur = all.indexOf(a);
  const prevBtn = document.getElementById("detail-prev") as HTMLButtonElement;
  const nextBtn = document.getElementById("detail-next") as HTMLButtonElement;
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = cur === all.length - 1;
  document.getElementById("detail-center")!.textContent = `${cur + 1} / ${all.length}`;

  document.getElementById("detail")!.classList.add("show");
}

function closeDetail() {
  detailOpen = false;
  document.getElementById("detail")!.classList.remove("show");
}

function navigateDetail(dir: number) {
  if (!detailOpen) return;
  const all = ARCHIVES;
  const cur = all.findIndex((a) => a.no === document.getElementById("detail-no")!.textContent);
  const next = all[cur + dir];
  if (next) openDetail(next.no);
}

// ─── keyboard ───────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (detailOpen) {
    if (e.key === "Escape") closeDetail();
    else if (e.key === "ArrowLeft") navigateDetail(-1);
    else if (e.key === "ArrowRight") navigateDetail(1);
    return;
  }

  const g = GROUPS[colIdx];
  const archives = ARCHIVES.filter((a) => a.group === g.id);

  if (e.key === "ArrowLeft" && colIdx > 0) {
    colIdx--;
    cardIdx = 0;
    refresh3D();
  } else if (e.key === "ArrowRight" && colIdx < GROUPS.length - 1) {
    colIdx++;
    cardIdx = 0;
    refresh3D();
  } else if (e.key === "ArrowUp" && cardIdx > 0) {
    cardIdx--;
    refresh3D();
  } else if (e.key === "ArrowDown" && cardIdx < archives.length - 1) {
    cardIdx++;
    refresh3D();
  } else if (e.key === "Enter") {
    openDetail(archives[cardIdx]?.no ?? "");
  }
});

// ─── buttons ────────────────────────────────────────
document.getElementById("detail-close")!.addEventListener("click", closeDetail);
document.getElementById("detail-prev")!.addEventListener("click", () => navigateDetail(-1));
document.getElementById("detail-next")!.addEventListener("click", () => navigateDetail(1));
document.getElementById("side-prev")!.addEventListener("click", () => {
  if (colIdx > 0) { colIdx--; cardIdx = 0; refresh3D(); }
});
document.getElementById("side-next")!.addEventListener("click", () => {
  if (colIdx < GROUPS.length - 1) { colIdx++; cardIdx = 0; refresh3D(); }
});

// ─── raycaster for card click ──────────────────────
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener("click", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(cards.map((c) => c.mesh));
  if (hits.length > 0) {
    const no = hits[0].object.userData.archiveNo;
    openDetail(no);
  }
});

// ─── session clock ──────────────────────────────────
const startTime = Date.now();
setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  document.getElementById("clock")!.textContent = `${m}:${s}`;
}, 1000);

// ─── render loop ───────────────────────────────────
const LERP_SPEED = 0.08;

function animate() {
  requestAnimationFrame(animate);

  // lerp cards to targets
  for (const c of cards) {
    c.mesh.position.x += (c.targetX - c.mesh.position.x) * LERP_SPEED;
    c.mesh.position.y += (c.targetY - c.mesh.position.y) * LERP_SPEED;
    c.mesh.position.z += (c.targetZ - c.mesh.position.z) * LERP_SPEED;
    c.mesh.rotation.y += (c.targetRotY - c.mesh.rotation.y) * LERP_SPEED;
  }

  // subtle idle sway
  const t = Date.now() * 0.001;
  cards.forEach((c, i) => {
    if (c.mesh.position.z < 3.0) {
      c.mesh.position.y += Math.sin(t + i * 0.5) * 0.0008;
    }
  });

  // camera: slow orbit + focus on selected card
  if (!detailOpen) {
    // camera looks at focused card, slight orbit
    const orbitAngle = Math.sin(t * 0.15) * 0.3;
    const orbitRadius = 8;
    camera.position.x += (Math.sin(orbitAngle) * orbitRadius * 0.1 - camera.position.x) * 0.02;
    camera.position.y += (0.8 + Math.cos(orbitAngle) * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(camFocus.x, camFocus.y + 0.3, camFocus.z);

    camFocus.lerp(cameraTarget, 0.04);
  }

  renderer.render(scene, camera);
}
animate();

// ─── resize ────────────────────────────────────────
window.addEventListener("resize", () => {
  const w = sceneEl.clientWidth;
  const h = sceneEl.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ─── helpers ────────────────────────────────────────
function formatText(text: string): string {
  return text
    .replace(/```[\s\S]+?```/g, (code) => {
      const inner = code.replace(/^```[\w]*\n?/, "").replace(/`+$/, "");
      return `<pre style="background:#0a0a0a;padding:10px;border:1px solid var(--border);font-size:11px;overflow-x:auto;margin:6px 0">${escHtml(inner)}</pre>`;
    })
    .replace(/`([^`]+)`/g, '<code style="background:var(--border);padding:1px 4px;font-size:11px">$1</code>')
    .replace(/\n/g, "<br>");
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── boot sequence ──────────────────────────────────
const boot = document.getElementById("boot")!;
const app = document.getElementById("app")!;

// initial state
refresh3D();

setTimeout(() => {
  boot.classList.add("fade");
  setTimeout(() => {
    boot.classList.add("off");
    app.classList.add("on");
  }, 800);
}, 3200);
