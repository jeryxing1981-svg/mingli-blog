import { localPairReading, type PairInput, type PairReading } from '../../src/data/blessings.ts'

export interface GenerateResult extends PairReading {
  source: 'llm' | 'fallback'
}

const SYSTEM_PROMPT = `你是「赛博灵山」里一位毒舌但心软的算命小沙弥，专门给好友合盘写 2027 元旦判词。
只输出 JSON 对象，不要 Markdown。键必须是 share_title, hexagram_name, verdict, todo_tip。
规则：
- share_title 必须严格使用用户给出的标题句式，不要改标点。
- hexagram_name 为 4 到 6 个字的新中式卦名。
- verdict 为 40 到 80 字，嘴硬心软，可以自嘲，不人身攻击，不涉及政治、色情、赌博。
- todo_tip 以「宜：」开头，给一个具体、温暖、可执行的破冰行动。
- 禁止出现转发领钱、充值、返现、资金池。`

function fallback(input: PairInput): GenerateResult {
  return { ...localPairReading(input), source: 'fallback' }
}

function extractJson(content: string): PairReading | null {
  const trimmed = content.trim().replace(/^```json\s*/i, '').replace(/```$/, '')
  try {
    const parsed = JSON.parse(trimmed) as Partial<PairReading>
    if (!parsed.share_title || !parsed.hexagram_name || !parsed.verdict || !parsed.todo_tip) return null
    return {
      share_title: parsed.share_title,
      hexagram_name: parsed.hexagram_name,
      verdict: parsed.verdict,
      todo_tip: parsed.todo_tip,
    }
  } catch {
    return null
  }
}

export async function generateReading(input: PairInput): Promise<GenerateResult> {
  const local = fallback(input)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return local
  const base = (process.env.OPENAI_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '')
  const model = process.env.OPENAI_MODEL || 'deepseek-chat'
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: JSON.stringify({
              senderName: input.senderName,
              receiverName: input.receiverName,
              relationType: input.relationType,
              impressionTags: input.impressionTags,
              share_title: local.share_title,
            }),
          },
        ],
      }),
      signal: AbortSignal.timeout(4500),
    })
    if (!response.ok) return local
    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = json.choices?.[0]?.message?.content
    if (!content) return local
    const parsed = extractJson(content)
    if (!parsed) return local
    return { ...parsed, source: 'llm' }
  } catch {
    return local
  }
}
