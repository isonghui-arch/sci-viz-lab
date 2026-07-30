// 二氧化碳制取与性质场景：实验室用大理石（碳酸钙）与稀盐酸反应制取 CO₂，
//   再用向上排空气法收集；CO₂ 能使澄清石灰水变浑浊（生成碳酸钙），且密度比空气大、不支持燃烧，可灭火。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .co2-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .co2-section-nav a {
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
    .co2-section-nav a:hover,
    .co2-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .co2-scene #co2-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .co2-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .co2-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .co2-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .co2-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .co2-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "co2",
    figureNo: "FIG. 21 / CHEMISTRY",
    titleHTML: "二氧化碳<br />冒泡产生·一灭了之",
    lead: "石灰石碰上稀盐酸就咕嘟冒出 CO₂；它让澄清石灰水变浑，又因比空气重、不助燃，能把火苗压灭。",
    heroNote: "制取 CO₂ · 看石灰水变浑 · 看火焰熄灭",
    navLabel: "二氧化碳章节导航",
    navItems: [
      { id: "co2-intuition", label: "直觉" },
      { id: "co2-define", label: "定义" },
      { id: "co2-lab", label: "互动实验" },
      { id: "co2-limits", label: "边界说明" },
    ],
    firstAnchor: "co2-intuition",
  })}
    <div class="lab-shell" aria-label="二氧化碳制取与性质交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="co2-canvas" width="640" height="430" aria-label="二氧化碳制取与性质示意图"></canvas>
        <div class="canvas-caption">
          <span>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑　CO₂ 使石灰水变浑·灭火</span>
          <span id="co2-status">待制取</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="co2-readout" id="co2-readout"></div>
        <div class="lab-actions">
          <button id="co2-run" class="accent-button" type="button">制取 CO₂</button>
          <button id="co2-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="co2-intuition" aria-labelledby="co2-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="co2-intuition-title">直觉：会“灭火”的无形气</h2>
      <p>它比空气重，静静沉在下面，把火和空气隔开。</p></div>
    </div>
    <p>
      把石灰石（碳酸钙）丢进稀盐酸，立刻咕嘟咕嘟冒出无色气体——二氧化碳。它有两个“怪脾气”：
      一是能让<b>澄清石灰水变浑浊</b>（生成白色碳酸钙），这是检验 CO₂ 的招牌反应；
      二是它<b>比空气重、又不支持燃烧</b>，会像看不见的毯子一样沉在火苗上方，把氧气隔开，火就灭了。
      所以灭火器、舞台云雾，都用得上它。
    </p>
  </section>

  <section class="section-pad" id="co2-define" aria-labelledby="co2-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="co2-define-title">定义：制取与两大性质</h2>
      <p>怎么来，又怎么被认出来。</p></div>
    </div>
    <p>
      <b>制取</b>：CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑，用<b>向上排空气法</b>收集（因 CO₂ 密度大于空气）。<br />
      <b>检验</b>：通入澄清石灰水，CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O，白色沉淀使液体变浑浊。<br />
      <b>性质</b>：常温常压下为无色气体，密度比空气大，<b>不能燃烧也不支持燃烧</b>——既能灭火，也提醒我们进入深井、地窖前要做“灯火试验”。
    </p>
  </section>

  <section class="section-pad" id="co2-lab" aria-labelledby="co2-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="co2-lab-title">互动实验</h2>
      <p>点“制取 CO₂”，看三步现象依次发生。</p></div>
    </div>
    <p>
      点“制取 CO₂”：发生器里先冒气泡，收集的瓶子里气体越来越多；接着气体通入石灰水，
      液体逐渐变白浑浊；最后 CO₂ 顺着导管倾泻到蜡烛上方，火苗由旺变弱、直至熄灭。
      把三个现象和“密度大、不助燃、使石灰水变浑”一一对应起来，就是 CO₂ 的完整画像。
    </p>
  </section>

  <section class="section-pad" id="co2-limits" aria-labelledby="co2-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="co2-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实实验的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>纯度</span><h3>未计杂质</h3><p>真实盐酸挥发的 HCl 会干扰，本模型默认得到较纯 CO₂。</p></article>
      <article><span>石灰水</span><h3>过量示意</h3><p>石灰水过量与不足时沉淀会再溶解，本模型只展示“变浑”主现象。</p></article>
      <article><span>灭火</span><h3>理想覆盖</h3><p>真实灭火需足够浓度与隔绝，本模型示意密度导致的下沉覆盖。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = {
    running: false,
    gen: 0,     // 制取进度 0..1
    lime: 0,    // 石灰水变浑 0..1
    flame: 1,   // 火焰高度 1..0
    t: 0,
  };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);
  state.t += 0.05;

  // ---- 发生器（左）----
  const fx = 50, fy = 250, fw = 110, fh = 130;
  ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx, fy, fw, fh, 14) : ctx.rect(fx, fy, fw, fh); ctx.fill(); ctx.stroke();
  // 稀盐酸
  ctx.fillStyle = "rgba(140,200,230,0.5)";
  ctx.fillRect(fx + 4, fy + fh - 50, fw - 8, 46);
  // 石灰石
  ctx.fillStyle = "#9b8e7a";
  for (let i = 0; i < 5; i++) ctx.fillRect(fx + 12 + i * 18, fy + fh - 26, 12, 12);
  // 气泡
  if (state.gen > 0 && state.gen < 1) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let k = 0; k < 8; k++) {
      const bx2 = fx + 16 + (k * 13) % (fw - 30);
      const by2 = fy + fh - 20 - ((state.t * 2 + k) % 1) * (fh - 60);
      ctx.beginPath(); ctx.arc(bx2, by2, 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("石灰石 + 稀盐酸", fx + fw / 2, fy - 8);

  // 导管：发生器 → 石灰水 → 蜡烛
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fx + fw, fy + 30); ctx.lineTo(300, fy + 30); ctx.lineTo(300, 250); ctx.lineTo(360, 250);
  ctx.lineTo(360, 300); ctx.lineTo(470, 300); ctx.lineTo(470, 250); ctx.lineTo(540, 250); ctx.lineTo(540, 300);
  ctx.stroke();

  // ---- 石灰水试管（中）----
  const tx = 320, ty = 250, tw = 80, th = 130;
  ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(tx, ty, tw, th, 10) : ctx.rect(tx, ty, tw, th); ctx.fill(); ctx.stroke();
  // 液体：清→浑
  const liqTop = ty + 30;
  ctx.fillStyle = `rgba(${Math.round(255 - 200 * state.lime)}, ${Math.round(255 - 210 * state.lime)}, ${Math.round(255 - 200 * state.lime)}, 0.85)`;
  ctx.fillRect(tx + 4, liqTop, tw - 8, ty + th - liqTop - 4);
  if (state.lime > 0.1) { // 浑浊沉淀
    ctx.fillStyle = `rgba(220,220,210,${0.6 * state.lime})`;
    ctx.fillRect(tx + 4, ty + th - 18, tw - 8, 14);
  }
  ctx.fillStyle = "#07182d"; ctx.textAlign = "center";
  ctx.fillText("澄清石灰水", tx + tw / 2, ty - 8);

  // ---- 蜡烛（右）----
  const cxp = 540, cbot = 380;
  ctx.fillStyle = "#e8d9a0"; ctx.fillRect(cxp - 10, cbot - 60, 20, 60); // 蜡身
  ctx.fillStyle = "#07182d"; ctx.fillText("蜡烛", cxp, cbot + 16);
  // 火焰
  if (state.flame > 0.02) {
    const fhgt = 6 + 34 * state.flame;
    ctx.save();
    ctx.globalAlpha = 0.9;
    const grad = ctx.createLinearGradient(0, cbot - 60 - fhgt, 0, cbot - 60);
    grad.addColorStop(0, "#ffd24d"); grad.addColorStop(1, "#e33a32");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cxp, cbot - 60 - fhgt);
    ctx.quadraticCurveTo(cxp + 12, cbot - 60 - fhgt * 0.4, cxp, cbot - 60);
    ctx.quadraticCurveTo(cxp - 12, cbot - 60 - fhgt * 0.4, cxp, cbot - 60 - fhgt);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(120,120,120,0.5)"; // 灭后青烟
    ctx.beginPath(); ctx.arc(cxp, cbot - 70, 6, 0, Math.PI * 2); ctx.fill();
  }

  // ---- 收集瓶中的 CO₂（随 gen 上升）----
  if (state.gen > 0.02) {
    const bx = 200, by = 120, bw = 80, bh = 180;
    ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    ctx.fillStyle = "rgba(120,140,160,0.35)";
    const fillH = bh * state.gen;
    ctx.fillRect(bx + 2, by + bh - fillH, bw - 4, fillH);
    ctx.fillStyle = "#07182d"; ctx.font = "11px var(--sans)"; ctx.textAlign = "center";
    ctx.fillText("向上排空气收集", bx + bw / 2, by - 6);
  }

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("co2-readout");
  if (!el) return;
  const steps = [];
  steps.push(`<div class="ro-item"><span>制取</span><span>${state.gen > 0.98 ? "完成" : state.gen > 0 ? "进行中" : "未开始"}</span></div>`);
  steps.push(`<div class="ro-item"><span>石灰水</span><span>${state.lime > 0.6 ? "已变浑浊" : state.lime > 0.02 ? "变浑中" : "澄清"}</span></div>`);
  steps.push(`<div class="ro-item verdict"><span>火焰：${state.flame > 0.6 ? "燃烧中" : state.flame > 0.02 ? "将熄灭" : "已熄灭（CO₂灭火）"}</span></div>`);
  el.innerHTML = steps.join("");
  const status = document.getElementById("co2-status");
  if (status) status.textContent = state.running ? "实验中" : (state.flame <= 0.02 ? "完成·火已灭" : "待制取");
}

export default {
  id: "carbon-dioxide",
  name: "二氧化碳制取与性质",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#co2-canvas");
    ctx = canvas.getContext("2d");
    setup();

    document.getElementById("co2-run").addEventListener("click", () => {
      if (state.gen >= 1 && state.lime >= 1 && state.flame <= 0.02) { state.running = false; return; }
      state.running = true;
    });
    document.getElementById("co2-reset").addEventListener("click", () => {
      state.running = false; state.gen = 0; state.lime = 0; state.flame = 1; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.running) return;
    if (state.gen < 1) state.gen = Math.min(1, state.gen + 0.5 * delta);
    else if (state.lime < 1) state.lime = Math.min(1, state.lime + 0.5 * delta);
    else if (state.flame > 0) state.flame = Math.max(0, state.flame - 0.4 * delta);
    else state.running = false;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
