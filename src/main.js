import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COLORS = {
  red: new THREE.Color("#e43b32"),
  amber: new THREE.Color("#e7a329"),
  blue: new THREE.Color("#7894ad"),
  ivory: new THREE.Color("#f3efe5"),
  navy: new THREE.Color("#07182d"),
};

function setCanvasSize(canvas, width, height, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const nextWidth = Math.max(1, Math.floor(width * dpr));
  const nextHeight = Math.max(1, Math.floor(height * dpr));
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }
  return dpr;
}

function fibonacciDirection(index, total) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / Math.max(1, total - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index;
  return new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
}

function perpendicularBasis(direction) {
  const anchor = Math.abs(direction.y) < 0.88
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0);
  const first = new THREE.Vector3().crossVectors(direction, anchor).normalize();
  const second = new THREE.Vector3().crossVectors(direction, first).normalize();
  return [first, second];
}

class KakeyaScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mode = "star";
    this.count = 320;
    this.radius = 0.014;
    this.motion = !prefersReducedMotion;
    this.group = new THREE.Group();
    this.tempObject = new THREE.Object3D();
    this.tempColor = new THREE.Color();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x07182d, 0.045);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    this.camera.position.set(3.25, 2.2, 3.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setClearColor(0x07182d, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 8;
    this.controls.enablePan = false;

    this.scene.add(this.group);
    this.addLighting();
    this.addGuides();
    this.rebuild();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
    this.animate();
  }

  addLighting() {
    this.scene.add(new THREE.HemisphereLight(0xd7e8f4, 0x07111e, 1.6));
    const key = new THREE.DirectionalLight(0xffe1b7, 2.4);
    key.position.set(3, 4, 2);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x5f9dd1, 1.4);
    rim.position.set(-4, -1, -3);
    this.scene.add(rim);
  }

  addGuides() {
    const guideMaterial = new THREE.LineBasicMaterial({
      color: 0x6d879f,
      transparent: true,
      opacity: 0.22,
    });
    [1.1, 1.55, 2].forEach((radius, index) => {
      const points = [];
      for (let i = 0; i <= 128; i += 1) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, -0.72 + index * 0.05, Math.sin(angle) * radius));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.Line(geometry, guideMaterial);
      this.scene.add(ring);
    });

    const axesMaterial = new THREE.LineBasicMaterial({
      color: 0xc6d5df,
      transparent: true,
      opacity: 0.3,
    });
    const axes = [
      [new THREE.Vector3(-2.2, 0, 0), new THREE.Vector3(2.2, 0, 0)],
      [new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, 2.2, 0)],
      [new THREE.Vector3(0, 0, -2.2), new THREE.Vector3(0, 0, 2.2)],
    ];
    axes.forEach((points) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.scene.add(new THREE.Line(geometry, axesMaterial));
    });
  }

  clearGroup() {
    while (this.group.children.length) {
      const child = this.group.children.pop();
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material?.dispose();
      }
    }
  }

  centerFor(direction, index, total) {
    const [basisA, basisB] = perpendicularBasis(direction);
    const phase = index * 1.61803398875;

    if (this.mode === "spread") {
      return basisA
        .multiplyScalar(Math.sin(phase * 2.3) * 0.72)
        .add(basisB.multiplyScalar(Math.cos(phase * 1.7) * 0.72));
    }

    if (this.mode === "sticky") {
      const cluster = index % 12;
      const clusterAngle = (cluster / 12) * Math.PI * 2;
      const clusterCenter = new THREE.Vector3(
        Math.cos(clusterAngle) * 0.42,
        ((cluster % 3) - 1) * 0.28,
        Math.sin(clusterAngle) * 0.42,
      );
      const localJitter = basisA
        .multiplyScalar(Math.sin(phase * 4.1) * 0.055)
        .add(basisB.multiplyScalar(Math.cos(phase * 3.7) * 0.055));
      return clusterCenter.add(localJitter);
    }

    if (this.mode === "grains") {
      const side = Math.ceil(Math.cbrt(total));
      const x = index % side;
      const y = Math.floor(index / side) % side;
      const z = Math.floor(index / (side * side));
      return new THREE.Vector3(
        (x - (side - 1) / 2) * 0.19,
        (y - (side - 1) / 2) * 0.19,
        (z - (side - 1) / 2) * 0.19,
      );
    }

    return new THREE.Vector3(0, 0, 0);
  }

  addFatTubes() {
    if (this.mode !== "sticky") return;
    const geometry = new THREE.CylinderGeometry(0.075, 0.075, 2.05, 12, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.amber,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, 12);
    for (let i = 0; i < 12; i += 1) {
      const direction = fibonacciDirection(i, 12);
      const angle = (i / 12) * Math.PI * 2;
      this.tempObject.position.set(
        Math.cos(angle) * 0.42,
        ((i % 3) - 1) * 0.28,
        Math.sin(angle) * 0.42,
      );
      this.tempObject.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      this.tempObject.scale.set(1, 1, 1);
      this.tempObject.updateMatrix();
      mesh.setMatrixAt(i, this.tempObject.matrix);
    }
    this.group.add(mesh);
  }

  addGrains() {
    if (this.mode !== "grains") return;
    const count = 48;
    const geometry = new THREE.BoxGeometry(0.22, 0.38, 0.12);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0xe7a329,
      transparent: true,
      opacity: 0.22,
    });
    for (let i = 0; i < count; i += 1) {
      const x = (i % 4) - 1.5;
      const y = (Math.floor(i / 4) % 4) - 1.5;
      const z = Math.floor(i / 16) - 1;
      const box = new THREE.LineSegments(edgesGeometry.clone(), material.clone());
      box.position.set(x * 0.42, y * 0.42, z * 0.44);
      box.rotation.set(0.08 * y, 0.16 * x, 0.08 * z);
      this.group.add(box);
    }
    edgesGeometry.dispose();
    geometry.dispose();
    material.dispose();
  }

  rebuild() {
    this.clearGroup();
    const tubeLength = this.mode === "grains" ? 0.62 : 2.05;
    const radialSegments = this.count > 600 ? 6 : 9;
    const geometry = new THREE.CylinderGeometry(
      this.radius,
      this.radius,
      tubeLength,
      radialSegments,
      1,
      true,
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3f34,
      transparent: true,
      opacity: this.mode === "star" ? 0.62 : 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });
    const amberMaterial = material.clone();
    amberMaterial.color.set(0xffb52b);
    amberMaterial.opacity = this.mode === "star" ? 0.7 : 0.56;
    amberMaterial.depthTest = false;
    const mesh = new THREE.InstancedMesh(geometry, material, this.count);
    const amberCount = Math.ceil(this.count / 5);
    const amberMesh = new THREE.InstancedMesh(geometry.clone(), amberMaterial, amberCount);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    let amberIndex = 0;

    for (let i = 0; i < this.count; i += 1) {
      let direction = fibonacciDirection(i, this.count);
      if (this.mode === "grains") {
        const wobble = ((i % 9) - 4) * 0.025;
        direction = new THREE.Vector3(wobble, 1, Math.sin(i * 1.3) * 0.055).normalize();
      }
      this.tempObject.position.copy(this.centerFor(direction, i, this.count));
      this.tempObject.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      this.tempObject.scale.set(1, 1, 1);
      this.tempObject.updateMatrix();
      mesh.setMatrixAt(i, this.tempObject.matrix);
      if (i % 5 === 0) {
        amberMesh.setMatrixAt(amberIndex, this.tempObject.matrix);
        amberIndex += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    amberMesh.instanceMatrix.needsUpdate = true;
    this.group.add(mesh);
    this.group.add(amberMesh);
    this.addFatTubes();
    this.addGrains();
    this.group.rotation.set(-0.05, 0.16, 0.08);
  }

  setMode(mode) {
    this.mode = mode;
    this.rebuild();
  }

  setCount(count) {
    this.count = count;
    this.rebuild();
  }

  setRadius(radius) {
    this.radius = radius;
    this.rebuild();
  }

  resetCamera() {
    this.camera.position.set(3.25, 2.2, 3.5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.motion) this.group.rotation.y += 0.0016;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}

const heroScene = new KakeyaScene($("#hero-canvas"));
const motionToggle = $("#motion-toggle");
const localMotionToggle = $("#local-motion-toggle");

function syncMotionButtons() {
  const label = heroScene.motion ? "暂停旋转" : "继续旋转";
  motionToggle.textContent = label;
  localMotionToggle.textContent = label;
  motionToggle.setAttribute("aria-pressed", String(!heroScene.motion));
}

function toggleMotion() {
  heroScene.motion = !heroScene.motion;
  syncMotionButtons();
}

motionToggle.addEventListener("click", toggleMotion);
localMotionToggle.addEventListener("click", toggleMotion);
syncMotionButtons();

const modeCopy = {
  star: "中心星束",
  spread: "分散排列",
  sticky: "多尺度黏连",
  grains: "木纹颗粒",
};

$$(".mode-button").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".mode-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    heroScene.setMode(button.dataset.mode);
    const status = `${heroScene.count} 根细管 · δ = ${heroScene.radius.toFixed(3)} · ${modeCopy[button.dataset.mode]}`;
    $("#canvas-status").textContent = status;
  });
});

$("#tube-count").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  $("#tube-count-output").textContent = String(value);
  heroScene.setCount(value);
  $("#canvas-status").textContent = `${value} 根细管 · δ = ${heroScene.radius.toFixed(3)}`;
});

$("#tube-radius").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  $("#tube-radius-output").textContent = value.toFixed(3);
  heroScene.setRadius(value);
  $("#canvas-status").textContent = `${heroScene.count} 根细管 · δ = ${value.toFixed(3)}`;
});

$("#reset-camera").addEventListener("click", () => heroScene.resetCamera());

class NeedleCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    this.mode = "center";
    this.count = 72;
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  segment(index, count, width, height) {
    const angle = (index / count) * Math.PI;
    const length = Math.min(width, height) * 0.54;
    let cx = width * 0.5;
    let cy = height * 0.48;

    if (this.mode === "fan") {
      const normalized = index / Math.max(1, count - 1) - 0.5;
      cx += normalized * width * 0.28;
      cy += Math.sin(angle * 3) * height * 0.07;
    }

    if (this.mode === "compress") {
      const normalized = index / Math.max(1, count - 1) - 0.5;
      cx += Math.sin(angle * 2) * width * 0.105;
      cy += normalized * height * 0.08;
    }

    const dx = Math.cos(angle) * length * 0.5;
    const dy = Math.sin(angle) * length * 0.5;
    return [cx - dx, cy - dy, cx + dx, cy + dy];
  }

  coverage(width, height) {
    const sampleWidth = 360;
    const sampleHeight = Math.max(160, Math.round(sampleWidth * (height / width)));
    const offscreen = document.createElement("canvas");
    offscreen.width = sampleWidth;
    offscreen.height = sampleHeight;
    const ctx = offscreen.getContext("2d", { willReadFrequently: true });
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    for (let i = 0; i < this.count; i += 1) {
      const [x1, y1, x2, y2] = this.segment(i, this.count, sampleWidth, sampleHeight);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    const pixels = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    let covered = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) covered += 1;
    }
    return (covered / (sampleWidth * sampleHeight)) * 100;
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = setCanvasSize(this.canvas, rect.width, rect.height);
    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      0,
      width * 0.5,
      height * 0.48,
      Math.min(width, height) * 0.34,
    );
    gradient.addColorStop(0, "rgba(227,58,50,0.24)");
    gradient.addColorStop(1, "rgba(227,58,50,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";
    for (let i = 0; i < this.count; i += 1) {
      const [x1, y1, x2, y2] = this.segment(i, this.count, width, height);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i % 7 === 0 ? "rgba(229,165,38,0.74)" : "rgba(227,58,50,0.38)";
      ctx.lineWidth = i % 7 === 0 ? 1.4 : 0.85;
      ctx.stroke();
    }

    ctx.fillStyle = "#f3efe5";
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.48, 3.2, 0, Math.PI * 2);
    ctx.fill();

    $("#pixel-coverage").textContent = `${this.coverage(width, height).toFixed(1)}%`;
    $("#needle-count-value").textContent = String(this.count);
  }

  setMode(mode) {
    this.mode = mode;
    this.draw();
  }

  setCount(count) {
    this.count = count;
    this.draw();
  }
}

const needleCanvas = new NeedleCanvas($("#needle-canvas"));
const needleExplanations = {
  center:
    "所有线段穿过同一中心，方向齐全，重叠也最直观。它展示方向条件，并未给出面积最小的构造。",
  fan:
    "让相邻方向的线段稍微错位，交叉区域被拉成扇形。经典 Besicovitch–Perron 构造会反复切分三角形并平移，过程精细得多。",
  compress:
    "把中心位置压到一条窄带附近，许多方向继续相交。这个模式只演示“通过安排位置增加重叠”的想法。",
};

$$("[data-needle-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-needle-mode]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    needleCanvas.setMode(button.dataset.needleMode);
    $("#needle-explanation").textContent = needleExplanations[button.dataset.needleMode];
  });
});

$("#needle-count").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  $("#needle-count-output").textContent = String(value);
  needleCanvas.setCount(value);
});

class MinkowskiCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.delta = 0.03;
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = setCanvasSize(this.canvas, rect.width, rect.height);
    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#e8e0d1";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(17,19,21,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 26) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const cx = width * 0.5;
    const cy = height * 0.52;
    const length = Math.min(width, height) * 0.6;
    const thickness = Math.max(2, this.delta * Math.min(width, height) * 2.2);
    const count = 24;

    ctx.lineCap = "round";
    ctx.lineWidth = thickness;
    ctx.strokeStyle = "rgba(72,102,132,0.2)";
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI;
      const dx = Math.cos(angle) * length * 0.5;
      const dy = Math.sin(angle) * length * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - dx, cy - dy);
      ctx.lineTo(cx + dx, cy + dy);
      ctx.stroke();
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI;
      const dx = Math.cos(angle) * length * 0.5;
      const dy = Math.sin(angle) * length * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - dx, cy - dy);
      ctx.lineTo(cx + dx, cy + dy);
      ctx.strokeStyle = i % 5 === 0 ? "#b41f24" : "rgba(17,19,21,0.55)";
      ctx.stroke();
    }

    ctx.fillStyle = "#b41f24";
    ctx.font = `11px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;
    ctx.fillText(`δ = ${this.delta.toFixed(3)}`, 16, 22);
  }

  setDelta(delta) {
    this.delta = delta;
    this.draw();
  }
}

const minkowskiCanvas = new MinkowskiCanvas($("#minkowski-canvas"));
$("#delta-slider").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  $("#delta-output").textContent = `δ = ${value.toFixed(3)}`;
  minkowskiCanvas.setDelta(value);
});

const proofContent = [
  {
    kicker: "STEP 1 · DISCRETIZE",
    title: "把“每个方向”换成约 δ<sup>−2</sup> 根细管",
    intuition:
      "在三维中，从球面选取彼此相隔约 δ 的方向，数量约为 δ<sup>−2</sup>。每个方向放一根长 1、半径 δ 的管。问题转化为：这些管最多能重叠到什么程度？",
    math:
      "并集 U(𝕋) 越小，典型重数 μ(𝕋) = (Σ<sub>T∈𝕋</sub>|T|) / |U(𝕋)| 越大。目标是证明 μ 只能有 δ<sup>−ε</sup> 级损失。",
  },
  {
    kicker: "STEP 2 · MULTISCALE",
    title: "在中间尺度 ρ 上，把细管装进粗管",
    intuition:
      "把每根 δ 细管加粗到半径 ρ。相近的方向与位置会合并成同一根粗管。这样可以同时观察“粗尺度有多少束”和“每束里塞了多少细管”。",
    math:
      "记 𝕋<sub>ρ</sub> 为 ρ 粗管族，𝕋<sub>Tρ</sub> 为落在某根粗管内的细管。经分层选择后有 |𝕋| ≈ |𝕋<sub>ρ</sub>|·|𝕋<sub>Tρ</sub>|。",
  },
  {
    kicker: "STEP 3 · STICKINESS",
    title: "“黏连”表示每个尺度都接近允许的最大打包",
    intuition:
      "若相近细管在所有中间尺度上总能稳定地抱成束，配置就具有多尺度自相似。王虹与 Zahl 先解决了这一高度结构化的特殊情形。",
    math:
      "黏连情形中，重数近似分解为 μ(𝕋) ≈ μ(𝕋<sub>Tρ</sub>)·μ(𝕋<sub>ρ</sub>)。多个尺度上的近似等号迫使配置出现很强的刚性。",
  },
  {
    kicker: "STEP 4 · GRAININESS",
    title: "局部重叠被迫长成平行的“木纹颗粒”",
    intuition:
      "在合适的小球里，管的并集呈现许多薄而短的矩形片；同一个小球中的颗粒大体平行。这种 graininess 让复杂线管问题出现可数、可比较的局部骨架。",
    math:
      "Katz–Łaba–Tao 的结构思想把黏连配置联系到 planiness、graininess 与离散 sum-product。王虹与 Zahl 完成其中需要的大量技术环节。",
  },
  {
    kicker: "STEP 5 · INDUCTION ON SCALES",
    title: "非黏连配置若声称“最坏”，尺度归纳会逼出矛盾",
    intuition:
      "王虹与 Zahl 证明：缺少黏连时，可以在某些小球、薄板或凸集里重排尺度信息，得到比假设更好的重叠上界。真正的最坏情形因此只能是已解决的黏连情形。",
    math:
      "证明引入 Frostman 型密度条件与高密度引理，并在厚棱柱、薄棱柱等情形中结合归纳和二维 L² 估计。若最佳指数 β > 0，非黏连情形会给出 μ(𝕋) ≪ |𝕋|<sup>β</sup>，违背 β 的最坏性，故 β = 0。",
  },
];

class ProofCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.stage = 0;
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas.parentElement);
    this.draw();
  }

  line(ctx, x1, y1, x2, y2, color = "rgba(227,58,50,0.65)", width = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  drawTubes(ctx, width, height, grouped = false) {
    const count = grouped ? 36 : 54;
    const cx = width * 0.5;
    const cy = height * 0.47;
    const length = Math.min(width, height) * 0.62;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI + (grouped ? ((i % 6) - 3) * 0.008 : 0);
      const groupOffset = grouped ? ((i % 6) - 2.5) * Math.min(width, height) * 0.015 : 0;
      const dx = Math.cos(angle) * length * 0.5;
      const dy = Math.sin(angle) * length * 0.5;
      this.line(
        ctx,
        cx - dx,
        cy - dy + groupOffset,
        cx + dx,
        cy + dy + groupOffset,
        i % 7 === 0 ? "rgba(229,165,38,0.82)" : "rgba(227,58,50,0.48)",
        i % 7 === 0 ? 1.4 : 0.85,
      );
    }
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = setCanvasSize(this.canvas, rect.width, rect.height);
    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";

    if (this.stage === 0) {
      this.drawTubes(ctx, width, height, false);
      ctx.strokeStyle = "rgba(243,239,229,0.24)";
      ctx.strokeRect(width * 0.23, height * 0.17, width * 0.54, height * 0.58);
    }

    if (this.stage === 1) {
      this.drawTubes(ctx, width, height, true);
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI;
        const cx = width * 0.5;
        const cy = height * 0.47;
        const length = Math.min(width, height) * 0.68;
        const dx = Math.cos(angle) * length * 0.5;
        const dy = Math.sin(angle) * length * 0.5;
        this.line(ctx, cx - dx, cy - dy, cx + dx, cy + dy, "rgba(120,148,173,0.2)", 14);
      }
    }

    if (this.stage === 2) {
      const clusters = 7;
      for (let cluster = 0; cluster < clusters; cluster += 1) {
        const baseAngle = (cluster / clusters) * Math.PI;
        const cx = width * (0.22 + (cluster % 4) * 0.18);
        const cy = height * (0.33 + Math.floor(cluster / 4) * 0.28);
        for (let i = 0; i < 12; i += 1) {
          const angle = baseAngle + (i - 6) * 0.012;
          const length = Math.min(width, height) * 0.36;
          const dx = Math.cos(angle) * length * 0.5;
          const dy = Math.sin(angle) * length * 0.5;
          this.line(ctx, cx - dx, cy - dy, cx + dx, cy + dy, "rgba(227,58,50,0.5)", 1);
        }
        ctx.beginPath();
        ctx.arc(cx, cy, 25, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229,165,38,0.07)";
        ctx.fill();
      }
    }

    if (this.stage === 3) {
      const columns = Math.max(5, Math.floor(width / 100));
      const rows = 5;
      const startX = width * 0.16;
      const startY = height * 0.2;
      const gapX = (width * 0.68) / Math.max(1, columns - 1);
      const gapY = (height * 0.55) / Math.max(1, rows - 1);
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const x = startX + col * gapX + (row % 2) * 14;
          const y = startY + row * gapY;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.2 + row * 0.045);
          ctx.fillStyle = (row + col) % 4 === 0 ? "rgba(229,165,38,0.3)" : "rgba(243,239,229,0.14)";
          ctx.strokeStyle = "rgba(243,239,229,0.28)";
          ctx.fillRect(-26, -8, 52, 16);
          ctx.strokeRect(-26, -8, 52, 16);
          ctx.restore();
        }
      }
    }

    if (this.stage === 4) {
      const levels = 5;
      for (let level = 0; level < levels; level += 1) {
        const size = Math.min(width, height) * (0.16 + level * 0.115);
        ctx.strokeStyle = level === levels - 1 ? "rgba(229,165,38,0.78)" : "rgba(120,148,173,0.45)";
        ctx.lineWidth = 1;
        ctx.strokeRect(width * 0.5 - size / 2, height * 0.47 - size / 2, size, size);
        ctx.fillStyle = "rgba(243,239,229,0.58)";
        ctx.font = "11px monospace";
        ctx.fillText(level === 0 ? "δ" : `ρ${level}`, width * 0.5 + size / 2 + 8, height * 0.47 - size / 2 + 11);
      }
      this.line(ctx, width * 0.18, height * 0.82, width * 0.82, height * 0.82, "rgba(227,58,50,0.65)", 1);
      for (let i = 0; i < levels; i += 1) {
        const x = width * 0.18 + (i / (levels - 1)) * width * 0.64;
        ctx.beginPath();
        ctx.arc(x, height * 0.82, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === levels - 1 ? "#e5a526" : "#e33a32";
        ctx.fill();
      }
    }
  }

  setStage(stage) {
    this.stage = stage;
    this.draw();
  }
}

const proofCanvas = new ProofCanvas($("#proof-canvas"));
let proofLevel = "intuition";

function updateProofContent(stage) {
  const content = proofContent[stage];
  $("#proof-kicker").textContent = content.kicker;
  $("#proof-step-title").innerHTML = content.title;
  $("#proof-step-body").innerHTML = content[proofLevel];
  $("#proof-math").hidden = proofLevel !== "math";
  if (proofLevel === "math") {
    $("#proof-math p").innerHTML = content.math;
  }
}

$$(".proof-stage").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".proof-stage").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");
    const stage = Number(button.dataset.proofStage);
    proofCanvas.setStage(stage);
    updateProofContent(stage);
  });
});

$$("[data-proof-level]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-proof-level]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    proofLevel = button.dataset.proofLevel;
    const activeStage = Number($(".proof-stage.is-active").dataset.proofStage);
    updateProofContent(activeStage);
  });
});

function updateReadingProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
  $(".reading-progress span").style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();
