import { ref } from 'vue'

export interface ToastItem {
  id: number
  text: string
}

export const toasts = ref<ToastItem[]>([])
let seed = 1

export function pushToast(text: string): void {
  const id = seed
  seed += 1
  toasts.value = [{ id, text }]
  window.setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, 1800)
}
