// 月相场景：月球绕地球公转、太阳光平行入射，滑杆控制相位角并同步显示地面视角月相
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const SYNODIC_MONTH = 29.53; // 朔望月（天）
const MOON_ORBIT_RADIUS = 3.2;

const template = `
    <style>
      .moonp-hero {
        max-width: var(--max);
        margin: 0 auto;
        padding: clamp(56px, 7vw, 110px) var(--gutter) clamp(24px, 3vw, 48px);
      }
      .moonp-kicker {
        margin: 0 0 18px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .moonp-hero h1 {
        margin: 0 0 20px;
        font-family: var(--serif);
        font-size: clamp(40px, 5.6vw, 82px);
        line-height: 1.08;
        letter-spacing: -0.04em;
      }
      .moonp-lead {
        max-width: 660px;
        margin: 0;
        color: var(--muted);
        font-size: clamp(16px, 1.6vw, 19px);
      }
      .moonp-intuition {
        padding-top: clamp(40px, 5vw, 70px);
        padding-bottom: clamp(40px, 5vw, 70px);
      }
      .moonp-copy {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(22px, 3vw, 44px);
      }
      .moonp-copy article span {
        display: block;
        margin-bottom: 10px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
      }
      .moonp-copy h3 {
        margin: 0 0 10px;
        font-family: var(--serif);
        font-size: 20px;
      }
      .moonp-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .moonp-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: grab;
        touch-action: none;
      }
      .moonp-canvas:active {
        cursor: grabbing;
      }
      .moonp-inset {
        margin: 4px 0 2px;
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 4px;
        overflow: hidden;
      }
      .moonp-inset canvas {
        display: block;
        width: 100%;
        aspect-ratio: 1 / 1;
      }
      .moonp-inset-caption {
        margin: 6px 0 0;
        color: rgba(255, 255, 255, 0.5);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.04em;
      }
      .moonp-jumps {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin: 14px 0 4px;
      }
      .moonp-jumps button {
        min-height: 34px;
        padding: 0 8px;
        color: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.34);
        border-radius: 3px;
        background: transparent;
        font-size: 12px;
      }
      .moonp-jumps button:hover,
      .moonp-jumps button:focus-visible,
      .moonp-jumps button.is-active {
        color: #fff;
        border-color: var(--red-bright);
      }
      .moonp-data {
        margin-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 12px;
      }
      .moonp-data div {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .moonp-data span {
        color: rgba(255, 255, 255, 0.65);
      }
      .moonp-data strong {
        color: #fff;
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 400;
      }
      .moonp-months {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(18px, 2.4vw, 36px);
        margin-bottom: 28px;
      }
      .moonp-months article {
        padding: 24px 26px;
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        background: var(--paper-2);
      }
      .moonp-months span {
        display: block;
        margin-bottom: 8px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .moonp-months strong {
        display: block;
        margin-bottom: 8px;
        font-family: var(--serif);
        font-size: clamp(26px, 3vw, 40px);
        line-height: 1.1;
      }
      .moonp-months p {
        margin: 0;
        color: var(--muted);
        font-size: 13.5px;
      }
      .moonp-months-note {
        max-width: 820px;
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .moonp-limits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: clamp(18px, 2.4vw, 36px);
      }
      .moonp-limits-grid article {
        padding: 22px 24px;
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        background: var(--paper-2);
      }
      .moonp-limits-grid span {
        display: block;
        margin-bottom: 8px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .moonp-limits-grid h3 {
        margin: 0 0 8px;
        font-family: var(--serif);
        font-size: 19px;
      }
      .moonp-limits-grid p {
        margin: 0;
        color: var(--muted);
        font-size: 13.5px;
      }
      @media (max-width: 900px) {
        .moonp-copy,
        .moonp-months,
        .moonp-limits-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>

    <div class="moonp-scene" id="main">
      <header class="moonp-hero">
        <p class="moonp-kicker">FIG. 03 / MOON PHASES LAB</p>
        <h1>月亮没有变，<br />变的是我们的视角</h1>
        <p class="moonp-lead">
          太阳永远照亮月球的一半。月球绕地球公转时，我们看到那被照亮的半球
          以不同的侧面朝向我们——这就是月相。
        </p>
      </header>

      <section class="moonp-intuition section-pad" aria-labelledby="moonp-intuition-title">
        <div class="section-heading">
          <p class="section-index">01</p>
          <div>
            <h2 id="moonp-intuition-title">直觉模型</h2>
            <p>月相不是地球影子，而是“日–地–月”三者夹角的几何结果。</p>
          </div>
        </div>
        <div class="moonp-copy">
          <article>
            <span>01 / 永远半亮</span>
            <h3>太阳光近似平行入射</h3>
            <p>
              太阳距离约为地月距离的 390 倍，射到地月系统的阳光可以视为平行光束。
              无论月球在轨道何处，它总有一半被照亮、一半处于黑夜——变化的只是
              我们能看到亮面的多少。
            </p>
          </article>
          <article>
            <span>02 / 夹角决定形状</span>
            <h3>相位角从新月数起</h3>
            <p>
              新月时月球位于太阳与地球之间，亮面背对我们；满月时地球居中，
              亮面正对我们。从新月起算的相位角每转过约 45°，就依次出现
              娥眉月、上弦月、盈凸月、满月，再对称地亏回去。
            </p>
          </article>
          <article>
            <span>03 / 常见误解</span>
            <h3>月相不是地影</h3>
            <p>
              地球影子落在月面上的现象叫月食，只发生在满月且三者近乎精确成一线时。
              日常的月相圆缺与地影无关——不然弦月的明暗界线不会是那条柔和的椭圆弧。
            </p>
          </article>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="moonp-lab-title" style="padding-top: clamp(30px, 4vw, 60px);">
        <div class="section-heading">
          <p class="section-index">02</p>
          <div>
            <h2 id="moonp-lab-title">互动实验：转动月球</h2>
            <p>拖动滑杆改变月球的轨道相位角，右侧小窗同步给出从地球看到的月相。</p>
          </div>
        </div>

        <div class="lab-shell" aria-label="月相交互实验">
          <div class="lab-canvas-wrap">
            <canvas class="moonp-canvas" id="moonp-canvas" aria-label="月球绕地球公转三维模型"></canvas>
            <div class="canvas-caption">
              <span>俯视北天极 · 阳光自右侧平行入射</span>
              <span id="moonp-status">新月 · 照亮 0%</span>
            </div>
          </div>

          <aside class="lab-controls" aria-label="实验设置">
            <h2>实验设置</h2>

            <div class="moonp-inset">
              <canvas id="moonp-inset-canvas" aria-label="从地球看到的月相"></canvas>
            </div>
            <p class="moonp-inset-caption">从地球看到的月相 · 北半球视角</p>

            <label class="control-row" for="moonp-phase">
              <span>轨道相位角 α（自新月起）</span>
              <output id="moonp-phase-output">0°</output>
            </label>
            <input id="moonp-phase" type="range" min="0" max="360" step="1" value="0" />

            <div class="moonp-jumps" role="group" aria-label="跳到月相">
              <button type="button" data-phase="0" class="is-active">新月</button>
              <button type="button" data-phase="90">上弦月</button>
              <button type="button" data-phase="180">满月</button>
              <button type="button" data-phase="270">下弦月</button>
            </div>

            <div class="moonp-data" aria-live="polite">
              <div>
                <span>月相</span>
                <strong id="moonp-name">新月</strong>
              </div>
              <div>
                <span>照亮比例</span>
                <strong id="moonp-illum">0%</strong>
              </div>
              <div>
                <span>月龄（朔望月 29.53 天）</span>
                <strong id="moonp-age">第 0.0 天</strong>
              </div>
            </div>

            <div class="lab-actions">
              <button id="moonp-reset" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
                </svg>
                重置视角
              </button>
              <button id="moonp-play" class="accent-button" type="button" aria-pressed="false">
                播放公转
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="moonp-months-title">
        <div class="section-heading">
          <p class="section-index">03</p>
          <div>
            <h2 id="moonp-months-title">两种“一个月”</h2>
            <p>月球转回同一位置，和月相转回同一形状，不是同一件事。</p>
          </div>
        </div>
        <div class="moonp-months">
          <article>
            <span>恒星月 · Sidereal</span>
            <strong>27.32 天</strong>
            <p>
              以遥远恒星为参照，月球绕地球公转一整圈所需的时间。
              这是轨道运动本身的周期。
            </p>
          </article>
          <article>
            <span>朔望月 · Synodic</span>
            <strong>29.53 天</strong>
            <p>
              从新月到下一次新月的时间。月相取决于“日–地–月”夹角，
              这也是农历一个月的依据。
            </p>
          </article>
        </div>
        <p class="moonp-months-note">
          差别的来源：在月球公转的这一个月里，地球自己也沿公转轨道前进了约 27°。
          月球转满一圈（恒星月）后，还要再追赶约 27° 才能回到与太阳同侧的位置，
          多花约 2.2 天——所以朔望月比恒星月长。
        </p>
      </section>

      <section class="section-pad" aria-labelledby="moonp-limits-title" style="padding-top: 0;">
        <div class="section-heading">
          <p class="section-index">04</p>
          <div>
            <h2 id="moonp-limits-title">这个模型简化了什么</h2>
            <p>把简化说清楚，直觉才不会变成误解。</p>
          </div>
        </div>
        <div class="moonp-limits-grid">
          <article>
            <span>轨道</span>
            <h3>圆轨道与共面假设</h3>
            <p>
              真实月球轨道偏心率约 0.055，且相对黄道面倾斜约 5.1°——正因为这个倾角，
              并非每个朔望都发生日食或月食。演示中轨道画成同一平面内的正圆。
            </p>
          </article>
          <article>
            <span>比例</span>
            <h3>大小与距离不成比例</h3>
            <p>
              地月平均距离约 38.44 万千米，约为地球直径的 30 倍；按真实比例，
              画面上几乎看不到月球。这里只保留角度关系。
            </p>
          </article>
          <article>
            <span>光照</span>
            <h3>忽略地照与天平动</h3>
            <p>
              娥眉月的暗面常隐约可见，那是地球反照的“地照”；月球的天平动
              让我们实际能看到约 59% 的月面。两者均未在模型中体现。
            </p>
          </article>
          <article>
            <span>视角</span>
            <h3>小窗采用北半球视角</h3>
            <p>
              月相小窗按北半球中纬度习惯绘制：盈月亮在右、亏月亮在左。
              在南半球观察，左右正好相反。
            </p>
          </article>
        </div>
      </section>

      <section class="sources section-pad" aria-labelledby="moonp-sources-title">
        <div class="section-heading light-heading">
          <p class="section-index">05</p>
          <div>
            <h2 id="moonp-sources-title">来源与核验路径</h2>
            <p>数值与结论以下列资料为准。</p>
          </div>
        </div>
        <div class="source-table" role="table" aria-label="资料来源">
          <div class="source-row source-head" role="row">
            <span role="columnheader">类型</span>
            <span role="columnheader">资料</span>
            <span role="columnheader">用于核验</span>
          </div>
          <a class="source-row" role="row" href="https://science.nasa.gov/moon/moon-phases/" target="_blank" rel="noreferrer">
            <span role="cell">NASA</span>
            <strong role="cell">NASA Science · Moon Phases</strong>
            <span role="cell">八个月相的定义与成因</span>
          </a>
          <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Lunar_phase" target="_blank" rel="noreferrer">
            <span role="cell">百科</span>
            <strong role="cell">Wikipedia · Lunar phase</strong>
            <span role="cell">相位角、照亮比例与南北半球视角差异</span>
          </a>
          <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Lunar_month" target="_blank" rel="noreferrer">
            <span role="cell">百科</span>
            <strong role="cell">Wikipedia · Lunar month</strong>
            <span role="cell">朔望月 29.53 天与恒星月 27.32 天</span>
          </a>
        </div>
        <p class="source-policy">
          画面只保留角度关系：天体大小、轨道半径均未按真实比例绘制；月相小窗为几何近似图，非照片。
        </p>
      </section>
    </div>
`;

// 场景内查询助手：始终限定在场景容器内
let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

// 八相命名：以相位角 α（自新月起）划分
function phaseName(alpha) {
  const a = ((alpha % 360) + 360) % 360;
  if (a < 11.25 || a >= 348.75) return "新月";
  if (a < 78.75) return "娥眉月";
  if (a < 101.25) return "上弦月";
  if (a < 168.75) return "盈凸月";
  if (a < 191.25) return "满月";
  if (a < 258.75) return "亏凸月";
  if (a < 281.25) return "下弦月";
  return "残月";
}

class MoonPhaseScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.alpha = 0;
    this.playing = false;
    this.textures = [];

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 6.2, 7.6);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.enablePan = false;

    this.buildScene();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
    this.setAlpha(0);
  }

  makeLabelSprite(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    ctx.font = "600 38px 'PingFang SC', 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(243, 239, 229, 0.9)";
    ctx.fillText(text, 192, 48);
    const texture = new THREE.CanvasTexture(canvas);
    this.textures.push(texture);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    sprite.scale.set(2.1, 0.52, 1);
    return sprite;
  }

  buildScene() {
    this.scene.add(new THREE.HemisphereLight(0x93a7bd, 0x0a1524, 0.35));
    // 平行光模拟远处的太阳，自 +X 方向入射
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.6);
    sunLight.position.set(12, 0, 0);
    this.scene.add(sunLight);

    // 地球
    this.earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 48, 32),
      new THREE.MeshPhongMaterial({ color: 0x3f74a8, emissive: 0x07121f, shininess: 18 }),
    );
    this.scene.add(this.earthMesh);

    // 月球轨道
    const orbitPoints = [];
    for (let i = 0; i <= 128; i += 1) {
      const a = (i / 128) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * MOON_ORBIT_RADIUS, 0, Math.sin(a) * MOON_ORBIT_RADIUS));
    }
    this.scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPoints),
        new THREE.LineBasicMaterial({ color: 0x6d879f, transparent: true, opacity: 0.4 }),
      ),
    );

    // 月球（潮汐锁定：自转与公转同步，同一面朝向地球）
    this.moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 40, 28),
      new THREE.MeshPhongMaterial({ color: 0xb9b4a8, emissive: 0x0a0d12, shininess: 6 }),
    );
    this.scene.add(this.moonMesh);

    // 平行阳光箭头
    [-2.4, 0, 2.4].forEach((z) => {
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(6.4, 0, z),
        1.8,
        0xe5a526,
        0.34,
        0.15,
      );
      this.scene.add(arrow);
    });
    const sunLabel = this.makeLabelSprite("阳光 · 平行入射");
    sunLabel.position.set(5.9, 0.8, 0);
    this.scene.add(sunLabel);
  }

  // α=0 新月（月球在地球与太阳之间，即 +X 侧）；α 增大为北天极俯视的逆时针方向
  setAlpha(deg) {
    this.alpha = ((deg % 360) + 360) % 360;
    const rad = THREE.MathUtils.degToRad(this.alpha);
    this.moonMesh.position.set(
      Math.cos(rad) * MOON_ORBIT_RADIUS,
      0,
      -Math.sin(rad) * MOON_ORBIT_RADIUS,
    );
    // 同步自转：同一面始终朝向地球
    this.moonMesh.rotation.y = rad;
  }

  illuminatedFraction() {
    return (1 - Math.cos(THREE.MathUtils.degToRad(this.alpha))) / 2;
  }

  resetCamera() {
    this.camera.position.set(0, 6.2, 7.6);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.camera.aspect = parent.clientWidth / Math.max(1, parent.clientHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(parent.clientWidth, parent.clientHeight, false);
  }

  render(delta) {
    this.earthMesh.rotation.y += delta * 0.9;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.scene.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material?.dispose();
      }
    });
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
  }
}

// 月相小窗：半圆 + 椭圆修正的经典画法（北半球视角，盈月亮在右）
class PhaseInset {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.alpha = 0;
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(1, rect.width);
    this.canvas.width = Math.floor(size * dpr);
    this.canvas.height = Math.floor(size * dpr);
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0a1524";
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.36;
    const a = ((this.alpha % 360) + 360) % 360;
    const cosA = Math.cos(THREE.MathUtils.degToRad(a));
    const waxing = a <= 180;
    const dark = "#242b38";
    const lit = "#efe9da";

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // 暗面打底
    ctx.fillStyle = dark;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // 亮面半圆：盈月在右，亏月在左
    ctx.fillStyle = lit;
    ctx.beginPath();
    ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, !waxing);
    ctx.closePath();
    ctx.fill();

    // 明暗界线的椭圆修正：cosα>0 为蛾眉（椭圆压暗），cosα<0 为凸月（椭圆补亮）
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * Math.abs(cosA), R, 0, 0, Math.PI * 2);
    ctx.fillStyle = cosA > 0 ? dark : lit;
    ctx.fill();

    // 几处淡环形山，增加质感
    ctx.fillStyle = "rgba(10, 15, 24, 0.14)";
    [
      [-0.32, -0.18, 0.16],
      [0.2, 0.26, 0.12],
      [0.05, -0.36, 0.09],
      [-0.12, 0.32, 0.07],
    ].forEach(([dx, dy, r]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * R * 1.6, cy + dy * R * 1.6, r * R, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
  }

  setAlpha(alpha) {
    this.alpha = alpha;
    this.draw();
  }

  dispose() {
    this.resizeObserver.disconnect();
  }
}

function updateReadouts() {
  const { lab, inset } = state;
  const name = phaseName(lab.alpha);
  const illum = Math.round(lab.illuminatedFraction() * 100);
  const age = (lab.alpha / 360) * SYNODIC_MONTH;
  $("#moonp-phase-output").textContent = Math.round(lab.alpha) + "°";
  $("#moonp-name").textContent = name;
  $("#moonp-illum").textContent = illum + "%";
  $("#moonp-age").textContent = "第 " + age.toFixed(1) + " 天";
  $("#moonp-status").textContent = name + " · 照亮 " + illum + "%";
  inset.setAlpha(lab.alpha);
  $$(".moonp-jumps button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.phase) === Math.round(lab.alpha) % 360);
  });
}

function wireInteractions() {
  const { lab } = state;
  const slider = $("#moonp-phase");
  const playButton = $("#moonp-play");

  slider.addEventListener("input", (event) => {
    lab.playing = false;
    playButton.textContent = "播放公转";
    playButton.setAttribute("aria-pressed", "false");
    lab.setAlpha(Number(event.target.value));
    updateReadouts();
  });

  $$(".moonp-jumps button").forEach((button) => {
    button.addEventListener("click", () => {
      lab.playing = false;
      playButton.textContent = "播放公转";
      playButton.setAttribute("aria-pressed", "false");
      const value = Number(button.dataset.phase);
      slider.value = String(value);
      lab.setAlpha(value);
      updateReadouts();
    });
  });

  playButton.addEventListener("click", () => {
    lab.playing = !lab.playing;
    playButton.textContent = lab.playing ? "暂停公转" : "播放公转";
    playButton.setAttribute("aria-pressed", String(lab.playing));
  });

  $("#moonp-reset").addEventListener("click", () => lab.resetCamera());
}

export default {
  id: "moon-phases",
  name: "月相",

  getDefaultParams() {
    return { alpha: 0, synodicDays: SYNODIC_MONTH };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = {
      lab: new MoonPhaseScene3D($("#moonp-canvas")),
      inset: new PhaseInset($("#moonp-inset-canvas")),
    };
    wireInteractions();
    updateReadouts();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    const delta = params?.delta ?? 0;
    const { lab } = state;
    if (lab.playing) {
      lab.setAlpha(lab.alpha + delta * 18);
      $("#moonp-phase").value = String(Math.round(lab.alpha));
      updateReadouts();
    }
    lab.render(delta);
  },

  dispose() {
    if (!state) return;
    state.lab.dispose();
    state.inset.dispose();
    state = null;
    root = null;
  },
};
