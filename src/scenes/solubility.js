// 溶解度曲线（化学 · 九上 溶液）
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .sl-section-nav { max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--rule); }
    .sl-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-size: 13px;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted);
      border-bottom: 2px solid transparent; }
    .sl-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .sl-scene #sl-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "sl",
    figureNo: "FIG. 化学 / 溶解度曲线",
    titleHTML: "溶解度曲线<br />温度如何改变溶解",
    lead: "同样是固体溶于水，硝酸钾随温度升高猛涨，氯化钠几乎不动，氢氧化钙反而下降。拖动温度，看曲线说什么。",
    heroNote: "选物质 · 拖动温度查溶解度 · 降温析晶演示",
    navLabel: "章节导航",
    navItems: [
      { id: "sl-intuition", label: "直觉" },
      { id: "sl-def", label: "定义" },
      { id: "sl-exp", label: "互动实验" },
      { id: "sl-limit", label: "边界" },
    ],
    firstAnchor: "sl-intuition",
  })}
    <div class="lab-shell" aria-label="溶解度曲线交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="sl-canvas" width="640" height="360" aria-label="温度-溶解度曲线图"></canvas>
        <div class="canvas-caption">
          <span>纵轴：溶解度 g/100g 水 · 横轴：温度 ℃</span>
          <span id="sl-readout">硝酸钾 · 60℃ · 溶解度 110 g</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row">物质</label>
        <div class="seg" role="group" aria-label="物质">
          <button class="seg-btn is-active" data-sub="KNO3" type="button">硝酸钾</button>
          <button class="seg-btn" data-sub="NaCl" type="button">氯化钠</button>
          <button class="seg-btn" data-sub="CaOH2" type="button">氢氧化钙</button>
        </div>
        <label class="control-row" for="sl-temp"><span>温度</span><output id="sl-temp-o">60 ℃</output></label>
        <input id="sl-temp" type="range" min="0" max="100" step="1" value="60" />
        <div class="lab-actions">
          <button id="sl-cool" class="accent-button" type="button">降温析晶演示</button>
          <button id="sl-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="sl-intuition" aria-labelledby="sl-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="sl-intuition-t">糖在热水里溶得更多</h2>
      <p>冲糖水时都知道用热水，凉了反而"化不开"。</p></div>
    </div>
    <p>这说明固体能溶解的最大量（<b>溶解度</b>）和温度有关，但不同物质"脾气"完全不同：有的怕冷（升温猛溶），有的怕热（升温反而溶得少）。把这些点连成线，就是溶解度曲线。</p>
  </section>

  <section class="section-pad" id="sl-def" aria-labelledby="sl-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="sl-def-t">定义：三类曲线的形状</h2>
      <p>溶解度随温度变化，分三种典型。</p></div>
    </div>
    <ul>
      <li><b>陡升型</b>（硝酸钾 KNO₃）：温度↑溶解度大幅↑→ 用<b>降温结晶</b>提纯。</li>
      <li><b>平缓型</b>（氯化钠 NaCl）：温度影响很小→ 用蒸发结晶。</li>
      <li><b>下降型</b>（氢氧化钙 Ca(OH)₂）：温度↑溶解度反而↓→ 升温溶解度减小。</li>
    </ul>
  </section>

  <section class="section-pad" id="sl-exp" aria-labelledby="sl-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="sl-exp-t">亲自验证</h2>
      <p>选硝酸钾、把温度从 60℃ 拉到 100℃，看溶解度从 110 g 跳到 246 g。</p></div>
    </div>
    <p>点「降温析晶演示」：硝酸钾从高温饱和溶液降温，会析出大量晶体；而若选氢氧化钙，降温反而让它溶得更"满"——因为对它来说温度越低溶解度越大。对比这两种，就记住了"陡升用降温结晶、下降型反着来"。</p>
  </section>

  <section class="section-pad" id="sl-limit" aria-labelledby="sl-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="sl-limit-t">边界与说明</h2>
      <p>演示用典型近似值，真实数值略有出入。</p></div>
    </div>
    <p>溶解度定义为"某温度下 100 g 溶剂里达到饱和时溶解的溶质克数"，单位是 g/100g 水（气体溶质常用体积）。本图曲线取自常用近似数据，用于建立"形状—提纯方法"的对应关系；实际实验受纯度、搅拌等影响。氢氧化钙溶解度极小（约 0.1–0.2 g），纵轴在本场景对其单独缩放以便观察。</p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const DATA = {
  KNO3: [[0, 13], [20, 32], [40, 64], [60, 110], [80, 169], [100, 246]],
  NaCl: [[0, 35.7], [20, 36], [40, 36.6], [60, 37.3], [80, 38.4], [100, 39.8]],
  CaOH2: [[0, 0.185], [20, 0.165], [40, 0.141], [60, 0.121], [80, 0.094], [100, 0.077]],
};
const SUB_NAME = { KNO3: "硝酸钾", NaCl: "氯化钠", CaOH2: "氢氧化钙" };
const SUB_COLOR = { KNO3: "#B41F24", NaCl: "#185FA5", CaOH2: "#0E7490" };

function interp(pts, t) {
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (t >= x0 && t <= x1) { const f = (t - x0) / (x1 - x0); return y0 + (y1 - y0) * f; }
  }
  return pts[pts.length - 1][1];
}

const state = { sub: "KNO3", temp: 60, cooling: false, coolFrom: 60, coolTimer: 0, precip: 0, dissolve: 0 };

function yMax() { return state.sub === "CaOH2" ? 0.25 : 260; }

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, w, h);
  const ox = 70, oy = h - 50, gw = w - ox - 30, gh = oy - 30;
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(ox, 30); ctx.lineTo(ox, oy); ctx.lineTo(w - 20, oy); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "11px var(--mono, monospace)"; ctx.textAlign = "center";
  for (let t = 0; t <= 100; t += 20) ctx.fillText(String(t), ox + gw * t / 100, oy + 16);
  ctx.textAlign = "right";
  const ym = yMax();
  for (let k = 0; k <= 4; k++) {
    const yv = ym * k / 4, y = oy - gh * yv / ym;
    ctx.fillText(yv.toFixed(ym <= 1 ? 2 : 0), ox - 6, y + 4);
  }
  ctx.textAlign = "center"; ctx.fillText("温度 ℃", ox + gw / 2, h - 12);
  ctx.save(); ctx.translate(18, oy - gh / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText("溶解度 g/100g水", 0, 0); ctx.restore();
  const pts = DATA[state.sub];
  ctx.strokeStyle = SUB_COLOR[state.sub]; ctx.lineWidth = 3; ctx.beginPath();
  for (let t = 0; t <= 100; t += 2) {
    const x = ox + gw * t / 100, y = oy - gh * interp(pts, t) / ym;
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  const cx = ox + gw * state.temp / 100, cy = oy - gh * interp(pts, state.temp) / ym;
  ctx.fillStyle = "#07182d"; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
  // 析晶示意烧杯（右下）
  drawBeaker(ctx, w - 150, h - 150, 120, 110);
  updateReadout();
}

function drawBeaker(c, x, y, bw, bh) {
  c.strokeStyle = "#07182d"; c.lineWidth = 2; c.strokeRect(x, y, bw, bh);
  c.fillStyle = "rgba(24,95,165,0.18)"; c.fillRect(x, y + 14, bw, bh - 14);
  c.fillStyle = "#07182d"; c.font = "11px var(--sans)"; c.textAlign = "center";
  c.fillText("饱和溶液", x + bw / 2, y - 6);
  // 晶体
  const n = Math.round(state.precip * 16);
  c.fillStyle = "#B41F24";
  for (let i = 0; i < n; i++) {
    const rx = x + 12 + ((i * 37) % (bw - 24));
    const ry = y + bh - 14 - ((i * 23) % (bh - 30));
    c.fillRect(rx, ry, 7, 7);
  }
  if (state.dissolve > 0) {
    c.fillStyle = "#0E7490"; c.font = "12px var(--sans)";
    c.fillText("升温才结晶·降温溶解增多", x + bw / 2, y + bh + 16);
  }
}

function updateReadout() {
  const el = document.getElementById("sl-temp-o");
  const ro = document.getElementById("sl-readout");
  if (el) el.textContent = state.temp + " ℃";
  if (ro) {
    const s = interp(DATA[state.sub], state.temp);
    ro.textContent = `${SUB_NAME[state.sub]} · ${state.temp}℃ · 溶解度 ${s.toFixed(state.sub === "CaOH2" ? 3 : 0)} g`;
  }
}

export default {
  id: "solubility",
  name: "溶解度曲线",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#sl-canvas");
    ctx = canvas.getContext("2d");
    const temp = container.querySelector("#sl-temp");
    temp.addEventListener("input", () => {
      state.temp = Number(temp.value);
      state.cooling = false; state.precip = 0; state.dissolve = 0;
    });
    container.querySelectorAll(".seg-btn").forEach((b) => {
      b.addEventListener("click", () => {
        container.querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
        state.sub = b.dataset.sub;
        state.cooling = false; state.precip = 0; state.dissolve = 0;
      });
    });
    container.querySelector("#sl-cool").addEventListener("click", () => {
      state.cooling = true; state.coolFrom = state.temp; state.coolTimer = 0; state.precip = 0; state.dissolve = 0;
    });
    container.querySelector("#sl-reset").addEventListener("click", () => {
      state.temp = 60; temp.value = "60"; state.cooling = false; state.precip = 0; state.dissolve = 0;
      container.querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("is-active"));
      container.querySelector('[data-sub="KNO3"]').classList.add("is-active");
      state.sub = "KNO3";
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (state.cooling) {
      state.coolTimer += delta;
      const frac = Math.min(1, state.coolTimer / 2.5);
      state.temp = Math.round(state.coolFrom * (1 - frac));
      const sFrom = interp(DATA[state.sub], state.coolFrom);
      const sNow = interp(DATA[state.sub], state.temp);
      const out = sFrom - sNow;
      state.precip = state.sub === "KNO3" ? Math.max(0, Math.min(1, out / 200)) : 0;
      state.dissolve = state.sub === "CaOH2" ? Math.max(0, Math.min(1, -out / 0.15)) : 0;
      if (frac >= 1) state.cooling = false;
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};