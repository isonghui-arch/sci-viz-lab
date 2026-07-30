// 串并联电路与欧姆定律场景：搭建简单电池-电阻-灯泡电路，
//   可切换 单电阻 / 串联 / 并联，调节电源电压与两个电阻，实时显示电流、电压分配，动画演示电流流向与灯泡亮度。
// 范式：shellHead 生成骨架 + 自有 lab-shell 写实验 + 自有 section 写讲解。导航由注册表自动按分类生成。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ohm-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .ohm-section-nav a {
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
    .ohm-section-nav a:hover,
    .ohm-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .ohm-scene #ohm-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .ohm-readout {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
    }
    .ohm-readout .ro-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      font-family: var(--mono, monospace);
      font-size: 12px;
    }
    .ohm-readout .ro-item span:first-child { color: rgba(255, 255, 255, 0.6); }
    .ohm-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .ohm-readout .ro-item.verify {
      grid-column: 1 / -1;
      background: rgba(43, 125, 79, 0.18);
      border-color: rgba(43, 125, 79, 0.5);
    }
    .ohm-seg {
      display: inline-flex;
      gap: 6px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .ohm-seg button {
      font-family: var(--sans);
      font-size: 13px;
      padding: 7px 12px;
      border: 1px solid var(--rule);
      background: #fff;
      color: var(--ink);
      border-radius: 8px;
      cursor: pointer;
    }
    .ohm-seg button[aria-pressed="true"] {
      background: var(--red-bright, #b41f24);
      color: #fff;
      border-color: var(--red-bright, #b41f24);
    }
  </style>
  ${shellHead({
    ns: "ohm",
    figureNo: "FIG. 08 / CIRCUITS & OHM'S LAW",
    titleHTML: "串并联电路<br />与欧姆定律",
    lead: "同一个电池，电阻怎么接，电流就怎么走。切换串/并联、调节电阻，看电流、电压如何重新分配。",
    heroNote: "切换 单/串联/并联 · 拖动电压与电阻滑块 · 看灯泡亮度与电流流向变化",
    navLabel: "电路章节导航",
    navItems: [
      { id: "ohm-intuition", label: "直觉" },
      { id: "ohm-define", label: "定义" },
      { id: "ohm-lab", label: "互动实验" },
      { id: "ohm-limits", label: "边界说明" },
    ],
    firstAnchor: "ohm-intuition",
  })}
    <div class="lab-shell" aria-label="串并联电路交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ohm-canvas" width="600" height="340" aria-label="电路原理图与电流动画"></canvas>
        <div class="canvas-caption">
          <span>蓝点流向 = 电流方向，点越密 / 越快 = 电流越大</span>
          <span id="ohm-status">串联 · U=6V</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>

        <div class="ohm-seg" role="group" aria-label="电路连接方式">
          <button id="ohm-mode-single" type="button" aria-pressed="false">单电阻</button>
          <button id="ohm-mode-series" type="button" aria-pressed="true">串联</button>
          <button id="ohm-mode-parallel" type="button" aria-pressed="false">并联</button>
        </div>

        <label class="control-row" for="ohm-u">
          <span>电源电压 <i>U</i></span>
          <output id="ohm-u-output">6.0 V</output>
        </label>
        <input id="ohm-u" type="range" min="1.5" max="12" step="0.5" value="6" />

        <label class="control-row" for="ohm-r1">
          <span>电阻 <i>R₁</i></span>
          <output id="ohm-r1-output">6 Ω</output>
        </label>
        <input id="ohm-r1" type="range" min="2" max="20" step="1" value="6" />

        <label class="control-row" for="ohm-r2">
          <span>电阻 <i>R₂</i></span>
          <output id="ohm-r2-output">10 Ω</output>
        </label>
        <input id="ohm-r2" type="range" min="2" max="20" step="1" value="10" />

        <div class="ohm-readout" id="ohm-readout"></div>

        <div class="lab-actions">
          <button id="ohm-reset" type="button">重置参数</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ohm-intuition" aria-labelledby="ohm-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="ohm-intuition-title">直觉：电流像水流</h2>
        <p>电压是推动电荷的"水压"，电阻是"水管粗细"。</p>
      </div>
    </div>
    <p>
      把电路想成一套水路：电池是水泵，提供"水压"（电压 <i>U</i>）；电阻像一段窄水管，越窄（阻值越大）越难通过，
      电流 <i>I</i> 就越小。把它们串起来，阻力相加；并起来，则多了一条通路，总阻力反而变小——
      这正是为什么家里电器都<b>并联</b>：每个电器各自一条路，互不影响，开得越多总电流越大。
    </p>
  </section>

  <section class="section-pad" id="ohm-define" aria-labelledby="ohm-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="ohm-define-title">定义：欧姆定律与串并联</h2>
        <p>一段导体中的电流，跟它两端电压成正比，跟电阻成反比。</p>
      </div>
    </div>
    <p>
      欧姆定律：<code>I = U / R</code>。本实验中：
    </p>
    <p style="margin:8px 0 18px">
      · <b>单电阻 / 串联</b>：总电阻 <code>R总 = R₁ + R₂</code>，各处电流相等，电压按阻值分配
      <code>U₁ = I·R₁</code>、<code>U₂ = I·R₂</code>，且 <code>U₁ + U₂ = U</code>。<br />
      · <b>并联</b>：各支路电压都等于电源电压 <code>U</code>，电流按 <code>I₁ = U/R₁</code>、<code>I₂ = U/R₂</code> 分配，
      总电流 <code>I总 = I₁ + I₂</code>，总电阻 <code>R总 = (R₁·R₂)/(R₁+R₂)</code> 比任一支路都小。
    </p>
    <p>
      拖动滑块即可验证：并联时并上一个电阻，总电阻下降、总电流上升，灯泡更亮——这就是"越并越小、越并越亮"。
    </p>
  </section>

  <section class="section-pad" id="ohm-lab" aria-labelledby="ohm-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="ohm-lab-title">互动实验</h2>
        <p>三种接法、三组滑块，实时对照读数面板。</p>
      </div>
    </div>
    <p>
      上方画面里，<b>蓝点沿导线流动表示电流方向</b>，点越密、走得越快代表该处电流越大；
      灯泡的亮度随它分到的电功率变化。建议这样玩：
    </p>
    <p style="margin-top:8px">
      ① 固定 <i>U</i>，在「串联」下增大 <i>R₁</i>，看总电流减小、<i>R₁</i> 两端电压升高；<br />
      ② 切到「并联」，同样的两个电阻，对比总电流是不是比串联时大；<br />
      ③ 并联下再调小 <i>R₂</i>，看 <i>R₂</i> 支路电流增大、总电流增大、灯泡变亮。
    </p>
  </section>

  <section class="section-pad" id="ohm-limits" aria-labelledby="ohm-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="ohm-limits-title">这个模型简化了什么</h2>
        <p>先说清画面与真实电路的差距。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>理想电源</span>
        <h3>忽略电池内阻</h3>
        <p>真实电池有内阻，带负载时端电压会略低于标称电压。本模型把电源当作恒压源。</p>
      </article>
      <article>
        <span>导线电阻</span>
        <h3>视为零</h3>
        <p>导线、开关、电流表的电阻都忽略不计，只保留两个可调电阻与灯泡。</p>
      </article>
      <article>
        <span>灯泡</span>
        <h3>用电阻近似</h3>
        <p>灯泡亮度随功率变化，但其电阻随温度改变；这里用恒定阻值近似，仅作定性演示。</p>
      </article>
    </div>
  </section>
  </div>`;

// ---- 几何辅助 ----
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
function polyLen(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]);
  return L;
}
function pointAtDist(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const seg = dist(pts[i - 1], pts[i]);
    if (d <= seg) {
      const t = seg === 0 ? 0 : d / seg;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
      };
    }
    d -= seg;
  }
  return pts[pts.length - 1];
}

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = {
    mode: "series", // single | series | parallel
    U: 6,
    R1: 6,
    R2: 10,
    phases: {},
    t: 0,
  };
}

// 计算电路物理量（忽略内阻，中学层面）
function compute() {
  const { mode, U, R1, R2 } = state;
  let Rt, Itotal, v1, v2, i1, i2;
  if (mode === "series") {
    Rt = R1 + R2;
    Itotal = U / Rt;
    v1 = Itotal * R1;
    v2 = Itotal * R2;
    i1 = i2 = Itotal;
  } else if (mode === "parallel") {
    Rt = (R1 * R2) / (R1 + R2);
    Itotal = U / Rt;
    i1 = U / R1;
    i2 = U / R2;
    v1 = v2 = U;
  } else {
    // single：只用 R1，R2 短路
    Rt = R1;
    Itotal = U / R1;
    i1 = Itotal;
    i2 = 0;
    v1 = U;
    v2 = 0;
  }
  return { mode, U, R1, R2, Rt, Itotal, v1, v2, i1, i2 };
}

// 依据 mode 生成导线分段（每段带电流值，用于动画流速）
function buildSegments(c) {
  const A = { x: 70, y: 110 };
  const B = { x: 70, y: 230 };
  const segs = [];
  const add = (id, points, current) => segs.push({ id, points, current });

  if (c.mode === "parallel") {
    const L = { x: 200, y: 170 };
    const Rn = { x: 430, y: 170 };
    add("batt", [A, B], c.Itotal);
    add("left", [{ x: 70, y: 110 }, { x: 200, y: 110 }, L], c.Itotal);
    add("branchTop", [L, { x: 315, y: 95 }, Rn], c.i1);
    add("branchBot", [L, { x: 315, y: 245 }, Rn], c.i2);
    add("right", [Rn, { x: 430, y: 230 }, { x: 70, y: 230 }], c.Itotal);
    return { segs, resistors: [
      { at: { x: 315, y: 95 }, angle: -Math.PI / 2, label: "R₁", value: c.R1, active: true, branch: "branchTop" },
      { at: { x: 315, y: 245 }, angle: Math.PI / 2, label: "R₂", value: c.R2, active: true, branch: "branchBot" },
    ], bulb: { at: { x: 430, y: 215 }, bright: c.Itotal } };
  }

  // series / single：顶边放电阻，底边放电灯泡
  const top = [
    A,
    { x: 200, y: 110 },
    { x: 300, y: 110 }, // R1 区
    { x: 400, y: 110 }, // R2 区
    { x: 450, y: 110 },
    { x: 450, y: 230 },
    B,
  ];
  add("loop", top, c.Itotal);
  const resistors = [
    { at: { x: 250, y: 110 }, angle: 0, label: "R₁", value: c.R1, active: true, seg: "loop" },
    { at: { x: 350, y: 110 }, angle: 0, label: "R₂", value: c.R2, active: c.mode === "series", seg: "loop" },
  ];
  return { segs, resistors, bulb: { at: { x: 250, y: 230 }, bright: c.Itotal } };
}

function drawResistor(r) {
  if (!r.active) {
    // 短路：画一段直通导线
    return;
  }
  const { x, y, angle, label, value } = r;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const w = 18;
  ctx.moveTo(-w, 0);
  let sx = -w;
  const step = w / 3;
  for (let i = 0; i < 6; i++) {
    sx += step;
    ctx.lineTo(sx, i % 2 === 0 ? -7 : 7);
  }
  ctx.lineTo(w, 0);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#07182d";
  ctx.font = "12px var(--mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText(`${label} ${value}Ω`, x, y - 16);
}

function drawBulb(b) {
  const { x, y, bright } = b;
  const r = 13;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  const g = Math.max(0.15, Math.min(1, bright / 2));
  ctx.fillStyle = `rgba(255, 214, 102, ${0.25 + 0.75 * g})`;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#07182d";
  ctx.stroke();
  // 灯丝
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 2);
  ctx.lineTo(x - 2, y - 4);
  ctx.lineTo(x + 1, y + 2);
  ctx.lineTo(x + 4, y - 4);
  ctx.strokeStyle = `rgba(120, 60, 0, ${0.4 + 0.6 * g})`;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function drawBattery() {
  const x = 70;
  const yTop = 110;
  const yBot = 230;
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  // 长板(+)
  ctx.beginPath();
  ctx.moveTo(x - 9, yTop);
  ctx.lineTo(x + 9, yTop);
  ctx.stroke();
  // 短板(-)
  ctx.beginPath();
  ctx.moveTo(x - 5, yTop + 9);
  ctx.lineTo(x + 5, yTop + 9);
  ctx.stroke();
  ctx.fillStyle = "#b41f24";
  ctx.font = "bold 12px var(--sans)";
  ctx.textAlign = "center";
  ctx.fillText("+", x + 18, yTop + 4);
  ctx.fillText("−", x + 18, yBot + 4);
  ctx.fillText(`${state.U.toFixed(1)}V`, x, (yTop + yBot) / 2 - 10);
}

function drawFlow(seg, dt) {
  const L = polyLen(seg.points);
  if (L <= 0) return;
  if (state.phases[seg.id] === undefined) state.phases[seg.id] = 0;
  const speed = seg.current * 22; // px/s，正比于电流
  state.phases[seg.id] = (state.phases[seg.id] + speed * dt) % 26;
  const spacing = 26;
  const n = Math.max(1, Math.floor(L / spacing));
  const intensity = Math.min(1, 0.35 + seg.current * 0.4);
  ctx.fillStyle = `rgba(31, 90, 170, ${intensity})`;
  for (let i = 0; i <= n; i++) {
    let d = (state.phases[seg.id] + i * spacing) % L;
    if (d < 0) d += L;
    const p = pointAtDist(seg.points, d);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const c = compute();
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  const built = buildSegments(c);

  // 导线
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  for (const seg of built.segs) {
    ctx.beginPath();
    seg.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
  }

  // 电阻
  for (const r of built.resistors) drawResistor(r);
  // 灯泡
  if (built.bulb) drawBulb(built.bulb);
  // 电池
  drawBattery();

  // 电流流动（用上一帧 dt 近似；首次为 0）
  const dt = 1 / 60;
  for (const seg of built.segs) drawFlow(seg, dt);
}

function updateReadout() {
  const c = compute();
  const el = document.getElementById("ohm-readout");
  if (!el) return;
  const rows = [
    ["电源电压 U", `${c.U.toFixed(1)} V`],
    ["总电阻 R总", `${c.Rt.toFixed(1)} Ω`],
    ["总电流 I总", `${c.Itotal.toFixed(2)} A`],
  ];
  if (c.mode === "parallel") {
    rows.push(["支路电流 I₁", `${c.i1.toFixed(2)} A`]);
    rows.push(["支路电流 I₂", `${c.i2.toFixed(2)} A`]);
  } else {
    rows.push(["R₁ 电压 U₁", `${c.v1.toFixed(2)} V`]);
    rows.push(["R₂ 电压 U₂", `${c.mode === "series" ? c.v2.toFixed(2) : "0.00"} V`]);
  }
  let verify;
  if (c.mode === "series") {
    verify = `验证：U₁ + U₂ = ${(c.v1 + c.v2).toFixed(2)} V ≈ U = ${c.U.toFixed(1)} V`;
  } else if (c.mode === "parallel") {
    verify = `验证：I₁ + I₂ = ${(c.i1 + c.i2).toFixed(2)} A ≈ I总 = ${c.Itotal.toFixed(2)} A`;
  } else {
    verify = `单电阻：I = U / R₁ = ${c.Itotal.toFixed(2)} A（R₂ 被短路）`;
  }
  el.innerHTML =
    rows
      .map((r) => `<div class="ro-item"><span>${r[0]}</span><span>${r[1]}</span></div>`)
      .join("") + `<div class="ro-item verify"><span>${verify}</span></div>`;
  const status = document.getElementById("ohm-status");
  if (status) {
    const modeLabel = { single: "单电阻", series: "串联", parallel: "并联" }[c.mode];
    status.textContent = `${modeLabel} · U=${c.U.toFixed(1)}V · I总=${c.Itotal.toFixed(2)}A`;
  }
}

function setMode(mode) {
  state.mode = mode;
  for (const m of ["single", "series", "parallel"]) {
    const b = document.getElementById(`ohm-mode-${m}`);
    if (b) b.setAttribute("aria-pressed", String(m === mode));
  }
  updateReadout();
}

export default {
  id: "circuit-ohm",
  name: "串并联电路与欧姆定律",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ohm-canvas");
    ctx = canvas.getContext("2d");
    setup();

    document.getElementById("ohm-mode-single").addEventListener("click", () => setMode("single"));
    document.getElementById("ohm-mode-series").addEventListener("click", () => setMode("series"));
    document.getElementById("ohm-mode-parallel").addEventListener("click", () => setMode("parallel"));

    const u = document.getElementById("ohm-u");
    const uOut = document.getElementById("ohm-u-output");
    u.addEventListener("input", () => {
      state.U = Number(u.value);
      uOut.textContent = `${state.U.toFixed(1)} V`;
      updateReadout();
    });

    const r1 = document.getElementById("ohm-r1");
    const r1Out = document.getElementById("ohm-r1-output");
    r1.addEventListener("input", () => {
      state.R1 = Number(r1.value);
      r1Out.textContent = `${state.R1} Ω`;
      updateReadout();
    });

    const r2 = document.getElementById("ohm-r2");
    const r2Out = document.getElementById("ohm-r2-output");
    r2.addEventListener("input", () => {
      state.R2 = Number(r2.value);
      r2Out.textContent = `${state.R2} Ω`;
      updateReadout();
    });

    document.getElementById("ohm-reset").addEventListener("click", () => {
      state.U = 6; state.R1 = 6; state.R2 = 10; state.mode = "series";
      u.value = "6"; uOut.textContent = "6.0 V";
      r1.value = "6"; r1Out.textContent = "6 Ω";
      r2.value = "10"; r2Out.textContent = "10 Ω";
      setMode("series");
    });

    setMode("series");
    updateReadout();
    draw();
  },
  update() {
    draw();
  },
  dispose() {
    ctx = null;
    canvas = null;
    state = null;
  },
  getDefaultParams() {
    return {};
  },
};
