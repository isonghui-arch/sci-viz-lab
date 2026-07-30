// 酶的特性（生物 · 酶）
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ez-section-nav { max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--rule); }
    .ez-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-size: 13px;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted);
      border-bottom: 2px solid transparent; }
    .ez-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ez-scene #ez-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "ez",
    figureNo: "FIG. 生物 / 酶的特性",
    titleHTML: "酶的特性<br />高效·专一·怕极端",
    lead: "酶是生物催化剂：专一地催化一种反应，高效的很，却怕高温和过酸过碱。调温度和酸碱度，看反应速率怎么变。",
    heroNote: "调温度与 pH · 看活性钟形曲线 · 反应池里底物转化快慢",
    navLabel: "章节导航",
    navItems: [
      { id: "ez-intuition", label: "直觉" },
      { id: "ez-def", label: "定义" },
      { id: "ez-exp", label: "互动实验" },
      { id: "ez-limit", label: "边界" },
    ],
    firstAnchor: "ez-intuition",
  })}
    <div class="lab-shell" aria-label="酶的特性交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ez-canvas" width="640" height="360" aria-label="温度与pH对酶活性的影响"></canvas>
        <div class="canvas-caption">
          <span>上方为温度、pH 活性曲线 · 下方反应池显示底物转化快慢</span>
          <span id="ez-readout">活性 100%</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="ez-temp"><span>温度</span><output id="ez-temp-o">37 ℃</output></label>
        <input id="ez-temp" type="range" min="0" max="90" step="1" value="37" />
        <label class="control-row" for="ez-ph"><span>pH</span><output id="ez-ph-o">7.0</output></label>
        <input id="ez-ph" type="range" min="0" max="14" step="0.5" value="7" />
        <div class="ez-readout" id="ez-readout-grid"></div>
        <div class="lab-actions">
          <button id="ez-reset" type="button">重置反应池</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ez-intuition" aria-labelledby="ez-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ez-intuition-t">为什么发烧会没胃口</h2>
      <p>体温一高，消化变慢——因为消化靠的酶"罢工"了。</p></div>
    </div>
    <p>酶是细胞里的<b>生物催化剂</b>，能把反应速率提得极高，而且一种酶通常只管一种反应（专一）。但它很娇气：温度太高会变性、酸碱不合适也会失活。所以身体要把体温、酸碱都维持在一个窄范围。</p>
  </section>

  <section class="section-pad" id="ez-def" aria-labelledby="ez-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ez-def-t">定义：酶的三大特性</h2>
      <p>高效性、专一性、作用条件温和。</p></div>
    </div>
    <ul>
      <li><b>高效性</b>：催化效率远高于无机催化剂。</li>
      <li><b>专一性</b>：一种酶只催化一种或一类反应（锁钥/诱导契合）。</li>
      <li><b>作用条件温和</b>：需要适宜的温度和 pH；<b>最适温度约 37℃</b>、最适 pH 多接近中性；高温或强酸强碱会<b>变性失活</b>。</li>
    </ul>
  </section>

  <section class="section-pad" id="ez-exp" aria-labelledby="ez-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ez-exp-t">亲自验证</h2>
      <p>把温度从 37℃ 拉到 80℃，看活性曲线跳水、下方反应池里底物几乎不再转化——酶变性了。</p></div>
    </div>
    <p>再把 pH 拉到 2 或 12，同样失活。只有温度与 pH 都处在各自钟形曲线的"高峰"附近，反应才最快。下方反应池里，<b>蓝色底物</b>转化成<b>绿色产物</b>的快慢，正比于当前活性。</p>
  </section>

  <section class="section-pad" id="ez-limit" aria-labelledby="ez-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ez-limit-t">边界与说明</h2>
      <p>模型用典型近似，真实酶各不相同。</p></div>
    </div>
    <p>不同酶最适温度、最适 pH 差异很大（如胃蛋白酶最适 pH≈1.5、唾液淀粉酶≈7）。本演示取"一般细胞内酶"的典型：最适 37℃、pH≈7。高温导致的变性是<b>不可逆</b>的，这里为方便演示成瞬时活性曲线，未表现不可逆过程。活性数值为相对值，用于体现"钟形"规律而非绝对速率。</p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const state = { temp: 37, ph: 7, subs: [] };

function tempAct(T) { return T >= 65 ? 0 : Math.exp(-Math.pow((T - 37) / 16, 2)); }
function phAct(p) { return Math.exp(-Math.pow((p - 7) / 2.6, 2)); }
function act() { return tempAct(state.temp) * phAct(state.ph); }

function statusText() {
  if (state.temp >= 65) return "高温变性失活";
  if (state.ph <= 3 || state.ph >= 11) return "过酸 / 过碱失活";
  if (state.temp <= 10) return "低温抑制（活性低）";
  return "适宜（活性 " + Math.round(act() * 100) + "%）";
}

function initSubs() {
  state.subs = [];
  for (let i = 0; i < 16; i++) {
    state.subs.push({
      x: 80 + Math.random() * 480, y: 205 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60,
      converted: false,
    });
  }
}

function drawCurve(c, x0, y0, w, h, fn, label, val, valMax) {
  c.strokeStyle = "#07182d"; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
  c.fillStyle = "#07182d"; c.font = "12px var(--sans)"; c.textAlign = "center";
  c.fillText(label, x0 + w / 2, y0 - 8);
  // 曲线
  c.strokeStyle = "#185FA5"; c.lineWidth = 2; c.beginPath();
  for (let i = 0; i <= 40; i++) {
    const t = i / 40; const px = x0 + w * t; const py = y0 + h - h * Math.min(1, fn(t * valMax));
    if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  c.stroke();
  // 当前点
  const cx = x0 + w * (val / valMax);
  const cy = y0 + h - h * Math.min(1, fn(val));
  c.fillStyle = "#B41F24"; c.beginPath(); c.arc(cx, cy, 4, 0, Math.PI * 2); c.fill();
}

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, w, h);

  // 温度曲线（最适37，范围0-90）
  drawCurve(ctx, 50, 40, 240, 115, tempAct, "温度 — 活性", state.temp, 90);
  ctx.fillStyle = "#07182d"; ctx.font = "10px var(--mono, monospace)"; ctx.textAlign = "left";
  ctx.fillText("0℃", 50, 162); ctx.fillText("90℃", 270, 162); ctx.fillText("37℃最适", 150, 55);
  // pH 曲线（最适7，范围0-14）
  drawCurve(ctx, 350, 40, 240, 115, phAct, "pH — 活性", state.ph, 14);
  ctx.fillText("0", 350, 162); ctx.fillText("14", 570, 162); ctx.fillText("pH7最适", 450, 55);

  // 反应池
  const py0 = 185, ph0 = 50, pw = 540, phh = 160;
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 1.5; ctx.strokeRect(ph0, py0, pw, phh);
  ctx.fillStyle = "#07182d"; ctx.textAlign = "left"; ctx.fillText("反应池（蓝=底物，绿=产物）", ph0 + 6, py0 + 16);

  // 酶（中央，带活性中心缺口）
  const ex = 320, ey = py0 + phh / 2 + 8;
  const alive = act() > 0.02;
  ctx.fillStyle = alive ? "rgba(180,31,36,0.85)" : "rgba(150,150,150,0.85)";
  ctx.beginPath(); ctx.arc(ex, ey, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f3efe5";
  ctx.beginPath(); ctx.arc(ex + 12, ey - 8, 8, 0, Math.PI * 2); ctx.fill(); // 活性中心缺口
  ctx.fillStyle = "#07182d"; ctx.font = "10px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText(alive ? "酶（活性）" : "酶（变性）", ex, ey + 44);

  // 底物/产物
  for (const s of state.subs) {
    ctx.fillStyle = s.converted ? "#2E7D4F" : "#185FA5";
    ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI * 2); ctx.fill();
  }

  const ro = document.getElementById("ez-readout");
  if (ro) ro.textContent = "活性 " + Math.round(act() * 100) + "% · " + statusText();
  updateGrid();
}

function updateGrid() {
  const el = document.getElementById("ez-readout-grid");
  if (el) el.innerHTML =
    `<div class="ro-item"><span>温度</span><span>${state.temp} ℃</span></div>` +
    `<div class="ro-item"><span>pH</span><span>${state.ph.toFixed(1)}</span></div>` +
    `<div class="ro-item"><span>相对活性</span><span>${Math.round(act() * 100)}%</span></div>` +
    `<div class="ro-item verdict"><span>${statusText()}</span></div>`;
}

export default {
  id: "enzyme",
  name: "酶的特性",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ez-canvas");
    ctx = canvas.getContext("2d");
    const temp = container.querySelector("#ez-temp");
    const ph = container.querySelector("#ez-ph");
    const tempO = container.querySelector("#ez-temp-o");
    const phO = container.querySelector("#ez-ph-o");
    const sync = () => {
      state.temp = Number(temp.value); state.ph = Number(ph.value);
      tempO.textContent = state.temp + " ℃"; phO.textContent = state.ph.toFixed(1);
    };
    temp.addEventListener("input", sync);
    ph.addEventListener("input", sync);
    container.querySelector("#ez-reset").addEventListener("click", initSubs);
    initSubs();
    sync();
    draw();
  },
  update({ delta = 0.016 }) {
    const a = act();
    for (const s of state.subs) {
      s.x += s.vx * delta; s.y += s.vy * delta;
      if (s.x < 56 || s.x > 584) s.vx *= -1;
      if (s.y < 192 || s.y > 340) s.vy *= -1;
      s.x = Math.max(56, Math.min(584, s.x)); s.y = Math.max(192, Math.min(340, s.y));
      if (!s.converted && Math.random() < a * 0.05) s.converted = true;
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};