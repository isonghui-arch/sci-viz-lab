// 光的反射场景：镜面上一束光以入射角 i 射入，按反射定律反射，反射角 r = i。
//   拖动手柄改变入射角，实时显示 i 与 r，并标注法线。
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
    .rf-scene #rf-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; cursor: crosshair; }
    .rf-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .rf-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .rf-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .rf-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .rf-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(24,95,165,0.22); border-color: rgba(24,95,165,0.55); }
  </style>
  ${shellHead({
    ns: "rf",
    figureNo: "FIG. 12 / REFLECTION",
    titleHTML: "光的反射<br />镜子为何不“吸收”光",
    lead: "光碰到平滑镜面会“弹”回去，而且弹出的角度严格等于射入的角度。拖动光源，看规律如何成立。",
    heroNote: "拖动光源改变入射角 · 或调节滑块 · 看反射角始终等于入射角",
    navLabel: "反射章节导航",
    navItems: [
      { id: "rf-intuition", label: "直觉" },
      { id: "rf-define", label: "定义" },
      { id: "rf-lab", label: "互动实验" },
      { id: "rf-limits", label: "边界说明" },
    ],
    firstAnchor: "rf-intuition",
  })}
    <div class="lab-shell" aria-label="光的反射交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="rf-canvas" width="620" height="380" aria-label="光的反射光路图"></canvas>
        <div class="canvas-caption">
          <span>灰虚线 = 法线（垂直镜面）；入射角 = 反射角</span>
          <span id="rf-status">i = r = 40°</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="rf-angle"><span>入射角 i (°)</span><output id="rf-angle-output">40</output></label>
        <input id="rf-angle" type="range" min="0" max="85" step="1" value="40" />
        <div class="rf-readout" id="rf-readout"></div>
        <div class="lab-actions">
          <button id="rf-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="rf-intuition" aria-labelledby="rf-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="rf-intuition-title">直觉：为什么镜子能成像</h2>
      <p>光不是消失，而是被"弹"了回来。</p></div>
    </div>
    <p>
      光在均匀介质里沿直线传播，碰到光滑表面（如镜子）几乎不被吸收，而是按一个简单规则弹回：
      <b>入射角等于反射角</b>。无数这样的反射光线进入眼睛，大脑就"以为"镜子后面有个对称的像。
      粗糙墙面把光朝四面八方弹（漫反射），所以看不到清晰像，却能照亮整个房间。
    </p>
  </section>

  <section class="section-pad" id="rf-define" aria-labelledby="rf-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="rf-define-title">定义：反射定律</h2>
      <p>三条，一条都不能少。</p></div>
    </div>
    <p>
      ① 反射光线、入射光线与<b>法线</b>（垂直镜面的线）在同一平面；<br />
      ② 反射光线与入射光线分居法线两侧；<br />
      ③ <code>反射角 r = 入射角 i</code>。
    </p>
    <p style="margin-top:12px">入射角是"入射光线与法线的夹角"、反射角是"反射光线与法线的夹角"，都从法线量起，不是从镜面量起。</p>
  </section>

  <section class="section-pad" id="rf-lab" aria-labelledby="rf-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="rf-lab-title">互动实验</h2>
      <p>把光"斜着打"和"垂直打"各试一次。</p></div>
    </div>
    <p>
      拖动红点光源改变入射角，观察绿线（反射光）如何对称地改变——无论 i 是 10° 还是 80°，始终 r = i。
      当 i = 0°（垂直入射）时，光原路返回。读数面板实时显示 i 与 r，验证反射定律。
    </p>
  </section>

  <section class="section-pad" id="rf-limits" aria-labelledby="rf-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="rf-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>镜面</span><h3>理想光滑</h3><p>本模型用完全光滑镜面（镜面反射）；真实表面多少有粗糙，会混入漫反射。</p></article>
      <article><span>强度</span><h3>忽略损耗</h3><p>模型假设反射光强不变；真实镜面有少量吸收与透射损失。</p></article>
      <article><span>偏振</span><h3>未涉及</h3><p>特定角度（布儒斯特角）反射光会偏振，本演示不涉及。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() { state = { i: 40 }; }

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  const mirrorY = H / 2 + 30;
  const mx = W / 2;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 镜面（蓝实线）
  ctx.strokeStyle = "#185FA5";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(60, mirrorY); ctx.lineTo(W - 60, mirrorY); ctx.stroke();
  ctx.fillStyle = "#185FA5";
  ctx.font = "12px var(--sans)";
  ctx.textAlign = "left";
  ctx.fillText("镜面", 60, mirrorY + 20);

  // 法线（灰虚线，垂直镜面）
  ctx.strokeStyle = "#8a8475";
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(mx, mirrorY - 130); ctx.lineTo(mx, mirrorY + 130); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8a8475";
  ctx.textAlign = "center";
  ctx.fillText("法线", mx + 26, mirrorY - 110);

  // 入射点 = (mx, mirrorY)
  const iRad = (state.i * Math.PI) / 180;
  const L = 150;
  // 入射光：从上方一侧射向镜面（与法线夹角 i）
  const inX = mx - Math.sin(iRad) * L;
  const inY = mirrorY - Math.cos(iRad) * L;
  // 反射光：对称到另一侧
  const reX = mx + Math.sin(iRad) * L;
  const reY = mirrorY - Math.cos(iRad) * L;

  // 入射光线（红）
  ctx.strokeStyle = "#b41f24";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(inX, inY); ctx.lineTo(mx, mirrorY); ctx.stroke();
  // 反射光线（绿）
  ctx.strokeStyle = "#1D9E75";
  ctx.beginPath(); ctx.moveTo(mx, mirrorY); ctx.lineTo(reX, reY); ctx.stroke();

  // 光源手柄（红点）
  ctx.fillStyle = "#b41f24";
  ctx.beginPath(); ctx.arc(inX, inY, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "11px var(--sans)";
  ctx.fillText("光源", inX - 16, inY - 10);

  // 角度弧
  ctx.strokeStyle = "#8a8475";
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(mx, mirrorY, 34, -Math.PI / 2, -Math.PI / 2 - iRad, false); ctx.stroke();
  ctx.beginPath(); ctx.arc(mx, mirrorY, 34, -Math.PI / 2, -Math.PI / 2 + iRad, true); ctx.stroke();
  ctx.fillStyle = "#07182d";
  ctx.fillText("i", mx - 44, mirrorY - 30);
  ctx.fillText("r", mx + 44, mirrorY - 30);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("rf-readout");
  if (!el) return;
  el.innerHTML =
    `<div class="ro-item"><span>入射角 i</span><span>${state.i}°</span></div>` +
    `<div class="ro-item"><span>反射角 r</span><span>${state.i}°</span></div>` +
    `<div class="ro-item verdict"><span>反射定律：i = r 成立</span></div>`;
  const status = document.getElementById("rf-status");
  if (status) status.textContent = `i = r = ${state.i}°`;
}

export default {
  id: "light-reflection",
  name: "光的反射",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#rf-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const slider = document.getElementById("rf-angle");
    const out = document.getElementById("rf-angle-output");
    slider.addEventListener("input", () => {
      state.i = Number(slider.value);
      out.textContent = state.i;
      draw();
    });

    // 拖动手柄改变入射角
    let dragging = false;
    const setFromEvent = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;
      const mx = canvas.width / 2, mirrorY = canvas.height / 2 + 30;
      const dx = px - mx, dy = mirrorY - py; // 入射端在上方
      let ang = Math.atan2(Math.abs(dx), Math.max(1, dy)) * 180 / Math.PI;
      ang = Math.max(0, Math.min(85, Math.round(ang)));
      state.i = ang;
      slider.value = String(ang);
      out.textContent = ang;
      draw();
    };
    canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); setFromEvent(e); });
    canvas.addEventListener("pointermove", (e) => { if (dragging) setFromEvent(e); });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });

    document.getElementById("rf-reset").addEventListener("click", () => {
      state.i = 40; slider.value = "40"; out.textContent = "40"; draw();
    });
    draw();
  },
  update() {},
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
