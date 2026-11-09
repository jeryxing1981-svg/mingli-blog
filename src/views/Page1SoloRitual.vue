<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchCpsJump } from '@/api'
import type { CpsJump } from '@/data/cps'
import { FLOAT_WORDS, SOLO_SLIPS } from '@/data/blessings'
import GlassModal from '@/components/GlassModal.vue'
import Muyu from '@/components/Muyu.vue'
import { useRitualStore } from '@/stores/ritual'
import { burstGold } from '@/utils/fx'
import { openView } from '@/utils/nav'
import { playMuyuSound, playSingingBowlSound } from '@/utils/sound'
import { pushToast } from '@/utils/toast'

const store = useRitualStore()
const flipped = ref(false)
const hitting = ref(false)
const floats = ref<Array<{ id: number; text: string }>>([])
const couponOpen = ref(false)
const coupon = ref<CpsJump | null>(null)
const claiming = ref(false)
let floatSeed = 1

const slip = computed(() => SOLO_SLIPS[store.slipIndex] ?? SOLO_SLIPS[0])
const dotCount = computed(() => store.knocks % 3)

function onKnock(): void {
  playMuyuSound()
  hitting.value = true
  window.setTimeout(() => {
    hitting.value = false
  }, 220)
  store.knocks += 1
  store.addMerit(1)
  const text = FLOAT_WORDS[(store.knocks - 1) % FLOAT_WORDS.length]
  const id = floatSeed
  floatSeed += 1
  floats.value = [...floats.value, { id, text }]
  window.setTimeout(() => {
    floats.value = floats.value.filter((item) => item.id !== id)
  }, 900)
  if (store.knocks % 3 === 0) {
    store.reshuffleSlip()
    flipped.value = false
    burstGold()
  }
}

function rollName(): void {
  store.rollDharma()
  playSingingBowlSound()
  pushToast(`法号换成了「${store.dharmaName}」`)
}

async function claimCoupon(): Promise<void> {
  claiming.value = true
  coupon.value = await fetchCpsJump(store.userId, 'solo')
  claiming.value = false
  couponOpen.value = true
}

function confirmJump(): void {
  couponOpen.value = false
  pushToast(coupon.value?.live ? '已模拟拉起官方小程序' : '演示环境已模拟拉起，未离开本页')
}

function goCard(): void {
  openView('card')
}
</script>

<template>
  <section class="page">
    <p class="eyebrow">丁未 · 二〇二七元旦</p>
    <h2 class="display">敲三声，换一张签</h2>
    <p class="lede">雪夜佛堂只做这一件事：把班味敲松，再决定要不要把福气借给一位老友。</p>

    <div class="hall">
      <i class="lantern left" />
      <i class="lantern right" />
      <div class="hall-copy">
        <h3 class="dharma-name">{{ store.dharma.name }}</h3>
        <p class="dharma-blurb">{{ store.dharma.blurb }}</p>
        <button class="linkish" type="button" @click="rollName">换法号</button>
      </div>
      <div class="merit-pill">
        <span>今日功德</span>
        <strong>{{ store.merit }}</strong>
      </div>
    </div>

    <div class="muyu-block">
      <span v-for="item in floats" :key="item.id" class="floater">{{ item.text }}</span>
      <Muyu :hit="hitting" @knock="onKnock" />
      <p class="muyu-note">已敲 {{ store.knocks }} 下 · 每满 3 下换一张本命上上签</p>
      <div class="dots" aria-hidden="true">
        <i :class="{ on: dotCount > 0 || (store.knocks > 0 && dotCount === 0) }" />
        <i :class="{ on: dotCount > 1 || (store.knocks > 0 && dotCount === 0) }" />
        <i :class="{ on: store.knocks > 0 && dotCount === 0 }" />
      </div>
    </div>

    <div class="flip" :class="{ 'is-back': flipped }">
      <div class="flip-inner">
        <article class="face face-front">
          <span class="level">{{ slip.level }}</span>
          <h3 class="slip-name">{{ slip.name }}</h3>
          <p class="slip-verse">{{ slip.verse }}</p>
          <p class="slip-omen">{{ slip.omen }}</p>
          <button class="btn btn-ghost btn-block" type="button" @click="flipped = true">翻背面领神券</button>
        </article>
        <article class="face face-back">
          <p class="bag-kicker">美团联盟 / 聚推客</p>
          <h3 class="bag-title">人间烟火福袋</h3>
          <p class="slip-verse">饭点、下午茶、晚间出行，按当下时辰备一张烟火券。领的是券，不是现金。</p>
          <button class="btn btn-gold btn-block" type="button" :disabled="claiming" @click="claimCoupon">
            {{ claiming ? '正在问时辰…' : '一键领券' }}
          </button>
          <button class="btn btn-ghost btn-block" type="button" @click="flipped = false">翻回签文</button>
        </article>
      </div>
    </div>
  </section>

  <div class="dock">
    <p class="dock-line">2027 伴生偏财签 · 本人不可独拆</p>
    <button class="btn btn-gold btn-block" type="button" @click="goCard">借一位老友的福气合盘显字</button>
  </div>

  <GlassModal
    :open="couponOpen"
    eyebrow="模拟拉起官方小程序"
    :title="coupon?.title || '人间烟火福袋'"
    @close="couponOpen = false"
  >
    <p>{{ coupon?.reason }} 时辰落在「{{ coupon?.slot }}」。</p>
    <div class="payload">
      <div>wx.navigateToMiniProgram</div>
      <div>appId：{{ coupon?.appId || '待聚推客返回' }}</div>
      <div>path：{{ coupon?.path }}</div>
      <div>sid：{{ coupon?.sid }}</div>
      <div>{{ coupon?.live ? '聚推客实时转链' : '未配置密钥，此处为演示载荷，不会跳走' }}</div>
    </div>
    <p v-if="coupon?.h5" style="margin-top: 8px">
      <a :href="coupon.h5" target="_blank" rel="noreferrer">打开 H5 领券页</a>
    </p>
    <template #actions>
      <button class="btn btn-ghost" type="button" @click="couponOpen = false">取消</button>
      <button class="btn btn-gold" type="button" @click="confirmJump">确认打开</button>
    </template>
  </GlassModal>
</template>
