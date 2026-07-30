// 声音的特性（物理 · 八上 声现象）
// 交互：振幅→响度，频率→音调，波形→音色（正弦 / 方波 / 锯齿）
import { shellHead } from "../scene-shell.js";

const template = `
  <style>
    .ws-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      border-bottom: 1px solid var(--rule);
    }
    .ws-section-nav a {
      flex: 0 0 auto;
      padding-bottom: 12px;
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--muted);
      border-bottom: 2px solid transparent;
    }
    .ws-section-nav a:hover { color: var(--ink); border-bottom-color: var(--red-bright); }
    .ws-scene #ws-canvas { width: 100%; display: block; border-radius: 4px; }
  </style>
  ${shellHead({
    ns: "ws",
    figureNo: "FIG. 物理 / 声音的特性",
    titleHTML: "声音的特性<br />音调·响度·音色",
    lead: "同样是一段声音，为什么有的尖、有的响、有的音色不同？拖动滑块，看波形如何决定这三个属性。",
    heroNote: "改变振幅看响度 · 改变频率看音调 · 切换波形看音色 · 波形随相位流动",
    navLabel: "章节导航",
    navItems: [
      { id: "ws-intuition", label: "直觉" },
      { id: "ws-def", label: "定义" },
      { id: "ws-exp", label: "互动实验" },
      { id: "ws-limit", label: "边界" },
    ],
    firstAnchor: "ws-intuition",
  })}
    <div class="lab-shell" aria-label="声音的特性交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="ws-canvas" width="640" height="300" aria-label="波形图：随时间流动的声波"></canvas>
        <div class="canvas-caption">
          <span>实时波形（中线为平衡位置）</span>
          <span id="ws-readout">频率 2.0 Hz · 振幅 60 · 正弦波</span>
        </div>
      </div>

      <aside class="lab-controls" aria-label="实验设置">
        <h2>实验设置</h2>
        <label class="control-row" for="ws-freq">
          <span>频率（音调）</span><output id="ws-freq-o">2.0 Hz</output>
        </label>
        <input id="ws-freq" type="range" min="0.5" max="8" step="0.1" value="2" />

        <label class="control-row" for="ws-amp">
          <span>振幅（响度）</span><output id="ws-amp-o">60</output>
        </label>
        <input id="ws-amp" type="range" min="10" max="120" step="2" value="60" />

        <label class="control-row">音色（波形）</label>
        <div class="seg" role="group" aria-label="波形">
          <button class="seg-btn is-active" data-wave="sine" type="button">正弦</button>
          <button class="seg-btn" data-wave="square" type="button">方波</button>
          <button class="seg-btn" data-wave="saw" type="button">锯齿</button>
        </div>

        <div class="lab-actions">
          <button id="ws-freeze" class="accent-button" type="button" aria-pressed="false">暂停流动</button>
          <button id="ws-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="ws-intuition" aria-labelledby="ws-intuition-t">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div><h2 id="ws-intuition-t">声音到底是什么</h2>
      <p>敲鼓、拨弦、说话——物体振动推挤空气，空气一层层被压缩与拉松，形成疏密相间的波传到耳朵。</p></div>
    </div>
    <p>波的形状里藏着声音的全部秘密：<b>振动得多快</b>决定音调高低，<b>振动得多强</b>决定声音大小，<b>振动的形状</b>决定音色——让你能分辨是钢琴还是小提琴。</p>
  </section>

  <section class="section-pad" id="ws-def" aria-labelledby="ws-def-t">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div><h2 id="ws-def-t">三个属性的定义</h2>
      <p>分别对应波的三个可测量特征。</p></div>
    </div>
    <ul>
      <li><b>音调</b>：由<b>频率</b>决定（单位 Hz，每秒振动次数）。频率高→音调高（尖）；频率低→音调低（沉）。</li>
      <li><b>响度</b>：由<b>振幅</b>决定（波离开平衡位置的最大距离）。振幅大→声音响；振幅小→声音轻。</li>
      <li><b>音色</b>：由<b>波形</b>决定。即便音调和响度相同，正弦、方波、锯齿的叠加结构不同，听感就不同。</li>
    </ul>
  </section>

  <section class="section-pad" id="ws-exp" aria-labelledby="ws-exp-t">
    <div class="section-heading">
      <p class="section-index">03</p>
      <div><h2 id="ws-exp-t">亲自验证</h2>
      <p>拖动频率滑块——波变密，音调升高；拖动振幅滑块——波变高，声音变响；切换波形——形状变了，音色变了。</p></div>
    </div>
    <p>提示：把频率调到 <b>4 Hz 以上</b>，波会明显变密；把振幅调到最大，波峰几乎顶到画布边缘。三种波形里，<b>方波</b>最"硬"、<b>锯齿</b>最"亮"、<b>正弦</b>最"纯"。</p>
  </section>

  <section class="section-pad" id="ws-limit" aria-labelledby="ws-limit-t">
    <div class="section-heading">
      <p class="section-index">04</p>
      <div><h2 id="ws-limit-t">边界与说明</h2>
      <p>为了让三个属性直观可见，这里做了简化。</p></div>
    </div>
    <p>真实声音是多种频率叠加的复杂波形，且人耳可听范围约 <b>20 Hz–20000 Hz</b>，远高于本演示的数值（演示用低频率以便肉眼看清一个周期）。响度还与实际距离、介质有关，这里只演示振幅与波高的对应关系。音色在真实乐器中由丰富的谐波构成，本演示用三种理想波形示意。</p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
const state = { freq: 2, amp: 60, wave: "sine", phase: 0, frozen: false };
const waveName = { sine: "正弦波", square: "方波", saw: "锯齿" };

function sample(wave, x, cycles) {
  const a = x * cycles * 2 * Math.PI;
  if (wave === "square") return Math.sin(a) >= 0 ? 1 : -1;
  if (wave === "saw") return (((a / (2 * Math.PI)) % 1) + 1) % 1 * 2 - 1;
  return Math.sin(a);
}

function draw() {
  if (!ctx || !canvas) return;
  const w = canvas.width, h = canvas.height, mid = h / 2;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#c9c2b2";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
  const cycles = state.freq * 3;
  ctx.strokeStyle = "#1F5FAE";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = 0; px <= w; px += 2) {
    const x = px / w;
    const y = mid - sample(state.wave, x, cycles) * state.amp;
    if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
  }
  ctx.stroke();
  const fx = (state.phase % 1) * w;
  ctx.fillStyle = "#B41F24";
  ctx.beginPath();
  ctx.arc(fx, mid - sample(state.wave, state.phase % 1, cycles) * state.amp, 5, 0, Math.PI * 2);
  ctx.fill();
}

export default {
  id: "wave-sound",
  name: "声音的特性",
  category: "physics",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#ws-canvas");
    ctx = canvas.getContext("2d");
    const freq = container.querySelector("#ws-freq");
    const amp = container.querySelector("#ws-amp");
    const freqO = container.querySelector("#ws-freq-o");
    const ampO = container.querySelector("#ws-amp-o");
    const readout = container.querySelector("#ws-readout");

    const sync = () => {
      state.freq = Number(freq.value);
      state.amp = Number(amp.value);
      freqO.textContent = state.freq.toFixed(1) + " Hz";
      ampO.textContent = state.amp;
      readout.textContent = `频率 ${state.freq.toFixed(1)} Hz · 振幅 ${state.amp} · ${waveName[state.wave]}`;
    };
    freq.addEventListener("input", sync);
    amp.addEventListener("input", sync);

    container.querySelectorAll(".seg-btn").forEach((b) => {
      b.addEventListener("click", () => {
        container.querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
        state.wave = b.dataset.wave;
        sync();
      });
    });

    container.querySelector("#ws-freeze").addEventListener("click", (e) => {
      state.frozen = !state.frozen;
      e.target.setAttribute("aria-pressed", String(state.frozen));
      e.target.textContent = state.frozen ? "继续流动" : "暂停流动";
    });
    container.querySelector("#ws-reset").addEventListener("click", () => {
      freq.value = "2"; amp.value = "60";
      state.wave = "sine"; state.phase = 0; state.frozen = false;
      container.querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("is-active"));
      container.querySelector('[data-wave="sine"]').classList.add("is-active");
      const fb = container.querySelector("#ws-freeze");
      fb.setAttribute("aria-pressed", "false");
      fb.textContent = "暂停流动";
      sync();
    });

    sync();
    draw();
  },
  update({ delta = 0.016 }) {
    if (!state.frozen) state.phase += (state.freq * 0.12 + 0.03) * delta;
    draw();
  },
  dispose() { ctx = null; canvas = null; },
  getDefaultParams() { return {}; },
};
