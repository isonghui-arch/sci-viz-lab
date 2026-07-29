// 共享壳示范场景：演示如何用 scene-shell.js 的 shellHead 写出一个完整场景。
// 本文件就是「新增场景」的活模板——删掉它、或仿写它即可扩充站点，导航会自动出现。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .demo-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .demo-section-nav a {
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
    .demo-section-nav a:hover,
    .demo-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .demo-scene #demo-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
    }
  </style>
  ${shellHead({
    ns: "demo",
    figureNo: "FIG. 00 / SHELL DEMO",
    titleHTML: "共享外壳<br />一次写好，<br />处处复用",
    lead: "本场景用 scene-shell.js 的 shellHead 生成骨架，证明新增场景只需写实验逻辑与差异内容。",
    heroNote: "拖动滑块改变半径 · 这是共享壳的示范场景，可整文件删除",
    navLabel: "示范章节导航",
    navItems: [
      { id: "demo-intuition", label: "直觉" },
      { id: "demo-about", label: "关于" },
    ],
    firstAnchor: "demo-intuition",
  })}
    <div class="lab-shell" aria-label="共享壳示范交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="demo-canvas" width="600" height="320" aria-label="示例画布：一个可调半径的圆"></canvas>
        <div class="canvas-caption">
          <span>共享壳示范</span>
          <span id="demo-status">半径 60</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="demo-radius">
          <span>半径 <i>r</i></span>
          <output id="demo-radius-output">60</output>
        </label>
        <input id="demo-radius" type="range" min="20" max="140" step="2" value="60" />
        <div class="lab-actions">
          <button id="demo-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="demo-intuition" aria-labelledby="demo-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="demo-intuition-title">为什么需要共享壳</h2>
        <p>原来每个场景都在自己的 template 里重复写 hero、章节导航与场景容器。</p>
      </div>
    </div>
    <p>
      抽出 <code>shellHead</code> 之后，新场景只声明图号、标题、章节项与实验控件，外壳结构由单一来源生成。
      导航也不再写死在 <code>index.html</code>——它由注册表自动按分类渲染，注册一个场景，导航里就多一个入口。
    </p>
  </section>

  <section class="section-pad" id="demo-about" aria-labelledby="demo-about-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="demo-about-title">关于本场景</h2>
        <p>这是一个用共享壳写出的最小可运行示例。</p>
      </div>
    </div>
    <p>
      它不含 Three.js，只用一个 Canvas 圆演示「共享壳 + 极简实验」的写法。
      若要扩充你的科学可视化站点，复制本文件、改掉 <code>id</code> / <code>name</code> / 文案与实验逻辑，
      再到 <code>main.js</code> 的 <code>CATEGORY</code> 里加一行（或直接给场景加 <code>category</code> 字段），导航会自动出现。
    </p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let radius = 60;

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, w, h);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#b41f24";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#07182d";
  ctx.stroke();
}

export default {
  id: "shell-demo",
  name: "共享壳示范",
  category: "math",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#demo-canvas");
    ctx = canvas.getContext("2d");

    const slider = container.querySelector("#demo-radius");
    const out = container.querySelector("#demo-radius-output");
    const status = container.querySelector("#demo-status");
    slider.addEventListener("input", () => {
      radius = Number(slider.value);
      out.textContent = radius;
      if (status) status.textContent = "半径 " + radius;
    });
    container.querySelector("#demo-reset").addEventListener("click", () => {
      radius = 60;
      slider.value = "60";
      out.textContent = "60";
      if (status) status.textContent = "半径 60";
    });
    draw();
  },
  update() {
    draw();
  },
  dispose() {
    ctx = null;
    canvas = null;
  },
  getDefaultParams() {
    return {};
  },
};
