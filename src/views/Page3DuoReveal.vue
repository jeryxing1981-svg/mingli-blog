<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchCpsJump, generatePair, openPair } from '@/api'
import { cardIdFor, dharmaByName, koiCode, localPairReading, type PairReading } from '@/data/blessings'
import type { CpsJump } from '@/data/cps'
import ClayStage from '@/components/ClayStage.vue'
import GlassModal from '@/components/GlassModal.vue'
import { useRitualStore } from '@/stores/ritual'
import { burstGold } from '@/utils/fx'
import { downloadPoster } from '@/utils/poster'
import { playMuyuSound, playSingingBowlSound } from '@/utils/sound'
import { pushToast } from '@/utils/toast'

const store = useRitualStore()
const reading = ref<PairReading>(localPairReading(currentInput()))
const source = ref<'llm' | 'fallback'>('fallback')
const chain = ref(store.torchLayers || 1)
const boop = ref(0)
const rewardOpen = ref(false)
const couponOpen = ref(false)
const coupon = ref<CpsJump | null>(null)
const code = ref('')

function currentInput() {
  return {
    senderName: store.senderName || '我',
    receiverName: store.friendName || '阿杰',
    relationType: store.relation || '搞钱战友局',
    impressionTags: store.tags.length ? store.tags : ['嘴硬心软'],
  }
}

const input = computed(currentInput)
const friendDharma = computed(() => dharmaByName(input.value.receiverName).name)
const rootCardId = computed(() => cardIdFor(input.value))

onMounted(async () => {
  reading.value = localPairReading(input.value)
  const [generated, opened] = await Promise.all([
    generatePair(input.value),
    openPair({
      cardId: rootCardId.value,
      openerName: input.value.receiverName,
      senderName: input.value.senderName,
      receiverName: input.value.receiverName,
    }),
  ])
  reading.value = generated
  source.value = generated.source
  chain.value = Math.max(1, opened.chainNum, store.torchLayers)
  store.setTorch(chain.value)
})

function knockHead(): void {
  boop.value += 1
  playMuyuSound()
  store.addMerit(1)
  pushToast('已通过微信服务通知唤醒发起人 A')
}

async function savePoster(): Promise<void> {
  await downloadPoster({
    sender: input.value.senderName,
    friend: input.value.receiverName,
    senderDharma: store.dharmaName,
    friendDharma: friendDharma.value,
    tag: input.value.impressionTags[0],
    relation: input.value.relationType,
    hexagram: reading.value.hexagram_name,
    verdict: reading.value.verdict,
    todo: reading.value.todo_tip,
  })
  pushToast('双人海报已开始下载')
}

async function openCoupon(): Promise<void> {
  coupon.value = await fetchCpsJump(store.userId, rootCardId.value)
  couponOpen.value = true
}

async function passTorch(): Promise<void> {
  if (store.torchPassed) {
    pushToast('这束火炬已经传出')
    return
  }
  const opened = await openPair({
    cardId: `${rootCardId.value}__c`,
    parentCardId: rootCardId.value,
    openerName: '好友C',
    senderName: input.value.receiverName,
    receiverName: '好友C',
  })
  chain.value = Math.max(chain.value + 1, opened.chainNum)
  store.setTorch(chain.value)
  store.addMerit(3)
  store.markTorchPassed()
  code.value = koiCode(rootCardId.value)
  rewardOpen.value = true
  burstGold()
  playSingingBowlSound()
}

function confirmJump(): void {
  couponOpen.value = false
  pushToast(coupon.value?.live ? '已模拟拉起官方小程序' : '演示环境已模拟拉起，未离开本页')
}
</script>

<template>
  <section class="page">
    <div class="torch">
      <span>🔥</span>
      <p>此束元旦香火已跨越 {{ chain }} 位善男信女接力传递（福气膨胀 {{ chain }}x）</p>
    </div>

    <ClayStage
      :left-name="input.senderName"
      :left-dharma="store.dharmaName"
      :left-tag="store.selfTag"
      :right-name="input.receiverName"
      :right-dharma="friendDharma"
      :right-tag="input.impressionTags[0]"
      :boop="boop"
    >
      <button class="boop-btn" type="button" @click="knockHead">🔨 敲他木鱼头 (+1)</button>
    </ClayStage>

    <article class="reading">
      <p class="eyebrow">{{ input.relationType }}</p>
      <h3>{{ reading.hexagram_name }}</h3>
      <p>{{ reading.verdict }}</p>
      <p class="todo">{{ reading.todo_tip }}</p>
      <p class="source">{{ source === 'llm' ? '小沙弥刚落笔' : '签谱已在本地展开' }}</p>
      <button class="btn btn-ghost btn-block" type="button" @click="savePoster">保存双人实况海报</button>
    </article>

    <article class="reward">
      <h3 class="section-title">拆卡好友 100% 必中反哺福利（CPS 茶饮/外卖免单券包）</h3>
      <p class="section-copy">按你打开这张卡的时辰，给茶饮或外卖券。没有充值，也没有现金返还。</p>
      <button class="btn btn-gold btn-block" type="button" @click="openCoupon">领取烟火券包</button>
    </article>
  </section>

  <div class="dock">
    <button class="btn btn-gold btn-block" type="button" @click="passTorch">
      🔥 把火炬传给下一位好友 C（演示 A 获得二级功德反哺）
    </button>
  </div>

  <GlassModal :open="rewardOpen" eyebrow="微信服务通知 · 演示" title="发起人收到一束回香" @close="rewardOpen = false">
    <p>发起人 A 的通知已亮起。这一跳只回馈功德和一张演示锁屏，不涉及充值或现金。</p>
    <div class="lockscreen">
      <span>隐藏款 AI 鎏金守护神</span>
    </div>
    <p>免费解锁【隐藏款 AI 鎏金守护神动态锁屏】</p>
    <p class="koi">跨年免单锦鲤码 {{ code }}</p>
    <p>这是演示解锁码，用来在页面里看见二级回香，不能兑现金。</p>
  </GlassModal>

  <GlassModal
    :open="couponOpen"
    eyebrow="模拟拉起官方小程序"
    :title="coupon?.title || '烟火券包'"
    @close="couponOpen = false"
  >
    <p>{{ coupon?.reason }}</p>
    <div class="payload">
      <div>wx.navigateToMiniProgram</div>
      <div>appId：{{ coupon?.appId || '待聚推客返回' }}</div>
      <div>path：{{ coupon?.path }}</div>
      <div>sid：{{ coupon?.sid }}</div>
      <div>{{ coupon?.live ? '聚推客实时转链' : '未配置密钥，此处为演示载荷' }}</div>
    </div>
    <template #actions>
      <button class="btn btn-ghost" type="button" @click="couponOpen = false">取消</button>
      <button class="btn btn-gold" type="button" @click="confirmJump">确认打开</button>
    </template>
  </GlassModal>
</template>
