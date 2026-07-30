// 入口：注册场景 + 启动 scene-loader
import "./style.css";
import { registerScene } from "./scenes/registry.js";
import { initSceneLoader } from "./scene-loader.js";
import kakeyaScene from "./scenes/kakeya.js";
import solarEclipseScene from "./scenes/solar-eclipse.js";
import lunarEclipseScene from "./scenes/lunar-eclipse.js";
import solarSystemScene from "./scenes/solar-system.js";
import seasonsScene from "./scenes/seasons.js";
import moonPhasesScene from "./scenes/moon-phases.js";
import tidesScene from "./scenes/tides.js";
import satelliteOrbitScene from "./scenes/satellite-orbit.js";
import plateTectonicsScene from "./scenes/plate-tectonics.js";
import lightRefractionScene from "./scenes/light-refraction.js";
import shellDemoScene from "./scenes/shell-demo.js";
import fourierScene from "./scenes/fourier.js";
import galtonScene from "./scenes/galton.js";
import doublePendulumScene from "./scenes/double-pendulum.js";
import mandelbrotScene from "./scenes/mandelbrot.js";
import seismicWavesScene from "./scenes/seismic-waves.js";
import circuitOhmScene from "./scenes/circuit-ohm.js";
import electrolysisScene from "./scenes/electrolysis.js";
import convexLensScene from "./scenes/convex-lens.js";
import combustionScene from "./scenes/combustion.js";
import microscopeScene from "./scenes/microscope.js";
import photosynthesisScene from "./scenes/photosynthesis.js";
import leverBalanceScene from "./scenes/lever-balance.js";
import buoyancyScene from "./scenes/buoyancy.js";
import lightReflectionScene from "./scenes/light-reflection.js";
import acidBaseScene from "./scenes/acid-base.js";
import seedGerminationScene from "./scenes/seed-germination.js";
import bloodCirculationScene from "./scenes/blood-circulation.js";
import waveSoundScene from "./scenes/wave-sound.js";
import newtonSecondScene from "./scenes/newton-second.js";
import airOxygenScene from "./scenes/air-oxygen.js";
import solubilityScene from "./scenes/solubility.js";
import respirationScene from "./scenes/respiration.js";
import enzymeScene from "./scenes/enzyme.js";

// 分类映射：导航分组依据（单一数据源）。场景自身带 category 时优先使用。
// 新增场景只需要在 CATEGORY 里加一行（或场景自带 category），导航自动出现。
const CATEGORY = {
  kakeya: "math",
  "solar-eclipse": "astronomy",
  "lunar-eclipse": "astronomy",
  "solar-system": "astronomy",
  seasons: "astronomy",
  "moon-phases": "astronomy",
  tides: "astronomy",
  "satellite-orbit": "mechanics",
  "light-refraction": "mechanics",
  "plate-tectonics": "geoscience",
  "fourier": "math",
  "galton": "probability",
  "double-pendulum": "mechanics",
  "mandelbrot": "math",
  "seismic-waves": "geoscience",
  "circuit-ohm": "physics",
  electrolysis: "chemistry",
  "convex-lens": "physics",
  combustion: "chemistry",
  microscope: "biology",
  photosynthesis: "biology",
  "lever-balance": "physics",
  buoyancy: "physics",
  "light-reflection": "physics",
  "acid-base": "chemistry",
  "seed-germination": "biology",
  "blood-circulation": "biology",
  "wave-sound": "physics",
  "newton-second": "physics",
  "air-oxygen": "chemistry",
  solubility: "chemistry",
  respiration: "biology",
  enzyme: "biology",
};

function reg(scene) {
  registerScene({ ...scene, category: scene.category || CATEGORY[scene.id] || "uncategorized" });
}

reg(kakeyaScene);
reg(solarEclipseScene);
reg(lunarEclipseScene);
reg(solarSystemScene);
reg(seasonsScene);
reg(moonPhasesScene);
reg(tidesScene);
reg(satelliteOrbitScene);
reg(plateTectonicsScene);
reg(lightRefractionScene);
reg(shellDemoScene);
reg(fourierScene);
reg(galtonScene);
reg(doublePendulumScene);
reg(mandelbrotScene);
reg(seismicWavesScene);
reg(circuitOhmScene);
reg(electrolysisScene);
reg(convexLensScene);
reg(combustionScene);
reg(microscopeScene);
reg(photosynthesisScene);
reg(leverBalanceScene);
reg(buoyancyScene);
reg(lightReflectionScene);
reg(acidBaseScene);
reg(seedGerminationScene);
reg(bloodCirculationScene);
reg(waveSoundScene);
reg(newtonSecondScene);
reg(airOxygenScene);
reg(solubilityScene);
reg(respirationScene);
reg(enzymeScene);

function start() {
  initSceneLoader({
    container: document.querySelector("#scene-container"),
    nav: document.querySelector("#scene-tabs"),
    defaultScene: "kakeya",
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
