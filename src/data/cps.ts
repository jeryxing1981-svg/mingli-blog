export type CpsBrand = 'meituan' | 'luckin' | 'chagee' | 'movie' | 'taxi'

export interface CpsSlot {
  brand: CpsBrand
  slot: string
  title: string
  reason: string
  actEnv: string
}

export interface CpsJump {
  appId: string
  path: string
  sid: string
  brand: CpsBrand
  title: string
  slot: string
  reason: string
  live: boolean
  h5: string
  source: 'jutuike' | 'fallback'
}

const SLOTS: Record<CpsBrand, Omit<CpsSlot, 'brand'>> = {
  meituan: {
    slot: '饭点美团外卖',
    title: '美团外卖饭点红包',
    reason: '这个时辰适合先把胃安顿好。',
    actEnv: 'JUTUIKE_ACT_MEITUAN',
  },
  luckin: {
    slot: '下午瑞幸',
    title: '瑞幸下午茶券',
    reason: '提神的时辰，给自己一杯热的。',
    actEnv: 'JUTUIKE_ACT_LUCKIN',
  },
  chagee: {
    slot: '下午霸王茶姬',
    title: '霸王茶姬茶饮券',
    reason: '下午的香火，用一杯茶就够。',
    actEnv: 'JUTUIKE_ACT_CHAGEE',
  },
  movie: {
    slot: '晚间电影票',
    title: '晚间电影票',
    reason: '天黑之后，适合把人约进同一间厅。',
    actEnv: 'JUTUIKE_ACT_MOVIE',
  },
  taxi: {
    slot: '晚间打车',
    title: '晚间回家的车',
    reason: '夜深了，先把人安全送回去。',
    actEnv: 'JUTUIKE_ACT_TAXI',
  },
}

export function shanghaiParts(date = new Date()): { hour: number; minute: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0')
  return { hour: pick('hour'), minute: pick('minute'), day: pick('day') }
}

export function pickCpsSlot(date = new Date()): CpsSlot {
  const { hour, minute, day } = shanghaiParts(date)
  const clock = hour * 60 + minute
  let brand: CpsBrand
  if (clock >= 23 * 60 || clock < 6 * 60) brand = 'taxi'
  else if (clock < 10 * 60 + 30) brand = 'luckin'
  else if (clock < 14 * 60) brand = 'meituan'
  else if (clock < 17 * 60) brand = day % 2 === 0 ? 'luckin' : 'chagee'
  else if (clock < 19 * 60 + 30) brand = 'meituan'
  else brand = 'movie'
  return { brand, ...SLOTS[brand] }
}

export function buildSid(userId: string, cardId: string, date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  const stamp = `${pick('year')}${pick('month')}${pick('day')}${pick('hour')}${pick('minute')}`
  const clean = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24) || 'guest'
  return `ls_${clean(userId)}_${clean(cardId)}_${stamp}`
}

export function fallbackJump(slot: CpsSlot, sid: string): CpsJump {
  const meituan = slot.brand === 'meituan'
  return {
    appId: meituan ? 'wxde8ac0a21135c07d' : '',
    path: meituan ? '/index/pages/h5/h5' : `pages/demo/coupon?brand=${slot.brand}&sid=${sid}`,
    sid,
    brand: slot.brand,
    title: slot.title,
    slot: slot.slot,
    reason: slot.reason,
    live: false,
    h5: '',
    source: 'fallback',
  }
}
