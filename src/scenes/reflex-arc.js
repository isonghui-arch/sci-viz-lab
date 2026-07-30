// 神经反射弧场景：以“手触热物缩手”为例，演示反射弧五部分——
//   感受器→传入神经→神经中枢（脊髓）→传出神经→效应器。信号经脊髓快速整合后立刻指令肌肉收缩，
//   不经大脑也能完成，因此比“想一下再缩”更快。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .rf-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .rf-section-nav a {
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
    .rf-section-nav a:hover,
    .rf-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .rf-scene #rf-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .rf-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .rf-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .rf-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .rf-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .rf-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "rf",
    figureNo: "FIG. 23 / BIOLOGY",
    titleHTML: "神经反射弧<br />烫到手为何秒缩回",
    lead: "手一碰到烫的，还没等“想”，手已经缩回来了。因为信号走的是“脊髓捷径”：感受器→传入→脊髓→传出→效应器，绕开了大脑。",
    heroNote: "触发热刺激 · 看信号沿反射弧传导 · 手秒缩回",
    navLabel: "反射弧章节导航",
    navItems: [
      { id: "rf-intuition", label: "直觉" },
      { id: "rf-define", label: "定义" },
      { id: "rf-lab", label: "互动实验" },
      { id: "rf-limits", label: "边界说明" },
    ],
    firstAnchor: "rf-intuition",
  })}
    <div class="lab-shell" aria-label="神经反射弧交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="rf-canvas" width="640" height="430" aria-label="神经反射弧示意图"></canvas>
        <div class="canvas-caption">
          <span>蓝=传入神经　红=传出神经　信号经脊髓整合后指令肌肉收缩</span>
          <span id="rf-status">待刺激</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="rf-readout" id="rf-readout"></div>
        <div class="lab-actions">
          <button id="rf-trigger" class="accent-button" type="button">触发刺激（热）</button>
          <button id="rf-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="rf-intuition" aria-labelledby="rf-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="rf-intuition-title">直觉：没过脑子的“快闪”</h2>
      <p>缩手比痛觉传到大脑还快。</p></div>
    </div>
    <p>
      手指碰到滚烫的东西，几乎在<b>同一瞬间</b>手就弹开了，往往要过一会才“感到疼”。原因是这条反应走了一条
      <b>短路</b>：指尖的<b>感受器</b>把“烫”变成神经信号，沿<b>传入神经</b>直奔<b>脊髓</b>；
      脊髓这个“中转站”立刻下达命令，经<b>传出神经</b>传给手臂的<b>效应器</b>（肌肉），肌肉一收缩手就缩回。
      全程不经过大脑，所以快得来不及思考——这就是<b>反射</b>。
    </p>
  </section>

  <section class="section-pad" id="rf-define" aria-labelledby="rf-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="rf-define-title">定义：反射弧五部分</h2>
      <p>缺一环，反射就跑不通。</p></div>
    </div>
    <p>
      完成一次简单反射的结构基础叫<b>反射弧</b>，必须齐备五部分：
      <b>感受器</b>（接受刺激）→ <b>传入神经</b>（传向中枢）→ <b>神经中枢</b>（脊髓等，分析与综合）→
      <b>传出神经</b>（传向效应器）→ <b>效应器</b>（肌肉或腺体，作出反应）。任何一环受损，反射都无法完成。
      脊髓能独立完成这类<b>非条件反射</b>（生来就有），而大脑负责更慢但更复杂的“想清楚再动”。
    </p>
  </section>

  <section class="section-pad" id="rf-lab" aria-labelledby="rf-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="rf-lab-title">互动实验</h2>
      <p>点一下，看信号怎么“抄近道”。</p></div>
    </div>
    <p>
      点“触发刺激（热）”，一颗信号会从指尖出发，沿蓝色传入神经冲向脊髓；到脊髓后立刻折返，
      沿红色传出神经奔向手臂肌肉；到达瞬间，手臂肌肉收缩、手猛地缩回。注意上方的“脑”在更晚才接到通知——
      这正是反射“快”的来源。可多次触发对比。
    </p>
  </section>

  <section class="section-pad" id="rf-limits" aria-labelledby="rf-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="rf-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实神经的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>突触</span><h3>未画延迟</h3><p>真实信号在突触处有化学传递延迟，本模型把传导画成连续流动。</p></article>
      <article><span>脑</span><h3>仅示意</h3><p>脑后续才感知疼痛并精细调控，本模型只点出“比反射慢”的对比。</p></article>
      <article><span>类型</span><h3>单一例</h3><p>仅演示缩手这一非条件反射，条件反射（如望梅止渴）路径更复杂。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

const HAND0 = [95, 300];
const SPINAL = [360, 240];
const EFFECTOR = [555, 300];
const ARC = [HAND0, SPINAL, EFFECTOR]; // 信号沿此三段折线

function arcLength(pts) {
  let L = 0; const seg = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(d); L += d;
  }
  return { L, seg };
}
function pointAt(pts, seg, frac) {
  const total = seg.reduce((s, x) => s + x, 0);
  let target = (frac % 1 + 1) % 1 * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      const a = pts[i], b = pts[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    target -= seg[i];
  }
  return pts[pts.length - 1];
}

function setup() {
  state = { active: false, signalF: 0, withdraw: 0, arc: arcLength(ARC) };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 传入神经（蓝）手→脊髓
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(HAND0[0] + 30, HAND0[1]); ctx.lineTo(SPINAL[0], SPINAL[1] + 20); ctx.stroke();
  // 传出神经（红）脊髓→效应器
  ctx.strokeStyle = "#c0392b";
  ctx.beginPath(); ctx.moveTo(SPINAL[0], SPINAL[1] + 20); ctx.lineTo(EFFECTOR[0] - 30, EFFECTOR[1]); ctx.stroke();

  // 脊髓（神经中枢）
  ctx.fillStyle = "rgba(24,95,165,0.18)"; ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(SPINAL[0], SPINAL[1], 26, 46, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("脊髓", SPINAL[0], SPINAL[1] + 4);
  ctx.font = "11px var(--mono)"; ctx.fillStyle = "#185FA5"; ctx.fillText("神经中枢", SPINAL[0], SPINAL[1] - 56);

  // 脑（上方，较晚接到通知）
  ctx.fillStyle = "rgba(120,90,160,0.18)"; ctx.strokeStyle = "#7a5aa0"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(SPINAL[0], 90, 40, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.fillText("脑", SPINAL[0], 94);
  ctx.strokeStyle = state.signalF > 0.6 ? "rgba(122,90,160,0.9)" : "rgba(122,90,160,0.25)";
  ctx.lineWidth = state.signalF > 0.6 ? 3 : 2; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(SPINAL[0], SPINAL[1] - 44); ctx.lineTo(SPINAL[0], 116); ctx.stroke();
  ctx.setLineDash([]);

  // 热物（红，固定）
  ctx.fillStyle = "#e33a32"; ctx.beginPath(); ctx.arc(150, 300, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 12px var(--sans)"; ctx.fillText("热", 150, 304);
  ctx.fillStyle = "#07182d"; ctx.font = "11px var(--sans)"; ctx.fillText("感受器（指尖）", 150, 330);

  // 手（效应器的“前端”），随收缩左移
  const hx = HAND0[0] - 55 * state.withdraw;
  ctx.fillStyle = "#e8c9a0";
  ctx.fillRect(hx, 285, 36, 30); // 手掌
  ctx.fillRect(hx + 30, 292, 28 - 18 * state.withdraw, 8); // 手指（收缩变短）
  ctx.fillStyle = "#07182d"; ctx.font = "11px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("手（效应器）", hx + 18, 335);

  // 效应器（上臂肌肉）
  ctx.fillStyle = state.withdraw > 0.1 ? "#c8742a" : "rgba(200,116,42,0.5)";
  ctx.fillRect(EFFECTOR[0] - 20, 270, 40, 60);
  ctx.fillStyle = "#07182d"; ctx.font = "11px var(--sans)"; ctx.fillText("肌肉", EFFECTOR[0], 345);

  // 信号脉冲
  if (state.active && state.signalF < 1) {
    const [sx, sy] = pointAt(ARC, state.arc.seg, state.signalF);
    ctx.fillStyle = "#ffd24d"; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#e33a32"; ctx.lineWidth = 2; ctx.stroke();
  }

  // 阶段文字
  let stage;
  if (!state.active && state.withdraw === 0) stage = "待刺激";
  else if (state.signalF < 0.5) stage = "感受器→传入神经（向脊髓传导）";
  else if (state.signalF < 0.55) stage = "神经中枢（脊髓整合）";
  else if (state.signalF < 1) stage = "传出神经（指令到肌肉）";
  else stage = "效应器收缩·手已缩回";
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText(stage, 30, 400);

  updateReadout(stage);
}

function updateReadout(stage) {
  const el = document.getElementById("rf-readout");
  if (!el) return;
  el.innerHTML =
    `<div class="ro-item"><span>感受器</span><span>指尖（热）</span></div>` +
    `<div class="ro-item"><span>神经中枢</span><span>脊髓</span></div>` +
    `<div class="ro-item verdict"><span>进度：${stage}</span></div>`;
  const status = document.getElementById("rf-status");
  if (status) status.textContent = state.withdraw >= 0.99 ? "已缩手·反射完成" : (state.active ? "信号传导中" : "待刺激");
}

export default {
  id: "reflex-arc",
  name: "神经反射弧",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#rf-canvas");
    ctx = canvas.getContext("2d");
    setup();

    document.getElementById("rf-trigger").addEventListener("click", () => {
      state.active = true; state.signalF = 0; state.withdraw = 0;
    });
    document.getElementById("rf-reset").addEventListener("click", () => {
      state.active = false; state.signalF = 0; state.withdraw = 0; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.active) return;
    if (state.signalF < 1) state.signalF = Math.min(1, state.signalF + 0.9 * delta);
    if (state.signalF >= 0.55) state.withdraw = Math.min(1, state.withdraw + 1.6 * delta);
    if (state.signalF >= 1 && state.withdraw >= 1) state.active = false;
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
