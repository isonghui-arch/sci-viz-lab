// 滑动变阻器场景：通过改变接入电路的电阻丝长度来调节电阻，
//   进而改变电路电流与灯泡亮度。演示“接入越长 → 电阻越大 → 电流越小 → 灯越暗”。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .rh-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .rh-section-nav a {
      flex: 0 0 auto;
      padding-bottom: 12px;
      font-family: var(--sans);
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--muted);
      border-bottom: 2px solid transparent;
    }
    .rh-section-nav a:hover,
    .rh-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .rh-scene #rh-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .rh-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .rh-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .rh-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .rh-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .rh-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "rh",
    figureNo: "FIG. 18 / PHYSICS",
    titleHTML: "滑动变阻器<br />一滑就调亮的灯",
    lead: "电阻丝接得越长，电阻越大，电流越小，灯就越暗。滑片一推一拉，就在悄悄改变“拦路”的长度。",
    heroNote: "拖动滑片 · 看电流与亮度变化 · 电阻实时读数",
    navLabel: "滑动变阻器章节导航",
    navItems: [
      { id: "rh-intuition", label: "直觉" },
      { id: "rh-define", label: "定义" },
      { id: "rh-lab", label: "互动实验" },
      { id: "rh-limits", label: "边界说明" },
    ],
    firstAnchor: "rh-intuition",
  })}
    <div class="lab-shell" aria-label="滑动变阻器交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="rh-canvas" width="640" height="430" aria-label="滑动变阻器电路示意图"></canvas>
        <div class="canvas-caption">
          <span>滑片右移→接入电阻丝变长→电阻变大→电流变小→灯变暗</span>
          <span id="rh-status">调节中</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="rh-pos"><span>滑片位置</span><output id="rh-pos-output">0%</output></label>
        <input id="rh-pos" type="range" min="0" max="100" step="1" value="0" />
        <div class="rh-readout" id="rh-readout"></div>
        <div class="lab-actions">
          <button id="rh-anim" class="accent-button" type="button" aria-pressed="true">自动扫动</button>
          <button id="rh-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="rh-intuition" aria-labelledby="rh-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="rh-intuition-title">直觉：为什么推一下灯就变</h2>
      <p>电阻丝像一条“拦路”的长队，越长越难走。</p></div>
    </div>
    <p>
      把电阻丝想成一条狭窄的通道：电流要穿过去。通道<b>越长</b>，能并排通过的电子就越少，
      “阻力”（电阻）就越大，流过灯泡的电流就越小，灯自然就<b>暗</b>。滑动变阻器的滑片就像在通道上
      来回滑动的闸门——它决定了“有多少长度的电阻丝被算进电路里”。滑片一推，接入变短，灯变亮；
      一拉，接入变长，灯变暗。
    </p>
  </section>

  <section class="section-pad" id="rh-define" aria-labelledby="rh-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="rh-define-title">定义：电阻与电流的关系</h2>
      <p>长度决定电阻，电阻决定电流。</p></div>
    </div>
    <p>
      导体的电阻与其长度成正比（材料、横截面积不变时）：<b>R ∝ L</b>。在电压 U 固定时，
      由欧姆定律 <b>I = U / R</b> 可知，电阻越大电流越小。滑动变阻器正是利用这一点，
      通过连续改变接入长度，实现电流的<b>无级调节</b>——这是调光台灯、音量旋钮背后的同一原理。
    </p>
    <p style="margin-top:12px">接法要点：必须“一上一下”接两个接线柱，才能让滑片真正改变接入长度；若接两上端则电阻为零，接两下端则为一固定最大电阻。</p>
  </section>

  <section class="section-pad" id="rh-lab" aria-labelledby="rh-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="rh-lab-title">互动实验</h2>
      <p>拖动滑片，看灯与电流如何呼应。</p></div>
    </div>
    <p>
      上方电路里，电源、电流表、灯泡与滑动变阻器串成一圈。拖动右侧“滑片位置”滑块，
      或直接点“自动扫动”让滑片来回移动。你会看到：灯泡随接入长度变化而连续明暗，
      电流表的示数同步升降，流动的小点（电子）速度也在变——电流小，点就走得慢。
    </p>
  </section>

  <section class="section-pad" id="rh-limits" aria-labelledby="rh-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="rh-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实电路的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>热源</span><h3>忽略发热</h3><p>真实电阻丝通电会发热、电阻随温度略变，本模型假定电阻仅由长度决定。</p></article>
      <article><span>灯泡</span><h3>线性近似</h3><p>灯丝电阻其实随温度非线性变化，这里用亮度正比于电流示意。</p></article>
      <article><span>接法</span><h3>已固定</h3><p>本图采用“一上一下”标准接法，未演示错误接法导致的零/最大电阻情形。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

// 电路关键坐标
const RHEO_X1 = 360, RHEO_X2 = 600, RHEO_Y = 320; // 电阻丝水平段
const TOP_Y = 120;                                  // 上方导线
const LOOP_PTS = [
  [120, 380], [120, 120], [260, 120], [400, 120], [400, 320], // 上半圈到变阻器左
  [600, 320], [600, 380], [120, 380],                         // 下半圈闭合
];

function loopLength(pts) {
  let L = 0; const seg = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(d); L += d;
  }
  return { L, seg };
}
function pointAt(pts, seg, frac) {
  const total = seg.reduce((s, x) => s + x, 0);
  let target = (frac % 1 + 1) % 1 * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      const a = pts[i], b = pts[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    target -= seg[i];
  }
  return pts[0];
}

function setup() {
  state = {
    playing: true,
    pos: 0,        // 滑片位置 0..1（0=最左，接入最短）
    auto: true,
    dir: 1,
    electrons: [],
    loop: loopLength(LOOP_PTS),
  };
  for (let k = 0; k < 26; k++) state.electrons.push(k / 26);
}

function resistance() {
  // 接入长度比例 = pos，电阻从 2Ω 到 20Ω
  return 2 + state.pos * 18;
}
function current() {
  const U = 6; // 电源 6V
  return U / resistance();
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 电阻丝（变阻器）
  const px = RHEO_X1 + state.pos * (RHEO_X2 - RHEO_X1); // 滑片 x
  ctx.strokeStyle = "#8a7a5c"; ctx.lineWidth = 8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(RHEO_X1, RHEO_Y); ctx.lineTo(RHEO_X2, RHEO_Y); ctx.stroke();
  // 已接入部分高亮
  ctx.strokeStyle = "#b41f24"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(RHEO_X1, RHEO_Y); ctx.lineTo(px, RHEO_Y); ctx.stroke();
  ctx.lineCap = "butt";

  // 滑片（箭头 + 引线到上轨）
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, RHEO_Y - 18); ctx.lineTo(px, TOP_Y + 0); // 引到上轨
  ctx.moveTo(px - 10, RHEO_Y - 8); ctx.lineTo(px + 10, RHEO_Y - 8); ctx.lineTo(px, RHEO_Y - 20); ctx.closePath();
  ctx.fillStyle = "#07182d"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(RHEO_X1, RHEO_Y); ctx.lineTo(px, RHEO_Y); ctx.stroke();

  // 主回路导线
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath();
  LOOP_PTS.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.stroke();

  // 电源（电池）
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 360); ctx.lineTo(120, 400);
  ctx.moveTo(110, 372); ctx.lineTo(130, 372); // 长板 +
  ctx.moveTo(116, 384); ctx.lineTo(124, 384); // 短板 -
  ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("电源 6V", 120, 420);

  // 电流表
  ctx.beginPath(); ctx.arc(260, 120, 22, 0, Math.PI * 2);
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = "#185FA5"; ctx.fillText("A", 260, 125);

  // 灯泡（亮度随电流）
  const I = current();
  const bright = Math.min(1, I / 1.2);
  ctx.save();
  ctx.globalAlpha = 0.25 + 0.6 * bright;
  ctx.fillStyle = "#ffd24d";
  ctx.beginPath(); ctx.arc(400, 120, 18 + 6 * bright, 0, Math.PI * 2); ctx.fill();
  if (bright > 0.15) {
    ctx.globalAlpha = 0.18 * bright;
    ctx.beginPath(); ctx.arc(400, 120, 34 + 10 * bright, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(400, 120, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.fillText("灯泡", 400, 158);

  // 变阻器标注
  ctx.fillStyle = "#8a7a5c"; ctx.font = "12px var(--sans)";
  ctx.fillText("电阻丝（接入段红色）", 480, 300);
  ctx.fillStyle = "#b41f24"; ctx.fillText("滑片", px, RHEO_Y + 24);

  // 电子（电流）流动
  const speed = 0.04 * (0.3 + I * 0.9);
  for (const e of state.electrons) {
    const [x, y] = pointAt(LOOP_PTS, state.loop.seg, e);
    ctx.fillStyle = "#185FA5";
    ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
  }

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("rh-readout");
  if (!el) return;
  const R = resistance(), I = current();
  const bright = Math.round(Math.min(1, I / 1.2) * 100);
  el.innerHTML =
    `<div class="ro-item"><span>电阻 R</span><span>${R.toFixed(1)} Ω</span></div>` +
    `<div class="ro-item"><span>电流 I</span><span>${I.toFixed(2)} A</span></div>` +
    `<div class="ro-item verdict"><span>灯泡亮度约 ${bright}%　（U=6V 恒定）</span></div>`;
  const status = document.getElementById("rh-status");
  if (status) status.textContent = `接入 ${Math.round(state.pos * 100)}%`;
}

export default {
  id: "sliding-rheostat",
  name: "滑动变阻器",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#rh-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const pos = document.getElementById("rh-pos");
    const posOut = document.getElementById("rh-pos-output");
    pos.addEventListener("input", () => {
      state.pos = Number(pos.value) / 100;
      posOut.textContent = `${pos.value}%`;
      state.auto = false;
      const btn = document.getElementById("rh-anim");
      btn.textContent = "自动扫动"; btn.setAttribute("aria-pressed", "false");
      draw();
    });

    const animBtn = document.getElementById("rh-anim");
    animBtn.addEventListener("click", () => {
      state.auto = !state.auto;
      animBtn.textContent = state.auto ? "自动扫动" : "已暂停";
      animBtn.setAttribute("aria-pressed", String(state.auto));
    });
    document.getElementById("rh-reset").addEventListener("click", () => {
      state.pos = 0; pos.value = 0; posOut.textContent = "0%";
      state.auto = true;
      animBtn.textContent = "自动扫动"; animBtn.setAttribute("aria-pressed", "true");
      draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.auto) return;
    state.pos += state.dir * 0.25 * delta;
    if (state.pos >= 1) { state.pos = 1; state.dir = -1; }
    if (state.pos <= 0) { state.pos = 0; state.dir = 1; }
    const posEl = document.getElementById("rh-pos");
    if (posEl) { posEl.value = Math.round(state.pos * 100); document.getElementById("rh-pos-output").textContent = `${Math.round(state.pos * 100)}%`; }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
