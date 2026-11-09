<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  eyebrow?: string
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="open" class="modal-mask" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-label="title">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h3>{{ title }}</h3>
      <slot />
      <div class="modal-actions">
        <slot name="actions">
          <button class="btn btn-gold" type="button" @click="emit('close')">知道了</button>
        </slot>
      </div>
    </div>
  </div>
</template>
