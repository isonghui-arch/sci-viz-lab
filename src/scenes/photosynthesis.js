// 光合作用场景：演示"绿叶在光下+有二氧化碳+有叶绿素 → 产生淀粉(碘液变蓝)"。
//   可关闭光照、用 NaOH 吸收 CO2、切换银边翠兰(白斑叶)验证"叶绿体是场所"。
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .pho-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .pho-section-nav a {
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
    .pho-section-nav a:hover,
    .pho-section-nav a:focus-visible { color: var(--ink); border-bottom-color: var(--red-bright); }
    .pho-scene #pho-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .pho-toggles { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .pho-toggles button {
      font-family: var(--sans); font-size: 13px; padding: 8px 11px;
      border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 8px; cursor: pointer;
    }
    .pho-toggles button[aria-pressed="true"] { background: var(--red-bright,#b41f24); color: #fff; border-color: var(--red-bright,#b41f24); }
    .pho-readout {
      margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 13px; line-height: 1.5;
      border: 1px solid rgba(255,255,255,0.14); background: rgba(59,109,17,0.16); border-color: rgba(59,109,17,0.45);
    }
  </style>
  ${shellHead({
    ns: "pho",
    figureNo: "FIG. 12 / PHOTOSYNTHESIS",
    titleHTML: "光合作用<br />植物如何制造养料",
    lead: "绿色植物在光下，把二氧化碳和水变成淀粉和氧气。关闭光照、抽走二氧化碳、或去掉叶绿素，淀粉就造不出来——逐个验证。",
    heroNote: "切换 光照 / CO₂ / 叶型 · 点「碘液检测」看淀粉是否存在",
    navLabel: "光合章节导航",
    navItems: [
      { id: "pho-intuition", label: "直觉" },
      { id: "pho-define", label: "定义" },
      { id: "pho-lab", label: "互动实验" },
      { id: "pho-limits", label: "边界说明" },
    ],
    firstAnchor: "pho-intuition",
  })}
    <div class="lab-shell" aria-label="光合作用交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="pho-canvas" width="600" height="340" aria-label="光合作用条件与淀粉检测"></canvas>
        <div class="canvas-caption">
          <span>绿叶+光+CO₂ → 淀粉(碘液变蓝)；缺任一项 → 不变蓝</span>
          <span id="pho-status">光照中 · 有CO₂</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <div class="pho-toggles" role="group" aria-label="条件">
          <button id="pho-light" type="button" aria-pressed="true">光照 ☀</button>
          <button id="pho-co2" type="button" aria-pressed="true">CO₂ 充足</button>
        </div>
        <label class="control-row" style="margin-bottom:10px">
          <span>叶片类型</span>
        </label>
        <div class="pho-toggles" role="group" aria-label="叶型">
          <button id="pho-leaf-green" type="button" aria-pressed="true">正常绿叶</button>
          <button id="pho-leaf-var" type="button" aria-pressed="false">银边翠兰(白斑)</button>
        </div>
        <div class="lab-actions">
          <button id="pho-test" type="button" class="accent-button" aria-pressed="false">碘液检测淀粉</button>
        </div>
        <div class="pho-readout" id="pho-readout"></div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="pho-intuition" aria-labelledby="pho-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="pho-intuition-title">直觉：植物"吃什么"长大</h2>
        <p>植物不用嘴吃，却能在阳光下"无中生有"造出养料。</p>
      </div>
    </div>
    <p>
      很久以前人们以为植物靠"吃土"长大。后来发现，植物真正的"厨房"是<b>绿叶</b>：在<b>光照</b>和<b>叶绿体</b>的帮助下，
      把空气里的<b>二氧化碳</b>和根吸来的<b>水</b>，合成为储存能量的<b>有机物（主要是淀粉）</b>，并释放<b>氧气</b>。
      所以森林被称为"地球之肺"——它不断制造氧气。没有光、没有二氧化碳、或叶子没有绿色（缺叶绿体），这间厨房就停工。
    </p>
  </section>

  <section class="section-pad" id="pho-define" aria-labelledby="pho-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="pho-define-title">定义：反应式与条件</h2>
        <p>二氧化碳 + 水 →（光、叶绿体）→ 有机物 + 氧气。</p>
      </div>
    </div>
    <p>
      光合作用总反应式：<code>CO₂ + H₂O —(光能,叶绿体)→ (CH₂O)ₙ + O₂</code>。
      其中 <code>(CH₂O)ₙ</code> 代表以淀粉为代表的有机物。三个<b>必要条件</b>：① <b>光照</b>提供能量；
      ② <b>叶绿体</b>作为"车间"（含叶绿素）；③ 原料 <b>CO₂ 和水</b>。
    </p>
    <p style="margin-top:8px">
      初中检验方法：先把植物<b>暗处理</b>耗尽原有淀粉，再让叶片部分见光、部分遮光，光照后<b>脱色</b>加<b>碘液</b>——
      见光部分变<b>蓝黑色</b>（有淀粉），遮光部分不变蓝。本场景用"碘液检测"一步呈现。
    </p>
  </section>

  <section class="section-pad" id="pho-lab" aria-labelledby="pho-lab-title">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div>
        <h2 id="pho-lab-title">互动实验</h2>
        <p>控制变量，找出光合作用必需的三个条件。</p>
      </div>
    </div>
    <p>
      ① 关掉<b>光照</b>→不再产淀粉；② 切到<b>CO₂ 不足</b>（NaOH 吸收）→不变蓝；
      ③ 选<b>银边翠兰（白斑叶）</b>→只有绿色部分（有叶绿体）变蓝，白色边缘不变蓝，证明<b>叶绿体是场所</b>。
      每改一项，点「碘液检测淀粉」看结果。
    </p>
  </section>

  <section class="section-pad" id="pho-limits" aria-labelledby="pho-limits-title">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div>
        <h2 id="pho-limits-title">这个模型简化了什么</h2>
        <p>真实光合远比"变蓝"复杂。</p>
      </div>
    </div>
    <div class="limits-grid">
      <article>
        <span>两步</span>
        <h3>光反应+暗反应</h3>
        <p>光反应在类囊体产 ATP/NADPH 和 O₂，暗反应在基质固定 CO₂。本场景合并为"产淀粉"。</p>
      </article>
      <article>
        <span>呼吸</span>
        <h3>同时在进行</h3>
        <p>植物白天光合强于呼吸、净放氧；夜里只呼吸耗氧。暗处理正是为排除原有淀粉干扰。</p>
      </article>
      <article>
        <span>产物</span>
        <h3>不止淀粉</h3>
        <p>光合作用还产葡萄糖、进而合成蛋白质、脂肪等，淀粉只是易检测的代表性产物。</p>
      </article>
    </div>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  state = { light: true, co2: true, leaf: "green", tested: false };
}

// 某区域是否产淀粉：需要 光 AND CO2 AND 该区域有叶绿素
function makesStarch(hasChlorophyll) {
  return state.light && state.co2 && hasChlorophyll;
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  // 阳光
  if (state.light) {
    ctx.strokeStyle = "rgba(245,166,35,0.6)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = 70 + i * 30;
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x + 30, 150); ctx.stroke();
    }
    ctx.fillStyle = "#BA7517";
    ctx.font = "13px var(--sans)";
    ctx.textAlign = "left";
    ctx.fillText("☀ 光照中", 60, 16);
  } else {
    ctx.fillStyle = "#5f5e5a";
    ctx.font = "13px var(--sans)";
    ctx.textAlign = "left";
    ctx.fillText("🌙 无光照（暗处）", 60, 16);
  }

  // 盆栽
  const potX = 300, potY = 250;
  ctx.fillStyle = "#7a5230";
  ctx.beginPath();
  ctx.moveTo(potX - 40, potY); ctx.lineTo(potX + 40, potY);
  ctx.lineTo(potX + 30, potY + 50); ctx.lineTo(potX - 30, potY + 50); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#8a8475";
  ctx.fillRect(potX - 42, potY - 8, 84, 10);

  // 茎
  ctx.strokeStyle = "#3B6D11";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(potX, potY - 4); ctx.lineTo(potX, potY - 70); ctx.stroke();

  // 叶片（两片，左绿右视叶型）
  const leafAt = (lx, ly, w, h, green) => {
    ctx.save();
    ctx.translate(lx, ly);
    // 叶身
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    if (state.leaf === "var" && !green) {
      ctx.fillStyle = "#cfe6c2"; // 白边（无叶绿素）
    } else {
      ctx.fillStyle = state.light && state.co2 ? "#4f8f1f" : "#6f8a4f"; // 光照足偏深绿
    }
    ctx.fill();
    ctx.strokeStyle = "#2f5d10";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // 叶脉
    ctx.strokeStyle = "#2f5d10";
    ctx.beginPath(); ctx.moveTo(-w, 0); ctx.lineTo(w, 0); ctx.stroke();
    // 淀粉检测
    if (state.tested && (state.leaf === "green" || green)) {
      const starch = makesStarch(true);
      // 蓝色斑点示意
      ctx.fillStyle = starch ? "rgba(20,30,90,0.55)" : "rgba(255,255,255,0.15)";
      for (let i = 0; i < 6; i++) {
        const a = i * 1.1;
        ctx.beginPath(); ctx.arc(Math.cos(a) * w * 0.5, Math.sin(a * 1.3) * h * 0.5, 4, 0, Math.PI * 2); ctx.fill();
      }
      if (!starch) {
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath(); ctx.arc(0, 0, w * 0.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  };
  // 左叶（始终绿）
  leafAt(potX - 55, potY - 90, 42, 22, true);
  // 右叶（var 时白边）
  leafAt(potX + 55, potY - 95, 42, 22, state.leaf !== "var");

  // CO2 提示
  ctx.fillStyle = state.co2 ? "#0F6E56" : "#a32d2d";
  ctx.font = "12px var(--sans)";
  ctx.textAlign = "left";
  ctx.fillText(state.co2 ? "空气中 CO₂ 充足" : "NaOH 吸收了 CO₂（不足）", 430, 40);

  updateReadout();
}

function updateReadout() {
  const el = document.getElementById("pho-readout");
  const status = document.getElementById("pho-status");
  if (!el) return;
  let msg;
  if (!state.tested) {
    msg = "设置好条件后，点「碘液检测淀粉」查看结果。";
  } else {
    const greenStarch = makesStarch(true);
    if (state.leaf === "var") {
      msg = greenStarch
        ? "结果：绿叶部分变蓝、白边不变蓝 → 叶绿体是光合作用的场所。"
        : "结果：整片都不蓝 → 缺光或缺 CO₂，即使有叶绿体也不产淀粉。";
    } else {
      msg = greenStarch
        ? "结果：叶片遇碘液变蓝黑色 → 有淀粉生成，光合作用进行。"
        : "结果：叶片不变蓝 → 缺光或缺 CO₂，未制造淀粉。";
    }
  }
  el.textContent = msg;
  if (status) {
    status.textContent = `${state.light ? "光照中" : "无光照"} · ${state.co2 ? "有CO₂" : "无CO₂"}`;
  }
}

function bindToggle(id, key, invertLabel) {
  const b = document.getElementById(id);
  b.addEventListener("click", () => {
    state[key] = !state[key];
    b.setAttribute("aria-pressed", String(state[key]));
    if (key === "light") b.textContent = state.light ? "光照 ☀" : "无光照 🌙";
    if (key === "co2") b.textContent = state.co2 ? "CO₂ 充足" : "CO₂ 不足";
    // 改条件后重置检测，避免误导
    state.tested = false;
    document.getElementById("pho-test").setAttribute("aria-pressed", "false");
    draw();
  });
}

function bindLeaf(id, key, other) {
  const b = document.getElementById(id);
  b.addEventListener("click", () => {
    state.leaf = key;
    b.setAttribute("aria-pressed", "true");
    document.getElementById(other).setAttribute("aria-pressed", "false");
    state.tested = false;
    document.getElementById("pho-test").setAttribute("aria-pressed", "false");
    draw();
  });
}

export default {
  id: "photosynthesis",
  name: "光合作用",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#pho-canvas");
    ctx = canvas.getContext("2d");
    setup();

    bindToggle("pho-light", "light");
    bindToggle("pho-co2", "co2");
    bindLeaf("pho-leaf-green", "green", "pho-leaf-var");
    bindLeaf("pho-leaf-var", "var", "pho-leaf-green");

    document.getElementById("pho-test").addEventListener("click", () => {
      state.tested = true;
      document.getElementById("pho-test").setAttribute("aria-pressed", "true");
      draw();
    });

    draw();
  },
  update() { draw(); },
  dispose() { ctx = null; canvas = null; state = null; },
  getDefaultParams() { return {}; },
};
