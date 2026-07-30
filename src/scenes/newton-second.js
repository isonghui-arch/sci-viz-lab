// 牛顿第二定律（物理 · 八下 力与运动）
// 交互：调质量 m 与合力 F，实时 a = F/m；小车加速运动直观验证 a∝F、a∝1/m
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ns-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--rule);
    }
    .ns-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-size: 13px;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted);
      border-bottom: 2px solid transparent; }
    .ns-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ns-scene #ns-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "ns",
    figureNo: "FIG. 物理 / 牛顿第二定律",
    titleHTML: "牛顿第二定律<br />F = m a",
    lead: "同一个力推轻的车和重的车，谁加速更快？改变质量与合力，看小车的加速度如何变化。",
    heroNote: "调质量与合力 · 看 a=F/m 实时变化 · 小车反复加速演示",
    navLabel: "章节导航",
    navItems: [
      { id: "ns-intuition", label: "直觉" },
      { id: "ns-def", label: "定义" },
      { id: "ns-exp", label: "互动实验" },
      { id: "ns-limit", label: "边界" },
    ],
    firstAnchor: "ns-intuition",
  })}
    <div class="lab-shell" aria-label="牛顿第二定律交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ns-canvas" width="640" height="300" aria-label="小车在直线轨道上加速运动的示意图"></canvas>
        <div class="canvas-caption">
          <span>小车从左侧挡板释放，向右做匀加速运动</span>
          <span id="ns-readout">a = 1.00 m/s²</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="ns-mass"><span>质量 m</span><output id="ns-mass-o">2.0 kg</output></label>
        <input id="ns-mass" type="range" min="1" max="10" step="0.5" value="2" />

        <label class="control-row" for="ns-force"><span>合力 F</span><output id="ns-force-o">10 N</output></label>
        <input id="ns-force" type="range" min="1" max="40" step="1" value="10" />

        <div class="ns-readout" id="ns-readout-grid"></div>

        <div class="lab-actions">
          <button id="ns-play" class="accent-button" type="button" aria-pressed="true">暂停</button>
          <button id="ns-release" type="button">重新释放</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ns-intuition" aria-labelledby="ns-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ns-intuition-t">直觉：推得动 vs 推不动</h2>
      <p>用同样的力气，推空购物车一下就跑起来，推装满货的推半天。</p></div>
    </div>
    <p>这说明"改变物体运动状态的难易"和物体有多"重"（质量）有关。牛顿把这件事写成了等式：<b>物体受到的合力越大，加速度越大；物体质量越大，同样的力产生的加速度越小</b>。</p>
  </section>

  <section class="section-pad" id="ns-def" aria-labelledby="ns-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ns-def-t">定义：F = m a</h2>
      <p>加速度与合力成正比，与质量成反比。</p></div>
    </div>
    <ul>
      <li><b>合力 F</b> 一定时，质量 m 越大 → 加速度 a 越小（重车难推）。</li>
      <li><b>质量 m</b> 一定时，合力 F 越大 → 加速度 a 越大（用力推就快）。</li>
      <li>数学表达：<b>a = F / m</b>（国际单位：m 用 kg，F 用 N，a 用 m/s²）。</li>
    </ul>
  </section>

  <section class="section-pad" id="ns-exp" aria-labelledby="ns-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ns-exp-t">亲自验证</h2>
      <p>把质量拉大到 8 kg、合力保持 10 N，看小车"慢吞吞"地加速；再把质量调回 2 kg、合力升到 40 N，小车瞬间窜出去。</p></div>
    </div>
    <p>读法：小车左侧红箭头表示合力方向，车尾蓝色速度条长度 = 当前速度。注意小车每次冲到右侧就重新释放——这样你能反复观察"从静止开始匀加速"的全过程。</p>
  </section>

  <section class="section-pad" id="ns-limit" aria-labelledby="ns-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ns-limit-t">边界与说明</h2>
      <p>演示做了便于观察的简化。</p></div>
    </div>
    <p>真实情况下合力需扣除摩擦与空气阻力；本演示假设轨道光滑、合力恒定，小车做理想匀加速。速度条与位移按真实公式 <b>v = a·t</b>、<b>s = ½·a·t²</b> 计算，但时间做了加速以便在数秒内看完整段运动。这里把"1 米"映射到约 60 像素，仅用于示意比例。</p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const state = { m: 2, F: 10, a: 5, v: 0, x: 0, playing: true };
const TRACK_LEN = 10; // 米
const PX_PER_M = 56;

function recompute() {
  state.a = state.F / state.m;
}

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, w, h);

  const groundY = 200;
  // 轨道
  ctx.strokeStyle = "#c9c2b2"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(20, groundY); ctx.lineTo(w - 20, groundY); ctx.stroke();
  // 刻度（每米）
  ctx.fillStyle = "#8a8270"; ctx.font = "11px var(--mono, monospace)"; ctx.textAlign = "center";
  for (let i = 0; i <= TRACK_LEN; i++) {
    const sx = 30 + i * PX_PER_M;
    if (sx > w - 20) break;
    ctx.beginPath(); ctx.moveTo(sx, groundY); ctx.lineTo(sx, groundY + 6); ctx.stroke();
    ctx.fillText(i + "m", sx, groundY + 22);
  }
  // 左侧挡板
  ctx.fillStyle = "#07182d";
  ctx.fillRect(24, groundY - 34, 6, 34);

  // 小车
  const carX = 30 + state.x * PX_PER_M;
  const carY = groundY - 26;
  ctx.fillStyle = "#B41F24";
  ctx.fillRect(carX, carY, 46, 26);
  ctx.fillStyle = "#07182d";
  ctx.beginPath(); ctx.arc(carX + 12, carY + 26, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(carX + 34, carY + 26, 7, 0, Math.PI * 2); ctx.fill();

  // 合力箭头（红，向右）
  const arrowLen = 16 + state.F * 1.6;
  drawArrow(ctx, carX + 23, carY - 14, carX + 23 + arrowLen, carY - 14, "#B41F24");
  ctx.fillStyle = "#B41F24"; ctx.font = "12px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText("合力 F", carX + 23, carY - 22);

  // 速度条（蓝，在车尾向左？这里画在车上方表示速度大小）
  const vbar = Math.min(120, state.v * 10);
  ctx.fillStyle = "#185FA5";
  ctx.fillRect(carX, carY - 40, vbar, 6);
  ctx.fillStyle = "#185FA5"; ctx.font = "11px var(--mono, monospace)"; ctx.textAlign = "left";
  ctx.fillText("v=" + state.v.toFixed(1), carX, carY - 44);

  updateGrid();
}

function drawArrow(c, x1, y1, x2, y2, color) {
  c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  c.beginPath();
  c.moveTo(x2, y2);
  c.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4));
  c.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4));
  c.closePath(); c.fill();
}

function updateGrid() {
  const el = document.getElementById("ns-readout-grid");
  const ro = document.getElementById("ns-readout");
  if (el) el.innerHTML =
    `<div class="ro-item"><span>质量 m</span><span>${state.m.toFixed(1)} kg</span></div>` +
    `<div class="ro-item"><span>合力 F</span><span>${state.F.toFixed(0)} N</span></div>` +
    `<div class="ro-item verdict"><span>加速度 a = F/m = ${state.a.toFixed(2)} m/s²</span></div>`;
  if (ro) ro.textContent = `a = ${state.a.toFixed(2)} m/s² · v = ${state.v.toFixed(1)} m/s`;
}

export default {
  id: "newton-second",
  name: "牛顿第二定律",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ns-canvas");
    ctx = canvas.getContext("2d");
    const mass = container.querySelector("#ns-mass");
    const force = container.querySelector("#ns-force");
    const massO = container.querySelector("#ns-mass-o");
    const forceO = container.querySelector("#ns-force-o");

    const sync = () => {
      state.m = Number(mass.value);
      state.F = Number(force.value);
      massO.textContent = state.m.toFixed(1) + " kg";
      forceO.textContent = state.F.toFixed(0) + " N";
      recompute();
    };
    mass.addEventListener("input", sync);
    force.addEventListener("input", sync);

    const playBtn = container.querySelector("#ns-play");
    playBtn.addEventListener("click", () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? "暂停" : "播放";
      playBtn.setAttribute("aria-pressed", String(state.playing));
    });
    container.querySelector("#ns-release").addEventListener("click", () => {
      state.x = 0; state.v = 0;
    });

    sync();
    draw();
  },
  update({ delta = 0.016 }) {
    if (state.playing) {
      state.v += state.a * delta * 2.2; // 时间加速，便于观察
      state.x += state.v * delta * 2.2;
      if (state.x >= TRACK_LEN) { state.x = 0; state.v = 0; }
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};
