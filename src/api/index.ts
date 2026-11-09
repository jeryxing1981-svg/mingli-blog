import { localPairReading, type PairInput, type PairReading } from '@/data/blessings'
import { fallbackJump, pickCpsSlot, buildSid, type CpsJump } from '@/data/cps'

const BASE = import.meta.env.VITE_API_BASE ?? ''

export interface GenerateResult extends PairReading {
  source: 'llm' | 'fallback'
}

export interface OpenResult {
  cardId: string
  chainNum: number
  grandReward: boolean
  rewardName: string
  depth: number
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`http ${response.status}`)
  return (await response.json()) as T
}

export async function generatePair(input: PairInput): Promise<GenerateResult> {
  const local = localPairReading(input)
  try {
    const remote = await postJson<GenerateResult>('/api/v1/pair/generate', input)
    if (!remote.share_title || !remote.hexagram_name || !remote.verdict || !remote.todo_tip) {
      return { ...local, source: 'fallback' }
    }
    return remote
  } catch {
    return { ...local, source: 'fallback' }
  }
}

export async function openPair(input: {
  cardId: string
  parentCardId?: string
  openerName: string
  senderName: string
  receiverName: string
}): Promise<OpenResult> {
  try {
    return await postJson<OpenResult>('/api/v1/pair/open', {
      cardId: input.cardId,
      parent_card_id: input.parentCardId,
      openerName: input.openerName,
      senderName: input.senderName,
      receiverName: input.receiverName,
    })
  } catch {
    const depth = input.parentCardId ? 2 : 1
    return {
      cardId: input.cardId,
      chainNum: depth,
      grandReward: depth >= 2,
      rewardName: input.senderName,
      depth,
    }
  }
}

export async function fetchCpsJump(userId: string, cardId: string): Promise<CpsJump> {
  const slot = pickCpsSlot()
  const sid = buildSid(userId, cardId)
  try {
    const query = new URLSearchParams({ userId, cardId })
    const response = await fetch(`${BASE}/api/v1/cps/jump?${query.toString()}`)
    if (!response.ok) throw new Error(`http ${response.status}`)
    return (await response.json()) as CpsJump
  } catch {
    return fallbackJump(slot, sid)
  }
}
