/**
 * 全站内容集中在这里，改这一个文件就能换成你自己的信息。
 */
export const profile = {
  name: '刘同学',
  handle: '@liu',
  role: '全栈开发者 / AI 应用方向',
  tagline: '用代码把想法变成可以跑起来的东西。',
  intro:
    '在读学生，专注于 Web 全栈与大模型应用开发。做过 AI 聊天系统、浏览器插件与若干课程项目，喜欢把复杂问题拆成可交付的小步骤。',
  location: '中国 · 杭州',
  email: 'you@example.com',
  avatarText: '刘',
  socials: [
    { name: 'GitHub', url: 'https://github.com/', icon: 'github' },
    { name: '邮箱', url: 'mailto:you@example.com', icon: 'mail' },
    { name: '博客', url: '#blog', icon: 'blog' },
  ],
  stats: [
    { value: '3+', label: '年编码经验' },
    { value: '12', label: '完成项目' },
    { value: '5', label: '技术栈方向' },
  ],
  skills: [
    {
      group: '前端',
      items: [
        { name: 'Vue 3 / Pinia', level: 90 },
        { name: 'JavaScript / TypeScript', level: 85 },
        { name: 'CSS / 响应式设计', level: 88 },
      ],
    },
    {
      group: '后端',
      items: [
        { name: 'Python / FastAPI', level: 85 },
        { name: 'MySQL / SQLAlchemy', level: 80 },
        { name: 'Node.js', level: 72 },
      ],
    },
    {
      group: 'AI / 工程',
      items: [
        { name: 'Transformers / PEFT', level: 78 },
        { name: 'Prompt 工程', level: 82 },
        { name: 'Git / 部署', level: 80 },
      ],
    },
  ],
  timeline: [
    { year: '2026', title: 'AI 聊天对话系统', desc: 'Vue3 + FastAPI，接入本地 LoRA 模型与远端 API' },
    { year: '2025', title: '电商图片提取插件', desc: 'Chrome MV3 扩展，支持多平台批量下载' },
    { year: '2024', title: '开始系统学习前端', desc: '从 HTML/CSS 到 Vue 全家桶' },
  ],
  projects: [
    {
      title: '智语 Chat',
      desc: '多模型 AI 对话系统，支持远端 API 与本地微调模型自由切换，SSE 流式输出。',
      tags: ['Vue 3', 'FastAPI', 'MySQL', 'SSE'],
      accent: 'linear-gradient(135deg, #6366f1, #a855f7)',
      link: '#',
    },
    {
      title: '电商图片下载插件',
      desc: 'Chrome 扩展，在商品详情页一键提取全部图片，批量转 PNG 打包下载。',
      tags: ['Chrome MV3', 'React', 'Canvas'],
      accent: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
      link: '#',
    },
    {
      title: '个人作品集',
      desc: '星空主题的单页站点，Canvas 粒子背景 + 滚动动画，部署在 Cloudflare Pages。',
      tags: ['Vue 3', 'Canvas', 'Vite'],
      accent: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      link: '#',
    },
  ],
  posts: [
    {
      date: '2026-10-20',
      title: '把 LoRA 模型接进 Web 应用踩过的坑',
      summary: '从显存不足到 tokenizer 路径错误，记录一次完整的本地模型接入过程。',
      body: '## 背景\n\n课程要求把微调模型部署到本地并接入系统。看起来只是加载权重，实际踩了不少坑。\n\n## 坑一：transformers 版本不兼容\n\n全局环境是 transformers 5.x，而 torch 只有 2.5.1，导致 PyTorch 后端被直接禁用。解决办法是给项目单独建 venv 并锁定 4.46.3。\n\n## 坑二：LoRA 需要基座\n\nadapter 目录里没有完整的模型结构，必须同时提供 base_model 的 config.json 与 tokenizer。\n\n## 结论\n\n先跑通最小推理脚本，再往上叠服务层。',
    },
    {
      date: '2026-10-12',
      title: 'SSE 流式输出为什么比 WebSocket 更适合聊天',
      summary: '单向、基于 HTTP、天然穿透代理，聊聊选型时的取舍。',
      body: '## 单向足够\n\n聊天场景里服务端推、客户端收，本身就是单向流。\n\n## 兼容性更好\n\nSSE 走普通 HTTP，不需要协议升级，代理和网关更友好。\n\n## 注意点\n\n要用 fetch + ReadableStream 而不是 EventSource，因为需要 POST 和自定义 Header。',
    },
    {
      date: '2026-09-28',
      title: '密码到底该怎么存：从明文到 bcrypt',
      summary: '为什么哈希要加盐、为什么要慢，以及传输层还要做什么。',
      body: '## 存储\n\n永远不要存明文或简单 MD5。bcrypt 自带盐值且计算慢，能显著提高彩虹表和暴力破解成本。\n\n## 传输\n\nHTTPS 之外，前端还可以用 RSA 公钥再加密一次密码，避免日志或中间件看到明文。',
    },
  ],
}
