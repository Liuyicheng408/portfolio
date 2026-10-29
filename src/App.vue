<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Starfield from '@/components/Starfield.vue'
import NavBar from '@/components/NavBar.vue'
import { profile } from '@/data/profile'

const activePost = ref(null)
const copied = ref(false)
const form = ref({ name: '', email: '', message: '' })
const sent = ref(false)
const glow = ref({ x: -400, y: -400 })

let io = null

function onMouseMove(e) {
  glow.value = { x: e.clientX, y: e.clientY }
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible')
          io.unobserve(en.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
  window.addEventListener('mousemove', onMouseMove)
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
  window.removeEventListener('mousemove', onMouseMove)
})

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch (e) {
    copied.value = false
  }
}

function submitForm() {
  if (!form.value.name || !form.value.message) return
  sent.value = true
  form.value = { name: '', email: '', message: '' }
  setTimeout(() => (sent.value = false), 4000)
}

function renderBody(body) {
  return body
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('## ')) {
        return '<h4>' + escapeHtml(block.slice(3)) + '</h4>'
      }
      return '<p>' + escapeHtml(block).replace(/\n/g, '<br />') + '</p>'
    })
    .join('')
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
</script>

<template>
  <Starfield />
  <div class="cursor-glow" :style="{ transform: 'translate(' + glow.x + 'px,' + glow.y + 'px)' }"></div>

  <NavBar />

  <main class="content">
    <!-- Hero -->
    <section id="home" class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="badge">
            <span class="dot"></span>
            {{ profile.role }}
          </div>

          <h1 class="hero-title">
            你好，我是<span class="gradient-text">{{ profile.name }}</span>
          </h1>

          <p class="hero-tagline">{{ profile.tagline }}</p>
          <p class="hero-intro">{{ profile.intro }}</p>

          <div class="hero-actions">
            <a href="#projects" class="btn btn-primary">
              查看项目
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contact" class="btn btn-ghost">联系我</a>
          </div>

          <div class="stats">
            <div v-for="s in profile.stats" :key="s.label" class="stat">
              <div class="stat-value">{{ s.value }}</div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="orbit orbit-1"></div>
          <div class="orbit orbit-2"></div>
          <div class="avatar-orb">
            <span>{{ profile.avatarText }}</span>
          </div>
          <div class="float-card fc-1">
            <span class="fc-dot cyan"></span>
            <span>Vue 3</span>
          </div>
          <div class="float-card fc-2">
            <span class="fc-dot violet"></span>
            <span>FastAPI</span>
          </div>
          <div class="float-card fc-3">
            <span class="fc-dot pink"></span>
            <span>LLM</span>
          </div>
        </div>
      </div>

      <a href="#about" class="scroll-hint">
        <span>向下滚动</span>
        <span class="mouse"><i></i></span>
      </a>
    </section>

    <!-- About -->
    <section id="about" class="section">
      <div class="container">
        <div class="reveal">
          <div class="eyebrow">About</div>
          <h2 class="section-title">关于<span class="gradient-text">我</span></h2>
          <p class="section-sub">{{ profile.intro }}</p>
        </div>

        <div class="about-grid">
          <div class="reveal card about-card">
            <div class="about-head">
              <div class="about-avatar">{{ profile.avatarText }}</div>
              <div>
                <div class="about-name">{{ profile.name }}</div>
                <div class="about-loc">📍 {{ profile.location }}</div>
              </div>
            </div>
            <p class="about-text">
              我相信好的产品来自对细节的耐心打磨：把复杂的需求拆小，先让核心流程跑通，再逐步优化体验。
              写代码之外，我也喜欢整理文档和复盘，让下一次少走弯路。
            </p>
            <div class="about-tags">
              <span>全栈开发</span><span>AI 应用</span><span>开源爱好者</span>
            </div>
          </div>

          <div class="reveal card timeline-card">
            <div class="timeline">
              <div v-for="(t, i) in profile.timeline" :key="i" class="tl-item">
                <div class="tl-dot"></div>
                <div class="tl-year">{{ t.year }}</div>
                <div class="tl-title">{{ t.title }}</div>
                <div class="tl-desc">{{ t.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="section">
      <div class="container">
        <div class="reveal">
          <div class="eyebrow">Skills</div>
          <h2 class="section-title">技能<span class="gradient-text">栈</span></h2>
          <p class="section-sub">日常使用的主力技术，覆盖从界面到模型接入的完整链路。</p>
        </div>

        <div class="skills-grid">
          <div v-for="(group, gi) in profile.skills" :key="group.group" class="reveal skill-card card">
            <div class="skill-head">
              <span class="skill-index">0{{ gi + 1 }}</span>
              <h3>{{ group.group }}</h3>
            </div>
            <div v-for="item in group.items" :key="item.name" class="skill-row">
              <div class="skill-label">
                <span>{{ item.name }}</span>
                <span class="skill-num">{{ item.level }}%</span>
              </div>
              <div class="bar">
                <div class="bar-fill" :style="{ width: item.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="section">
      <div class="container">
        <div class="reveal">
          <div class="eyebrow">Projects</div>
          <h2 class="section-title">最近做的<span class="gradient-text">项目</span></h2>
          <p class="section-sub">从想法到部署，每个项目都是一次完整练习。</p>
        </div>

        <div class="project-grid">
          <article v-for="(p, i) in profile.projects" :key="p.title" class="reveal project-card card">
            <div class="project-cover" :style="{ background: p.accent }">
              <span class="project-no">0{{ i + 1 }}</span>
            </div>
            <div class="project-body">
              <h3>{{ p.title }}</h3>
              <p>{{ p.desc }}</p>
              <div class="tags">
                <span v-for="t in p.tags" :key="t">{{ t }}</span>
              </div>
              <a :href="p.link" class="project-link">
                查看详情
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <section id="blog" class="section">
      <div class="container">
        <div class="reveal">
          <div class="eyebrow">Writing</div>
          <h2 class="section-title">一些<span class="gradient-text">记录</span></h2>
          <p class="section-sub">踩过的坑、做过的取舍，写下来才算真正学会。</p>
        </div>

        <div class="post-list">
          <article
            v-for="post in profile.posts"
            :key="post.title"
            class="reveal post-item"
            @click="activePost = post"
          >
            <time>{{ post.date }}</time>
            <div class="post-main">
              <h3>{{ post.title }}</h3>
              <p>{{ post.summary }}</p>
            </div>
            <span class="post-arrow">→</span>
          </article>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section">
      <div class="container">
        <div class="reveal contact-card card">
          <div class="contact-left">
            <div class="eyebrow">Contact</div>
            <h2 class="section-title">一起做点<span class="gradient-text">有意思的东西</span></h2>
            <p class="section-sub">有项目想法、实习机会，或者只是想聊聊技术，都欢迎找我。</p>

            <div class="email-row">
              <span class="email">{{ profile.email }}</span>
              <button class="copy-btn" @click="copyEmail">{{ copied ? '已复制' : '复制' }}</button>
            </div>

            <div class="socials">
              <a v-for="s in profile.socials" :key="s.name" :href="s.url" class="social">{{ s.name }}</a>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-row">
              <input v-model="form.name" placeholder="你的名字" required />
              <input v-model="form.email" type="email" placeholder="邮箱（可选）" />
            </div>
            <textarea v-model="form.message" rows="5" placeholder="想说的话…" required></textarea>
            <button class="btn btn-primary submit" type="submit">
              {{ sent ? '已发送 ✓' : '发送消息' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-inner">
        <span>© {{ new Date().getFullYear() }} {{ profile.name }} · 用 Vue 3 构建</span>
        <span class="footer-hint">Designed &amp; built from scratch</span>
      </div>
    </footer>
  </main>

  <transition name="modal">
    <div v-if="activePost" class="modal-mask" @click.self="activePost = null">
      <article class="modal-card">
        <button class="modal-close" @click="activePost = null">✕</button>
        <time>{{ activePost.date }}</time>
        <h2>{{ activePost.title }}</h2>
        <div class="modal-body" v-html="renderBody(activePost.body)"></div>
      </article>
    </div>
  </transition>
</template>

<style scoped>
.content {
  position: relative;
  z-index: 1;
}

.cursor-glow {
  position: fixed;
  top: -220px;
  left: -220px;
  width: 440px;
  height: 440px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12), transparent 60%);
  pointer-events: none;
  z-index: 0;
  transition: transform 0.12s ease-out;
}

/* ---------- Hero ---------- */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 120px 0 80px;
}
.hero-inner {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 40px;
  align-items: center;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  font-size: 12.5px;
  color: var(--text-2);
  margin-bottom: 26px;
}
.badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}
.hero-title {
  font-size: clamp(38px, 5.2vw, 64px);
  line-height: 1.12;
  letter-spacing: -0.03em;
  font-weight: 780;
  margin: 0 0 18px;
}
.hero-tagline {
  font-size: clamp(16px, 1.5vw, 19px);
  color: var(--text);
  margin: 0 0 12px;
  font-weight: 500;
}
.hero-intro {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.85;
  max-width: 520px;
  margin: 0 0 34px;
}
.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 52px;
}
.stats {
  display: flex;
  gap: 48px;
}
.stat-value {
  font-size: 28px;
  font-weight: 720;
  letter-spacing: -0.02em;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label {
  font-size: 12.5px;
  color: var(--text-3);
  margin-top: 4px;
}

.hero-visual {
  position: relative;
  height: 460px;
  display: grid;
  place-items: center;
}
.avatar-orb {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 76px;
  font-weight: 750;
  color: #06070c;
  background: var(--gradient);
  box-shadow: 0 0 90px rgba(139, 92, 246, 0.55), inset 0 -20px 60px rgba(0, 0, 0, 0.25);
  animation: breathe 6s ease-in-out infinite;
  position: relative;
  z-index: 2;
}
@keyframes breathe {
  50% {
    transform: scale(1.035);
  }
}
.orbit {
  position: absolute;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}
.orbit-1 {
  width: 320px;
  height: 320px;
  animation: spin 26s linear infinite;
}
.orbit-2 {
  width: 420px;
  height: 420px;
  border-color: rgba(255, 255, 255, 0.07);
  animation: spin 40s linear infinite reverse;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 11px;
  background: rgba(15, 18, 30, 0.8);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  font-size: 12.5px;
  color: var(--text-2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.fc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.fc-dot.cyan {
  background: #22d3ee;
}
.fc-dot.violet {
  background: #8b5cf6;
}
.fc-dot.pink {
  background: #ec4899;
}
.fc-1 {
  top: 60px;
  left: 0;
  animation: bob 5s ease-in-out infinite;
}
.fc-2 {
  right: 10px;
  top: 150px;
  animation: bob 6.5s ease-in-out infinite 0.6s;
}
.fc-3 {
  bottom: 70px;
  left: 40px;
  animation: bob 7s ease-in-out infinite 1.2s;
}
@keyframes bob {
  50% {
    transform: translateY(-12px);
  }
}

.scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  color: var(--text-3);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-decoration: none;
}
.mouse {
  width: 20px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 11px;
  position: relative;
}
.mouse i {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: var(--text-2);
  transform: translateX(-50%);
  animation: wheel 1.8s ease-in-out infinite;
}
@keyframes wheel {
  50% {
    top: 15px;
    opacity: 0.3;
  }
}

/* ---------- About ---------- */
.about-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 22px;
}
.about-card {
  padding: 30px;
}
.about-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.about-avatar {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #06070c;
  background: var(--gradient);
}
.about-name {
  font-size: 16px;
  font-weight: 650;
}
.about-loc {
  font-size: 12.5px;
  color: var(--text-3);
  margin-top: 4px;
}
.about-text {
  color: var(--text-2);
  font-size: 14.5px;
  line-height: 1.9;
  margin: 0 0 22px;
}
.about-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.about-tags span {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-2);
  background: rgba(255, 255, 255, 0.02);
}

.timeline-card {
  padding: 30px 30px 18px;
}
.timeline {
  position: relative;
  padding-left: 22px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 22px;
  width: 1px;
  background: linear-gradient(rgba(139, 92, 246, 0.6), transparent);
}
.tl-item {
  position: relative;
  padding-bottom: 24px;
}
.tl-dot {
  position: absolute;
  left: -22px;
  top: 5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #0a0c14;
  border: 2px solid var(--violet);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
}
.tl-year {
  font-size: 11.5px;
  color: var(--cyan);
  letter-spacing: 0.08em;
  margin-bottom: 3px;
}
.tl-title {
  font-size: 14.5px;
  font-weight: 600;
  margin-bottom: 4px;
}
.tl-desc {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.7;
}

/* ---------- Skills ---------- */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.skill-card {
  padding: 26px;
  transition: transform 0.3s, border-color 0.3s;
}
.skill-card:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.35);
}
.skill-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 22px;
}
.skill-index {
  font-size: 11px;
  color: var(--text-3);
  letter-spacing: 0.08em;
}
.skill-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 650;
}
.skill-row {
  margin-bottom: 16px;
}
.skill-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 7px;
}
.skill-num {
  color: var(--text-3);
  font-size: 11.5px;
}
.bar {
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--gradient);
  transform-origin: left;
  animation: grow 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes grow {
  from {
    transform: scaleX(0);
  }
}

/* ---------- Projects ---------- */
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.project-card {
  overflow: hidden;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.project-card:hover {
  transform: translateY(-6px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
}
.project-cover {
  height: 130px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}
.project-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(5, 6, 11, 0.75));
}
.project-no {
  position: relative;
  z-index: 1;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.85);
}
.project-body {
  padding: 20px 22px 24px;
}
.project-body h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 650;
}
.project-body p {
  margin: 0 0 16px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-2);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 18px;
}
.tags span {
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 6px;
  background: rgba(139, 92, 246, 0.12);
  color: #b9a5ff;
  border: 1px solid rgba(139, 92, 246, 0.2);
}
.project-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--cyan);
  text-decoration: none;
}
.project-link:hover {
  gap: 8px;
}

/* ---------- Blog ---------- */
.post-list {
  border-top: 1px solid var(--border);
}
.post-item {
  display: grid;
  grid-template-columns: 110px 1fr 30px;
  gap: 20px;
  align-items: center;
  padding: 26px 10px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.25s, padding 0.25s;
}
.post-item:hover {
  background: rgba(255, 255, 255, 0.02);
  padding-left: 18px;
}
.post-item time {
  font-size: 12.5px;
  color: var(--text-3);
  letter-spacing: 0.04em;
}
.post-main h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  transition: color 0.2s;
}
.post-item:hover h3 {
  color: var(--cyan);
}
.post-main p {
  margin: 0;
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.7;
}
.post-arrow {
  color: var(--text-3);
  transition: transform 0.25s, color 0.25s;
}
.post-item:hover .post-arrow {
  transform: translateX(5px);
  color: var(--cyan);
}

/* ---------- Contact ---------- */
.contact-card {
  padding: 46px;
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 50px;
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05));
}
.email-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 20px;
}
.email {
  font-size: 16px;
  color: var(--text);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  padding-bottom: 3px;
}
.copy-btn {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  font-family: inherit;
}
.copy-btn:hover {
  border-color: var(--violet);
  color: var(--text);
}
.socials {
  display: flex;
  gap: 10px;
}
.social {
  font-size: 12.5px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-2);
  text-decoration: none;
  transition: all 0.2s;
}
.social:hover {
  color: var(--text);
  border-color: rgba(34, 211, 238, 0.5);
  background: rgba(34, 211, 238, 0.08);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 11px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.25);
  color: var(--text);
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
}
.contact-form input:focus,
.contact-form textarea:focus {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}
.submit {
  justify-content: center;
  margin-top: 6px;
}

/* ---------- Footer ---------- */
.footer {
  border-top: 1px solid var(--border);
  padding: 28px 0;
  position: relative;
  z-index: 1;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--text-3);
}

/* ---------- Modal ---------- */
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(3, 4, 8, 0.78);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 24px;
}
.modal-card {
  position: relative;
  width: min(720px, 100%);
  max-height: 80vh;
  overflow-y: auto;
  background: #0c0e18;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px 42px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
}
.modal-card time {
  font-size: 12.5px;
  color: var(--text-3);
}
.modal-card h2 {
  margin: 10px 0 22px;
  font-size: 24px;
  line-height: 1.35;
}
.modal-body :deep(h4) {
  margin: 22px 0 8px;
  font-size: 15px;
  color: var(--cyan);
}
.modal-body :deep(p) {
  margin: 0 0 12px;
  color: var(--text-2);
  font-size: 14.5px;
  line-height: 1.9;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .hero-inner,
  .about-grid,
  .contact-card {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    height: 340px;
    margin-top: 20px;
  }
  .skills-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }
  .contact-card {
    padding: 30px;
    gap: 30px;
  }
}
@media (max-width: 620px) {
  .hero-visual {
    height: 300px;
    margin-top: 8px;
  }
  .avatar-orb {
    width: 158px;
    height: 158px;
    font-size: 54px;
  }
  .orbit-1 {
    width: 240px;
    height: 240px;
  }
  .orbit-2 {
    width: 300px;
    height: 300px;
  }
  .float-card {
    font-size: 11px;
    padding: 6px 10px;
  }
  .fc-1 {
    top: 6px;
    left: 0;
  }
  .fc-2 {
    top: 74px;
    right: 0;
  }
  .fc-3 {
    bottom: 4px;
    left: 12px;
  }
  .stats {
    gap: 28px;
  }
  .hero-actions {
    flex-wrap: wrap;
  }
  .post-item {
    grid-template-columns: 1fr 24px;
    gap: 12px;
  }
  .post-item time {
    grid-column: 1 / -1;
  }
  .modal-card {
    padding: 28px 22px;
  }
}
</style>
