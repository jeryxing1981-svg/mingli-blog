<script setup lang="ts">
import { useRitualStore } from '@/stores/ritual'
import { burstGold } from '@/utils/fx'
import { playMuyuSound, playSingingBowlSound } from '@/utils/sound'
import { pushToast } from '@/utils/toast'

const store = useRitualStore()
const seatedCount = () => store.seats.filter(Boolean).length

function sit(index: number): void {
  const before = store.seated
  const message = store.takeSeat(index)
  if (!before && store.seated) playMuyuSound()
  if (message.includes('满座')) {
    burstGold()
    playSingingBowlSound()
  }
  pushToast(message)
}
</script>

<template>
  <section class="page">
    <div class="grove-head">
      <div>
        <p class="eyebrow">群功德林</p>
        <h2 class="display">五人抢蒲团</h2>
      </div>
      <div class="seat-count">{{ seatedCount() }} / 5</div>
    </div>
    <p class="lede">坐满这五张蒲团，这束香火才算成林。每个人只抢一个位子。</p>
    <div class="grove">
      <button
        v-for="(seat, index) in store.seats"
        :key="index"
        class="cushion"
        :class="{ taken: Boolean(seat) }"
        type="button"
        @click="sit(index)"
      >
        <template v-if="seat">
          <strong>{{ seat.name }}</strong>
          <small>{{ seat.dharma }}</small>
        </template>
        <template v-else>
          <strong>空蒲团</strong>
          <small>点此入座</small>
        </template>
      </button>
    </div>
  </section>
</template>
