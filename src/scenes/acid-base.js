// 酸碱中和与 pH 场景：向水中滴加盐酸(HCl)与氢氧化钠(NaOH)，
//   实时计算 pH、指示剂颜色，演示酸碱中和（H⁺ + OH⁻ → H₂O）。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ab-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .ab-section-nav a {
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
    .ab-section-nav a:hover,
    .ab-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ab-scene #ab-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .ab-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .ab-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .ab-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .ab-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .ab-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(14,116,144,0.22); border-color: rgba(14,116,144,0.55); }
    .ab-readout .ro-item.ph { grid-column: 1 / -1; }
  </style>
  ${shellHead({
    ns: "ab",
    figureNo: "FIG. 13 / ACID-BASE",
    titleHTML: "酸碱中和与 pH<br />一滴一滴调到 7",
    lead: "往水里加酸或加碱，溶液从红变紫再变蓝。当酸与碱的“量”刚好抵消，pH 回到 7——这就是中和。",
    heroNote: "加酸 / 加碱 改变滴数 · 看 pH 与指示剂颜色变化",
    navLabel: "酸碱章节导航",
    navItems: [
      { id: "ab-intuition", label: "直觉" },
      { id: "ab-define", label: "定义" },
      { id: "ab-lab", label: "互动实验" },
      { id: "ab-limits", label: "边界说明" },
    ],
    firstAnchor: "ab-intuition",
  })}
    <div class="lab-shell" aria-label="酸碱中和交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ab-canvas" width="620" height="380" aria-label="酸碱中和与 pH 演示"></canvas>
        <div class="canvas-caption">
          <span>石蕊指示剂：红=酸 · 紫=中性 · 蓝=碱</span>
          <span id="ab-status">中性 pH=7.0</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="ab-acid"><span>盐酸滴数</span><output id="ab-acid-output">0</output></label>
        <input id="ab-acid" type="range" min="0" max="20" step="1" value="0" />
        <label class="control-row" for="ab-base"><span>氢氧化钠滴数</span><output id="ab-base-output">0</output></label>
        <input id="ab-base" type="range" min="0" max="20" step="1" value="0" />
        <div class="ab-readout" id="ab-readout"></div>
        <div class="lab-actions">
          <button id="ab-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ab-intuition" aria-labelledby="ab-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ab-intuition-title">直觉：酸和碱怎么"抵消"</h2>
      <p>酸的"刺"来自 H⁺，碱的"滑"来自 OH⁻。</p></div>
    </div>
    <p>
      酸溶于水放出氢离子 H⁺，碱放出氢氧根 OH⁻。把酸和碱混在一起，H⁺ 与 OH⁻ 会结合成水：
      <code>H⁺ + OH⁻ → H₂O</code>。当两边的数量刚好相等，溶液既不显酸也不显碱——<b>中和</b>了。
      用石蕊等指示剂，颜色会从酸的红、经中性的紫、到碱的蓝连续变化，pH 从小于 7 经 7 到大于 7。
    </p>
  </section>

  <section class="section-pad" id="ab-define" aria-labelledby="ab-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ab-define-title">定义：pH 与中和</h2>
      <p>一个数字衡量酸碱强弱。</p></div>
    </div>
    <p>
      <code>pH = −log₁₀[H⁺]</code>。pH &lt; 7 为酸性、= 7 为中性、&gt; 7 为碱性；每差 1 单位，[H⁺] 差 10 倍。
      中和反应：<code>HCl + NaOH → NaCl + H₂O</code>，恰好完全反应时生成盐与水，pH = 7。
    </p>
    <p style="margin-top:12px">本演示用等浓度酸、碱（每滴 0.0005 mol，溶液体积 0.05 L），滴定到滴数相等即达中性点。</p>
  </section>

  <section class="section-pad" id="ab-lab" aria-labelledby="ab-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ab-lab-title">互动实验</h2>
      <p>先加酸看变红，再加碱找回紫色。</p></div>
    </div>
    <p>
      拉「盐酸滴数」到 10：溶液变红，pH 降到约 1。再慢慢加「氢氧化钠滴数」——红色逐渐转紫、再转蓝；
      当两滑块都到 10，酸与碱恰好抵消，pH 回到 7，溶液呈中性紫。若碱加过头，则偏蓝（碱性）。
      读数面板给出 pH 与 [H⁺]/[OH⁻] 的相对大小。
    </p>
  </section>

  <section class="section-pad" id="ab-limits" aria-labelledby="ab-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ab-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>强酸强碱</span><h3>完全电离</h3><p>本模型假设 HCl、NaOH 完全电离；弱酸弱碱（如醋酸）电离不完全，曲线更缓。</p></article>
      <article><span>指示剂</span><h3>近似变色</h3><p>石蕊变色范围是区间而非一点，本演示用平滑过渡近似。</p></article>
      <article><span>体积</span><h3>忽略增量</h3><p>模型假设每滴体积相对总体积可忽略，实际滴定需考虑体积变化。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const DROP_MOL = 0.0005;
const VOL = 0.05;

function setup() {
  state = { acidDrops: 0, baseDrops: 0, bubbles: [], t: 0 };
}

function phValue() {
  const nA = state.acidDrops * DROP_MOL;
  const nB = state.baseDrops * DROP_MOL;
  if (nA > nB) {
    const h = (nA - nB) / VOL;
    return Math.max(0, -Math.log10(h));
  } else if (nB > nA) {
    const oh = (nB - nA) / VOL;
    const poh = -Math.log10(oh);
    return Math.min(14, 14 - poh);
  }
  return 7;
}

function indicatorColor(pH) {
  // 红(0) -> 紫(7) -> 蓝(14)
  const stops = [
    [0, [211, 47, 47]],
    [4, [230, 120, 60]],
    [7, [124, 92, 196]],
    [10, [40, 110, 200]],
    [14, [20, 60, 160]],
  ];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (pH >= stops[i][0] && pH <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const t = (pH - a[0]) / (b[0] - a[0] || 1);
  const r = Math.round(a[1][0] + (b[1][0] - a[1][0]) * t);
  const g = Math.round(a[1][1] + (b[1][1] - a[1][1]) * t);
  const bl = Math.round(a[1][2] + (b[1][2] - a[1][2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  const bx = 210, bw = 200, byTop = 80, byBot = 320;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 烧杯
  ctx.strokeStyle = "#07182d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx, byTop); ctx.lineTo(bx, byBot);
  ctx.lineTo(bx + bw, byBot); ctx.lineTo(bx + bw, byTop);
  ctx.stroke();

  // 液体
  const pH = phValue();
  const liqTop = byTop + 30;
  ctx.fillStyle = indicatorColor(pH);
  ctx.fillRect(bx + 3, liqTop, bw - 6, byBot - liqTop - 3);

  // 气泡
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (const b of state.bubbles) {
    ctx.beginPath(); ctx.arc(bx + 3 + b.x * (bw - 6), b.y, b.r, 0, Math.PI * 2); ctx.fill();
  }

  // pH 标尺
  const sx = bx + bw + 40;
  ctx.strokeStyle = "#8a8475"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(sx, byTop); ctx.lineTo(sx, byBot); ctx.stroke();
  for (let p = 0; p <= 14; p++) {
    const yy = byBot - (p / 14) * (byBot - byTop);
    ctx.strokeStyle = "#c9c2b2";
    ctx.beginPath(); ctx.moveTo(sx - 4, yy); ctx.lineTo(sx + 4, yy); ctx.stroke();
    ctx.fillStyle = "#8a8475"; ctx.font = "10px var(--mono, monospace)"; ctx.textAlign = "left";
    ctx.fillText(String(p), sx + 8, yy + 3);
  }
  // 当前 pH 指针
  const py = byBot - (pH / 14) * (byBot - byTop);
  ctx.fillStyle = "#b41f24";
  ctx.beginPath(); ctx.moveTo(sx - 10, py); ctx.lineTo(sx - 2, py - 5); ctx.lineTo(sx - 2, py + 5); ctx.closePath(); ctx.fill();

  updateReadout(pH);
}

function updateReadout(pH) {
  const el = document.getElementById("ab-readout");
  if (!el) return;
  const nA = state.acidDrops, nB = state.baseDrops;
  let verdict;
  if (Math.abs(nA - nB) < 0.5 && nA > 0) verdict = "恰好中和（pH = 7）";
  else if (nA > nB) verdict = "酸性（酸过量）";
  else if (nB > nA) verdict = "碱性（碱过量）";
  else verdict = "中性（纯水）";
  el.innerHTML =
    `<div class="ro-item"><span>盐酸滴数</span><span>${nA}</span></div>` +
    `<div class="ro-item"><span>NaOH 滴数</span><span>${nB}</span></div>` +
    `<div class="ro-item ph"><span>pH</span><span>${pH.toFixed(2)}</span></div>` +
    `<div class="ro-item verdict"><span>${verdict}</span></div>`;
  const status = document.getElementById("ab-status");
  if (status) status.textContent = `${verdict} pH=${pH.toFixed(1)}`;
}

export default {
  id: "acid-base",
  name: "酸碱中和与 pH",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ab-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const bind = (id, key, outId) => {
      const s = document.getElementById(id);
      const o = document.getElementById(outId);
      s.addEventListener("input", () => {
        state[key] = Number(s.value);
        o.textContent = s.value;
        // 加滴时冒泡
        for (let k = 0; k < 6; k++) state.bubbles.push({ x: Math.random(), y: 300, r: 1 + Math.random() * 2 });
        if (state.bubbles.length > 80) state.bubbles.splice(0, 20);
        draw();
      });
    };
    bind("ab-acid", "acidDrops", "ab-acid-output");
    bind("ab-base", "baseDrops", "ab-base-output");

    document.getElementById("ab-reset").addEventListener("click", () => {
      state.acidDrops = 0; state.baseDrops = 0;
      document.getElementById("ab-acid").value = "0"; document.getElementById("ab-acid-output").textContent = "0";
      document.getElementById("ab-base").value = "0"; document.getElementById("ab-base-output").textContent = "0";
      draw();
    });
    draw();
  },
  update() {
    if (!state) return;
    // 气泡上升动画
    for (const b of state.bubbles) { b.y -= 1.2; b.x += (Math.random() - 0.5) * 0.01; }
    state.bubbles = state.bubbles.filter((b) => b.y > 100);
    if (state.bubbles.length) draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
