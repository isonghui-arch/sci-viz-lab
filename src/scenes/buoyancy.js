// 浮力与阿基米德原理场景：把物体浸入液体，调节物体密度与液体密度，
//   实时显示排开液体体积、浮力 F浮 = ρ液·g·V排 与重力 G = ρ物·g·V，判断上浮/悬浮/下沉。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .bc-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .bc-section-nav a {
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
    .bc-section-nav a:hover,
    .bc-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .bc-scene #bc-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; cursor: ns-resize; }
    .bc-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .bc-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .bc-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .bc-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .bc-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(24,95,165,0.22); border-color: rgba(24,95,165,0.55); }
  </style>
  ${shellHead({
    ns: "bc",
    figureNo: "FIG. 11 / BUOYANCY",
    titleHTML: "浮力与阿基米德<br />水为什么能托住船",
    lead: "物体浸在液体里会受到向上的托力，它的大小只取决于「排开了多少液体」，而不是物体有多重。",
    heroNote: "调节物体密度与液体密度 · 看物体上浮 / 悬浮 / 下沉",
    navLabel: "浮力章节导航",
    navItems: [
      { id: "bc-intuition", label: "直觉" },
      { id: "bc-define", label: "定义" },
      { id: "bc-lab", label: "互动实验" },
      { id: "bc-limits", label: "边界说明" },
    ],
    firstAnchor: "bc-intuition",
  })}
    <div class="lab-shell" aria-label="浮力交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="bc-canvas" width="620" height="380" aria-label="浮力与排开液体体积演示"></canvas>
        <div class="canvas-caption">
          <span>虚线框 = 排开液体的体积（等于浸没部分的体积）</span>
          <span id="bc-status">悬浮</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="bc-rho-obj"><span>物体密度 ρ物</span><output id="bc-rho-obj-output">0.80</output></label>
        <input id="bc-rho-obj" type="range" min="0.2" max="2.5" step="0.05" value="0.8" />
        <label class="control-row" for="bc-rho-liq"><span>液体密度 ρ液</span><output id="bc-rho-liq-output">1.00</output></label>
        <input id="bc-rho-liq" type="range" min="0.6" max="2.0" step="0.05" value="1.0" />
        <div class="bc-readout" id="bc-readout"></div>
        <div class="lab-actions">
          <button id="bc-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="bc-intuition" aria-labelledby="bc-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="bc-intuition-title">直觉：轮船是铁做的为何不沉</h2>
      <p>浮力不看"谁重"，看"排开了多少水"。</p></div>
    </div>
    <p>
      一块实心铁会沉，但把它造成空心的轮船，排开的水就远比铁本身重——水的托力（浮力）因此大过船的重力，船就浮着。
      所以判断沉浮，要比较两个量：<b>浮力</b>（水往上托的力）和<b>重力</b>（物体往下沉的力）。
      浮力来自液体对物体上下表面的压力差，实质就是"被排开的那部分液体有多重"。
    </p>
  </section>

  <section class="section-pad" id="bc-define" aria-labelledby="bc-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="bc-define-title">定义：阿基米德原理</h2>
      <p>一条式子给出浮力大小。</p></div>
    </div>
    <p><code>F浮 = ρ液 · g · V排</code>，即浮力 = 液体密度 × 重力加速度 × 排开液体的体积。</p>
    <p style="margin:8px 0 18px">
      · <b>ρ物 &lt; ρ液</b>：F浮 &gt; G → <b>上浮</b>，最终漂浮（部分露出）<br />
      · <b>ρ物 = ρ液</b>：F浮 = G → <b>悬浮</b>（可停在液体中任意深度）<br />
      · <b>ρ物 &gt; ρ液</b>：F浮 &lt; G → <b>下沉</b>，直至触底
    </p>
    <p>漂浮时物体静止，浮力恰等于重力；此时 <code>V排 / V物 = ρ物 / ρ液</code>。</p>
  </section>

  <section class="section-pad" id="bc-lab" aria-labelledby="bc-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="bc-lab-title">互动实验</h2>
      <p>把木块丢进水，再把铁块丢进水。</p></div>
    </div>
    <p>
      默认 ρ物=0.8（如木块）丢进 ρ液=1.0 的水：它上浮并漂浮，约 80% 体积浸没。
      把 ρ物 拉到 2.0（如铁）：浮力小于重力，立刻下沉到底。把 ρ液 调成 1.2（如浓盐水），
      原本下沉的铁块可能重新浮起——死海能让人漂浮就是这个道理。读数面板给出 G、F浮 与 V排。
    </p>
  </section>

  <section class="section-pad" id="bc-limits" aria-labelledby="bc-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="bc-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>理想流体</span><h3>忽略黏滞</h3><p>本模型不计液体黏滞阻力与物体下落的加速过程，直接给平衡态。</p></article>
      <article><span>形状</span><h3>只论体积</h3><p>浮力只与 V排 有关，与形状无关；但形状影响稳定性与下沉速度。</p></article>
      <article><span>气体</span><h3>同样适用</h3><p>阿基米德原理对气体也成立（热气球靠空气浮力），本演示以液体为例。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const G = 10;
const V = 8; // 物体体积(单位), 固定

function setup() {
  // y: 物体中心相对"水面"的偏移(px, 正=在水下更深). 用 ease 缓动到目标
  state = { rhoObj: 0.8, rhoLiq: 1.0, y: -30, targetY: -30, t: 0 };
}

function recompute() {
  const { rhoObj, rhoLiq } = state;
  // 容器几何
  const waterTop = 120, waterBottom = 340;
  const cubeH = 90;
  if (rhoObj <= rhoLiq) {
    // 漂浮: 浸没分数 f = rhoObj/rhoLiq, 物体底在水面下 f*cubeH
    const f = rhoObj / rhoLiq;
    // 物体中心 y(相对水面, 0=水面): 中心在水面下 f*cubeH - cubeH/2
    state.targetY = waterTop + (f * cubeH - cubeH / 2);
  } else {
    // 下沉: 落到底, 中心 = waterBottom - cubeH/2
    state.targetY = waterBottom - cubeH / 2;
  }
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  const waterTop = 120, waterBottom = 340;
  const cx = W / 2;
  const cubeH = 90, cubeW = 90;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 容器
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 60); ctx.lineTo(120, waterBottom + 8);
  ctx.lineTo(W - 120, waterBottom + 8); ctx.lineTo(W - 120, 60);
  ctx.stroke();

  // 液体
  ctx.fillStyle = "rgba(24,95,165,0.30)";
  ctx.fillRect(123, waterTop, W - 246, waterBottom - waterTop);
  ctx.fillStyle = "#0F4C81";
  ctx.font = "12px var(--sans)";
  ctx.textAlign = "center";
  ctx.fillText("液体 ρ液 = " + state.rhoLiq.toFixed(2), cx, waterTop - 40);

  // 物体
  const oy = state.y; // 中心 y
  const ox = cx;
  const submergedTop = oy - cubeH / 2;
  const submergedBottom = oy + cubeH / 2;
  // 浸没部分高
  const subTopC = Math.max(submergedTop, waterTop);
  const subH = Math.max(0, Math.min(submergedBottom, waterBottom) - subTopC);
  // 物体整体
  ctx.fillStyle = state.rhoObj > state.rhoLiq ? "#8a6d3b" : "#b45f1f";
  ctx.fillRect(ox - cubeW / 2, oy - cubeH / 2, cubeW, cubeH);
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2;
  ctx.strokeRect(ox - cubeW / 2, oy - cubeH / 2, cubeW, cubeH);

  // 排开液体体积(虚线框 = 浸没部分)
  if (subH > 0) {
    ctx.strokeStyle = "#b41f24";
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.strokeRect(ox - cubeW / 2, subTopC, cubeW, subH);
    ctx.setLineDash([]);
    ctx.fillStyle = "#b41f24";
    ctx.fillText("排开液体 V排", ox, subTopC + subH / 2);
  }

  // 力箭头: 重力(下,红) 浮力(上,蓝)
  ctx.strokeStyle = "#b41f24"; ctx.lineWidth = 3;
  arrow(ox + 60, oy, ox + 60, oy + 50, "#b41f24");
  ctx.fillStyle = "#b41f24"; ctx.fillText("G", ox + 72, oy + 40);
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 3;
  arrow(ox - 60, oy, ox - 60, oy - 50, "#185FA5");
  ctx.fillStyle = "#185FA5"; ctx.fillText("F浮", ox - 78, oy - 40);

  updateReadout(subH);
}

function arrow(x1, y1, x2, y2, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - h * Math.cos(ang - 0.4), y2 - h * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - h * Math.cos(ang + 0.4), y2 - h * Math.sin(ang + 0.4));
  ctx.closePath(); ctx.fill();
}

function updateReadout(subH) {
  const el = document.getElementById("bc-readout");
  if (!el) return;
  const Gforce = state.rhoObj * G * V;
  const Vsub = (subH / 90) * V;
  const Ffloat = state.rhoLiq * G * Vsub;
  let verdict;
  if (state.rhoObj < state.rhoLiq) verdict = "上浮 → 漂浮（F浮 = G）";
  else if (Math.abs(state.rhoObj - state.rhoLiq) < 0.02) verdict = "悬浮（F浮 = G，可停任意深度）";
  else verdict = "下沉（F浮 < G）";
  el.innerHTML =
    `<div class="ro-item"><span>重力 G</span><span>${Gforce.toFixed(1)}</span></div>` +
    `<div class="ro-item"><span>浮力 F浮</span><span>${Ffloat.toFixed(1)}</span></div>` +
    `<div class="ro-item"><span>V排 / V物</span><span>${(Vsub / V).toFixed(2)}</span></div>` +
    `<div class="ro-item verdict"><span>${verdict}</span></div>`;
  const status = document.getElementById("bc-status");
  if (status) status.textContent = verdict.split("（")[0];
}

export default {
  id: "buoyancy",
  name: "浮力与阿基米德原理",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#bc-canvas");
    ctx = canvas.getContext("2d");
    setup();
    recompute();

    const bind = (id, key, outId) => {
      const s = document.getElementById(id);
      const o = document.getElementById(outId);
      s.addEventListener("input", () => {
        state[key] = Number(s.value);
        o.textContent = Number(s.value).toFixed(2);
        recompute();
      });
    };
    bind("bc-rho-obj", "rhoObj", "bc-rho-obj-output");
    bind("bc-rho-liq", "rhoLiq", "bc-rho-liq-output");

    document.getElementById("bc-reset").addEventListener("click", () => {
      state.rhoObj = 0.8; state.rhoLiq = 1.0;
      document.getElementById("bc-rho-obj").value = "0.8"; document.getElementById("bc-rho-obj-output").textContent = "0.80";
      document.getElementById("bc-rho-liq").value = "1.0"; document.getElementById("bc-rho-liq-output").textContent = "1.00";
      recompute(); draw();
    });
    draw();
  },
  update() {
    if (!state) return;
    state.y += (state.targetY - state.y) * 0.12;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
