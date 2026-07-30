// 呼吸系统（生物 · 七下 人体的呼吸）
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .rs-section-nav { max-width: var(--max); margin: 0 auto; padding: 14px var(--gutter) 0;
      display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--rule); }
    .rs-section-nav a { flex: 0 0 auto; padding-bottom: 12px; font-size: 13px;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: var(--muted);
      border-bottom: 2px solid transparent; }
    .rs-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .rs-scene #rs-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "rs",
    figureNo: "FIG. 生物 / 呼吸系统",
    titleHTML: "呼吸系统<br />吸气与呼气如何发生",
    lead: "胸廓像风箱：膈肌下降、胸腔扩大，肺就被「吸」满空气；膈肌回升、胸腔缩小，气又被挤出。看膈肌如何驱动呼吸。",
    heroNote: "观察膈肌升降 · 肺充气/排气 · 肺泡处氧气进入血液",
    navLabel: "章节导航",
    navItems: [
      { id: "rs-intuition", label: "直觉" },
      { id: "rs-def", label: "原理" },
      { id: "rs-exp", label: "互动实验" },
      { id: "rs-limit", label: "边界" },
    ],
    firstAnchor: "rs-intuition",
  })}
    <div class="lab-shell" aria-label="呼吸系统交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="rs-canvas" width="640" height="360" aria-label="膈肌驱动呼吸运动示意图"></canvas>
        <div class="canvas-caption">
          <span>膈肌下降→胸腔扩大→吸气；膈肌回升→胸腔缩小→呼气</span>
          <span id="rs-readout">吸气中</span>
        </div>
      </div>
      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="rs-diaphragm"><span>膈肌位置（手动）</span><output id="rs-d-o">自动</output></label>
        <input id="rs-diaphragm" type="range" min="0" max="100" step="1" value="50" />
        <div class="lab-actions">
          <button id="rs-auto" class="accent-button" type="button" aria-pressed="true">自动呼吸</button>
          <button id="rs-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="rs-intuition" aria-labelledby="rs-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="rs-intuition-t">胸口为什么会起伏</h2>
      <p>吸气时胸口鼓起，呼气时落下——不是肺自己在"吸"，而是胸腔在变体积。</p></div>
    </div>
    <p>肺本身没有肌肉、不会主动吸气。真正干活的是<b>膈肌</b>和肋间肌：它们改变胸腔的容积，容积一大，肺被动扩张、气压变低，外界空气就被压进来；容积一小，肺回缩、把气挤出去。</p>
  </section>

  <section class="section-pad" id="rs-def" aria-labelledby="rs-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="rs-def-t">原理：呼吸运动的两步</h2>
      <p>胸廓像一个可缩放的密闭盒子。</p></div>
    </div>
    <ul>
      <li><b>吸气</b>：膈肌<b>收缩下降</b>、肋间肌上提 → 胸腔上下径和前后径都增大 → 肺扩张 → 肺内压低于大气压 → 空气进入。</li>
      <li><b>呼气</b>：膈肌<b>舒张回升</b>、肋间肌下降 → 胸腔缩小 → 肺回缩 → 肺内压高于大气压 → 空气排出。</li>
      <li>肺泡处：O₂ 从肺泡扩散进血液、CO₂ 从血液扩散出肺泡（气体从高浓度向低浓度扩散）。</li>
    </ul>
  </section>

  <section class="section-pad" id="rs-exp" aria-labelledby="rs-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="rs-exp-t">亲自验证</h2>
      <p>默认自动呼吸，看膈肌上下、肺一胀一缩。也可关掉自动，拖动"膈肌位置"滑块手动模拟。</p></div>
    </div>
    <p>注意右下角的<b>肺泡放大</b>：吸气时新鲜空气到达肺泡，红色箭头表示 O₂ 进入毛细血管（血变红），蓝色箭头表示 CO₂ 排出。交换靠的是浓度差扩散，不需要能量。</p>
  </section>

  <section class="section-pad" id="rs-limit" aria-labelledby="rs-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="rs-limit-t">边界与说明</h2>
      <p>模型做了示意性简化。</p></div>
    </div>
    <p>真实呼吸还涉及肋间肌、胸廓多方向变化以及神经调控；本演示用膈肌升降代表主要机制。肺泡与毛细血管的"交换"用箭头示意扩散方向，实际交换面积巨大（约 70 m²）、以红细胞为载体。呼吸道（鼻、咽、喉、气管、支气管）的加温加湿过滤功能这里未展开。</p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const state = { d: 0.5, auto: true, playing: true, t: 0, prevD: 0.5 };

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5"; ctx.fillRect(0, 0, w, h);

  const vd = state.d - state.prevD; // >0 吸气(膈肌下降、肺胀)
  const inhaling = vd > 0.0005;

  // 胸廓外框
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(90, 70); ctx.lineTo(310, 70);
  ctx.lineTo(320, 200); ctx.lineTo(80, 200); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = "#07182d"; ctx.font = "12px var(--sans)"; ctx.textAlign = "center";
  ctx.fillText("胸廓（密闭腔）", 200, 55);

  // 膈肌（底部横线，随 d 下降）
  const diaY = 250 - state.d * 42;
  ctx.strokeStyle = "#B41F24"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(80, diaY); ctx.lineTo(320, diaY); ctx.stroke();
  ctx.fillStyle = "#B41F24"; ctx.font = "11px var(--sans)";
  ctx.fillText("膈肌", 350, diaY + 4);

  // 气管 + 支气管
  ctx.strokeStyle = "#07182d"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(200, 70); ctx.lineTo(200, 110); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(200, 110); ctx.lineTo(160, 135); ctx.moveTo(200, 110); ctx.lineTo(240, 135); ctx.stroke();

  // 肺（随 d 膨胀）
  const sc = 0.7 + state.d * 0.55;
  ctx.fillStyle = "rgba(180,31,36,0.30)"; ctx.strokeStyle = "#b41f24"; ctx.lineWidth = 2;
  for (const lx of [160, 240]) {
    ctx.beginPath();
    ctx.ellipse(lx, 150, 34 * sc, 52 * sc, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  // 气流箭头（沿气管）
  ctx.strokeStyle = inhaling ? "#185FA5" : "#8a8270"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 3;
  const ay = inhaling ? 95 : 120;
  drawArrow(ctx, 200, ay, 200, ay + (inhaling ? 18 : -18));
  ctx.font = "11px var(--sans)"; ctx.textAlign = "left";
  ctx.fillText(inhaling ? "空气进入" : "气体排出", 215, ay + (inhaling ? 22 : -10));

  // 肺泡放大（右下）
  drawAlveolus(ctx, 470, 250);

  const ro = document.getElementById("rs-readout");
  if (ro) ro.textContent = inhaling ? "吸气中（膈肌下降·肺扩张）" : "呼气中（膈肌回升·肺回缩）";
  state.prevD = state.d;
}

function drawAlveolus(c, cx, cy) {
  c.fillStyle = "#07182d"; c.font = "12px var(--sans)"; c.textAlign = "center";
  c.fillText("肺泡放大（气体交换）", cx, cy - 78);
  // 肺泡腔
  c.strokeStyle = "#b41f24"; c.lineWidth = 2.5; c.fillStyle = "rgba(180,31,36,0.15)";
  c.beginPath(); c.arc(cx, cy, 55, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = "rgba(140,130,110,0.18)";
  [[cx - 20, cy - 15], [cx + 18, cy + 10], [cx - 5, cy + 25], [cx + 25, cy - 20]].forEach((p) => {
    c.beginPath(); c.arc(p[0], p[1], 12, 0, Math.PI * 2); c.fill();
  });
  // 毛细血管
  c.strokeStyle = "#c0392b"; c.lineWidth = 10;
  c.beginPath(); c.moveTo(cx - 70, cy + 35); c.quadraticCurveTo(cx, cy + 75, cx + 70, cy + 35); c.stroke();
  // 红血球
  c.fillStyle = "#c0392b";
  [cx - 40, cx, cx + 40].forEach((x) => { c.beginPath(); c.arc(x, cy + 52, 7, 0, Math.PI * 2); c.fill(); });
  // O2 进（红箭头 肺泡→血），CO2 出（蓝箭头 血→肺泡）
  drawArrow(c, cx + 5, cy - 10, cx + 5, cy + 35, "#B41F24");
  c.fillStyle = "#B41F24"; c.font = "11px var(--sans)"; c.textAlign = "left";
  c.fillText("O₂ 进血液", cx + 12, cy + 14);
  drawArrow(c, cx - 5, cy + 30, cx - 5, cy - 12, "#185FA5");
  c.fillStyle = "#185FA5"; c.fillText("CO₂ 排出", cx - 78, cy - 2);
}

function drawArrow(c, x1, y1, x2, y2, color) {
  c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  c.beginPath();
  c.moveTo(x2, y2);
  c.lineTo(x2 - 9 * Math.cos(ang - 0.4), y2 - 9 * Math.sin(ang - 0.4));
  c.lineTo(x2 - 9 * Math.cos(ang + 0.4), y2 - 9 * Math.sin(ang + 0.4));
  c.closePath(); c.fill();
}

export default {
  id: "respiration",
  name: "呼吸系统",
  category: "biology",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#rs-canvas");
    ctx = canvas.getContext("2d");
    const dia = container.querySelector("#rs-diaphragm");
    const dO = container.querySelector("#rs-d-o");
    dia.addEventListener("input", () => {
      state.auto = false; state.d = Number(dia.value) / 100;
      container.querySelector("#rs-auto").setAttribute("aria-pressed", "false");
      container.querySelector("#rs-auto").textContent = "自动呼吸";
      dO.textContent = dia.value + "%";
    });
    container.querySelector("#rs-auto").addEventListener("click", (e) => {
      state.auto = !state.auto;
      e.target.setAttribute("aria-pressed", String(state.auto));
      e.target.textContent = state.auto ? "自动呼吸" : "已暂停";
      dO.textContent = state.auto ? "自动" : dia.value + "%";
    });
    container.querySelector("#rs-reset").addEventListener("click", () => {
      state.auto = true; state.t = 0; state.d = 0.5; state.prevD = 0.5;
      dia.value = "50"; dO.textContent = "自动";
      container.querySelector("#rs-auto").setAttribute("aria-pressed", "true");
      container.querySelector("#rs-auto").textContent = "自动呼吸";
    });
    draw();
  },
  update({ delta = 0.016 }) {
    if (state.auto && state.playing) {
      state.t += delta * 2.2;
      state.d = 0.5 + 0.5 * Math.sin(state.t);
    }
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};