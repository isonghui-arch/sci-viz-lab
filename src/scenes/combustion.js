// 燃烧条件与灭火场景：用「火三角」演示 可燃物 / 氧气 / 温度(着火点) 三条件，
//   移除任一条件火焰熄灭，并对应到常见灭火原理。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .fire-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .fire-section-nav a {
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
    .fire-section-nav a:hover,
    .fire-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .fire-scene #fire-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .fire-toggles { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .fire-toggles button {
      font-family: var(--sans);
      font-size: 13px;
      padding: 8px 11px;
      border: 1px solid var(--rule);
      background: #fff;
      color: var(--ink);
      border-radius: 8px;
      cursor: pointer;
    }
    .fire-toggles button[aria-pressed="true"] {
      background: var(--red-bright, #b41f24);
      color: #fff;
      border-color: var(--red-bright, #b41f24);
    }
    .fire-readout {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.5;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .fire-readout.burn { background: rgba(226,75,74,0.18); border-color: rgba(226,75,74,0.5); }
    .fire-readout.out  { background: rgba(88,88,80,0.16); border-color: rgba(88,88,80,0.4); }
  </style>
  ${shellHead({
    ns: "fire",
    figureNo: "FIG. 10 / COMBUSTION",
    titleHTML: "燃烧条件<br />与灭火原理",
    lead: "燃烧需要同时满足三个条件。移除其中任意一个，火就灭了——这恰好对应三种灭火思路。点亮火三角，再逐个撤掉条件看火焰如何熄灭。",
    heroNote: "三个开关分别对应火三角的一角 · 撤掉任一角 → 火焰熄灭",
    navLabel: "燃烧章节导航",
    navItems: [
      { id: "fire-intuition", label: "直觉" },
      { id: "fire-define", label: "定义" },
      { id: "fire-lab", label: "互动实验" },
      { id: "fire-limits", label: "边界说明" },
    ],
    firstAnchor: "fire-intuition",
  })}
    <div class="lab-shell" aria-label="燃烧条件与灭火交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="fire-canvas" width="600" height="340" aria-label="火三角与燃烧动画"></canvas>
        <div class="canvas-caption">
          <span>火焰动画为示意，火三角缺一角即熄灭</span>
          <span id="fire-status">正常燃烧</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="fire-toggles" role="group" aria-label="火三角三条件">
          <button id="fire-fuel" type="button" aria-pressed="true">可燃物（木材）</button>
          <button id="fire-o2" type="button" aria-pressed="true">氧气（敞开）</button>
          <button id="fire-temp" type="button" aria-pressed="true">温度 ≥ 着火点</button>
        </div>
        <div class="fire-readout burn" id="fire-readout"></div>
        <div class="lab-actions">
          <button id="fire-reset" type="button">重新点燃</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="fire-intuition" aria-labelledby="fire-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="fire-intuition-title">直觉：火为什么灭</h2>
        <p>把燃烧想成一个"三条腿的凳子"，少一条腿就坐不稳。</p>
      </div>
    </div>
    <p>
      要让一样东西烧起来，必须同时备齐三样东西：有<b>可燃物</b>（木头、纸张）、有<b>氧气</b>（空气里约 21%）、
      温度达到该物质的<b>着火点</b>。这三样构成一个"火三角"。灭火的本质，就是<b>拿走三角的任意一条边</b>：
      盖上锅盖是<b>隔绝氧气</b>，泼水是<b>降温到着火点以下</b>，搬走燃料或关闭燃气是<b>移除可燃物</b>。
    </p>
  </section>

  <section class="section-pad" id="fire-define" aria-labelledby="fire-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="fire-define-title">定义：燃烧与灭火</h2>
        <p>燃烧是剧烈的发光发热的氧化反应。</p>
      </div>
    </div>
    <p>
      通常所说的<b>燃烧</b>，是可燃物与氧气发生的一种<b>发光、发热的剧烈氧化反应</b>。
      三个必要条件（火三角）：<b>可燃物</b>、<b>氧气（或助燃物）</b>、<b>温度达到着火点</b>。
      三者<b>缺一不可</b>。
    </p>
    <p style="margin-top:8px">
      对应的<b>灭火原理</b>：① <b>清除可燃物</b>（如砍出防火带、关燃气阀）；
      ② <b>隔绝氧气</b>（如灭火毯、二氧化碳、泡沫）；③ <b>使温度降到着火点以下</b>（如水、干冰）。
      注意：并非所有灭火都靠"降温"，油锅着火不能用水（油浮在水上继续烧且飞溅），应盖锅盖隔绝氧气。
    </p>
  </section>

  <section class="section-pad" id="fire-lab" aria-labelledby="fire-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="fire-lab-title">互动实验</h2>
        <p>依次撤掉三个条件，观察火焰与对应灭火法。</p>
      </div>
    </div>
    <p>
      右侧画面中央是"火三角"：三个顶点分别是可燃物、氧气、温度。下方是燃烧的木柴。
      点掉任意一个开关，对应一角变灰、火焰立刻熄灭，并提示你这对应现实中的哪种灭火方法。
      建议逐个尝试，体会"缺一角即灭"。
    </p>
  </section>

  <section class="section-pad" id="fire-limits" aria-labelledby="fire-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="fire-limits-title">这个模型简化了什么</h2>
        <p>真实火灾比"三角"更复杂。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>爆炸</span>
        <h3>瞬间燃烧</h3>
        <p>可燃气体在有限空间内急速燃烧会爆炸，本模型未表现压强与传播速率。</p>
      </article>
      <article>
        <span>缓慢氧化</span>
        <h3>不发光也放热</h3>
        <p>铁生锈、食物腐败是缓慢氧化，同样耗氧放热但不起火，不在本场景范围。</p>
      </article>
      <article>
        <span>助燃物</span>
        <h3>不止氧气</h3>
        <p>氢气能在氯气中燃烧、镁能在二氧化碳中燃烧，火三角的"氧气"准确说是"助燃物"。</p>
      </article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;
let t = 0;

function setup() {
  state = { fuel: true, o2: true, temp: true };
}

function isBurning() { return state.fuel && state.o2 && state.temp; }

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 燃烧木柴（左下）
  const fx = 150, fy = 270;
  ctx.strokeStyle = "#7a5230";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(fx - 40, fy); ctx.lineTo(fx + 40, fy - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx - 30, fy - 6); ctx.lineTo(fx + 44, fy - 2); ctx.stroke();

  const burning = isBurning();
  if (burning) {
    t += 0.15;
    // 火焰（多层）
    const flame = (cx, baseY, h, w, col) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(cx - w, baseY);
      ctx.quadraticCurveTo(cx - w * 0.6, baseY - h * 0.6, cx, baseY - h);
      ctx.quadraticCurveTo(cx + w * 0.6, baseY - h * 0.6, cx + w, baseY);
      ctx.closePath();
      ctx.fill();
    };
    const flick = Math.sin(t) * 4;
    flame(fx, fy - 6, 70 + flick, 26, "rgba(226,75,74,0.85)");
    flame(fx, fy - 6, 50 + flick, 18, "rgba(245,166,35,0.9)");
    flame(fx, fy - 6, 28, 10, "rgba(255,222,120,0.95)");
  } else {
    // 余烬
    ctx.fillStyle = "#6b6b63";
    ctx.beginPath(); ctx.arc(fx, fy - 4, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a8475";
    ctx.font = "12px var(--sans)";
    ctx.textAlign = "center";
    ctx.fillText("已熄灭", fx, fy - 26);
  }

  // 火三角（右侧）
  const cx = 430, cy = 150, R = 70;
  const tri = [
    { x: cx, y: cy - R, key: "fuel", label: "可燃物" },
    { x: cx - R * 0.87, y: cy + R * 0.5, key: "o2", label: "氧气" },
    { x: cx + R * 0.87, y: cy + R * 0.5, key: "temp", label: "温度" },
  ];
  ctx.lineWidth = 2;
  tri.forEach((p, i) => {
    const n = tri[(i + 1) % 3];
    const on = state[p.key];
    ctx.strokeStyle = on ? "#E24B4A" : "#b4b2a9";
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
  });
  tri.forEach((p) => {
    const on = state[p.key];
    ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = on ? "#E24B4A" : "#b4b2a9";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px var(--sans)";
    ctx.textAlign = "center";
    ctx.fillText(on ? "✓" : "✕", p.x, p.y + 3);
  });
  // 中心 "燃烧"
  ctx.fillStyle = burning ? "#b41f24" : "#8a8475";
  ctx.font = "bold 15px var(--sans)";
  ctx.textAlign = "center";
  ctx.fillText(burning ? "燃烧" : "熄灭", cx, cy + 6);
  // 顶点标签
  ctx.fillStyle = "#2c2c2a";
  ctx.font = "12px var(--sans)";
  tri.forEach((p) => {
    const ly = p.y < cy ? p.y - 18 : p.y + 24;
    ctx.fillText(p.label, p.x, ly);
  });

  updateReadout(burning);
}

function updateReadout(burning) {
  const el = document.getElementById("fire-readout");
  const status = document.getElementById("fire-status");
  if (!el) return;
  let msg;
  if (burning) {
    el.className = "fire-readout burn";
    msg = "三条件齐全 → 正常燃烧。试着撤掉任意一角。";
  } else {
    el.className = "fire-readout out";
    if (!state.fuel) msg = "移除可燃物（关燃气 / 防火带）→ 无物可烧，熄灭。";
    else if (!state.o2) msg = "隔绝氧气（盖锅盖 / 二氧化碳 / 灭火毯）→ 缺助燃物，熄灭。";
    else msg = "降温到着火点以下（泼水 / 干冰）→ 温度不够，熄灭。";
  }
  el.textContent = msg;
  if (status) status.textContent = burning ? "正常燃烧" : "已熄灭";
}

function bindToggle(id, key) {
  const b = document.getElementById(id);
  b.addEventListener("click", () => {
    state[key] = !state[key];
    b.setAttribute("aria-pressed", String(state[key]));
    draw();
  });
}

export default {
  id: "combustion",
  name: "燃烧条件与灭火",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#fire-canvas");
    ctx = canvas.getContext("2d");
    setup();

    bindToggle("fire-fuel", "fuel");
    bindToggle("fire-o2", "o2");
    bindToggle("fire-temp", "temp");

    document.getElementById("fire-reset").addEventListener("click", () => {
      state = { fuel: true, o2: true, temp: true };
      for (const [id, key] of [["fire-fuel", "fuel"], ["fire-o2", "o2"], ["fire-temp", "temp"]]) {
        document.getElementById(id).setAttribute("aria-pressed", "true");
      }
      draw();
    });

    draw();
  },
  update() { draw(); },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
