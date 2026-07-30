// 电解水场景：直流电源电解水，阴极产生氢气、阳极产生氧气，体积比 2:1。
//   动画：气泡从电极升起，倒立量气管收集气体；可通电/断电、调电流、重置。带课标讲解。
// 范式：shellHead 生成骨架 + 自有 lab-shell + 自有 section。导航由注册表自动按分类生成。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ely-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .ely-section-nav a {
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
    .ely-section-nav a:hover,
    .ely-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .ely-scene #ely-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .ely-readout {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
    }
    .ely-readout .ro-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      font-family: var(--mono, monospace);
      font-size: 12px;
    }
    .ely-readout .ro-item span:first-child { color: rgba(255, 255, 255, 0.6); }
    .ely-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .ely-readout .ro-item.verify {
      grid-column: 1 / -1;
      background: rgba(31, 90, 170, 0.18);
      border-color: rgba(31, 90, 170, 0.5);
    }
    .ely-readout .ro-item.eq {
      grid-column: 1 / -1;
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.12);
      font-size: 11px;
      line-height: 1.7;
    }
  </style>
  ${shellHead({
    ns: "ely",
    figureNo: "FIG. 09 / ELECTROLYSIS OF WATER",
    titleHTML: "电解水<br />水由什么<br />组成？",
    lead: "通直流电，水被拆成氢气和氧气。两种气体体积之比，恰好是 2 : 1——这藏着水的分子秘密。",
    heroNote: "点「通电」看气泡上升 · 调电流改变产气快慢 · 看量气管里 2:1 的体积比",
    navLabel: "电解水章节导航",
    navItems: [
      { id: "ely-intuition", label: "直觉" },
      { id: "ely-define", label: "定义" },
      { id: "ely-lab", label: "互动实验" },
      { id: "ely-limits", label: "边界说明" },
    ],
    firstAnchor: "ely-intuition",
  })}
    <div class="lab-shell" aria-label="电解水交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ely-canvas" width="600" height="340" aria-label="电解水装置与气泡动画"></canvas>
        <div class="canvas-caption">
          <span>左(−)阴极产氢气 · 右(+)阳极产氧气 · 体积比 2:1</span>
          <span id="ely-status">已断电</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>

        <div class="lab-actions">
          <button id="ely-power" class="accent-button" type="button" aria-pressed="false">通电</button>
          <button id="ely-reset" type="button">重置</button>
        </div>

        <label class="control-row" for="ely-current">
          <span>电流大小</span>
          <output id="ely-current-output">中</output>
        </label>
        <input id="ely-current" type="range" min="1" max="5" step="1" value="3" />

        <div class="ely-readout" id="ely-readout"></div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ely-intuition" aria-labelledby="ely-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="ely-intuition-title">直觉：水不是"元素"</h2>
        <p>看似纯净的一杯水，其实是氢和氧的化合物。</p>
      </div>
    </div>
    <p>
      通电之前，水安静地待在杯里。一旦接上直流电，水分子被"拆开"：在负极（阴极）得到电子放出
      <b>氢气</b>，在正极（阳极）放出 <b>氧气</b>。两种气体用倒扣的试管收集，会发现氢气体积总是氧气的
      <b>两倍</b>——这个 2:1，正是水分子里氢原子与氧原子的个数比。
    </p>
  </section>

  <section class="section-pad" id="ely-define" aria-labelledby="ely-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="ely-define-title">定义：电解水反应</h2>
        <p>水在直流电下分解为氢气与氧气。</p>
      </div>
    </div>
    <p style="font-family: var(--mono, monospace); font-size: 13px; line-height: 2">
      阴极(−)：2H₂O + 2e⁻ → H₂↑ + 2OH⁻<br />
      阳极(+)：2H₂O → O₂↑ + 4H⁺ + 4e⁻<br />
      总反应：2H₂O <span style="white-space:nowrap">—通电→</span> 2H₂↑ + O₂↑
    </p>
    <p>
      每生成 1 个 O₂ 分子，同时生成 2 个 H₂ 分子，所以同温同压下
      <b>V(H₂) : V(O₂) = 2 : 1</b>。据此还能推知：水由氢、氧两种元素组成，分子中 H:O = 2:1。
    </p>
  </section>

  <section class="section-pad" id="ely-lab" aria-labelledby="ely-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="ely-lab-title">互动实验</h2>
        <p>通电、调电流、看体积比如何稳定收敛到 2:1。</p>
      </div>
    </div>
    <p>
      点「通电」开始电解：左侧阴极冒气泡更快（氢气），右侧阳极较慢（氧气）。两根量气管的液面随之下降，
      气体体积持续增长。建议这样观察：
    </p>
    <p style="margin-top:8px">
      ① 调大「电流大小」，气泡更密、产气更快，但 2:1 的比例不变；<br />
      ② 等任一试管集满，对比此时两根管里气体的体积——是否接近 2:1；<br />
      ③ 点「断电」停止，气泡立刻消失，已收集的体积保留。
    </p>
  </section>

  <section class="section-pad" id="ely-limits" aria-labelledby="ely-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="ely-limits-title">这个模型简化了什么</h2>
        <p>真实电解与检验，有一些这里没画出的细节。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>增强导电</span>
        <h3>纯水几乎不导电</h3>
        <p>实验常加少量稀硫酸或 NaOH 增强导电性；本模型默认水可电解，不计外加电解质。</p>
      </article>
      <article>
        <span>气体检验</span>
        <h3>燃 / 助燃</h3>
        <p>氢气点燃有淡蓝色火焰（或"爆鸣"）；氧气使带火星木条复燃。画面未做点燃演示。</p>
      </article>
      <article>
        <span>速率模型</span>
        <h3>理想化产气</h3>
        <p>产气速率与电流成正比（法拉第定律），这里用简化的线性速率近似，不做定量标定。</p>
      </article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

// 几何
const TANK = { x0: 130, x1: 470, top: 90, bottom: 286 };
const SURFACE = 126; // 水面
const CATHODE = { x: 250 }; // 负极(−) 产 H2
const ANODE = { x: 390 }; // 正极(+) 产 O2
const ELECT_TOP = 60;
const ELECT_BOT = 252;
const TUBE = { top: 44, bottom: 122, halfW: 22 };

function setup() {
  state = {
    powered: false,
    current: 3,
    vH2: 0,
    vO2: 0,
    maxVol: 30, // 试管"满"时的体积标度（mL，示意）
    bubbles: [],
    t: 0,
  };
}

function rateFactor() {
  return state.current * 0.6; // O2 基础速率（mL/s 示意）
}

function spawnBubble(kind) {
  const x = (kind === "H2" ? CATHODE.x : ANODE.x) + (Math.random() - 0.5) * 10;
  state.bubbles.push({
    x,
    y: ELECT_BOT - Math.random() * 10,
    r: 1.6 + Math.random() * 1.8,
    vy: 26 + Math.random() * 14,
    kind,
  });
}

function updateSim(dt) {
  if (state.powered) {
    const rf = rateFactor();
    state.vO2 += rf * dt;
    state.vH2 += 2 * rf * dt; // 体积比 2:1
    // 产气气泡
    const nH2 = Math.round((2 * rf * 30) * dt);
    const nO2 = Math.round((rf * 30) * dt);
    for (let i = 0; i < nH2; i++) spawnBubble("H2");
    for (let i = 0; i < nO2; i++) spawnBubble("O2");
  }
  for (let i = state.bubbles.length - 1; i >= 0; i--) {
    const b = state.bubbles[i];
    b.y -= b.vy * dt;
    if (b.y <= SURFACE) state.bubbles.splice(i, 1);
  }
  if (state.bubbles.length > 400) state.bubbles.splice(0, state.bubbles.length - 400);
}

function fillFrac(v) {
  return Math.min(1, v / state.maxVol);
}

function drawTube(cx, v, label, color) {
  const x = cx - TUBE.halfW;
  const w = TUBE.halfW * 2;
  const f = fillFrac(v);
  const gasH = f * (TUBE.bottom - TUBE.top);
  // 试管壁
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, TUBE.top);
  ctx.lineTo(x, TUBE.bottom);
  ctx.lineTo(x + w, TUBE.bottom);
  ctx.lineTo(x + w, TUBE.top);
  ctx.stroke();
  // 管内气体（顶部）
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, TUBE.top + 1, w - 2, gasH);
  // 管内水（气体下方到管口）
  ctx.fillStyle = "rgba(31, 90, 170, 0.35)";
  ctx.fillRect(x + 1, TUBE.top + 1 + gasH, w - 2, TUBE.bottom - TUBE.top - 1 - gasH);
  // 标签
  ctx.fillStyle = "#07182d";
  ctx.font = "bold 12px var(--sans)";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, TUBE.top - 6);
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 水槽
  ctx.fillStyle = "rgba(31, 90, 170, 0.18)";
  ctx.fillRect(TANK.x0, TANK.top, TANK.x1 - TANK.x0, TANK.bottom - TANK.top);
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  ctx.strokeRect(TANK.x0, TANK.top, TANK.x1 - TANK.x0, TANK.bottom - TANK.top);
  // 水面
  ctx.strokeStyle = "rgba(31, 90, 170, 0.6)";
  ctx.beginPath();
  ctx.moveTo(TANK.x0, SURFACE);
  ctx.lineTo(TANK.x1, SURFACE);
  ctx.stroke();

  // 电极
  for (const e of [{ x: CATHODE.x, sign: "−" }, { x: ANODE.x, sign: "+" }]) {
    ctx.fillStyle = e.sign === "−" ? "#3a6ea5" : "#c0563b";
    ctx.fillRect(e.x - 4, ELECT_TOP, 8, ELECT_BOT - ELECT_TOP);
    ctx.fillStyle = "#07182d";
    ctx.font = "bold 13px var(--sans)";
    ctx.textAlign = "center";
    ctx.fillText(e.sign, e.x, ELECT_TOP - 6);
  }

  // 气泡
  for (const b of state.bubbles) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.kind === "H2" ? "rgba(58, 110, 165, 0.8)" : "rgba(192, 86, 59, 0.8)";
    ctx.fill();
  }

  // 量气管（在电极正上方）
  drawTube(CATHODE.x, state.vH2, "H₂", "rgba(58, 110, 165, 0.55)");
  drawTube(ANODE.x, state.vO2, "O₂", "rgba(192, 86, 59, 0.55)");

  // 电源与导线
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 2;
  const bx = (CATHODE.x + ANODE.x) / 2;
  ctx.strokeRect(bx - 26, 14, 52, 22);
  ctx.fillStyle = "#07182d";
  ctx.font = "bold 11px var(--sans)";
  ctx.textAlign = "center";
  ctx.fillText("DC", bx, 29);
  // 导线：电源 → 电极顶端
  ctx.beginPath();
  ctx.moveTo(bx - 20, 36);
  ctx.lineTo(CATHODE.x, ELECT_TOP);
  ctx.moveTo(bx + 20, 36);
  ctx.lineTo(ANODE.x, ELECT_TOP);
  ctx.stroke();
}

function updateReadout() {
  const el = document.getElementById("ely-readout");
  if (!el) return;
  const ratio = state.vO2 > 0.01 ? (state.vH2 / state.vO2).toFixed(2) : "—";
  el.innerHTML =
    `<div class="ro-item"><span>氢气 H₂ 体积</span><span>${state.vH2.toFixed(1)} mL</span></div>` +
    `<div class="ro-item"><span>氧气 O₂ 体积</span><span>${state.vO2.toFixed(1)} mL</span></div>` +
    `<div class="ro-item verify"><span>体积比 V(H₂):V(O₂) = ${ratio} : 1（理论 2 : 1）</span></div>` +
    `<div class="ro-item eq"><span>总反应：2H₂O —通电→ 2H₂↑ + O₂↑</span></div>`;
  const status = document.getElementById("ely-status");
  if (status) status.textContent = state.powered ? "电解中…" : "已断电";
}

export default {
  id: "electrolysis",
  name: "电解水",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ely-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const powerBtn = document.getElementById("ely-power");
    powerBtn.addEventListener("click", () => {
      state.powered = !state.powered;
      powerBtn.textContent = state.powered ? "断电" : "通电";
      powerBtn.setAttribute("aria-pressed", String(state.powered));
      updateReadout();
    });

    const cur = document.getElementById("ely-current");
    const curOut = document.getElementById("ely-current-output");
    const curLabel = (v) => (v <= 1 ? "弱" : v <= 3 ? "中" : "强");
    cur.addEventListener("input", () => {
      state.current = Number(cur.value);
      curOut.textContent = curLabel(state.current);
    });

    document.getElementById("ely-reset").addEventListener("click", () => {
      state.vH2 = 0;
      state.vO2 = 0;
      state.bubbles = [];
      updateReadout();
    });

    updateReadout();
    draw();
  },
  update(params) {
    if (!state) return;
    const dt = Math.min(params?.delta ?? 0, 0.05);
    updateSim(dt);
    draw();
    // 每帧刷新读数（体积在变化）
    if (state.powered) updateReadout();
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
