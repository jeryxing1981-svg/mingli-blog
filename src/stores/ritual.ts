import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  DHARMA,
  IMPRESSIONS,
  anotherDharma,
  dharmaByName,
  randomDharma,
  type Dharma,
} from '@/data/blessings'
import { setMuted } from '@/utils/sound'

const KEY = 'cyber-lingshan-ritual-v1'

export interface GroveSeat {
  name: string
  dharma: string
}

interface SavedState {
  dharmaName: string
  merit: number
  meritDate: string
  muted: boolean
  torchLayers: number
  userId: string
  senderName: string
  friendName: string
  relation: string
  tags: string[]
  seats: Array<GroveSeat | null>
  torchPassed: boolean
  selfTag: string
}

function shanghaiDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function emptySeats(): Array<GroveSeat | null> {
  const seats: Array<GroveSeat | null> = [null, null, null, null, null]
  seats[0] = { name: '老周', dharma: dharmaByName('老周').name }
  seats[3] = { name: '鱼丸', dharma: dharmaByName('鱼丸').name }
  return seats
}

function load(): Partial<SavedState> | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Partial<SavedState>) : null
  } catch {
    return null
  }
}

const saved = load()
const today = shanghaiDate()

export const useRitualStore = defineStore('ritual', () => {
  const opening = randomDharma()
  const dharmaName = ref(saved?.dharmaName || opening.name)
  const merit = ref(saved?.meritDate === today ? saved.merit ?? 108 : 108)
  const meritDate = ref(today)
  const muted = ref(saved?.muted ?? false)
  const torchLayers = ref(saved?.torchLayers ?? 1)
  const userId = ref(saved?.userId || `u_${Math.random().toString(36).slice(2, 10)}`)
  const senderName = ref(saved?.senderName || '我')
  const friendName = ref(saved?.friendName || '')
  const relation = ref(saved?.relation || '')
  const tags = ref<string[]>(saved?.tags?.length ? saved.tags : [])
  const seats = ref<Array<GroveSeat | null>>(saved?.seats?.length === 5 ? saved.seats : emptySeats())
  const torchPassed = ref(saved?.torchPassed ?? false)
  const selfTag = ref(saved?.selfTag || IMPRESSIONS[2].label)
  const knocks = ref(0)
  const slipIndex = ref(0)

  const dharma = computed<Dharma>(() => DHARMA.find((item) => item.name === dharmaName.value) ?? opening)
  const seated = computed(() => seats.value.some((seat) => seat?.name === '我'))
  const groveFull = computed(() => seats.value.every(Boolean))

  function persist(): void {
    if (typeof localStorage === 'undefined') return
    const payload: SavedState = {
      dharmaName: dharmaName.value,
      merit: merit.value,
      meritDate: meritDate.value,
      muted: muted.value,
      torchLayers: torchLayers.value,
      userId: userId.value,
      senderName: senderName.value,
      friendName: friendName.value,
      relation: relation.value,
      tags: tags.value,
      seats: seats.value,
      torchPassed: torchPassed.value,
      selfTag: selfTag.value,
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(payload))
    } catch {
      // 隐私模式写不进本地存储时，本次会话仍可继续。
    }
  }

  watch(
    [dharmaName, merit, meritDate, muted, torchLayers, userId, senderName, friendName, relation, tags, seats, torchPassed, selfTag],
    () => {
      setMuted(muted.value)
      persist()
    },
    { deep: true, immediate: true },
  )
  setMuted(muted.value)

  function toggleMuted(): void {
    muted.value = !muted.value
  }

  function rollDharma(): Dharma {
    const next = anotherDharma(dharmaName.value)
    dharmaName.value = next.name
    return next
  }

  function addMerit(amount: number): void {
    meritDate.value = shanghaiDate()
    if (meritDate.value !== today && saved?.meritDate !== meritDate.value) {
      merit.value = 108
    }
    merit.value += amount
  }

  function setFriend(name: string): void {
    friendName.value = name
  }

  function setRelation(label: string): void {
    relation.value = label
  }

  function toggleTag(label: string): string | null {
    const has = tags.value.includes(label)
    if (has) {
      tags.value = tags.value.filter((item) => item !== label)
      return null
    }
    if (tags.value.length >= 3) return '最多贴三枚，再多就成判词了'
    tags.value = [...tags.value, label]
    return null
  }

  function applyShare(input: { sender?: string; friend?: string; rel?: string; tag?: string }): void {
    if (input.sender) senderName.value = input.sender
    if (input.friend) friendName.value = input.friend
    if (input.rel) relation.value = input.rel
    if (input.tag) tags.value = [input.tag]
  }

  function setTorch(layers: number): void {
    torchLayers.value = Math.max(torchLayers.value, layers)
  }

  function markTorchPassed(): void {
    torchPassed.value = true
  }

  function takeSeat(index: number): string {
    if (seated.value) return '你已经有位子了'
    const current = seats.value[index]
    if (current) return `${current.name}已经坐下了`
    const next = seats.value.slice()
    next[index] = { name: '我', dharma: dharmaName.value }
    seats.value = next
    addMerit(8)
    return next.every(Boolean) ? '功德林满座，这束香火成林了' : '抢到蒲团，群功德 +8'
  }

  function reshuffleSlip(): number {
    let next = slipIndex.value
    while (next === slipIndex.value) next = Math.floor(Math.random() * 6)
    slipIndex.value = next
    return next
  }

  return {
    dharmaName,
    dharma,
    merit,
    muted,
    torchLayers,
    userId,
    senderName,
    friendName,
    relation,
    tags,
    seats,
    torchPassed,
    selfTag,
    knocks,
    slipIndex,
    seated,
    groveFull,
    toggleMuted,
    rollDharma,
    addMerit,
    setFriend,
    setRelation,
    toggleTag,
    applyShare,
    setTorch,
    markTorchPassed,
    takeSeat,
    reshuffleSlip,
  }
})
