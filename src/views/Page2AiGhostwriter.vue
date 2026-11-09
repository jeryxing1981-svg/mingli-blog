<script setup lang="ts">
import { computed } from 'vue'
import { generateFriendName, IMPRESSIONS, RELATIONS, shareTitle } from '@/data/blessings'
import { useRitualStore } from '@/stores/ritual'
import { openDuo } from '@/utils/nav'
import { pushToast } from '@/utils/toast'

const store = useRitualStore()

const ready = computed(() => Boolean(store.friendName && store.relation && store.tags.length))
const title = computed(() =>
  store.friendName && store.tags.length
    ? shareTitle('我', store.friendName, store.tags[0])
    : '点用户名生成助力对象，再选关系和印象',
)

function rollFriend(): void {
  store.setFriend(generateFriendName(store.friendName))
}

function pickRelation(label: string): void {
  store.setRelation(label)
}

function pickTag(label: string): void {
  const warning = store.toggleTag(label)
  if (warning) pushToast(warning)
}

function send(): void {
  if (!ready.value) {
    pushToast('先点出用户名，再选一种关系和一枚印象')
    return
  }
  store.senderName = '我'
  pushToast('已准备好发给好友助力')
  openDuo({
    sender: '我',
    friend: store.friendName,
    rel: store.relation,
    tag: store.tags[0],
  })
}
</script>

<template>
  <section class="page">
    <p class="eyebrow">第 2 步</p>
    <h2 class="display">点名字，请他助力</h2>
    <p class="lede">没有预设名单。点下面的用户名就会生成一个，再点一次就换一个。转发后，对方点开就是在帮你显字。</p>

    <button class="name-plate" type="button" @click="rollFriend">
      <span>{{ store.friendName || '点此生成用户名' }}</span>
      <small>{{ store.friendName ? '再点一次，换一个用户名' : '生成后会写进转发卡片' }}</small>
    </button>

    <div class="section">
      <h3 class="section-title">好友会看到的助力卡</h3>
      <div class="wx">
        <div class="wx-card">
          <h3 :class="{ placeholder: !store.friendName || !store.tags.length }">{{ title }}</h3>
          <footer>
            <span>点开即助力 · {{ store.relation || '关系未选' }}</span>
          </footer>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">你们是什么关系</h3>
      <div class="rel-grid">
        <button
          v-for="item in RELATIONS"
          :key="item.id"
          class="rel"
          :class="{ active: store.relation === item.label }"
          type="button"
          @click="pickRelation(item.label)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">贴一枚印象</h3>
      <div class="tag-cloud">
        <button
          v-for="item in IMPRESSIONS"
          :key="item.label"
          class="tag"
          :class="{ active: store.tags.includes(item.label) }"
          type="button"
          @click="pickTag(item.label)"
        >
          {{ item.label }}
          <span v-if="store.tags[0] === item.label" class="main">主</span>
        </button>
      </div>
    </div>

    </section>

  <div class="dock">
    <p class="dock-line">把这张卡转出去，请他帮你显字</p>
    <button class="btn btn-gold btn-block" type="button" @click="send">转发给他助力</button>
  </div>
</template>
