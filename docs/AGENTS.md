# AGENTS.md —— 个人站开发规范

## 项目定位
单页个人作品集，Vue 3 + Vite，深色星空视觉，部署为静态站点。

## 约定
- **内容与代码分离**：所有文案、项目、文章只写在 `src/data/profile.js`，组件里不硬编码文字
- 不引入 UI 组件库；样式用 CSS 变量（`src/styles/main.css` 中的设计令牌）
- 不引入动画库；动效用 CSS transition/animation
- 组件保持单文件、`<script setup>`
- 所有外链使用 `target="_blank" rel="noopener"`（表单提交除外）

## 视觉规范
- 背景 #05060B，文字 #E8ECF6 / #9AA4BD
- 强调色只用渐变 #22D3EE → #8B5CF6 → #EC4899
- 圆角：卡片 18px，按钮 999px，小标签 6–11px
- 间距遵循 8px 栅格

## 性能红线
- 首屏 JS gzip < 100KB
- Canvas 星点数量不超过 300
- 图片若引入必须压缩并加 `loading="lazy"`

## 可访问性
- 所有可点击元素是 `<a>` 或 `<button>`
- 图标按钮带 `aria-label`
- 正文对比度 ≥ 4.5:1

## 提交流程
- 每完成一个区块提交一次：`feat: 项目区块`
- 改动后必须本地 `npm run build` 通过
