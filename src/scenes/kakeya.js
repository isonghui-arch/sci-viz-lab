// 挂谷猜想场景：完整保留原有交互（4 种排列、2D 像素统计、δ 邻域、证明地图、时间线、来源）
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const template = `
    <style>
      .kakeya-section-nav {
        max-width: var(--max);
        margin: 0 auto;
        padding: 14px var(--gutter) 0;
        display: flex;
        gap: 22px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-bottom: 1px solid var(--rule);
      }
      .kakeya-section-nav a {
        flex: 0 0 auto;
        padding-bottom: 12px;
        font-family: var(--sans);
        font-size: 13px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--muted);
        border-bottom: 2px solid transparent;
      }
      .kakeya-section-nav a:hover,
      .kakeya-section-nav a:focus-visible {
        color: var(--ink);
        border-bottom-color: var(--red-bright);
      }
    </style>
    <div class="reading-progress" aria-hidden="true"><span></span></div>

    <div class="kakeya-scene" id="main">
      <nav class="kakeya-section-nav" aria-label="挂谷场景章节导航">
        <a href="#intuition">直觉</a>
        <a href="#definition">定义</a>
        <a href="#proof">证明地图</a>
        <a href="#timeline">时间线</a>
        <a href="#sources">来源</a>
      </nav>

      <section class="hero" id="top">
        <div class="hero-copy">
          <p class="figure-no">FIG. 01 / KAKEYA LAB</p>
          <h1>一根针，<br />如何占满<br />三维空间？</h1>
          <p class="hero-lead">
            从 1917 年的转针问题，到王虹与 Joshua Zahl 证明三维挂谷集合具有完整维数。
          </p>
          <a class="primary-action" href="#intuition">
            开始实验
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </a>
          <p class="hero-note">
            拖动旋转 · 滚轮缩放 · 切换四种排列<br />
            画面是有限采样的直觉模型，不承担证明功能。
          </p>
        </div>

        <div class="lab-shell" aria-label="三维方向细管交互实验">
          <div class="lab-canvas-wrap">
            <canvas id="hero-canvas" aria-label="三维挂谷细管交互模型"></canvas>
            <div class="axis-labels" aria-hidden="true">
              <span class="axis-x">x</span>
              <span class="axis-y">y</span>
              <span class="axis-z">z</span>
            </div>
            <div class="canvas-caption">
              <span>有限方向采样</span>
              <span id="canvas-status">320 根细管 · δ = 0.014</span>
            </div>
          </div>

          <aside class="lab-controls" aria-label="实验设置">
            <h2>实验设置</h2>
            <div class="mode-grid" role="group" aria-label="排列方式">
              <button class="mode-button is-active" data-mode="star" type="button">
                <span class="mode-icon star-icon" aria-hidden="true"></span>
                中心星束
              </button>
              <button class="mode-button" data-mode="spread" type="button">
                <span class="mode-icon spread-icon" aria-hidden="true"></span>
                分散排列
              </button>
              <button class="mode-button" data-mode="sticky" type="button">
                <span class="mode-icon sticky-icon" aria-hidden="true"></span>
                多尺度黏连
              </button>
              <button class="mode-button" data-mode="grains" type="button">
                <span class="mode-icon grain-icon" aria-hidden="true"></span>
                木纹颗粒
              </button>
            </div>

            <label class="control-row" for="tube-count">
              <span>样本数量 <i>N</i></span>
              <output id="tube-count-output">320</output>
            </label>
            <input id="tube-count" type="range" min="80" max="900" step="20" value="320" />

            <label class="control-row" for="tube-radius">
              <span>管半径 <i>δ</i></span>
              <output id="tube-radius-output">0.014</output>
            </label>
            <input
              id="tube-radius"
              type="range"
              min="0.006"
              max="0.032"
              step="0.001"
              value="0.014"
            />

            <div class="lab-actions">
              <button id="reset-camera" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v6h6" />
                </svg>
                重置视角
              </button>
              <button id="local-motion-toggle" class="accent-button" type="button" aria-pressed="false">
                暂停旋转
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section class="distinctions section-pad" aria-labelledby="distinction-title">
        <div class="section-heading">
          <p class="section-index">01</p>
          <div>
            <h2 id="distinction-title">先把三个问题分开</h2>
            <p>它们共享“一根针”的直觉，数学要求却逐层变化。</p>
          </div>
        </div>

        <div class="distinction-rail">
          <article>
            <span>01 / 连续运动</span>
            <h3>1917 年的转针问题</h3>
            <p>
              在平面区域里，让长度为 1 的线段连续转过 180°，所需面积能有多小？
              若限于凸集，Pál 找到的最优区域是高为 1 的等边三角形；取消凸性后，面积可任意小。
            </p>
            <div class="mini-figure rotating-needle" aria-hidden="true"></div>
          </article>
          <article>
            <span>02 / 每个方向</span>
            <h3>Besicovitch 集合</h3>
            <p>
              集合 <i>K</i> 在每个方向都包含一条长度为 1 的线段。这样的集合可以拥有
              Lebesgue 零测度，平面里可以直观理解成“面积为零”。
            </p>
            <div class="mini-figure line-field" aria-hidden="true"></div>
          </article>
          <article>
            <span>03 / 尺度极限</span>
            <h3>现代挂谷集合猜想</h3>
            <p>
              任意 <i>n</i> 维挂谷集合都应拥有完整的 Hausdorff 维数 <i>n</i>；
              常讨论的 Minkowski 版本也预言完整维数。王虹与 Zahl 证明了 <i>n = 3</i>。
            </p>
            <div class="mini-figure dimension-cube" aria-hidden="true"></div>
          </article>
        </div>
      </section>

      <section class="intuition section-pad" id="intuition" aria-labelledby="intuition-title">
        <div class="section-heading light-heading">
          <p class="section-index">02</p>
          <div>
            <h2 id="intuition-title">先看见“重叠”</h2>
            <p>同样多的方向，线段放置方式不同，扫过的区域会相差很大。</p>
          </div>
        </div>

        <div class="intuition-layout">
          <div class="canvas-panel">
            <canvas id="needle-canvas" aria-label="二维线段重叠实验"></canvas>
            <div class="canvas-key" aria-hidden="true">
              <span><i class="key-line"></i>单位线段</span>
              <span><i class="key-fill"></i>像素覆盖</span>
            </div>
          </div>
          <div class="intuition-copy">
            <div class="segmented" role="group" aria-label="二维演示方式">
              <button class="is-active" data-needle-mode="center" type="button">同心旋转</button>
              <button data-needle-mode="fan" type="button">扇形错位</button>
              <button data-needle-mode="compress" type="button">重叠压缩</button>
            </div>
            <div class="metric-pair">
              <div>
                <span>方向样本</span>
                <strong id="needle-count-value">72</strong>
              </div>
              <div>
                <span>覆盖像素占比</span>
                <strong id="pixel-coverage">—</strong>
              </div>
            </div>
            <label class="control-row light-control" for="needle-count">
              <span>增加方向样本</span>
              <output id="needle-count-output">72</output>
            </label>
            <input id="needle-count" type="range" min="12" max="180" step="6" value="72" />
            <p id="needle-explanation">
              所有线段穿过同一中心，方向齐全，重叠也最直观。它展示方向条件，并未给出面积最小的构造。
            </p>
            <p class="method-note">
              这里的“覆盖像素”只统计当前有限画布中的着色比例。真正的挂谷问题研究无穷多方向与
              δ → 0 的极限，有限像素不能判断维数。
            </p>
          </div>
        </div>
      </section>

      <section class="definition section-pad" id="definition" aria-labelledby="definition-title">
        <div class="section-heading">
          <p class="section-index">03</p>
          <div>
            <h2 id="definition-title">完整陈述：从线段到维数</h2>
            <p>“体积”“维数”和“加粗后的体积”分别回答不同问题。</p>
          </div>
        </div>

        <div class="definition-grid">
          <article class="definition-copy">
            <h3>集合版本</h3>
            <p>
              若紧集 <i>K ⊂ ℝ<sup>n</sup></i> 对球面上的每个方向
              <i>ω ∈ S<sup>n−1</sup></i>，都包含一条与 <i>ω</i> 平行的单位线段，
              那么 <i>K</i> 称为挂谷集合（或 Besicovitch 集合）。
            </p>
            <div class="formula-box">
              <span>挂谷集合猜想</span>
              <math display="block">
                <mrow>
                  <msub><mi>dim</mi><mi>H</mi></msub>
                  <mi>K</mi>
                  <mo>=</mo>
                  <mi>n</mi>
                </mrow>
              </math>
              <p>常用的 Minkowski 版本同样预言 <i>dim<sub>M</sub> K = n</i>。</p>
            </div>
            <p class="fact-line">
              <strong>三维结论：</strong>
              王虹与 Joshua Zahl 的 2025 年论文证明，每个
              <i>K ⊂ ℝ<sup>3</sup></i> 的挂谷集合都有 Hausdorff 与 Minkowski 维数 3。
            </p>
          </article>

          <article class="dimension-definitions">
            <div>
              <span>MEASURE</span>
              <h3>零体积仍可满维</h3>
              <p>
                Lebesgue 测度记录面积或体积。挂谷集合可以是零测度，
                同时拥有与环境空间相同的分形维数；“完整维数”不保证内部含有小球。
              </p>
            </div>
            <div>
              <span>MINKOWSKI</span>
              <h3>观察 δ 邻域的缩放</h3>
              <p>
                把 <i>K</i> 向外加粗 δ，得到 <i>K<sub>δ</sub></i>。若其体积大致按
                δ<sup>n−d</sup> 缩放，<i>d</i> 就是对应的盒维数直觉。
              </p>
            </div>
            <div>
              <span>HAUSDORFF</span>
              <h3>允许不同大小的覆盖</h3>
              <p>
                用直径可变的小集合覆盖 <i>K</i>，观察直径的 <i>s</i> 次幂总和。
                临界指数给出 Hausdorff 维数，通常比固定网格更精细。
              </p>
            </div>
          </article>

          <article class="delta-lab">
            <div class="delta-lab-head">
              <div>
                <span>δ-NEIGHBORHOOD</span>
                <h3>把零宽线段加粗</h3>
              </div>
              <output id="delta-output">δ = 0.030</output>
            </div>
            <canvas id="minkowski-canvas" aria-label="线段 δ 邻域演示"></canvas>
            <label for="delta-slider">管越细，允许的重叠越极端</label>
            <input
              id="delta-slider"
              type="range"
              min="0.008"
              max="0.080"
              step="0.002"
              value="0.030"
            />
            <div class="tube-formula">
              <span>离散细管版本（任意 ε &gt; 0）</span>
              <math display="block">
                <mrow>
                  <mo>|</mo>
                  <mi>U</mi><mo>(</mo><mi>𝕋</mi><mo>)</mo>
                  <mo>|</mo>
                  <mo>≥</mo>
                  <mi>c</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>ε</mi><mo>)</mo>
                  <msup><mi>δ</mi><mi>ε</mi></msup>
                </mrow>
              </math>
              <p>
                取约 δ<sup>−(n−1)</sup> 根长 1、半径 δ、方向彼此相隔至少约 δ 的细管。
                猜想要求它们的并集不会比 δ<sup>ε</sup> 量级更小。
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="proof section-pad" id="proof" aria-labelledby="proof-title">
        <div class="proof-heading">
          <div class="section-heading light-heading">
            <p class="section-index">04</p>
            <div>
              <h2 id="proof-title">证明地图：最坏情形为何会“黏住”</h2>
              <p>这里展示论文与 Guth 综述中的高层结构，省略 127 页证明的技术细节。</p>
            </div>
          </div>
          <div class="segmented proof-level" role="group" aria-label="讲解层级">
            <button class="is-active" data-proof-level="intuition" type="button">直觉层</button>
            <button data-proof-level="math" type="button">数学层</button>
          </div>
        </div>

        <div class="proof-map">
          <div class="proof-visual">
            <canvas id="proof-canvas" aria-label="王虹与 Zahl 证明思路阶段演示"></canvas>
            <p>图形仅对应概念关系；它不复现论文中的真实配置，也不构成证明。</p>
          </div>
          <div class="proof-stages" role="tablist" aria-label="证明阶段">
            <button class="proof-stage is-active" data-proof-stage="0" role="tab" type="button">
              <span>1</span>
              <strong>细管</strong>
              <small>离散所有方向</small>
            </button>
            <button class="proof-stage" data-proof-stage="1" role="tab" type="button">
              <span>2</span>
              <strong>粗管</strong>
              <small>跨尺度分组</small>
            </button>
            <button class="proof-stage" data-proof-stage="2" role="tab" type="button">
              <span>3</span>
              <strong>黏连</strong>
              <small>接近最大打包</small>
            </button>
            <button class="proof-stage" data-proof-stage="3" role="tab" type="button">
              <span>4</span>
              <strong>木纹颗粒</strong>
              <small>局部矩形片</small>
            </button>
            <button class="proof-stage" data-proof-stage="4" role="tab" type="button">
              <span>5</span>
              <strong>尺度归纳</strong>
              <small>排除非黏连最坏情形</small>
            </button>
          </div>
          <article class="proof-explanation" aria-live="polite">
            <span id="proof-kicker">STEP 1 · DISCRETIZE</span>
            <h3 id="proof-step-title">把“每个方向”换成约 δ<sup>−2</sup> 根细管</h3>
            <p id="proof-step-body">
              在三维中，从球面选取彼此相隔约 δ 的方向，数量约为 δ<sup>−2</sup>。
              每个方向放一根长 1、半径 δ 的管。问题转化为：这些管最多能重叠到什么程度？
            </p>
            <div id="proof-math" class="proof-math" hidden>
              <span>核心量</span>
              <p>
                并集 <i>U(𝕋)</i> 越小，典型重数
                <i>μ(𝕋) = (Σ<sub>T∈𝕋</sub>|T|) / |U(𝕋)|</i> 越大。
              </p>
            </div>
          </article>
        </div>

        <div class="proof-conclusion">
          <span>证明的逻辑闭环</span>
          <p>
            先前工作解决了“黏连”这一具有多尺度自相似的特殊情形。
            2025 年的关键推进表明：若某个近乎最坏的配置在某些尺度上缺少黏连，
            细致的尺度归纳、高密度引理、Frostman 型打包控制与二维 <i>L²</i> 估计会给出更好的界，
            和“它已经最坏”发生矛盾。于是最坏情形只能落入已经解决的黏连情形，最终得到完整三维结论。
          </p>
        </div>
      </section>

      <section class="limits section-pad" aria-labelledby="limits-title">
        <div class="section-heading">
          <p class="section-index">05</p>
          <div>
            <h2 id="limits-title">已证明到哪里，边界在哪里</h2>
            <p>把结论说准，才能看见这项工作的真正重量。</p>
          </div>
        </div>
        <div class="limits-grid">
          <article class="confirmed">
            <span>已解决</span>
            <h3>三维集合猜想</h3>
            <p>
              每个三维挂谷集合的 Minkowski 与 Hausdorff 维数均为 3。
              2025 年王虹—Zahl 论文给出证明；2026 年 Guth、王虹、Zahl 又给出精简版。
            </p>
          </article>
          <article>
            <span>仍开放</span>
            <h3>四维及更高维</h3>
            <p>
              三维方法依赖凸 Wolff 公理。四维起出现沿低次数代数曲面聚集的障碍，
              这一方法无法直接照搬。
            </p>
          </article>
          <article>
            <span>仍开放</span>
            <h3>更强的 maximal 版本</h3>
            <p>
              Kakeya maximal function conjecture 要求更强的算子估计。
              三维集合版本的解决没有自动给出这个更强结论。
            </p>
          </article>
        </div>

        <aside class="award-note">
          <strong>关于 2026 年菲尔兹奖的准确说法</strong>
          <p>
            国际数学联盟对王虹的正式引文覆盖调和分析与几何测度论的一系列成果：
            平面波方程局部光滑化、Fourier restriction、Falconer 距离集、平面 Furstenberg 集，
            以及三维挂谷问题。三维挂谷证明是其中极受瞩目的一项，奖项评价范围更广。
          </p>
        </aside>
      </section>

      <section class="timeline section-pad" id="timeline" aria-labelledby="timeline-title">
        <div class="section-heading">
          <p class="section-index">06</p>
          <div>
            <h2 id="timeline-title">一百多年的路</h2>
            <p>每一步都改变了人们对“很小”与“完整维数”的理解。</p>
          </div>
        </div>

        <ol class="timeline-rail">
          <li>
            <time>1917</time>
            <h3>Kakeya 提问</h3>
            <p>单位针在平面内连续转向，所需区域能有多小？</p>
          </li>
          <li>
            <time>1919–1921</time>
            <h3>Besicovitch 与 Pál</h3>
            <p>前者展示任意小面积现象；后者解决凸集情形，并给出连接运动的工具。</p>
          </li>
          <li>
            <time>1971</time>
            <h3>Davies</h3>
            <p>证明平面挂谷集合拥有完整 Hausdorff 维数 2。</p>
          </li>
          <li>
            <time>1995</time>
            <h3>Wolff 的 5/2 界</h3>
            <p>在三维把已知维数下界推进到 5/2，“毛刷”方法影响深远。</p>
          </li>
          <li>
            <time>2022</time>
            <h3>黏连情形</h3>
            <p>王虹与 Zahl 完成 Katz–Tao 路线，解决三维 sticky Kakeya。</p>
          </li>
          <li class="breakthrough">
            <time>2025</time>
            <h3>三维完整证明</h3>
            <p>王虹与 Zahl 将一般情形归约到黏连情形，证明两种维数都为 3。</p>
          </li>
          <li class="medal">
            <time>2026</time>
            <h3>精简证明与菲尔兹奖</h3>
            <p>精简版论文发布；王虹在费城国际数学家大会获菲尔兹奖。</p>
          </li>
        </ol>
      </section>

      <section class="sources section-pad" id="sources" aria-labelledby="sources-title">
        <div class="section-heading light-heading">
          <p class="section-index">07</p>
          <div>
            <h2 id="sources-title">来源与核验路径</h2>
            <p>优先列出官方引文、原始论文与数学家本人撰写的综述。</p>
          </div>
        </div>

        <div class="source-table" role="table" aria-label="资料来源">
          <div class="source-row source-head" role="row">
            <span role="columnheader">类型</span>
            <span role="columnheader">资料</span>
            <span role="columnheader">用于核验</span>
          </div>
          <a
            class="source-row"
            role="row"
            href="https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">官方</span>
            <strong role="cell">IMU · Fields Medals 2026</strong>
            <span role="cell">获奖名单与王虹短引文</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://www.mathunion.org/fileadmin/documents/2026-07/Hong_Wang_Citations.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">官方 PDF</span>
            <strong role="cell">Hong Wang · Short &amp; Long Citation</strong>
            <span role="cell">菲尔兹奖评价的完整范围</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://arxiv.org/abs/2502.17655"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">原始论文</span>
            <strong role="cell">Wang–Zahl · arXiv:2502.17655</strong>
            <span role="cell">三维 Minkowski 与 Hausdorff 结论</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://arxiv.org/abs/2601.14411"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">精简证明</span>
            <strong role="cell">Guth–Wang–Zahl · arXiv:2601.14411</strong>
            <span role="cell">2026 年 47 页精简版</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://arxiv.org/abs/2604.03416"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">Bourbaki 综述</span>
            <strong role="cell">Larry Guth · The Kakeya conjecture, after Wang and Zahl</strong>
            <span role="cell">面向广泛数学读者的证明地图</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://terrytao.wordpress.com/2025/02/25/the-three-dimensional-kakeya-conjecture-after-wang-and-zahl/"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">数学家解读</span>
            <strong role="cell">Terence Tao · The three-dimensional Kakeya conjecture</strong>
            <span role="cell">细管版本、历史界与尺度归纳</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://www.math.ubc.ca/news-events/news/mar-4-2025-josh-zahl-and-hong-wang-prove-kakeya-conjecture-three-dimensions"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">研究机构</span>
            <strong role="cell">UBC Mathematics · Wang–Zahl prove Kakeya in 3D</strong>
            <span role="cell">研究机构对成果与论文的说明</span>
          </a>
          <a
            class="source-row"
            role="row"
            href="https://www.quantamagazine.org/once-in-a-century-proof-settles-maths-kakeya-conjecture-20250314/"
            target="_blank"
            rel="noreferrer"
          >
            <span role="cell">深度报道</span>
            <strong role="cell">Quanta · Once in a Century Proof</strong>
            <span role="cell">历史、5/2 界、颗粒结构与证明影响</span>
          </a>
        </div>

        <p class="source-policy">
          页面中的数值与结论以这些资料为准。视觉演示只帮助建立直觉；
          “有限条线段的像素覆盖率”与“无穷方向集合的分形维数”之间没有直接等号。
        </p>
      </section>
    </div>
`;

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

class KakeyaScene3D {
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
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  // 由 scene-loader 的统一 rAF 循环驱动
  render() {
    if (this.motion) this.group.rotation.y += 0.0016;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.clearGroup();
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

// 场景内查询助手：始终限定在场景容器内
let root = null;
const $ = (selector) => root.querySelector(selector);
const $$ = (selector) => [...root.querySelectorAll(selector)];

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
    if (!root) return;
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

  dispose() {
    this.resizeObserver.disconnect();
  }
}

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

  dispose() {
    this.resizeObserver.disconnect();
  }
}

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

  dispose() {
    this.resizeObserver.disconnect();
  }
}

const modeCopy = {
  star: "中心星束",
  spread: "分散排列",
  sticky: "多尺度黏连",
  grains: "木纹颗粒",
};

const needleExplanations = {
  center:
    "所有线段穿过同一中心，方向齐全，重叠也最直观。它展示方向条件，并未给出面积最小的构造。",
  fan:
    "让相邻方向的线段稍微错位，交叉区域被拉成扇形。经典 Besicovitch–Perron 构造会反复切分三角形并平移，过程精细得多。",
  compress:
    "把中心位置压到一条窄带附近，许多方向继续相交。这个模式只演示“通过安排位置增加重叠”的想法。",
};

// 场景运行时状态：init 创建，dispose 销毁
let state = null;

function wireInteractions() {
  const { heroScene, needleCanvas, minkowskiCanvas, proofCanvas } = state;
  const motionToggle = $("#local-motion-toggle");

  function syncMotionButton() {
    motionToggle.textContent = heroScene.motion ? "暂停旋转" : "继续旋转";
    // aria-pressed 表达“当前是否处于旋转中”，与状态保持一致
    motionToggle.setAttribute("aria-pressed", String(heroScene.motion));
  }

  motionToggle.addEventListener("click", () => {
    heroScene.motion = !heroScene.motion;
    syncMotionButton();
  });
  syncMotionButton();

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

  $("#delta-slider").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#delta-output").textContent = `δ = ${value.toFixed(3)}`;
    minkowskiCanvas.setDelta(value);
  });

  function updateProofContent(stage) {
    const content = proofContent[stage];
    $("#proof-kicker").textContent = content.kicker;
    $("#proof-step-title").innerHTML = content.title;
    $("#proof-step-body").innerHTML = content[state.proofLevel];
    $("#proof-math").hidden = state.proofLevel !== "math";
    if (state.proofLevel === "math") {
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
      state.proofLevel = button.dataset.proofLevel;
      const activeStage = Number($(".proof-stage.is-active").dataset.proofStage);
      updateProofContent(activeStage);
    });
  });

  function updateReadingProgress() {
    const bar = root?.querySelector(".reading-progress span");
    if (!bar) return;
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
    bar.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
  }

  state.onScroll = updateReadingProgress;
  window.addEventListener("scroll", state.onScroll, { passive: true });
  window.addEventListener("resize", state.onScroll);
  updateReadingProgress();
}

export default {
  id: "kakeya",
  name: "挂谷猜想",

  getDefaultParams() {
    return { mode: "star", count: 320, radius: 0.014 };
  },

  init(container) {
    root = container;
    container.innerHTML = template;
    state = {
      heroScene: new KakeyaScene3D($("#hero-canvas")),
      needleCanvas: new NeedleCanvas($("#needle-canvas")),
      minkowskiCanvas: new MinkowskiCanvas($("#minkowski-canvas")),
      proofCanvas: new ProofCanvas($("#proof-canvas")),
      proofLevel: "intuition",
      onScroll: null,
    };
    wireInteractions();
  },

  // 由 scene-loader 的单一 rAF 循环调用
  update() {
    state?.heroScene.render();
  },

  dispose() {
    if (!state) return;
    window.removeEventListener("scroll", state.onScroll);
    window.removeEventListener("resize", state.onScroll);
    state.heroScene.dispose();
    state.needleCanvas.dispose();
    state.minkowskiCanvas.dispose();
    state.proofCanvas.dispose();
    state = null;
    root = null;
  },
};
