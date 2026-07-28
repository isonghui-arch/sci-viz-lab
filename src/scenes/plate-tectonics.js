// 板块运动场景：球面 Voronoi 式简化板块 + 欧拉极旋转演示漂移趋势 + 三种边界剖面小图
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const template = `
  <style>
    .plate-scene .hero-lead { max-width: 460px; }
    .plate-scene #plate-canvas { width: 100%; height: 650px; cursor: grab; touch-action: none; }
    .plate-scene #plate-canvas:active { cursor: grabbing; }
    .plate-scene .plate-copy p { max-width: 760px; margin-bottom: 18px; font-size: 16px; line-height: 1.75; }
    .plate-scene .plate-legend {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.66);
      font-size: 11.5px;
      line-height: 1.9;
    }
    .plate-scene .plate-legend i {
      display: inline-block;
      width: 9px;
      height: 9px;
      margin-right: 6px;
      border-radius: 2px;
    }
    .plate-scene .plate-section-lab {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
      gap: clamp(24px, 3vw, 44px);
      align-items: start;
    }
    .plate-scene .plate-section-panel {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--rule);
      border-radius: var(--radius);
      background: #0a1c31;
    }
    .plate-scene #plate-section-canvas { width: 100%; height: 380px; }
    .plate-scene .plate-section-copy h3 { margin: 18px 0 10px; font-family: var(--serif); font-size: 24px; }
    .plate-scene .plate-section-copy p { color: var(--muted); font-size: 15px; line-height: 1.75; }
    .plate-scene .plate-section-copy .segmented { border-color: rgba(17, 19, 21, 0.3); }
    .plate-scene .plate-section-copy .segmented button { color: rgba(17, 19, 21, 0.62); }
    .plate-scene .plate-section-copy .segmented button.is-active { color: #fff; }
    @media (max-width: 1240px) {
      .plate-scene #plate-canvas { height: 620px; }
    }
    @media (max-width: 900px) {
      .plate-scene .plate-section-lab { grid-template-columns: 1fr; }
    }
  </style>

  <div class="plate-scene" id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="figure-no">FIG. 03 / TECTONICS LAB</p>
        <h1>大陆在漂，<br />只是慢得<br />像指甲生长。</h1>
        <p class="hero-lead">
          地球外壳碎成十几块刚性板块，以每年 2–10 cm 的速度相互推挤、分离、错动。
        </p>
        <a class="primary-action" href="#plate-intuition">
          开始实验
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </a>
        <p class="hero-note">
          拖动旋转 · 滚轮缩放 · 拉动时间滑杆看百万年尺度的漂移<br />
          板块形状为示意简化，运动方向参考现代 GPS 观测趋势。
        </p>
      </div>

      <div class="lab-shell" aria-label="板块运动交互实验">
        <div class="lab-canvas-wrap">
          <canvas id="plate-canvas" aria-label="三维板块运动模型"></canvas>
          <div class="canvas-caption">
            <span>刚性板块 · 欧拉极旋转</span>
            <span id="plate-canvas-status">t = 0 百万年</span>
          </div>
        </div>

        <aside class="lab-controls" aria-label="演示设置">
          <h2>演示设置</h2>

          <label class="control-row" for="plate-time">
            <span>时间推进 <i>t</i></span>
            <output id="plate-time-output">0 Ma</output>
          </label>
          <input id="plate-time" type="range" min="0" max="200" step="1" value="0" />

          <label class="control-row" for="plate-arrow-scale">
            <span>运动矢量放大</span>
            <output id="plate-arrow-scale-output">1.0×</output>
          </label>
          <input id="plate-arrow-scale" type="range" min="0.5" max="2.5" step="0.1" value="1" />

          <div class="lab-actions">
            <button id="plate-reset-time" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
              </svg>
              回到今天
            </button>
            <button id="plate-arrows-toggle" class="accent-button" type="button" aria-pressed="true">
              隐藏矢量
            </button>
          </div>

          <div class="plate-legend" id="plate-legend" aria-label="板块图例"></div>
        </aside>
      </div>
    </section>

    <section class="section-pad" id="plate-intuition" aria-labelledby="plate-intuition-title">
      <div class="section-heading">
        <p class="section-index">01</p>
        <div>
          <h2 id="plate-intuition-title">直觉模型：漂在软垫上的硬壳</h2>
          <p>岩石圈是硬的，下面的软流圈却能缓慢流动——硬壳因此可以整块移动。</p>
        </div>
      </div>
      <div class="plate-copy">
        <p>
          地球最外层约 100 km 厚的岩石圈并不是完整一块，而是碎成七大板块与若干小板块。
          板块内部近似刚性，变形和地震集中在板块之间的边界上——把全球地震震中画在地图上，
          板块的轮廓会自己浮现出来。
        </p>
        <p>
          刚性板块在球面上的运动等价于绕某根轴的旋转，这根轴与地表的交点叫欧拉极。
          板块上每一点的速度方向都垂直于它到欧拉极的连线，离极越远走得越快。
          本页的演示正是让每个板块绕各自的欧拉极匀速旋转。
        </p>
        <p>
          速度量级是每年 2–10 cm：大西洋中脊扩张较慢（约 2–5 cm/yr），东太平洋隆起较快（可超过 10 cm/yr）。
          听上去微不足道，但乘以一亿年，就是上万公里——足够让大西洋从一条裂缝张成一片大洋。
        </p>
      </div>
    </section>

    <section class="section-pad" aria-labelledby="plate-boundary-title">
      <div class="section-heading">
        <p class="section-index">02</p>
        <div>
          <h2 id="plate-boundary-title">剖面实验：三种板块边界</h2>
          <p>板块相遇的方式只有三种：分开、相撞、擦肩而过。</p>
        </div>
      </div>
      <div class="plate-section-lab">
        <div class="plate-section-panel">
          <canvas id="plate-section-canvas" aria-label="板块边界剖面示意"></canvas>
        </div>
        <div class="plate-section-copy">
          <div class="segmented" role="group" aria-label="边界类型">
            <button class="is-active" data-plate-boundary="divergent" type="button">离散边界</button>
            <button data-plate-boundary="convergent" type="button">汇聚边界</button>
            <button data-plate-boundary="transform" type="button">转换边界</button>
          </div>
          <h3 id="plate-boundary-name">离散边界 · 洋中脊</h3>
          <p id="plate-boundary-body">
            两个板块相互分离，地幔物质上涌、冷凝成新的洋壳，形成绵延全球约 6.5 万 km 的洋中脊体系。
            大西洋中脊每年新增约 2–5 cm 洋底，冰岛正是它露出海面的部分。
          </p>
        </div>
      </div>
    </section>

    <section class="limits section-pad" aria-labelledby="plate-limits-title">
      <div class="section-heading">
        <p class="section-index">03</p>
        <div>
          <h2 id="plate-limits-title">这个模型简化了什么</h2>
          <p>示意图帮助看清机制，但真实板块构造有更多细节。</p>
        </div>
      </div>
      <div class="limits-grid">
        <article>
          <span>简化 1</span>
          <h3>板块形状是示意的</h3>
          <p>
            画面用球面近邻分区生成色块，只保留“十几块、大小悬殊”的拓扑感，
            并不复现真实板块边界的几何细节。
          </p>
        </article>
        <article>
          <span>简化 2</span>
          <h3>欧拉极与速度被固定</h3>
          <p>
            演示假设每个板块的旋转轴和速率在两亿年里不变。真实板块运动会因碰撞、俯冲板片断离
            等事件改变方向——印度板块就曾在与欧亚碰撞后明显减速。
          </p>
        </article>
        <article>
          <span>简化 3</span>
          <h3>边界不产生新地壳</h3>
          <p>
            演示中板块分离处只露出底色，不生成新洋壳，汇聚处则直接穿插。
            真实边界伴随增生、俯冲消减、造山与火山作用。
          </p>
        </article>
      </div>
    </section>

    <section class="sources section-pad" aria-labelledby="plate-sources-title">
      <div class="section-heading light-heading">
        <p class="section-index">04</p>
        <div>
          <h2 id="plate-sources-title">来源与核验路径</h2>
          <p>板块速度、边界类型与历史以下列资料为准。</p>
        </div>
      </div>
      <div class="source-table" role="table" aria-label="资料来源">
        <div class="source-row source-head" role="row">
          <span role="columnheader">类型</span>
          <span role="columnheader">资料</span>
          <span role="columnheader">用于核验</span>
        </div>
        <a class="source-row" role="row" href="https://pubs.usgs.gov/gip/dynamic/understanding.html" target="_blank" rel="noreferrer">
          <span role="cell">USGS</span>
          <strong role="cell">This Dynamic Earth · Understanding plate motions</strong>
          <span role="cell">三种边界类型与典型速率</span>
        </a>
        <a class="source-row" role="row" href="https://www.usgs.gov/faqs/what-tectonic-plate" target="_blank" rel="noreferrer">
          <span role="cell">USGS</span>
          <strong role="cell">USGS FAQ · What is a tectonic plate?</strong>
          <span role="cell">板块定义、岩石圈厚度量级</span>
        </a>
        <a class="source-row" role="row" href="https://en.wikipedia.org/wiki/Plate_tectonics" target="_blank" rel="noreferrer">
          <span role="cell">百科</span>
          <strong role="cell">Wikipedia · Plate tectonics</strong>
          <span role="cell">欧拉极描述、各板块现代运动速度</span>
        </a>
      </div>
      <p class="source-policy">
        运动矢量的方向与相对快慢参考现代板块运动模型的整体趋势；矢量长度经放大处理，仅示意相对速度。
      </p>
    </section>
  </div>
`;

// 简化板块表：名称 / 颜色 / 球面种子点(lat, lon) / 欧拉极(lat, lon) / 代表速率 cm·yr⁻¹（含转向）
const PLATES = [
  {
    name: "太平洋板块", color: 0x33566f, speed: 8,
    seeds: [[5, -160], [25, -155], [-25, -140], [40, 175], [-45, -125], [-10, 175]],
    pole: [-60, 95],
  },
  {
    name: "北美板块", color: 0xb08a4f, speed: 2.3,
    seeds: [[45, -100], [60, -120], [30, -85], [65, -155], [70, -50]],
    pole: [-5, -85],
  },
  {
    name: "南美板块", color: 0xc4a06a, speed: 3,
    seeds: [[-15, -60], [-35, -65], [0, -52], [-25, -45]],
    pole: [-55, -85],
  },
  {
    name: "欧亚板块", color: 0x8f9f6b, speed: 2.5,
    seeds: [[50, 80], [55, 30], [35, 105], [62, 120], [45, 10], [30, 60]],
    pole: [50, -110],
  },
  {
    name: "非洲板块", color: 0xb9803f, speed: 2.5,
    seeds: [[5, 20], [-20, 22], [25, 8], [-5, 40], [15, -5]],
    pole: [50, -75],
  },
  {
    name: "印度-澳大利亚板块", color: 0x9c6a48, speed: 6.5,
    seeds: [[-25, 133], [-15, 118], [18, 76], [-30, 150], [-8, 95]],
    pole: [12, 40],
  },
  {
    name: "南极板块", color: 0x7d8b9a, speed: 1.5,
    seeds: [[-82, 0], [-75, 120], [-75, -120], [-68, 60]],
    pole: [65, -125],
  },
  {
    name: "纳斯卡板块", color: 0x6e7f56, speed: 7,
    seeds: [[-18, -95], [-5, -88], [-28, -85]],
    pole: [45, -100],
  },
];

function latLonToVector(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

class PlateGlobe3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.timeMa = 0; // 百万年
    this.arrowScale = 1;
    this.arrowsVisible = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
    this.camera.position.set(1.9, 1.35, 2.4);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 1.7;
    this.controls.maxDistance = 6;
    this.controls.enablePan = false;

    this.scene.add(new THREE.HemisphereLight(0xdce9f4, 0x0a1626, 1.5));
    const key = new THREE.DirectionalLight(0xfff2d9, 1.7);
    key.position.set(4, 3, 5);
    this.scene.add(key);

    this.buildBaseSphere();
    this.buildPlates();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  buildBaseSphere() {
    // 内层暗球：板块分离后露出的“新洋壳”底色
    const geometry = new THREE.SphereGeometry(0.985, 48, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x14263c,
      roughness: 0.95,
      metalness: 0,
    });
    this.scene.add(new THREE.Mesh(geometry, material));
  }

  buildPlates() {
    // 球面近邻分区：细分二十面体的每个面归属于最近种子点所在的板块
    const source = new THREE.IcosahedronGeometry(1, 5).toNonIndexed();
    const positions = source.getAttribute("position");
    const faceCount = positions.count / 3;

    const seedVectors = [];
    PLATES.forEach((plate, plateIndex) => {
      plate.seeds.forEach(([lat, lon]) => {
        seedVectors.push({ vector: latLonToVector(lat, lon), plateIndex });
      });
    });

    const faceBuckets = PLATES.map(() => []);
    const centroid = new THREE.Vector3();
    const va = new THREE.Vector3();
    const vb = new THREE.Vector3();
    const vc = new THREE.Vector3();
    for (let face = 0; face < faceCount; face += 1) {
      va.fromBufferAttribute(positions, face * 3);
      vb.fromBufferAttribute(positions, face * 3 + 1);
      vc.fromBufferAttribute(positions, face * 3 + 2);
      centroid.copy(va).add(vb).add(vc).normalize();
      let best = 0;
      let bestDot = -2;
      for (let i = 0; i < seedVectors.length; i += 1) {
        const dot = centroid.dot(seedVectors[i].vector);
        if (dot > bestDot) {
          bestDot = dot;
          best = seedVectors[i].plateIndex;
        }
      }
      faceBuckets[best].push(face);
    }

    this.plateMeshes = [];
    this.arrows = [];
    PLATES.forEach((plate, plateIndex) => {
      const faces = faceBuckets[plateIndex];
      const array = new Float32Array(faces.length * 9);
      faces.forEach((face, i) => {
        for (let v = 0; v < 3; v += 1) {
          array[i * 9 + v * 3] = positions.getX(face * 3 + v);
          array[i * 9 + v * 3 + 1] = positions.getY(face * 3 + v);
          array[i * 9 + v * 3 + 2] = positions.getZ(face * 3 + v);
        }
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(array, 3));
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        color: plate.color,
        roughness: 0.85,
        metalness: 0.02,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      // 每块板块的旋转轴 = 欧拉极方向
      mesh.userData.poleAxis = latLonToVector(plate.pole[0], plate.pole[1]).normalize();
      // 角速度：rad/Ma ≈ v[cm/yr] × 1e4 m/Ma ÷ 地球半径 6.371e6 m
      mesh.userData.omega = (plate.speed * 1e4) / 6.371e6;
      this.scene.add(mesh);
      this.plateMeshes.push(mesh);

      // 运动矢量：在种子点处画切向箭头，长度 ∝ 速率，作为板块子对象随板块旋转
      plate.seeds.slice(0, 3).forEach(([lat, lon]) => {
        const origin = latLonToVector(lat, lon, 1.012);
        const dir = new THREE.Vector3()
          .crossVectors(mesh.userData.poleAxis, origin)
          .normalize();
        const length = 0.05 + plate.speed * 0.018;
        const arrow = new THREE.ArrowHelper(dir, origin, length, 0xf3efe5, length * 0.4, length * 0.22);
        arrow.userData.baseLength = length;
        mesh.add(arrow);
        this.arrows.push(arrow);
      });
    });
    source.dispose();
  }

  setTime(timeMa) {
    this.timeMa = timeMa;
    this.plateMeshes.forEach((mesh) => {
      mesh.quaternion.setFromAxisAngle(mesh.userData.poleAxis, mesh.userData.omega * timeMa);
    });
  }

  setArrowScale(scale) {
    this.arrowScale = scale;
    this.arrows.forEach((arrow) => {
      const length = arrow.userData.baseLength * scale;
      arrow.setLength(length, length * 0.4, length * 0.22);
    });
  }

  setArrowsVisible(visible) {
    this.arrowsVisible = visible;
    this.arrows.forEach((arrow) => {
      arrow.visible = visible;
    });
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

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    // ArrowHelper 内部几何体由 traverse 统一释放
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

// 副面小图：三种边界的 2D 剖面示意
class BoundarySectionCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = "divergent";
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  arrow(ctx, x1, y1, x2, y2, color, width = 2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 8;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  label(ctx, text, x, y) {
    ctx.fillStyle = "rgba(243, 239, 229, 0.82)";
    ctx.font = "12px sans-serif";
    ctx.fillText(text, x, y);
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = setCanvasSize(this.canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const surfaceY = h * 0.42;
    // 软流圈背景
    const mantle = ctx.createLinearGradient(0, surfaceY, 0, h);
    mantle.addColorStop(0, "#7a3d2c");
    mantle.addColorStop(1, "#4a2018");
    ctx.fillStyle = mantle;
    ctx.fillRect(0, surfaceY, w, h - surfaceY);
    // 海水 / 天空
    ctx.fillStyle = "#0e2f4d";
    ctx.fillRect(0, 0, w, surfaceY);

    const plateH = h * 0.13;
    ctx.fillStyle = "#9a8a6d";

    if (this.mode === "divergent") {
      const gap = w * 0.05;
      // 两侧岩石圈向外分离，中间地幔上涌
      ctx.fillRect(0, surfaceY, w / 2 - gap, plateH);
      ctx.fillRect(w / 2 + gap, surfaceY, w / 2 - gap, plateH);
      ctx.fillStyle = "#c25438";
      ctx.beginPath();
      ctx.moveTo(w / 2 - gap, surfaceY + plateH);
      ctx.lineTo(w / 2, surfaceY - h * 0.05);
      ctx.lineTo(w / 2 + gap, surfaceY + plateH);
      ctx.lineTo(w / 2 + gap * 1.8, h * 0.92);
      ctx.lineTo(w / 2 - gap * 1.8, h * 0.92);
      ctx.closePath();
      ctx.fill();
      this.arrow(ctx, w * 0.38, surfaceY + plateH * 0.5, w * 0.24, surfaceY + plateH * 0.5, "#f3efe5");
      this.arrow(ctx, w * 0.62, surfaceY + plateH * 0.5, w * 0.76, surfaceY + plateH * 0.5, "#f3efe5");
      this.arrow(ctx, w / 2, h * 0.8, w / 2, surfaceY + plateH + 8, "#e5a526");
      this.label(ctx, "洋中脊 · 新洋壳在此生成", w / 2 - 74, surfaceY - h * 0.09);
      this.label(ctx, "← 板块分离 → 约 2–5 cm/yr", w / 2 - 82, h * 0.94);
    }

    if (this.mode === "convergent") {
      // 大洋板块俰冲到大陆板块之下
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, surfaceY);
      ctx.lineTo(w * 0.52, surfaceY);
      ctx.lineTo(w * 0.88, h * 0.95);
      ctx.lineTo(w * 0.72, h * 0.98);
      ctx.lineTo(0, surfaceY + plateH);
      ctx.closePath();
      ctx.fillStyle = "#6e7f56";
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#9a8a6d";
      ctx.beginPath();
      ctx.moveTo(w * 0.55, surfaceY - h * 0.02);
      ctx.lineTo(w, surfaceY - h * 0.02);
      ctx.lineTo(w, surfaceY + plateH * 1.4);
      ctx.lineTo(w * 0.62, surfaceY + plateH * 1.5);
      ctx.closePath();
      ctx.fill();
      // 火山弧
      ctx.fillStyle = "#7d6a4f";
      ctx.beginPath();
      ctx.moveTo(w * 0.68, surfaceY - h * 0.02);
      ctx.lineTo(w * 0.74, surfaceY - h * 0.14);
      ctx.lineTo(w * 0.8, surfaceY - h * 0.02);
      ctx.closePath();
      ctx.fill();
      this.arrow(ctx, w * 0.16, surfaceY + plateH * 0.4, w * 0.32, surfaceY + plateH * 0.5, "#f3efe5");
      this.arrow(ctx, w * 0.92, surfaceY + plateH * 0.6, w * 0.78, surfaceY + plateH * 0.7, "#f3efe5");
      this.label(ctx, "海沟", w * 0.5, surfaceY - h * 0.06);
      this.label(ctx, "俰冲带 · 密度大的洋壳下潜", w * 0.42, h * 0.88);
      this.label(ctx, "火山弧", w * 0.7, surfaceY - h * 0.17);
    }

    if (this.mode === "transform") {
      // 俯视视角：两板块沿断层水平错动
      ctx.fillStyle = "#6e7f56";
      ctx.fillRect(0, 0, w, h * 0.48);
      ctx.fillStyle = "#9a8a6d";
      ctx.fillRect(0, h * 0.52, w, h * 0.48);
      ctx.strokeStyle = "#e33a32";
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      this.arrow(ctx, w * 0.3, h * 0.3, w * 0.62, h * 0.3, "#f3efe5", 3);
      this.arrow(ctx, w * 0.7, h * 0.7, w * 0.38, h * 0.7, "#f3efe5", 3);
      this.label(ctx, "俯视图 · 走滑断层（如圣安地列斯断层）", w * 0.28, h * 0.55 + 22);
      this.label(ctx, "两侧反向错动 · 既不新生也不消亡地壳", w * 0.26, h * 0.12);
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.draw();
  }

  dispose() {
    this.resizeObserver.disconnect();
  }
}

const boundaryCopy = {
  divergent: {
    name: "离散边界 · 洋中脊",
    body:
      "两个板块相互分离，地幔物质上涌、冷凝成新的洋壳，形成绵延全球约 6.5 万 km 的洋中脊体系。大西洋中脊每年新增约 2–5 cm 洋底，冰岛正是它露出海面的部分。",
  },
  convergent: {
    name: "汇聚边界 · 俰冲带",
    body:
      "两个板块相向而行，密度更大的大洋板块俯冲下潜入地幔，在海底留下深海沟，在陆地一侧造就火山弧。全球最强的地震与马里亚纳海沟都发生在这里；若两侧都是大陆，则隆起为喜马拉雅式的高山。",
  },
  transform: {
    name: "转换边界 · 走滑断层",
    body:
      "两个板块沿断层水平擦肩而过，既不新生也不消亡地壳。加利福尼亚的圣安地列斯断层是最著名的例子，两侧以每年约 5 cm 的速率错动，应力积累释放时引发地震。",
  },
};

let root = null;
let state = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

function buildLegend() {
  const legend = $("#plate-legend");
  legend.innerHTML = PLATES
    .map((plate) => {
      const hex = `#${plate.color.toString(16).padStart(6, "0")}`;
      return `<span><i style="background:${hex}"></i>${plate.name} · 约 ${plate.speed} cm/yr</span><br />`;
    })
    .join("");
}

function wireInteractions() {
  const { globe, section } = state;

  $("#plate-time").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    globe.setTime(value);
    $("#plate-time-output").textContent = `${value} Ma`;
    $("#plate-canvas-status").textContent = `t = ${value} 百万年`;
  });

  $("#plate-arrow-scale").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    globe.setArrowScale(value);
    $("#plate-arrow-scale-output").textContent = `${value.toFixed(1)}×`;
  });

  $("#plate-reset-time").addEventListener("click", () => {
    globe.setTime(0);
    $("#plate-time").value = "0";
    $("#plate-time-output").textContent = "0 Ma";
    $("#plate-canvas-status").textContent = "t = 0 百万年";
  });

  const arrowsToggle = $("#plate-arrows-toggle");
  arrowsToggle.addEventListener("click", () => {
    globe.setArrowsVisible(!globe.arrowsVisible);
    arrowsToggle.textContent = globe.arrowsVisible ? "隐藏矢量" : "显示矢量";
    // aria-pressed 表达“矢量当前是否显示”，与模板初始值 aria-pressed="true"（默认显示）一致
    arrowsToggle.setAttribute("aria-pressed", String(globe.arrowsVisible));
  });

  $$("[data-plate-boundary]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-plate-boundary]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const mode = button.dataset.plateBoundary;
      section.setMode(mode);
      $("#plate-boundary-name").textContent = boundaryCopy[mode].name;
      $("#plate-boundary-body").textContent = boundaryCopy[mode].body;
    });
  });
}

export default {
  id: "plate-tectonics",
  name: "板块运动",

  getDefaultParams() {
    return { timeMa: 0, arrowScale: 1, boundary: "divergent" };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = {
      globe: new PlateGlobe3D($("#plate-canvas")),
      section: new BoundarySectionCanvas($("#plate-section-canvas")),
    };
    buildLegend();
    wireInteractions();
  },

  // 由 scene-loader 的单一 rAF 循环驱动
  update() {
    state?.globe.render();
  },

  dispose() {
    if (!state) return;
    state.globe.dispose();
    state.section.dispose();
    state = null;
    root = null;
  },
};
