// 二力平衡场景：作用在同一物体上的两个力，满足"等大、反向、共线、同体"时物体处于平衡状态。
//   破坏任一条件即失衡：大小不等→沿合力方向加速；作用线不共线→产生力偶使物体转动。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .tfb-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .tfb-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .tfb-section-nav a:hover, .tfb-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .tfb-scene #tfb-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .tfb-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .tfb-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .tfb-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .tfb-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .tfb-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
    .control-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 10px 0 4px; }
    .control-row span { font-family: var(--sans); font-size: 13px; color: var(--muted); }
    .control-row output { font-family: var(--mono, monospace); font-size: 13px; color: var(--ink); }
  </style>
  ${shellHead({
    ns: "tfb",
    figureNo: "FIG. 23 / PHYSICS",
    titleHTML: "二力平衡<br />什么时候才会静止",
    lead: "推箱子的两边：等大、反向、还必须在同一直线上，箱子才乖乖静止。差一个条件，它要么溜走、要么转圈。",
    heroNote: "调两个力的大小与作用线 · 看箱子平衡/加速/转动",
    navLabel: "二力平衡章节导航",
    navItems: [
      { id: "tfb-intuition", label: "直觉" },
      { id: "tfb-define", label: "定义" },
      { id: "tfb-lab", label: "互动实验" },
      { id: "tfb-limits", label: "边界说明" },
    ],
    firstAnchor: "tfb-intuition",
  })}
    <div class="lab-shell" aria-label="二力平衡交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="tfb-canvas" width="640" height="430" aria-label="二力平衡示意图"></canvas>
        <div class="canvas-caption">
          <span>等大·反向·共线 → 平衡　|　不等 → 加速　|　不共线 → 转动</span>
          <span id="tfb-status">平衡</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="tfb-f1"><span>力 F₁（向右）</span><output id="tfb-f1-output">5.0 N</output></label>
        <input id="tfb-f1" type="range" min="0" max="10" step="0.5" value="5" />
        <label class="control-row" for="tfb-f2"><span>力 F₂（向左）</span><output id="tfb-f2-output">5.0 N</output></label>
        <input id="tfb-f2" type="range" min="0" max="10" step="0.5" value="5" />
        <label class="control-row"><span>两力作用线</span>
          <button id="tfb-line" class="accent-button" type="button" aria-pressed="true">共线</button>
        </label>
        <div class="tfb-readout" id="tfb-readout"></div>
        <div class="lab-actions">
          <button id="tfb-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="tfb-intuition" aria-labelledby="tfb-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="tfb-intuition-title">直觉：两边较劲的箱子</h2>
      <p>你从左边推、同伴从右边推，箱子动不动看默契。</p></div>
    </div>
    <p>
      想象一个箱子，你用 F₁ 从左边往右推，同伴用 F₂ 从右边往左推。只有当你们<b>用一样的力气、朝相反方向、还推在同一高度的直线上</b>，
      箱子才纹丝不动——这就是<b>二力平衡</b>。只要有一个条件不满足：力气一大一小，箱子就朝大的一边溜；
      俩力一样大却推在高低不同的位置，箱子不会被推开，却会<b>原地打转</b>（力偶）。
    </p>
  </section>

  <section class="section-pad" id="tfb-define" aria-labelledby="tfb-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="tfb-define-title">定义：平衡的四个条件</h2>
      <p>等大、反向、共线、同体。</p></div>
    </div>
    <p>
      作用在同一物体上的两个力，若<b>大小相等、方向相反、作用在同一直线上</b>（且当然作用在同一物体上），
      则合力为零，物体处于平衡状态——原来静止的保持静止，原来运动的保持匀速直线运动。这就是<b>二力平衡条件</b>。
      悬挂的灯笼、静止在桌面上的书，都受重力与支持力这一对平衡力。
    </p>
  </section>

  <section class="section-pad" id="tfb-lab" aria-labelledby="tfb-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="tfb-lab-title">互动实验</h2>
      <p>拖动两个力的滑块，再点共线/错开试试。</p></div>
    </div>
    <p>
      拉动「力 F₁」和「力 F₂」滑块改变两边大小。当<b>等大且共线</b>时箱子静止；改小任一边，箱子立即朝大的一边加速滑动；
      点「共线」按钮切到「错开」，让 F₂ 推在<b>更高</b>的位置——此时即使两力等大，箱子也会<b>转动</b>，
      直观看到「作用线必须共线」这一常被忽略的条件。
    </p>
  </section>

  <section class="section-pad" id="tfb-limits" aria-labelledby="tfb-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="tfb-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实受力分析的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>摩擦</span><h3>未计入</h3><p>真实地面有摩擦，本模型只关注两个外力，默认光滑水平面。</p></article>
      <article><span>转动</span><h3>示意转速</h3><p>「错开」时的转动速度仅为示意，未代入真实力臂与转动惯量。</p></article>
      <article><span>多力</span><h3>仅两力</h3><p>现实物体常受三力以上，本模型聚焦最基础的两力情形。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() { state = { f1: 5, f2: 5, collinear: true, x: 0, vx: 0, angle: 0, angVel: 0 }; }

function arrow(x1, y1, x2, y2, color, w) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1), h = 9;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4));
  ctx.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 参考水平线
  ctx.strokeStyle = "rgba(120,120,120,0.25)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, 250); ctx.lineTo(600, 250); ctx.stroke();

  const cx = 320 + state.x, cy = 250;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(state.angle);
  // 箱子
  ctx.fillStyle = "#e9e2d2"; ctx.strokeStyle = "#07182d"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-45, -35, 90, 70, 8) : ctx.rect(-45, -35, 90, 70); ctx.fill(); ctx.stroke();
  // F₁（红，向右）
  const L1 = state.f1 * 8;
  arrow(-45, 0, -45 + L1, 0, "#b41f24", 4);
  // F₂（蓝，向左，错开时上移）
  const L2 = state.f2 * 8;
  const yoff = state.collinear ? 0 : -35;
  arrow(45, yoff, 45 - L2, yoff, "#185FA5", 4);
  ctx.restore();

  // 力标签
  ctx.fillStyle = "#b41f24"; ctx.font = "13px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText("F₁", cx - 45 + state.f1 * 8 + 4, cy - 8);
  ctx.fillStyle = "#185FA5";
  ctx.fillText("F₂", cx + 45 - state.f2 * 8 - 22, cy - 8 + (state.collinear ? 0 : -35));

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("tfb-readout");
  if (!el) return;
  const net = state.f1 - state.f2;
  let status;
  if (!state.collinear && Math.abs(net) < 0.05 && (state.f1 > 0.05 || state.f2 > 0.05)) status = "转动（两力未共线→力偶）";
  else if (Math.abs(net) < 0.05) status = "平衡·静止（等大反向共线）";
  else if (net > 0) status = "向右加速（F₁>F₂）";
  else status = "向左加速（F₂>F₁）";
  el.innerHTML =
    `<div class="ro-item"><span>力 F₁</span><span>${state.f1.toFixed(1)} N</span></div>` +
    `<div class="ro-item"><span>力 F₂</span><span>${state.f2.toFixed(1)} N</span></div>` +
    `<div class="ro-item"><span>合力</span><span>${net.toFixed(1)} N</span></div>` +
    `<div class="ro-item verdict"><span>${status}</span></div>`;
  const s = document.getElementById("tfb-status");
  if (s) s.textContent = status.split("（")[0];
}

export default {
  id: "two-force-balance",
  name: "二力平衡",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#tfb-canvas");
    ctx = canvas.getContext("2d");
    setup();
    const f1 = document.getElementById("tfb-f1"), f1o = document.getElementById("tfb-f1-output");
    const f2 = document.getElementById("tfb-f2"), f2o = document.getElementById("tfb-f2-output");
    f1.addEventListener("input", () => { state.f1 = Number(f1.value); f1o.textContent = Number(f1.value).toFixed(1) + " N"; draw(); });
    f2.addEventListener("input", () => { state.f2 = Number(f2.value); f2o.textContent = Number(f2.value).toFixed(1) + " N"; draw(); });
    const lineBtn = document.getElementById("tfb-line");
    lineBtn.addEventListener("click", () => {
      state.collinear = !state.collinear;
      lineBtn.textContent = state.collinear ? "共线" : "错开";
      lineBtn.setAttribute("aria-pressed", String(state.collinear));
      state.angle = 0; state.angVel = 0; draw();
    });
    document.getElementById("tfb-reset").addEventListener("click", () => {
      setup(); f1.value = 5; f1o.textContent = "5.0 N"; f2.value = 5; f2o.textContent = "5.0 N";
      lineBtn.textContent = "共线"; lineBtn.setAttribute("aria-pressed", "true"); draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state) return;
    const net = state.f1 - state.f2;
    if (!state.collinear) {
      state.angVel = (state.f1 > 0.05 || state.f2 > 0.05) ? 1.1 : 0;
      state.angle += state.angVel * delta;
      state.vx = net * 12;
    } else {
      state.angVel = 0;
      if (Math.abs(net) < 0.05) { state.vx *= 0.85; state.x *= 0.9; state.angle *= 0.9; }
      else state.vx = net * 12;
    }
    state.x += state.vx * delta;
    if (state.x > 180) { state.x = 180; state.vx = 0; }
    if (state.x < -180) { state.x = -180; state.vx = 0; }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
