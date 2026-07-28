// 光的折射场景：2D Canvas 实时绘制入射 / 反射 / 折射光线，演示 Snell 定律与全反射
const template = `
  <style>
    .refr-scene .hero-lead { max-width: 460px; }
    .refr-scene #refr-canvas { width: 100%; height: 650px; }
    .refr-scene .refr-copy p { max-width: 760px; margin-bottom: 18px; font-size: 16px; line-height: 1.75; }
    .refr-scene .refr-presets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin: 6px 0 4px;
    }
    .refr-scene .refr-presets button {
      padding: 8px 4px;
      color: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 4px;
      background: transparent;
      font-size: 11px;
      transition: border 160ms ease, color 160ms ease;
    }
    .refr-scene .refr-presets button:hover,
    .refr-scene .refr-presets button:focus-visible { color: #fff; border-color: rgba(255, 255, 255, 0.6); }
    .refr-scene .refr-preset-label {
      margin: 14px 0 0;
      color: rgba(255, 255, 255, 0.55);
      font-size: 11px;
      letter-spacing: 0.08em;
    }
    .refr-scene .refr-readout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 18px;
      margin: 18px 0 4px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      font-size: 12px;
    }
    .refr-scene .refr-readout span { color: rgba(255, 255, 255, 0.62); }
    .refr-scene .refr-readout output { display: block; margin-top: 2px; color: #fff; font-family: var(--mono); }
    .refr-scene .refr-snell-line { grid-column: 1 / -1; }
    .refr-scene .refr-snell-line output { color: #ffb52b; font-size: 13px; }
    @media (max-width: 1240px) {
      .refr-scene #refr-canvas { height: 620px; }
    }
    @media (max-width: 620px) {
      .refr-scene #refr-canvas { height: 460px; }
      .refr-scene .lab-canvas-wrap { height: 460px; }
    }
  </style>

  <div class="refr-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 04 / OPTICS LAB</p>
        <h1>光走进水里，<br />为什么<br />拐了个弯？</h1>
        <p class="hero-lead">
          筷子在水杯里"折断"，钻石把光锁在体内反复弹射——都源自同一条定律：n₁sinθ₁ = n₂sinθ₂。
        </p>
        <a class="primary-action" href="#refr-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          调整入射角与两侧介质折射率 · 观察折射与反射光线<br />
          从密介质射向疏介质时，超过临界角会发生全反射。
        </p>
      </div>

      <div class="lab-shell" aria-label="光的折射交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="refr-canvas" aria-label="折射与反射光线演示"></canvas>
          <div class="canvas-caption">
            <span>Snell 定律实时计算</span>
            <span id="refr-canvas-status">θ₁ = 40° · 空气 → 水</span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="光学参数">
          <h2>光学参数</h2>

          <label class="control-row" for="refr-angle">
            <span>入射角 <i>θ₁</i></span>
            <output id="refr-angle-output">40°</output>
          </label>
          <input id="refr-angle" type="range" min="0" max="89" step="0.5" value="40" />

          <label class="control-row" for="refr-n1">
            <span>介质 1 折射率 <i>n₁</i></span>
            <output id="refr-n1-output">1.00</output>
          </label>
          <input id="refr-n1" type="range" min="1" max="2.5" step="0.01" value="1.00" />
          <p class="refr-preset-label">介质 1 快捷预设</p>
          <div class="refr-presets" role="group" aria-label="介质 1 预设">
            <button data-refr-medium="1" data-refr-n="1.00" type="button">空气<br />1.00</button>
            <button data-refr-medium="1" data-refr-n="1.33" type="button">水<br />1.33</button>
            <button data-refr-medium="1" data-refr-n="1.52" type="button">玻璃<br />1.52</button>
            <button data-refr-medium="1" data-refr-n="2.42" type="button">钻石<br />2.42</button>
          </div>

          <label class="control-row" for="refr-n2">
            <span>介质 2 折射率 <i>n₂</i></span>
            <output id="refr-n2-output">1.33</output>
          </label>
          <input id="refr-n2" type="range" min="1" max="2.5" step="0.01" value="1.33" />
          <p class="refr-preset-label">介质 2 快捷预设</p>
          <div class="refr-presets" role="group" aria-label="介质 2 预设">
            <button data-refr-medium="2" data-refr-n="1.00" type="button">空气<br />1.00</button>
            <button data-refr-medium="2" data-refr-n="1.33" type="button">水<br />1.33</button>
            <button data-refr-medium="2" data-refr-n="1.52" type="button">玻璃<br />1.52</button>
            <button data-refr-medium="2" data-refr-n="2.42" type="button">钻石<br />2.42</button>
          </div>

          <div class="refr-readout" aria-live="polite">
            <div class="refr-snell-line"><span>Snell 定律核验</span><output id="refr-snell">—</output></div>
            <div><span>折射角 θ₂</span><output id="refr-theta2">—</output></div>
            <div><span>临界角 θc</span><output id="refr-critical">—</output></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="refr-intuition" aria-labelledby="refr-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="refr-intuition-title">直觉模型：光在换挡</h2>
          <p>折射率 n 是"光在这种介质里慢了多少倍"。光变速，方向就得跟着变。</p>
        </div>
      </div>
      <div class="refr-copy">
        <p>
          光在真空中每秒走约 30 万 km，进入水里就慢到约 22.5 万 km（30÷1.33）。
          一个常用的类比：一队士兵斜着从公路踏进泥地，先踩进泥地的一侧先减速，
          整个队列的前进方向于是向"慢的一侧"偏转——这就是光从疏介质进入密介质时向法线偏折的原因。
        </p>
        <p>
          Snell 定律把这件事写成等式：n₁sinθ₁ = n₂sinθ₂。两侧折射率差得越多，弯折越明显。
          它在 1621 年由斯涅尔重新发现，也可以从费马"光走耗时最短路径"的原理推出。
        </p>
        <p>
          反过来，光从密介质射向疏介质（比如从水底望向水面）时会偏离法线。当入射角超过临界角
          θc = arcsin(n₂/n₁)，sinθ₂ 需要大于 1——折射光线不存在了，全部能量被反射回来，这就是全反射。
          水下 48.6° 之外的天空看不见、光纤把信号困在纤芯里、钻石 24.4° 的小临界角让光反复内弹，都是同一件事。
        </p>
      </div>
    </section>

    <section class="limits section-pad" aria-labelledby="refr-limits-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="refr-limits-title">这个模型简化了什么</h2>
          <p>几何光学是近似，画面里还有几处刻意的省略。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>简化 1</span>
          <h3>单一波长、无色散</h3>
          <p>
            折射率其实随波长变化：同一块玻璃对蓝光的 n 略大于红光，所以棱镜能分光。
            演示里只画一条"平均"光线，不体现色散。
          </p>
        </article>
        <article>
          <span>简化 2</span>
          <h3>光强分配是示意的</h3>
          <p>
            反射光与折射光各带走多少能量由菲涅耳方程决定，且与偏振有关。
            画面只用线条粗细与透明度示意"临界角附近反射变强"的趋势，数值并不精确。
          </p>
        </article>
        <article>
          <span>简化 3</span>
          <h3>界面理想平整</h3>
          <p>
            演示假设两介质之间是无限薄的光滑平面。真实界面有粗糙度与过渡层，
            会产生漫反射；几何光学本身在波长尺度上也会让位于波动光学。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="refr-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="refr-sources-title">来源与核验路径</h2>
          <p>折射率数值与定律表述以下列资料为准。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Snell%27s_law" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Snell's law</strong>
          <span role="cell">定律表述、历史与全反射条件</span>
        </a>
        <a class="source-row" role="row" href="http://hyperphysics.phy-astr.gsu.edu/hbase/geoopt/refr.html" target="_blank" rel="noreferrer">
          <span role="cell">教学</span>
          <strong role="cell">HyperPhysics · Refraction of Light</strong>
          <span role="cell">折射、临界角与常见介质折射率</span>
        </a>
        <a class="source-row" role="row" href="https://refractiveindex.info/" target="_blank" rel="noreferrer">
          <span role="cell">数据库</span>
          <strong role="cell">refractiveindex.info</strong>
          <span role="cell">水 1.33、玻璃 1.52、钻石 2.42 等实测数据</span>
        </a>
      </div>
      <p class="source-policy">
        预设值取可见光（约 589 nm 钠黄光）下的常用近似：空气 1.00、水 1.33、冕牌玻璃 1.52、钻石 2.42。
      </p>
    </section>
  </div>
`;

function setCanvasSize(canvas, width, height) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const nextWidth = Math.max(1, Math.floor(width * dpr));
  const nextHeight = Math.max(1, Math.floor(height * dpr));
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }
  return dpr;
}

// 折射率映射为介质底色：n 越大颜色越深
function mediumColor(n, isLower) {
  const t = Math.min(1, (n - 1) / 1.5);
  const base = isLower ? [14, 47, 77] : [10, 28, 49];
  const dark = isLower ? [8, 24, 46] : [6, 15, 30];
  const mix = base.map((c, i) => Math.round(c + (dark[i] - c) * t + t * (isLower ? 14 : 8)));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

class RefractionCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.theta1 = 40; // 入射角，度
    this.n1 = 1.0;
    this.n2 = 1.33;
    this.dashOffset = 0; // 光线流动动画相位，由 update() 推进
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  // 计算折射角（度）；全反射时返回 null
  compute() {
    const rad = (this.theta1 * Math.PI) / 180;
    const sin2 = (this.n1 * Math.sin(rad)) / this.n2;
    const tir = sin2 > 1;
    const theta2 = tir ? null : (Math.asin(sin2) * 180) / Math.PI;
    const critical = this.n1 > this.n2 ? (Math.asin(this.n2 / this.n1) * 180) / Math.PI : null;
    return { theta2, tir, critical };
  }

  ray(ctx, ox, oy, angleFromNormal, goingDown, length, color, width, dashed) {
    // 法线竖直：与法线夹角 θ，向下为折射方向，向上为入射/反射方向
    const rad = (angleFromNormal * Math.PI) / 180;
    const dx = Math.sin(rad) * length;
    const dy = Math.cos(rad) * length * (goingDown ? 1 : -1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    if (dashed) {
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -this.dashOffset;
    }
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + dx, oy + dy);
    ctx.stroke();
    ctx.restore();
    return [ox + dx, oy + dy];
  }

  incidentRay(ctx, ox, oy, length) {
    // 入射光线从左上方射向界面点，带流动虚线
    const rad = (this.theta1 * Math.PI) / 180;
    const sx = ox - Math.sin(rad) * length;
    const sy = oy - Math.cos(rad) * length;
    ctx.save();
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -this.dashOffset;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ox, oy);
    ctx.stroke();
    ctx.restore();
  }

  angleArc(ctx, ox, oy, thetaDeg, side, color, label) {
    // side: "in" 左上 / "refl" 右上 / "refr" 右下
    const r = 52;
    const rad = (thetaDeg * Math.PI) / 180;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (side === "in") ctx.arc(ox, oy, r, -Math.PI / 2 - rad, -Math.PI / 2);
    if (side === "refl") ctx.arc(ox, oy, r, -Math.PI / 2, -Math.PI / 2 + rad);
    if (side === "refr") ctx.arc(ox, oy, r, Math.PI / 2 - rad, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "12px sans-serif";
    const mid = side === "in"
      ? -Math.PI / 2 - rad / 2
      : side === "refl"
        ? -Math.PI / 2 + rad / 2
        : Math.PI / 2 - rad / 2;
    ctx.fillText(label, ox + Math.cos(mid) * (r + 16) - 8, oy + Math.sin(mid) * (r + 16) + 4);
    ctx.restore();
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = setCanvasSize(this.canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const iy = h * 0.5; // 界面高度
    const ox = w * 0.5; // 入射点
    const rayLen = Math.min(w, h) * 0.42;
    const info = this.compute();

    // 两侧介质底色
    ctx.fillStyle = mediumColor(this.n1, false);
    ctx.fillRect(0, 0, w, iy);
    ctx.fillStyle = mediumColor(this.n2, true);
    ctx.fillRect(0, iy, w, h - iy);

    // 界面
    ctx.strokeStyle = "rgba(243, 239, 229, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, iy);
    ctx.lineTo(w, iy);
    ctx.stroke();

    // 法线（竖直虚线）
    ctx.save();
    ctx.strokeStyle = "rgba(243, 239, 229, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.moveTo(ox, iy - rayLen * 1.05);
    ctx.lineTo(ox, iy + rayLen * 1.05);
    ctx.stroke();
    ctx.restore();

    // 入射光线
    this.incidentRay(ctx, ox, iy, rayLen);
    this.angleArc(ctx, ox, iy, this.theta1, "in", "#ffd166", "θ₁");

    // 反射光线：全反射时满强度，否则按临界角趋势示意减弱
    let reflAlpha = 0.35;
    let reflWidth = 1.4;
    if (info.tir) {
      reflAlpha = 0.95;
      reflWidth = 2.4;
    } else if (info.critical !== null) {
      const closeness = Math.min(1, this.theta1 / info.critical);
      reflAlpha = 0.3 + closeness * 0.5;
      reflWidth = 1.2 + closeness * 1.0;
    }
    this.ray(ctx, ox, iy, this.theta1, false, rayLen, `rgba(255, 209, 102, ${reflAlpha})`, reflWidth, true);
    this.angleArc(ctx, ox, iy, this.theta1, "refl", `rgba(255, 209, 102, ${Math.max(0.55, reflAlpha)})`, "θᵣ");

    // 折射光线
    if (!info.tir) {
      this.ray(ctx, ox, iy, info.theta2, true, rayLen, "#6fc2ff", 2.4, true);
      this.angleArc(ctx, ox, iy, info.theta2, "refr", "#6fc2ff", "θ₂");
    }

    // 临界角参考线（密 → 疏时）
    if (info.critical !== null) {
      ctx.save();
      ctx.strokeStyle = "rgba(227, 58, 50, 0.55)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      const rad = (info.critical * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(ox, iy);
      ctx.lineTo(ox - Math.sin(rad) * rayLen, iy - Math.cos(rad) * rayLen);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "rgba(227, 58, 50, 0.85)";
      ctx.font = "12px sans-serif";
      ctx.fillText(`θc = ${info.critical.toFixed(1)}°`, ox - Math.sin((info.critical * Math.PI) / 180) * rayLen - 8, iy - Math.cos((info.critical * Math.PI) / 180) * rayLen - 8);
    }

    // 介质标注
    ctx.fillStyle = "rgba(243, 239, 229, 0.72)";
    ctx.font = "13px sans-serif";
    ctx.fillText(`介质 1 · n₁ = ${this.n1.toFixed(2)}`, 18, 26);
    ctx.fillText(`介质 2 · n₂ = ${this.n2.toFixed(2)}`, 18, h - 16);

    if (info.tir) {
      ctx.fillStyle = "#ffb52b";
      ctx.font = "600 15px sans-serif";
      ctx.fillText("全反射：sinθ₂ 需大于 1，折射光线消失", w * 0.5 - 140, h - 24);
    }
    return info;
  }

  tick(delta) {
    // 虚线流动，速率与帧时间挂钩；由全局 rAF 每帧调用
    this.dashOffset = (this.dashOffset + (delta || 0.016) * 26) % 18;
    this.draw();
  }

  dispose() {
    this.resizeObserver.disconnect();
  }
}

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

const MEDIUM_NAMES = [
  [1.0, "空气"],
  [1.33, "水"],
  [1.52, "玻璃"],
  [2.42, "钻石"],
];

function mediumName(n) {
  const hit = MEDIUM_NAMES.find(([value]) => Math.abs(value - n) < 0.005);
  return hit ? hit[1] : `n=${n.toFixed(2)}`;
}

function refreshReadout() {
  const { optics } = state;
  const info = optics.compute();
  const rad = (optics.theta1 * Math.PI) / 180;
  const lhs = optics.n1 * Math.sin(rad);

  if (info.tir) {
    $("#refr-snell").textContent =
      `n₁sinθ₁ = ${lhs.toFixed(3)} > n₂ = ${optics.n2.toFixed(2)} → 全反射`;
    $("#refr-theta2").textContent = "无折射光线";
  } else {
    const rhs = optics.n2 * Math.sin((info.theta2 * Math.PI) / 180);
    $("#refr-snell").textContent =
      `${optics.n1.toFixed(2)} × sin${optics.theta1.toFixed(1)}° = ${lhs.toFixed(3)} = ${optics.n2.toFixed(2)} × sin${info.theta2.toFixed(1)}° = ${rhs.toFixed(3)}`;
    $("#refr-theta2").textContent = `${info.theta2.toFixed(1)}°`;
  }
  $("#refr-critical").textContent = info.critical === null
    ? "无（疏 → 密不发生全反射）"
    : `${info.critical.toFixed(1)}°`;
  $("#refr-canvas-status").textContent =
    `θ₁ = ${optics.theta1.toFixed(1)}° · ${mediumName(optics.n1)} → ${mediumName(optics.n2)}`;
}

function wireInteractions() {
  const { optics } = state;

  $("#refr-angle").addEventListener("input", (event) => {
    optics.theta1 = Number(event.target.value);
    $("#refr-angle-output").textContent = `${optics.theta1.toFixed(1)}°`;
    refreshReadout();
  });

  $("#refr-n1").addEventListener("input", (event) => {
    optics.n1 = Number(event.target.value);
    $("#refr-n1-output").textContent = optics.n1.toFixed(2);
    refreshReadout();
  });

  $("#refr-n2").addEventListener("input", (event) => {
    optics.n2 = Number(event.target.value);
    $("#refr-n2-output").textContent = optics.n2.toFixed(2);
    refreshReadout();
  });

  $$("[data-refr-medium]").forEach((button) => {
    button.addEventListener("click", () => {
      const which = button.dataset.refrMedium;
      const value = Number(button.dataset.refrN);
      if (which === "1") {
        optics.n1 = value;
        $("#refr-n1").value = String(value);
        $("#refr-n1-output").textContent = value.toFixed(2);
      } else {
        optics.n2 = value;
        $("#refr-n2").value = String(value);
        $("#refr-n2-output").textContent = value.toFixed(2);
      }
      refreshReadout();
    });
  });
}

export default {
  id: "light-refraction",
  name: "光的折射",

  getDefaultParams() {
    return { theta1: 40, n1: 1.0, n2: 1.33 };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { optics: new RefractionCanvas($("#refr-canvas")) };
    wireInteractions();
    refreshReadout();
  },

  // 由 scene-loader 的单一 rAF 循环调用：推进虚线流动动画
  update(params) {
    state?.optics.tick(params?.delta ?? 0.016);
  },

  dispose() {
    if (!state) return;
    state.optics.dispose();
    state = null;
    root = null;
  },
};
