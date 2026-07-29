// 高尔顿板（Bean machine）：小球穿过三角钉阵，每次以 50% 概率左/右偏转，
//   落到底部 bins 后堆出钟形分布——中心极限定理最直觉的演示。
// 纯 Canvas 2D，无 Three.js。沿用 shellHead 共享壳 + 注册即上线。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .galton-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .galton-section-nav a {
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
    .galton-section-nav a:hover,
    .galton-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .galton-scene #galton-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
  </style>
  ${shellHead({
    ns: "galton",
    figureNo: "FIG. 01 / GALTON BOARD",
    titleHTML: "高尔顿板<br />随机的每一步，<br />堆出钟形",
    lead: "小球穿过钉阵时每一步都随机左右，落到底部却稳定堆成一条钟形曲线——这就是中心极限定理的直觉。",
    heroNote: "调钉子行数看收敛快慢 · 红色虚线为理论二项/正态分布",
    navLabel: "高尔顿板章节导航",
    navItems: [
      { id: "galton-intuition", label: "直觉" },
      { id: "galton-define", label: "定义" },
      { id: "galton-exp", label: "互动实验" },
      { id: "galton-limit", label: "边界说明" },
    ],
    firstAnchor: "galton-intuition",
  })}
    <div class="lab-shell" aria-label="高尔顿板交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="galton-canvas" width="600" height="600" aria-label="高尔顿板：小球穿过钉子阵列落向底部，堆出钟形分布"></canvas>
        <div class="canvas-caption">
          <span>高尔顿板 · 中心极限定理直觉</span>
          <span id="galton-count">已落 0 球</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="galton-rows">
          <span>钉子行数</span>
          <output id="galton-rows-output">12</output>
        </label>
        <input id="galton-rows" type="range" min="6" max="16" step="1" value="12" />
        <label class="control-row" for="galton-speed">
          <span>落球速度</span>
          <output id="galton-speed-output">中</output>
        </label>
        <input id="galton-speed" type="range" min="1" max="5" step="1" value="3" />
        <div class="lab-actions">
          <button id="galton-toggle" type="button">暂停</button>
          <button id="galton-burst" type="button">落 50 球</button>
          <button id="galton-reset" type="button">重置</button>
        </div>
        <label class="control-check">
          <input id="galton-auto" type="checkbox" checked /> 自动连续落球
        </label>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="galton-intuition" aria-labelledby="galton-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="galton-intuition-title">为什么一堆随机会冒出秩序</h2>
        <p>每一颗球在每一根钉子前都「随意」地左或右——可成千上万颗落定后，底部却浮现出一条对称的钟形。</p>
      </div>
    </div>
    <p>
      直觉上，一次左、一次右似乎该相互抵消。但真正决定落点的是「整段路程里左拐比右拐多了几次」：
      中间落点对应「左右大致相等」，两端落点对应「几乎全左或全右」。后者发生的概率远低于前者，
      于是中间高、两边低的轮廓自然浮现。高尔顿板把这条轮廓做成了看得见、数得清的形状。
    </p>
  </section>

  <section class="section-pad" id="galton-define" aria-labelledby="galton-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="galton-define-title">它是怎么算出来的</h2>
        <p>落点由一串独立同分布的 ±1 步累加而成，落进第 k 个 bin 的概率恰好是二项分布。</p>
      </div>
    </div>
    <p>
      设钉阵有 <code>n</code> 行，每颗球走 <code>n</code> 步、每步以 1/2 概率左或右。
      落进第 <code>k</code> 个 bin（共 <code>n+1</code> 个）的概率为
      <code>C(n,k) · (1/2)ⁿ</code> —— 这正是二项分布 <code>B(n, 1/2)</code>。
      当 <code>n</code> 增大时，二项分布趋近正态分布（中心极限定理），所以钉子行数越多，钟形越平滑。
      画布上的红色虚线就是这条理论曲线，它会随落球总数一起「长大」，让你对照实际堆积。
    </p>
  </section>

  <section class="section-pad" id="galton-exp" aria-labelledby="galton-exp-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="galton-exp-title">动手试</h2>
        <p>调钉子行数、落球速度，或一次性落 50 球，观察实际柱状何时贴合红色理论曲线。</p>
      </div>
    </div>
    <ul class="checklist">
      <li>把「钉子行数」从 6 调到 16，对比钟形从抖动到平滑的变化。</li>
      <li>点「落 50 球」做一次性抽查，再开「自动连续落球」看长期收敛。</li>
      <li>落球越多，底部柱状越贴近红色虚线——这是大数定律在起作用。</li>
    </ul>
  </section>

  <section class="section-pad" id="galton-limit" aria-labelledby="galton-limit-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="galton-limit-title">边界与来源</h2>
        <p>演示是理想化的；真实世界里「随机」未必满足这些假设。</p>
      </div>
    </div>
    <p>
      本演示假设每步左右概率严格为 1/2、各步相互独立、钉子位置理想对称。
      一旦偏差（如球偏向某一侧）或步间相关出现，钟形会偏移甚至消失——这正是中心极限定理的适用前提。
      若要更严谨，可把每步步长改为连续随机量、或引入不同方差，看分布形态如何随之改变。
    </p>
    <p class="sources">
      来源：高尔顿《Natural Inheritance》(1889) 提出的 bean machine；
      Galton board / Central limit theorem，Wikipedia；
      二项分布与正态近似，任一概率论教材。
    </p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let S = null;

// 依当前行数重建钉阵、bins 与二项系数（行数变化或重置时调用）
function buildBoard(rows) {
  const W = canvas.width;
  const H = canvas.height;
  const boardTop = 44;
  const pegDY = Math.min(30, (H - 200) / (rows + 2));
  const dx = Math.min(38, (W - 90) / rows);
  const centerX = W / 2;
  const floorY = boardTop + rows * pegDY + 30;

  const pegs = [];
  for (let r = 0; r < rows; r++) {
    const y = boardTop + r * pegDY;
    const startX = centerX - (r * dx) / 2;
    for (let k = 0; k <= r; k++) pegs.push({ x: startX + k * dx, y });
  }

  // 二项系数 C(n,k)，再除以 2^n 得概率
  const binom = [];
  let c = 1;
  for (let i = 0; i <= rows; i++) {
    binom.push(c);
    c = (c * (rows - i)) / (i + 1);
  }
  const totalP = Math.pow(2, rows);
  const binomP = binom.map((v) => v / totalP);

  S.pegs = pegs;
  S.dx = dx;
  S.centerX = centerX;
  S.boardTop = boardTop;
  S.pegDY = pegDY;
  S.floorY = floorY;
  S.rows = rows;
  S.binomP = binomP;
  S.bins = new Array(rows + 1).fill(0);
  S.balls = [];
  S.total = 0;
  S.maxCount = 1;
  S.binTop = floorY + 8;
  S.binMaxH = H - S.binTop - 14;
}

function spawnBall() {
  S.balls.push({
    x: S.centerX + (Math.random() - 0.5) * 4,
    y: S.boardTop - 30,
    vy: 0.5,
    targetX: S.centerX,
    row: 0,
    sumD: 0,
    landed: false,
  });
}

function physics() {
  const g = 0.2 + S.speedParam * 0.06; // 速度档位 → 重力
  for (const b of S.balls) {
    b.vy += g;
    b.y += b.vy;
    if (b.row < S.rows) {
      const rowY = S.boardTop + b.row * S.pegDY;
      if (b.y >= rowY) {
        const d = Math.random() < 0.5 ? -1 : 1;
        b.sumD += d;
        b.row++;
        b.targetX += (d * S.dx) / 2;
        b.vy = -1.4; // 触钉小反弹，营造弹跳感
      }
    }
    b.x += (b.targetX - b.x) * 0.2; // 水平向目标位插值
    if (b.y >= S.floorY) {
      let bin = Math.round((S.rows + b.sumD) / 2);
      bin = Math.max(0, Math.min(S.rows, bin));
      S.bins[bin]++;
      S.total++;
      if (S.bins[bin] > S.maxCount) S.maxCount = S.bins[bin];
      b.landed = true;
    }
  }
  S.balls = S.balls.filter((b) => !b.landed);
}

function draw() {
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 钉阵
  ctx.fillStyle = "#07182d";
  for (const p of S.pegs) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 底板线
  ctx.strokeStyle = "#46433c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, S.floorY);
  ctx.lineTo(W - 20, S.floorY);
  ctx.stroke();

  // 实际堆积柱状
  const { dx, centerX, rows, bins, maxCount, binTop, binMaxH } = S;
  for (let i = 0; i <= rows; i++) {
    const bx = centerX + (i - rows / 2) * dx;
    const h = (bins[i] / maxCount) * binMaxH;
    ctx.fillStyle = "#d9a23a"; // 藏红点缀
    ctx.fillRect(bx - dx * 0.4, binTop, dx * 0.8, h);
  }

  // 理论二项/正态曲线（随总数缩放，便于与实际对照）
  ctx.strokeStyle = "#b41f24";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  for (let i = 0; i <= rows; i++) {
    const bx = centerX + (i - rows / 2) * dx;
    const expected = S.binomP[i] * S.total;
    const cy = binTop + (expected / maxCount) * binMaxH;
    if (i === 0) ctx.moveTo(bx, cy);
    else ctx.lineTo(bx, cy);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // 在飞小球
  ctx.fillStyle = "#b41f24";
  for (const b of S.balls) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default {
  id: "galton",
  name: "高尔顿板",
  category: "probability",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#galton-canvas");
    ctx = canvas.getContext("2d");
    S = {
      balls: [],
      bins: [],
      total: 0,
      maxCount: 1,
      paused: false,
      autoDrop: true,
      speedParam: 3,
      spawnInterval: 168,
      lastSpawn: 0,
      container,
      pegs: [],
      binomP: [],
    };
    buildBoard(12);

    const rowsEl = container.querySelector("#galton-rows");
    const rowsOut = container.querySelector("#galton-rows-output");
    const speedEl = container.querySelector("#galton-speed");
    const speedOut = container.querySelector("#galton-speed-output");
    const toggle = container.querySelector("#galton-toggle");
    const burst = container.querySelector("#galton-burst");
    const reset = container.querySelector("#galton-reset");
    const auto = container.querySelector("#galton-auto");
    const count = container.querySelector("#galton-count");
    S.countEl = count;

    rowsEl.addEventListener("input", () => {
      const r = Number(rowsEl.value);
      rowsOut.textContent = r;
      buildBoard(r);
    });
    speedEl.addEventListener("input", () => {
      const v = Number(speedEl.value);
      S.speedParam = v;
      S.spawnInterval = 360 - v * 64; // 1..5 → 296..40ms
      speedOut.textContent = ["极慢", "慢", "中", "快", "极快"][v - 1];
    });
    toggle.addEventListener("click", () => {
      S.paused = !S.paused;
      toggle.textContent = S.paused ? "继续" : "暂停";
      S.lastSpawn = performance.now();
    });
    burst.addEventListener("click", () => {
      for (let i = 0; i < 50; i++) spawnBall();
    });
    reset.addEventListener("click", () => {
      buildBoard(Number(rowsEl.value));
      if (S.countEl) S.countEl.textContent = "已落 0 球";
    });
    auto.addEventListener("change", () => {
      S.autoDrop = auto.checked;
    });

    draw();
  },
  update() {
    if (!S) return;
    if (!S.paused) {
      const now = performance.now();
      if (S.autoDrop && now - S.lastSpawn > S.spawnInterval) {
        spawnBall();
        S.lastSpawn = now;
      }
      physics();
    }
    draw();
    if (S.countEl) S.countEl.textContent = "已落 " + S.total + " 球";
  },
  dispose() {
    ctx = null;
    canvas = null;
    S = null;
  },
  getDefaultParams() {
    return {};
  },
};
