// 凸透镜成像场景：拖动物体（或滑块）改变物距 u，实时绘制实像/虚像，
//   显示 倒立/正立、放大/缩小、实像/虚像，并标出 f 与 2f 分界。
// 范式：shellHead 生成骨架 + 自有 lab-shell 写实验 + 自有 section 写讲解。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .lens-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .lens-section-nav a {
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
    .lens-section-nav a:hover,
    .lens-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .lens-scene #lens-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
      cursor: ew-resize;
    }
    .lens-readout {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
    }
    .lens-readout .ro-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 6px;
      font-family: var(--mono, monospace);
      font-size: 12px;
    }
    .lens-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .lens-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .lens-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(24,95,165,0.22); border-color: rgba(24,95,165,0.55); }
  </style>
  ${shellHead({
    ns: "lens",
    figureNo: "FIG. 09 / CONVEX LENS",
    titleHTML: "凸透镜成像<br />照相机·投影仪·放大镜",
    lead: "同一只凸透镜，物体离它远近不同，成的像天差地别：有时倒立缩小，有时正立放大。拖动物体，看规律如何切换。",
    heroNote: "拖动左侧物体改变物距 · 或拖动焦距滑块 · 看实像/虚像如何变化",
    navLabel: "透镜章节导航",
    navItems: [
      { id: "lens-intuition", label: "直觉" },
      { id: "lens-define", label: "定义" },
      { id: "lens-lab", label: "互动实验" },
      { id: "lens-limits", label: "边界说明" },
    ],
    firstAnchor: "lens-intuition",
  })}
    <div class="lab-shell" aria-label="凸透镜成像交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="lens-canvas" width="620" height="340" aria-label="凸透镜成像光路图"></canvas>
        <div class="canvas-caption">
          <span>实线=实际光线，虚线=反向延长线（虚像不能落在屏上）</span>
          <span id="lens-status">物距 u = 240</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="lens-u">
          <span>物距 <i>u</i></span>
          <output id="lens-u-output">240</output>
        </label>
        <input id="lens-u" type="range" min="50" max="430" step="2" value="240" />

        <label class="control-row" for="lens-f">
          <span>焦距 <i>f</i></span>
          <output id="lens-f-output">100</output>
        </label>
        <input id="lens-f" type="range" min="60" max="150" step="2" value="100" />

        <div class="lens-readout" id="lens-readout"></div>

        <div class="lab-actions">
          <button id="lens-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="lens-intuition" aria-labelledby="lens-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="lens-intuition-title">直觉：为什么远小近大还会颠倒</h2>
        <p>凸透镜像一块"会聚光的玻璃砖"，光线穿过后会往中间收拢。</p>
      </div>
    </div>
    <p>
      物体离透镜很远时，收拢后的光线在另一侧交汇成一个<b>倒立、缩小</b>的实像——这就是<b>照相机</b>。
      把物体慢慢拉近，像会越拉越远、越变越大；当物体越过两倍焦距，像跳到透镜另一侧且比物体还大，
      这就是<b>投影仪 / 幻灯机</b>。再靠近到焦距以内，光线不再交汇，只能朝反方向"看出去"一个放大的正立虚像——
      这就是<b>放大镜</b>。一个关键分界：物体恰在<b>焦点</b>上时不成像（平行光出射）。
    </p>
  </section>

  <section class="section-pad" id="lens-define" aria-labelledby="lens-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="lens-define-title">定义：透镜公式与成像规律</h2>
        <p>一条公式贯穿所有情形。</p>
      </div>
    </div>
    <p>凸透镜成像公式：<code>1/u + 1/v = 1/f</code>，其中 <i>u</i> 物距、<i>v</i> 像距、<i>f</i> 焦距（均取正值约定）。由此：</p>
    <p style="margin:8px 0 18px">
      · <b>u &gt; 2f</b>：倒立、缩小、实像（照相机）<br />
      · <b>u = 2f</b>：倒立、等大、实像（v = 2f）<br />
      · <b>f &lt; u &lt; 2f</b>：倒立、放大、实像（投影仪）<br />
      · <b>u = f</b>：不成像（出射平行光）<br />
      · <b>u &lt; f</b>：正立、放大、<b>虚像</b>（放大镜）
    </p>
    <p>放大率 <code>m = |v/u|</code>；虚像的 <i>v</i> 取负，表示像与物体在同侧。</p>
  </section>

  <section class="section-pad" id="lens-lab" aria-labelledby="lens-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="lens-lab-title">互动实验</h2>
        <p>拖动物体或调节滑块，对照读数面板。</p>
      </div>
    </div>
    <p>
      画面里画了两条<b>特殊光线</b>：① 从物顶发出的平行光，经透镜后过<b>另一侧的焦点</b>；
      ② 过<b>光心</b>的光线不偏折。两线交点（或其反向延长线交点）就是像的顶端。
    </p>
    <p style="margin-top:8px">
      建议这样玩：固定 <i>f</i>，把物体从远处慢慢拖近——
      看像如何从"缩小倒立"变成"放大倒立"，再越过分界变成"放大正立"的放大镜。
      注意虚像那一段，反向延长线是虚线，且<b>虚像不能在光屏上承接</b>。
    </p>
  </section>

  <section class="section-pad" id="lens-limits" aria-labelledby="lens-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="lens-limits-title">这个模型简化了什么</h2>
        <p>先说清画面与真实透镜的差距。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>薄透镜</span>
        <h3>忽略厚度</h3>
        <p>本模型用"过光心不偏折、平行光过焦点"的理想薄透镜近似，真实透镜有球差、色差。</p>
      </article>
      <article>
        <span>近轴</span>
        <h3>小角度近似</h3>
        <p>公式只在靠近主轴的光线（近轴）下严格成立；大角度光线会"散焦"，成像变模糊。</p>
      </article>
      <article>
        <span>符号</span>
        <h3>实正虚负</h3>
        <p>本场景把 <i>v</i> 取负表示虚像、同侧；不同教材符号约定可能相反，结论一致。</p>
      </article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = { u: 240, f: 100 };
}

function compute() {
  const { u, f } = state;
  // 实像: v 为正(像在透镜右侧); 虚像: v 为负(像在左侧, 同侧)
  const v = (u * f) / (u - f);
  const m = Math.abs(v / u);
  let kind, orient, size, imageType;
  if (u > 2 * f) { kind = "倒立"; size = "缩小"; imageType = "实像"; }
  else if (Math.abs(u - 2 * f) < 1) { kind = "倒立"; size = "等大"; imageType = "实像"; }
  else if (u > f) { kind = "倒立"; size = "放大"; imageType = "实像"; }
  else { kind = "正立"; size = "放大"; imageType = "虚像"; }
  return { u, f, v, m, kind, orient: kind, size, imageType };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const c = compute();
  const W = canvas.width, H = canvas.height;
  const ax = H / 2; // 主轴 y
  const lensX = 310; // 透镜中心 x
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 主轴
  ctx.strokeStyle = "#c9c2b2";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20, ax); ctx.lineTo(W - 20, ax); ctx.stroke();

  // f / 2f 标记（两侧）
  const f = c.f, u = c.u;
  const marks = [
    { x: lensX - 2 * f, t: "2f" },
    { x: lensX - f, t: "f" },
    { x: lensX + f, t: "f" },
    { x: lensX + 2 * f, t: "2f" },
  ];
  ctx.fillStyle = "#8a8475";
  ctx.font = "11px var(--mono, monospace)";
  ctx.textAlign = "center";
  for (const mk of marks) {
    if (mk.x < 20 || mk.x > W - 20) continue;
    ctx.beginPath(); ctx.moveTo(mk.x, ax - 5); ctx.lineTo(mk.x, ax + 5); ctx.stroke();
    ctx.fillText(mk.t, mk.x, ax + 18);
  }
  ctx.fillStyle = "#185FA5";
  ctx.fillText("透镜", lensX, ax + 34);

  // 透镜本体（双箭头竖线）
  ctx.strokeStyle = "#185FA5";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(lensX, ax - 90); ctx.lineTo(lensX, ax + 90); ctx.stroke();
  ctx.beginPath(); // 箭头
  ctx.moveTo(lensX - 5, ax - 80); ctx.lineTo(lensX, ax - 90); ctx.lineTo(lensX + 5, ax - 80);
  ctx.moveTo(lensX - 5, ax + 80); ctx.lineTo(lensX, ax + 90); ctx.lineTo(lensX + 5, ax + 80);
  ctx.stroke();

  // 物（左侧）
  const objX = lensX - u;
  const ho = 70;
  ctx.strokeStyle = "#b41f24";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(objX, ax); ctx.lineTo(objX, ax - ho); ctx.stroke();
  ctx.fillStyle = "#b41f24";
  ctx.beginPath(); ctx.moveTo(objX, ax - ho); ctx.lineTo(objX - 6, ax - ho + 12); ctx.lineTo(objX + 6, ax - ho + 12); ctx.closePath(); ctx.fill();
  // 物体可拖动手柄
  ctx.fillStyle = "rgba(180,31,36,0.25)";
  ctx.beginPath(); ctx.arc(objX, ax - ho / 2, 12, 0, Math.PI * 2); ctx.fill();

  // 像
  const hi = (c.v / u) * ho; // 负=正立(虚像)
  const imgX = lensX + c.v;
  ctx.strokeStyle = "#3B6D11";
  ctx.lineWidth = 3;
  ctx.setLineDash(c.imageType === "虚像" ? [5, 4] : []);
  ctx.beginPath(); ctx.moveTo(imgX, ax); ctx.lineTo(imgX, ax - hi); ctx.stroke();
  if (c.imageType === "实像") {
    ctx.fillStyle = "#3B6D11";
    ctx.beginPath(); ctx.moveTo(imgX, ax - hi); ctx.lineTo(imgX - 6, ax - hi + 12); ctx.lineTo(imgX + 6, ax - hi + 12); ctx.closePath(); ctx.fill();
  }
  ctx.setLineDash([]);

  // 两条特殊光线（从物顶发出）
  const topY = ax - ho;
  // ① 平行主轴 -> 折射过右侧焦点
  const farFocus = lensX + f;
  ctx.strokeStyle = "#E24B4A";
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(objX, topY); ctx.lineTo(lensX, topY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lensX, topY); ctx.lineTo(farFocus, ax); ctx.stroke(); // 折射后过焦点
  if (c.imageType === "虚像") {
    // 反向延长到左侧与②交
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(lensX, topY); ctx.lineTo(imgX, ax - hi); ctx.stroke();
    ctx.setLineDash([]);
  }
  // ② 过光心不偏折
  ctx.strokeStyle = "#1D9E75";
  ctx.beginPath(); ctx.moveTo(objX, topY); ctx.lineTo(imgX, ax - hi); ctx.stroke();

  // 像标注
  ctx.fillStyle = "#3B6D11";
  ctx.font = "12px var(--sans)";
  ctx.textAlign = "center";
  const labelY = (ax - hi) - 12;
  ctx.fillText(c.imageType === "虚像" ? "虚像" : "实像", imgX, labelY);

  // 读数面板
  updateReadout(c);
}

function updateReadout(c) {
  const el = document.getElementById("lens-readout");
  if (!el) return;
  const rows = [
    ["物距 u", `${Math.round(c.u)}`],
    ["像距 v", c.imageType === "虚像" ? `${Math.round(c.v)} (虚)` : `${Math.round(c.v)}`],
    ["焦距 f", `${c.f}`],
    ["放大率 m", c.m.toFixed(2)],
  ];
  const verdict = `成像：${c.kind} · ${c.size} · ${c.imageType}`;
  el.innerHTML =
    rows.map((r) => `<div class="ro-item"><span>${r[0]}</span><span>${r[1]}</span></div>`).join("") +
    `<div class="ro-item verdict"><span>${verdict}</span></div>`;
  const status = document.getElementById("lens-status");
  if (status) status.textContent = `物距 u = ${Math.round(c.u)} · ${verdict}`;
}

function objXFromU(u) { return 310 - u; }

export default {
  id: "convex-lens",
  name: "凸透镜成像",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#lens-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const u = document.getElementById("lens-u");
    const uOut = document.getElementById("lens-u-output");
    const f = document.getElementById("lens-f");
    const fOut = document.getElementById("lens-f-output");

    u.addEventListener("input", () => {
      state.u = Number(u.value);
      uOut.textContent = state.u;
      draw();
    });
    f.addEventListener("input", () => {
      state.f = Number(f.value);
      fOut.textContent = state.f;
      draw();
    });

    // 拖动物体改变物距
    let dragging = false;
    const setFromEvent = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const px = (e.clientX - rect.left) * scaleX;
      let nu = 310 - px;
      nu = Math.max(50, Math.min(430, nu));
      state.u = nu;
      u.value = String(Math.round(nu));
      uOut.textContent = Math.round(nu);
      draw();
    };
    canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); setFromEvent(e); });
    canvas.addEventListener("pointermove", (e) => { if (dragging) setFromEvent(e); });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });

    document.getElementById("lens-reset").addEventListener("click", () => {
      state.u = 240; state.f = 100;
      u.value = "240"; uOut.textContent = "240";
      f.value = "100"; fOut.textContent = "100";
      draw();
    });

    draw();
  },
  update() { draw(); },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
