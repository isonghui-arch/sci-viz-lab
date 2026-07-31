// 质量守恒定律场景：化学反应前后总质量不变。密闭容器中反应，天平始终平衡；
//   若敞口且生成气体逸出，则"称得的"质量减小——以此说明必须在密闭体系中验证质量守恒。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .mcs-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .mcs-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .mcs-section-nav a:hover, .mcs-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .mcs-scene #mcs-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .mcs-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .mcs-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .mcs-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .mcs-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .mcs-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "mcs",
    figureNo: "FIG. 25 / CHEMISTRY",
    titleHTML: "质量守恒定律<br />反应前后一样重",
    lead: "密闭容器里发生反应，天平纹丝不动——总质量不变。若敞口让气体溜走，称出来就变轻了，但物质其实没少。",
    heroNote: "切密闭/敞口 · 点发生反应 · 看天平是否仍平衡",
    navLabel: "质量守恒定律章节导航",
    navItems: [
      { id: "mcs-intuition", label: "直觉" },
      { id: "mcs-define", label: "定义" },
      { id: "mcs-lab", label: "互动实验" },
      { id: "mcs-limits", label: "边界说明" },
    ],
    firstAnchor: "mcs-intuition",
  })}
    <div class="lab-shell" aria-label="质量守恒定律交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="mcs-canvas" width="640" height="430" aria-label="质量守恒天平示意图"></canvas>
        <div class="canvas-caption">
          <span>密闭：反应前后总质量相等　|　敞口：气体逸出→称得的减轻</span>
          <span id="mcs-status">待反应</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row"><span>容器</span>
          <button id="mcs-mode" class="accent-button" type="button" aria-pressed="true">密闭</button>
        </label>
        <div class="mcs-readout" id="mcs-readout"></div>
        <div class="lab-actions">
          <button id="mcs-run" class="accent-button" type="button">发生反应</button>
          <button id="mcs-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="mcs-intuition" aria-labelledby="mcs-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="mcs-intuition-title">直觉：物质没消失，只是换了模样</h2>
      <p>反应像把乐高拆了重拼，块数并没少。</p></div>
    </div>
    <p>
      化学反应只是把原子重新组合，<b>原子既不会凭空产生也不会消失</b>。所以无论怎么变，所有原子的总质量始终不变。
      把反应物和生成物全都关在一个密闭容器里一起称，天平永远平。可要是敞着口、生成的气体飘走了，
      你称到的就只是"留下来的那部分"——看起来轻了，其实跑掉的气体也是有质量的。
    </p>
  </section>

  <section class="section-pad" id="mcs-define" aria-labelledby="mcs-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="mcs-define-title">定义：参加反应的各物质质量总和相等</h2>
      <p>密闭体系下，反应前后总质量守恒。</p></div>
    </div>
    <p>
      <b>质量守恒定律</b>：参加化学反应的各物质的质量总和，等于反应后生成的各物质的质量总和。
      验证时必须把可能逸散的气体也计入——所以要在<b>密闭容器</b>中进行。敞口体系中若生成气体（如 CO₂、O₂）逸出，
      称得的剩余物质量会小于反应物质量，但这并不违背定律，只是没称到跑掉的那部分。
    </p>
  </section>

  <section class="section-pad" id="mcs-lab" aria-labelledby="mcs-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="mcs-lab-title">互动实验</h2>
      <p>密闭与敞口，结果大不同。</p></div>
    </div>
    <p>
      先点「容器」按钮在「密闭 / 敞口」间切换，再点「发生反应」：密闭时天平始终保持水平，反应前后都是 100.0 g；
      切到敞口再反应，生成物中的气体向上飘散，左侧托盘变轻，天平向右侧倾斜，称得质量降到约 96.0 g。
      对比两种情形，就懂了"为何质量守恒实验必须密闭"。
    </p>
  </section>

  <section class="section-pad" id="mcs-limits" aria-labelledby="mcs-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="mcs-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实称量的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>数值</span><h3>示意质量</h3><p>100.0 g 与 96.0 g 为示意值，非某特定反应真实数据。</p></article>
      <article><span>气体</span><h3>单一去向</h3><p>真实敞口还可能吸热/发光，本模型只演示气体逸出致质量减小。</p></article>
      <article><span>天平</span><h3>理想灵敏</h3><p>理想天平瞬时反映差值，未计读数与环境误差。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const MB = 100; // 反应前质量(g)

function setup() { state = { mode: "closed", reacting: false, p: 0, escaped: 0 }; }

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

function drawFlask(cx, topY) {
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 8, topY); ctx.lineTo(cx - 8, topY + 16); ctx.lineTo(cx + 8, topY + 16); ctx.lineTo(cx + 8, topY); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, topY + 38, 22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(150,60,160,0.85)";
  ctx.beginPath(); ctx.arc(cx, topY + 42, 15, 0, Math.PI * 2); ctx.fill();
  if (state.reacting && state.p < 1) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let k = 0; k < 5; k++) {
      const byy = topY + 48 - ((state.p * 3 + k) % 1) * 30;
      ctx.beginPath(); ctx.arc(cx - 8 + (k * 7) % 16, byy, 2.4, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (state.mode === "open" && state.reacting) {
    ctx.fillStyle = "rgba(120,140,160,0.55)";
    for (let k = 0; k < 4; k++) {
      const gy = topY - 8 - ((state.p * 2 + k) % 1) * 46;
      ctx.beginPath(); ctx.arc(cx - 10 + (k * 9) % 20, gy, 3, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function drawWeights(cx, topY) {
  ctx.fillStyle = "#7a7a7a"; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - 16, topY + i * 12, 32, 10, 3) : ctx.rect(cx - 16, topY + i * 12, 32, 10); ctx.fill(); ctx.stroke();
  }
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  const massAfter = MB - state.escaped;
  const angle = (MB - massAfter) * 0.05; // 左( flask )变轻→左端上翘→正角

  ctx.save();
  ctx.translate(320, 210);
  ctx.rotate(angle);
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(110, 0); ctx.stroke();
  // 左托盘（反应瓶）
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-110, 26); ctx.moveTo(-130, 26); ctx.lineTo(-90, 26); ctx.stroke();
  // 右托盘（砝码）
  ctx.beginPath(); ctx.moveTo(110, 0); ctx.lineTo(110, 26); ctx.moveTo(90, 26); ctx.lineTo(130, 26); ctx.stroke();
  ctx.restore();

  drawFlask(-110 + 320, 210 + 26 + 8); // 全局坐标 = pivot + local
  drawWeights(110 + 320, 210 + 26 + 6);

  // 支点
  ctx.fillStyle = "#3a3a3a";
  ctx.beginPath(); ctx.moveTo(320, 210); ctx.lineTo(308, 244); ctx.lineTo(332, 244); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#9a8f78"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(280, 244); ctx.lineTo(360, 244); ctx.stroke();

  // 酒精灯（仅示意反应放热）
  drawFlame(210, 250, state.reacting && state.p < 1);

  // 标注
  ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("反应容器", 210, 300);
  ctx.fillText("砝码", 430, 296);

  updateReadout(massAfter);
}

function updateReadout(massAfter) {
  const el = document.getElementById("mcs-readout");
  if (!el) return;
  const concl = state.mode === "closed"
    ? "质量守恒（密闭，气体计入）"
    : "表观减小：气体逸出未计入";
  el.innerHTML =
    `<div class="ro-item"><span>反应前</span><span>${MB.toFixed(1)} g</span></div>` +
    `<div class="ro-item"><span>反应后</span><span>${massAfter.toFixed(1)} g</span></div>` +
    `<div class="ro-item verdict"><span>${concl}</span></div>`;
  const s = document.getElementById("mcs-status");
  if (s) s.textContent = state.reacting ? "反应中…" : (state.p >= 1 ? "完成" : "待反应");
}

export default {
  id: "mass-conservation",
  name: "质量守恒定律",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#mcs-canvas");
    ctx = canvas.getContext("2d");
    setup();
    const modeBtn = document.getElementById("mcs-mode");
    modeBtn.addEventListener("click", () => {
      state.mode = state.mode === "closed" ? "open" : "closed";
      modeBtn.textContent = state.mode === "closed" ? "密闭" : "敞口";
      modeBtn.setAttribute("aria-pressed", String(state.mode === "closed"));
      draw();
    });
    document.getElementById("mcs-run").addEventListener("click", () => {
      if (state.p >= 1) return;
      state.reacting = true;
    });
    document.getElementById("mcs-reset").addEventListener("click", () => {
      setup(); modeBtn.textContent = "密闭"; modeBtn.setAttribute("aria-pressed", "true"); draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.reacting) return;
    state.p = Math.min(1, state.p + 0.4 * delta);
    if (state.mode === "open") state.escaped = 4 * state.p; // 最多逸出 4g
    if (state.p >= 1) state.reacting = false;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
