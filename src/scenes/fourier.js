// 傅里叶级数场景：用一串旋转圆（epicycles）叠加画出方波 / 锯齿波 / 三角波。
// 范式：shellHead 生成骨架（reading-progress + hero + 章节导航），自有 lab-shell 写实验，
//       自有 section 写讲解。导航由注册表自动按分类生成，注册即上线。
import { shellHead } from "../scene-shell.js";

// 三种目标波形的傅里叶系数（归一化振幅），仅用于决定每个旋转圆的半径与方向。
function harmonics(n, type) {
  const out = [];
  if (type === "square") {
    for (let k = 1; k <= n; k++) {
      const m = 2 * k - 1;
      out.push({ freq: m, amp: (4 / Math.PI) / m, sign: 1 });
    }
  } else if (type === "sawtooth") {
    for (let k = 1; k <= n; k++) {
      out.push({ freq: k, amp: (2 / Math.PI) / k, sign: k % 2 === 1 ? 1 : -1 });
    }
  } else {
    for (let k = 0; k < n; k++) {
      const m = 2 * k + 1;
      out.push({ freq: m, amp: (8 / (Math.PI * Math.PI)) / (m * m), sign: k % 2 === 0 ? 1 : -1 });
    }
  }
  return out;
}

const template = `
  <style>
    .fourier-section-nav {
      max-width: var(--max);
      margin: 0 auto;
      padding: 14px var(--gutter) 0;
      display: flex;
      gap: 22px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid var(--rule);
    }
    .fourier-section-nav a {
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
    .fourier-section-nav a:hover,
    .fourier-section-nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--red-bright);
    }
    .fourier-scene #fourier-canvas {
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #f3efe5;
    }
    .fourier-controls select {
      width: 100%;
      padding: 8px 10px;
      font-family: var(--sans);
      font-size: 14px;
      color: var(--ink);
      background: #fff;
      border: 1px solid var(--rule);
      border-radius: 6px;
    }
  </style>
  ${shellHead({
    ns: "fourier",
    figureNo: "FIG. 07 / FOURIER SERIES",
    titleHTML: "傅里叶级数<br />用圆画出<br />任意波形",
    lead: "任何一个周期波形，都能拆成一串以整数倍频率旋转的圆的叠加——谐波越多，越逼近目标。",
    heroNote: "拖动「谐波数」看逼近过程 · 切换波形比对三者的系数结构",
    navLabel: "傅里叶章节导航",
    navItems: [
      { id: "fourier-intuition", label: "直觉" },
      { id: "fourier-define", label: "定义" },
    ],
    firstAnchor: "fourier-intuition",
  })}
    <div class="lab-shell" aria-label="傅里叶级数交互实验">
      <div class="lab-canvas-wrap">
        <canvas id="fourier-canvas" width="600" height="340" aria-label="傅里叶级数旋转圆叠加动画"></canvas>
        <div class="canvas-caption">
          <span>旋转圆叠加 → 目标波形</span>
          <span id="fourier-status">谐波 5 · 方波</span>
        </div>
      </div>

      <aside class="lab-controls fourier-controls" aria-label="实验设置">
        <h2>实验设置</h2>

        <label class="control-row" for="fourier-harmonics">
          <span>谐波数 <i>N</i></span>
          <output id="fourier-harmonics-output">5</output>
        </label>
        <input id="fourier-harmonics" type="range" min="1" max="40" step="1" value="5" />

        <label class="control-row" for="fourier-speed">
          <span>速度</span>
          <output id="fourier-speed-output">中</output>
        </label>
        <input id="fourier-speed" type="range" min="0" max="100" step="1" value="45" />

        <label class="control-row" for="fourier-wave">
          <span>目标波形</span>
        </label>
        <select id="fourier-wave">
          <option value="square">方波</option>
          <option value="sawtooth">锯齿波</option>
          <option value="triangle">三角波</option>
        </select>

        <div class="lab-actions">
          <button id="fourier-play" type="button">暂停</button>
          <button id="fourier-reset" type="button">重置</button>
        </div>
      </aside>
    </div>
  </section>

  <section class="section-pad" id="fourier-intuition" aria-labelledby="fourier-intuition-title">
    <div class="section-heading">
      <p class="section-index">01</p>
      <div>
        <h2 id="fourier-intuition-title">直觉：圆如何变成波</h2>
        <p>一个匀速旋转的点，其竖直坐标是一条正弦波。</p>
      </div>
    </div>
    <p>
      把若干个圆首尾相接，后一个套在前一个的圆周上、转速是前者的整数倍，最末端点的竖直轨迹，
      就是这些圆所代表的正弦分量之和。谐波数 <i>N</i> 越多，叠加结果越贴近你想要的周期波形——
      这正是上方动画在演示的事：左侧一串圆，右侧实时画出它们末端描出的曲线。
    </p>
  </section>

  <section class="section-pad" id="fourier-define" aria-labelledby="fourier-define-title">
    <div class="section-heading">
      <p class="section-index">02</p>
      <div>
        <h2 id="fourier-define-title">定义：傅里叶级数</h2>
        <p>周期为 2π 的函数可展开为正弦/余弦的加权和。</p>
      </div>
    </div>
    <p>
      以方波为例，其傅里叶级数为 <code>f(θ) = (4/π)·Σ sin((2k−1)θ)/(2k−1)</code>，
      只含奇次谐波、振幅随 1/(2k−1) 衰减。锯齿波与三角波的系数结构不同（见上方波形切换）：
      锯齿波含全部整数次谐波、三角波衰减最快（1/(2k+1)²），所以三角波用很少的谐波就已很平滑。
      切换波形并调小 <i>N</i>，可以直观看到「收敛快慢」的差异。
    </p>
  </section>
  </div>`;

let ctx = null;
let canvas = null;
let state = null;

function setup() {
  const W = canvas.width;
  const H = canvas.height;
  const ey = H / 2;
  const ex = 150;
  state = {
    W,
    H,
    ey,
    ex,
    t: 0,
    N: 5,
    speed: 0.0405,
    waveType: "square",
    playing: true,
    wave: [],
  };
}

function recalcScale() {
  const hs = harmonics(state.N, state.waveType);
  const sum = hs.reduce((a, h) => a + h.amp, 0) || 1;
  state.scale = (state.H * 0.4) / sum;
  state.maxRadius = sum * state.scale;
  state.waveX = state.ex + state.maxRadius + 30;
  state.wave = [];
}

function speedFromSlider(v) {
  // 0..100 → 0..0.09，滑块中端(45)约为 0.04
  return (v / 100) * 0.09;
}

function speedLabel(v) {
  if (v < 15) return "慢";
  if (v < 70) return "中";
  return "快";
}

function draw() {
  if (!ctx || !canvas || !state) return;
  const { W, H, ey, ex, t, N, waveType, scale, waveX } = state;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe5";
  ctx.fillRect(0, 0, W, H);

  const hs = harmonics(N, waveType);
  let x = ex;
  let y = ey;
  for (const h of hs) {
    const px = x;
    const py = y;
    const r = h.amp * scale;
    const a = h.freq * t + (h.sign < 0 ? Math.PI : 0);
    x += r * Math.cos(a);
    y += r * Math.sin(a);

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(7,24,45,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#07182d";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 末端轨迹（竖直坐标）送入历史，向右滚动绘制波形
  state.wave.unshift(y);
  const maxLen = Math.max(0, W - waveX);
  if (state.wave.length > maxLen) state.wave.length = maxLen;

  // 连接圆末端与波形起点
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(waveX, state.wave[0]);
  ctx.strokeStyle = "rgba(180,31,36,0.55)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 波形
  ctx.beginPath();
  for (let i = 0; i < state.wave.length; i++) {
    const wx = waveX + i;
    const wy = state.wave[i];
    if (i === 0) ctx.moveTo(wx, wy);
    else ctx.lineTo(wx, wy);
  }
  ctx.strokeStyle = "#b41f24";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 末端红点
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#b41f24";
  ctx.fill();
}

export default {
  id: "fourier",
  name: "傅里叶级数",
  category: "math",
  init(container) {
    container.innerHTML = template;
    canvas = container.querySelector("#fourier-canvas");
    ctx = canvas.getContext("2d");
    setup();
    recalcScale();

    const harm = container.querySelector("#fourier-harmonics");
    const harmOut = container.querySelector("#fourier-harmonics-output");
    const status = container.querySelector("#fourier-status");
    const speed = container.querySelector("#fourier-speed");
    const speedOut = container.querySelector("#fourier-speed-output");
    const waveSel = container.querySelector("#fourier-wave");
    const playBtn = container.querySelector("#fourier-play");
    const resetBtn = container.querySelector("#fourier-reset");

    harm.addEventListener("input", () => {
      state.N = Number(harm.value);
      harmOut.textContent = state.N;
      recalcScale();
      if (status) status.textContent = `谐波 ${state.N} · ${labelOf(state.waveType)}`;
    });

    speed.addEventListener("input", () => {
      state.speed = speedFromSlider(Number(speed.value));
      speedOut.textContent = speedLabel(Number(speed.value));
    });

    waveSel.addEventListener("change", () => {
      state.waveType = waveSel.value;
      recalcScale();
      if (status) status.textContent = `谐波 ${state.N} · ${labelOf(state.waveType)}`;
    });

    playBtn.addEventListener("click", () => {
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? "暂停" : "播放";
    });

    resetBtn.addEventListener("click", () => {
      state.t = 0;
      state.wave = [];
    });

    draw();
  },
  update() {
    if (!state) return;
    if (state.playing) state.t += state.speed;
    draw();
  },
  dispose() {
    ctx = null;
    canvas = null;
    state = null;
  },
  getDefaultParams() {
    return {};
  },
};

function labelOf(type) {
  return type === "square" ? "方波" : type === "sawtooth" ? "锯齿波" : "三角波";
}
