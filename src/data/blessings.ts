export interface Dharma {
  name: string
  blurb: string
}

export interface SoloSlip {
  level: string
  name: string
  verse: string
  omen: string
}

export interface Relation {
  id: string
  label: string
  hint: string
}

export interface Impression {
  label: string
}

export interface PairReading {
  share_title: string
  hexagram_name: string
  verdict: string
  todo_tip: string
}

export interface PairInput {
  senderName: string
  receiverName: string
  relationType: string
  impressionTags: string[]
}

export const DHARMA: Dharma[] = [
  { name: '退堂鼓一级宗师', blurb: '进场三分钟，退场一辈子' },
  { name: '静音模式打工仙', blurb: '消息已读，灵魂离线' },
  { name: '戒奶茶失败居士', blurb: '戒过，但珍珠不肯戒我' },
  { name: '早八冤种尊者', blurb: '闹钟是我的劫' },
  { name: '已读不回散人', blurb: '不是高冷，是电量先没了' },
  { name: '工位趴窝真人', blurb: '人体工学，主要是趴' },
  { name: '月底吃土罗汉', blurb: '工资到账，土也到账' },
  { name: '延期大师兄', blurb: '截止日期是种生活方式' },
  { name: '情绪稳定失败佛', blurb: '表面微笑，内心弹幕' },
  { name: '糊弄学博士', blurb: '及格线是我的道场' },
  { name: '带薪发呆金刚', blurb: '眼睛看着屏幕，魂在灵山' },
  { name: '失眠护法', blurb: '夜巡全网，白日圆寂' },
  { name: '年度KPI渡劫人', blurb: '表格一开，法相就散' },
  { name: '无效社交尊者', blurb: '群里已读，心里已走' },
  { name: '电商砍一刀居士', blurb: '差一个人，差一辈子' },
]

export const RELATIONS: Relation[] = [
  { id: 'money', label: '搞钱战友局', hint: '一起算账' },
  { id: 'food', label: '过命饭搭子', hint: '干饭见真章' },
  { id: 'old', label: '江湖老友局', hint: '多年不散' },
  { id: 'plastic', label: '塑料损友局', hint: '嘴损心软' },
  { id: 'slack', label: '摸鱼合伙人', hint: '工位同盟' },
  { id: 'love', label: '宿命桃花局', hint: '别装不熟' },
]

export const IMPRESSIONS: Impression[] = [
  { label: '嘴硬心软' },
  { label: '表面社牛' },
  { label: '迟到艺术家' },
  { label: '饭搭子本尊' },
  { label: '情绪充电宝' },
  { label: '人间清醒' },
  { label: '熬夜冠军' },
  { label: '靠谱但嘴欠' },
  { label: '锦鲤体质' },
  { label: '选择困难' },
  { label: '反内耗先锋' },
  { label: '财神跟班' },
]

export const FRIEND_NAMES = ['阿杰', '小北', '老周', '阿May', '鱼丸', '阿凯', '七七', '大壮']

export const SOLO_SLIPS: SoloSlip[] = [
  {
    level: '上上签',
    name: '灵山见月',
    verse: '雪落钟声远，囊中自有春。你不必一次翻身，只要今晚先把自己哄睡着。',
    omen: '偏财是小甜头。事业宜收尾，不宜今晚再开新坑。',
  },
  {
    level: '上上签',
    name: '囊中有春',
    verse: '口袋空一点没关系，心里留一盏灯就够。2027 先把班味敲松，财气才进得来。',
    omen: '宜请自己吃顿热的。忌把焦虑当成努力。',
  },
  {
    level: '上上签',
    name: '木鱼敲雪',
    verse: '三声木鱼，一声退散。去年没完成的事，今年允许改一个更轻的做法。',
    omen: '贵人在旧识里，不在新群聊里。',
  },
  {
    level: '上上签',
    name: '灯花未尽',
    verse: '灯还亮着，就还不算输。你卡壳的那件事，差的不是天赋，是一个肯接话的人。',
    omen: '宜借老友的福气合盘，本人独拆不显字。',
  },
  {
    level: '上上签',
    name: '退堂也吉',
    verse: '退堂鼓敲得响，说明你还知道自己不想要什么。这也是一种提前的好运。',
    omen: '拒绝一次无效社交，功德比硬撑更高。',
  },
  {
    level: '上上签',
    name: '香火自暖',
    verse: '不必向全世界许愿。把一句真话留给一个还记得你口味的人，年就暖了。',
    omen: '烟火气比旗开得胜更灵。先吃饭，再谈明年。',
  },
]

export const FLOAT_WORDS = ['功德 +1', '班味 -1', '偏财 +99'] as const

interface PoolItem {
  hexagram: string
  verdict: string
  todo: string
}

const POOLS: Record<string, PoolItem[]> = {
  搞钱战友局: [
    {
      hexagram: '破卷见金',
      verdict:
        '{friend}被你盖上「{tag}」。一个敢开口，一个敢把数字说死，这组合在 2027 会先小赢一次，用来证明你们不是只会午夜热血。',
      todo: '宜：元旦后把那个拖了半年的想法，只约三十分钟谈完下一步',
    },
    {
      hexagram: '同账暖灯',
      verdict:
        '你和{friend}的账本比朋友圈诚实。标签「{tag}」是调侃，底色是这单我帮你看完。偏财不靠玄学，靠你们终于把分成写明白。',
      todo: '宜：选一家亮堂的店，把含糊的口头约定写成三行字',
    },
    {
      hexagram: '双鲤分金',
      verdict:
        '{friend}这种「{tag}」，最适合跟你做搭档：你冲的时候有人拉绳子，你怂的时候有人踢一脚。2027 宜合伙小步，不宜互相消失。',
      todo: '宜：各自带一个能本周启动的小单，见面只拍板一件',
    },
    {
      hexagram: '囊中敲钟',
      verdict:
        '合盘看见的不是横财，是你和{friend}之间那点不肯说破的「{tag}」。钱会跟着回应走，谁先回消息，谁就先接到这年的第一笔顺。',
      todo: '宜：把“下次一定”改成一个具体日期，并发给对方',
    },
  ],
  过命饭搭子: [
    {
      hexagram: '同炉暖锅',
      verdict:
        '{friend}这枚「{tag}」一贴上，签就显字了：你们的交情不在深夜真心话，在那口会给对方留的菜。2027 先把人喂饱，运气自己会坐过来。',
      todo: '宜：元旦后约顿火锅化煞',
    },
    {
      hexagram: '烟火对坐',
      verdict:
        '你给{friend}的「{tag}」很准。一个挑店，一个永远迟到，但两个人的筷子总是同时伸向同一盘。这叫过命，也叫好养活。',
      todo: '宜：订一张不会赶人的两人桌，手机扣过去半小时',
    },
    {
      hexagram: '碗边见月',
      verdict:
        '卦象很市井：{friend}是你的「{tag}」，也是你心情的备用餐具。2027 不必搞大的团聚，一顿吃到见底的饭，就够把去年的别扭烫平。',
      todo: '宜：点对方上次没舍得加的那道菜，账单你先拿',
    },
    {
      hexagram: '热汤破冰',
      verdict:
        '合盘判词不绕：你和{friend}一冷场就该吃饭。标签「{tag}」是玩笑，热汤是正经事。把见面接回饭点，很多话就不用靠微信硬聊。',
      todo: '宜：约在工作日晚饭，谁放鸽子谁请糖水',
    },
  ],
  江湖老友局: [
    {
      hexagram: '旧灯未灭',
      verdict:
        '{friend}被你贴了「{tag}」，老交情却没被这个标签看扁。你们缺的不是热络，是一次不谈功利的见面。2027 的大吉，是还认得彼此的笑声。',
      todo: '宜：翻出一张旧照片发过去，只约出来走走',
    },
    {
      hexagram: '江湖未散',
      verdict:
        '多年没把酒，话还在。你眼中的{friend}是「{tag}」，签上写的是：别再用忙来盖住想念。人还在，年就还没有散。',
      todo: '宜：语音讲一件近况，别以“在吗”开头',
    },
    {
      hexagram: '重逢小雪',
      verdict:
        '这张合盘偏暖。{friend}的「{tag}」是你才敢给的评价，换别人早翻脸。2027 适合把客套收回去，把绰号喊回来。',
      todo: '宜：元旦当周约一次步行，不带局、不带礼物',
    },
    {
      hexagram: '旧友合盏',
      verdict:
        '卦名很直：旧的人，新的一年。你和{friend}之间那点「{tag}」，是熟，不是生分。把见面从“有空”改成“就这天”。',
      todo: '宜：发一个具体时段，让对方只回答行或不行',
    },
  ],
  塑料损友局: [
    {
      hexagram: '嘴损心软',
      verdict:
        '{friend}配得上「{tag}」。你们互相拆台的精度，刚好等于在乎的程度。2027 继续损，但损完要留一句真话，这关系才不会塑料到发硬。',
      todo: '宜：公开吐槽一次，私下认真夸一句',
    },
    {
      hexagram: '假面热汤',
      verdict:
        '合盘看出你们的塑料壳很薄。你给{friend}贴「{tag}」，其实是在说我把你当自己人才敢这么讲。新年把损友局约成吃饭局。',
      todo: '宜：组一桌只骂不劝的饭，结束前互道一次谢',
    },
    {
      hexagram: '反话成真',
      verdict:
        '{friend}听得懂你的反话。标签「{tag}」是暗号，不是判决。2027 宜少在群里表演，多在私聊把近况说全。',
      todo: '宜：私聊发一句不搞笑的近况，看谁先心软',
    },
    {
      hexagram: '损友见金',
      verdict:
        '这局没有恶毒，只有默契。你和{friend}靠「{tag}」确认彼此还在线。新的一年，吐槽可以继续，失踪不可以。',
      todo: '宜：约定一个互不已读不回的晚上',
    },
  ],
  摸鱼合伙人: [
    {
      hexagram: '带薪见佛',
      verdict:
        '{friend}的「{tag}」是工位认证。你们一起把班味敲掉，也会在真有事时把对方的锅盖上。2027 的贵人，也许就是斜对面那个同样不想开会的人。',
      todo: '宜：下班路上走十分钟，专门不谈 KPI',
    },
    {
      hexagram: '工位同盟',
      verdict:
        '合盘很职场，但不正经说教。你和{friend}的「{tag}」是同盟暗号：摸鱼摸在一起，交付也扛在一起。新年宜拒绝无效忙碌。',
      todo: '宜：帮对方挡掉一个没必要的会，换一次咖啡',
    },
    {
      hexagram: '静音合鸣',
      verdict:
        '{friend}懂你的已读不回。标签「{tag}」贴给同事很冒险，贴给搭子就刚刚好。2027 你们适合结成低调联盟，把力气留给真正的活。',
      todo: '宜：设一个只属于你们的下班暗号',
    },
    {
      hexagram: '退堂共振',
      verdict:
        '卦象是两面退堂鼓对敲，居然敲出了节奏。{friend}「{tag}」，你也没好到哪去，所以谁也不必装积极。一起把一年过得轻一点，就是吉。',
      todo: '宜：选个周五提前把周末安排说死，禁止临时加班式聚餐',
    },
  ],
  宿命桃花局: [
    {
      hexagram: '灯花并蒂',
      verdict:
        '{friend}这枚「{tag}」让签纸发热。不是催你表白的那种热，是提醒你：别再用玩笑把喜欢说丢。2027 宜把一次见面约清楚，吉在坦诚。',
      todo: '宜：约一次不带第三人的步行，结束前说出真实想法',
    },
    {
      hexagram: '欲说还休',
      verdict:
        '合盘写得很坏也很准：你给{friend}贴「{tag}」，是因为正经形容词你不好意思用。新年若还想见面，就把“随便”从词汇里删掉。',
      todo: '宜：发出一个明确的时间地点，让对方选择来或不来',
    },
    {
      hexagram: '桃花照雪',
      verdict:
        '{friend}像「{tag}」这件事，你比谁都清楚。雪夜这张盘不保证结果，只保证你若继续装不熟，春天会来得更慢。',
      todo: '宜：把想说的那句写进备忘录，见面时读出来',
    },
    {
      hexagram: '并坐无妨',
      verdict:
        '别吓自己。你和{friend}的「{tag}」里有好感，也有分寸。2027 适合靠近一寸，不适合一次透支。轻一点的邀约，往往最灵。',
      todo: '宜：邀请对方做一件两小时内能结束的小事',
    },
  ],
}

export function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function normalizeRelation(input: string): Relation {
  const found = RELATIONS.find((item) => item.label === input || item.id === input)
  return found ?? RELATIONS[0]
}

export function normalizeTag(input: string): string {
  const found = IMPRESSIONS.find((item) => item.label === input)
  return found?.label ?? IMPRESSIONS[0].label
}

export function dharmaByName(seed: string): Dharma {
  return DHARMA[hashString(seed || '灵山') % DHARMA.length]
}

export function anotherDharma(current: string): Dharma {
  const index = DHARMA.findIndex((item) => item.name === current)
  const step = 1 + Math.floor(Math.random() * (DHARMA.length - 1))
  return DHARMA[(Math.max(index, 0) + step) % DHARMA.length]
}

export function randomDharma(): Dharma {
  return DHARMA[Math.floor(Math.random() * DHARMA.length)]
}

export function shareTitle(sender: string, receiver: string, tag: string): string {
  return `【${sender}】给${receiver}贴了「${tag}」，AI合出的2027第一句判词居然是……`
}

export function localPairReading(input: PairInput): PairReading {
  const sender = input.senderName.trim() || '我'
  const receiver = input.receiverName.trim() || '老友'
  const relation = normalizeRelation(input.relationType)
  const tags = (input.impressionTags.length ? input.impressionTags : ['嘴硬心软']).map(normalizeTag)
  const tag = tags[0]
  const pool = POOLS[relation.label]
  const item = pool[hashString(`${relation.label}|${tag}|${receiver}|${sender}`) % pool.length]
  const fill = (value: string) => value.split('{friend}').join(receiver).split('{tag}').join(tag)
  return {
    share_title: shareTitle(sender, receiver, tag),
    hexagram_name: item.hexagram,
    verdict: fill(item.verdict),
    todo_tip: item.todo,
  }
}

export function cardIdFor(input: PairInput): string {
  const tag = input.impressionTags[0] || '嘴硬心软'
  const raw = [input.senderName, input.receiverName, input.relationType, tag].join('|')
  return `card_${hashString(raw).toString(36)}`
}

export function koiCode(seed: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let h = hashString(seed || 'lingshan')
  let code = 'LS2027-'
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[h % alphabet.length]
    h = Math.imul(h ^ hashString(code), 16777619) >>> 0
  }
  return code
}

export function avatarColor(seed: string): string {
  const palette = ['#7c1d1d', '#9a3412', '#a16207', '#3f3f46', '#44403c', '#881337']
  return palette[hashString(seed) % palette.length]
}
