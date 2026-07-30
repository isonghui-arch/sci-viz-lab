// 日食场景：日-月-地三维几何、本影/半影光锥、日食带与食型判定
// 几何判定使用真实天文数值（公里），画面尺寸做了可视化夸张，边界说明中已注明
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const template = `
  <style>
    .se-scene #se-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
    }
    .se-scene #se-canvas:active { cursor: grabbing; }
    .se-intuition-copy { max-width: 850px; }
    .se-intuition-copy p { margin: 0 0 18px; color: var(--muted, #555); font-size: 16px; line-height: 1.9; }
    .se-intuition-copy p strong { color: inherit; }
    .se-status {
      margin: 18px 0 4px;
      padding: 13px 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }
    .se-status .se-type {
      display: block;
      font-family: var(--serif, Georgia, serif);
      font-size: 21px;
      line-height: 1.2;
      color: #ffb52b;
    }
    .se-status .se-detail {
      display: block;
      margin-top: 7px;
      font-family: var(--mono, monospace);
      font-size: 11px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.66);
    }
    .se-scene .lab-actions { margin-top: 16px; }
  </style>

  <div class="se-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 02 / SOLAR ECLIPSE LAB</p>
        <h1>月亮的影子，<br />为何很少<br />落在你头上？</h1>
        <p class="hero-lead">
          日食是月球本影与半影扫过地表的几何事件。轨道倾角 5.1°，让这场对齐每年只成功几次。
        </p>
        <a class="primary-action" href="#se-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          左键拖动旋转 · 滚轮缩放 · 右键拖动平移（可把地球移到画面中心）<br />
          画面比例经过夸张，食型判定使用真实天文数值。
        </p>
      </div>

      <div class="lab-shell" aria-label="日食三维交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="se-canvas" aria-label="日月地三维模型与影锥"></canvas>
          <div class="canvas-caption">
            <span>红点为本影落点 · 红线为日食带扫过路径</span>
            <span id="se-caption">月球轨道倾角 5.1°</span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="实验设置">
          <h2>实验设置</h2>

          <div class="se-status" aria-live="polite">
            <span class="se-type" id="se-type">—</span>
            <span class="se-detail" id="se-detail">—</span>
          </div>

          <label class="control-row" for="se-theta">
            <span>月球轨道位置</span>
            <output id="se-theta-output">0.0°</output>
          </label>
          <input id="se-theta" type="range" min="-180" max="180" step="0.2" value="0" />

          <label class="control-row" for="se-omega">
            <span>交点方位偏移</span>
            <output id="se-omega-output">0°</output>
          </label>
          <input id="se-omega" type="range" min="-90" max="90" step="1" value="0" />

          <label class="control-row" for="se-dist">
            <span>月地距离</span>
            <output id="se-dist-output">384400 km</output>
          </label>
          <input id="se-dist" type="range" min="356500" max="406700" step="100" value="384400" />

          <div class="lab-actions">
            <button id="se-incl-toggle" class="accent-button" type="button" aria-pressed="false">
              假想倾角 = 0°
            </button>
            <button id="se-focus-earth" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
              聚焦地球
            </button>
            <button id="se-reset-camera" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
              </svg>
              全景视角
            </button>
          </div>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="se-intuition" aria-labelledby="se-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="se-intuition-title">直觉模型：一次苛刻的三点对齐</h2>
          <p>新月每月都有，日食却不是。差别藏在两个角度和一段距离里。</p>
        </div>
      </div>
      <div class="se-intuition-copy">
        <p>
          太阳直径约为月球的 400 倍，距离也恰好约为月地距离的 400 倍——两者在天空中的视直径
          几乎相同，都接近 0.5°。这一巧合让月球有机会不多不少地遮住日面，露出日冕。
        </p>
        <p>
          但月球绕地轨道相对黄道面倾斜约 <strong>5.1°</strong>。多数新月时刻，月球从太阳
          上方或下方数千公里处掠过，影子落进太空。只有当新月恰好发生在轨道与黄道的交点
          附近，本影或半影才能碰到地球，这就是日食季每年只出现约两次的原因。
        </p>
        <p>
          即使对齐成功，食型还取决于距离：月球本影平均长约 37.4 万公里，而月地平均距离约
          38.4 万公里。月球离地球较近时本影尖端够得着地面，看到日全食；较远时本影在半空
          收尖，地面进入其延长线（伪本影），看到的是日环食。
        </p>
      </div>
    </section>

    <section class="section-pad" aria-labelledby="se-limits-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="se-limits-title">这个模型简化了什么</h2>
          <p>先说清楚画面与真实世界的差距，再谈直觉。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>比例夸张</span>
          <h3>尺寸与距离不成比例</h3>
          <p>
            按真实比例，地球在此画面中只有针尖大，太阳远在数百米外。画面放大了地球、月球
            与影锥，但食型与日食带的判定全部由公里级真实数值计算。
          </p>
        </article>
        <article>
          <span>轨道简化</span>
          <h3>圆轨道 + 固定交点</h3>
          <p>
            真实月球轨道是偏心率约 0.055 的椭圆，交点还以约 18.6 年的周期退行。这里用圆轨
            道加距离滑杆代替椭圆，用滑杆固定交点方位，不演化沙罗周期。
          </p>
        </article>
        <article>
          <span>地表简化</span>
          <h3>不含地球自转与大气折射</h3>
          <p>
            真实日食带的形状由地球自转、扁率与月影移动速度共同决定，本影地表速度常超过
            2000 km/h。此处的红线只是影轴扫过静止球面的几何轨迹。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="se-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="se-sources-title">来源与核验路径</h2>
          <p>数值与机制描述以下列资料为准。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://eclipse.gsfc.nasa.gov/solar.html" target="_blank" rel="noreferrer">
          <span role="cell">官方</span>
          <strong role="cell">NASA · Solar Eclipse Page (GSFC)</strong>
          <span role="cell">历次日食的类型、日食带地图与几何参数</span>
        </a>
        <a class="source-row" role="row" href="https://science.nasa.gov/eclipses/" target="_blank" rel="noreferrer">
          <span role="cell">官方科普</span>
          <strong role="cell">NASA Science · Eclipses</strong>
          <span role="cell">本影/半影定义、全食/环食/偏食的成因</span>
        </a>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Solar_eclipse" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Solar eclipse</strong>
          <span role="cell">轨道倾角 5.1°、本影长度与频率统计</span>
        </a>
      </div>
      <p class="source-policy">
        画面用于建立几何直觉；预报真实日食请以 NASA 五千年日食表等专业星历为准。
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
  INCL: 5.145, // 白道对黄道倾角
};

// 场景可视化尺寸（夸张比例）
const VIS = {
  earthR: 1,
  moonR: 0.2727, // 保持月地半径真实比 1737.4 / 6371
  orbitR: 4,
  sunPos: new THREE.Vector3(-40, 0, 0),
  sunR: 4,
};

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

class SolarEclipseScene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.thetaDeg = 0; // 月球轨道位置，0 = 新月
    this.omegaDeg = 0; // 交点方位相对太阳方向的偏移
    this.distKm = 384400;
    this.inclDeg = KM.INCL;

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
    this.controls.maxDistance = 120;
    this.controls.enablePan = true; // 允许平移：右键拖动可把地球拖到画面中心
    this.controls.screenSpacePanning = false;
    this.focusEarth(); // 默认把地球置于画面中心

    this.shadowGroup = new THREE.Group(); // 影锥 + 落点 + 日食带，参数变化时整组重建
    this.orbitGroup = new THREE.Group(); // 月球轨道环，倾角/交点变化时重建
    this.scene.add(this.shadowGroup, this.orbitGroup);

    this.buildStatics();
    this.rebuildOrbitRing();
    this.refresh();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  buildStatics() {
    this.scene.add(new THREE.AmbientLight(0x223347, 1.4));
    const sunLight = new THREE.DirectionalLight(0xfff2d8, 3.2);
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

    // 太阳：亮球 + 光晕壳
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(VIS.sunR, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffd984, toneMapped: false }),
    );
    sun.position.copy(VIS.sunPos);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(VIS.sunR * 1.5, 32, 32),
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

    // 地球
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(VIS.earthR, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0x3f6fa8, roughness: 0.85, metalness: 0 }),
    );
    this.scene.add(this.earth);

    // 月球
    this.moon = new THREE.Mesh(
      new THREE.SphereGeometry(VIS.moonR, 36, 36),
      new THREE.MeshStandardMaterial({ color: 0xb9b4a8, roughness: 1, metalness: 0 }),
    );
    this.scene.add(this.moon);

    // 黄道参考环（地球轨道面）
    const eclipticPoints = [];
    for (let i = 0; i <= 160; i += 1) {
      const a = (i / 160) * Math.PI * 2;
      eclipticPoints.push(new THREE.Vector3(Math.cos(a) * VIS.orbitR, 0, Math.sin(a) * VIS.orbitR));
    }
    this.eclipticRing = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(eclipticPoints),
      new THREE.LineBasicMaterial({ color: 0x6d879f, transparent: true, opacity: 0.28 }),
    );
    this.scene.add(this.eclipticRing);
  }

  // 交点线方向（黄道面内，相对太阳方向偏 omega）
  nodeAxis() {
    const omega = THREE.MathUtils.degToRad(this.omegaDeg);
    return new THREE.Vector3(-Math.cos(omega), 0, Math.sin(omega));
  }

  // 给定轨道相位角（0 = 新月），返回月球方向单位向量
  moonDirection(thetaDeg) {
    const theta = THREE.MathUtils.degToRad(thetaDeg);
    const flat = new THREE.Vector3(-Math.cos(theta), 0, Math.sin(theta));
    return flat.applyAxisAngle(this.nodeAxis(), THREE.MathUtils.degToRad(this.inclDeg));
  }

  rebuildOrbitRing() {
    clearGroup(this.orbitGroup);
    const points = [];
    for (let i = 0; i <= 240; i += 1) {
      points.push(this.moonDirection((i / 240) * 360).multiplyScalar(VIS.orbitR));
    }
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xc6d5df, transparent: true, opacity: 0.5 }),
    );
    this.orbitGroup.add(ring);

    // 升/降交点标记
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xe7a329 });
    const nodeGeometry = new THREE.SphereGeometry(0.05, 12, 12);
    [1, -1].forEach((sign) => {
      const marker = new THREE.Mesh(nodeGeometry.clone(), nodeMaterial.clone());
      marker.position.copy(this.nodeAxis().multiplyScalar(VIS.orbitR * sign));
      this.orbitGroup.add(marker);
    });
    nodeGeometry.dispose();
    nodeMaterial.dispose();
  }

  // 真实公里尺度下的日食几何判定
  computeEclipse(thetaDeg) {
    const dir = this.moonDirection(thetaDeg);
    const moonKm = dir.clone().multiplyScalar(this.distKm);
    const sunKm = new THREE.Vector3(-KM.DS, 0, 0);
    const axis = moonKm.clone().sub(sunKm).normalize(); // 影轴方向：太阳 → 月球
    const t = moonKm.clone().negate().dot(axis); // 地心在影轴上的投影距离（自月球起）
    const offset = moonKm.clone().cross(axis).length(); // 地心到影轴的垂直距离

    const betaDeg = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1)));
    const result = { dir, moonKm, axis, t, offset, betaDeg, type: "none", label: "无日食" };
    if (t <= 0) return result; // 月球不在太阳与地球之间

    const x = Math.max(1, t - KM.RE); // 月球到向日侧地表的沿轴距离
    const sunMoonDist = moonKm.distanceTo(sunKm);
    result.umbraLen = (sunMoonDist * KM.RM) / (KM.RS - KM.RM); // 本影锥长
    result.rUmbra = KM.RM - (x * (KM.RS - KM.RM)) / sunMoonDist; // 负值表示伪本影
    result.rPenumbra = KM.RM + (x * (KM.RS + KM.RM)) / sunMoonDist;

    if (offset > KM.RE + result.rPenumbra) return result;
    if (offset > KM.RE + Math.abs(result.rUmbra)) {
      result.type = "partial";
      result.label = "日偏食";
    } else if (result.rUmbra > 0) {
      result.type = "total";
      result.label = "日全食";
    } else {
      result.type = "annular";
      result.label = "日环食";
    }
    return result;
  }

  // 影轴与地球（真实尺度）交点，映射到场景坐标；无交点返回 null
  axisSurfacePoint(info) {
    if (info.t <= 0 || info.offset >= KM.RE) return null;
    const foot = info.moonKm.clone().add(info.axis.clone().multiplyScalar(info.t));
    const half = Math.sqrt(KM.RE * KM.RE - info.offset * info.offset);
    const pointKm = foot.sub(info.axis.clone().multiplyScalar(half)); // 向日一侧
    return pointKm.multiplyScalar(VIS.earthR / KM.RE);
  }

  rebuildShadow(info) {
    clearGroup(this.shadowGroup);
    const moonScene = info.dir.clone().multiplyScalar(VIS.orbitR);
    this.moon.position.copy(moonScene);
    if (info.type === "none" && info.t <= 0) return;

    const sceneAxis = moonScene.clone().sub(VIS.sunPos).normalize();
    const surface = this.axisSurfacePoint(info);
    const hitDist = surface
      ? moonScene.distanceTo(surface)
      : Math.max(0.4, moonScene.length() - VIS.earthR);
    const kmToScene = hitDist / Math.max(1, this.distKm - KM.RE); // 沿轴公里 → 场景单位
    const up = new THREE.Vector3(0, 1, 0);

    // 半影锥：自月球向地球方向张开
    const rPenScene = Math.max(0.02, (info.rPenumbra / KM.RE) * VIS.earthR);
    const penGeometry = new THREE.CylinderGeometry(rPenScene, VIS.moonR * 0.98, hitDist, 32, 1, true);
    const penumbra = new THREE.Mesh(
      penGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xe7a329,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    penumbra.position.copy(moonScene).addScaledVector(sceneAxis, hitDist / 2);
    penumbra.quaternion.setFromUnitVectors(up, sceneAxis);
    this.shadowGroup.add(penumbra);

    // 本影锥：向尖端收缩；全食时尖端在地表之后，环食时在半空收尖
    const apexScene = info.umbraLen * kmToScene;
    const umbraLenScene = Math.min(apexScene, hitDist);
    const rTip = Math.max(0.004, VIS.moonR * 0.96 * (1 - umbraLenScene / apexScene));
    const umbGeometry = new THREE.CylinderGeometry(rTip, VIS.moonR * 0.96, umbraLenScene, 32, 1, true);
    const umbra = new THREE.Mesh(
      umbGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x431410,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    umbra.position.copy(moonScene).addScaledVector(sceneAxis, umbraLenScene / 2);
    umbra.quaternion.setFromUnitVectors(up, sceneAxis);
    this.shadowGroup.add(umbra);

    // 环食时补画伪本影延长线
    if (info.type === "annular" && apexScene < hitDist) {
      const antGeometry = new THREE.CylinderGeometry(
        Math.max(0.01, (Math.abs(info.rUmbra) / KM.RE) * VIS.earthR),
        0.004,
        hitDist - apexScene,
        24,
        1,
        true,
      );
      const antumbra = new THREE.Mesh(
        antGeometry,
        new THREE.MeshBasicMaterial({
          color: 0xe43b32,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      antumbra.position.copy(moonScene).addScaledVector(sceneAxis, apexScene + (hitDist - apexScene) / 2);
      antumbra.quaternion.setFromUnitVectors(up, sceneAxis);
      this.shadowGroup.add(antumbra);
    }

    // 地表落点：本影红点 + 半影暗盘
    if (surface) {
      const normal = surface.clone().normalize();
      const coreR = Math.max(0.035, (Math.abs(info.rUmbra) / KM.RE) * VIS.earthR);
      const core = new THREE.Mesh(
        new THREE.CircleGeometry(coreR, 28),
        new THREE.MeshBasicMaterial({ color: 0xe43b32, side: THREE.DoubleSide, toneMapped: false }),
      );
      core.position.copy(surface).addScaledVector(normal, 0.006);
      core.lookAt(surface.clone().add(normal));
      this.shadowGroup.add(core);

      const penDisk = new THREE.Mesh(
        new THREE.CircleGeometry(Math.min(0.9, rPenScene), 32),
        new THREE.MeshBasicMaterial({
          color: 0x0a0a14,
          transparent: true,
          opacity: 0.32,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      penDisk.position.copy(surface).addScaledVector(normal, 0.004);
      penDisk.lookAt(surface.clone().add(normal));
      this.shadowGroup.add(penDisk);
    }

    // 日食带：采样邻近相位角，画出影轴在地表扫过的轨迹
    const band = [];
    for (let dTheta = -2.5; dTheta <= 2.5; dTheta += 0.05) {
      const sample = this.computeEclipse(this.thetaDeg + dTheta);
      const point = this.axisSurfacePoint(sample);
      if (point) band.push(point.multiplyScalar(1.008));
    }
    if (band.length > 1) {
      const bandLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(band),
        new THREE.LineBasicMaterial({ color: 0xff5a4e, transparent: true, opacity: 0.9 }),
      );
      this.shadowGroup.add(bandLine);
    }
  }

  refresh() {
    const info = this.computeEclipse(this.thetaDeg);
    this.rebuildShadow(info);
    this.lastInfo = info;
    return info;
  }

  setTheta(value) {
    this.thetaDeg = value;
    return this.refresh();
  }

  setOmega(value) {
    this.omegaDeg = value;
    this.rebuildOrbitRing();
    return this.refresh();
  }

  setDist(value) {
    this.distKm = value;
    return this.refresh();
  }

  setInclination(deg) {
    this.inclDeg = deg;
    this.rebuildOrbitRing();
    return this.refresh();
  }

  resetCamera() {
    // 全景构图：太阳(-40)、月球轨道(±4)、地球与影锥一屏收齐
    this.camera.position.set(-18.5, 16, 63);
    this.controls.target.set(-18.5, 0.5, 0);
    this.controls.update();
  }

  // 聚焦地球：把地球(原点)置于画面中心，可绕其旋转/缩放观察本影落点与日食带
  focusEarth() {
    this.camera.position.set(-3, 6, 18);
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
    this.earth.rotation.y += delta * 0.12;
    this.stars.rotation.y += delta * 0.004;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    clearGroup(this.shadowGroup);
    clearGroup(this.orbitGroup);
    this.scene.traverse((object) => disposeObject(object));
    this.renderer.dispose();
  }
}

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);

function describe(info, inclDeg) {
  const beta = info.betaDeg.toFixed(2);
  const offset = Math.round(info.offset);
  const lines = [`月球黄纬 β = ${beta}°`, `影轴距地心 ${offset.toLocaleString()} km`];
  if (info.rUmbra !== undefined) {
    if (info.rUmbra > 0) {
      lines.push(`本影触地，地表本影半径约 ${Math.max(0, Math.round(info.rUmbra))} km`);
    } else {
      lines.push(`本影长 ${Math.round(info.umbraLen).toLocaleString()} km，未及地面`);
    }
  }
  if (info.type === "none") {
    lines.push(inclDeg === 0 ? "倾角为 0°时，任何新月都会日食" : "影子从地球上方或下方掠过");
  }
  return lines.join("\n");
}

function syncReadout() {
  const info = state.scene3d.lastInfo;
  $("#se-type").textContent = info.label;
  $("#se-detail").textContent = describe(info, state.scene3d.inclDeg);
  $("#se-caption").textContent =
    state.scene3d.inclDeg === 0 ? "假想倾角 0° · 每个新月都成日食" : "月球轨道倾角 5.1°";
}

function wireInteractions() {
  const scene3d = state.scene3d;

  $("#se-theta").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#se-theta-output").textContent = `${value.toFixed(1)}°`;
    scene3d.setTheta(value);
    syncReadout();
  });

  $("#se-omega").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#se-omega-output").textContent = `${value}°`;
    scene3d.setOmega(value);
    syncReadout();
  });

  $("#se-dist").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#se-dist-output").textContent = `${value} km`;
    scene3d.setDist(value);
    syncReadout();
  });

  const inclToggle = $("#se-incl-toggle");
  inclToggle.addEventListener("click", () => {
    const zeroed = scene3d.inclDeg !== 0;
    scene3d.setInclination(zeroed ? 0 : KM.INCL);
    inclToggle.textContent = zeroed ? "恢复倾角 5.1°" : "假想倾角 = 0°";
    inclToggle.setAttribute("aria-pressed", String(zeroed));
    syncReadout();
  });

  $("#se-focus-earth").addEventListener("click", () => scene3d.focusEarth());
  $("#se-reset-camera").addEventListener("click", () => scene3d.resetCamera());
}

export default {
  id: "solar-eclipse",
  name: "日食",

  getDefaultParams() {
    return { thetaDeg: 0, omegaDeg: 0, distKm: 384400, inclDeg: KM.INCL };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = { scene3d: new SolarEclipseScene3D($("#se-canvas")) };
    wireInteractions();
    syncReadout();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update(params) {
    const delta = Math.min(params?.delta ?? 0, 0.05);
    state?.scene3d.render(delta);
  },

  dispose() {
    if (!state) return;
    state.scene3d.dispose();
    state = null;
    root = null;
  },
};
