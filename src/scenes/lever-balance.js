// 杠杆平衡条件场景：两端挂重物，调节质量与力臂，观察杠杆是否会转动，
//   实时显示 F1·L1 与 F2·L2，验证杠杆平衡条件 F1·L1 = F2·L2。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .lv-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .lv-section-nav a {
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
    .lv-section-nav a:hover,
    .lv-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .lv-scene #lv-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .lv-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .lv-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .lv-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .lv-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .lv-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(24,95,165,0.22); border-color: rgba(24,95,165,0.55); }
    .lv-readout .ro-item.lbalance { background: rgba(59,109,17,0.22); border-color: rgba(59,109,17,0.55); }
  </style>
  ${shellHead({
    ns: "lv",
    figureNo: "FIG. 10 / LEVER",
    titleHTML: "杠杆平衡条件<br />跷跷板里的乘法",
    lead: "杠杆不是比谁的力气大，而是比「力 × 力臂」。调两边的质量与距离，看它何时纹丝不动。",
    heroNote: "调节两侧质量与力臂 · 看 F₁·L₁ 是否等于 F₂·L₂",
    navLabel: "杠杆章节导航",
    navItems: [
      { id: "lv-intuition", label: "直觉" },
      { id: "lv-define", label: "定义" },
      { id: "lv-lab", label: "互动实验" },
      { id: "lv-limits", label: "边界说明" },
    ],
    firstAnchor: "lv-intuition",
  })}
    <div class="lab-shell" aria-label="杠杆平衡交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="lv-canvas" width="620" height="360" aria-label="杠杆平衡光路图"></canvas>
        <div class="canvas-caption">
          <span>支点右侧为逆时针、左侧为顺时针；两力矩相等则平衡</span>
          <span id="lv-status">平衡</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="lv-m1"><span>左质量 m₁ (kg)</span><output id="lv-m1-output">4</output></label>
        <input id="lv-m1" type="range" min="1" max="10" step="1" value="4" />
        <label class="control-row" for="lv-l1"><span>左力臂 L₁</span><output id="lv-l1-output">2.0</output></label>
        <input id="lv-l1" type="range" min="0.5" max="4" step="0.1" value="2" />
        <label class="control-row" for="lv-m2"><span>右质量 m₂ (kg)</span><output id="lv-m2-output">2</output></label>
        <input id="lv-m2" type="range" min="1" max="10" step="1" value="2" />
        <label class="control-row" for="lv-l2"><span>右力臂 L₂</span><output id="lv-l2-output">4.0</output></label>
        <input id="lv-l2" type="range" min="0.5" max="4" step="0.1" value="4" />
        <div class="lv-readout" id="lv-readout"></div>
        <div class="lab-actions">
          <button id="lv-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="lv-intuition" aria-labelledby="lv-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="lv-intuition-title">直觉：为什么小孩能撬动大人</h2>
      <p>力臂越长，同样力气越"值钱"。</p></div>
    </div>
    <p>
      跷跷板一边坐大人、一边坐小孩，若让小孩坐得离支点更远，两边就能平衡。
      关键不是谁重，而是<b>「重量 × 到支点的距离」</b>相等。这个距离叫<b>力臂</b>——
      支点到力的作用线的垂直距离。杠杆把"力"换算成"力矩"，于是轻的一端靠更长力臂扳平重的一端。
    </p>
  </section>

  <section class="section-pad" id="lv-define" aria-labelledby="lv-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="lv-define-title">定义：杠杆平衡条件</h2>
      <p>一个等式统管所有杠杆。</p></div>
    </div>
    <p><code>F₁ × L₁ = F₂ × L₂</code>（动力 × 动力臂 = 阻力 × 阻力臂）。这里用质量代替力（重力 <code>G = m·g</code>，<i>g</i> 两边约掉）。</p>
    <p style="margin:8px 0 18px">
      · <b>L₁ &gt; L₂</b> 且平衡：<b>省力杠杆</b>（如撬棍、钳子）<br />
      · <b>L₁ &lt; L₂</b> 且平衡：<b>费力杠杆</b>（如镊子、钓鱼竿，省距离）<br />
      · <b>L₁ = L₂</b> 且平衡：<b>等臂杠杆</b>（如天平）
    </p>
    <p>当两边力矩不等，杠杆会朝力矩大的一侧转动，直到被限位挡住或人为调整。</p>
  </section>

  <section class="section-pad" id="lv-lab" aria-labelledby="lv-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="lv-lab-title">互动实验</h2>
      <p>调出平衡，再故意打破它。</p></div>
    </div>
    <p>
      左侧力矩 <code>m₁·L₁</code>、右侧力矩 <code>m₂·L₂</code> 实时显示在读数面板。
      试着把默认（4×2 = 2×4 = 8）调成不平衡：把右力臂降到 2，杠杆立刻向右倾。
      再加大左质量回到相等，杠杆又水平——这就是平衡的瞬间判断。
    </p>
  </section>

  <section class="section-pad" id="lv-limits" aria-labelledby="lv-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="lv-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实杠杆的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>理想杆</span><h3>忽略自重</h3><p>本模型假设杠杆本身无质量、不变形；真实撬棍有自重，会略微改变平衡。</p></article>
      <article><span>支点摩擦</span><h3>理想铰链</h3><p>假设支点无摩擦；真实支点有摩擦，很小但存在。</p></article>
      <article><span>角度</span><h3>小幅近似</h3><p>大角度倾斜时力臂应取"垂直距离"，本演示用水平力臂近似，倾斜后会略有偏差。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
const G = 10; // 重力加速度，仅用于把质量换算成"力"显示

function setup() {
  state = { m1: 4, l1: 2, m2: 2, l2: 4, angle: 0, targetAngle: 0 };
}

function torque1() { return state.m1 * G * state.l1; }
function torque2() { return state.m2 * G * state.l2; }

function recomputeTarget() {
  const diff = torque1() - torque2(); // >0 左沉(顺时针), <0 右沉
  state.targetAngle = Math.max(-0.32, Math.min(0.32, diff * 0.012));
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  const pivotX = W / 2, pivotY = H - 70;
  const half = 180; // 半梁长(px)
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 地面
  ctx.strokeStyle = "#c9c2b2";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, pivotY + 60); ctx.lineTo(W - 40, pivotY + 60); ctx.stroke();

  // 支点(三角)
  ctx.fillStyle = "#07182d";
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY + 8);
  ctx.lineTo(pivotX - 16, pivotY + 60);
  ctx.lineTo(pivotX + 16, pivotY + 60);
  ctx.closePath(); ctx.fill();

  // 梁（绕支点旋转 angle；左沉为正，顺时针）
  const a = state.angle;
  const cx = pivotX, cy = pivotY;
  function endPoint(dist, side) {
    // side: -1 左, +1 右。水平时 y=cy，绕支点旋转
    const len = dist * (half / 4); // l(0.5-4) 映射到像素
    const baseAng = side < 0 ? Math.PI : 0;
    const ang = baseAng + a; // 顺时针为正 => 左端下沉为正角
    return { x: cx + Math.cos(ang) * len, y: cy - Math.sin(ang) * len * 0 + Math.sin(a) * len * side * -1 };
  }
  // 更直观：梁两端点
  const leftLen = state.l1 * (half / 4);
  const rightLen = state.l2 * (half / 4);
  const leftX = cx - Math.cos(a) * leftLen;
  const leftY = cy + Math.sin(a) * leftLen; // a>0 左端下沉
  const rightX = cx + Math.cos(a) * rightLen;
  const rightY = cy - Math.sin(a) * rightLen;

  ctx.strokeStyle = "#185FA5";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(leftX, leftY); ctx.lineTo(rightX, rightY); ctx.stroke();
  ctx.lineCap = "butt";

  // 支点圆
  ctx.fillStyle = "#b41f24";
  ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

  // 重物（悬挂在两端）
  function weight(x, y, m, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 16, y, 32, 26);
    ctx.fillStyle = "#fff";
    ctx.font = "12px var(--sans)";
    ctx.textAlign = "center";
    ctx.fillText(m + "kg", x, y + 18);
  }
  weight(leftX, leftY, state.m1, "#b41f24");
  weight(rightX, rightY, state.m2, "#1D9E75");

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("lv-readout");
  if (!el) return;
  const t1 = torque1(), t2 = torque2();
  const balanced = Math.abs(t1 - t2) < 0.5;
  const verdict = balanced ? "平衡（F₁·L₁ = F₂·L₂）" : (t1 > t2 ? "左沉（左力矩更大）" : "右沉（右力矩更大）");
  el.innerHTML =
    `<div class="ro-item"><span>F₁·L₁</span><span>${t1.toFixed(0)}</span></div>` +
    `<div class="ro-item"><span>F₂·L₂</span><span>${t2.toFixed(0)}</span></div>` +
    `<div class="ro-item verdict"><span>${verdict}</span></div>`;
  const status = document.getElementById("lv-status");
  if (status) status.textContent = balanced ? "平衡" : (t1 > t2 ? "向左倾" : "向右倾");
}

export default {
  id: "lever-balance",
  name: "杠杆平衡条件",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#lv-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const bind = (id, key, outId, fix) => {
      const s = document.getElementById(id);
      const o = document.getElementById(outId);
      s.addEventListener("input", () => {
        state[key] = Number(s.value);
        o.textContent = fix ? Number(s.value).toFixed(fix) : s.value;
        recomputeTarget();
        draw();
      });
    };
    bind("lv-m1", "m1", "lv-m1-output");
    bind("lv-l1", "l1", "lv-l1-output", 1);
    bind("lv-m2", "m2", "lv-m2-output");
    bind("lv-l2", "l2", "lv-l2-output", 1);

    document.getElementById("lv-reset").addEventListener("click", () => {
      state.m1 = 4; state.l1 = 2; state.m2 = 2; state.l2 = 4;
      document.getElementById("lv-m1").value = "4"; document.getElementById("lv-m1-output").textContent = "4";
      document.getElementById("lv-l1").value = "2"; document.getElementById("lv-l1-output").textContent = "2.0";
      document.getElementById("lv-m2").value = "2"; document.getElementById("lv-m2-output").textContent = "2";
      document.getElementById("lv-l2").value = "4"; document.getElementById("lv-l2-output").textContent = "4.0";
      recomputeTarget(); draw();
    });

    recomputeTarget();
    draw();
  },
  update() {
    if (!state) return;
    // 缓动到目标倾角，让"打破平衡"有转动的视觉效果
    state.angle += (state.targetAngle - state.angle) * 0.15;
    if (Math.abs(state.targetAngle - state.angle) > 0.001) draw();
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
