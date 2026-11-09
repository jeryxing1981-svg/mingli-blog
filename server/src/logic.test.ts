import assert from 'node:assert/strict'
import test from 'node:test'
import { DHARMA, IMPRESSIONS, RELATIONS, generateFriendName, localPairReading, shareTitle } from '../../src/data/blessings.ts'
import { pickCpsSlot, shanghaiParts } from '../../src/data/cps.ts'
import { createLedger } from './ledger.ts'

test('词库数量满足产品手册', () => {
  assert.equal(DHARMA.length, 15)
  assert.equal(RELATIONS.length, 6)
  assert.equal(IMPRESSIONS.length, 12)
})

test('本地合盘始终返回悬念标题和四字段', () => {
  for (const relation of RELATIONS) {
    for (const tag of IMPRESSIONS) {
      const reading = localPairReading({
        senderName: '我',
        receiverName: '阿杰',
        relationType: relation.label,
        impressionTags: [tag.label],
      })
      assert.equal(reading.share_title, shareTitle('我', '阿杰', tag.label))
      assert.equal(reading.share_title.includes('助力'), true)
      assert.ok(reading.hexagram_name.length >= 2)
      assert.ok(reading.verdict.includes('阿杰'))
      assert.ok(reading.todo_tip.startsWith('宜：'))
      assert.equal(reading.verdict.includes('转发领钱'), false)
    }
  }
})

test('用户名是点出来的，不是固定名单', () => {
  const names = new Set<string>()
  let current = ''
  for (let i = 0; i < 24; i += 1) {
    current = generateFriendName(current)
    assert.ok(current.length >= 2 && current.length <= 3)
    names.add(current)
  }
  assert.ok(names.size > 1)
})

test('A 到 B 再到 C 才触发二级功德', () => {
  const ledger = createLedger()
  const opened = ledger.open({
    cardId: 'cardA',
    openerName: '阿杰',
    senderName: '我',
    receiverName: '阿杰',
  })
  assert.equal(opened.chainNum, 1)
  assert.equal(opened.grandReward, false)

  const passed = ledger.open({
    cardId: 'cardA__c',
    parentCardId: 'cardA',
    openerName: '好友C',
    senderName: '阿杰',
    receiverName: '好友C',
  })
  assert.equal(passed.chainNum, 2)
  assert.equal(passed.grandReward, true)
  assert.equal(passed.rewardName, '我')
})

test('时辰决定烟火券品牌', () => {
  const at = (hour: number, minute: number) => {
    const date = new Date('2026-11-09T00:00:00+08:00')
    date.setUTCHours(hour - 8, minute, 0, 0)
    return date
  }
  assert.equal(pickCpsSlot(at(12, 10)).brand, 'meituan')
  assert.equal(pickCpsSlot(at(18, 0)).brand, 'meituan')
  assert.equal(pickCpsSlot(at(21, 0)).brand, 'movie')
  assert.equal(pickCpsSlot(at(23, 40)).brand, 'taxi')
  const afternoon = pickCpsSlot(at(15, 30)).brand
  assert.ok(afternoon === 'luckin' || afternoon === 'chagee')
  const parts = shanghaiParts(at(12, 10))
  assert.equal(parts.hour, 12)
})
