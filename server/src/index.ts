import Fastify from 'fastify'
import cors from '@fastify/cors'
import { localPairReading, type PairInput } from '../../src/data/blessings.ts'
import { resolveCpsJump } from './cpsRoute.ts'
import { createLedger } from './ledger.ts'
import { generateReading } from './llm.ts'

const app = Fastify({ logger: true })
const ledger = createLedger()

await app.register(cors, { origin: true })

app.get('/api/health', async () => ({ ok: true, service: 'cyber-lingshan' }))

app.post('/api/v1/pair/generate', async (request, reply) => {
  const body = request.body as Partial<PairInput> | undefined
  if (!body?.receiverName || !body.relationType || !body.impressionTags?.length) {
    return reply.code(400).send({ message: '需要 receiverName、relationType、impressionTags' })
  }
  const input: PairInput = {
    senderName: body.senderName?.trim() || '我',
    receiverName: body.receiverName.trim(),
    relationType: body.relationType,
    impressionTags: body.impressionTags,
  }
  const reading = await generateReading(input)
  if (!reading.verdict) return { ...localPairReading(input), source: 'fallback' as const }
  return reading
})

app.post('/api/v1/pair/open', async (request, reply) => {
  const body = request.body as {
    cardId?: string
    parent_card_id?: string
    openerName?: string
    senderName?: string
    receiverName?: string
  }
  if (!body?.cardId || !body.openerName) {
    return reply.code(400).send({ message: '需要 cardId 与 openerName' })
  }
  return ledger.open({
    cardId: body.cardId,
    parentCardId: body.parent_card_id,
    openerName: body.openerName,
    senderName: body.senderName?.trim() || '我',
    receiverName: body.receiverName?.trim() || '老友',
  })
})

app.get('/api/v1/cps/jump', async (request) => {
  const query = request.query as { userId?: string; cardId?: string; hour?: string }
  const now = new Date()
  if (query.hour && /^\d{1,2}$/.test(query.hour)) {
    const hour = Number(query.hour)
    const shifted = new Date(now)
    const shanghaiHour = Number(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        hourCycle: 'h23',
      }).format(now),
    )
    shifted.setHours(shifted.getHours() + (hour - shanghaiHour))
    return resolveCpsJump(query.userId || 'guest', query.cardId || 'solo', shifted)
  }
  return resolveCpsJump(query.userId || 'guest', query.cardId || 'solo', now)
})

const port = Number(process.env.PORT || 8787)
await app.listen({ port, host: '0.0.0.0' })
