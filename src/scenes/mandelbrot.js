// 曼德博集合：纯 Canvas 2D 像素迭代着色，滚轮以鼠标为中心缩放 + 拖拽平移。
// 数学分类的"镇场"场景——单色(手册风)/暖金/蓝金 三套配色。
import { shellHead } from "../scene-shell.js";

const RES = 560; // 内部渲染分辨率（正方形，CSS 自适应显示）

const template = `
  <style>
    .mb-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .mb-section-nav a {
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
    .mb-section-nav a:hover,
    .mb-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .mb-scene #mb-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: var(--ink);
      cursor: crosshair;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
  </style>
  ${shellHead({
    ns: "mb",
    figureNo: "FIG. 03 / 数学",
    titleHTML: "曼德博集合<br />一根公式，<br />无限海岸线",
    lead: "对复平面上的每一点 c，迭代 z → z² + c（从 z=0 起）。永不逃逸的 c 组成曼德博集合——边界上每一段放大都诞生新的整体。",
    heroNote: "滚轮以指针为中心缩放 · 拖拽平移 · 右下角切换配色",
    navLabel: "曼德博章节导航",
    navItems: [
      { id: "mb-intuition", label: "直觉" },
      { id: "mb-def", label: "定义" },
      { id: "mb-exp", label: "互动实验" },
      { id: "mb-limit", label: "边界说明" },
    ],
    firstAnchor: "mb-intuition",
  })}
    <div class="lab-shell" aria-label="曼德博集合交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="mb-canvas" width="${RES}" height="${RES}" aria-label="曼德博集合分形渲染画布"></canvas>
        <div class="canvas-caption">
          <span id="mb-coord">悬停查看坐标</span>
          <span id="mb-zoom">缩放 ×1</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="mb-iter">
          <span>最大迭代 <i>N</i></span>
          <output id="mb-iter-output">120</output>
        </label>
        <input id="mb-iter" type="range" min="30" max="400" step="10" value="120" />
        <label class="control-row" for="mb-scheme" style="margin-top:14px">
          <span>配色</span>
        </label>
        <select id="mb-scheme" style="width:100%;padding:8px 10px;border:1px solid var(--rule);border-radius:6px;background:#fff;font-family:var(--sans);font-size:14px;color:var(--ink)">
          <option value="mono">手册单色（米→藏红→红）</option>
          <option value="warm">暖金</option>
          <option value="classic">蓝金</option>
        </select>
        <div class="lab-actions" style="margin-top:16px">
          <button id="mb-reset" type="button">重置视图</button>
        </div>
        <p style="font-size:12px;color:var(--muted);margin-top:12px;line-height:1.6">
          滚轮缩放 · 拖拽平移 · 缩放倍数与悬停坐标实时显示。放大越深，渲染越慢（迭代次数越高）。
        </p>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="mb-intuition" aria-labelledby="mb-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="mb-intuition-title">为什么一根公式能画出海岸线</h2>
        <p>我们只在做一件极简单的事：对每个候选点，反复套用同一个动作。</p>
      </div>
    </div>
    <p>
      把复平面上的每一点当作一个参数 <i>c</i>。从 <i>z</i> = 0 出发，不断地算 <i>z</i> → <i>z</i>² + <i>c</i>。
      有的 <i>c</i> 会让 <i>z</i> 越跑越远、最终冲出半径 2 的圆（"逃逸"）；有的 <i>c</i> 会让 <i>z</i> 始终被圈住。
      后者组成的点集，就是曼德博集合——黑色那团。它最反直觉的地方在于：
      <strong>边界上随便挑一小段放大，都会冒出和整体惊人相似的新结构</strong>，无穷无尽。
    </p>
  </section>

  <section class="section-pad" id="mb-def" aria-labelledby="mb-def-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="mb-def-title">定义</h2>
        <p>集合的精确数学表述。</p>
      </div>
    </div>
    <p>
      曼德博集合 <i>M</i> = { <i>c</i> ∈ ℂ : 序列 <i>z</i><sub>n+1</sub> = <i>z</i><sub>n</sub>² + <i>c</i>，<i>z</i><sub>0</sub> = 0 有界 }。
      等价于：若某个 <i>n</i> 使 |<i>z</i><sub>n</sub>| &gt; 2，则序列必发散，<i>c</i> ∉ <i>M</i>；
      若对所有 <i>n</i> 都有 |<i>z</i><sub>n</sub>| ≤ 2，则 <i>c</i> ∈ <i>M</i>。
      渲染时我们用"逃逸所需的最小迭代次数"给外部上色——迭代越久才逃，颜色越深，正好勾勒出边界的精细褶皱。
    </p>
  </section>

  <section class="section-pad" id="mb-exp" aria-labelledby="mb-exp-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="mb-exp-title">互动实验</h2>
        <p>亲手放大，感受"无限海岸线"。</p>
      </div>
    </div>
    <p>
      在画布上<strong>滚动滚轮</strong>——缩放会以你的指针为锚点，像真的凑近看一块海岸。
      <strong>按住拖拽</strong>可平移视野。把<strong>最大迭代 N</strong>调高，能看到更深层、更细的螺纹；
      在结构密集处放大时适当提高 N，否则会出现模糊的色块。试着顺着主心形右侧的"触须"一路放大，
      你会反复撞见缩小版的曼德博集合本身。
    </p>
  </section>

  <section class="section-pad" id="mb-limit" aria-labelledby="mb-limit-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="mb-limit-title">边界说明 · 来源</h2>
        <p>可视化能做到的，与做不到的。</p>
      </div>
    </div>
    <p>
      本图用 64 位浮点（JavaScript <code>double</code>）逐像素迭代，最大迭代次数可调。
      受浮点精度所限，放大到约 10⁻¹⁴ 倍后会因舍入误差出现像素马赛克——这是所有浏览器端实时分形的共同上限，
      并非算法缺陷。要看得更深需换用任意精度算术（如 perturbation theory），代价是速度。
      集合由 Benoit Mandelbrot 于 1980 年前后在研究复动力学时系统绘制；
      其边界的"局部自相似 + 处处不光滑"是分形几何最著名的图景之一。
    </p>
  </section>
  </div>`;

// ---- 渲染状态 ----
let ctx = null;
let canvas = null;
let img = null;
let view = { cx: -0.6, cy: 0, w: 3.2 }; // w = 复平面横向跨度
let maxIter = 120;
let scheme = "mono";
let raf = null;
let debounceTimer = null;

function palette(t, mode) {
  // t 已是平滑迭代值（已做 sqrt 缩放），取小数部分循环
  const v = t - Math.floor(t);
  if (mode === "mono") {
    // 米白 -> 藏红 -> 红
    if (v < 0.5) return lerp3([243, 239, 229], [229, 165, 38], v / 0.5);
    return lerp3([229, 165, 38], [180, 31, 36], (v - 0.5) / 0.5);
  }
  // 余弦调色板（IQ）：mode=warm 偏红金，classic 蓝金
  const a = mode === "warm" ? [0.5, 0.42, 0.32] : [0.5, 0.5, 0.5];
  const b = mode === "warm" ? [0.5, 0.45, 0.4] : [0.5, 0.5, 0.5];
  const c = [1, 1, 1];
  const d = mode === "warm" ? [0.0, 0.12, 0.25] : [0.0, 0.1, 0.2];
  const TAU = 6.28318530718;
  return [
    (a[0] + b[0] * Math.cos(TAU * (c[0] * v + d[0]))) * 255,
    (a[1] + b[1] * Math.cos(TAU * (c[1] * v + d[1]))) * 255,
    (a[2] + b[2] * Math.cos(TAU * (c[2] * v + d[2]))) * 255,
  ].map((x) => Math.max(0, Math.min(255, x | 0)));
}

function lerp3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ].map((x) => Math.max(0, Math.min(255, x | 0)));
}

function render(step) {
  if (!ctx || !img || !canvas) return;
  const W = canvas.width;
  const H = canvas.height;
  const data = img.data;
  const dw = view.w / W; // 每像素复跨度（横向）
  const dh = view.w / H; // 纵向（正方形，跨度同）
  const maxN = maxIter;
  const mode = scheme;
  for (let py = 0; py < H; py += step) {
    const im0 = view.cy + (py - H / 2) * dh;
    for (let px = 0; px < W; px += step) {
      const re0 = view.cx + (px - W / 2) * dw;
      let zr = 0, zi = 0, zr2 = 0, zi2 = 0, n = 0;
      while (n < maxN && zr2 + zi2 <= 4) {
        zi = 2 * zr * zi + im0;
        zr = zr2 - zi2 + re0;
        zr2 = zr * zr;
        zi2 = zi * zi;
        n++;
      }
      let r, g, b;
      if (n >= maxN) {
        r = 17; g = 19; b = 21; // 集合内部：墨色
      } else {
        const mag = Math.sqrt(zr2 + zi2);
        const sm = n + 1 - Math.log(Math.log(mag)) / Math.LN2;
        const val = Math.sqrt(Math.max(0, sm)) * 0.05;
        const c = palette(val, mode);
        r = c[0]; g = c[1]; b = c[2];
      }
      for (let by = 0; by < step && py + by < H; by++) {
        const row = (py + by) * W;
        for (let bx = 0; bx < step && px + bx < W; bx++) {
          const idx = (row + px + bx) * 4;
          data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  updateStatus();
}

function updateStatus() {
  const zoom = (3.2 / view.w).toPrecision(3);
  const z = container.querySelector("#mb-zoom");
  if (z) z.textContent = "缩放 ×" + zoom;
}

// ---- 交互 ----
function screenToComplex(mx, my) {
  const W = canvas.width, H = canvas.height;
  const dw = view.w / W, dh = view.w / H;
  return {
    re: view.cx + (mx - W / 2) * dw,
    im: view.cy + (my - H / 2) * dh,
  };
}

function scheduleFull() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => render(1), 140);
}

function zoomAt(mx, my, factor) {
  const before = screenToComplex(mx, my);
  view.w *= factor;
  view.w = Math.max(1e-13, Math.min(4, view.w));
  const dw = view.w / canvas.width, dh = view.w / canvas.height;
  view.cx = before.re - (mx - canvas.width / 2) * dw;
  view.cy = before.im - (my - canvas.height / 2) * dh;
  render(3); // 即时低质预览
  scheduleFull();
}

let dragging = false;
let last = null;
let container = null;

function onWheel(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
  const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
  zoomAt(mx, my, factor);
}

function onDown(e) {
  dragging = true;
  const rect = canvas.getBoundingClientRect();
  last = {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function onMove(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
  // 悬停坐标显示
  const c = screenToComplex(mx, my);
  const co = container.querySelector("#mb-coord");
  if (co) co.textContent = `c = ${c.re.toFixed(6)} ${c.im >= 0 ? "+" : "−"} ${Math.abs(c.im).toFixed(6)}i`;
  if (!dragging || !last) return;
  const dx = mx - last.x, dy = my - last.y;
  const dw = view.w / canvas.width, dh = view.w / canvas.height;
  view.cx -= dx * dw;
  view.cy -= dy * dh;
  last = { x: mx, y: my };
  render(3);
  scheduleFull();
}

function onUp() {
  dragging = false;
  last = null;
}

export default {
  id: "mandelbrot",
  name: "曼德博集合",
  category: "math",
  init(c) {
    container = c;
    container.innerHTML = template;
    canvas = container.querySelector("#mb-canvas");
    ctx = canvas.getContext("2d");
    img = ctx.createImageData(RES, RES);

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", () => {
      const co = container.querySelector("#mb-coord");
      if (co) co.textContent = "悬停查看坐标";
    });

    const iter = container.querySelector("#mb-iter");
    const iterOut = container.querySelector("#mb-iter-output");
    iter.addEventListener("input", () => {
      maxIter = Number(iter.value);
      iterOut.textContent = maxIter;
      render(3);
      scheduleFull();
    });
    const schemeSel = container.querySelector("#mb-scheme");
    schemeSel.addEventListener("change", () => {
      scheme = schemeSel.value;
      render(1);
    });
    container.querySelector("#mb-reset").addEventListener("click", () => {
      view = { cx: -0.6, cy: 0, w: 3.2 };
      maxIter = 120;
      iter.value = "120";
      iterOut.textContent = "120";
      render(1);
    });

    render(1);
  },
  update() {
    // 曼德博是静态图像，渲染仅在交互时触发；此处不重算以避免无谓的逐像素开销。
  },
  dispose() {
    if (canvas) {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onDown);
    }
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    if (debounceTimer) clearTimeout(debounceTimer);
    ctx = null;
    canvas = null;
    img = null;
    container = null;
  },
  getDefaultParams() {
    return {};
  },
};
