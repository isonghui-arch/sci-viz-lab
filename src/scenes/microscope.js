// 显微镜观察细胞场景：模拟显微镜视野，可切换样本（洋葱表皮 / 口腔上皮）、
//   调节放大倍数、染色（显示细胞核），并拖动玻片平移视野。建立「放大倍数=目镜×物镜」概念。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .mic-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .mic-section-nav a {
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
    .mic-section-nav a:hover,
    .mic-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .mic-scene #mic-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #0c0c10;
      cursor: grab;
    }
    .mic-seg { display: inline-flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
    .mic-seg button {
      font-family: var(--sans); font-size: 13px; padding: 7px 12px;
      border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 8px; cursor: pointer;
    }
    .mic-seg button[aria-pressed="true"] { background: var(--red-bright,#b41f24); color: #fff; border-color: var(--red-bright,#b41f24); }
  </style>
  ${shellHead({
    ns: "mic",
    figureNo: "FIG. 11 / MICROSCOPE",
    titleHTML: "显微镜<br />观察细胞",
    lead: "把玻片放到显微镜下，调大倍数、染色看清细胞核。动手感受「总放大倍数 = 目镜 × 物镜」，以及动植物细胞的差别。",
    heroNote: "切换样本 · 拖动玻片平移 · 调放大倍数 · 染色显示细胞核",
    navLabel: "显微镜章节导航",
    navItems: [
      { id: "mic-intuition", label: "直觉" },
      { id: "mic-define", label: "定义" },
      { id: "mic-lab", label: "互动实验" },
      { id: "mic-limits", label: "边界说明" },
    ],
    firstAnchor: "mic-intuition",
  })}
    <div class="lab-shell" aria-label="显微镜观察细胞交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="mic-canvas" width="600" height="360" aria-label="显微镜视野下的细胞"></canvas>
        <div class="canvas-caption">
          <span>视野为圆形；拖动可平移玻片</span>
          <span id="mic-status">洋葱表皮 · 100× · 未染色</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="mic-seg" role="group" aria-label="样本">
          <button id="mic-sample-onion" type="button" aria-pressed="true">洋葱表皮</button>
          <button id="mic-sample-cheek" type="button" aria-pressed="false">口腔上皮</button>
        </div>
        <label class="control-row" for="mic-mag">
          <span>放大倍数</span>
          <output id="mic-mag-output">100×</output>
        </label>
        <input id="mic-mag" type="range" min="0" max="3" step="1" value="0" />
        <label class="control-row" style="margin-top:8px">
          <span>碘液染色（显细胞核）</span>
          <input id="mic-stain" type="checkbox" style="width:auto" />
        </label>
        <div class="lab-actions">
          <button id="mic-reset" type="button">重置视野</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="mic-intuition" aria-labelledby="mic-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="mic-intuition-title">直觉：细胞长什么样</h2>
        <p>细胞是生物体结构和功能的基本单位，肉眼看不见，要靠显微镜放大。</p>
      </div>
    </div>
    <p>
      在显微镜下，<b>植物细胞</b>（如洋葱内表皮）是一格一格排列的"砖墙"，外面包着<b>细胞壁</b>，里面有个明显的<b>细胞核</b>，
      还有些透亮的大<b>液泡</b>；<b>动物细胞</b>（如人的口腔上皮）形状更不规则，<b>没有细胞壁和液泡</b>，只有细胞膜包着细胞核。
      染色（常用碘液）能让细胞核染上颜色、看得更清楚——这也是为什么生物实验里"染色"几乎是标配。
    </p>
  </section>

  <section class="section-pad" id="mic-define" aria-labelledby="mic-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="mic-define-title">定义：放大倍数与装片</h2>
        <p>总放大倍数 = 目镜倍数 × 物镜倍数。</p>
      </div>
    </div>
    <p>
      显微镜有两级放大：<b>目镜</b>（靠近眼睛）和<b>物镜</b>（靠近标本），总放大倍数 = 目镜倍数 × 物镜倍数。
      本场景物镜取 10× / 40×，目镜固定 10×，于是可得 100× / 400×。倍数越大，看到的细胞<b>个数越少、单个越大</b>。
    </p>
    <p style="margin-top:8px">
      <b>临时装片</b>制作要点：擦→滴（清水或生理盐水）→撕/刮取材料→展平→盖盖玻片（避免气泡）→染（碘液）→吸。
      本场景简化为"选样本 + 染色"两步。
    </p>
  </section>

  <section class="section-pad" id="mic-lab" aria-labelledby="mic-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="mic-lab-title">互动实验</h2>
        <p>对比动植物细胞、体验放大与染色。</p>
      </div>
    </div>
    <p>
      ① 分别选<b>洋葱表皮</b>和<b>口腔上皮</b>，观察细胞壁、液泡的有无；
      ② 勾选<b>碘液染色</b>，看细胞核是否清晰出现；
      ③ 拖动放大倍数滑块，体会"倍数越高、视野越小、细胞越大"；
      ④ 在视野里<b>拖动玻片</b>平移，像真实调标本位置一样。
    </p>
  </section>

  <section class="section-pad" id="mic-limits" aria-labelledby="mic-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="mic-limits-title">这个模型简化了什么</h2>
        <p>真实显微镜与装片有更多细节。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>倒像</span>
        <h3>上下左右相反</h3>
        <p>显微镜成倒立放大的虚像，移动玻片方向与像相反。本场景为直观，未做镜像翻转。</p>
      </article>
      <article>
        <span>分辨率</span>
        <h3>有极限</h3>
        <p>光学显微镜受可见光波长限制，约 0.2 μm，看不到更细结构（需电子显微镜）。</p>
      </article>
      <article>
        <span>立体</span>
        <h3>平面示意</h3>
        <p>细胞是立体的，这里用平面图案示意典型形态，不代表真实三维结构。</p>
      </article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = { sample: "onion", mag: 0, stain: false, panX: 0, panY: 0 };
}

const MAGS = [100, 200, 400]; // 物镜 10/20/40 × 目镜10
const OBJ = [10, 20, 40];

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.height === 360 ? 600 : canvas.width;
  const H = 360;
  const cx = W / 2, cy = H / 2;
  const R = 150; // 视野半径
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0c0c10";
  ctx.fillRect(0, 0, W, H);

  // 视野裁剪
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

  // 背景（视野底色）
  ctx.fillStyle = state.stain ? "#f3ecd0" : "#eef1e6";
  ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);

  const scale = OBJ[state.mag] / 10; // 相对基准的放大
  const cell = 46 * scale; // 细胞基准尺寸
  const spacing = cell * 1.25;

  if (state.sample === "onion") {
    // 砖块状排列，带细胞壁、液泡；染色后细胞核明显
    const startX = cx - R - state.panX;
    const startY = cy - R - state.panY;
    for (let gy = startY; gy < cy + R; gy += spacing) {
      for (let gx = startX; gx < cx + R; gx += spacing) {
        const px = gx, py = gy;
        if (Math.hypot(px - cx, py - cy) > R) continue;
        // 细胞壁
        ctx.strokeStyle = state.stain ? "#b89b3e" : "#9aa886";
        ctx.lineWidth = 2;
        ctx.strokeRect(px - cell / 2, py - cell / 2, cell, cell);
        // 液泡
        ctx.fillStyle = state.stain ? "#e9dcae" : "#dde7cf";
        ctx.beginPath(); ctx.arc(px, py, cell * 0.3, 0, Math.PI * 2); ctx.fill();
        // 细胞核
        if (state.stain) {
          ctx.fillStyle = "#7a5a12";
          ctx.beginPath(); ctx.arc(px + cell * 0.18, py - cell * 0.12, cell * 0.12, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  } else {
    // 口腔上皮：不规则圆/椭圆，无细胞壁；染色后核明显
    const startX = cx - R - state.panX;
    const startY = cy - R - state.panY;
    let seed = 1;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let gy = startY; gy < cy + R; gy += spacing * 0.9) {
      for (let gx = startX; gx < cx + R; gx += spacing * 0.9) {
        const px = gx + (rnd() - 0.5) * cell * 0.4;
        const py = gy + (rnd() - 0.5) * cell * 0.4;
        if (Math.hypot(px - cx, py - cy) > R - cell * 0.3) continue;
        const rw = cell * (0.42 + rnd() * 0.12);
        const rh = cell * (0.38 + rnd() * 0.12);
        ctx.fillStyle = state.stain ? "#e7d3cf" : "#e9e2dc";
        ctx.strokeStyle = "#b7a89f";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(px, py, rw, rh, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (state.stain) {
          ctx.fillStyle = "#8a3a55";
          ctx.beginPath(); ctx.arc(px, py, rw * 0.4, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }
  ctx.restore();

  // 视野圆环
  ctx.strokeStyle = "#3a3a42";
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  // 比例尺
  const barLen = 60;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - R + 16, cy + R - 22); ctx.lineTo(cx - R + 16 + barLen, cy + R - 22); ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "12px var(--sans)";
  ctx.textAlign = "left";
  const um = Math.round(200 / OBJ[state.mag]); // 示意：倍数越高标度越小
  ctx.fillText(`${um} µm`, cx - R + 16, cy + R - 30);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("mic-status");
  if (!el) return;
  const sample = state.sample === "onion" ? "洋葱表皮" : "口腔上皮";
  el.textContent = `${sample} · ${MAGS[state.mag]}× · ${state.stain ? "已染色" : "未染色"}`;
}

function bindSample(id, key, btnOther) {
  const b = document.getElementById(id);
  b.addEventListener("click", () => {
    state.sample = key;
    b.setAttribute("aria-pressed", "true");
    document.getElementById(btnOther).setAttribute("aria-pressed", "false");
    draw();
  });
}

export default {
  id: "microscope",
  name: "显微镜观察细胞",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#mic-canvas");
    ctx = canvas.getContext("2d");
    setup();

    bindSample("mic-sample-onion", "onion", "mic-sample-cheek");
    bindSample("mic-sample-cheek", "cheek", "mic-sample-onion");

    const mag = document.getElementById("mic-mag");
    const magOut = document.getElementById("mic-mag-output");
    mag.addEventListener("input", () => {
      state.mag = Number(mag.value);
      magOut.textContent = MAGS[state.mag] + "×";
      draw();
    });

    const stain = document.getElementById("mic-stain");
    stain.addEventListener("change", () => {
      state.stain = stain.checked;
      draw();
    });

    // 拖动玻片平移
    let dragging = false, lastX = 0, lastY = 0;
    canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      state.panX -= (e.clientX - lastX);
      state.panY -= (e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      draw();
    });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });

    document.getElementById("mic-reset").addEventListener("click", () => {
      state.panX = 0; state.panY = 0;
      draw();
    });

    draw();
  },
  update() { draw(); },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
