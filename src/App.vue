<script setup lang="ts">
import { Volume2, VolumeX } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import SnowCanvas from '@/components/SnowCanvas.vue'
import ToastHost from '@/components/ToastHost.vue'
import { useRitualStore } from '@/stores/ritual'
import { onRouteChange, openDuo, openView, parseRoute, type ViewId } from '@/utils/nav'
import { playSingingBowlSound, unlockAudio } from '@/utils/sound'
import Page1SoloRitual from '@/views/Page1SoloRitual.vue'
import Page2AiGhostwriter from '@/views/Page2AiGhostwriter.vue'
import Page3DuoReveal from '@/views/Page3DuoReveal.vue'
import PageMeritGrove from '@/views/PageMeritGrove.vue'

const store = useRitualStore()
const view = ref<ViewId>('solo')
const duoKey = ref('duo')

const views: Array<{ id: ViewId; label: string; full: string }> = [
  { id: 'solo', label: '求签', full: '发起人A求签' },
  { id: 'card', label: '发卡', full: 'AI嘴替发卡' },
  { id: 'duo', label: '拆卡', full: '好友B拆卡' },
  { id: 'grove', label: '抢座', full: '群5人抢座' },
]

function syncRoute(): void {
  const route = parseRoute(location.search)
  view.value = route.view
  if (route.hasSender) store.senderName = route.sender
  if (route.hasFriend || route.view === 'duo') {
    store.applyShare({
      sender: route.sender,
      friend: route.friend,
      rel: route.hasRel ? route.rel : store.relation || route.rel,
      tag: route.hasTag ? route.tag : store.tags[0] || route.tag,
    })
  }
  duoKey.value = `${store.senderName}|${store.friendName}|${store.relation}|${store.tags[0] || ''}`
}

function switchView(next: ViewId): void {
  if (next === 'duo') {
    openDuo({
      sender: store.senderName || '我',
      friend: store.friendName || '阿杰',
      rel: store.relation || '搞钱战友局',
      tag: store.tags[0] || '嘴硬心软',
    })
    return
  }
  openView(next)
}

function toggleSound(): void {
  store.toggleMuted()
  if (!store.muted) {
    unlockAudio()
    playSingingBowlSound()
  }
}

let stopRoute = () => {}
onMounted(() => {
  syncRoute()
  stopRoute = onRouteChange(syncRoute)
})
onUnmounted(() => stopRoute())
</script>

<template>
  <div class="stage">
    <div class="phone">
      <SnowCanvas />
      <div class="shell">
        <header class="topbar">
          <div class="topbar-row">
            <div class="brand">
              <div class="seal">丁未</div>
              <div>
                <h1>赛博灵山</h1>
                <p>好运合拍</p>
              </div>
            </div>
            <button class="icon-btn" type="button" :aria-pressed="!store.muted" aria-label="音效开关" @click="toggleSound">
              <VolumeX v-if="store.muted" :size="18" />
              <Volume2 v-else :size="18" />
            </button>
          </div>
          <div class="switcher" aria-label="演示视角切换">
            <button
              v-for="item in views"
              :key="item.id"
              type="button"
              :class="{ active: view === item.id }"
              :aria-pressed="view === item.id"
              :title="item.full"
              @click="switchView(item.id)"
            >
              {{ item.label }}
            </button>
          </div>
        </header>
        <Page1SoloRitual v-if="view === 'solo'" />
        <Page2AiGhostwriter v-else-if="view === 'card'" />
        <Page3DuoReveal v-else-if="view === 'duo'" :key="duoKey" />
        <PageMeritGrove v-else />
      </div>
      <ToastHost />
    </div>
  </div>
</template>
