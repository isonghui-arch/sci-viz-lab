// 种子萌发条件场景：设置 4 组培养（对照 / 无水 / 无空气 / 低温），
//   演示种子萌发必须同时具备 水分、空气(氧)、适宜温度，三者缺一不可。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .sg-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .sg-section-nav a {
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
    .sg-section-nav a:hover,
    .sg-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .sg-scene #sg-canvas { width: 100%; display: block; border-radius: 4px; background: #f3efe5; }
    .sg-readout { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .sg-readout .ro-item {
      display: flex; justify-content: space-between;
      padding: 8px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 6px;
      font-family: var(--mono, monospace); font-size: 12px;
    }
    .sg-readout .ro-item span:first-child { color: rgba(255,255,255,0.6); }
    .sg-readout .ro-item span:last-child { color: #fff; font-weight: 600; }
    .sg-readout .ro-item.verdict { grid-column: 1 / -1; background: rgba(83,74,183,0.22); border-color: rgba(83,74,183,0.55); }
  </style>
  ${shellHead({
    ns: "sg",
    figureNo: "FIG. 14 / SEED",
    titleHTML: "种子萌发条件<br />缺一不可的实验",
    lead: "同样一粒种子，有的发芽、有的不动。差别只在三个条件：水分、空气、适宜温度。按下培养，看谁先冒出根。",
    heroNote: "点「开始培养」· 对比四组：对照 / 无水 / 无空气 / 低温",
    navLabel: "种子章节导航",
    navItems: [
      { id: "sg-intuition", label: "直觉" },
      { id: "sg-define", label: "定义" },
      { id: "sg-lab", label: "互动实验" },
      { id: "sg-limits", label: "边界说明" },
    ],
    firstAnchor: "sg-intuition",
  })}
    <div class="lab-shell" aria-label="种子萌发条件交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="sg-canvas" width="620" height="380" aria-label="种子萌发条件对比实验"></canvas>
        <div class="canvas-caption">
          <span>对照组满足全部三个条件才会萌发；任一项缺失都停滞</span>
          <span id="sg-status">未开始</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="sg-readout" id="sg-readout"></div>
        <div class="lab-actions">
          <button id="sg-play" class="accent-button" type="button" aria-pressed="false">开始培养</button>
          <button id="sg-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="sg-intuition" aria-labelledby="sg-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="sg-intuition-title">直觉：为什么干燥的种子不发芽</h2>
      <p>萌发是场"化学开工"，需要水和氧来供能。</p></div>
    </div>
    <p>
      干燥的种子代谢几乎停摆。吸水后，子叶里的贮藏物质才被酶分解、运给胚根胚芽；
      同时种子要呼吸（消耗氧气）来提供能量。温度太低，酶"懒得动"，反应就停。
      所以<b>水分、空气（氧）、适宜温度</b>三者同时具备，种子才会启动萌发——少一个都不行。
    </p>
  </section>

  <section class="section-pad" id="sg-define" aria-labelledby="sg-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="sg-define-title">定义：种子萌发的必要条件</h2>
      <p>三个条件，逻辑上是"与"。</p></div>
    </div>
    <p>种子萌发必须同时具备：<b>① 一定的水分</b>、<b>② 充足的空气（氧气）</b>、<b>③ 适宜的温度</b>。</p>
    <p style="margin:8px 0 18px">
      · 对照组（三者齐全）→ <b>萌发</b><br />
      · 无水 → 不萌发（缺①）<br />
      · 完全浸没（缺氧气）→ 不萌发（缺②）<br />
      · 低温（如冰箱）→ 不萌发（缺③）
    </p>
    <p>注意：光照一般<b>不是</b>萌发的必要条件（少数种子例外），本实验不把它列为变量。</p>
  </section>

  <section class="section-pad" id="sg-lab" aria-labelledby="sg-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="sg-lab-title">互动实验</h2>
      <p>点「开始培养」，观察四组分化。</p></div>
    </div>
    <p>
      四组条件写在每个杯子下方（✓ 满足 / ✗ 缺失）。按下培养后，只有对照组冒出根和芽；
      其余三组始终是一粒不动的种子。这说明萌发是三个条件的<b>共同结果</b>，
      也解释了为什么播种前要松土（通气）、浇足水、选对季节。
    </p>
  </section>

  <section class="section-pad" id="sg-limits" aria-labelledby="sg-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="sg-limits-title">这个模型简化了什么</h2>
      <p>先说清与真实实验的差距。</p></div>
    </div>
    <div class="limits-grid">
      <article><span>活力度</span><h3>假设健全</h3><p>本模型假设种子本身有活力；真实中陈种、虫蛀种可能永不萌发。</p></article>
      <article><span>光照</span><h3>未列入</h3><p>多数种子萌发不需光，少数需光或忌光，本实验不设置该变量。</p></article>
      <article><span>时间</span><h3>加速演示</h3><p>真实萌发需数天，这里用数秒动画代表全过程。</p></article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = {
    playing: false,
    grow: 0,
    groups: [
      { name: "对照组", water: true, air: true, warm: true },
      { name: "无水", water: false, air: true, warm: true },
      { name: "无空气", water: true, air: false, warm: true },
      { name: "低温", water: true, air: true, warm: false },
    ],
  };
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  const n = state.groups.length;
  const cw = 130, gap = (W - 40 - cw * n) / (n + 1);
  const cupTop = 150, cupBot = 320;

  state.groups.forEach((g, i) => {
    const x = 20 + gap * (i + 1) + cw * i;
    const cx = x + cw / 2;
    const germ = g.water && g.air && g.warm;
    const grow = germ ? state.grow : 0;

    // 杯子
    ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 15, cupTop); ctx.lineTo(x + 8, cupBot);
    ctx.lineTo(x + cw - 8, cupBot); ctx.lineTo(x + cw - 15, cupTop);
    ctx.stroke();
    // 杯口
    ctx.beginPath(); ctx.moveTo(x, cupTop); ctx.lineTo(x + cw, cupTop); ctx.stroke();

    // 介质
    if (g.warm === false) {
      ctx.fillStyle = "rgba(120,170,220,0.25)"; // 低温淡蓝
    } else if (g.air === false) {
      ctx.fillStyle = "rgba(24,95,165,0.22)"; // 浸没水蓝
    } else {
      ctx.fillStyle = "rgba(150,110,70,0.30)"; // 土褐
    }
    ctx.fillRect(x + 8, cupTop + 12, cw - 16, cupBot - cupTop - 14);

    // 水线（有水且非浸没）
    if (g.water && g.air) {
      ctx.strokeStyle = "rgba(24,95,165,0.5)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x + 8, cupTop + 40); ctx.lineTo(x + cw - 8, cupTop + 40); ctx.stroke();
    }

    // 种子 / 萌发
    const seedY = cupTop + 55;
    if (grow > 0) {
      // 根（向下）
      ctx.strokeStyle = "#7a4a1f"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, seedY); ctx.lineTo(cx, seedY + 45 * grow); ctx.stroke();
      // 芽（向上）
      ctx.strokeStyle = "#3B6D11"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, seedY); ctx.lineTo(cx, seedY - 50 * grow); ctx.stroke();
      // 叶
      ctx.fillStyle = "#3B6D11";
      const ly = seedY - 50 * grow;
      ctx.beginPath(); ctx.ellipse(cx - 12 * grow, ly + 4, 12 * grow, 6 * grow, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 12 * grow, ly + 4, 12 * grow, 6 * grow, 0.5, 0, Math.PI * 2); ctx.fill();
      // 种子
      ctx.fillStyle = "#b45f1f";
      ctx.beginPath(); ctx.arc(cx, seedY, 7, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = "#b45f1f";
      ctx.beginPath(); ctx.arc(cx, seedY, 8, 0, Math.PI * 2); ctx.fill();
      if (g.warm === false) {
        // 雪花标记
        ctx.strokeStyle = "#185FA5"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - 6, seedY - 30); ctx.lineTo(cx + 6, seedY - 30);
        ctx.moveTo(cx, seedY - 36); ctx.lineTo(cx, seedY - 24);
        ctx.moveTo(cx - 4, seedY - 34); ctx.lineTo(cx + 4, seedY - 26);
        ctx.moveTo(cx + 4, seedY - 34); ctx.lineTo(cx - 4, seedY - 26); ctx.stroke();
      }
      if (!germ && state.grow > 0.05) {
        ctx.fillStyle = "#b41f24"; ctx.font = "14px var(--sans)"; ctx.textAlign = "center";
        ctx.fillText("×", cx, seedY - 24);
      }
    }

    // 组名
    ctx.fillStyle = "#07182d"; ctx.font = "13px var(--sans)"; ctx.textAlign = "center";
    ctx.fillText(g.name, cx, cupBot + 22);

    // 条件徽章
    const badges = [
      ["水", g.water], ["空气", g.air], ["温暖", g.warm],
    ];
    ctx.font = "11px var(--mono, monospace)";
    badges.forEach((b, bi) => {
      const by = cupBot + 40 + bi * 16;
      ctx.fillStyle = b[1] ? "#3B6D11" : "#b41f24";
      ctx.textAlign = "left";
      ctx.fillText(`${b[0]} ${b[1] ? "✓" : "✗"}`, x + 6, by);
    });
  });

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("sg-readout");
  if (!el) return;
  const germ = state.groups.filter((g) => g.water && g.air && g.warm).length;
  const verdict = state.grow > 0.05
    ? `萌发组 ${germ} / ${state.groups.length}（仅对照组）`
    : "按「开始培养」启动对比";
  el.innerHTML =
    `<div class="ro-item"><span>水分</span><span>必要</span></div>` +
    `<div class="ro-item"><span>空气</span><span>必要</span></div>` +
    `<div class="ro-item"><span>适宜温度</span><span>必要</span></div>` +
    `<div class="ro-item verdict"><span>${verdict}</span></div>`;
  const status = document.getElementById("sg-status");
  if (status) status.textContent = state.grow > 0.05 ? (germ > 0 ? "对照组已萌发" : "未萌发") : "未开始";
}

export default {
  id: "seed-germination",
  name: "种子萌发条件",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#sg-canvas");
    ctx = canvas.getContext("2d");
    setup();

    const playBtn = document.getElementById("sg-play");
    playBtn.addEventListener("click", () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? "暂停培养" : "继续培养";
      playBtn.setAttribute("aria-pressed", String(state.playing));
    });
    document.getElementById("sg-reset").addEventListener("click", () => {
      state.playing = false; state.grow = 0;
      playBtn.textContent = "开始培养"; playBtn.setAttribute("aria-pressed", "false");
      draw();
    });
    draw();
  },
  update() {
    if (!state || !state.playing) return;
    state.grow = Math.min(1, state.grow + 0.006);
    draw();
    if (state.grow >= 1) {
      state.playing = false;
      const btn = document.getElementById("sg-play");
      if (btn) { btn.textContent = "培养完成"; }
    }
  },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
