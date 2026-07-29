// 双摆混沌：用多个初始角相差极小的双摆，演示对初值的敏感依赖（混沌）。
// 纯 Canvas 2D，无 Three.js，沿用 scene-shell.js 的 shellHead 共享壳范式。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .dp-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .dp-section-nav a {
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
    .dp-section-nav a:hover,
    .dp-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .dp-scene #dp-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: var(--navy);
    }
    .dp-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      margin-top: 10px;
    }
    .dp-legend span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--sans);
      font-size: 12px;
      color: var(--muted);
    }
    .dp-legend i {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      display: inline-block;
    }
  </style>
  ${shellHead({
    ns: "dp",
    figureNo: "FIG. 12 / 力学 · 混沌",
    titleHTML: "双摆混沌<br />一模一样的摆，<br />为何分道扬镳",
    lead: "取若干支初始角仅差十万分之一弧度的双摆，放它们同时下落——几秒后它们便各奔东西。",
    heroNote: "拖动「初始偏差」看发散快慢 · 调小偏差，混沌来得越晚却越必然",
    navLabel: "双摆混沌章节导航",
    navItems: [
      { id: "dp-intuition", label: "直觉" },
      { id: "dp-definition", label: "定义" },
      { id: "dp-experiment", label: "互动实验" },
      { id: "dp-boundary", label: "边界说明" },
    ],
    firstAnchor: "dp-intuition",
  })}
    <div class="lab-shell" aria-label="双摆混沌交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="dp-canvas" width="640" height="440" aria-label="多个双摆同时运动，轨迹逐渐发散"></canvas>
        <div class="canvas-caption">
          <span>双摆混沌 · 多初值演示</span>
          <span id="dp-status">运行 0.0s</span>
        </div>
        <div class="dp-legend" id="dp-legend"></div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>

        <label class="control-row" for="dp-count">
          <span>摆数</span>
          <output id="dp-count-output">3</output>
        </label>
        <input id="dp-count" type="range" min="1" max="6" step="1" value="3" />

        <label class="control-row" for="dp-speed">
          <span>速度</span>
          <output id="dp-speed-output">3</output>
        </label>
        <input id="dp-speed" type="range" min="1" max="5" step="1" value="3" />

        <label class="control-row" for="dp-div">
          <span>初始偏差</span>
          <output id="dp-div-output">1e-4</output>
        </label>
        <input id="dp-div" type="range" min="0" max="7" step="1" value="2" />

        <label class="control-row" for="dp-damp">
          <span>阻尼</span>
          <output id="dp-damp-output">0.0%</output>
        </label>
        <input id="dp-damp" type="range" min="0" max="20" step="1" value="0" />

        <div class="lab-actions">
          <button id="dp-toggle" type="button">暂停</button>
          <button id="dp-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="dp-intuition" aria-labelledby="dp-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="dp-intuition-title">直觉：刚开始它们叠在一起</h2>
        <p>把几支几乎一模一样的双摆并排放下，前一两秒你几乎分不出差别。</p>
      </div>
    </div>
    <p>
      双摆就是一根摆的末端再挂一根摆。两个关节都能自由旋转，是个只有两个自由度的极简系统。
      可正是这种"极简"，让它在外力很小时依然会翻滚、甩动、毫无规律可循——
      你会看到所有轨迹先贴合、再分裂、最后彻底互不相关。
    </p>
  </section>

  <section class="section-pad" id="dp-definition" aria-labelledby="dp-definition-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="dp-definition-title">定义：对初值的敏感依赖</h2>
        <p>混沌不是"乱"，而是一种可被精确定义的动力学性质。</p>
      </div>
    </div>
    <p>
      当系统的两条轨道满足：初值相差任意小，经过足够长时间后两者距离却可以变得任意大——
      我们就说它具有<strong>对初值的敏感依赖</strong>，即<strong>确定性混沌</strong>。
      双摆是展示它的经典玩具：运动完全由牛顿定律（确定）决定，没有任何随机项，
      但只要把第二根摆的初始角改动十万分之一弧度，几秒后两支摆的位置就再也认不出彼此。
    </p>
  </section>

  <section class="section-pad" id="dp-experiment" aria-labelledby="dp-experiment-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="dp-experiment-title">互动实验</h2>
        <p>用右侧滑块控制演示，亲自观察"必然的分道扬镳"。</p>
      </div>
    </div>
    <p>
      - <strong>摆数</strong>：同时落下几支摆（1–6），越多越能看出"同一条规律、不同的命运"。<br />
      - <strong>速度</strong>：每帧的积分步数，等价于时间流速。<br />
      - <strong>初始偏差</strong>：第二根摆之间的初始角差（1e-5 ~ 3e-2 弧度）。调小，发散来得更晚；调大，几乎立刻分裂。<br />
      - <strong>阻尼</strong>：给每个关节加一点能量耗散。完全无阻尼时甩动最久；加阻尼后摆会逐渐平静，混沌窗口缩短。<br />
      点 <strong>重置</strong> 重新以当前参数落下。注意：无论偏差多小，长期看发散都不可避免——这正是混沌的"确定性中的不可预测"。
    </p>
  </section>

  <section class="section-pad" id="dp-boundary" aria-labelledby="dp-boundary-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="dp-boundary-title">边界说明 · 来源追溯</h2>
        <p>在什么前提下结论成立，以及它从哪来。</p>
      </div>
    </div>
    <p>
      - 本演示用半隐式欧拉法近似积分，步长固定；<strong>这是数值近似</strong>，超长时间后各摆的轨迹会与"真实物理"逐渐偏离，
        但<em>短期内的发散形态</em>与真实双摆一致，足以说明敏感依赖。<br />
      - "敏感依赖"不要求偏差无限小才算混沌；它描述的是<em>任意小偏差都会被放大</em>的极限性质。<br />
      - 来源：双摆运动方程见 Taylor《Classical Mechanics》第 11 章；混沌的引入可参考 Gleick《Chaos: Making a New Science》。
      在线范式的可视化致敬 Daniel Shiffman（Coding Train）的双摆示例。
    </p>
  </section>
  </div>`;

// —— 物理参数 ——
const G = 1.0;          // 缩放后的重力加速度
const M1 = 1.0, M2 = 1.0;
const L1 = 1.0, L2 = 1.0;
const SUBSTEP = 0.4;    // 单个积分微步（固定）
const TRAIL_MAX = 320;  // 每支摆保留的轨迹点上限

const PALETTE = ["#b41f24", "#e5a526", "#3f8fce", "#1f9e7a", "#b46fd1", "#e07b39"];
const DIV_TABLE = [1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2];

let canvas = null, ctx = null, root = null;
let pendulums = [];
let running = true;
let elapsed = 0;
let params = { count: 3, speed: 3, divIndex: 2, damping: 0, div: 1e-4 };
let raf = 0;

function makePendulum(i, div) {
  return {
    a1: Math.PI / 2,
    a2: Math.PI / 2 + i * div,
    a1_v: 0,
    a2_v: 0,
    color: PALETTE[i % PALETTE.length],
    trail: [],
  };
}

function reset() {
  pendulums = [];
  for (let i = 0; i < params.count; i++) {
    pendulums.push(makePendulum(i, params.div));
  }
  elapsed = 0;
}

function step(p, dt, damping) {
  const num1 =
    -G * (2 * M1 + M2) * Math.sin(p.a1) -
    M2 * G * Math.sin(p.a1 - 2 * p.a2) -
    2 * Math.sin(p.a1 - p.a2) * M2 *
      (p.a2_v * p.a2_v * L2 + p.a1_v * p.a1_v * L1 * Math.cos(p.a1 - p.a2));
  const den1 = L1 * (2 * M1 + M2 - M2 * Math.cos(2 * p.a1 - 2 * p.a2));
  const a1_a = num1 / den1;

  const num2 =
    2 * Math.sin(p.a1 - p.a2) *
    (p.a1_v * p.a1_v * L1 * (M1 + M2) +
      G * (M1 + M2) * Math.cos(p.a1) +
      p.a2_v * p.a2_v * L2 * M2 * Math.cos(p.a1 - p.a2));
  const den2 = L2 * (2 * M1 + M2 - M2 * Math.cos(2 * p.a1 - 2 * p.a2));
  const a2_a = num2 / den2;

  const keep = 1 - damping;
  p.a1_v = (p.a1_v + a1_a * dt) * keep;
  p.a2_v = (p.a2_v + a2_a * dt) * keep;
  p.a1 += p.a1_v * dt;
  p.a2 += p.a2_v * dt;
}

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#07182d";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const pivotY = h * 0.28;
  const scale = Math.min(w, h) * 0.20; // 单位长度 → 像素
  const L1px = scale * L1, L2px = scale * L2;

  // 轨迹（先画，置于杆下方）
  for (const p of pendulums) {
    const t = p.trail;
    for (let k = 1; k < t.length; k++) {
      const alpha = (k / t.length) * 0.55;
      ctx.beginPath();
      ctx.moveTo(t[k - 1].x, t[k - 1].y);
      ctx.lineTo(t[k].x, t[k].y);
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // 摆杆与摆锤
  for (const p of pendulums) {
    const x1 = cx + L1px * Math.sin(p.a1);
    const y1 = pivotY + L1px * Math.cos(p.a1);
    const x2 = x1 + L2px * Math.sin(p.a2);
    const y2 = y1 + L2px * Math.cos(p.a2);

    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx, pivotY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(x1, y1, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x2, y2, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 固定支点
  ctx.fillStyle = "#f3efe5";
  ctx.beginPath();
  ctx.arc(cx, pivotY, 4, 0, Math.PI * 2);
  ctx.fill();

  const status = root && root.querySelector("#dp-status");
  if (status) status.textContent = "运行 " + elapsed.toFixed(1) + "s";
}

function tick() {
  if (running) {
    const steps = params.speed; // 每帧积分步数 = 速度
    for (let s = 0; s < steps; s++) {
      for (const p of pendulums) step(p, SUBSTEP, params.damping);
    }
    elapsed += params.speed * SUBSTEP * 0.1;
    // 记录轨迹（每帧一次，足够密）
    const cx = canvas.width / 2;
    const pivotY = canvas.height * 0.28;
    const scale = Math.min(canvas.width, canvas.height) * 0.20;
    for (const p of pendulums) {
      const x1 = cx + scale * Math.sin(p.a1);
      const y1 = pivotY + scale * Math.cos(p.a1);
      const x2 = x1 + scale * Math.sin(p.a2);
      const y2 = y1 + scale * Math.cos(p.a2);
      p.trail.push({ x: x2, y: y2 });
      if (p.trail.length > TRAIL_MAX) p.trail.shift();
    }
  }
  draw();
}

export default {
  id: "double-pendulum",
  name: "双摆混沌",
  category: "mechanics",
  init(container) {
    container.innerHTML = template;
    root = container;
    canvas = container.querySelector("#dp-canvas");
    ctx = canvas.getContext("2d");

    const count = container.querySelector("#dp-count");
    const countOut = container.querySelector("#dp-count-output");
    const speed = container.querySelector("#dp-speed");
    const speedOut = container.querySelector("#dp-speed-output");
    const div = container.querySelector("#dp-div");
    const divOut = container.querySelector("#dp-div-output");
    const damp = container.querySelector("#dp-damp");
    const dampOut = container.querySelector("#dp-damp-output");
    const toggle = container.querySelector("#dp-toggle");
    const resetBtn = container.querySelector("#dp-reset");
    const legend = container.querySelector("#dp-legend");

    const syncLegend = () => {
      legend.innerHTML = pendulums
        .map(
          (p, i) =>
            `<span><i style="background:${p.color}"></i>摆 ${i + 1}${
              i === 0 ? "（基准）" : ""
            }</span>`
        )
        .join("");
    };

    const reapply = () => {
      reset();
      syncLegend();
      draw();
    };

    count.addEventListener("input", () => {
      params.count = Number(count.value);
      countOut.textContent = params.count;
      reapply();
    });
    speed.addEventListener("input", () => {
      params.speed = Number(speed.value);
      speedOut.textContent = params.speed;
    });
    div.addEventListener("input", () => {
      params.divIndex = Number(div.value);
      params.div = DIV_TABLE[params.divIndex];
      divOut.textContent = params.div.toExponential(0).replace("e", "e");
      reapply();
    });
    damp.addEventListener("input", () => {
      params.damping = Number(damp.value) / 1000;
      dampOut.textContent = (Number(damp.value) / 10).toFixed(1) + "%";
    });
    toggle.addEventListener("click", () => {
      running = !running;
      toggle.textContent = running ? "暂停" : "继续";
    });
    resetBtn.addEventListener("click", () => {
      reapply();
      if (!running) {
        running = true;
        toggle.textContent = "暂停";
      }
    });

    reapply();
  },
  update() {
    tick();
  },
  dispose() {
    pendulums = [];
    ctx = null;
    canvas = null;
    root = null;
    running = true;
    raf = 0;
  },
  getDefaultParams() {
    return {};
  },
};
