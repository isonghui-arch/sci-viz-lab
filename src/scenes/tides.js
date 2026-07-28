// 潮汐场景：地月系统 + 可变形海水层，演示引潮力的双隆起、1/r³ 关系与大潮/小潮
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const EARTH_RADIUS = 0.78;
const WATER_RADIUS = 0.94;
const MOON_BASE_DIST = 3.0; // 相对距离 1.00 时的画面距离
const MOON_K0 = 0.09; // 相对距离 1.00 时的月球隆起幅度（已放大）
const SUN_RATIO = 0.46; // 太阳引潮力约为月球的 46%

const template = `
    <style>
      .tides-hero {
        max-width: var(--max);
        margin: 0 auto;
        padding: clamp(56px, 7vw, 110px) var(--gutter) clamp(24px, 3vw, 48px);
      }
      .tides-kicker {
        margin: 0 0 18px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .tides-hero h1 {
        margin: 0 0 20px;
        font-family: var(--serif);
        font-size: clamp(40px, 5.6vw, 82px);
        line-height: 1.08;
        letter-spacing: -0.04em;
      }
      .tides-lead {
        max-width: 660px;
        margin: 0;
        color: var(--muted);
        font-size: clamp(16px, 1.6vw, 19px);
      }
      .tides-intuition {
        padding-top: clamp(40px, 5vw, 70px);
        padding-bottom: clamp(40px, 5vw, 70px);
      }
      .tides-copy {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(22px, 3vw, 44px);
      }
      .tides-copy article span {
        display: block;
        margin-bottom: 10px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
      }
      .tides-copy h3 {
        margin: 0 0 10px;
        font-family: var(--serif);
        font-size: 20px;
      }
      .tides-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .tides-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: grab;
        touch-action: none;
      }
      .tides-canvas:active {
        cursor: grabbing;
      }
      .tides-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-height: 40px;
        margin: 16px 0 4px;
        padding: 0 12px;
        color: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.34);
        border-radius: 3px;
        background: transparent;
        font-size: 12px;
        width: 100%;
      }
      .tides-toggle[aria-pressed="true"] {
        color: #fff;
        border-color: var(--saffron);
      }
      .tides-toggle .tides-toggle-state {
        font-family: var(--mono);
        color: var(--saffron);
      }
      .tides-data {
        margin-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 12px;
      }
      .tides-data div {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .tides-data span {
        color: rgba(255, 255, 255, 0.65);
      }
      .tides-data strong {
        color: #fff;
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 400;
      }
      .tides-footnote {
        margin: 14px 0 0;
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        line-height: 1.6;
      }
      .tides-limits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: clamp(18px, 2.4vw, 36px);
      }
      .tides-limits-grid article {
        padding: 22px 24px;
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        background: var(--paper-2);
      }
      .tides-limits-grid span {
        display: block;
        margin-bottom: 8px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .tides-limits-grid h3 {
        margin: 0 0 8px;
        font-family: var(--serif);
        font-size: 19px;
      }
      .tides-limits-grid p {
        margin: 0;
        color: var(--muted);
        font-size: 13.5px;
      }
      @media (max-width: 900px) {
        .tides-copy,
        .tides-limits-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>

    <div class="tides-scene" id="main">
      <header class="tides-hero">
        <p class="tides-kicker">FIG. 04 / TIDES LAB</p>
        <h1>月亮拉海水，<br />拉出两个隆起</h1>
        <p class="tides-lead">
          潮汐不是月亮“吸走”海水那么简单：近月侧与远月侧同时鼓起，
          地球在双隆起下自转，多数海岸一天迎来约两次涨落。
        </p>
      </header>

      <section class="tides-intuition section-pad" aria-labelledby="tides-intuition-title">
        <div class="section-heading">
          <p class="section-index">01</p>
          <div>
            <h2 id="tides-intuition-title">直觉模型</h2>
            <p>关键不是引力本身，而是引力在地球两侧的“差值”。</p>
          </div>
        </div>
        <div class="tides-copy">
          <article>
            <span>01 / 差异引力</span>
            <h3>近侧拉得多，远侧拉得少</h3>
            <p>
              月球引力随距离衰减：地球近月一侧被拉得比地心更用力，远月一侧
              被拉得更弱。以地心为参照，两侧海水都相对“向外”偏离——
              这就是引潮力，也是双隆起的来源。
            </p>
          </article>
          <article>
            <span>02 / 立方反比</span>
            <h3>引潮力 ∝ M / r³</h3>
            <p>
              引力按 1/r² 衰减，而引潮力是引力的差值，按 1/r³ 衰减。
              太阳引力远强于月球，但因距离是地月距离的约 390 倍，
              其引潮力反而只有月球的约 46%——月球主导潮汐。
            </p>
          </article>
          <article>
            <span>03 / 大潮小潮</span>
            <h3>叠加还是抵消</h3>
            <p>
              朔（新月）与望（满月）时，日月引潮力方向成一线，隆起叠加，
              形成大潮；上弦、下弦时两者相互垂直，部分抵消，形成小潮。
              两者潮差通常相差可达一倍左右，随海区而异。
            </p>
          </article>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="tides-lab-title" style="padding-top: clamp(30px, 4vw, 60px);">
        <div class="section-heading">
          <p class="section-index">02</p>
          <div>
            <h2 id="tides-lab-title">互动实验：拉近月亮</h2>
            <p>拖动距离滑杆观察隆起幅度按 1/r³ 变化；打开太阳影响，转动月球位置演示大潮与小潮。</p>
          </div>
        </div>

        <div class="lab-shell" aria-label="潮汐交互实验">
          <div class="lab-canvas-wrap">
            <canvas class="tides-canvas" id="tides-canvas" aria-label="地月系统潮汐隆起三维模型"></canvas>
            <div class="canvas-caption">
              <span>海水层隆起已大幅夸张 · 红点为地表观察点</span>
              <span id="tides-status">引潮力 1.00× · 太阳影响关</span>
            </div>
          </div>

          <aside class="lab-controls" aria-label="实验设置">
            <h2>实验设置</h2>

            <label class="control-row" for="tides-dist">
              <span>地月距离（相对平均值）</span>
              <output id="tides-dist-output">1.00×</output>
            </label>
            <input id="tides-dist" type="range" min="0.7" max="1.3" step="0.01" value="1" />

            <label class="control-row" for="tides-angle">
              <span>月球公转位置（0° 为朔）</span>
              <output id="tides-angle-output">0°</output>
            </label>
            <input id="tides-angle" type="range" min="0" max="360" step="1" value="0" />

            <button id="tides-sun" class="tides-toggle" type="button" aria-pressed="false">
              太阳影响（演示大潮 / 小潮）
              <span class="tides-toggle-state">关</span>
            </button>

            <div class="tides-data" aria-live="polite">
              <div>
                <span>月球引潮力（相对 1/r³）</span>
                <strong id="tides-force">1.00×</strong>
              </div>
              <div>
                <span>太阳 / 月球引潮力之比</span>
                <strong id="tides-ratio">0.46（固定）</strong>
              </div>
              <div>
                <span>当前潮型</span>
                <strong id="tides-type">—（未计太阳）</strong>
              </div>
            </div>

            <p class="tides-footnote">
              真实的开阔大洋中，平衡潮隆起只有几十厘米量级；
              画面把它放大了数百万倍才肉眼可见。
            </p>

            <div class="lab-actions">
              <button id="tides-reset" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
                </svg>
                重置视角
              </button>
              <button id="tides-play" class="accent-button" type="button" aria-pressed="false">
                播放公转
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="tides-limits-title">
        <div class="section-heading">
          <p class="section-index">03</p>
          <div>
            <h2 id="tides-limits-title">这个模型简化了什么</h2>
            <p>这里演示的是“平衡潮”理想模型——真实海潮要复杂得多。</p>
          </div>
        </div>
        <div class="tides-limits-grid">
          <article>
            <span>平衡潮假设</span>
            <h3>海水被当作瞬时响应的薄壳</h3>
            <p>
              模型假设全球被均匀海水覆盖、且瞬间调整到受力平衡的形状。
              真实海水有惯性与摩擦，潮波在海盆中传播、反射、共振，
              实际高潮时刻往往滞后于月球过顶。
            </p>
          </article>
          <article>
            <span>地形</span>
            <h3>没有大陆与海底地形</h3>
            <p>
              大陆阻挡与浅海放大效应使各地潮差悬殊：开阔大洋不足 1 米，
              芬迪湾可超过 15 米。这些都无法从平衡潮模型读出。
            </p>
          </article>
          <article>
            <span>幅度与比例</span>
            <h3>隆起被放大了数百万倍</h3>
            <p>
              画面中的隆起幅度、天体大小与距离均未按真实比例绘制。
              距离滑杆对应的 0.7–1.3 倍变化范围也远大于真实月球轨道
              近地点 / 远地点约 ±5.5% 的变化。
            </p>
          </article>
          <article>
            <span>其他因素</span>
            <h3>忽略轨道倾角与固体潮</h3>
            <p>
              月球轨道相对赤道有倾角，带来周日潮不等；地壳本身也有几十厘米的
              固体潮形变；太阳距离同样有年变化。模型将这些全部略去。
            </p>
          </article>
        </div>
      </section>

      <section class="sources section-pad" aria-labelledby="tides-sources-title">
        <div class="section-heading light-heading">
          <p class="section-index">04</p>
          <div>
            <h2 id="tides-sources-title">来源与核验路径</h2>
            <p>数值与结论以下列资料为准。</p>
          </div>
        </div>
        <div class="source-table" role="table" aria-label="资料来源">
          <div class="source-row source-head" role="row">
            <span role="columnheader">类型</span>
            <span role="columnheader">资料</span>
            <span role="columnheader">用于核验</span>
          </div>
          <a class="source-row" role="row" href="https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html" target="_blank" rel="noreferrer">
            <span role="cell">NOAA</span>
            <strong role="cell">NOAA Ocean Service · Tides &amp; Water Levels</strong>
            <span role="cell">双隆起、大潮小潮与真实海潮的复杂性</span>
          </a>
          <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Tidal_force" target="_blank" rel="noreferrer">
            <span role="cell">百科</span>
            <strong role="cell">Wikipedia · Tidal force</strong>
            <span role="cell">引潮力 ∝ M/r³ 的推导与日月比较</span>
          </a>
          <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Tide" target="_blank" rel="noreferrer">
            <span role="cell">百科</span>
            <strong role="cell">Wikipedia · Tide</strong>
            <span role="cell">平衡潮理论的适用范围与各地潮差</span>
          </a>
        </div>
        <p class="source-policy">
          画面演示的是平衡潮理想模型：隆起幅度经过极度夸张，仅用于建立“差异引力 → 双隆起”的直觉。
        </p>
      </section>
    </div>
`;

// 场景内查询助手：始终限定在场景容器内
let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);

// 二阶勒让德多项式：平衡潮隆起的角度分布
function p2(x) {
  return (3 * x * x - 1) / 2;
}

class TidesScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.rel = 1; // 地月距离（相对平均值）
    this.beta = 0; // 月球公转位置角（0° 为朔，月球与太阳同侧 +X）
    this.sunOn = false;
    this.playing = false;
    this.textures = [];

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 5.6, 6.4);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 2.6;
    this.controls.maxDistance = 18;
    this.controls.enablePan = false;

    this.buildScene();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
    this.apply();
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
    sprite.scale.set(1.9, 0.48, 1);
    return sprite;
  }

  buildScene() {
    // 照明只为造型服务，与“太阳引潮”开关无关
    this.scene.add(new THREE.HemisphereLight(0xaebfd2, 0x0a1524, 0.7));
    const keyLight = new THREE.DirectionalLight(0xfff0d8, 1.7);
    keyLight.position.set(4, 6, 3);
    this.scene.add(keyLight);

    // 固体地球
    this.earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 48, 32),
      new THREE.MeshPhongMaterial({ color: 0x8a7a5c, emissive: 0x120e08, shininess: 8 }),
    );
    this.scene.add(this.earthMesh);

    // 地表观察点：随地球自转，先后穿过高潮与低潮区
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xe33a32 }),
    );
    marker.position.set(EARTH_RADIUS + 0.01, 0, 0);
    this.earthMesh.add(marker);

    // 可变形海水层
    this.waterGeometry = new THREE.SphereGeometry(WATER_RADIUS, 96, 64);
    this.baseDirections = Float32Array.from(this.waterGeometry.attributes.position.array);
    for (let i = 0; i < this.baseDirections.length; i += 1) {
      this.baseDirections[i] /= WATER_RADIUS;
    }
    this.waterMesh = new THREE.Mesh(
      this.waterGeometry,
      new THREE.MeshPhongMaterial({
        color: 0x2e7fb8,
        transparent: true,
        opacity: 0.72,
        shininess: 70,
        specular: 0x99c4e0,
      }),
    );
    this.scene.add(this.waterMesh);

    // 月球轨道（随距离滑杆整体缩放）
    const orbitPoints = [];
    for (let i = 0; i <= 128; i += 1) {
      const a = (i / 128) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * MOON_BASE_DIST, 0, Math.sin(a) * MOON_BASE_DIST));
    }
    this.orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPoints),
      new THREE.LineBasicMaterial({ color: 0x6d879f, transparent: true, opacity: 0.4 }),
    );
    this.scene.add(this.orbitLine);

    // 月球
    this.moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 32, 24),
      new THREE.MeshPhongMaterial({ color: 0xb9b4a8, emissive: 0x0a0d12, shininess: 6 }),
    );
    this.scene.add(this.moonMesh);
    this.moonLabel = this.makeLabelSprite("月球");
    this.scene.add(this.moonLabel);

    // 太阳指示（引潮方向固定在 +X），开关控制显隐
    this.sunGroup = new THREE.Group();
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 20),
      new THREE.MeshBasicMaterial({ color: 0xffb347 }),
    );
    sunDisc.position.set(5.6, 0, 0);
    this.sunGroup.add(sunDisc);
    [-1, 0, 1].forEach((z) => {
      this.sunGroup.add(
        new THREE.ArrowHelper(
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(5.0, 0, z * 1.2),
          1.1,
          0xe5a526,
          0.26,
          0.12,
        ),
      );
    });
    const sunLabel = this.makeLabelSprite("太阳（在远处）");
    sunLabel.position.set(5.6, 0.7, 0);
    this.sunGroup.add(sunLabel);
    this.sunGroup.visible = false;
    this.scene.add(this.sunGroup);
  }

  // 月球引潮力相对值：1/rel³
  moonForceRel() {
    return 1 / (this.rel * this.rel * this.rel);
  }

  // 根据当前参数重算月球位置与海水层形状
  apply() {
    const rad = THREE.MathUtils.degToRad(this.beta);
    const moonDir = new THREE.Vector3(Math.cos(rad), 0, -Math.sin(rad));
    this.moonMesh.position.copy(moonDir).multiplyScalar(MOON_BASE_DIST * this.rel);
    this.moonLabel.position.copy(this.moonMesh.position).add(new THREE.Vector3(0, 0.45, 0));
    this.orbitLine.scale.setScalar(this.rel);

    const moonK = MOON_K0 * this.moonForceRel();
    const sunK = MOON_K0 * SUN_RATIO;
    const sunDir = new THREE.Vector3(1, 0, 0);

    const positions = this.waterGeometry.attributes.position;
    const dirs = this.baseDirections;
    const u = new THREE.Vector3();
    for (let i = 0; i < positions.count; i += 1) {
      u.set(dirs[i * 3], dirs[i * 3 + 1], dirs[i * 3 + 2]);
      let displacement = moonK * p2(u.dot(moonDir));
      if (this.sunOn) displacement += sunK * p2(u.dot(sunDir));
      const r = WATER_RADIUS + displacement;
      positions.setXYZ(i, u.x * r, u.y * r, u.z * r);
    }
    positions.needsUpdate = true;
    this.waterGeometry.computeVertexNormals();
  }

  // 潮型判断：月球方向与日地连线的夹角（对称折算到 0–90°）
  tideType() {
    if (!this.sunOn) return "—（未计太阳）";
    const mod = this.beta % 180;
    const offAxis = Math.min(mod, 180 - mod);
    if (offAxis <= 30) return "大潮（朔望）";
    if (offAxis >= 60) return "小潮（上下弦）";
    return "过渡";
  }

  resetCamera() {
    this.camera.position.set(0, 5.6, 6.4);
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
    // 地球自转：观察点穿过双隆起，一圈经历约两次高潮
    this.earthMesh.rotation.y += delta * 0.7;
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

function updateReadouts() {
  const { lab } = state;
  const force = lab.moonForceRel();
  $("#tides-dist-output").textContent = lab.rel.toFixed(2) + "×";
  $("#tides-angle-output").textContent = Math.round(lab.beta) + "°";
  $("#tides-force").textContent = force.toFixed(2) + "×";
  $("#tides-type").textContent = lab.tideType();
  $("#tides-status").textContent =
    "引潮力 " + force.toFixed(2) + "× · 太阳影响" + (lab.sunOn ? "开" : "关");
}

function wireInteractions() {
  const { lab } = state;
  const playButton = $("#tides-play");

  $("#tides-dist").addEventListener("input", (event) => {
    lab.rel = Number(event.target.value);
    lab.apply();
    updateReadouts();
  });

  $("#tides-angle").addEventListener("input", (event) => {
    lab.playing = false;
    playButton.textContent = "播放公转";
    playButton.setAttribute("aria-pressed", "false");
    lab.beta = Number(event.target.value);
    lab.apply();
    updateReadouts();
  });

  $("#tides-sun").addEventListener("click", (event) => {
    lab.sunOn = !lab.sunOn;
    const button = event.currentTarget;
    button.setAttribute("aria-pressed", String(lab.sunOn));
    button.querySelector(".tides-toggle-state").textContent = lab.sunOn ? "开" : "关";
    lab.sunGroup.visible = lab.sunOn;
    lab.apply();
    updateReadouts();
  });

  playButton.addEventListener("click", () => {
    lab.playing = !lab.playing;
    playButton.textContent = lab.playing ? "暂停公转" : "播放公转";
    playButton.setAttribute("aria-pressed", String(lab.playing));
  });

  $("#tides-reset").addEventListener("click", () => lab.resetCamera());
}

export default {
  id: "tides",
  name: "潮汐",

  getDefaultParams() {
    return { rel: 1, beta: 0, sunOn: false };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { lab: new TidesScene3D($("#tides-canvas")) };
    wireInteractions();
    updateReadouts();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    const delta = params?.delta ?? 0;
    const { lab } = state;
    if (lab.playing) {
      lab.beta = ((lab.beta + delta * 16) % 360 + 360) % 360;
      $("#tides-angle").value = String(Math.round(lab.beta));
      lab.apply();
      updateReadouts();
    }
    lab.render(delta);
  },

  dispose() {
    if (!state) return;
    state.lab.dispose();
    state = null;
    root = null;
  },
};
