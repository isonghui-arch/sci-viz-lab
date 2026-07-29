// 地震波场景（地学分类）：P 波与 S 波的传播 + 由 P-S 到时差反推震中距。
// 纯 Canvas 2D，无 Three.js。沿用 scene-shell.js 的 shellHead 共享壳范式。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .seis-scene #seis-canvas,
    .seis-scene #seis-gram {
      width: 100%;
      display: block;
      border-radius: 4px;
      cursor: crosshair;
    }
    .seis-readout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      margin-top: 14px;
      padding: 12px 14px;
      background: var(--paper-2, #efe9da);
      border: 1px solid var(--rule);
      border-radius: 6px;
      font-family: var(--sans);
      font-size: 13px;
      color: var(--ink);
    }
    .seis-readout b {
      color: var(--navy);
    }
    .seis-readout .ok { color: var(--red-bright); }
  </style>
  ${shellHead({
    ns: "seis",
    figureNo: "FIG. 13 / GEOSCIENCE",
    titleHTML: "地震波<br />P 与 S 的赛跑",
    lead: "震源同时发出纵波 P 与横波 S。P 跑得快、S 跑得慢——台站记录到的到时差，正是我们反推震中距离的钥匙。",
    heroNote: "拖动地表上的台站 ▲ 改变距离，观察 P/S 两圆与时间差的联动",
    navLabel: "地震波章节导航",
    navItems: [
      { id: "seis-intuition", label: "直觉" },
      { id: "seis-def", label: "定义" },
      { id: "seis-exp", label: "互动实验" },
      { id: "seis-bound", label: "边界说明 · 来源" },
    ],
    firstAnchor: "seis-intuition",
  })}
    <div class="lab-shell" aria-label="地震波交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="seis-canvas" width="720" height="400" aria-label="剖面图：震源发出的 P/S 波与可拖拽台站"></canvas>
        <div class="canvas-caption">
          <span>剖面 · 拖拽台站 ▲</span>
          <span id="seis-dist">距离 — km</span>
        </div>
        <canvas id="seis-gram" width="720" height="150" aria-label="台站地震波形：P 到时小、S 到时大"></canvas>
        <div class="canvas-caption">
          <span>地震波形（横轴＝发震后时间）</span>
          <span id="seis-gap">Δt — s</span>
        </div>
        <div class="seis-readout">
          <span>几何距离 <b id="seis-dgeo">—</b></span>
          <span>P 到时 <b id="seis-tp">—</b></span>
          <span>S 到时 <b id="seis-ts">—</b></span>
          <span>时差 Δt <b id="seis-dt">—</b></span>
          <span>反推距离 <b id="seis-dest">—</b></span>
          <span>误差 <b id="seis-err" class="ok">—</b></span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="seis-vp">
          <span>P 波速度 <i>v<sub>p</sub></i></span>
          <output id="seis-vp-out">6.0</output>
        </label>
        <input id="seis-vp" type="range" min="2" max="8" step="0.1" value="6" />

        <label class="control-row" for="seis-vs">
          <span>S 波速度 <i>v<sub>s</sub></i></span>
          <output id="seis-vs-out">3.5</output>
        </label>
        <input id="seis-vs" type="range" min="1" max="5" step="0.1" value="3.5" />

        <label class="control-row" for="seis-speed">
          <span>演示速度</span>
          <output id="seis-speed-out">1.0×</output>
        </label>
        <input id="seis-speed" type="range" min="0.3" max="2" step="0.1" value="1" />

        <div class="lab-actions">
          <button id="seis-toggle" type="button">暂停</button>
          <button id="seis-replay" type="button">重新发震</button>
          <button id="seis-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="seis-intuition" aria-labelledby="seis-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="seis-intuition-title">为什么到时差能定距离</h2>
        <p>同一次地震，P 波先到、S 波后到，中间隔着一段空白。</p>
      </div>
    </div>
    <p>
      想象两个人从同一起点出发跑向终点，一个快、一个慢。终点处的人看两人到达的<b>时间差</b>，
      就能倒推出起点离自己有多远——只要知道两人的速度。地震台站做的就是这件事：
      P 与 S 是速度已知的两位"跑者"，它们的到时差 Δt 越大，震源越远。
    </p>
  </section>

  <section class="section-pad" id="seis-def" aria-labelledby="seis-def-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="seis-def-title">P 波与 S 波是什么</h2>
        <p>体波（body wave）的两种：纵波与横波。</p>
      </div>
    </div>
    <p>
      <b>P 波（纵波 / 初至波）</b>：介质粒子沿传播方向来回振动，像弹簧的疏密波，速度最快，能在固体与液体中传播。
      <b>S 波（横波 / 次波）</b>：粒子垂直于传播方向振动，速度约为 P 波的 0.55–0.6 倍，且<b>无法在液体中传播</b>——
      正是这一点，让科学家在 20 世纪证实地球外核是液态的。本实验中两者速度由滑块设定，互不相干地向外扩张。
    </p>
  </section>

  <section class="section-pad" id="seis-exp" aria-labelledby="seis-exp-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="seis-exp-title">互动实验</h2>
        <p>拖拽台站、调节波速，看 P/S 两圆与时间差如何联动。</p>
      </div>
    </div>
    <p>
      拖动地表上的台站 ▲ 改变它到震源的距离：距离越远，P 与 S 两个圆先后"套"住台站的间隔越长，下方波形的 P、S 两道起伏也隔得越开。
      红色读数里，<b>几何距离</b>（由拖拽位置算出）与<b>反推距离</b>（由 Δt × 速度公式算出）应当几乎重合——这正是地震定位的基本方程
      <code>d ≈ Δt · v<sub>p</sub>·v<sub>s</sub> / (v<sub>p</sub> − v<sub>s</sub>)</code> 在起作用。
    </p>
  </section>

  <section class="section-pad" id="seis-bound" aria-labelledby="seis-bound-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="seis-bound-title">边界说明 · 来源</h2>
        <p>这个简化模型省略了什么。</p>
      </div>
    </div>
    <p>
      真实地球是<b>分层且各向异性</b>的：波速随深度变化，射线会弯曲，单靠一个台站的到时差只能给出"震中距"（到一个圆周），
      要确定震中还需<b>至少三个台站</b>的交汇定位。本实验把介质当作均匀、把路径当作直线，因此反推距离与几何距离高度吻合——
      这不是巧合，而是模型内部的自洽。想进一步，可把"震源深度"也作为变量，观察近场与远场的差异。
      参考：Stein &amp; Wysession《An Introduction to Seismology, Earthquakes, and Earth Structure》；USGS Earthquake Hazards Program。
    </p>
  </section>
  </div>`;

// ---- 画布与状态 ----
let ctx = null, gram = null, gctx = null;
let canvas = null;
const W = 720, H = 400, GW = 720, GH = 150;
const SURFACE_Y = 120;            // 地表线
const HX = 175, HY = 300;         // 震源（地下）
const SCALE = 1.2;                // px / km
const MAXR = Math.hypot(W, H);    // 波可扩散到的最大半径（px）

const state = {
  hx: HX, hy: HY,
  sx: 560, sy: SURFACE_Y,         // 台站位置（可在地表拖动）
  vp: 6, vs: 3.5, speed: 1,
  playing: true,
  t: 0,                           // 发震后时间（仿真秒）
  distPx: 0, distKm: 0,
  tP: 0, tS: 0, Tmax: 0,
  arrivedP: false, arrivedS: false,
  dragging: false,
};

function recompute() {
  state.distPx = Math.hypot(state.sx - state.hx, state.sy - state.hy);
  state.distKm = state.distPx / SCALE;
  state.tP = state.distKm / state.vp;
  state.tS = state.distKm / state.vs;
  // S 波圆环扩散到画布外的时间，作为波形横轴窗长
  state.Tmax = MAXR / (state.vs * SCALE) * 1.05;
}

function resetRupture() {
  state.t = 0;
  state.arrivedP = false;
  state.arrivedS = false;
}

function drawScene() {
  if (!ctx) return;
  // 背景：天空（纸色） + 地下（略深）
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, SURFACE_Y);
  ctx.fillStyle = "#e9e3d4";
  ctx.fillRect(0, SURFACE_Y, W, H - SURFACE_Y);

  // 地表线
  ctx.strokeStyle = "#111315";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, SURFACE_Y);
  ctx.lineTo(W, SURFACE_Y);
  ctx.stroke();

  // 震源 → 台站 射线（直线路径）
  ctx.strokeStyle = "rgba(7,24,45,0.35)";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(state.hx, state.hy);
  ctx.lineTo(state.sx, state.sy);
  ctx.stroke();
  ctx.setLineDash([]);

  // P 波环（藏红）
  const rp = state.vp * state.t * SCALE;
  if (rp > 0 && rp < MAXR) {
    ctx.strokeStyle = "#e5a526";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(state.hx, state.hy, rp, 0, Math.PI * 2);
    ctx.stroke();
  }
  // S 波环（红）
  const rs = state.vs * state.t * SCALE;
  if (rs > 0 && rs < MAXR) {
    ctx.strokeStyle = "#b41f24";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(state.hx, state.hy, rs, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 震源
  ctx.fillStyle = "#b41f24";
  ctx.beginPath();
  ctx.arc(state.hx, state.hy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111315";
  ctx.font = "12px Inter, sans-serif";
  ctx.fillText("震源", state.hx - 14, state.hy + 26);

  // 台站 ▲（可拖拽）
  const near = state.dragging || Math.abs(state.sx - (state._mx ?? -99)) < 22;
  ctx.fillStyle = near ? "#b41f24" : "#07182d";
  ctx.beginPath();
  ctx.moveTo(state.sx, state.sy - 16);
  ctx.lineTo(state.sx - 11, state.sy + 6);
  ctx.lineTo(state.sx + 11, state.sy + 6);
  ctx.closePath();
  ctx.fill();
  // 到达标记
  if (state.arrivedP) {
    ctx.fillStyle = "#e5a526";
    ctx.beginPath();
    ctx.arc(state.sx, state.sy - 22, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (state.arrivedS) {
    ctx.fillStyle = "#b41f24";
    ctx.beginPath();
    ctx.arc(state.sx, state.sy - 32, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGram() {
  if (!gctx) return;
  gctx.clearRect(0, 0, GW, GH);
  gctx.fillStyle = "#f3efe5";
  gctx.fillRect(0, 0, GW, GH);
  const mid = GH / 2;
  // 零线
  gctx.strokeStyle = "#d9d2c4";
  gctx.lineWidth = 1;
  gctx.beginPath();
  gctx.moveTo(0, mid);
  gctx.lineTo(GW, mid);
  gctx.stroke();

  const tShow = Math.min(state.t, state.Tmax);
  const x0 = 8, x1 = GW - 8;
  const toX = (tau) => x0 + (tau / state.Tmax) * (x1 - x0);

  // 渐进绘制波形
  gctx.lineWidth = 2;
  let prevX = x0, prevY = mid;
  for (let i = 0; i <= 480; i++) {
    const tau = (i / 480) * tShow;
    let a = 0;
    if (tau >= state.tS) a = Math.sin(tau * 6.0) * 18 * Math.exp(-(tau - state.tS) * 0.02);
    else if (tau >= state.tP) a = Math.sin(tau * 9.0) * 7;
    const x = toX(tau);
    const y = mid - a;
    if (i === 0) { prevX = x; prevY = y; continue; }
    gctx.strokeStyle = tau >= state.tS ? "#b41f24" : (tau >= state.tP ? "#e5a526" : "#9a958c");
    gctx.beginPath();
    gctx.moveTo(prevX, prevY);
    gctx.lineTo(x, y);
    gctx.stroke();
    prevX = x; prevY = y;
  }

  // P / S 到时竖线
  if (state.tP <= tShow) vline(gctx, toX(state.tP), "#e5a526", "P");
  if (state.tS <= tShow) vline(gctx, toX(state.tS), "#b41f24", "S");
}
function vline(c, x, color, label) {
  c.strokeStyle = color;
  c.setLineDash([3, 3]);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(x, 6);
  c.lineTo(x, GH - 6);
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = color;
  c.font = "11px Inter, sans-serif";
  c.fillText(label, x + 3, 14);
}

function updateReadout() {
  const dgeo = state.distKm;
  const dEst = state.tP > 0 ? (state.tS - state.tP) * state.vp * state.vs / (state.vp - state.vs) : 0;
  const err = dgeo > 0 ? Math.abs(dEst - dgeo) / dgeo * 100 : 0;
  setText("seis-dist", `距离 ${dgeo.toFixed(0)} km`);
  setText("seis-dgeo", `${dgeo.toFixed(0)} km`);
  setText("seis-tp", `${state.tP.toFixed(1)} s`);
  setText("seis-ts", `${state.tS.toFixed(1)} s`);
  setText("seis-dt", `${(state.tS - state.tP).toFixed(1)} s`);
  setText("seis-dest", `${dEst.toFixed(0)} km`);
  setText("seis-gap", `Δt ${(state.tS - state.tP).toFixed(1)} s`);
  setText("seis-err", `${err.toFixed(1)} %`);
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}

export default {
  id: "seismic-waves",
  name: "地震波",
  category: "geoscience",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#seis-canvas");
    ctx = canvas.getContext("2d");
    gram = container.querySelector("#seis-gram");
    gctx = gram.getContext("2d");

    const vp = container.querySelector("#seis-vp");
    const vs = container.querySelector("#seis-vs");
    const sp = container.querySelector("#seis-speed");
    const vpOut = container.querySelector("#seis-vp-out");
    const vsOut = container.querySelector("#seis-vs-out");
    const spOut = container.querySelector("#seis-speed-out");
    const toggle = container.querySelector("#seis-toggle");
    const replay = container.querySelector("#seis-replay");
    const reset = container.querySelector("#seis-reset");

    vp.addEventListener("input", () => {
      state.vp = Number(vp.value);
      vpOut.textContent = state.vp.toFixed(1);
      // 保持 vs < vp
      if (state.vs >= state.vp - 0.1) {
        state.vs = Math.max(1, state.vp - 0.1);
        vs.value = state.vs.toFixed(1);
        vsOut.textContent = state.vs.toFixed(1);
      }
      recompute(); resetRupture();
    });
    vs.addEventListener("input", () => {
      let v = Number(vs.value);
      if (v >= state.vp - 0.1) { v = state.vp - 0.1; vs.value = v.toFixed(1); }
      state.vs = v;
      vsOut.textContent = state.vs.toFixed(1);
      recompute(); resetRupture();
    });
    sp.addEventListener("input", () => {
      state.speed = Number(sp.value);
      spOut.textContent = state.speed.toFixed(1) + "×";
    });
    toggle.addEventListener("click", () => {
      state.playing = !state.playing;
      toggle.textContent = state.playing ? "暂停" : "播放";
    });
    replay.addEventListener("click", () => resetRupture());
    reset.addEventListener("click", () => {
      state.vp = 6; state.vs = 3.5; state.speed = 1;
      vp.value = "6"; vs.value = "3.5"; sp.value = "1";
      vpOut.textContent = "6.0"; vsOut.textContent = "3.5"; spOut.textContent = "1.0×";
      state.sx = 560;
      recompute(); resetRupture();
    });

    // 拖拽台站（沿地表水平移动）
    const toCanvas = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * (canvas.width / r.width);
      const y = (e.clientY - r.top) * (canvas.height / r.height);
      return { x, y };
    };
    canvas.addEventListener("pointerdown", (e) => {
      const p = toCanvas(e);
      if (Math.abs(p.x - state.sx) < 24 && Math.abs(p.y - state.sy) < 28) {
        state.dragging = true;
        canvas.setPointerCapture(e.pointerId);
      }
    });
    canvas.addEventListener("pointermove", (e) => {
      const p = toCanvas(e);
      state._mx = p.x;
      if (state.dragging) {
        state.sx = Math.max(50, Math.min(W - 30, p.x));
        state.sy = SURFACE_Y;
        recompute(); resetRupture();
      }
    });
    canvas.addEventListener("pointerup", () => { state.dragging = false; });
    canvas.addEventListener("pointerleave", () => { state._mx = -99; });

    recompute(); resetRupture();
    drawScene(); drawGram(); updateReadout();
  },
  update() {
    if (!ctx) return;
    if (state.playing) {
      state.t += 0.35 * state.speed;
      if (state.t >= state.tP) state.arrivedP = true;
      if (state.t >= state.tS) state.arrivedS = true;
      if (state.t > state.Tmax + 1.0) { state.t = 0; state.arrivedP = false; state.arrivedS = false; }
    }
    drawScene();
    drawGram();
    updateReadout();
  },
  dispose() {
    ctx = null; gctx = null; canvas = null; gram = null;
  },
  getDefaultParams() {
    return {};
  },
};
