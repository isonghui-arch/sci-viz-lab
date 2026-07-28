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

// 注册顺序与 index.html Tab 顺序一致
registerScene(kakeyaScene);
registerScene(solarEclipseScene);
registerScene(lunarEclipseScene);
registerScene(solarSystemScene);
registerScene(seasonsScene);
registerScene(moonPhasesScene);
registerScene(tidesScene);
registerScene(satelliteOrbitScene);
registerScene(plateTectonicsScene);
registerScene(lightRefractionScene);

function start() {
  initSceneLoader({
    container: document.querySelector("#scene-container"),
    tabs: document.querySelectorAll(".scene-tabs .tab-btn"),
    defaultScene: "kakeya",
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
