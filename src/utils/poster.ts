export interface PosterInput {
  sender: string
  friend: string
  senderDharma: string
  friendDharma: string
  tag: string
  relation: string
  hexagram: string
  verdict: string
  todo: string
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const char of text) {
    const next = line + char
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = char
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function downloadPoster(input: PosterInput): Promise<void> {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = 750
  canvas.height = 1200
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const sky = ctx.createLinearGradient(0, 0, 0, 1200)
  sky.addColorStop(0, '#0f0d15')
  sky.addColorStop(1, '#2a1215')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 750, 1200)

  ctx.strokeStyle = 'rgba(253, 230, 138, 0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(36, 36, 678, 1128)

  ctx.fillStyle = '#fde68a'
  ctx.font = '500 28px "Noto Serif SC", serif'
  ctx.fillText('2027 赛博灵山 · 好运合拍', 72, 120)

  ctx.fillStyle = '#f5efe6'
  ctx.font = '700 64px "Noto Serif SC", serif'
  ctx.fillText(input.hexagram, 72, 230)

  ctx.font = '500 28px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#f59e0b'
  ctx.fillText(`${input.relation}  ·  「${input.tag}」`, 72, 290)

  const cards = [
    { name: input.sender, dharma: input.senderDharma, x: 72 },
    { name: input.friend, dharma: input.friendDharma, x: 390 },
  ]
  for (const card of cards) {
    ctx.fillStyle = 'rgba(124, 29, 29, 0.55)'
    roundRect(ctx, card.x, 340, 288, 150, 24)
    ctx.fill()
    ctx.fillStyle = '#fde68a'
    ctx.font = '700 36px "Noto Serif SC", serif'
    ctx.fillText(card.name, card.x + 28, 408)
    ctx.fillStyle = '#f5efe6'
    ctx.font = '400 24px "Noto Sans SC", sans-serif'
    ctx.fillText(card.dharma, card.x + 28, 454)
  }

  ctx.fillStyle = '#f5efe6'
  ctx.font = '400 32px "Noto Sans SC", sans-serif'
  const verdictLines = wrap(ctx, input.verdict, 600).slice(0, 6)
  verdictLines.forEach((line, index) => {
    ctx.fillText(line, 72, 580 + index * 48)
  })

  ctx.fillStyle = '#fde68a'
  ctx.font = '500 30px "Noto Serif SC", serif'
  const todoY = 580 + verdictLines.length * 48 + 36
  wrap(ctx, input.todo, 600).slice(0, 2).forEach((line, index) => {
    ctx.fillText(line, 72, todoY + index * 44)
  })

  ctx.fillStyle = 'rgba(245, 239, 230, 0.7)'
  ctx.font = '400 22px "Noto Sans SC", sans-serif'
  ctx.fillText('借一位老友的福气，合盘之后显字', 72, 1100)

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `2027好运合拍-${input.friend}.png`
  link.click()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}
