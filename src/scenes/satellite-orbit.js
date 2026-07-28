// 卫星轨道场景：二体问题数值积分，展示圆轨道 / 椭圆轨道 / 逃逸 / 坠落四种结局
// 物理量以 km、s 计算，渲染时按地球半径归一化（1 场景单位 = 6371 km）
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const MU = 398600.4418; // 地球引力参数 μ = GM，km³/s²
const R_EARTH = 6371; // 地球平均半径，km
const CRASH_ALT = 60; // 低于该高度视为再入坠落，km

const template = `
  <style>
    .sat-scene .hero-lead { max-width: 460px; }
    .sat-scene #sat-canvas { width: 100%; height: 650px; cursor: grab; touch-action: none; }
    .sat-scene #sat-canvas:active { cursor: grabbing; }
    .sat-scene .sat-copy p { max-width: 760px; margin-bottom: 18px; font-size: 16px; line-height: 1.75; }
    .sat-scene .sat-readout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 18px;
      margin: 18px 0 4px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      font-size: 12px;
    }
    .sat-scene .sat-readout span { color: rgba(255, 255, 255, 0.62); }
    .sat-scene .sat-readout output { display: block; margin-top: 2px; color: #fff; font-family: var(--mono); }
    .sat-scene .sat-status-line { grid-column: 1 / -1; }
    .sat-scene .sat-status-line output { color: #ffb52b; font-size: 14px; }
    .sat-scene .sat-belt-note {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.62);
      font-size: 11.5px;
      line-height: 1.7;
    }
    .sat-scene .sat-belt-note i { display: inline-block; width: 9px; height: 9px; margin-right: 6px; border-radius: 50%; }
    @media (max-width: 1240px) {
      .sat-scene #sat-canvas { height: 620px; }
    }
  </style>

  <div class="sat-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 02 / ORBIT LAB</p>
        <h1>抛出去的<br />石头，为什么<br />掉不下来？</h1>
        <p class="hero-lead">
          轨道不是“摆脱了重力”，而是一直在坠落、又一直错过地面。速度决定一切。
        </p>
        <a class="primary-action" href="#sat-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          拖动旋转 · 滚轮缩放 · 调整发射高度与初速度<br />
          画面按牛顿二体模型计算，忽略摄动，仅示意量级。
        </p>
      </div>

      <div class="lab-shell" aria-label="卫星轨道交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="sat-canvas" aria-label="三维卫星轨道模型"></canvas>
          <div class="canvas-caption">
            <span>切向发射 · 二体模型</span>
            <span id="sat-canvas-status">h = 400 km · v = 7.67 km/s</span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="发射参数">
          <h2>发射参数</h2>
          <div class="mode-grid" role="group" aria-label="典型轨道预设">
            <button class="mode-button is-active" data-sat-preset="leo" type="button">LEO · 400 km</button>
            <button class="mode-button" data-sat-preset="meo" type="button">MEO · 2 万 km</button>
            <button class="mode-button" data-sat-preset="geo" type="button">GEO · 3.58 万 km</button>
            <button class="mode-button" data-sat-preset="escape" type="button">逃逸速度试验</button>
          </div>

          <label class="control-row" for="sat-altitude">
            <span>发射高度 <i>h</i></span>
            <output id="sat-altitude-output">400 km</output>
          </label>
          <input id="sat-altitude" type="range" min="200" max="50000" step="100" value="400" />

          <label class="control-row" for="sat-speed">
            <span>切向初速度 <i>v</i></span>
            <output id="sat-speed-output">7.67 km/s</output>
          </label>
          <input id="sat-speed" type="range" min="0" max="13" step="0.01" value="7.67" />

          <div class="sat-readout" aria-live="polite">
            <div class="sat-status-line"><span>轨道结局</span><output id="sat-outcome">—</output></div>
            <div><span>偏心率 e</span><output id="sat-ecc">—</output></div>
            <div><span>轨道周期 T</span><output id="sat-period">—</output></div>
            <div><span>圆轨道速度</span><output id="sat-vcirc">—</output></div>
            <div><span>逃逸速度</span><output id="sat-vesc">—</output></div>
          </div>

          <div class="lab-actions">
            <button id="sat-relaunch" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
              </svg>
              重新发射
            </button>
            <button id="sat-drag-toggle" class="accent-button" type="button" aria-pressed="false">
              大气阻力：关
            </button>
          </div>

          <p class="sat-belt-note">
            <i style="background:#6fc2ff"></i>LEO 约 400 km · 周期约 92.8 分钟（国际空间站）<br />
            <i style="background:#e5a526"></i>MEO 约 20200 km · 周期约 11 时 58 分（GPS）<br />
            <i style="background:#e33a32"></i>GEO 35786 km · 周期 23 时 56 分（与地球自转同步）
          </p>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="sat-intuition" aria-labelledby="sat-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="sat-intuition-title">直觉模型：牛顿的大炮</h2>
          <p>把大炮架上高山，炮弹打得越快，落点越远——快到某个程度，它就再也落不回来。</p>
        </div>
      </div>
      <div class="sat-copy">
        <p>
          卫星并没有逃离重力。在 400 km 高度，地球引力仍有地面的约 89%。卫星之所以不掉下来，
          是因为它横向速度足够大：每下落一段，地面也因为地球的曲率“躲开”了一段。轨道就是一场永远追不上的坠落。
        </p>
        <p>
          在同一高度切向发射，结局只取决于速度。速度恰好等于 √(μ/r) 时得到圆轨道；再快一些，轨道拉成椭圆，
          发射点成为近地点；达到 √(2μ/r)（约为圆轨道速度的 1.41 倍）时能量归零，卫星沿抛物线一去不返；
          而速度不足时，椭圆的近地点会低到扎进大气层——那就是坠落。
        </p>
        <p>
          高度还决定周期。开普勒第三定律说 T² ∝ a³：轨道越高，转一圈越久。GEO 的 35786 km
          正是让周期精确等于一个恒星日（23 时 56 分）的高度，卫星因此“钉”在赤道上空同一点。
        </p>
      </div>
    </section>

    <section class="limits section-pad" aria-labelledby="sat-limits-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="sat-limits-title">这个模型简化了什么</h2>
          <p>画面帮助建立直觉，但真实航天动力学远比二体问题复杂。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>简化 1</span>
          <h3>纯二体、无摄动</h3>
          <p>
            只计算地球质点引力。真实轨道还受地球扁率（J2 项）、日月引力、太阳光压等摄动，
            GEO 卫星需要定期修正位置。
          </p>
        </article>
        <article>
          <span>简化 2</span>
          <h3>大气阻力被放大</h3>
          <p>
            为了几十秒内看清衰减螺旋，阻力系数被人为放大了多个数量级。
            真实的 400 km 轨道衰减以月和年计，且强烈依赖太阳活动。
          </p>
        </article>
        <article>
          <span>简化 3</span>
          <h3>切向发射、瞬时给速</h3>
          <p>
            实验假设卫星在目标高度瞬间获得水平速度。真实发射是持续推力的上升与转弯过程，
            还要计入重力损耗与大气损耗。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="sat-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="sat-sources-title">来源与核验路径</h2>
          <p>页面中的高度、周期与速度数值以下列资料为准。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://earthobservatory.nasa.gov/features/OrbitsCatalog" target="_blank" rel="noreferrer">
          <span role="cell">NASA</span>
          <strong role="cell">Earth Observatory · Catalog of Earth Satellite Orbits</strong>
          <span role="cell">LEO / MEO / GEO 高度与周期分类</span>
        </a>
        <a class="source-row" role="row" href="https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits" target="_blank" rel="noreferrer">
          <span role="cell">ESA</span>
          <strong role="cell">ESA · Types of orbits</strong>
          <span role="cell">各类轨道用途、GEO 35786 km</span>
        </a>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Orbital_mechanics" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Orbital mechanics</strong>
          <span role="cell">vis-viva 方程、逃逸速度与开普勒定律</span>
        </a>
      </div>
      <p class="source-policy">
        演示中的轨道由数值积分实时算出；分类标签（圆 / 椭圆 / 逃逸 / 坠落）依据发射瞬间的比机械能与近地点高度判断。
      </p>
    </section>
  </div>
`;

class SatelliteOrbit3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.altitude = 400; // km
    this.speed = 7.67; // km/s
    this.dragOn = false;
    this.outcome = "";

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.01, 500);
    this.camera.position.set(0, 5.2, 9.5);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 60;
    this.controls.enablePan = false;

    this.scene.add(new THREE.HemisphereLight(0xd7e8f4, 0x0a1626, 1.5));
    const key = new THREE.DirectionalLight(0xfff2d9, 1.9);
    key.position.set(6, 4, 5);
    this.scene.add(key);

    this.buildEarth();
    this.buildBeltRings();
    this.buildSatellite();
    this.launch();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  buildEarth() {
    this.earthGeometry = new THREE.SphereGeometry(1, 48, 32);
    this.earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6ba8,
      roughness: 0.82,
      metalness: 0.05,
    });
    this.earth = new THREE.Mesh(this.earthGeometry, this.earthMaterial);
    this.scene.add(this.earth);

    // 经纬网：让球体的旋转与曲率可读
    this.gridGeometry = new THREE.SphereGeometry(1.001, 24, 16);
    this.gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x9cc4e4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    this.scene.add(new THREE.Mesh(this.gridGeometry, this.gridMaterial));

    // 薄薄一层大气示意
    this.atmoGeometry = new THREE.SphereGeometry(1.05, 48, 32);
    this.atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0x6fc2ff,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(this.atmoGeometry, this.atmoMaterial));
  }

  beltRing(altitudeKm, color, opacity) {
    const radius = (R_EARTH + altitudeKm) / R_EARTH;
    const points = [];
    for (let i = 0; i <= 160; i += 1) {
      const angle = (i / 160) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    this.scene.add(new THREE.Line(geometry, material));
  }

  buildBeltRings() {
    this.beltRing(400, 0x6fc2ff, 0.5); // LEO（国际空间站）
    this.beltRing(20200, 0xe5a526, 0.45); // MEO（GPS）
    this.beltRing(35786, 0xe33a32, 0.5); // GEO
  }

  buildSatellite() {
    this.satGeometry = new THREE.SphereGeometry(0.055, 16, 12);
    this.satMaterial = new THREE.MeshBasicMaterial({ color: 0xffb52b });
    this.sat = new THREE.Mesh(this.satGeometry, this.satMaterial);
    this.scene.add(this.sat);

    // 轨迹：预分配顶点，按 drawRange 增长
    this.trailMax = 4000;
    this.trailGeometry = new THREE.BufferGeometry();
    this.trailPositions = new Float32Array(this.trailMax * 3);
    this.trailGeometry.setAttribute("position", new THREE.BufferAttribute(this.trailPositions, 3));
    this.trailGeometry.setDrawRange(0, 0);
    this.trailMaterial = new THREE.LineBasicMaterial({
      color: 0xf3efe5,
      transparent: true,
      opacity: 0.75,
    });
    this.trail = new THREE.Line(this.trailGeometry, this.trailMaterial);
    this.trail.frustumCulled = false;
    this.scene.add(this.trail);
  }

  // 依据发射瞬间的能量与近地点，判定四种结局之一
  classify() {
    const r0 = R_EARTH + this.altitude;
    const v = this.speed;
    const energy = (v * v) / 2 - MU / r0;
    const vCirc = Math.sqrt(MU / r0);
    const vEsc = Math.sqrt((2 * MU) / r0);
    const result = { energy, vCirc, vEsc, ecc: null, period: null, label: "" };

    if (energy >= 0) {
      result.label = "逃逸 · v ≥ 逃逸速度";
      result.ecc = v * v * r0 / MU - 1; // ≥ 1
      return result;
    }
    const a = -MU / (2 * energy);
    const angMom = r0 * v; // 切向发射
    const eccSq = Math.max(0, 1 - (angMom * angMom) / (MU * a));
    const ecc = Math.sqrt(eccSq);
    const perigee = a * (1 - ecc);
    result.ecc = ecc;
    result.period = 2 * Math.PI * Math.sqrt((a * a * a) / MU);
    if (perigee <= R_EARTH + CRASH_ALT) {
      result.label = "坠落 · 近地点低于大气层";
    } else if (ecc < 0.05) {
      result.label = "圆轨道（近圆）";
    } else {
      result.label = "椭圆轨道";
    }
    return result;
  }

  launch() {
    const r0 = R_EARTH + this.altitude;
    // 物理态在赤道平面内计算：px/py（km），渲染映射到场景 x/z
    this.px = r0;
    this.py = 0;
    this.vx = 0;
    this.vy = this.speed;
    this.crashed = false;
    this.trailCount = 0;
    this.trailGeometry.setDrawRange(0, 0);
    this.info = this.classify();
    this.syncSatellite();
  }

  acceleration(px, py, vx, vy) {
    const r = Math.hypot(px, py);
    const inv = -MU / (r * r * r);
    let ax = inv * px;
    let ay = inv * py;
    if (this.dragOn) {
      // 指数大气 + 人为放大的阻力系数，只为演示衰减螺旋
      const alt = r - R_EARTH;
      if (alt < 1500) {
        const rho = Math.exp(-alt / 220);
        const speed = Math.hypot(vx, vy);
        const k = 6e-5 * rho * speed;
        ax -= k * vx;
        ay -= k * vy;
      }
    }
    return [ax, ay];
  }

  step(delta) {
    if (this.crashed) return;
    // 时间加速：让束缚轨道约 40 秒转一圈，逃逸轨道固定倍率
    let warp = 1500;
    const r = Math.hypot(this.px, this.py);
    const v2 = this.vx * this.vx + this.vy * this.vy;
    const energy = v2 / 2 - MU / r;
    if (energy < 0) {
      const a = -MU / (2 * energy);
      const period = 2 * Math.PI * Math.sqrt((a * a * a) / MU);
      warp = Math.min(4000, Math.max(60, period / 40));
    }
    const simSeconds = Math.min(0.1, delta || 0.016) * warp;
    const steps = Math.min(400, Math.max(1, Math.ceil(simSeconds / 8)));
    const dt = simSeconds / steps;

    for (let i = 0; i < steps; i += 1) {
      // leapfrog（kick-drift-kick），能量漂移小
      let [ax, ay] = this.acceleration(this.px, this.py, this.vx, this.vy);
      this.vx += ax * dt * 0.5;
      this.vy += ay * dt * 0.5;
      this.px += this.vx * dt;
      this.py += this.vy * dt;
      [ax, ay] = this.acceleration(this.px, this.py, this.vx, this.vy);
      this.vx += ax * dt * 0.5;
      this.vy += ay * dt * 0.5;
      if (Math.hypot(this.px, this.py) <= R_EARTH + CRASH_ALT) {
        this.crashed = true;
        break;
      }
    }
    this.syncSatellite();
  }

  syncSatellite() {
    const scale = 1 / R_EARTH;
    const x = this.px * scale;
    const z = this.py * scale;
    this.sat.position.set(x, 0, z);
    if (this.trailCount < this.trailMax) {
      const base = this.trailCount * 3;
      this.trailPositions[base] = x;
      this.trailPositions[base + 1] = 0;
      this.trailPositions[base + 2] = z;
      this.trailCount += 1;
      this.trailGeometry.setDrawRange(0, this.trailCount);
      this.trailGeometry.attributes.position.needsUpdate = true;
    }
  }

  currentAltitude() {
    return Math.hypot(this.px, this.py) - R_EARTH;
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
    this.step(delta);
    this.earth.rotation.y += 0.0009;
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
    this.renderer.dispose();
  }
}

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

const presets = {
  leo: { altitude: 400, speed: 7.67 },
  meo: { altitude: 20200, speed: 3.87 },
  geo: { altitude: 35786, speed: 3.07 },
  escape: { altitude: 400, speed: 11.0 },
};

function formatPeriod(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  if (seconds < 7200) return `${(seconds / 60).toFixed(1)} 分钟`;
  return `${Math.floor(seconds / 3600)} 时 ${Math.round((seconds % 3600) / 60)} 分`;
}

function refreshReadout() {
  const { orbit } = state;
  const info = orbit.info;
  $("#sat-outcome").textContent = info.label;
  $("#sat-ecc").textContent = info.ecc === null ? "—" : info.ecc.toFixed(3);
  $("#sat-period").textContent = info.energy >= 0 ? "无（非闭合轨道）" : formatPeriod(info.period);
  $("#sat-vcirc").textContent = `${info.vCirc.toFixed(2)} km/s`;
  $("#sat-vesc").textContent = `${info.vEsc.toFixed(2)} km/s`;
  $("#sat-canvas-status").textContent =
    `h = ${Math.round(orbit.altitude)} km · v = ${orbit.speed.toFixed(2)} km/s`;
}

function applyParams(altitude, speed) {
  const { orbit } = state;
  orbit.altitude = altitude;
  orbit.speed = speed;
  $("#sat-altitude").value = String(altitude);
  $("#sat-speed").value = String(speed);
  $("#sat-altitude-output").textContent = `${Math.round(altitude)} km`;
  $("#sat-speed-output").textContent = `${speed.toFixed(2)} km/s`;
  orbit.launch();
  refreshReadout();
}

function wireInteractions() {
  const { orbit } = state;

  $("#sat-altitude").addEventListener("input", (event) => {
    applyParams(Number(event.target.value), orbit.speed);
    $$("[data-sat-preset]").forEach((item) => item.classList.remove("is-active"));
  });

  $("#sat-speed").addEventListener("input", (event) => {
    applyParams(orbit.altitude, Number(event.target.value));
    $$("[data-sat-preset]").forEach((item) => item.classList.remove("is-active"));
  });

  $$("[data-sat-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-sat-preset]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const preset = presets[button.dataset.satPreset];
      applyParams(preset.altitude, preset.speed);
    });
  });

  $("#sat-relaunch").addEventListener("click", () => {
    orbit.launch();
    refreshReadout();
  });

  const dragToggle = $("#sat-drag-toggle");
  dragToggle.addEventListener("click", () => {
    orbit.dragOn = !orbit.dragOn;
    dragToggle.textContent = orbit.dragOn ? "大气阻力：开" : "大气阻力：关";
    dragToggle.setAttribute("aria-pressed", String(orbit.dragOn));
    orbit.launch();
    refreshReadout();
  });
}

export default {
  id: "satellite-orbit",
  name: "卫星轨道",

  getDefaultParams() {
    return { altitude: 400, speed: 7.67, drag: false };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { orbit: new SatelliteOrbit3D($("#sat-canvas")) };
    wireInteractions();
    refreshReadout();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    state.orbit.render(params?.delta ?? 0.016);
    if (state.orbit.crashed && !state.crashNoted) {
      state.crashNoted = true;
      $("#sat-outcome").textContent = "坠落 · 已再入大气层，点击「重新发射」";
    }
    if (!state.orbit.crashed) state.crashNoted = false;
  },

  dispose() {
    if (!state) return;
    state.orbit.dispose();
    state = null;
    root = null;
  },
};
