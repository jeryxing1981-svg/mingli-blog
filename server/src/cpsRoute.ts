import { buildSid, fallbackJump, pickCpsSlot, type CpsJump, type CpsSlot } from '../../src/data/cps.ts'

interface JutuikeResponse {
  code?: number
  msg?: string
  data?: {
    h5?: string
    act_name?: string
    we_app_info?: {
      app_id?: string
      page_path?: string
    }
  }
}

async function askJutuike(slot: CpsSlot, sid: string): Promise<CpsJump | null> {
  const apikey = process.env.JUTUIKE_APIKEY
  const actId = process.env[slot.actEnv]
  if (!apikey || !actId) return null
  const body = new URLSearchParams({ apikey, sid, act_id: actId })
  const response = await fetch('http://api.jutuike.com/union/act', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(4000),
  })
  if (!response.ok) return null
  const json = (await response.json()) as JutuikeResponse
  const info = json.data?.we_app_info
  if (json.code !== 1 || !info?.app_id || !info.page_path) return null
  return {
    appId: info.app_id,
    path: info.page_path,
    sid,
    brand: slot.brand,
    title: json.data?.act_name || slot.title,
    slot: slot.slot,
    reason: slot.reason,
    live: true,
    h5: json.data?.h5 || '',
    source: 'jutuike',
  }
}

export async function resolveCpsJump(userId: string, cardId: string, now = new Date()): Promise<CpsJump> {
  const slot = pickCpsSlot(now)
  const sid = buildSid(userId || 'guest', cardId || 'solo', now)
  try {
    const live = await askJutuike(slot, sid)
    if (live) return live
  } catch {
    // 上游超时或拒绝时回到演示载荷，前端仍可打开说明弹窗。
  }
  return fallbackJump(slot, sid)
}
