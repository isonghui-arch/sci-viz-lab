// 植物细胞吸失水场景：细胞处在外界溶液中，水分通过渗透进出。低渗(清水)吸水膨胀变坚挺(质壁分离复原/紧张)；
//   等渗正常；高渗(浓盐水)失水，原生质层收缩脱离细胞壁，即质壁分离。用浓度滑块演示三种状态。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .osm-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .osm-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .osm-section-nav a:hover, .osm-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .osm-scene #osm-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .osm-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .osm-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .osm-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .osm-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .osm-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
    .control-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 10px 0 4px; }
    .control-row span { font-family: var(--sans); font-size: 13px; color: var(--muted); }
    .control-row output { font-family: var(--mono, monospace); font-size: 13px; color: var(--ink); }
  </style>
  ${shellHead({
    ns: "osm",
    figureNo: "FIG. 27 / BIOLOGY",
    titleHTML: "植物细胞吸失水<br />胀与缩之间",
    lead: "泡在清水里细胞喝得滚圆坚挺；丢进浓盐水就皱缩、和细胞壁分了家——这层分离，正是渗透在作怪。",
    heroNote: "拖动外界溶液浓度 · 看细胞吸水膨胀 / 失水质壁分离",
    navLabel: "植物细胞吸失水章节导航",
    navItems: [
      { id: "osm-intuition", label: "直觉" },
      { id: "osm-define", label: "定义" },
      { id: "osm-lab", label: "互动实验" },
      { id: "osm-limits", label: "边界说明" },
    ],
    firstAnchor: "osm-intuition",
  })}
    <div class="lab-shell" aria-label="植物细胞吸失水交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="osm-canvas" width="640" height="430" aria-label="植物细胞吸失水示意图"></canvas>
        <div class="canvas-caption">
          <span>低渗→吸水膨胀　等渗→正常　高渗→失水质壁分离</span>
          <span id="osm-status">正常</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="osm-conc"><span>外界溶液浓度</span><output id="osm-conc-output">0.0 %</output></label>
        <input id="osm-conc" type="range" min="0" max="10" step="0.1" value="0" />
        <div class="osm-readout" id="osm-readout"></div>
        <div class="lab-actions">
          <button id="osm-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="osm-intuition" aria-labelledby="osm-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="osm-intuition-title">直觉：细胞壁是骨架，里面会喝水</h2>
      <p>水总是从稀的一边往浓的一边钻。</p></div>
    </div>
    <p>
      植物细胞外面有一层硬邦邦的<b>细胞壁</b>，里面包着会吸水的<b>原生质层</b>（细胞膜+细胞质）和<b>液泡</b>。
      水会顺着浓度差"钻"：外界比里面稀（<b>低渗</b>，比如清水），水往里灌，细胞鼓得紧紧贴着壁，青菜因此挺括；
      外界比里面浓（<b>高渗</b>，比如浓盐水），水往外跑，里面的原生质皱缩、离开细胞壁，出现<b>质壁分离</b>——
      腌菜出水、萝卜变软就是这个道理。
    </p>
  </section>

  <section class="section-pad" id="osm-define" aria-labelledby="osm-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="osm-define-title">定义：渗透与质壁分离</h2>
      <p>水往"浓"处走，壁却不会缩。</p></div>
    </div>
    <p>
      <b>渗透</b>：水分子经半透膜从低浓度溶液向高浓度溶液扩散。<br />
      <b>低渗</b>：外界浓度 &lt; 细胞液浓度 → 细胞吸水，原生质紧贴细胞壁（<b>质壁分离复原/紧张状态</b>）。<br />
      <b>等渗</b>：浓度相当 → 水分进出平衡，形态正常。<br />
      <b>高渗</b>：外界浓度 &gt; 细胞液浓度 → 细胞失水，原生质层收缩脱离细胞壁，即<b>质壁分离</b>。
      细胞壁本身几乎不收缩，所以分离的是里面的原生质。
    </p>
  </section>

  <section class="section-pad" id="osm-lab" aria-labelledby="osm-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="osm-lab-title">互动实验</h2>
      <p>拉动浓度滑块，看细胞胀缩。</p></div>
    </div>
    <p>
      拖动「外界溶液浓度」从 0（清水）往上：低浓度时原生质饱满、紧贴细胞壁、细胞坚挺；
      升到约 0.3% 附近为等渗、形态正常；继续升高到约 0.6% 以上，原生质明显缩小、与细胞壁之间露出空隙——
      这就是<b>质壁分离</b>。把"浓度高低"和"吸水/失水"对应起来，就抓住了渗透的核心。
    </p>
  </section>

  <section class="section-pad" id="osm-limits" aria-labelledby="osm-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="osm-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实细胞的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>阈值</span><h3>示意浓度</h3><p>0.3%/0.6% 为示意分界，真实因植物与细胞液而异。</p></article>
      <article><span>结构</span><h3>高度简化</h3><p>真实有细胞器、胞间连丝等，本模型只画壁、质、液泡。</p></article>
      <article><span>速率</span><h3>瞬时稳态</h3><p>模型直接给平衡形态，未演示渗透达到平衡的动态过程时长。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const ISO = 0.3, SEP = 0.6; // 阈值(%)

function setup() { state = { conc: 0, gap: 0 }; }

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 外界溶液
  ctx.fillStyle = "rgba(180,210,230,0.35)";
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(160, 40, 320, 350, 18) : ctx.rect(160, 40, 320, 350); ctx.fill();
  ctx.fillStyle = "#185FA5"; ctx.font = "13px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText("外界溶液　" + state.conc.toFixed(1) + " %", 175, 62);

  // 细胞壁（固定）
  const wx = 220, wy = 80, ww = 200, wh = 270;
  ctx.strokeStyle = "#3f7d3f"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(wx, wy, ww, wh, 24) : ctx.rect(wx, wy, ww, wh); ctx.stroke();

  // 原生质层（随 gap 收缩）
  const g = state.gap;
  const px = wx + g, py = wy + g, pw = ww - 2 * g, ph = wh - 2 * g;
  const fill = state.conc > SEP ? "rgba(150,110,180,0.85)" : "rgba(140,90,170,0.8)";
  ctx.fillStyle = fill;
  const r = 10 + g * 0.6; // 收缩时圆角更大，呈皱缩
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, pw, ph, r) : ctx.rect(px, py, pw, ph); ctx.fill();
  ctx.strokeStyle = "rgba(90,50,120,0.9)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, pw, ph, r) : ctx.rect(px, py, pw, ph); ctx.stroke();
  // 液泡
  ctx.fillStyle = "rgba(110,70,150,0.55)";
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px + 18, py + 18, pw - 36, ph - 36, 10) : ctx.rect(px + 18, py + 18, pw - 36, ph - 36); ctx.fill();
  // 细胞核
  ctx.fillStyle = "rgba(70,40,100,0.9)";
  ctx.beginPath(); ctx.arc(px + pw * 0.7, py + ph * 0.32, 12, 0, Math.PI * 2); ctx.fill();

  // 水分方向箭头（膜上）
  if (state.conc < ISO) {
    // 吸水：外→内（上箭头）
    drawWater(180, 1);
  } else if (state.conc > SEP) {
    // 失水：内→外（下箭头）
    drawWater(180, -1);
  }

  updateReadout();
}

function drawWater(x, dir) {
  ctx.strokeStyle = "#185FA5"; ctx.fillStyle = "#185FA5"; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const y = 250 + i * 0;
    const yy = 230 - i * 30;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy - 22 * dir); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, yy - 22 * dir);
    ctx.lineTo(x - 4, yy - 14 * dir);
    ctx.lineTo(x + 4, yy - 14 * dir);
    ctx.closePath(); ctx.fill();
  }
}

function updateReadout() {
  const el = document.getElementById("osm-readout");
  if (!el) return;
  let status, vol;
  if (state.conc < ISO) { status = "吸水膨胀·坚挺（低渗）"; vol = 100; }
  else if (state.conc <= SEP) { status = "正常（等渗）"; vol = 100; }
  else { status = "失水·质壁分离（高渗）"; vol = Math.max(40, Math.round((1 - state.gap / 40) * 100)); }
  el.innerHTML =
    `<div class="ro-item"><span>外界浓度</span><span>${state.conc.toFixed(1)} %</span></div>` +
    `<div class="ro-item"><span>液泡体积</span><span>约 ${vol}%</span></div>` +
    `<div class="ro-item verdict"><span>${status}</span></div>`;
  const s = document.getElementById("osm-status");
  if (s) s.textContent = status.split("（")[0];
}

export default {
  id: "cell-osmosis",
  name: "植物细胞吸失水",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#osm-canvas");
    ctx = canvas.getContext("2d");
    setup();
    const conc = document.getElementById("osm-conc"), co = document.getElementById("osm-conc-output");
    conc.addEventListener("input", () => {
      state.conc = Number(conc.value);
      co.textContent = Number(conc.value).toFixed(1) + " %";
      const target = state.conc > SEP ? Math.min(38, (state.conc - SEP) * 8) : 0;
      state.gap += (target - state.gap) * 0.5; // 即时近似，update 会平滑
      draw();
    });
    document.getElementById("osm-reset").addEventListener("click", () => {
      setup(); conc.value = 0; co.textContent = "0.0 %"; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state) return;
    const target = state.conc > SEP ? Math.min(38, (state.conc - SEP) * 8) : 0;
    state.gap += (target - state.gap) * Math.min(1, 4 * delta);
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
