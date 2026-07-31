// 制取氧气场景：加热高锰酸钾(KMnO₄)产生 O₂，用排水法收集（O₂ 把瓶内水排出），
//   最后用带火星木条伸入验满——木条复燃即证明是 O₂。分加热、收集、验满三步演示。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .oxp-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .oxp-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .oxp-section-nav a:hover, .oxp-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .oxp-scene #oxp-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .oxp-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .oxp-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .oxp-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .oxp-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .oxp-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "oxp",
    figureNo: "FIG. 26 / CHEMISTRY",
    titleHTML: "制取氧气<br />冒泡·排水·复燃",
    lead: "紫黑色高锰酸钾一加热就放出 O₂；用排水法把瓶里的水顶出去收集，最后带火星的木条一伸进去——呼，又烧起来了。",
    heroNote: "点开始制取 · 看三步：加热→排水收集→验满复燃",
    navLabel: "制取氧气章节导航",
    navItems: [
      { id: "oxp-intuition", label: "直觉" },
      { id: "oxp-define", label: "定义" },
      { id: "oxp-lab", label: "互动实验" },
      { id: "oxp-limits", label: "边界说明" },
    ],
    firstAnchor: "oxp-intuition",
  })}
    <div class="lab-shell" aria-label="制取氧气交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="oxp-canvas" width="640" height="430" aria-label="制取氧气装置示意图"></canvas>
        <div class="canvas-caption">
          <span>2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑　排水法收集·带火星木条复燃验满</span>
          <span id="oxp-status">待制取</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="oxp-readout" id="oxp-readout"></div>
        <div class="lab-actions">
          <button id="oxp-run" class="accent-button" type="button">开始制取</button>
          <button id="oxp-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="oxp-intuition" aria-labelledby="oxp-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="oxp-intuition-title">直觉：会"救活"火星的气体</h2>
      <p>它让快灭的火星重新烧起来，这是它的招牌。</p></div>
    </div>
    <p>
      把紫黑色的高锰酸钾装进试管加热，不一会儿就有无色气泡往外冒——那是氧气 O₂。因为 O₂ <b>不易溶于水</b>，
      最干净的办法是用<b>排水法</b>收集：把瓶子装满水倒扣在水槽里，气体进去就把水一点点顶出来。
      收集满后，拿一根<b>带火星的木条</b>伸进瓶口，如果它"呼"地复燃，就证明瓶里是氧气——这是检验 O₂ 的经典一招。
    </p>
  </section>

  <section class="section-pad" id="oxp-define" aria-labelledby="oxp-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="oxp-define-title">定义：反应、收集与验满</h2>
      <p>三步连起来，就是实验室制氧。</p></div>
    </div>
    <p>
      <b>反应</b>：2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑（加热，试管口略向下防冷凝水倒流）。<br />
      <b>收集</b>：O₂ 不易溶于水，用<b>排水法</b>；也可用向上排空气法（密度比空气大）。<br />
      <b>验满</b>：排水法看瓶口气泡冒出；向上排空气法把带火星木条放瓶口，<b>复燃则满</b>。<br />
      本场景聚焦排水法全流程。
    </p>
  </section>

  <section class="section-pad" id="oxp-lab" aria-labelledby="oxp-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="oxp-lab-title">互动实验</h2>
      <p>点开始制取，看三步依次发生。</p></div>
    </div>
    <p>
      点「开始制取」：先加热试管，高锰酸钾冒泡放出 O₂；气体沿导管进入倒扣的集气瓶，
      瓶内水位逐渐下降被排出；收集满后，带火星木条伸入瓶口并<b>复燃</b>发亮。把"加热→排水→复燃"三步与装置对应起来。
    </p>
  </section>

  <section class="section-pad" id="oxp-limits" aria-labelledby="oxp-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="oxp-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实操作的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>气密</span><h3>已默认</h3><p>真实操作须先检查装置气密性，本模型默认良好。</p></article>
      <article><span>速率</span><h3>理想匀速</h3><p>真实产气速率随温度波动，本模型取匀速示意。</p></article>
      <article><span>纯度</span><h3>未计杂质</h3><p>副产物 MnO₂ 等未单独绘制，仅示意主反应。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() { state = { phase: 0, p: 0, running: false }; }

function drawFlame(x, y, on) {
  if (!on) return;
  ctx.save(); ctx.globalAlpha = 0.9;
  const g = ctx.createLinearGradient(0, y, 0, y - 26);
  g.addColorStop(0, "#ffd24d"); g.addColorStop(1, "#e33a32");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.quadraticCurveTo(x + 9, y - 12, x, y);
  ctx.quadraticCurveTo(x - 9, y - 12, x, y - 30);
  ctx.fill(); ctx.restore();
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  const heating = state.phase >= 1;
  const collectFrac = state.phase === 2 ? state.p : (state.phase > 2 ? 1 : 0);
  const glowFrac = state.phase === 3 ? state.p : (state.phase > 3 ? 1 : 0);

  // 水槽
  ctx.fillStyle = "rgba(150,200,230,0.45)";
  ctx.fillRect(350, 270, 200, 90);
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2; ctx.strokeRect(350, 270, 200, 90);

  // 集气瓶（倒扣）
  const bx = 375, by = 160, bw = 90, bh = 150; // 瓶口在 by+bh=310
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 14) : ctx.rect(bx, by, bw, bh); ctx.stroke();
  // 瓶内：下部水、上部气
  const waterLine = (by + bh) - collectFrac * bh;
  if (collectFrac < 1) {
    ctx.fillStyle = "rgba(150,200,230,0.6)";
    ctx.fillRect(bx + 3, waterLine, bw - 6, (by + bh) - waterLine - 3);
  }
  if (collectFrac > 0.02) {
    ctx.fillStyle = "rgba(120,140,160,0.25)";
    ctx.fillRect(bx + 3, by + 3, bw - 6, waterLine - by - 3);
  }

  // 导管：试管口 → 上 → 右 → 下入瓶
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(140, 180); ctx.lineTo(140, 150); ctx.lineTo(420, 150); ctx.lineTo(420, 300);
  ctx.stroke();

  // 试管 + KMnO₄
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(122, 180, 36, 170, 10) : ctx.rect(122, 180, 36, 170); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(120,40,130,0.9)";
  ctx.fillRect(126, 308, 28, 38);
  if (heating) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let k = 0; k < 6; k++) {
      const by2 = 300 - ((state.p * 2.5 + k) % 1) * 110;
      ctx.beginPath(); ctx.arc(140 + ((k * 7) % 16) - 8, by2, 2.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  // 酒精灯
  ctx.fillStyle = "#e8d9a0"; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(120, 372, 40, 26, 6) : ctx.rect(120, 372, 40, 26); ctx.fill(); ctx.stroke();
  drawFlame(140, 372, heating);

  // 带火星木条（验满）
  if (state.phase >= 3) {
    ctx.strokeStyle = "#7a5a2a"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(470, 340); ctx.lineTo(420, 305); ctx.stroke();
    const glow = 0.3 + 0.7 * glowFrac;
    ctx.save(); ctx.globalAlpha = glow;
    ctx.fillStyle = "#ffd24d";
    ctx.beginPath(); ctx.arc(420, 305, 5 + 5 * glowFrac, 0, Math.PI * 2); ctx.fill();
    if (glowFrac > 0.4) {
      ctx.globalAlpha = 0.25 * glowFrac;
      ctx.beginPath(); ctx.arc(420, 305, 12 + 8 * glowFrac, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // 标注
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("试管(KMnO₄)", 140, 372);
  ctx.fillText("排水法收集", 420, 376);
  ctx.fillText("水槽", 450, 300);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("oxp-readout");
  if (!el) return;
  const steps = ["待制取", "加热制气", "排水收集", "验满·木条复燃"];
  const collectFrac = state.phase === 2 ? state.p : (state.phase > 2 ? 1 : 0);
  el.innerHTML =
    `<div class="ro-item"><span>当前步骤</span><span>${steps[state.phase]}</span></div>` +
    `<div class="ro-item verdict"><span>瓶内 O₂：${Math.round(collectFrac * 100)}%</span></div>`;
  const s = document.getElementById("oxp-status");
  if (s) s.textContent = state.running ? "实验中" : (state.phase >= 3 ? "完成·木条复燃" : "待制取");
}

export default {
  id: "oxygen-prep",
  name: "制取氧气",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#oxp-canvas");
    ctx = canvas.getContext("2d");
    setup();
    document.getElementById("oxp-run").addEventListener("click", () => {
      if (state.phase >= 3 && state.p >= 1) return;
      if (state.phase === 0) state.phase = 1;
      state.running = true;
    });
    document.getElementById("oxp-reset").addEventListener("click", () => { setup(); draw(); });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.running) return;
    state.p += 0.5 * delta;
    if (state.p >= 1) {
      state.p = 0; state.phase++;
      if (state.phase > 3) { state.phase = 3; state.running = false; }
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
