<script setup lang="ts">
import { computed } from 'vue'
import { FRIEND_NAMES, IMPRESSIONS, RELATIONS, shareTitle } from '@/data/blessings'
import { useRitualStore } from '@/stores/ritual'
import { openDuo } from '@/utils/nav'
import { pushToast } from '@/utils/toast'

const store = useRitualStore()

const ready = computed(() => Boolean(store.friendName && store.relation && store.tags.length))
const title = computed(() =>
  ready.value
    ? shareTitle('我', store.friendName, store.tags[0])
    : '先点一位好友、一种关系、至少一枚印象',
)

function pickFriend(name: string): void {
  store.setFriend(name)
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
    pushToast('先点一位好友、一种关系、至少一枚印象')
    return
  }
  store.senderName = '我'
  pushToast('已模拟订阅微信服务通知')
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
    <p class="eyebrow">AI 嘴替 · 两秒</p>
    <h2 class="display">不用打字</h2>
    <p class="lede">点称呼、点关系、点印象。悬念句留给对方，判词先藏起来。</p>

    <div class="section">
      <h3 class="section-title">好友怎么叫</h3>
      <div class="chip-row" style="margin-top: 10px">
        <button
          v-for="name in FRIEND_NAMES"
          :key="name"
          class="chip"
          :class="{ active: store.friendName === name }"
          type="button"
          @click="pickFriend(name)"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">六大合盘局</h3>
      <div class="rel-grid" style="margin-top: 10px">
        <button
          v-for="item in RELATIONS"
          :key="item.id"
          class="rel"
          :class="{ active: store.relation === item.label }"
          type="button"
          @click="pickRelation(item.label)"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.hint }}</span>
        </button>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">好友印象</h3>
      <p class="section-copy">可多选，最多三枚。标题只用第一枚主印象。</p>
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

    <div class="section">
      <h3 class="section-title">微信里会看到的卡片</h3>
      <div class="wx">
        <div class="wx-meta">
          <span>赛博灵山</span>
          <span>刚刚</span>
        </div>
        <div class="wx-card">
          <h3 :class="{ placeholder: !ready }">{{ title }}</h3>
          <footer>
            <span>2027 好运合拍 · {{ store.relation || '关系未选' }}</span>
            <i class="wx-thumb" />
          </footer>
        </div>
      </div>
    </div>
  </section>

  <div class="dock">
    <button class="btn btn-gold btn-block" type="button" @click="send">把悬念卡送出去</button>
  </div>
</template>
