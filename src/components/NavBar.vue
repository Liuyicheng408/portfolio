<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '@/data/profile'

const links = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
]

const scrolled = ref(false)
const active = ref('home')
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
  const points = links
    .map((l) => {
      const el = document.getElementById(l.id)
      if (!el) return null
      return { id: l.id, top: el.getBoundingClientRect().top }
    })
    .filter(Boolean)
  const passed = points.filter((p) => p.top <= 140)
  active.value = passed.length ? passed[passed.length - 1].id : 'home'
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header :class="['nav', { scrolled }]">
    <div class="nav-inner">
      <a href="#home" class="brand">
        <span class="brand-mark">{{ profile.avatarText }}</span>
        <span class="brand-name">{{ profile.name }}</span>
      </a>

      <nav class="links">
        <a
          v-for="l in links"
          :key="l.id"
          :href="'#' + l.id"
          :class="['link', { on: active === l.id }]"
        >
          {{ l.label }}
        </a>
      </nav>

      <a href="#contact" class="cta">联系我</a>

      <button class="burger" @click="menuOpen = !menuOpen" aria-label="菜单">
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <transition name="drop">
      <div v-if="menuOpen" class="mobile-menu">
        <a v-for="l in links" :key="l.id" :href="'#' + l.id" @click="menuOpen = false">{{ l.label }}</a>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: rgba(6, 7, 13, 0.72);
  backdrop-filter: blur(16px);
  border-bottom-color: var(--border);
}
.nav-inner {
  width: min(var(--max), calc(100% - 48px));
  margin: 0 auto;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 28px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: var(--text);
}
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #06070c;
  background: var(--gradient);
}
.brand-name {
  font-weight: 650;
  font-size: 15px;
  letter-spacing: 0.01em;
}
.links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.link {
  position: relative;
  padding: 8px 13px;
  border-radius: 9px;
  color: var(--text-2);
  text-decoration: none;
  font-size: 13.5px;
  transition: color 0.2s, background 0.2s;
}
.link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}
.link.on {
  color: var(--text);
}
.link.on::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: var(--gradient);
  transform: translateX(-50%);
}
.cta {
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 13px;
  text-decoration: none;
  color: var(--text);
  border: 1px solid var(--border);
  transition: border-color 0.2s, background 0.2s;
}
.cta:hover {
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(139, 92, 246, 0.12);
}
.burger {
  display: none;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: transparent;
  position: relative;
  cursor: pointer;
}
.burger span,
.burger span::before,
.burger span::after {
  position: absolute;
  left: 50%;
  width: 16px;
  height: 1.6px;
  background: var(--text);
  transform: translateX(-50%);
  transition: 0.25s;
}
.burger span {
  top: 50%;
  margin-top: -0.8px;
}
.burger span::before {
  content: '';
  top: -5px;
}
.burger span::after {
  content: '';
  top: 5px;
}
.burger span.open {
  background: transparent;
}
.burger span.open::before {
  top: 0;
  transform: translateX(-50%) rotate(45deg);
}
.burger span.open::after {
  top: 0;
  transform: translateX(-50%) rotate(-45deg);
}
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 10px 24px 18px;
  background: rgba(6, 7, 13, 0.96);
  border-bottom: 1px solid var(--border);
}
.mobile-menu a {
  padding: 11px 0;
  color: var(--text-2);
  text-decoration: none;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 860px) {
  .links,
  .cta {
    display: none;
  }
  .burger {
    display: block;
    margin-left: auto;
  }
  .mobile-menu {
    display: flex;
  }
}
</style>
