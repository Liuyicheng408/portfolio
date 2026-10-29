<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)
let raf = 0

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let stars = []
  let meteors = []
  let last = 0
  let nextMeteor = 2500

  function initStars() {
    const count = Math.min(300, Math.floor((w * h) / 7000))
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.25 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.004,
      drift: Math.random() * 0.1 + 0.02,
      hue: Math.random() > 0.82 ? 'violet' : 'white',
    }))
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    initStars()
  }

  function spawnMeteor() {
    const startX = Math.random() * w * 0.8 + w * 0.1
    meteors.push({
      x: startX,
      y: -20,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 5 + 6,
      angle: Math.PI / 4,
      life: 1,
    })
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h)

    for (const s of stars) {
      s.phase += s.speed
      s.y += s.drift
      if (s.y > h + 2) {
        s.y = -2
        s.x = Math.random() * w
      }
      const alpha = 0.28 + 0.62 * (0.5 + 0.5 * Math.sin(s.phase))
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle =
        s.hue === 'violet'
          ? 'rgba(167, 139, 250, ' + alpha + ')'
          : 'rgba(214, 228, 255, ' + alpha + ')'
      ctx.fill()
    }

    if (now - last > nextMeteor) {
      last = now
      nextMeteor = Math.random() * 5000 + 3500
      spawnMeteor()
    }

    for (const m of meteors) {
      m.x += Math.cos(m.angle) * m.speed
      m.y += Math.sin(m.angle) * m.speed
      m.life -= 0.012

      const tailX = m.x - Math.cos(m.angle) * m.len
      const tailY = m.y - Math.sin(m.angle) * m.len
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
      grad.addColorStop(0, 'rgba(255,255,255,' + Math.max(m.life, 0) + ')')
      grad.addColorStop(0.4, 'rgba(139,92,246,' + Math.max(m.life * 0.5, 0) + ')')
      grad.addColorStop(1, 'rgba(139,92,246,0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()
    }
    meteors = meteors.filter((m) => m.life > 0 && m.x < w + 200 && m.y < h + 200)

    raf = requestAnimationFrame(draw)
  }

  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(draw)
  last = performance.now()

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <div class="star-wrap">
    <canvas ref="canvasRef" class="star-canvas"></canvas>
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="grid-layer"></div>
  </div>
</template>

<style scoped>
.star-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.star-canvas {
  position: absolute;
  inset: 0;
}
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
}
.nebula-1 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35), transparent 65%);
  top: -260px;
  left: -160px;
  animation: float1 22s ease-in-out infinite;
}
.nebula-2 {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.22), transparent 65%);
  bottom: -240px;
  right: -140px;
  animation: float2 26s ease-in-out infinite;
}
.grid-layer {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%);
}
@keyframes float1 {
  50% {
    transform: translate(60px, 50px) scale(1.08);
  }
}
@keyframes float2 {
  50% {
    transform: translate(-50px, -40px) scale(1.1);
  }
}
</style>
