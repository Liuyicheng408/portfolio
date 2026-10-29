# 个人展示网站 · 技术设计文档

## 一、技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Vue 3（script setup） | 与主项目统一，降低心智负担 |
| 构建 | Vite 6 | 冷启动快，产物小 |
| 样式 | 原生 CSS + CSS 变量 | 无 UI 库依赖，方便做定制视觉 |
| 背景 | Canvas 2D + requestAnimationFrame | 星点与流星自行绘制 |
| 动画 | IntersectionObserver + CSS transition | 无第三方动画库 |
| 路由 | 无（单页锚点滚动） | 部署最简单，无需 SPA 重写规则 |
| 部署 | Cloudflare Pages / Vercel | 纯静态，免费额度足够 |

> 与 AI 聊天系统共用设计语言（渐变、圆角、间距 8px 栅格），但独立构建、独立部署。

## 二、目录结构

```
portfolio/
├── docs/                     # PRD / TECH_DESIGN / AGENTS
├── src/
│   ├── App.vue               # 页面结构与全部区块样式
│   ├── main.js
│   ├── components/
│   │   ├── NavBar.vue        # 顶栏 + 移动端菜单 + 滚动高亮
│   │   └── Starfield.vue     # Canvas 星空
│   ├── data/profile.js       # 全站内容配置（唯一内容源）
│   └── styles/main.css       # 设计令牌与通用类
├── index.html
└── vite.config.js
```

## 三、数据结构

内容集中在 `profile.js` 导出的一个对象：

```js
{
  name, handle, role, tagline, intro, location, email, avatarText,
  socials:  [{ name, url }],
  stats:    [{ value, label }],
  skills:   [{ group, items: [{ name, level }] }],
  timeline: [{ year, title, desc }],
  projects: [{ title, desc, tags, accent, link }],
  posts:    [{ date, title, summary, body }]
}
```

## 四、关键技术点

### 4.1 Canvas 星空
- 星点数量按屏幕面积计算：`min(300, w*h/7000)`，兼顾视觉密度与性能
- 每颗星有独立相位与漂移速度，用 `sin(phase)` 做透明度呼吸
- 流星：随机间隔生成，用线性渐变绘制拖尾，生命周期结束自动回收
- 适配 devicePixelRatio（上限 2）避免高分屏模糊
- 组件卸载时取消 rAF、移除 resize 监听

### 4.2 滚动高亮
监听 scroll（passive），取各 section 的 `getBoundingClientRect().top`，选择最后一个 top ≤ 140 的区块。

### 4.3 进入动画
挂载后对 `.reveal` 元素建立 IntersectionObserver（threshold 0.12），进入视口加 `.visible` 并 unobserve，避免重复触发。

### 4.4 博客弹窗
点击列表项设置 `activePost`，用一个极简 Markdown 渲染器（只处理 `## ` 标题与段落）输出，渲染前做 HTML 转义，避免 XSS。

## 五、性能

| 指标 | 目标 |
|---|---|
| 首屏 JS | < 100 KB（gzip） |
| 首屏渲染 | < 1.2s |
| Canvas 帧率 | ≥ 50fps（1440×900） |
| Lighthouse 性能 | ≥ 90 |

## 六、部署

```bash
npm run build      # 产物在 dist/
```

- Cloudflare Pages：Build command `npm run build`，输出目录 `dist`
- Vercel：框架预设选 Vite，其余默认
- 单页锚点跳转，无需配置 SPA 重写

## 七、后续演进
- 博客改为独立路由 + Markdown 文件构建
- 引入暗/亮主题切换
- 增加项目详情页与图片预览
