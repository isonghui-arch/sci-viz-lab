# 科学可视化实验室 (Sci-Viz Lab)

用 Three.js 与 HTML Canvas 构建的交互式科学可视化实验室，一个单页应用容纳多个科学场景：挂谷猜想、日食、月食、太阳系、四季、月相、潮汐、卫星轨道、板块运动、光的折射

在线体验：[sci-viz-lab.pages.dev](https://sci-viz-lab.pages.dev/)

## 已上线场景

- **挂谷猜想**：可旋转、缩放并调节样本数量与管半径的三维细管实验；中心星束、分散排列、多尺度黏连、木纹颗粒四种排列；二维线段重叠与 δ 邻域画布；王虹与 Joshua Zahl 证明思路五站式地图；时间线与可追溯资料来源
- **日食**：日地月三球几何与本影/半影区分，演示日全食、日环食、日偏食的成因
- **月食**：月球穿过地球本影的过程，解释血月的大气折射成因
- **太阳系**：八大行星轨道与公转周期对比，可调时间流速
- **四季**：地轴倾角与太阳直射点移动，解释季节与昼夜长短变化
- **月相**：月球公转与日地月相对位置，演示新月到满月的周期
- **潮汐**：月球与太阳引潮力叠加，解释大潮小潮与每日两次涨落
- **卫星轨道**：以真实物理量模拟发射速度与轨道形状的关系，涵盖坠落、圆轨道、椭圆轨道与逃逸
- **板块运动**：地球板块分布、运动矢量与三类板块边界的交互演示
- **光的折射**：可调入射角与介质折射率，演示折射定律与全反射

## 架构

```
src/
  main.js              # 精简入口：注册场景 + 启动 scene-loader
  scene-loader.js      # 场景切换、懒加载、hash 深链接、统一渲染循环
  scenes/
    registry.js        # 场景注册表
    kakeya.js          # 挂谷猜想场景
    solar-eclipse.js   # 日食场景
    lunar-eclipse.js   # 月食场景
    solar-system.js    # 太阳系场景
    seasons.js         # 四季场景
    moon-phases.js     # 月相场景
    tides.js           # 潮汐场景
    satellite-orbit.js # 卫星轨道场景
    plate-tectonics.js # 板块运动场景
    light-refraction.js# 光的折射场景
  style.css            # 编辑部手册风全局样式
index.html             # 单页骨架：页头 + 场景 Tab + 场景容器
```

每个场景实现统一接口 `{ id, name, init(container), update(params), dispose(), getDefaultParams() }`，在 `registry.js` 注册后由 `scene-loader.js` 按需初始化与切换

## 本地运行

需要 Node.js 20 或更高版本

```bash
npm install
npm run dev
```

浏览器打开终端给出的地址即可

## 生成发布版本

```bash
npm run build
```

生成结果位于 `dist/index.html`，已打包为单个 HTML 文件

## 发布到 Cloudflare Pages

登录 Wrangler 后执行

```bash
npm run deploy
```

## 讲解方式

每个场景遵循"资料核验、直觉模型、正式定义、互动实验、边界说明、来源追溯"的讲解结构

它可以帮助孩子通过操作理解科学知识，也可以帮助成年人更快建立对陌生问题的整体认识
