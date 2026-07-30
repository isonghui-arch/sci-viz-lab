// 金属活动性顺序场景：演示“排在前面的活泼金属能把排在后面的金属从其盐溶液中置换出来”；
//   若金属在氢前面，还能与酸反应放出氢气。通过选择金属片与盐（或酸）溶液观察是否反应。
import { shellHead } from "../scene-shell.js";

// 活动性由强到弱（教材常用顺序）
const SERIES = ["K", "Ca", "Na", "Mg", "Al", "Zn", "Fe", "Sn", "Pb", "(H)", "Cu", "Hg", "Ag", "Pt", "Au"];
// 可交互的金属片与溶液（带中文名与溶液颜色）
const METALS = {
  Mg: { cn: "镁", above: true },
  Zn: { cn: "锌", above: true },
  Fe: { cn: "铁", above: true },
  Cu: { cn: "铜", above: false },
  Ag: { cn: "银", above: false },
};
const SOLUTIONS = {
  "CuSO4": { cn: "硫酸铜", metal: "Cu", color: "#3a7bd5", deposit: "#c8742a" },
  "AgNO3": { cn: "硝酸银", metal: "Ag", color: "#9aa7b0", deposit: "#d8dde2" },
  "ZnSO4": { cn: "硫酸锌", metal: "Zn", color: "#cfe3ef", deposit: null },
  "HCl": { cn: "稀盐酸", metal: "H", color: "#dfeaf2", deposit: null, gas: true },
};
const CN = { K: "钾", Ca: "钙", Na: "钠", Mg: "镁", Al: "铝", Zn: "锌", Fe: "铁", Sn: "锡", Pb: "铅", "(H)": "氢", Cu: "铜", Hg: "汞", Ag: "银", Pt: "铂", Au: "金" };

function pos(el) { return SERIES.indexOf(el); }
function reacts(A, B) {
  // A 能否置换 B（B 可为 H）
  return pos(A) < pos(B);
}
function equation(A, solKey) {
  const s = SOLUTIONS[solKey];
  if (!reacts(A, s.metal)) return `${METALS[A].cn} + ${s.cn} → 不反应`;
  if (s.metal === "H") return `${METALS[A].cn} + 2HCl → ${A}Cl₂ + H₂↑`;
  const aSalt = `${A}SO4`;
  if (solKey === "AgNO3") return `${METALS[A].cn} + 2AgNO₃ → ${A}(NO₃)₂ + 2Ag↓`;
  return `${METALS[A].cn} + ${solKey} → ${aSalt} + ${s.metal}↓`;
}

const template = `
  <style>
    .ma-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .ma-section-nav a {
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
    .ma-section-nav a:hover,
    .ma-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ma-scene #ma-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .ma-controls-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0; }
    .ma-controls-row label { font-size: 12px; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px; }
    .ma-controls-row select {
      width: 100%; padding: 8px 10px; color: #fff; background: rgba(3,17,33,0.9);
      border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; font-size: 13px;
    }
    .ma-readout { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .ma-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .ma-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .ma-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .ma-readout .ro-item.eq { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); word-break: break-word; }
  </style>
  ${shellHead({
    ns: "ma",
    figureNo: "FIG. 20 / CHEMISTRY",
    titleHTML: "金属活动性顺序<br />谁更活泼谁置换",
    lead: "排在前面的金属更“急”着失去电子，能把后面的金属从它的盐溶液里顶替出来；排在氢前面的还能跟酸冒泡放氢气。",
    heroNote: "选金属片 + 溶液 · 看是否反应 · 自动写方程式",
    navLabel: "金属活动性章节导航",
    navItems: [
      { id: "ma-intuition", label: "直觉" },
      { id: "ma-define", label: "定义" },
      { id: "ma-lab", label: "互动实验" },
      { id: "ma-limits", label: "边界说明" },
    ],
    firstAnchor: "ma-intuition",
  })}
    <div class="lab-shell" aria-label="金属活动性顺序交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ma-canvas" width="640" height="430" aria-label="金属活动性顺序与置换反应示意图"></canvas>
        <div class="canvas-caption">
          <span>绿=所选金属片　蓝=溶液中金属离子　反应则后者被置换析出</span>
          <span id="ma-status">请选择</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="ma-controls-row">
          <div>
            <label for="ma-metal">金属片</label>
            <select id="ma-metal">
              <option value="Mg">镁 Mg</option>
              <option value="Zn" selected>锌 Zn</option>
              <option value="Fe">铁 Fe</option>
              <option value="Cu">铜 Cu</option>
              <option value="Ag">银 Ag</option>
            </select>
          </div>
          <div>
            <label for="ma-sol">溶液</label>
            <select id="ma-sol">
              <option value="CuSO4" selected>硫酸铜 CuSO₄</option>
              <option value="AgNO3">硝酸银 AgNO₃</option>
              <option value="ZnSO4">硫酸锌 ZnSO₄</option>
              <option value="HCl">稀盐酸 HCl</option>
            </select>
          </div>
        </div>
        <div class="ma-readout" id="ma-readout"></div>
        <div class="lab-actions">
          <button id="ma-run" class="accent-button" type="button">放入溶液</button>
          <button id="ma-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ma-intuition" aria-labelledby="ma-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ma-intuition-title">直觉：金属也有“排行榜”</h2>
      <p>有的金属性子急，有的沉稳，顺序早就排好了。</p></div>
    </div>
    <p>
      把常见金属按“失去电子的难易”排成一列，就是<b>金属活动性顺序</b>：钾钙钠镁铝锌铁锡铅（氢）铜汞银铂金。
      越靠前的越活泼。活泼金属遇到不活泼金属的盐溶液时，会“抢走”对方的位子——
      自己溶进去，把对方顶出来变成单质沉淀。排在氢前面的金属还能把酸里的氢顶出来，冒出氢气泡。
    </p>
  </section>

  <section class="section-pad" id="ma-define" aria-labelledby="ma-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ma-define-title">定义：置换反应与判断</h2>
      <p>前换后，氢前换氢。</p></div>
    </div>
    <p>
      若金属 A 在顺序中位于金属 B（或氢）的<b>前面</b>，则 A 能把 B 从其化合物中置换出来：
      A + B的盐 → A的盐 + B。这就是一类重要的<b>置换反应</b>。反之，后面的金属无法置换前面的，
      所以铜片放进硫酸锌里“啥也不发生”。该顺序也是判断金属与酸、与盐溶液能否反应的核心依据。
    </p>
  </section>

  <section class="section-pad" id="ma-lab" aria-labelledby="ma-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ma-lab-title">互动实验</h2>
      <p>挑一片金属、一种溶液，看反应发生没。</p></div>
    </div>
    <p>
      在右侧选“金属片”与“溶液”，点“放入溶液”。若金属排在溶液金属（或氢）前面，
      你会看到金属片逐渐溶解、溶液里的金属离子被置换成固体析出（颜色变化、底部出现沉淀），
      若是酸还会冒气泡；若排在后，则纹丝不动并提示“不反应”。左侧阶梯会高亮你选的两种金属。
    </p>
  </section>

  <section class="section-pad" id="ma-limits" aria-labelledby="ma-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ma-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实实验的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>速率</span><h3>未计快慢</h3><p>真实反应速率差异巨大（如钠遇水剧烈），本模型只判“能否反应”，不分快慢。</p></article>
      <article><span>钝化</span><h3>忽略特例</h3><p>铝、铁在浓硫酸/硝酸中钝化等例外未体现，仅按一般顺序判断。</p></article>
      <article><span>浓度</span><h3>理想溶液</h3><p>溶液浓度、温度对反应的影响未纳入，颜色为示意。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = {
    metal: "Zn",
    sol: "CuSO4",
    progress: 0,   // 反应进度 0..1
    running: false,
    result: null,  // true/false 是否已反应
  };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 左侧活动性阶梯
  const lx = 40, ly = 60, lh = 320, rowH = lh / SERIES.length;
  ctx.font = "12px var(--sans)"; ctx.textAlign = "left";
  SERIES.forEach((el, i) => {
    const y = ly + i * rowH;
    const isMetal = el === state.metal;
    const isSol = el === SOLUTIONS[state.sol].metal;
    ctx.fillStyle = isMetal ? "rgba(46,160,67,0.22)" : isSol ? "rgba(24,95,165,0.18)" : "transparent";
    if (isMetal || isSol) ctx.fillRect(lx - 6, y, 150, rowH);
    ctx.fillStyle = "#07182d";
    ctx.fillText(`${el}  ${CN[el] || el}`, lx, y + rowH / 2 + 4);
    if (isMetal) { ctx.fillStyle = "#2ea043"; ctx.fillText("◀ 金属片", lx + 110, y + rowH / 2 + 4); }
    if (isSol) { ctx.fillStyle = "#185FA5"; ctx.fillText("◀ 溶液金属", lx + 90, y + rowH / 2 + 4); }
  });
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("金属活动性顺序（强 → 弱）", lx + 70, ly - 14);

  // 右侧烧杯
  const bx = 300, by = 90, bw = 300, bh = 300;
  const s = SOLUTIONS[state.sol];
  const reactsNow = reacts(state.metal, s.metal);
  // 溶液颜色（反应则随进度变淡）
  const base = s.color;
  ctx.save();
  ctx.globalAlpha = 0.85 * (reactsNow ? (1 - 0.7 * state.progress) : 1);
  ctx.fillStyle = base;
  const fillTop = by + 40;
  ctx.fillRect(bx, fillTop, bw, by + bh - fillTop);
  ctx.restore();
  // 烧杯壁
  ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by);
  ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText(`${s.cn} 溶液`, bx + bw / 2, by - 8);

  // 金属片（反应则随进度变矮）
  const stripH = 150 * (reactsNow ? (1 - state.progress) : 1);
  const stripX = bx + bw / 2 - 14;
  ctx.fillStyle = "#6b6f76";
  if (stripH > 2) ctx.fillRect(stripX, by + bh - 20 - stripH, 28, stripH);
  ctx.fillStyle = "#07182d"; ctx.fillText(`${METALS[state.metal].cn}片`, bx + bw / 2, by + bh + 18);

  // 反应产物：底部析出金属 or 气泡
  if (reactsNow && state.progress > 0.05) {
    if (s.gas) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let k = 0; k < 10; k++) {
        const t = (state.progress * 6 + k) % 1;
        const r = 3 + (k % 3);
        ctx.beginPath(); ctx.arc(bx + 60 + (k * 24) % (bw - 120), by + bh - 20 - t * 120, r, 0, Math.PI * 2); ctx.fill();
      }
    } else if (s.deposit) {
      ctx.fillStyle = s.deposit; ctx.globalAlpha = 0.9;
      ctx.fillRect(bx + 10, by + bh - 20 - 14 * state.progress, bw - 20, 14 * state.progress);
      ctx.globalAlpha = 1;
    }
  }

  // 不反应标注
  if (state.running && !reactsNow) {
    ctx.fillStyle = "#b41f24"; ctx.font = "bold 16px var(--sans)"; ctx.textAlign = "center";
    ctx.fillText("✕ 不反应", bx + bw / 2, by + bh / 2);
  } else if (state.running && reactsNow) {
    ctx.fillStyle = "#2ea043"; ctx.font = "bold 15px var(--sans)"; ctx.textAlign = "center";
    ctx.fillText("✓ 发生置换", bx + bw / 2, by + bh / 2);
  }

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("ma-readout");
  if (!el) return;
  const s = SOLUTIONS[state.sol];
  const r = reacts(state.metal, s.metal);
  el.innerHTML =
    `<div class="ro-item"><span>金属片</span><span>${METALS[state.metal].cn}（${state.metal}）</span></div>` +
    `<div class="ro-item"><span>溶液金属</span><span>${s.metal === "H" ? "氢 H" : s.cn}</span></div>` +
    `<div class="ro-item eq"><span>方程式：${equation(state.metal, state.sol)}</span></div>`;
  const status = document.getElementById("ma-status");
  if (status) status.textContent = state.running ? (r ? "反应进行中" : "不反应") : "待放入";
}

export default {
  id: "metal-activity",
  name: "金属活动性顺序",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ma-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const metalSel = document.getElementById("ma-metal");
    const solSel = document.getElementById("ma-sol");
    metalSel.addEventListener("change", () => { state.metal = metalSel.value; state.running = false; state.progress = 0; draw(); });
    solSel.addEventListener("change", () => { state.sol = solSel.value; state.running = false; state.progress = 0; draw(); });

    document.getElementById("ma-run").addEventListener("click", () => {
      state.running = true; state.progress = 0;
    });
    document.getElementById("ma-reset").addEventListener("click", () => {
      state.running = false; state.progress = 0; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.running) return;
    if (reacts(state.metal, SOLUTIONS[state.sol].metal)) {
      state.progress = Math.min(1, state.progress + 0.4 * delta);
      if (state.progress >= 1) state.running = false;
    } else {
      state.progress = Math.min(1, state.progress + 1.5 * delta);
      if (state.progress >= 1) state.running = false;
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
