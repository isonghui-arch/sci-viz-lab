// 电磁感应场景：条形磁铁插入或拔出线圈时，穿过线圈的磁通量发生变化，
//   从而在线圈中产生感应电流（楞次定律：感应电流的磁场总是阻碍磁通量的变化）。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .em-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .em-section-nav a {
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
    .em-section-nav a:hover,
    .em-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .em-scene #em-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .em-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .em-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .em-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .em-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .em-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "em",
    figureNo: "FIG. 19 / PHYSICS",
    titleHTML: "电磁感应<br />磁铁一动就有电",
    lead: "磁铁插进线圈、再拔出来，检流计的指针就会摆。动才有电，不动就没有——这就是发电机的雏形。",
    heroNote: "插入 / 拔出磁铁 · 看指针摆动方向 · 速度可调",
    navLabel: "电磁感应章节导航",
    navItems: [
      { id: "em-intuition", label: "直觉" },
      { id: "em-define", label: "定义" },
      { id: "em-lab", label: "互动实验" },
      { id: "em-limits", label: "边界说明" },
    ],
    firstAnchor: "em-intuition",
  })}
    <div class="lab-shell" aria-label="电磁感应交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="em-canvas" width="640" height="430" aria-label="电磁感应示意图"></canvas>
        <div class="canvas-caption">
          <span>红箭头=感应电流方向　指针摆动方向随插入/拔出而反向</span>
          <span id="em-status">静止</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="em-speed"><span>磁铁速度</span><output id="em-speed-output">1.0</output></label>
        <input id="em-speed" type="range" min="0.4" max="2.5" step="0.1" value="1.0" />
        <div class="em-readout" id="em-readout"></div>
        <div class="lab-actions">
          <button id="em-in" class="accent-button" type="button">插入线圈</button>
          <button id="em-out" type="button">拔出线圈</button>
          <button id="em-stop" type="button">停止</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="em-intuition" aria-labelledby="em-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="em-intuition-title">直觉：磁也能“生”电</h2>
      <p>电生磁人们早知道，磁生电却要“动”起来才行。</p></div>
    </div>
    <p>
      奥斯特发现电流能产生磁场（电生磁）后，法拉第反着想：磁场能不能产生电流？答案是——
      <b>能，但得让磁通量变化</b>。磁铁静静待着，线圈里没电流；一旦把磁铁插进或拔出，
      穿过线圈的磁力线“多起来”或“少下去”，线圈就感应出一股电流，检流计指针猛地一摆。
      磁铁停下，指针立刻回零。发电机、变压器，全是这个原理。
    </p>
  </section>

  <section class="section-pad" id="em-define" aria-labelledby="em-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="em-define-title">定义：法拉第定律与楞次定律</h2>
      <p>变才有电，而且“反抗”这种变化。</p></div>
    </div>
    <p>
      <b>法拉第电磁感应定律</b>：感应电动势的大小与磁通量的变化率成正比，E = -N·ΔΦ/Δt。
      变化越快（磁铁动得越快），电流越大。<br />
      <b>楞次定律</b>：感应电流的方向，总是使它产生的磁场<b>阻碍</b>引起它的磁通量变化。
      插入时磁通增加，感应磁场就“推开”磁铁；拔出时磁通减少，感应磁场就“拉住”磁铁——所以
      插入与拔出时电流方向正好<b>相反</b>，检流计指针摆向两侧。
    </p>
  </section>

  <section class="section-pad" id="em-lab" aria-labelledby="em-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="em-lab-title">互动实验</h2>
      <p>动一下磁铁，看指针怎么回应。</p></div>
    </div>
    <p>
      点“插入线圈”让磁铁向右滑入线圈，“拔出线圈”让它退回。注意：只有磁铁<b>运动</b>时指针才摆，
      停下的瞬间立刻归零。调大“磁铁速度”，指针摆幅更大。对比两次操作，你会发现插入与拔出的
      摆向恰好相反——这正是楞次定律的痕迹。
    </p>
  </section>

  <section class="section-pad" id="em-limits" aria-labelledby="em-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="em-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实实验的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>磁场</span><h3>理想匀强</h3><p>真实磁铁磁场非线性，这里用简化的磁通变化示意，未画完整磁感线分布。</p></article>
      <article><span>线圈</span><h3>匝数固定</h3><p>实际感应电动势与匝数 N 成正比，本模型把 N 折算进比例常数。</p></article>
      <article><span>指针</span><h3>瞬时近似</h3><p>检流计有机械惯性，真实指针摆动有阻尼振荡，这里直接跟随电流。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

const COIL_X = 470;          // 线圈中心 x
const COIL_TOP = 130, COIL_BOT = 320;
const MAG_W = 56, MAG_H = 120;
const X_START = 150, X_IN = 440; // 磁铁静止位 / 完全插入位

function setup() {
  state = {
    x: X_START,
    vel: 0,
    speed: 1.0,
    dots: [],
    galvan: 0, // 指针角度（带符号）
  };
  for (let k = 0; k < 22; k++) state.dots.push(k / 22);
}

// 感应电流（带符号）：与速度反向（楞次），大小正比于速度
function induced(vel) {
  return -vel * 0.9;
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 线圈（竖直螺线管示意）
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.strokeRect(COIL_X - 30, COIL_TOP, 60, COIL_BOT - COIL_TOP);
  ctx.lineWidth = 2;
  for (let y = COIL_TOP + 18; y < COIL_BOT; y += 22) {
    ctx.beginPath(); ctx.moveTo(COIL_X - 30, y); ctx.lineTo(COIL_X + 30, y); ctx.stroke();
  }
  ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("线圈", COIL_X, COIL_BOT + 22);

  // 检流计（左上）
  const gx = 110, gy = 90, gr = 34;
  ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2);
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = "#185FA5"; ctx.font = "12px var(--sans)"; ctx.fillText("G", gx, gy + 4);
  // 刻度
  ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
  for (let a = -50; a <= 50; a += 25) {
    const r = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(gx + Math.sin(r) * (gr - 6), gy - Math.cos(r) * (gr - 6));
    ctx.lineTo(gx + Math.sin(r) * gr, gy - Math.cos(r) * gr); ctx.stroke();
  }
  // 指针
  const ang = state.galvan * (50 * Math.PI / 180);
  ctx.strokeStyle = "#b41f24"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(gx, gy);
  ctx.lineTo(gx + Math.sin(ang) * (gr - 8), gy - Math.cos(ang) * (gr - 8)); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.fillText("检流计", gx, gy + gr + 16);

  // 导线：线圈上→检流计→线圈下
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(COIL_X - 30, COIL_TOP); ctx.lineTo(COIL_X - 30, 70); ctx.lineTo(gx, 70); ctx.lineTo(gx, gy - gr);
  ctx.moveTo(COIL_X - 30, COIL_BOT); ctx.lineTo(COIL_X - 30, 360); ctx.lineTo(gx, 360); ctx.lineTo(gx, gy + gr);
  ctx.stroke();

  // 磁铁
  const mx = state.x, my = (COIL_TOP + COIL_BOT) / 2;
  ctx.fillStyle = "#c0392b"; ctx.fillRect(mx - MAG_W / 2, my - MAG_H / 2, MAG_W / 2, MAG_H); // N 右（红）
  ctx.fillStyle = "#185FA5"; ctx.fillRect(mx, my - MAG_H / 2, MAG_W / 2, MAG_H);             // S 左（蓝）
  ctx.fillStyle = "#fff"; ctx.font = "bold 14px var(--sans)";
  ctx.fillText("N", mx - MAG_W / 4, my + 5);
  ctx.fillText("S", mx + MAG_W / 4, my + 5);

  // 感应电流方向箭头（在线圈上、下两端标红箭头；方向随 induced 符号翻转）
  const ind = induced(state.vel);
  if (Math.abs(ind) > 0.02) {
    const dir = ind > 0 ? 1 : -1;
    ctx.fillStyle = "#b41f24"; ctx.font = "bold 16px var(--sans)";
    ctx.fillText(dir > 0 ? "↑" : "↓", COIL_X, COIL_TOP - 8);
    ctx.fillText(dir > 0 ? "↓" : "↑", COIL_X, COIL_BOT + 14);
    // 线圈内的流动小点
    for (const d of state.dots) {
      const yy = COIL_TOP + ((d + (ind > 0 ? 0 : 0.5)) % 1) * (COIL_BOT - COIL_TOP);
      ctx.fillStyle = "#b41f24";
      ctx.beginPath(); ctx.arc(COIL_X, yy, 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("em-readout");
  if (!el) return;
  const ind = induced(state.vel);
  const moving = Math.abs(state.vel) > 0.01;
  const dirTxt = ind > 0.02 ? "顺时针（阻碍插入）" : ind < -0.02 ? "逆时针（阻碍拔出）" : "无（静止）";
  el.innerHTML =
    `<div class="ro-item"><span>磁铁状态</span><span>${moving ? (state.vel > 0 ? "插入中" : "拔出中") : "静止"}</span></div>` +
    `<div class="ro-item"><span>磁通变化</span><span>${moving ? "有" : "无"}</span></div>` +
    `<div class="ro-item verdict"><span>感应电流：${dirTxt}</span></div>`;
  const status = document.getElementById("em-status");
  if (status) status.textContent = moving ? (state.vel > 0 ? "插入→指针偏" : "拔出→反向偏") : "静止·无电流";
}

export default {
  id: "electromagnetic-induction",
  name: "电磁感应",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#em-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const speed = document.getElementById("em-speed");
    const speedOut = document.getElementById("em-speed-output");
    speed.addEventListener("input", () => {
      state.speed = Number(speed.value);
      speedOut.textContent = state.speed.toFixed(1);
    });

    document.getElementById("em-in").addEventListener("click", () => { state.vel = state.speed; });
    document.getElementById("em-out").addEventListener("click", () => { state.vel = -state.speed; });
    document.getElementById("em-stop").addEventListener("click", () => { state.vel = 0; });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state) return;
    if (state.vel !== 0) {
      state.x += state.vel * 120 * delta;
      if (state.x >= X_IN) { state.x = X_IN; state.vel = 0; }
      if (state.x <= X_START) { state.x = X_START; state.vel = 0; }
    }
    // 指针平滑跟随感应电流
    const target = Math.max(-1, Math.min(1, induced(state.vel)));
    state.galvan += (target - state.galvan) * Math.min(1, 12 * delta);
    state.dots = state.dots.map((d) => (d + 0.4 * delta) % 1);
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
