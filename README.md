# 2027 赛博灵山 · 好运合拍

元旦祈福裂变 H5。三步漏斗加一间群功德林：

1. 发起人敲木鱼，翻本命上上签，背面领一张按时辰匹配的烟火券。
2. 不打字。点好友称呼、六大关系、印象胶囊，生成微信悬念卡。
3. 好友拆开双人同框，看合盘判词，再把香火传给下一位。演示里，第二跳会让发起人收到功德回香。
4. 群功德林五张蒲团，坐满即成林。

文案不出现「转发领钱」，也不做充值资金池或上下级返现。合盘的说法是「借一位老友的福气合盘显字」。

## 本地运行

```bash
npm install
npm run dev:all
```

浏览器打开 `http://127.0.0.1:5173`。顶部可以切换求签、发卡、拆卡。发卡页点用户名会当场生成一个新名字，主按钮是转发给好友助力。手机要看效果时，用电脑的局域网地址，不要用 `127.0.0.1`。

只开前端时，合盘和领券会自动降级到本地签谱和演示载荷：

```bash
npm run dev
```

## 环境变量

复制 `.env.example` 为 `.env`。

- `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL`：DeepSeek 或豆包的 OpenAI 兼容接口。超时或没填密钥时，`POST /api/v1/pair/generate` 返回本地签谱。
- `JUTUIKE_APIKEY` 和对应活动 ID：调用聚推客 `http://api.jutuike.com/union/act`。没配密钥时，`GET /api/v1/cps/jump` 返回演示用的 `appId` / `path` / `sid`，页面只模拟拉起，不会跳走。

时辰按北京时间：早晨瑞幸、饭点美团外卖、下午茶在瑞幸和霸王茶姬之间按日期轮换、晚间电影票、深夜打车。查询参数 `hour` 可以预览某个钟点，例如 `/api/v1/cps/jump?userId=demo&cardId=solo&hour=15`。

## 粘土小沙弥视频

双人同框的人物是矢量粘土小沙弥。`public/clay-monks.mp4` 是一段夜殿氛围循环，作为 `<video muted loop playsinline>` 底座播在人物下面。若你有预制的 3D 粘土小沙弥视频，用同名文件替换即可，头像、法号和印象仍叠在上面。

## 检查

```bash
npm test
npm run typecheck
npm run build
```

音效用 Web Audio 合成：木鱼敲击，以及 528Hz 颂钵。不依赖外部 mp3。法号、功德和火炬层数记在本机。
