// 太阳系场景：八大行星轨道与公转（周期比例真实）、时间倍速、尺度切换、火星逆行演示
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const template = `
  <style>
    .ss-scene #ss-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
    }
    .ss-scene #ss-canvas:active { cursor: grabbing; }
    .ss-intuition-copy { max-width: 850px; }
    .ss-intuition-copy p { margin: 0 0 18px; color: var(--muted, #555); font-size: 16px; line-height: 1.9; }
    .ss-intuition-copy p strong { color: inherit; }
    .ss-status {
      margin: 18px 0 4px;
      padding: 13px 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }
    .ss-status .ss-clock {
      display: block;
      font-family: var(--serif, Georgia, serif);
      font-size: 19px;
      line-height: 1.25;
      color: #ffb52b;
    }
    .ss-status .ss-detail {
      display: block;
      margin-top: 7px;
      font-family: var(--mono, monospace);
      font-size: 11px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.66);
    }
    .ss-legend {
      margin: 16px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 10px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.72);
    }
    .ss-legend li { display: flex; align-items: center; gap: 6px; }
    .ss-legend i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }
    .ss-scene .lab-actions { margin-top: 16px; flex-wrap: wrap; }
  </style>

  <div class="ss-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 04 / SOLAR SYSTEM LAB</p>
        <h1>八颗行星，<br />同一套<br />钟表齿轮。</h1>
        <p class="hero-lead">
          水星 88 天转一圈，海王星要 165 年。把时间拨快，行星的节奏差立刻显形。
        </p>
        <a class="primary-action" href="#ss-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          拖动旋转 · 滚轮缩放 · 滑杆调节时间倍速<br />
          公转周期比例真实，行星大小经过夸张。
        </p>
      </div>

      <div class="lab-shell" aria-label="太阳系三维交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="ss-canvas" aria-label="八大行星轨道与公转三维模型"></canvas>
          <div class="canvas-caption">
            <span id="ss-caption">压缩尺度 · 行星大小非真实比例</span>
            <span id="ss-retro-note"></span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="实验设置">
          <h2>实验设置</h2>

          <div class="ss-status" aria-live="polite">
            <span class="ss-clock" id="ss-clock">第 0 天</span>
            <span class="ss-detail" id="ss-detail">时间静止</span>
          </div>

          <label class="control-row" for="ss-speed">
            <span>时间倍速</span>
            <output id="ss-speed-output">10 天/秒</output>
          </label>
          <input id="ss-speed" type="range" min="0" max="100" step="1" value="50" />

          <div class="lab-actions">
            <button id="ss-scale-toggle" class="accent-button" type="button" aria-pressed="false">
              切换为真实间距
            </button>
            <button id="ss-retro-toggle" type="button" aria-pressed="false">
              开启火星逆行演示
            </button>
            <button id="ss-reset-camera" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
              </svg>
              重置视角
            </button>
          </div>

          <ul class="ss-legend" id="ss-legend" aria-label="行星与公转周期"></ul>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="ss-intuition" aria-labelledby="ss-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="ss-intuition-title">直觉模型：越远越慢的行星</h2>
          <p>公转周期不是随意的，它被开普勒第三定律锁死在轨道半径上。</p>
        </div>
      </div>
      <div class="ss-intuition-copy">
        <p>
          行星离太阳越远，走得越慢，路也越长。开普勒第三定律给出精确关系：<strong>周期的平方
          正比于轨道半长轴的立方</strong>。海王星距离太阳约 30 天文单位，周期便是
          30<sup>1.5</sup> ≈ 165 个地球年——自 1846 年被发现以来，它刚完成第一整圈。
        </p>
        <p>
          真实比例下的太阳系几乎全是空隙：若把地球轨道画成 1 米，海王星在 30 米外，而行星本身
          小到看不见。因此本实验提供两种画法——压缩尺度便于总览节奏，真实间距还原空旷本相。
        </p>
        <p>
          "火星逆行"曾困扰古代天文学家上千年：火星通常相对恒星背景向东走，每约 26 个月却倒退
          数周。哥白尼给出的解释很朴素——地球在内圈跑得快（约 30 km/s 对火星 24 km/s），每次
          "超车"时，从地球看去火星就在天幕上打了一个回环。打开逆行演示，观察视线轨迹。
        </p>
      </div>
    </section>

    <section class="section-pad" aria-labelledby="ss-limits-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="ss-limits-title">这个模型简化了什么</h2>
          <p>周期比例可信，形状与大小另当别论。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>轨道简化</span>
          <h3>圆轨道 + 共面假设</h3>
          <p>
            真实行星轨道是椭圆（水星偏心率 0.206），且各有数度的轨道倾角。这里一律画成同一
            平面上的圆，公转角速度取平均值，不含近日点加速。
          </p>
        </article>
        <article>
          <span>比例夸张</span>
          <h3>行星大小放大了上千倍</h3>
          <p>
            按真实比例，地球直径不足其轨道直径的两万分之一。画面中的行星半径只保留彼此的
            大小次序（木星最大、水星最小），绝对比例完全失真。
          </p>
        </article>
        <article>
          <span>取舍</span>
          <h3>不含卫星、矮行星与自转</h3>
          <p>
            月球、木星伽利略卫星、小行星带与冥王星等矮行星均未画出；行星自转与轴倾角也被
            省略。逆行演示中的"天幕"只是一个固定半径的假想球面。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="ss-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="ss-sources-title">来源与核验路径</h2>
          <p>轨道半长轴与公转周期取自 NASA 行星数据表。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noreferrer">
          <span role="cell">官方数据</span>
          <strong role="cell">NASA · Planetary Fact Sheet</strong>
          <span role="cell">八大行星的轨道半长轴与公转周期</span>
        </a>
        <a class="source-row" role="row" href="https://science.nasa.gov/solar-system/planets/" target="_blank" rel="noreferrer">
          <span role="cell">官方科普</span>
          <strong role="cell">NASA Science · Planets</strong>
          <span role="cell">行星次序、大小关系与轨道概况</span>
        </a>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Apparent_retrograde_motion" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Apparent retrograde motion</strong>
          <span role="cell">火星逆行的视运动成因与约 26 个月的会合周期</span>
        </a>
      </div>
      <p class="source-policy">
        画面用于建立节奏与尺度直觉；查询行星实时位置请以 JPL Horizons 等星历系统为准。
      </p>
    </section>
  </div>
`;

// 八大行星：半长轴（AU）、公转周期（地球日，比例真实）、示意颜色与夸张半径
const PLANETS = [
  { name: "水星", a: 0.387, period: 87.97, color: 0x9c8f80, size: 0.11, label: "88 天" },
  { name: "金星", a: 0.723, period: 224.7, color: 0xd8b57c, size: 0.17, label: "225 天" },
  { name: "地球", a: 1.0, period: 365.25, color: 0x4f7fc2, size: 0.18, label: "1 年" },
  { name: "火星", a: 1.524, period: 686.98, color: 0xc4553b, size: 0.14, label: "1.9 年" },
  { name: "木星", a: 5.203, period: 4332.59, color: 0xc9a06e, size: 0.46, label: "11.9 年" },
  { name: "土星", a: 9.537, period: 10759.22, color: 0xd9c08a, size: 0.4, label: "29.5 年" },
  { name: "天王星", a: 19.191, period: 30688.5, color: 0x8fc6cf, size: 0.26, label: "84 年" },
  { name: "海王星", a: 30.069, period: 60182, color: 0x4f6fb8, size: 0.25, label: "164.8 年" },
];

const EARTH_INDEX = 2;
const MARS_INDEX = 3;
const TRAIL_MAX = 360; // 逆行轨迹最大采样点数
const TRAIL_STEP_DAYS = 3; // 每 3 个模拟日采样一次

function disposeObject(object) {
  object.geometry?.dispose();
  if (Array.isArray(object.material)) {
    object.material.forEach((material) => material.dispose());
  } else {
    object.material?.dispose();
  }
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    disposeObject(child);
  }
}

class SolarSystemScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.simDays = 0;
    this.daysPerSecond = 10;
    this.compact = true; // true = 压缩尺度，false = 真实间距
    this.retro = false;
    this.trailPoints = [];
    this.daysSinceSample = 0;
    // 初始相位取黄金角错开，避免行星排成一线
    this.angles = PLANETS.map((_, i) => (i * 2.3999632) % (Math.PI * 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(46, 1, 0.01, 600);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 220;
    this.controls.enablePan = false;

    this.orbitGroup = new THREE.Group(); // 轨道环，尺度切换时重建
    this.retroGroup = new THREE.Group(); // 逆行视线 + 轨迹 + 天幕
    this.scene.add(this.orbitGroup, this.retroGroup);

    this.buildStatics();
    this.rebuildOrbits();
    this.resetCamera();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  // 轨道半径映射：压缩尺度用平方根缓和外行星距离，真实尺度按 AU 线性
  orbitRadius(au) {
    return this.compact ? 3.4 * Math.sqrt(au) : 1.7 * au;
  }

  celestialRadius() {
    return this.compact ? 26 : 70;
  }

  buildStatics() {
    this.scene.add(new THREE.AmbientLight(0x2c3a4d, 1.6));
    // decay = 0：不随距离衰减，保证海王星与水星亮度一致可读
    const sunPoint = new THREE.PointLight(0xfff0d0, 2.4, 0, 0);
    this.scene.add(sunPoint);

    // 星空
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(280);
      positions.set([v.x, v.y, v.z], i * 3);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xcfd8e6, size: 0.5, transparent: true, opacity: 0.6 }),
    );
    this.scene.add(this.stars);

    // 太阳
    this.sun = new THREE.Mesh(
      new THREE.SphereGeometry(1, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffd984, toneMapped: false }),
    );
    this.sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffb84d,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    this.scene.add(this.sun, this.sunHalo);

    // 行星
    this.planetMeshes = PLANETS.map((planet) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.size, 28, 28),
        new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.9, metalness: 0 }),
      );
      this.scene.add(mesh);
      return mesh;
    });

    // 土星环
    this.saturnRing = new THREE.Mesh(
      new THREE.RingGeometry(PLANETS[5].size * 1.4, PLANETS[5].size * 2.2, 48),
      new THREE.MeshBasicMaterial({
        color: 0xcbb287,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.saturnRing.rotation.x = Math.PI / 2 - 0.45;
    this.scene.add(this.saturnRing);

    // 逆行演示：视线（2 点动态更新）与轨迹线
    this.sightLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineBasicMaterial({ color: 0xe7a329, transparent: true, opacity: 0.9 }),
    );
    this.trailLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xe43b32, transparent: true, opacity: 0.85 }),
    );
    this.retroGroup.add(this.sightLine, this.trailLine);
    this.retroGroup.visible = false;
  }

  rebuildOrbits() {
    clearGroup(this.orbitGroup);
    PLANETS.forEach((planet) => {
      const radius = this.orbitRadius(planet.a);
      const points = [];
      for (let i = 0; i <= 180; i += 1) {
        const a = (i / 180) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x6d879f, transparent: true, opacity: 0.3 }),
      );
      this.orbitGroup.add(ring);
    });
    // 真实间距下缩小太阳，避免吞掉水星轨道
    const sunScale = this.compact ? 1 : 0.55;
    this.sun.scale.setScalar(sunScale);
    this.sunHalo.scale.setScalar(sunScale);
    this.updatePlanetPositions();
  }

  planetPosition(index) {
    const radius = this.orbitRadius(PLANETS[index].a);
    const angle = this.angles[index];
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }

  updatePlanetPositions() {
    this.planetMeshes.forEach((mesh, index) => {
      mesh.position.copy(this.planetPosition(index));
    });
    this.saturnRing.position.copy(this.planetMeshes[5].position);
  }

  // 逆行演示：地球→火星视线延长至假想天幕，采样交点成轨迹
  updateRetro(advancedDays) {
    if (!this.retro) return;
    const earth = this.planetPosition(EARTH_INDEX);
    const mars = this.planetPosition(MARS_INDEX);
    const dir = mars.clone().sub(earth).normalize();
    const skyPoint = earth.clone().addScaledVector(dir, this.celestialRadius());

    const sight = this.sightLine.geometry.attributes.position;
    sight.setXYZ(0, earth.x, earth.y, earth.z);
    sight.setXYZ(1, skyPoint.x, skyPoint.y, skyPoint.z);
    sight.needsUpdate = true;

    this.daysSinceSample += advancedDays;
    if (this.daysSinceSample >= TRAIL_STEP_DAYS) {
      this.daysSinceSample = 0;
      this.trailPoints.push(skyPoint);
      if (this.trailPoints.length > TRAIL_MAX) this.trailPoints.shift();
      this.trailLine.geometry.dispose();
      this.trailLine.geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    }
  }

  setSpeed(daysPerSecond) {
    this.daysPerSecond = daysPerSecond;
  }

  setCompact(compact) {
    this.compact = compact;
    this.clearTrail();
    this.rebuildOrbits();
    this.resetCamera();
  }

  setRetro(enabled) {
    this.retro = enabled;
    this.retroGroup.visible = enabled;
    this.clearTrail();
  }

  clearTrail() {
    this.trailPoints = [];
    this.daysSinceSample = 0;
    this.trailLine.geometry.dispose();
    this.trailLine.geometry = new THREE.BufferGeometry();
  }

  resetCamera() {
    // 窄画布（约 559×650）下拉远基准视点，保证海王星轨道完整可见
    const dist = this.compact ? 1 : 2.6;
    this.camera.position.set(0, 31 * dist, 46 * dist);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  render(delta) {
    const advancedDays = delta * this.daysPerSecond;
    if (advancedDays > 0) {
      this.simDays += advancedDays;
      PLANETS.forEach((planet, index) => {
        this.angles[index] =
          (this.angles[index] + (advancedDays / planet.period) * Math.PI * 2) % (Math.PI * 2);
      });
      this.updatePlanetPositions();
      this.updateRetro(advancedDays);
    }
    this.stars.rotation.y += delta * 0.002;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    clearGroup(this.orbitGroup);
    this.scene.traverse((object) => disposeObject(object));
    this.renderer.dispose();
  }
}

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);

// 滑杆值（0-100）→ 天/秒：0 静止，其余按 10^(v/25 - 1) 取 0.1 ~ 1000
function sliderToSpeed(value) {
  return value === 0 ? 0 : 10 ** (value / 25 - 1);
}

function formatSpeed(daysPerSecond) {
  if (daysPerSecond === 0) return "暂停";
  if (daysPerSecond >= 365.25) return `${(daysPerSecond / 365.25).toFixed(1)} 年/秒`;
  if (daysPerSecond >= 10) return `${Math.round(daysPerSecond)} 天/秒`;
  return `${daysPerSecond.toFixed(1)} 天/秒`;
}

function formatClock(simDays) {
  const years = Math.floor(simDays / 365.25);
  const days = Math.floor(simDays % 365.25);
  return years > 0 ? `第 ${years} 年 ${days} 天` : `第 ${days} 天`;
}

function syncStatus() {
  const scene3d = state.scene3d;
  $("#ss-clock").textContent = formatClock(scene3d.simDays);
  const lines = [
    scene3d.daysPerSecond === 0 ? "时间静止" : `倍速 ${formatSpeed(scene3d.daysPerSecond)}`,
  ];
  if (scene3d.retro) {
    lines.push("红线：火星在天幕上的视轨迹");
  }
  $("#ss-detail").textContent = lines.join("\n");
}

function buildLegend() {
  const legend = $("#ss-legend");
  PLANETS.forEach((planet) => {
    const item = document.createElement("li");
    const dot = document.createElement("i");
    dot.style.background = `#${planet.color.toString(16).padStart(6, "0")}`;
    const text = document.createElement("span");
    text.textContent = `${planet.name} · ${planet.label}`;
    item.append(dot, text);
    legend.appendChild(item);
  });
}

function wireInteractions() {
  const scene3d = state.scene3d;

  $("#ss-speed").addEventListener("input", (event) => {
    const speed = sliderToSpeed(Number(event.target.value));
    scene3d.setSpeed(speed);
    $("#ss-speed-output").textContent = formatSpeed(speed);
    syncStatus();
  });

  const scaleToggle = $("#ss-scale-toggle");
  scaleToggle.addEventListener("click", () => {
    const toReal = scene3d.compact;
    scene3d.setCompact(!toReal);
    scaleToggle.textContent = toReal ? "切换为压缩尺度" : "切换为真实间距";
    scaleToggle.setAttribute("aria-pressed", String(toReal));
    $("#ss-caption").textContent = toReal
      ? "真实间距（AU 等比）· 行星大小非真实比例"
      : "压缩尺度 · 行星大小非真实比例";
  });

  const retroToggle = $("#ss-retro-toggle");
  retroToggle.addEventListener("click", () => {
    const enabled = !scene3d.retro;
    scene3d.setRetro(enabled);
    retroToggle.textContent = enabled ? "关闭火星逆行演示" : "开启火星逆行演示";
    retroToggle.setAttribute("aria-pressed", String(enabled));
    $("#ss-retro-note").textContent = enabled ? "黄线为地球→火星视线，红线为视轨迹" : "";
    syncStatus();
  });

  $("#ss-reset-camera").addEventListener("click", () => scene3d.resetCamera());
}

export default {
  id: "solar-system",
  name: "太阳系",

  getDefaultParams() {
    return { daysPerSecond: 10, compact: true, retro: false };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { scene3d: new SolarSystemScene3D($("#ss-canvas")), clockTimer: 0 };
    buildLegend();
    wireInteractions();
    syncStatus();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    const delta = Math.min(params?.delta ?? 0, 0.05);
    state.scene3d.render(delta);
    // 模拟时钟读数每 0.25 秒刷新一次，避免每帧改写 DOM
    state.clockTimer += delta;
    if (state.clockTimer >= 0.25) {
      state.clockTimer = 0;
      syncStatus();
    }
  },

  dispose() {
    if (!state) return;
    state.scene3d.dispose();
    state = null;
    root = null;
  },
};
