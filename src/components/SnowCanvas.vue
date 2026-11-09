<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  r: number
  s: number
  drift: number
  gold: boolean
}

let frame = 0
let stopped = false
let observer: ResizeObserver | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const parent = canvas.parentElement
  if (!ctx || !parent) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const particles: Particle[] = []

  const resize = () => {
    const width = parent.clientWidth || 1
    const height = parent.clientHeight || 1
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(width * dpr))
    canvas.height = Math.max(1, Math.floor(height * dpr))
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = reduced ? 18 : 90
    particles.length = 0
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.6,
        s: Math.random() * 0.7 + 0.25,
        drift: Math.random() * 0.6 - 0.3,
        gold: i > count * 0.62,
      })
    }
  }

  const draw = () => {
    if (stopped) return
    const width = parent.clientWidth
    const height = parent.clientHeight
    ctx.clearRect(0, 0, width, height)
    for (const particle of particles) {
      ctx.beginPath()
      ctx.fillStyle = particle.gold ? 'rgba(253, 230, 138, 0.75)' : 'rgba(255,255,255,0.75)'
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
      ctx.fill()
      if (particle.gold) {
        particle.y -= particle.s
        particle.x += Math.sin(particle.y * 0.02) * 0.3
        if (particle.y < -8) particle.y = height + 8
      } else {
        particle.y += particle.s
        particle.x += particle.drift
        if (particle.y > height + 8) particle.y = -8
        if (particle.x < -8) particle.x = width + 8
        if (particle.x > width + 8) particle.x = -8
      }
    }
    frame = window.requestAnimationFrame(draw)
  }

  resize()
  if (!reduced) draw()
  else draw()
  observer = new ResizeObserver(resize)
  observer.observe(parent)
})

onUnmounted(() => {
  stopped = true
  window.cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<template>
  <canvas ref="canvasRef" class="snow" aria-hidden="true" />
</template>
