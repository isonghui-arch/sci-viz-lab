// scene-loader：管理当前激活场景、Tab 切换与统一渲染循环
import { getScene, getAllScenes } from "./scenes/registry.js";
import { buildSceneTabs } from "./scene-shell.js";

const state = {
  container: null,
  tabs: [],
  activeId: null,
  activeScene: null,
  activeParams: null,
  rafId: 0,
  lastTime: 0,
  elapsed: 0,
};

function renderPlaceholder(name) {
  state.container.innerHTML = `
    <section class="scene-placeholder">
      <p class="placeholder-kicker">COMING SOON</p>
      <h2>${name}</h2>
      <p class="placeholder-note">该场景即将上线，敬请期待。</p>
      <span class="placeholder-mark" aria-hidden="true"></span>
    </section>
  `;
}

function updateTabs(id) {
  state.tabs.forEach((tab) => {
    const isActive = tab.dataset.scene === id;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

// 兼容旧版外链的 hash 深链接：内容由 JS 注入后浏览器不会自动滚动，需手动补一次
function scrollToHashIfNeeded() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return;
  try {
    const target = document.querySelector(hash);
    target?.scrollIntoView({ behavior: "auto", block: "start" });
  } catch {
    // hash 含非法选择器字符时静默忽略
  }
}

function disposeActive() {
  if (state.activeScene) {
    try {
      state.activeScene.dispose?.();
    } catch (error) {
      console.error(`场景 ${state.activeId} dispose 失败`, error);
    }
  }
  state.activeScene = null;
  state.activeParams = null;
}

export function activateScene(id) {
  if (id === state.activeId) return;
  disposeActive();
  // 每次切换清空并重建容器内容
  state.container.innerHTML = "";
  state.activeId = id;
  updateTabs(id);

  const scene = getScene(id);
  if (scene) {
    // 目标场景 lazy init：只有被激活时才初始化
    scene.init(state.container);
    state.activeParams = scene.getDefaultParams?.() ?? {};
    state.activeScene = scene;
  } else {
    const tab = state.tabs.find((item) => item.dataset.scene === id);
    renderPlaceholder(tab ? tab.textContent.trim() : id);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

function loop(now) {
  state.rafId = requestAnimationFrame(loop);
  const delta = state.lastTime ? (now - state.lastTime) / 1000 : 0;
  state.lastTime = now;
  state.elapsed += delta;
  // 单一 rAF 循环，只驱动当前激活场景
  if (state.activeScene?.update) {
    state.activeScene.update({ ...state.activeParams, delta, time: state.elapsed });
  }
}

export function initSceneLoader({ container, nav, defaultScene }) {
  state.container = container;
  // 导航由注册表自动生成：注册即上线，无需再改 index.html 或对齐注册顺序
  nav.innerHTML = buildSceneTabs(getAllScenes());
  state.tabs = [...nav.querySelectorAll(".tab-btn")];
  state.tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateScene(tab.dataset.scene));
  });
  // hash 命中已注册场景 id 时优先激活对应场景；否则激活默认场景后尝试滚到章节锚点
  const hashId = window.location.hash.slice(1);
  if (hashId && getScene(hashId)) {
    activateScene(hashId);
  } else {
    activateScene(defaultScene ?? state.tabs[0]?.dataset.scene);
    scrollToHashIfNeeded();
  }
  if (!state.rafId) state.rafId = requestAnimationFrame(loop);
}
