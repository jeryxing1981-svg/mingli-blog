<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { avatarColor } from '@/data/blessings'

const props = defineProps<{
  leftName: string
  leftDharma: string
  leftTag: string
  rightName: string
  rightDharma: string
  rightTag: string
  boop: number
}>()

const videoReady = ref(false)
const clipSrc = ref('')
const booping = ref(false)
let boopTimer = 0

onMounted(async () => {
  const fileName = 'clay-monks.mp4'
  const url = `${import.meta.env.BASE_URL}${fileName}`
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const type = response.headers.get('content-type') || ''
    if (response.ok && !type.includes('text/html')) {
      clipSrc.value = url
      videoReady.value = true
    }
  } catch {
    videoReady.value = false
  }
})

watch(
  () => props.boop,
  (value) => {
    if (!value) return
    booping.value = true
    window.clearTimeout(boopTimer)
    boopTimer = window.setTimeout(() => {
      booping.value = false
    }, 280)
  },
)
</script>

<template>
  <div class="clay-stage">
    <video
      v-if="videoReady"
      class="clay-video"
      :src="clipSrc"
      muted
      loop
      playsinline
      autoplay
    />
    <svg class="clay-svg" viewBox="0 0 360 250" aria-hidden="true">
      <ellipse cx="180" cy="214" rx="150" ry="18" fill="rgba(245,158,11,.18)" />
      <g>
        <ellipse cx="112" cy="196" rx="52" ry="16" fill="#7c1d1d" />
        <ellipse cx="112" cy="190" rx="40" ry="10" fill="#f59e0b" />
        <path d="M78 150c4 36 22 58 40 58s34-20 36-56c-18 10-46 12-76-2z" fill="#9a3412" />
        <circle cx="112" cy="108" r="28" fill="#f0b89a" />
        <path d="M90 104c6 8 12 10 22 8" fill="none" stroke="#5c3317" stroke-width="2" stroke-linecap="round" />
        <path d="M112 104c6 8 12 10 22 8" fill="none" stroke="#5c3317" stroke-width="2" stroke-linecap="round" />
        <path d="M104 124c6 6 14 6 20 0" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round" />
        <circle cx="100" cy="116" r="3" fill="#e8a090" opacity=".7" />
        <circle cx="128" cy="116" r="3" fill="#e8a090" opacity=".7" />
      </g>
      <g class="monk-right" :class="{ boop: booping }">
        <ellipse cx="248" cy="196" rx="52" ry="16" fill="#7c1d1d" />
        <ellipse cx="248" cy="190" rx="40" ry="10" fill="#fde68a" />
        <path d="M214 150c4 36 22 58 40 58s34-20 36-56c-18 10-46 12-76-2z" fill="#f59e0b" />
        <circle cx="248" cy="108" r="28" fill="#f3c3a8" />
        <path d="M226 104c6 8 12 10 22 8" fill="none" stroke="#5c3317" stroke-width="2" stroke-linecap="round" />
        <path d="M248 104c6 8 12 10 22 8" fill="none" stroke="#5c3317" stroke-width="2" stroke-linecap="round" />
        <path d="M240 124c6 6 14 6 20 0" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round" />
        <circle cx="236" cy="116" r="3" fill="#e8a090" opacity=".7" />
        <circle cx="264" cy="116" r="3" fill="#e8a090" opacity=".7" />
      </g>
      <ellipse cx="180" cy="176" rx="16" ry="8" fill="#fde68a" />
    </svg>
    <div class="nameplate left">
      <div class="avatar" :style="{ background: avatarColor(leftName) }">{{ leftName.slice(0, 1) }}</div>
      <div>
        <strong>{{ leftName }}</strong>
        <small>{{ leftDharma }}</small>
        <em>{{ leftTag }}</em>
      </div>
    </div>
    <div class="nameplate right">
      <div class="avatar" :style="{ background: avatarColor(rightName) }">{{ rightName.slice(0, 1) }}</div>
      <div>
        <strong>{{ rightName }}</strong>
        <small>{{ rightDharma }}</small>
        <em>{{ rightTag }}</em>
      </div>
    </div>
    <slot />
  </div>
</template>
