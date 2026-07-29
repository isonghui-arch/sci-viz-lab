// 共享外壳与导航生成
// 目的：把"reading-progress + 场景容器 + 章节导航 + hero 外框"抽成单一来源，
//       新场景只写实验逻辑与差异内容；导航由注册表自动生成，注册即上线。
// 旧场景（kakeya / solar-eclipse ...）排版个性强、各自带命名空间 style，
//       可按本文件范式逐步迁移，无需一次性批量重写。

// 场景分类（导航分组顺序与中文标签的唯一来源）
export const SCENE_CATEGORIES = [
  { id: "math", label: "数学" },
  { id: "astronomy", label: "天文" },
  { id: "mechanics", label: "力学" },
  { id: "geoscience", label: "地学" },
  { id: "probability", label: "概率" },
];

// 由注册表生成「分组导航」HTML。新增场景只需在 registerScene 时带上 category，
//   导航、分组、顺序全部自动派生，无需再改 index.html 或对齐 main.js 注册顺序。
export function buildSceneTabs(scenes) {
  return SCENE_CATEGORIES.map((cat) => {
    const items = scenes
      .filter((s) => (s.category || "uncategorized") === cat.id)
      .map(
        (s) =>
          `<button role="tab" class="tab-btn" data-scene="${s.id}">${s.name}</button>`
      )
      .join("");
    if (!items) return "";
    return `<div class="tab-group"><span class="tab-group-label">${cat.label}</span>${items}</div>`;
  }).join("");
}

// 共享外壳：生成 reading-progress + 场景容器 + 章节导航 + hero 外框（含 hero-copy）。
// 调用方负责在其后拼接：lab-shell 内部 → </section>（hero 闭）→ 其余 section → </div>（scene 闭）。
// 返回字符串不含 </section>（hero 闭）与 </div>（scene 闭），以便场景注入各自内容。
export function shellHead({
  ns,
  figureNo,
  titleHTML,
  lead,
  heroNote,
  navLabel,
  navItems = [],
  firstAnchor = "top",
}) {
  const nav = navItems.length
    ? `<nav class="${ns}-section-nav" aria-label="${navLabel || "章节导航"}">${navItems
        .map((it) => `<a href="#${it.id}">${it.label}</a>`)
        .join("")}</nav>`
    : "";
  return `
    <div class="reading-progress" aria-hidden="true"><span></span></div>
    <div class="${ns}-scene" id="main">
      ${nav}
      <section class="hero" id="top">
        <div class="hero-copy">
          <p class="figure-no">${figureNo}</p>
          <h1>${titleHTML}</h1>
          <p class="hero-lead">${lead}</p>
          <a class="primary-action" href="#${firstAnchor}">
            开始实验
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
          </a>
          <p class="hero-note">${heroNote}</p>
        </div>`;
}
