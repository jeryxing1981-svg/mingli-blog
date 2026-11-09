<script setup lang="ts">
import { toasts } from '@/utils/toast'
</script>

<template>
  <div class="toasts" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.id" class="toast">{{ toast.text }}</div>
  </div>
</template>
