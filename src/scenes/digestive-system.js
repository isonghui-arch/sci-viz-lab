// 消化系统场景：示意食物从口腔经食道、胃、小肠到大肠的旅程，
//   各器官分泌不同消化液完成“消化”与“吸收”。食团沿消化道前进，经过的器官高亮并提示其消化液与功能。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .dg-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .dg-section-nav a {
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
    .dg-section-nav a:hover,
    .dg-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .dg-scene #dg-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .dg-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .dg-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .dg-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .dg-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .dg-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "dg",
    figureNo: "FIG. 22 / BIOLOGY",
    titleHTML: "消化系统<br />一口饭的奇妙旅程",
    lead: "从嘴巴到肛门，食物一路被“拆解”又被“吸收”。每个器官各有专属消化液，接力把大分子变成能进血液的小分子。",
    heroNote: "播放消化旅程 · 看各器官如何分工 · 消化液实时提示",
    navLabel: "消化系统章节导航",
    navItems: [
      { id: "dg-intuition", label: "直觉" },
      { id: "dg-define", label: "定义" },
      { id: "dg-lab", label: "互动实验" },
      { id: "dg-limits", label: "边界说明" },
    ],
    firstAnchor: "dg-intuition",
  })}
    <div class="lab-shell" aria-label="消化系统交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="dg-canvas" width="640" height="430" aria-label="人体消化系统示意图"></canvas>
        <div class="canvas-caption">
          <span>食团沿消化道前进 · 经过的器官高亮并显示其消化液</span>
          <span id="dg-status">待开始</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="dg-readout" id="dg-readout"></div>
        <div class="lab-actions">
          <button id="dg-play" class="accent-button" type="button" aria-pressed="true">暂停</button>
          <button id="dg-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="dg-intuition" aria-labelledby="dg-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="dg-intuition-title">直觉：食物被“接力拆解”</h2>
      <p>不是一口吞下就完事，而是一站站加工。</p></div>
    </div>
    <p>
      你嚼下的每口饭，都要走一条很长的“加工线”：先在<b>口腔</b>被磨碎、用唾液开始分解淀粉；
      顺着<b>食道</b>滑进<b>胃</b>，被胃酸和胃蛋白酶处理蛋白质；再进<b>小肠</b>——
      这里是主战场，胰液、胆汁、肠液一齐上，把养分彻底拆碎并大量<b>吸收</b>进血液；
      剩下的残渣进<b>大肠</b>被吸走水分，最后从<b>肛门</b>排出。每个器官各管一段。
    </p>
  </section>

  <section class="section-pad" id="dg-define" aria-labelledby="dg-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="dg-define-title">定义：消化道与消化腺</h2>
      <p>一条管道，一群“化工厂”。</p></div>
    </div>
    <p>
      <b>消化道</b>是一条从口腔到肛门的肌性管道：口腔→咽→食道→胃→小肠（十二指肠·空肠·回肠）→大肠→肛门。
      <b>消化腺</b>分泌消化液：唾液腺、胃腺、胰腺、肝脏（胆汁）、肠腺。消化分两步——
      <b>物理性消化</b>（牙齿咀嚼、胃蠕动）与<b>化学性消化</b>（酶把大分子水解为小分子），
      最终在小肠完成绝大部分消化与吸收。
    </p>
  </section>

  <section class="section-pad" id="dg-lab" aria-labelledby="dg-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="dg-lab-title">互动实验</h2>
      <p>跟着食团，一站站看分工。</p></div>
    </div>
    <p>
      点“播放”，一颗食团会从口腔出发、缓缓走完全程。经过每个器官时，该器官会高亮，
      右侧同步显示它分泌的<b>消化液</b>与承担的<b>功能</b>。重点看小肠——它既是最长的“加工车间”，
      也是吸收养分进血液的主场所。
    </p>
  </section>

  <section class="section-pad" id="dg-limits" aria-labelledby="dg-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="dg-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实身体的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>形态</span><h3>高度示意</h3><p>真实器官形状、位置、小肠绒毛未精确绘制，仅示意流程与顺序。</p></article>
      <article><span>酶</span><h3>未列全</h3><p>各消化液含多种酶（如胰淀粉酶、脂肪酶），本模型只点出代表性的。</p></article>
      <article><span>神经</span><h3>未涉及</h3><p>消化受神经与激素调控（如促胰液素），本图聚焦器官分工。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

const ORGANS = [
  { name: "口腔", f0: 0.00, f1: 0.10, juice: "唾液淀粉酶", func: "磨碎·淀粉初步分解" },
  { name: "食道", f0: 0.10, f1: 0.20, juice: "—", func: "蠕动把食物送进胃" },
  { name: "胃", f0: 0.20, f1: 0.34, juice: "胃液（胃酸·胃蛋白酶）", func: "储存·蛋白质初步消化" },
  { name: "小肠", f0: 0.34, f1: 0.70, juice: "胰液·胆汁·肠液", func: "彻底消化 + 主要吸收" },
  { name: "大肠", f0: 0.70, f1: 0.92, juice: "—", func: "吸收水分·形成粪便" },
  { name: "肛门", f0: 0.92, f1: 1.00, juice: "—", func: "排出食物残渣" },
];

// 消化道中心线路径（按器官顺序）
const PATH = [
  [330, 55], [330, 105], [330, 150],          // 口腔→食道
  [305, 195], [268, 230], [300, 268],          // 胃（J形）
  [345, 292], [398, 302], [398, 348], [345, 360], [298, 348], [298, 305], [342, 305], [388, 325], [348, 365], [305, 360], // 小肠盘曲
  [440, 345], [440, 205], [200, 205], [200, 345], [305, 392], // 大肠框 + 到出口
  [305, 415], // 肛门
];

function pathLength(pts) {
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

function currentOrgan(f) {
  return ORGANS.find((o) => f >= o.f0 && f < o.f1) || ORGANS[ORGANS.length - 1];
}

function setup() {
  state = { playing: true, f: 0, path: pathLength(PATH) };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, W, H);

  // 身体轮廓（淡）
  ctx.strokeStyle = "rgba(17,19,21,0.18)"; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(330, 90, 55, 60, 0, 0, Math.PI * 2); // 头
  ctx.moveTo(280, 150); ctx.lineTo(280, 380); ctx.lineTo(380, 380); ctx.lineTo(380, 150); // 躯干
  ctx.stroke();

  const cur = currentOrgan(state.f);

  // 路径（淡）
  ctx.strokeStyle = "rgba(120,120,120,0.3)"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  PATH.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.stroke();
  ctx.lineCap = "butt"; ctx.lineJoin = "miter";

  // 器官高亮标注
  const labels = [
    { name: "口腔", x: 330, y: 55 },
    { name: "食道", x: 345, y: 150 },
    { name: "胃", x: 268, y: 230 },
    { name: "小肠", x: 400, y: 330 },
    { name: "大肠", x: 200, y: 205 },
    { name: "肛门", x: 305, y: 415 },
  ];
  ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
  labels.forEach((lb) => {
    const isCur = lb.name === cur.name;
    ctx.fillStyle = isCur ? "#b41f24" : "#07182d";
    ctx.font = isCur ? "bold 14px var(--sans)" : "13px var(--sans)";
    ctx.fillText(lb.name, lb.x, lb.y);
  });

  // 食团
  const [bx, by] = pointAt(PATH, state.path.seg, state.f);
  ctx.fillStyle = "#c8742a";
  ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#8a4a14"; ctx.lineWidth = 2; ctx.stroke();

  // 当前器官高亮圈
  const labelPos = labels.find((l) => l.name === cur.name);
  if (labelPos) {
    ctx.strokeStyle = "rgba(180,31,36,0.5)"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(labelPos.x, labelPos.y - 6, 26, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }

  updateReadout(cur);
}

function updateReadout(cur) {
  const el = document.getElementById("dg-readout");
  if (!el) return;
  el.innerHTML =
    `<div class="ro-item"><span>当前器官</span><span>${cur.name}</span></div>` +
    `<div class="ro-item"><span>消化液</span><span>${cur.juice}</span></div>` +
    `<div class="ro-item verdict"><span>功能：${cur.func}</span></div>`;
  const status = document.getElementById("dg-status");
  if (status) status.textContent = state.f >= 0.999 ? "旅程完成" : `经过：${cur.name}`;
}

export default {
  id: "digestive-system",
  name: "消化系统",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#dg-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const playBtn = document.getElementById("dg-play");
    playBtn.addEventListener("click", () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? "暂停" : "播放";
      playBtn.setAttribute("aria-pressed", String(state.playing));
    });
    document.getElementById("dg-reset").addEventListener("click", () => {
      state.f = 0; draw();
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state || !state.playing) return;
    state.f += 0.06 * delta;
    if (state.f >= 1) { state.f = 1; state.playing = false; document.getElementById("dg-play").textContent = "播放"; document.getElementById("dg-play").setAttribute("aria-pressed", "false"); }
    draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
