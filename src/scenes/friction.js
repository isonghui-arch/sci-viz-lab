// 摩擦力场景：水平面上木块受拉力 F。F 未超过最大静摩擦时静止（静摩擦随 F 增大而增大与之平衡）；
//   一旦超过，木块开始滑动，受较小的滑动摩擦力。演示"静摩擦→动摩擦"的突变与运动状态改变。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .frc-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .frc-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .frc-section-nav a:hover, .frc-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .frc-scene #frc-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .frc-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .frc-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .frc-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .frc-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .frc-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
    .control-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 10px 0 4px; }
    .control-row span { font-family: var(--sans); font-size: 13px; color: var(--muted); }
    .control-row output { font-family: var(--mono, monospace); font-size: 13px; color: var(--ink); }
  </style>
  ${shellHead({
    ns: "frc",
    figureNo: "FIG. 24 / PHYSICS",
    titleHTML: "摩擦力<br />推不动与滑起来",
    lead: "轻轻推，地面悄悄顶回来（静摩擦）；用力过猛越过临界点，木块滑走，阻力反而变小（动摩擦）。",
    heroNote: "调拉力与摩擦系数 · 看静摩擦→动摩擦的突变",
    navLabel: "摩擦力章节导航",
    navItems: [
      { id: "frc-intuition", label: "直觉" },
      { id: "frc-define", label: "定义" },
      { id: "frc-lab", label: "互动实验" },
      { id: "frc-limits", label: "边界说明" },
    ],
    firstAnchor: "frc-intuition",
  })}
    <div class="lab-shell" aria-label="摩擦力交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="frc-canvas" width="640" height="430" aria-label="摩擦力示意图"></canvas>
        <div class="canvas-caption">
          <span>F ≤ 最大静摩擦 → 静止　|　F 越过 → 滑动（动摩擦更小）</span>
          <span id="frc-status">静止</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="frc-F"><span>拉力 F</span><output id="frc-F-output">0 N</output></label>
        <input id="frc-F" type="range" min="0" max="20" step="0.5" value="0" />
        <label class="control-row" for="frc-mu"><span>摩擦系数 μ</span><output id="frc-mu-output">0.30</output></label>
        <input id="frc-mu" type="range" min="0.1" max="0.8" step="0.05" value="0.3" />
        <div class="frc-readout" id="frc-readout"></div>
        <div class="lab-actions">
          <button id="frc-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="frc-intuition" aria-labelledby="frc-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="frc-intuition-title">直觉：地面也会"顶嘴"</h2>
      <p>你推它，它悄悄回推，直到你用力过猛。</p></div>
    </div>
    <p>
      想把木块推开，得先克服地面给的<b>静摩擦</b>。你用多大力，静摩擦就顶回多大力——只要没超过它的上限（最大静摩擦），
      木块纹丝不动。可一旦你的拉力<b>越过临界点</b>，静摩擦"下岗"，换成较小的<b>滑动摩擦</b>，木块就滑了出去。
      所以"刚好推不动"和"刚滑起来"是两个不同的力，后者通常更小，这正解释了为什么启动比维持滑动更费劲。
    </p>
  </section>

  <section class="section-pad" id="frc-define" aria-labelledby="frc-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="frc-define-title">定义：静摩擦与动摩擦</h2>
      <p>临界前随你变，临界后变小且恒定。</p></div>
    </div>
    <p>
      <b>静摩擦力</b>：物体有相对运动趋势但未动时，大小随外力在 0 到<b>最大静摩擦力 f_max = μ_s·N</b> 之间变化（N 为正压力）。<br />
      <b>滑动摩擦力</b>：物体滑动时，<b>f_k = μ_k·N</b>，通常 μ_k &lt; μ_s，故滑动摩擦略小于最大静摩擦。<br />
      本模型取 m = 2 kg、g = 10 N/kg，故 N = 20 N；并以 f_k ≈ 0.8·f_max 示意动摩擦较小。
    </p>
  </section>

  <section class="section-pad" id="frc-lab" aria-labelledby="frc-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="frc-lab-title">互动实验</h2>
      <p>慢慢加大拉力，盯住临界那一刻。</p></div>
    </div>
    <p>
      拖动「拉力 F」从 0 往上加：在临界值以内，木块静止，蓝色摩擦箭头与红色拉力箭头等长（静摩擦在顶）；
      越过临界，木块向右滑动，摩擦箭头略缩短（动摩擦）。再调「摩擦系数 μ」，看临界点随 μ 一起升降——
      μ 越大，越难推动。把"启动更费力、滑动较轻松"和 f_max &gt; f_k 对应起来。
    </p>
  </section>

  <section class="section-pad" id="frc-limits" aria-labelledby="frc-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="frc-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实接触的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>接触</span><h3>理想平面</h3><p>真实接触面有微观凹凸与磨损，本模型用单一 μ 概括。</p></article>
      <article><span>比值</span><h3>固定 0.8</h3><p>真实 μ_k/μ_s 因材料而异，本模型固定取 0.8 仅作示意。</p></article>
      <article><span>速度</span><h3>无关假设</h3><p>模型假定动摩擦与滑动速度无关，真实中常略有变化。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const M = 2, G = 10, N = M * G; // 正压力 20 N

function setup() { state = { F: 0, mu: 0.3, x: 0, vx: 0, moving: false }; }
function maxStatic() { return state.mu * N; }
function kinetic() { return 0.8 * state.mu * N; }

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

  // 地面
  ctx.strokeStyle = "#9a8f78"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(40, 350); ctx.lineTo(600, 350); ctx.stroke();

  const bw = 70, bh = 50, by = 300;
  const bx = 120 + state.x;
  // 木块
  ctx.fillStyle = "#c8742a"; ctx.strokeStyle = "#8a4a14"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 6) : ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();

  // 拉力 F（红，向右）
  const Lf = state.F * 5;
  if (Lf > 0.5) arrow(bx - 12 - Lf, by + bh / 2, bx - 12, by + bh / 2, "#b41f24", 4);
  // 摩擦力（蓝，向左）
  const fcur = state.moving ? kinetic() : Math.min(state.F, maxStatic());
  const Lk = fcur * 5;
  if (Lk > 0.5) arrow(bx + bw + 12 + Lk, by + bh / 2, bx + bw + 12, by + bh / 2, "#185FA5", 4);

  ctx.fillStyle = "#9a8f78"; ctx.font = "13px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText("地面", 560, 372);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("frc-readout");
  if (!el) return;
  const fmax = maxStatic(), fk = kinetic();
  const fcur = state.moving ? fk : Math.min(state.F, fmax);
  const a = state.moving ? (state.F - fk) / M : 0;
  const status = state.moving ? "滑动中（动摩擦）" : "静止（静摩擦平衡）";
  el.innerHTML =
    `<div class="ro-item"><span>正压力 N</span><span>${N.toFixed(0)} N</span></div>` +
    `<div class="ro-item"><span>最大静摩擦</span><span>${fmax.toFixed(1)} N</span></div>` +
    `<div class="ro-item"><span>当前摩擦力</span><span>${fcur.toFixed(1)} N</span></div>` +
    `<div class="ro-item"><span>加速度</span><span>${a.toFixed(1)} m/s²</span></div>` +
    `<div class="ro-item verdict"><span>${status}</span></div>`;
  const s = document.getElementById("frc-status");
  if (s) s.textContent = status.split("（")[0];
}

export default {
  id: "friction",
  name: "摩擦力",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#frc-canvas");
    ctx = canvas.getContext("2d");
    setup();
    const F = document.getElementById("frc-F"), Fo = document.getElementById("frc-F-output");
    const mu = document.getElementById("frc-mu"), muo = document.getElementById("frc-mu-output");
    F.addEventListener("input", () => { state.F = Number(F.value); Fo.textContent = Number(F.value).toFixed(1) + " N"; draw(); });
    mu.addEventListener("input", () => { state.mu = Number(mu.value); muo.textContent = Number(mu.value).toFixed(2); draw(); });
    document.getElementById("frc-reset").addEventListener("click", () => {
      setup(); F.value = 0; Fo.textContent = "0 N"; mu.value = 0.3; muo.textContent = "0.30"; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state) return;
    const fmax = maxStatic(), fk = kinetic();
    if (!state.moving) {
      if (state.F > fmax) state.moving = true;
    }
    if (state.moving) {
      const a = (state.F - fk) / M;
      state.vx += a * 12 * delta;
      if (state.vx < 0) { state.vx = 0; state.moving = false; }
      state.x += state.vx * delta;
      if (state.x > 360) { state.x = 360; state.vx = 0; }
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
