// 月食场景：地球影锥（本影/半影）、月球入影过程、食分计算与红月成因
// 食分判定使用真实天文数值（公里），画面距离做了压缩，边界说明中已注明
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const template = `
  <style>
    .le-scene #le-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
    }
    .le-scene #le-canvas:active { cursor: grabbing; }
    .le-intuition-copy { max-width: 850px; }
    .le-intuition-copy p { margin: 0 0 18px; color: var(--muted, #555); font-size: 16px; line-height: 1.9; }
    .le-intuition-copy p strong { color: inherit; }
    .le-status {
      margin: 18px 0 4px;
      padding: 13px 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }
    .le-status .le-phase {
      display: block;
      font-family: var(--serif, Georgia, serif);
      font-size: 21px;
      line-height: 1.2;
      color: #ffb52b;
    }
    .le-status .le-detail {
      display: block;
      margin-top: 7px;
      font-family: var(--mono, monospace);
      font-size: 11px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.66);
    }
    .le-scene .lab-actions { margin-top: 16px; }
  </style>

  <div class="le-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 03 / LUNAR ECLIPSE LAB</p>
        <h1>满月为何<br />会变成<br />一枚红铜币？</h1>
        <p class="hero-lead">
          月食是月球穿过地球影锥的过程。全食时它不消失，而是被地球大气折射的红光点亮。
        </p>
        <a class="primary-action" href="#le-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          拖动旋转 · 滚轮缩放 · 滑杆或播放键推动月球<br />
          画面距离经过压缩，食分由真实公里数值计算。
        </p>
      </div>

      <div class="lab-shell" aria-label="月食三维交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="le-canvas" aria-label="地球影锥与月球入影三维模型"></canvas>
          <div class="canvas-caption">
            <span>深红锥体为本影 · 外层为半影</span>
            <span id="le-caption">月球轨道倾角约 5.1°</span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="实验设置">
          <h2>实验设置</h2>

          <div class="le-status" aria-live="polite">
            <span class="le-phase" id="le-phase">—</span>
            <span class="le-detail" id="le-detail">—</span>
          </div>

          <label class="control-row" for="le-phi">
            <span>月球轨道位置</span>
            <output id="le-phi-output">-6.0°</output>
          </label>
          <input id="le-phi" type="range" min="-180" max="180" step="0.1" value="-6" />

          <label class="control-row" for="le-beta">
            <span>轨道倾角偏移（黄纬）</span>
            <output id="le-beta-output">0.20°</output>
          </label>
          <input id="le-beta" type="range" min="-1.6" max="1.6" step="0.02" value="0.2" />

          <div class="lab-actions">
            <button id="le-play" class="accent-button" type="button" aria-pressed="false">
              播放入影过程
            </button>
            <button id="le-reset-camera" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
              </svg>
              重置视角
            </button>
          </div>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="le-intuition" aria-labelledby="le-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="le-intuition-title">直觉模型：一次穿过影子的旅行</h2>
          <p>地球背向太阳的一侧拖着两层影子，月球偶尔会游进去。</p>
        </div>
      </div>
      <div class="le-intuition-copy">
        <p>
          地球的本影是一个长约 <strong>140 万公里</strong>的锥体，在月球轨道距离处直径仍约
          9200 公里，超过月球直径的 2.6 倍。围绕本影还有一圈更淡的半影。满月时若月球恰好
          位于黄白交点附近，就会先后穿过半影与本影，形成半影月食、月偏食或月全食。
        </p>
        <p>
          与日食相同，月球轨道 5.1° 的倾角让多数满月从影锥上方或下方掠过——月食也不是每月
          都有。但月食一旦发生，面向月球的整个半球都能看到，这就是多数人一生中看过的月食
          远多于日食的原因。
        </p>
        <p>
          月全食的红色来自<strong>瑞利散射</strong>：太阳光掠过地球大气边缘时，波长较短的蓝
          光被空气分子强烈散射掉（散射强度约与波长四次方成反比），剩下的红光经大气折射弯
          进本影内部，把月面照成暗红色——本质上，那是环绕地球一整圈的日出与日落投在月亮上。
        </p>
      </div>
    </section>

    <section class="section-pad" aria-labelledby="le-limits-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="le-limits-title">这个模型简化了什么</h2>
          <p>影锥与月球的相对大小是真实的，其余多有取舍。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>比例夸张</span>
          <h3>月地距离被大幅压缩</h3>
          <p>
            真实月地距离约为地球半径的 60 倍，画面压缩到 4 倍。地月半径比、影锥在月球轨道处
            的粗细比例保持真实，食分全部按公里数值计算。
          </p>
        </article>
        <article>
          <span>轨道简化</span>
          <h3>黄纬用滑杆直接给定</h3>
          <p>
            真实月球黄纬由交点位置与轨道运动共同决定，且交点以 18.6 年周期退行。这里用一个
            滑杆直接设定满月时刻的黄纬，方便逐档观察食分变化。
          </p>
        </article>
        <article>
          <span>光学简化</span>
          <h3>红色是着色，不是光谱计算</h3>
          <p>
            真实月全食的亮度与色调受大气尘埃、火山灰与臭氧影响（丹容标度 L0–L4），本影边缘
            也并非锐利。画面仅按入影深度对月面做颜色插值。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="le-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="le-sources-title">来源与核验路径</h2>
          <p>数值与机制描述以下列资料为准。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://eclipse.gsfc.nasa.gov/lunar.html" target="_blank" rel="noreferrer">
          <span role="cell">官方</span>
          <strong role="cell">NASA · Lunar Eclipse Page (GSFC)</strong>
          <span role="cell">历次月食的类型、食分与影锥几何参数</span>
        </a>
        <a class="source-row" role="row" href="https://science.nasa.gov/moon/eclipses/" target="_blank" rel="noreferrer">
          <span role="cell">官方科普</span>
          <strong role="cell">NASA Science · Lunar Eclipses</strong>
          <span role="cell">红月成因：大气散射蓝光、折射红光入本影</span>
        </a>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Lunar_eclipse" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Lunar eclipse</strong>
          <span role="cell">本影长度、食分定义与丹容标度</span>
        </a>
      </div>
      <p class="source-policy">
        画面用于建立几何直觉；查询真实月食时刻与食分，请以 NASA 月食表等专业星历为准。
      </p>
    </section>
  </div>
`;

// 真实天文常量（单位：公里 / 度）
const KM = {
  RS: 696000, // 太阳半径
  RM: 1737.4, // 月球半径
  RE: 6371, // 地球半径
  DS: 149600000, // 日地平均距离
  DM: 384400, // 月地平均距离（本场景固定取平均值）
};

// 由相似三角形得到的影锥参数（在月球轨道距离处）
const SHADOW = {
  umbraLen: (KM.DS * KM.RE) / (KM.RS - KM.RE), // 本影锥全长 ≈ 1.38e6 km
  rUmbra: KM.RE - (KM.DM * (KM.RS - KM.RE)) / KM.DS, // ≈ 4600 km
  rPenumbra: KM.RE + (KM.DM * (KM.RS + KM.RE)) / KM.DS, // ≈ 8200 km
};

// 场景可视化尺寸：半径方向保持与地球半径的真实比，轴向距离压缩
const VIS = {
  earthR: 1,
  moonR: KM.RM / KM.RE, // ≈ 0.273，与地球半径真实比
  orbitR: 4,
  sunPos: new THREE.Vector3(-40, 0, 0),
  coneLen: 7,
};

function disposeObject(object) {
  object.geometry?.dispose();
  if (Array.isArray(object.material)) {
    object.material.forEach((material) => material.dispose());
  } else {
    object.material?.dispose();
  }
}

class LunarEclipseScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.phiDeg = -6; // 轨道相位角，0 = 正对本影轴（满月）
    this.betaDeg = 0.2; // 黄纬偏移
    this.playing = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 300);

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
    this.controls.minDistance = 3;
    this.controls.maxDistance = 90;
    this.controls.enablePan = false;
    this.resetCamera();

    this.moonBaseColor = new THREE.Color(0xcfc9bc);
    this.moonPenumbraColor = new THREE.Color(0x8d897f);
    this.moonRedColor = new THREE.Color(0x8c2412);
    this.tempColor = new THREE.Color();

    this.buildStatics();
    this.refresh();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  buildStatics() {
    this.scene.add(new THREE.AmbientLight(0x223347, 1.5));
    const sunLight = new THREE.DirectionalLight(0xfff2d8, 3);
    sunLight.position.copy(VIS.sunPos);
    this.scene.add(sunLight);

    // 星空
    const starCount = 700;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(120);
      positions.set([v.x, v.y, v.z], i * 3);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xcfd8e6, size: 0.28, transparent: true, opacity: 0.65 }),
    );
    this.scene.add(this.stars);

    // 太阳（远端光源示意）
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(4, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffd984, toneMapped: false }),
    );
    sun.position.copy(VIS.sunPos);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(6, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffb84d,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    halo.position.copy(VIS.sunPos);
    this.scene.add(sun, halo);

    // 地球与"大气折射环"（红光来源的示意）
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(VIS.earthR, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0x3f6fa8, roughness: 0.85, metalness: 0 }),
    );
    this.scene.add(this.earth);
    const atmosphere = new THREE.Mesh(
      new THREE.TorusGeometry(VIS.earthR * 1.01, 0.035, 12, 72),
      new THREE.MeshBasicMaterial({
        color: 0xff7a3c,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    atmosphere.rotation.y = Math.PI / 2; // 环面法线沿日地连线
    this.scene.add(atmosphere);

    // 影锥：半径方向按真实比例（相对地球半径），轴向压缩到场景尺度
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3(1, 0, 0); // 背日方向
    const umbraSlope = (VIS.earthR - (SHADOW.rUmbra / KM.RE) * VIS.earthR) / VIS.orbitR;
    const umbraEndR = Math.max(0.01, VIS.earthR - umbraSlope * VIS.coneLen);
    const umbra = new THREE.Mesh(
      new THREE.CylinderGeometry(umbraEndR, VIS.earthR * 0.99, VIS.coneLen, 40, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x3d0d08,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    umbra.position.copy(axis.clone().multiplyScalar(VIS.coneLen / 2));
    umbra.quaternion.setFromUnitVectors(up, axis);
    this.scene.add(umbra);

    const penSlope = ((SHADOW.rPenumbra / KM.RE) * VIS.earthR - VIS.earthR) / VIS.orbitR;
    const penumbra = new THREE.Mesh(
      new THREE.CylinderGeometry(VIS.earthR + penSlope * VIS.coneLen, VIS.earthR, VIS.coneLen, 40, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x9c5a20,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    penumbra.position.copy(axis.clone().multiplyScalar(VIS.coneLen / 2));
    penumbra.quaternion.setFromUnitVectors(up, axis);
    this.scene.add(penumbra);

    // 月球与轨道环
    this.moonMaterial = new THREE.MeshStandardMaterial({
      color: this.moonBaseColor.clone(),
      roughness: 1,
      metalness: 0,
    });
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(VIS.moonR, 36, 36), this.moonMaterial);
    this.scene.add(this.moon);

    this.orbitRing = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xc6d5df, transparent: true, opacity: 0.5 }),
    );
    this.scene.add(this.orbitRing);
    this.rebuildOrbitRing();
  }

  // 满月方向为 +x（背日侧）；beta 为黄纬偏移
  moonScenePosition(phiDeg) {
    const phi = THREE.MathUtils.degToRad(phiDeg);
    const beta = THREE.MathUtils.degToRad(this.betaDeg);
    return new THREE.Vector3(
      Math.cos(phi) * Math.cos(beta),
      Math.sin(beta),
      Math.sin(phi) * Math.cos(beta),
    ).multiplyScalar(VIS.orbitR);
  }

  rebuildOrbitRing() {
    const points = [];
    for (let i = 0; i <= 240; i += 1) {
      points.push(this.moonScenePosition((i / 240) * 360));
    }
    this.orbitRing.geometry.dispose();
    this.orbitRing.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  // 真实公里尺度下的食分计算
  computeEclipse() {
    const phi = THREE.MathUtils.degToRad(this.phiDeg);
    const beta = THREE.MathUtils.degToRad(this.betaDeg);
    const alongAxis = KM.DM * Math.cos(phi) * Math.cos(beta); // 沿本影轴的分量
    const sep = KM.DM * Math.sqrt(
      Math.sin(beta) ** 2 + Math.sin(phi) ** 2 * Math.cos(beta) ** 2,
    ); // 月心到影轴的垂直距离

    const info = { sep, umbralMag: NaN, penumbralMag: NaN, type: "none", label: "无月食" };
    if (alongAxis <= 0) return info; // 月球在向日侧，不可能月食

    info.umbralMag = (SHADOW.rUmbra + KM.RM - sep) / (2 * KM.RM);
    info.penumbralMag = (SHADOW.rPenumbra + KM.RM - sep) / (2 * KM.RM);

    if (info.umbralMag >= 1) {
      info.type = "total";
      info.label = "月全食";
    } else if (info.umbralMag > 0) {
      info.type = "partial";
      info.label = "月偏食";
    } else if (info.penumbralMag > 0) {
      info.type = "penumbral";
      info.label = "半影月食";
    }
    return info;
  }

  // 依入影深度为月面着色：半影中略暗，本影中转向暗红
  tintMoon(info) {
    const color = this.tempColor.copy(this.moonBaseColor);
    if (info.type !== "none" && Number.isFinite(info.penumbralMag)) {
      const penDepth = THREE.MathUtils.clamp(info.penumbralMag, 0, 1);
      color.lerp(this.moonPenumbraColor, penDepth * 0.7);
      const umbDepth = THREE.MathUtils.clamp(info.umbralMag, 0, 1);
      color.lerp(this.moonRedColor, umbDepth);
    }
    this.moonMaterial.color.copy(color);
  }

  refresh() {
    this.moon.position.copy(this.moonScenePosition(this.phiDeg));
    const info = this.computeEclipse();
    this.tintMoon(info);
    this.lastInfo = info;
    return info;
  }

  setPhi(value) {
    this.phiDeg = value;
    return this.refresh();
  }

  setBeta(value) {
    this.betaDeg = value;
    this.rebuildOrbitRing();
    return this.refresh();
  }

  resetCamera() {
    // 窄画布（约 559×650）下的全景构图：太阳(-40)、地球影锥(0→+7)与月球轨道一屏收齐
    this.camera.position.set(-18.5, 16, 63);
    this.controls.target.set(-18.5, 0.5, 0);
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

  // 播放模式下自动推进月球；返回是否发生了位置更新
  render(delta) {
    let advanced = false;
    if (this.playing) {
      this.phiDeg += delta * 2.2; // 约 2.2°/秒，压缩后的入影过程
      if (this.phiDeg > 14) this.phiDeg = -14;
      this.refresh();
      advanced = true;
    }
    this.earth.rotation.y += delta * 0.12;
    this.stars.rotation.y += delta * 0.004;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    return advanced;
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.scene.traverse((object) => disposeObject(object));
    this.renderer.dispose();
  }
}

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);

function formatMag(value) {
  return Number.isFinite(value) && value > -5 ? Math.max(0, value).toFixed(2) : "—";
}

function syncReadout() {
  const info = state.scene3d.lastInfo;
  $("#le-phase").textContent = info.label;
  const lines = [
    `本影食分 ${formatMag(info.umbralMag)} · 半影食分 ${formatMag(info.penumbralMag)}`,
    `月心距影轴 ${Math.round(info.sep).toLocaleString()} km`,
  ];
  if (info.type === "total") {
    lines.push("月面完全入本影，被折射红光照亮");
  } else if (info.type === "none") {
    lines.push("月球在影锥之外或位于向日侧");
  }
  $("#le-detail").textContent = lines.join("\n");
}

function syncSliders() {
  $("#le-phi").value = String(state.scene3d.phiDeg);
  $("#le-phi-output").textContent = `${state.scene3d.phiDeg.toFixed(1)}°`;
}

function wireInteractions() {
  const scene3d = state.scene3d;
  const playButton = $("#le-play");

  $("#le-phi").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#le-phi-output").textContent = `${value.toFixed(1)}°`;
    scene3d.playing = false;
    playButton.textContent = "播放入影过程";
    playButton.setAttribute("aria-pressed", "false");
    scene3d.setPhi(value);
    syncReadout();
  });

  $("#le-beta").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#le-beta-output").textContent = `${value.toFixed(2)}°`;
    scene3d.setBeta(value);
    syncReadout();
  });

  playButton.addEventListener("click", () => {
    scene3d.playing = !scene3d.playing;
    if (scene3d.playing && Math.abs(scene3d.phiDeg) > 14) scene3d.setPhi(-14);
    playButton.textContent = scene3d.playing ? "暂停" : "播放入影过程";
    playButton.setAttribute("aria-pressed", String(scene3d.playing));
  });

  $("#le-reset-camera").addEventListener("click", () => scene3d.resetCamera());
}

export default {
  id: "lunar-eclipse",
  name: "月食",

  getDefaultParams() {
    return { phiDeg: -6, betaDeg: 0.2 };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { scene3d: new LunarEclipseScene3D($("#le-canvas")) };
    wireInteractions();
    syncReadout();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    if (!state) return;
    const delta = Math.min(params?.delta ?? 0, 0.05);
    const advanced = state.scene3d.render(delta);
    if (advanced) {
      syncSliders();
      syncReadout();
    }
  },

  dispose() {
    if (!state) return;
    state.scene3d.dispose();
    state = null;
    root = null;
  },
};
