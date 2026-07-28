// 四季场景：地球公转 + 23.44° 地轴倾角，演示直射纬度与昼夜长短随公转位置的变化
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const AXIAL_TILT_DEG = 23.44;

const template = `
    <style>
      .seasons-intuition {
        padding-top: clamp(40px, 5vw, 70px);
        padding-bottom: clamp(40px, 5vw, 70px);
      }
      .seasons-copy {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(22px, 3vw, 44px);
      }
      .seasons-copy article span {
        display: block;
        margin-bottom: 10px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
      }
      .seasons-copy h3 {
        margin: 0 0 10px;
        font-family: var(--serif);
        font-size: 20px;
      }
      .seasons-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .seasons-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: grab;
        touch-action: none;
      }
      .seasons-canvas:active {
        cursor: grabbing;
      }
      .seasons-jumps {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin: 6px 0 4px;
      }
      .seasons-jumps button {
        min-height: 36px;
        padding: 0 8px;
        color: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.34);
        border-radius: 3px;
        background: transparent;
        font-size: 12px;
      }
      .seasons-jumps button:hover,
      .seasons-jumps button:focus-visible,
      .seasons-jumps button.is-active {
        color: #fff;
        border-color: var(--red-bright);
      }
      .seasons-data {
        margin-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 12px;
      }
      .seasons-data div {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding: 9px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .seasons-data span {
        color: rgba(255, 255, 255, 0.65);
      }
      .seasons-data strong {
        color: #fff;
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 400;
      }
      .seasons-footnote {
        margin: 14px 0 0;
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        line-height: 1.6;
      }
      .seasons-limits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: clamp(18px, 2.4vw, 36px);
      }
      .seasons-limits-grid article {
        padding: 22px 24px;
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        background: var(--paper-2);
      }
      .seasons-limits-grid span {
        display: block;
        margin-bottom: 8px;
        color: var(--red);
        font-family: var(--mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .seasons-limits-grid h3 {
        margin: 0 0 8px;
        font-family: var(--serif);
        font-size: 19px;
      }
      .seasons-limits-grid p {
        margin: 0;
        color: var(--muted);
        font-size: 13.5px;
      }
      @media (max-width: 900px) {
        .seasons-copy,
        .seasons-limits-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>

    <div class="seasons-scene" id="main">
      <section class="hero" id="top">
        <div class="hero-copy">
          <p class="figure-no">FIG. 02 / SEASONS LAB</p>
          <h1>四季，<br />来自一根<br />倾斜的地轴</h1>
          <p class="hero-lead">
            日地距离一年只变化约 3.3%，真正改变阳光的，是 23.44° 的地轴倾角：
            它决定阳光落下的角度与白昼的长短。
          </p>
          <a class="primary-action" href="#seasons-intuition">
            开始实验
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </a>
          <p class="hero-note">
            拖动旋转 · 滚轮缩放 · 滑杆移动公转位置<br />
            昼长按理想球面几何计算，画面比例经过夸张。
          </p>
        </div>

        <div class="lab-shell" aria-label="四季公转交互实验">
          <div class="lab-canvas-wrap">
            <canvas class="seasons-canvas" id="seasons-canvas" aria-label="地球公转与地轴倾角三维模型"></canvas>
            <div class="canvas-caption">
              <span>地轴倾角 23.44° · 光照来自中心太阳</span>
              <span id="seasons-status">春分 · 直射赤道</span>
            </div>
          </div>

          <aside class="lab-controls" aria-label="实验设置">
            <h2>实验设置</h2>

            <label class="control-row" for="seasons-theta">
              <span>公转位置 θ（自春分起）</span>
              <output id="seasons-theta-output">0°</output>
            </label>
            <input id="seasons-theta" type="range" min="0" max="360" step="1" value="0" />

            <div class="seasons-jumps" role="group" aria-label="跳到节气">
              <button type="button" data-theta="0" class="is-active">春分</button>
              <button type="button" data-theta="90">夏至</button>
              <button type="button" data-theta="180">秋分</button>
              <button type="button" data-theta="270">冬至</button>
            </div>

            <div class="seasons-data" aria-live="polite">
              <div>
                <span>太阳直射纬度</span>
                <strong id="seasons-decl">0.0°（赤道）</strong>
              </div>
              <div>
                <span>北纬 40° 昼长</span>
                <strong id="seasons-day-north">12.0 小时</strong>
              </div>
              <div>
                <span>南纬 40° 昼长</span>
                <strong id="seasons-day-south">12.0 小时</strong>
              </div>
              <div>
                <span>北半球正午太阳高度（40°N）</span>
                <strong id="seasons-noon-alt">50.0°</strong>
              </div>
            </div>

            <p class="seasons-footnote">
              昼长按理想球面几何计算（cos H = −tan φ · tan δ），
              未计入大气折射与太阳视直径带来的数分钟修正。
            </p>

            <div class="lab-actions">
              <button id="seasons-reset" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
                </svg>
                重置视角
              </button>
              <button id="seasons-play" class="accent-button" type="button" aria-pressed="false">
                播放公转
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section class="seasons-intuition section-pad" id="seasons-intuition" aria-labelledby="seasons-intuition-title">
        <div class="section-heading">
          <p class="section-index">01</p>
          <div>
            <h2 id="seasons-intuition-title">直觉模型</h2>
            <p>公转一圈，地轴方向几乎不变；变的是太阳直射点落在哪条纬线上。</p>
          </div>
        </div>
        <div class="seasons-copy">
          <article>
            <span>01 / 指向不变</span>
            <h3>地轴始终指向同一方向</h3>
            <p>
              地球绕太阳公转时，自转轴始终指向天空中几乎同一个位置（北极星附近），
              与公转轨道面法线夹角约 23.44°。于是一年之中，太阳直射点在南北回归线
              （±23.44°）之间往返移动。
            </p>
          </article>
          <article>
            <span>02 / 角度决定能量</span>
            <h3>直射得多，斜射摊薄</h3>
            <p>
              直射时，单位面积地表接收的阳光最多，白昼也更长；斜射时，同一束阳光
              摊在更大的面积上，且白昼变短。北半球的夏至前后，正是“直射靠北 + 长昼”
              两个效应叠加的时候。
            </p>
          </article>
          <article>
            <span>03 / 距离不是原因</span>
            <h3>近日点反而在 1 月</h3>
            <p>
              地球轨道接近圆形：近日点在 1 月初（约 1.471 亿千米），远日点在 7 月初
              （约 1.521 亿千米），相差仅约 3.3%。若距离主导季节，南北半球就不会
              季节相反——事实恰恰相反。
            </p>
          </article>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="seasons-limits-title">
        <div class="section-heading">
          <p class="section-index">02</p>
          <div>
            <h2 id="seasons-limits-title">这个模型简化了什么</h2>
            <p>把简化说清楚，直觉才不会变成误解。</p>
          </div>
        </div>
        <div class="seasons-limits-grid">
          <article>
            <span>轨道形状</span>
            <h3>正圆代替椭圆</h3>
            <p>
              真实轨道偏心率约 0.017，地球在近日点附近走得更快（开普勒第二定律），
              因此北半球冬半年比夏半年短几天。演示中画成匀速正圆。
            </p>
          </article>
          <article>
            <span>比例</span>
            <h3>大小与距离不成比例</h3>
            <p>
              按真实比例，太阳直径约为地球的 109 倍，轨道半径约为太阳直径的 107 倍，
              无法同屏显示。这里只保留几何关系，不保留比例。
            </p>
          </article>
          <article>
            <span>气候滞后</span>
            <h3>光照不等于气温</h3>
            <p>
              海洋与大气的热惯性使最热、最冷的月份晚于夏至、冬至约一到两个月。
              本页只演示光照几何，不演示气候响应。
            </p>
          </article>
          <article>
            <span>更长的时间尺度</span>
            <h3>地轴方向并非永远不变</h3>
            <p>
              地轴以约 26000 年为周期缓慢进动（岁差），倾角本身也在 22.1°–24.5°
              之间做约 4.1 万年周期的振荡。在一年的尺度上，把它视为固定是合理近似。
            </p>
          </article>
        </div>
      </section>

      <section class="sources section-pad" aria-labelledby="seasons-sources-title">
        <div class="section-heading light-heading">
          <p class="section-index">03</p>
          <div>
            <h2 id="seasons-sources-title">来源与核验路径</h2>
            <p>数值与结论以下列资料为准。</p>
          </div>
        </div>
        <div class="source-table" role="table" aria-label="资料来源">
          <div class="source-row source-head" role="row">
            <span role="columnheader">类型</span>
            <span role="columnheader">资料</span>
            <span role="columnheader">用于核验</span>
          </div>
          <a class="source-row" role="row" href="https://spaceplace.nasa.gov/seasons/en/" target="_blank" rel="noreferrer">
            <span role="cell">NASA</span>
            <strong role="cell">NASA Space Place · What Causes the Seasons?</strong>
            <span role="cell">四季源于地轴倾角而非日地距离</span>
          </a>
          <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Axial_tilt" target="_blank" rel="noreferrer">
            <span role="cell">百科</span>
            <strong role="cell">Wikipedia · Axial tilt</strong>
            <span role="cell">倾角 23.44° 与长期变化范围</span>
          </a>
          <a class="source-row" role="row" href="https://www.timeanddate.com/astronomy/perihelion-aphelion-solstice.html" target="_blank" rel="noreferrer">
            <span role="cell">数据</span>
            <strong role="cell">timeanddate · Perihelion &amp; Aphelion</strong>
            <span role="cell">近日点在 1 月初、远日点在 7 月初及具体距离</span>
          </a>
        </div>
        <p class="source-policy">
          画面只保留几何关系：天体大小、轨道半径均未按真实比例绘制，昼长计算忽略大气折射。
        </p>
      </section>
    </div>
`;

// 场景内查询助手：始终限定在场景容器内
let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

const ORBIT_RADIUS = 6;
const SEASON_NAMES = { 0: "春分", 90: "夏至", 180: "秋分", 270: "冬至" };
const QUADRANT_NAMES = ["春分 → 夏至", "夏至 → 秋分", "秋分 → 冬至", "冬至 → 春分"];

// 理想球面昼长：cos H = -tanφ·tanδ，H 为半昼弧
function dayLengthHours(latDeg, declDeg) {
  const x = -Math.tan(THREE.MathUtils.degToRad(latDeg)) * Math.tan(THREE.MathUtils.degToRad(declDeg));
  if (x <= -1) return 24;
  if (x >= 1) return 0;
  return (Math.acos(x) / Math.PI) * 24;
}

function makeLabelSprite(text, textures) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 44px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(243, 239, 229, 0.92)";
  ctx.fillText(text, 128, 48);
  const texture = new THREE.CanvasTexture(canvas);
  textures.push(texture);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.5, 0.56, 1);
  return sprite;
}

class SeasonsScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.theta = 0;
    this.playing = false;
    this.textures = [];

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    // 窄画布（约 559×650）下拉远视点，保证轨道环与四个节气标签完整可见
    this.camera.position.set(0, 15.5, 17);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 30;
    this.controls.enablePan = false;

    this.buildScene();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
    this.setTheta(0);
  }

  buildScene() {
    // 夜半球留一点微光，便于观察
    this.scene.add(new THREE.HemisphereLight(0x93a7bd, 0x0a1524, 0.4));
    const sunLight = new THREE.PointLight(0xfff0d2, 2.4, 0, 0);
    this.scene.add(sunLight);

    // 太阳
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffb347 }),
    );
    this.scene.add(sun);

    // 公转轨道
    const orbitPoints = [];
    for (let i = 0; i <= 160; i += 1) {
      const a = (i / 160) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * ORBIT_RADIUS, 0, Math.sin(a) * ORBIT_RADIUS));
    }
    this.scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPoints),
        new THREE.LineBasicMaterial({ color: 0x6d879f, transparent: true, opacity: 0.4 }),
      ),
    );

    // 春分 / 夏至 / 秋分 / 冬至 标记（θ=0 在 +Z，θ 增大朝 -X 方向）
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 12);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xe5a526 });
    Object.entries(SEASON_NAMES).forEach(([deg, name]) => {
      const rad = THREE.MathUtils.degToRad(Number(deg));
      const x = -ORBIT_RADIUS * Math.sin(rad);
      const z = ORBIT_RADIUS * Math.cos(rad);
      const marker = new THREE.Mesh(markerGeometry.clone(), markerMaterial.clone());
      marker.position.set(x, 0, z);
      this.scene.add(marker);
      const label = makeLabelSprite(name, this.textures);
      label.position.set(x * 1.12, 0.55, z * 1.12);
      this.scene.add(label);
    });
    markerGeometry.dispose();
    markerMaterial.dispose();

    // 地球组：earthGroup 负责公转位置，tiltGroup 保持地轴指向不变，earthMesh 自转
    this.earthGroup = new THREE.Group();
    this.tiltGroup = new THREE.Group();
    // 绕 z 轴转 -23.44°：地轴向 +X 方向倾斜，且方向在公转中保持不变
    this.tiltGroup.rotation.z = -THREE.MathUtils.degToRad(AXIAL_TILT_DEG);
    this.earthGroup.add(this.tiltGroup);

    this.earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 48, 32),
      new THREE.MeshPhongMaterial({ color: 0x3f74a8, emissive: 0x07121f, shininess: 18 }),
    );
    this.tiltGroup.add(this.earthMesh);

    // 经线网格随地球自转，便于观察昼夜交替
    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(0.505, 18, 12),
      new THREE.MeshBasicMaterial({ color: 0x9dc3e2, wireframe: true, transparent: true, opacity: 0.14 }),
    );
    this.earthMesh.add(grid);

    // 地轴与北极标记
    const axisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.85, 0),
      new THREE.Vector3(0, 0.85, 0),
    ]);
    this.tiltGroup.add(new THREE.Line(axisGeometry, new THREE.LineBasicMaterial({ color: 0xe5a526 })));
    const northPole = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xe33a32 }),
    );
    northPole.position.set(0, 0.85, 0);
    this.tiltGroup.add(northPole);

    // 赤道环
    const equatorPoints = [];
    for (let i = 0; i <= 96; i += 1) {
      const a = (i / 96) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(a) * 0.52, 0, Math.sin(a) * 0.52));
    }
    this.tiltGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(equatorPoints),
        new THREE.LineBasicMaterial({ color: 0xf3efe5, transparent: true, opacity: 0.5 }),
      ),
    );

    this.scene.add(this.earthGroup);

    // 太阳到地球的光线指示
    this.rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, ORBIT_RADIUS),
    ]);
    this.scene.add(
      new THREE.Line(this.rayGeometry, new THREE.LineBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.35 })),
    );
  }

  // θ 以度计，自春分（+Z 方向）起，θ=90° 为夏至（地球在 -X，地轴倾向太阳）
  setTheta(deg) {
    this.theta = ((deg % 360) + 360) % 360;
    const rad = THREE.MathUtils.degToRad(this.theta);
    const x = -ORBIT_RADIUS * Math.sin(rad);
    const z = ORBIT_RADIUS * Math.cos(rad);
    this.earthGroup.position.set(x, 0, z);
    const positions = this.rayGeometry.attributes.position;
    positions.setXYZ(1, x, 0, z);
    positions.needsUpdate = true;
  }

  // 太阳直射纬度 δ = asin(sin ε · sin θ)
  declinationDeg() {
    const rad = THREE.MathUtils.degToRad(this.theta);
    const eps = THREE.MathUtils.degToRad(AXIAL_TILT_DEG);
    return THREE.MathUtils.radToDeg(Math.asin(Math.sin(eps) * Math.sin(rad)));
  }

  resetCamera() {
    this.camera.position.set(0, 15.5, 17);
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
    this.earthMesh.rotation.y += delta * 1.6;
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

function seasonLabel(theta) {
  const rounded = Math.round(theta) % 360;
  if (SEASON_NAMES[rounded]) return SEASON_NAMES[rounded];
  return QUADRANT_NAMES[Math.floor(theta / 90) % 4];
}

function updateReadouts() {
  const { lab } = state;
  const decl = lab.declinationDeg();
  const hemisphere = decl > 0.05 ? "N" : decl < -0.05 ? "S" : "";
  const declText = hemisphere
    ? Math.abs(decl).toFixed(1) + "°" + hemisphere
    : "0.0°（赤道）";
  $("#seasons-theta-output").textContent = Math.round(lab.theta) + "°";
  $("#seasons-decl").textContent = declText;
  $("#seasons-day-north").textContent = dayLengthHours(40, decl).toFixed(1) + " 小时";
  $("#seasons-day-south").textContent = dayLengthHours(-40, decl).toFixed(1) + " 小时";
  // 正午太阳高度（40°N）= 90° - |φ - δ|
  $("#seasons-noon-alt").textContent = (90 - Math.abs(40 - decl)).toFixed(1) + "°";
  $("#seasons-status").textContent = seasonLabel(lab.theta) + " · 直射 " + declText;
  $$(".seasons-jumps button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.theta) === Math.round(lab.theta) % 360);
  });
}

function wireInteractions() {
  const { lab } = state;
  const slider = $("#seasons-theta");
  const playButton = $("#seasons-play");

  slider.addEventListener("input", (event) => {
    lab.playing = false;
    playButton.textContent = "播放公转";
    playButton.setAttribute("aria-pressed", "false");
    lab.setTheta(Number(event.target.value));
    updateReadouts();
  });

  $$(".seasons-jumps button").forEach((button) => {
    button.addEventListener("click", () => {
      lab.playing = false;
      playButton.textContent = "播放公转";
      playButton.setAttribute("aria-pressed", "false");
      const value = Number(button.dataset.theta);
      slider.value = String(value);
      lab.setTheta(value);
      updateReadouts();
    });
  });

  playButton.addEventListener("click", () => {
    lab.playing = !lab.playing;
    playButton.textContent = lab.playing ? "暂停公转" : "播放公转";
    playButton.setAttribute("aria-pressed", String(lab.playing));
  });

  $("#seasons-reset").addEventListener("click", () => lab.resetCamera());
}

export default {
  id: "seasons",
  name: "四季",

  getDefaultParams() {
    return { theta: 0, tiltDeg: AXIAL_TILT_DEG };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { lab: new SeasonsScene3D($("#seasons-canvas")) };
    wireInteractions();
    updateReadouts();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    const delta = params?.delta ?? 0;
    const { lab } = state;
    if (lab.playing) {
      lab.setTheta(lab.theta + delta * 12);
      $("#seasons-theta").value = String(Math.round(lab.theta));
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
