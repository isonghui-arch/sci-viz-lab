// 呼吸运动场景：吸气时膈肌收缩下降、胸廓上下径增大、肺扩张，肺内压低于大气压，气体入肺；
//   呼气相反。用膈肌位置(或自动呼吸)演示胸廓容积、肺容积与气流方向的关系。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .brh-section-nav {
      max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .brh-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-family: var(--sans);
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      color: var(--muted); border-bottom: 2px solid transparent; }
    .brh-section-nav a:hover, .brh-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .brh-scene #brh-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .brh-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .brh-readout .ro-item { display: flex; justify-content: space-between; padding: 8px 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px; }
    .brh-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .brh-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .brh-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
    .control-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 10px 0 4px; }
    .control-row span { font-family: var(--sans); font-size: 13px; color: var(--muted); }
    .control-row output { font-family: var(--mono, monospace); font-size: 13px; color: var(--ink); }
  </style>
  ${shellHead({
    ns: "brh",
    figureNo: "FIG. 28 / BIOLOGY",
    titleHTML: "呼吸运动<br />一缩一舒的肺",
    lead: "膈肌往下塌、胸腔被撑大，肺跟着鼓起来把空气吸进去；膈肌一松、胸腔回缩，气又被挤出来——这就是呼吸。",
    heroNote: "自动呼吸或拖膈肌 · 看胸廓/肺容积与气流方向",
    navLabel: "呼吸运动章节导航",
    navItems: [
      { id: "brh-intuition", label: "直觉" },
      { id: "brh-define", label: "定义" },
      { id: "brh-lab", label: "互动实验" },
      { id: "brh-limits", label: "边界说明" },
    ],
    firstAnchor: "brh-intuition",
  })}
    <div class="lab-shell" aria-label="呼吸运动交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="brh-canvas" width="640" height="430" aria-label="呼吸运动示意图"></canvas>
        <div class="canvas-caption">
          <span>膈肌收缩下降→胸廓扩大→肺扩张→吸气　|　反之呼气</span>
          <span id="brh-status">静止</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="brh-pos"><span>膈肌位置</span><output id="brh-pos-output">舒张</output></label>
        <input id="brh-pos" type="range" min="0" max="1" step="0.01" value="0" />
        <div class="brh-readout" id="brh-readout"></div>
        <div class="lab-actions">
          <button id="brh-auto" class="accent-button" type="button" aria-pressed="true">自动呼吸</button>
          <button id="brh-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="brh-intuition" aria-labelledby="brh-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="brh-intuition-title">直觉：膈肌是块会升降的地板</h2>
      <p>地板往下压，房间变高，空气被"吸"进来。</p></div>
    </div>
    <p>
      把胸廓想成一间上小下大的屋子，<b>膈肌</b>就是它的地板。吸气时膈肌<b>收缩、向下塌</b>，屋子被拉高、容积变大，
      里面的肺跟着扩张，肺里气压变低，外面的空气就顺着气管<b>钻进来</b>；呼气时膈肌<b>放松、向上拱</b>，
      屋子变矮、肺被压瘪，气又被挤出去。所以呼吸不是鼻子"吸"，而是胸廓容积变化造成的压力差在"搬运"气体。
    </p>
  </section>

  <section class="section-pad" id="brh-define" aria-labelledby="brh-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="brh-define-title">定义：吸气与呼气</h2>
      <p>容积变→压强变→气体进或出。</p></div>
    </div>
    <p>
      <b>吸气</b>：膈肌<b>收缩下降</b>（肋间肌也收缩使肋骨上提），胸廓上下径、前后径增大，肺容积增大，
      肺内压 &lt; 大气压 → 气体入肺。<br />
      <b>呼气</b>：膈肌<b>舒张回升</b>、肋骨下降，胸廓缩小，肺容积减小，肺内压 &gt; 大气压 → 气体出肺。<br />
      平静呼吸时吸气是主动的（肌肉收缩），呼气多是被动的（肌肉放松回位）。
    </p>
  </section>

  <section class="section-pad" id="brh-lab" aria-labelledby="brh-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="brh-lab-title">互动实验</h2>
      <p>看膈肌怎么带着肺一鼓一瘪。</p></div>
    </div>
    <p>
      点「自动呼吸」让膈肌自己上下起伏；或拖动「膈肌位置」滑块手动控制。向下（收缩）时，
      观察胸廓被撑大、双肺鼓起、气管口出现向<b>下</b>的吸气箭头；向上（舒张）时胸廓回缩、肺瘪下、出现向<b>上</b>的呼气箭头。
      把"膈肌位置—胸廓容积—肺容积—气流方向"四者串成一条因果链。
    </p>
  </section>

  <section class="section-pad" id="brh-limits" aria-labelledby="brh-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="brh-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实呼吸的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>肋骨</span><h3>仅示膈肌</h3><p>真实还有肋间肌参与，本模型主要演示膈肌升降。</p></article>
      <article><span>气压</span><h3>定性箭头</h3><p>气流方向为定性示意，未给出真实压强数值。</p></article>
      <article><span>频率</span><h3>匀速示意</h3><p>自动呼吸取固定频率，未含深呼吸/运动等变化。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() { state = { pos: 0, auto: true, t: 0, prev: 0, flow: 0 }; }

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  const pos = state.pos; // 0 舒张(上拱) .. 1 收缩(下降)
  const chestH = 120 + pos * 40;
  const cx = 320;
  const topY = 120, botY = topY + chestH;

  // 胸廓（外轮廓）
  ctx.strokeStyle = "#b06a3a"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 95, topY);
  ctx.quadraticCurveTo(cx - 120, (topY + botY) / 2, cx - 80, botY);
  ctx.lineTo(cx + 80, botY);
  ctx.quadraticCurveTo(cx + 120, (topY + botY) / 2, cx + 95, topY);
  ctx.stroke();

  // 脊柱
  ctx.strokeStyle = "#7a7a7a"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - 92, topY - 6); ctx.lineTo(cx - 92, botY + 4); ctx.stroke();

  // 膈肌（穹顶）
  const domeY = botY + 6;
  const ctrlY = domeY - 46 + pos * 34; // pos大→更平(下降)
  ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(cx - 80, domeY); ctx.quadraticCurveTo(cx, ctrlY, cx + 80, domeY); ctx.stroke();

  // 肺（随 pos 胀缩）
  const lungR = 0.45 + pos * 0.55;
  ctx.fillStyle = "rgba(230,140,150,0.85)"; ctx.strokeStyle = "rgba(180,90,100,0.9)"; ctx.lineWidth = 2;
  // 左肺
  ctx.beginPath(); ctx.ellipse(cx - 34, topY + 55 * lungR + 10, 30 * lungR, 55 * lungR, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // 右肺
  ctx.beginPath(); ctx.ellipse(cx + 34, topY + 55 * lungR + 10, 30 * lungR, 55 * lungR, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // 气管 + 支气管
  ctx.strokeStyle = "#7a7a7a"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(cx, 60); ctx.lineTo(cx, topY + 20); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, topY + 20); ctx.lineTo(cx - 28, topY + 40); ctx.moveTo(cx, topY + 20); ctx.lineTo(cx + 28, topY + 40); ctx.stroke();

  // 气流箭头（气管口）
  if (Math.abs(state.flow) > 0.0015) {
    const inhaling = state.flow > 0;
    ctx.strokeStyle = inhaling ? "#1f9d55" : "#c0392b"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
      const ax = cx + i * 14;
      const y0 = 50, y1 = 70;
      if (inhaling) {
        ctx.beginPath(); ctx.moveTo(ax, y0); ctx.lineTo(ax, y1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, y1); ctx.lineTo(ax - 4, y1 - 8); ctx.lineTo(ax + 4, y1 - 8); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath(); ctx.moveTo(ax, y1); ctx.lineTo(ax, y0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, y0); ctx.lineTo(ax - 4, y0 + 8); ctx.lineTo(ax + 4, y0 + 8); ctx.closePath(); ctx.fill();
      }
    }
  }

  // 标注
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText("气管", cx + 16, 70);
  ctx.fillText("肺", cx + 36, topY + 30);
  ctx.fillText("膈肌", cx + 86, domeY - 6);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("brh-readout");
  if (!el) return;
  const pos = state.pos;
  const dia = state.flow > 0.0015 ? "收缩（下降）" : (state.flow < -0.0015 ? "舒张（上抬）" : "静止");
  const flow = state.flow > 0.0015 ? "吸气（气入肺）" : (state.flow < -0.0015 ? "呼气（气出肺）" : "静止");
  const chest = Math.round((120 + pos * 40) / 160 * 100);
  el.innerHTML =
    `<div class="ro-item"><span>膈肌</span><span>${dia}</span></div>` +
    `<div class="ro-item"><span>胸廓容积</span><span>约 ${chest}%</span></div>` +
    `<div class="ro-item"><span>肺容积</span><span>约 ${Math.round((0.45 + pos * 0.55) * 100)}%</span></div>` +
    `<div class="ro-item verdict"><span>${flow}</span></div>`;
  const s = document.getElementById("brh-status");
  if (s) s.textContent = flow.split("（")[0];
}

export default {
  id: "breathing",
  name: "呼吸运动",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#brh-canvas");
    ctx = canvas.getContext("2d");
    setup();
    const pos = document.getElementById("brh-pos"), po = document.getElementById("brh-pos-output");
    const autoBtn = document.getElementById("brh-auto");
    pos.addEventListener("input", () => {
      state.auto = false; state.pos = Number(pos.value);
      po.textContent = state.pos < 0.5 ? "舒张" : "收缩";
      autoBtn.textContent = "自动呼吸"; autoBtn.setAttribute("aria-pressed", "false");
      draw();
    });
    autoBtn.addEventListener("click", () => {
      state.auto = !state.auto;
      autoBtn.textContent = state.auto ? "自动呼吸" : "已暂停";
      autoBtn.setAttribute("aria-pressed", String(state.auto));
    });
    document.getElementById("brh-reset").addEventListener("click", () => {
      setup(); pos.value = 0; po.textContent = "舒张";
      autoBtn.textContent = "自动呼吸"; autoBtn.setAttribute("aria-pressed", "true"); draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state) return;
    if (state.auto) {
      state.t += delta;
      state.prev = state.pos;
      state.pos = 0.5 - 0.5 * Math.cos(state.t * 1.4);
      const slider = document.getElementById("brh-pos");
      if (slider) slider.value = state.pos.toFixed(2);
    }
    state.flow = state.pos - state.prev;
    state.prev = state.pos;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
