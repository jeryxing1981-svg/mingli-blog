<script setup lang="ts">
defineProps<{ hit: boolean }>()
const emit = defineEmits<{ knock: [] }>()
</script>

<template>
  <button class="muyu" :class="{ hit }" type="button" aria-label="敲木鱼" @click="emit('knock')">
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <ellipse cx="96" cy="118" rx="52" ry="8" fill="rgba(0,0,0,.35)" />
      <path d="M38 78c8 28 40 40 70 36 34-4 58-28 54-52-4-22-34-34-68-30C58 36 30 54 38 78z" fill="#8a3b16" />
      <path d="M52 70c6 18 28 28 52 24 24-4 40-18 36-34-8 8-28 14-50 12-16-2-30-8-38-2z" fill="#f59e0b" opacity=".85" />
      <path d="M70 62c10 4 28 6 40 2" fill="none" stroke="#fde68a" stroke-width="3" stroke-linecap="round" />
      <path d="M128 34c28-16 52 4 48 22-2 8-18 8-28 2" fill="none" stroke="#fde68a" stroke-width="6" stroke-linecap="round" />
      <circle cx="168" cy="58" r="7" fill="#fde68a" />
    </svg>
  </button>
</template>
