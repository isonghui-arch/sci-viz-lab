// 人体血液循环场景：演示肺循环与体循环两条路径，血液在肺部"充氧"由蓝变红、
//   在全身"放氧"由红变蓝，一进一出构成完整循环。粒子沿闭合路径流动表示血流方向。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .bl-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .bl-section-nav a {
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
    .bl-section-nav a:hover,
    .bl-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .bl-scene #bl-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .bl-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .bl-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .bl-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .bl-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .bl-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "bl",
    figureNo: "FIG. 15 / BLOOD",
    titleHTML: "人体血液循环<br />两条永不相交的环",
    lead: "血液走两条路：一条去肺里“充氧”（变红），一条去全身“放氧”（变蓝）。心脏是不知疲倦的双泵。",
    heroNote: "播放观察血流 · 蓝=缺氧血，红=含氧血 · 调节速度",
    navLabel: "血液循环章节导航",
    navItems: [
      { id: "bl-intuition", label: "直觉" },
      { id: "bl-define", label: "定义" },
      { id: "bl-lab", label: "互动实验" },
      { id: "bl-limits", label: "边界说明" },
    ],
    firstAnchor: "bl-intuition",
  })}
    <div class="lab-shell" aria-label="人体血液循环交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="bl-canvas" width="620" height="400" aria-label="人体血液循环示意图"></canvas>
        <div class="canvas-caption">
          <span>红=含氧血（动脉血）　蓝=缺氧血（静脉血）　心脏为双泵</span>
          <span id="bl-status">循环进行中</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="bl-speed"><span>血流速度</span><output id="bl-speed-output">1.0</output></label>
        <input id="bl-speed" type="range" min="0.2" max="2.5" step="0.1" value="1.0" />
        <div class="bl-readout" id="bl-readout"></div>
        <div class="lab-actions">
          <button id="bl-play" class="accent-button" type="button" aria-pressed="true">暂停</button>
          <button id="bl-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="bl-intuition" aria-labelledby="bl-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="bl-intuition-title">直觉：为什么血是"两色"的</h2>
      <p>同一管血，去肺的路上是蓝的，回来就红了。</p></div>
    </div>
    <p>
      血液的颜色取决于含不含氧。从心脏流往<b>肺部</b>的血已经把氧交给全身，是缺氧的（画成蓝）；
      在肺泡里重新"灌满"氧气后流回心脏，变成含氧血（画成红）。接着它从心脏泵向<b>全身</b>释放氧气，
      又变回蓝，回到心脏——如此往复。心脏像个双联水泵，同时推动这两条环，互不相混。
    </p>
  </section>

  <section class="section-pad" id="bl-define" aria-labelledby="bl-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="bl-define-title">定义：肺循环与体循环</h2>
      <p>两条环路，一个心脏。</p></div>
    </div>
    <p>
      <b>肺循环（小循环）</b>：右心室 → 肺动脉（缺氧，蓝）→ 肺部毛细血管（换气：CO₂ 出、O₂ 入）→ 肺静脉（含氧，红）→ 左心房。<br />
      <b>体循环（大循环）</b>：左心室 → 主动脉（含氧，红）→ 全身毛细血管（放氧、收 CO₂）→ 上、下腔静脉（缺氧，蓝）→ 右心房。
    </p>
    <p style="margin-top:12px">注：动脉血≠一定在动脉里——肺动脉流的是缺氧血，肺静脉流的是含氧血，"动脉/静脉"指流向而非含氧量。</p>
  </section>

  <section class="section-pad" id="bl-lab" aria-labelledby="bl-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="bl-lab-title">互动实验</h2>
      <p>看粒子在两条环上如何变色。</p></div>
    </div>
    <p>
      上方环是肺循环：粒子从右心出发是蓝的，经过肺部（顶部）变成红的回到左心。
      下方环是体循环：从左心出发是红的，经过全身（底部）变成蓝的回到右心。
      调节速度滑块，看清"充氧—放氧"在肺部与全身两端发生，而心脏两端颜色始终不同。
    </p>
  </section>

  <section class="section-pad" id="bl-limits" aria-labelledby="bl-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="bl-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实循环的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>解剖</span><h3>高度示意</h3><p>真实心脏四腔、血管分支极复杂，这里用双环示意两条路径。</p></article>
      <article><span>冠脉</span><h3>未画出</h3><p>心脏自身的冠状动脉供血未表示，本图聚焦肺/体两大循环。</p></article>
      <article><span>速率</span><h3>匀速近似</h3><p>真实血流在心缩/心舒期有搏动变化，这里用匀速粒子示意方向。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

// 闭合路径（waypoint 列表），用于肺循环与体循环
const PULM = [
  [300, 185], [250, 120], [310, 60], [375, 120], [322, 185],
];
const SYS = [
  [318, 220], [320, 300], [385, 350], [235, 350], [320, 300], [302, 220],
];

function polyLength(pts) {
  let L = 0; const seg = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push(d); L += d;
  }
  return { L, seg };
}
function pointAt(pts, seg, frac) {
  const total = seg.reduce((s, x) => s + x, 0);
  let target = (frac % 1 + 1) % 1 * total;
  for (let i = 0; i < pts.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      const a = pts[i], b = pts[(i + 1) % pts.length];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    target -= seg[i];
  }
  return pts[0];
}

function setup() {
  state = {
    playing: true,
    speed: 1.0,
    pulm: polyLength(PULM),
    sys: polyLength(SYS),
    particles: [],
  };
  for (let k = 0; k < 10; k++) state.particles.push({ loop: "pulm", f: k / 10 });
  for (let k = 0; k < 10; k++) state.particles.push({ loop: "sys", f: k / 10 });
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 肺（顶部）
  ctx.fillStyle = "rgba(192,57,43,0.18)";
  ctx.beginPath(); ctx.ellipse(310, 65, 70, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(310, 65, 70, 40, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("肺（气体交换：充氧）", 310, 70);

  // 全身（底部）
  ctx.fillStyle = "rgba(24,95,165,0.12)";
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(230, 320, 160, 60, 12) : ctx.rect(230, 320, 160, 60);
  ctx.fill();
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(230, 320, 160, 60, 12) : ctx.rect(230, 320, 160, 60); ctx.stroke();
  ctx.fillStyle = "#07182d";
  ctx.fillText("全身（释放氧气）", 310, 355);

  // 心脏（中心）
  ctx.fillStyle = "rgba(180,31,36,0.16)";
  ctx.beginPath(); ctx.ellipse(310, 200, 55, 50, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#b41f24"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(310, 200, 55, 50, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#07182d";
  ctx.fillText("心脏", 310, 196);
  ctx.font = "11px var(--mono, monospace)";
  ctx.fillStyle = "#185FA5"; ctx.fillText("右心(蓝)", 285, 215);
  ctx.fillStyle = "#c0392b"; ctx.fillText("左心(红)", 328, 215);

  // 路径（淡）
  function drawPath(pts, color) {
    ctx.strokeStyle = color; ctx.globalAlpha = 0.25; ctx.lineWidth = 6;
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
    ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 1;
  }
  drawPath(PULM, "#888");
  drawPath(SYS, "#888");

  // 粒子
  for (const pt of state.particles) {
    const isPulm = pt.loop === "pulm";
    const pts = isPulm ? PULM : SYS;
    const seg = isPulm ? state.pulm.seg : state.sys.seg;
    const [x, y] = pointAt(pts, seg, pt.f);
    // 颜色：肺循环 前半蓝(去肺) 后半红(回心)；体循环 前半红(去全身) 后半蓝(回心)
    let color;
    if (isPulm) color = pt.f < 0.5 ? "#185FA5" : "#c0392b";
    else color = pt.f < 0.5 ? "#c0392b" : "#185FA5";
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  }

  // 环标注
  ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillStyle = "#c0392b"; ctx.fillText("肺循环", 150, 120);
  ctx.fillStyle = "#185FA5"; ctx.fillText("体循环", 150, 320);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("bl-readout");
  if (!el) return;
  const rate = state.playing ? "流转中" : "已暂停";
  el.innerHTML =
    `<div class="ro-item"><span>肺循环</span><span>右心→肺→左心</span></div>` +
    `<div class="ro-item"><span>体循环</span><span>左心→全身→右心</span></div>` +
    `<div class="ro-item verdict"><span>状态：${rate}（速度 ${state.speed.toFixed(1)}×）</span></div>`;
  const status = document.getElementById("bl-status");
  if (status) status.textContent = state.playing ? "循环进行中" : "已暂停";
}

export default {
  id: "blood-circulation",
  name: "人体血液循环",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#bl-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const speed = document.getElementById("bl-speed");
    const speedOut = document.getElementById("bl-speed-output");
    speed.addEventListener("input", () => {
      state.speed = Number(speed.value);
      speedOut.textContent = state.speed.toFixed(1);
    });

    const playBtn = document.getElementById("bl-play");
    playBtn.addEventListener("click", () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? "暂停" : "播放";
      playBtn.setAttribute("aria-pressed", String(state.playing));
    });
    document.getElementById("bl-reset").addEventListener("click", () => {
      state.particles.forEach((p) => (p.f = 0));
      draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.playing) return;
    for (const pt of state.particles) pt.f = (pt.f + 0.04 * state.speed * delta * 8) % 1;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
