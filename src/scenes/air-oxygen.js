// 空气与氧气（化学 · 九上）：红磷燃烧测定氧气含量
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ao-section-nav { max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--rule); }
    .ao-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-size: 13px;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted);
      border-bottom: 2px solid transparent; }
    .ao-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ao-scene #ao-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "ao",
    figureNo: "FIG. 化学 / 空气与氧气",
    titleHTML: "空气的成分<br />红磷燃烧测氧气",
    lead: "把集气瓶里的氧气烧掉，冷却后打开止水夹，水会倒吸进瓶子——吸进去的多少，就是氧气占空气的比例。",
    heroNote: "点击「开始实验」自动演示：燃烧 → 冷却 → 倒吸",
    navLabel: "章节导航",
    navItems: [
      { id: "ao-intuition", label: "直觉" },
      { id: "ao-def", label: "原理" },
      { id: "ao-exp", label: "互动实验" },
      { id: "ao-limit", label: "边界" },
    ],
    firstAnchor: "ao-intuition",
  })}
    <div class="lab-shell" aria-label="空气与氧气交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ao-canvas" width="640" height="340" aria-label="红磷燃烧测定空气成分装置图"></canvas>
        <div class="canvas-caption">
          <span>集气瓶内空气：红磷燃烧耗尽氧气，冷却后水倒吸入约 1/5</span>
          <span id="ao-stage">待开始</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验控制</h2>
        <div class="ao-readout" id="ao-readout"></div>
        <div class="lab-actions">
          <button id="ao-start" class="accent-button" type="button">开始实验</button>
          <button id="ao-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ao-intuition" aria-labelledby="ao-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ao-intuition-t">空气不是"空"的</h2>
      <p>我们每时每刻都在呼吸，但空气里到底有什么？</p></div>
    </div>
    <p>空气是混合物：约 <b>78% 氮气、21% 氧气</b>，还有少量二氧化碳和稀有气体。想知道氧气占多少，有个巧妙办法——把氧气"吃掉"，看剩下的空间少了多少。</p>
  </section>

  <section class="section-pad" id="ao-def" aria-labelledby="ao-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ao-def-t">原理：用红磷"吃掉"氧气</h2>
      <p>红磷在空气中点燃，只与氧气反应，生成固体五氧化二磷。</p></div>
    </div>
    <ul>
      <li>红磷燃烧：<b>4P + 5O₂ → 2P₂O₅</b>（产物是固体，不留气体）。</li>
      <li>氧气被耗尽后，集气瓶内气压降低；冷却到室温再打开止水夹，外界水压着把水"推"进瓶内。</li>
      <li>进入瓶内的水体积 ≈ 被消耗的氧气体积，约为瓶内空气总体积的 <b>1/5</b>。</li>
    </ul>
  </section>

  <section class="section-pad" id="ao-exp" aria-labelledby="ao-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ao-exp-t">互动实验</h2>
      <p>点击「开始实验」，观察三个阶段。</p></div>
    </div>
    <p><b>① 燃烧</b>：红磷发光、冒白烟，氧气被消耗。<b>② 冷却</b>：白烟消散、瓶内降温（必须等冷却，否则热气膨胀、测得偏小）。<b>③ 倒吸</b>：打开止水夹，水进入瓶内直到约占 1/5——这就是氧气的体积分数。</p>
  </section>

  <section class="section-pad" id="ao-limit" aria-labelledby="ao-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ao-limit-t">边界与误差</h2>
      <p>真实实验中结果常略小于 1/5，原因有这些。</p></div>
    </div>
    <ul>
      <li>装置气密性不好 → 外部空气漏入，测得偏小。</li>
      <li>没等冷却到室温就打开止水夹 → 瓶内气体热胀，测得偏小。</li>
      <li>红磷量不足，没把氧气耗尽 → 测得偏小。</li>
      <li>选红磷的原因：它只与氧气反应且产物为固体；若用木炭（生成 CO₂ 气体）则水不会倒吸。</li>
    </ul>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const state = { stage: 0, timer: 0, water: 0, smoke: [] };
const DUR = { burn: 1.6, cool: 1.4, suck: 1.6 };
const STAGE_NAME = ["待开始", "① 燃烧中", "② 冷却中", "③ 倒吸中", "完成：水进入约 1/5"];

function aoStart() { state.stage = 1; state.timer = 0; state.water = 0; state.smoke = []; }
function aoReset() { state.stage = 0; state.timer = 0; state.water = 0; state.smoke = []; }

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, w, h);

  // 几何
  const bx = 400, by = 70, bw = 135, bh = 180; // 集气瓶
  const bBottom = by + bh;                      // 250
  const cupX = 165, cupY = 200, cupW = 130, cupH = 95; // 烧杯
  const waterLineCup = cupY + 18;               // 烧杯初始液面

  // 烧杯水
  ctx.fillStyle = "rgba(24,95,165,0.25)";
  ctx.fillRect(cupX, waterLineCup, cupW, cupY + cupH - waterLineCup);
  ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 2;
  ctx.strokeRect(cupX, cupY, cupW, cupH);

  // 导管：瓶底 → 下 → 左 → 烧杯液面下
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx, bBottom);
  ctx.lineTo(bx, bBottom + 18);
  ctx.lineTo(cupX + cupW * 0.5, bBottom + 18);
  ctx.lineTo(cupX + cupW * 0.5, waterLineCup + 8);
  ctx.stroke();

  // 集气瓶轮廓
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2.5;
  ctx.strokeRect(bx, by, bw, bh);

  // 瓶内空气（淡）
  ctx.fillStyle = "rgba(140,130,110,0.08)";
  ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);

  // 瓶内倒吸水面（从底向上 state.water*bh）
  if (state.water > 0) {
    const wt = bBottom - state.water * bh;
    ctx.fillStyle = "rgba(24,95,165,0.45)";
    ctx.fillRect(bx + 2, wt, bw - 4, bBottom - wt);
  }

  // 1/5 刻度线
  const y15 = bBottom - 0.2 * bh;
  ctx.strokeStyle = "#B41F24"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(bx, y15); ctx.lineTo(bx + bw, y15); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#B41F24"; ctx.font = "11px var(--mono, monospace)"; ctx.textAlign = "left";
  ctx.fillText("1/5", bx + bw + 6, y15 + 4);

  // 红磷 + 燃烧
  const px = bx + bw * 0.5, py = bBottom - 14;
  if (state.stage === 1) {
    const glow = 18 + Math.sin(state.timer * 20) * 4;
    ctx.fillStyle = "rgba(255,170,40,0.5)";
    ctx.beginPath(); ctx.arc(px, py, glow + 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff8c1a";
    ctx.beginPath(); ctx.arc(px, py, glow, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#7a3b2e";
  ctx.fillRect(px - 9, py - 4, 18, 10);

  // 烟
  for (const s of state.smoke) {
    ctx.fillStyle = "rgba(230,225,215," + s.a.toFixed(2) + ")";
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }

  // 标注
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("集气瓶", bx + bw / 2, by - 10);
  ctx.fillText("烧杯（水）", cupX + cupW / 2, cupY - 10);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("ao-readout");
  const st = document.getElementById("ao-stage");
  if (st) st.textContent = STAGE_NAME[state.stage];
  if (el) el.innerHTML =
    `<div class="ro-item"><span>当前阶段</span><span>${STAGE_NAME[state.stage]}</span></div>` +
    `<div class="ro-item"><span>进入水量</span><span>${(state.water * 100).toFixed(0)}% 瓶体积</span></div>` +
    `<div class="ro-item verdict"><span>结论：氧气约占空气 1/5（约 21%）</span></div>`;
}

export default {
  id: "air-oxygen",
  name: "空气与氧气",
  category: "chemistry",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ao-canvas");
    ctx = canvas.getContext("2d");
    container.querySelector("#ao-start").addEventListener("click", aoStart);
    container.querySelector("#ao-reset").addEventListener("click", aoReset);
    draw();
  },
  update({ delta = 0.016 }) {
    if (state.stage === 1) {
      state.timer += delta;
      if (Math.random() < 0.6) {
        state.smoke.push({ x: 467 + (Math.random() * 16 - 8), y: 236, r: 4 + Math.random() * 4, vy: -(20 + Math.random() * 25), a: 0.6 });
      }
      if (state.timer >= DUR.burn) { state.stage = 2; state.timer = 0; }
    } else if (state.stage === 2) {
      state.timer += delta;
      if (state.timer >= DUR.cool) { state.stage = 3; state.timer = 0; }
    } else if (state.stage === 3) {
      state.timer += delta;
      state.water = Math.min(0.2, 0.2 * (state.timer / DUR.suck));
      if (state.timer >= DUR.suck) { state.stage = 4; }
    }
    for (const s of state.smoke) { s.y += s.vy * delta; s.a -= delta * 0.4; }
    state.smoke = state.smoke.filter((s) => s.a > 0);
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};
