export interface OpenInput {
  cardId: string
  parentCardId?: string
  openerName: string
  senderName: string
  receiverName: string
}

export interface OpenResult {
  cardId: string
  chainNum: number
  grandReward: boolean
  rewardName: string
  depth: number
}

interface Card {
  id: string
  senderName: string
  receiverName: string
  parentId?: string
  openers: string[]
}

export interface Ledger {
  open(input: OpenInput): OpenResult
}

export function createLedger(): Ledger {
  const cards = new Map<string, Card>()

  function chainOf(card: Card): Card[] {
    const chain = [card]
    const seen = new Set<string>([card.id])
    let cursor = card
    while (cursor.parentId && !seen.has(cursor.parentId)) {
      const parent = cards.get(cursor.parentId)
      if (!parent) break
      seen.add(parent.id)
      chain.push(parent)
      cursor = parent
    }
    return chain
  }

  return {
    open(input) {
      let card = cards.get(input.cardId)
      if (!card) {
        card = {
          id: input.cardId,
          senderName: input.senderName,
          receiverName: input.receiverName,
          parentId: input.parentCardId,
          openers: [],
        }
        cards.set(card.id, card)
      }
      if (input.openerName && !card.openers.includes(input.openerName)) {
        card.openers.push(input.openerName)
      }
      const chain = chainOf(card)
      const root = chain[chain.length - 1]
      return {
        cardId: card.id,
        chainNum: chain.length,
        grandReward: chain.length >= 2,
        rewardName: root.senderName,
        depth: chain.length,
      }
    },
  }
}
