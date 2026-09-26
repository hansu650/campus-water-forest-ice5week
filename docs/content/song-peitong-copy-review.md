# 宋沛桐：环保内容与界面文案校对

## 核对信息

- **职责**：环保内容梳理；中文界面文案与英文对应文案校对。
- **实际日期**：2026-09-26。
- **核对方式**：以源码核对为主，阅读 `README.md`、`src/app.js` 与 `src/core.js` 的规则和界面字符串；本次没有把在线页面或本地页面试玩写成已完成体验，因此以下标注为“源码核对”。
- **基准提交**：`main` 的 `32908a5518a0b05b83f96b2be1bd48c3751b150e`（`32908a5 Add gameplay regression and browser tests`）。
- **范围**：只提出文案和内容建议，不修改游戏源码，不新增后端或数据接入。所有状态均为“建议／待秦天审核”，不代表已上线。

## 文案校对表

| 页面／源码位置 | 当前中文 | 当前英文 | 发现的问题或判断 | 建议中文 | 建议英文 | 原因 | 建议状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 首次进入欢迎页；`src/app.js:41` `welcomeCopy` | 照顾一条小鱼，守护一片校园。 | Care for a little fish. Look after your campus. | **可保留**。中英文都短，能同时表达养鱼和校园关怀；英文的 `look after` 与中文“守护”语气一致。 | 照顾一条小鱼，守护一片校园。 | Care for a little fish. Look after your campus. | 保持首次进入的行动感，不把游戏承诺写成真实节水成效。 | 建议／待秦天审核 |
| 首次进入脚注；`src/app.js:41` `welcomeFoot` | 中期课堂原型 · v5；进度保存在此浏览器，用水记录为示例。 | Class prototype · v5\nSaved in this browser. Water records are examples. | **可保留**。已交代原型、浏览器存档和示例记录三项边界。 | 中期课堂原型 · v5；进度保存在当前浏览器，用水记录为示例。 | Class prototype · v5\nSaved in this browser. Water records are examples. | 中文补“当前”更贴近 `localStorage` 的实际范围；英文已清楚，不必为对齐而改写。 | 建议／待秦天审核 |
| 下一步任务；`src/app.js:57-62` `goal()` | 下一步：喂小鱼一次 · 0/1；下一步：查看用水记录并领积分；下一步：点开校园守护牌 | Next up: Feed your fish · 0/1; Next up: Review water records; Next up: Open your guardian plaque | “领积分”容易被读成实时积分结算；“守护牌”在英文中用 `guardian plaque`，但需要继续强调是预览。 | 下一步：喂小鱼一次 · 0/1；下一步：查看示例用水记录并领取积分；下一步：打开校园守护牌预览 | Next up: Feed your fish · 0/1; Next up: Review sample water records; Next up: Open the guardian plaque preview | 在任务条直接区分示例记录和树牌预览，降低把演示流程误解为真实服务的风险。 | 建议／待秦天审核 |
| 鱼粮补给；`src/app.js:94` `food` 面板 | 每次喂食消耗 1 份鱼粮，增加 20 成长值。 | Each feed uses one portion of food and adds 20 XP. | **可保留**。规则与 `src/core.js:72-78` 一致；鱼粮和成长值清楚地属于养鱼奖励。 | 每次喂食消耗 1 份鱼粮，增加 20 成长值。 | Each feed uses one portion of food and adds 20 XP. | 不把 XP 写成绿色积分，也不暗示真实成长或节水换算。 | 建议／待秦天审核 |
| 鱼粮补给说明；`src/app.js:94` note | 补给与每关首次通关奖励各领取一次。游戏鱼粮和成长不兑换绿色积分。 | The trial supply and each first-clear reward can be claimed once. Food and XP do not create green points. | **可保留**。准确说明一次性奖励和三种数值的边界。 | 补给与每关首次通关奖励各领取一次；鱼粮和成长值不兑换绿色积分。 | The trial supply and each first-clear reward can be claimed once. Food and growth XP do not create green points. | 中文用“成长值”与界面术语一致；英文补出 `growth XP`，避免单独的 XP 被误解。 | 建议／待秦天审核 |
| 挑战页首次通关；`src/app.js:95` | 每关首次完成：2 份鱼粮 + 1 枚徽章。重复通关不重复发奖。 | First clear of each challenge: 2 food + 1 badge. Repeat clears do not grant extra rewards. | **可保留**。已明确小游戏首次通关给鱼粮和徽章，不把奖励写成绿色积分。 | 每关首次完成：2 份鱼粮 + 1 枚徽章；再次通关不重复发奖。 | First clear of each challenge: 2 portions of fish food + 1 badge. Repeat clears do not grant extra rewards. | 中文“再次”更口语；英文补 `portions of fish food`，与鱼粮术语对应更完整。 | 建议／待秦天审核 |
| 用水记录页；`src/app.js:108` | 示例数据 · 尚未接入趣智校园；领取本周 20 积分 | Sample data · Not connected to Quzhi Campus; Collect 20 points | **可保留但建议统一**。源码已说明时间、时长、费用和积分均为示例，且只可领取一次；“本周”可能被误认为后台每周自动结算。 | 示例用水记录 · 尚未接入趣智校园；领取一次性示例绿色积分（20 分） | Sample water records · Not connected to Quzhi Campus; Collect the one-time sample reward of 20 green points | 直接写“一次性示例奖励”，避免宣称已有后台自动每周结算；保留趣智校园未接入的事实。 | 建议／待秦天审核 |
| 用水记录页底部说明；`src/app.js:108` note | 这些时长、费用和积分均为演示。时长不能直接换算为节水升数，小游戏不产生绿色积分。 | Durations, fees and points are examples. Time does not directly measure litres saved. Mini-games do not create green points. | **可保留**。这是关键环保口径，已明确不能把分钟换算成升数，也没有把小游戏奖励混成绿色积分。 | 这些日期、用水时长、费用和积分均为演示数据；时长不能直接换算为节水升数，小游戏不产生绿色积分。 | Dates, durations, fees and points are demonstration data. Duration cannot be directly converted into litres saved. Mini-games do not create green points. | 中文补“日期”和“数据”，英文将 `examples` 改为更明确的 `demonstration data`，减少真实记录误读。 | 建议／待秦天审核 |
| 树牌页；`src/app.js:111` | 主图的小木牌为 AI 辅助合成，尚未在现实中挂牌。本页展示认养设想，不形成实际认养关系。树种、位置与活动安排需核实。 | The small plaque was added with AI assistance; no physical plaque has been installed. This is a concept preview, not an actual adoption. Tree details and arrangements still need verification. | **可保留**。已明确虚拟预览、未挂牌、未形成认养关系和待核实事项。 | 主图的小木牌为 AI 辅助合成，尚未在现实中挂牌。本页仅展示校园守护设想，不代表实际认养或校方批准。树种、位置与活动安排仍需核实。 | The small plaque is an AI-assisted composite preview; no physical plaque has been installed. This page shows a campus guardianship concept only, not an actual adoption or school approval. Tree details, location and activities still need verification. | 中文补“校方批准”，英文把 `concept preview` 与学校批准边界写在同一句，避免截图被当成已落地项目。 | 建议／待秦天审核 |
| 共养设置；`src/app.js:93` | 名字会显示在守护牌预览里。当前为本机展示，其他手机不会自动同步。 | Names appear on your guardian plaque preview. This is a local demo; devices do not sync. | **可保留**。准确说明当前仅在本机保存姓名，未承诺跨设备共养。 | 名字会显示在守护牌预览里；共养姓名保存在当前浏览器，其他设备不会自动同步。 | Names appear on your guardian plaque preview. Guardian names are saved in this browser; other devices do not sync automatically. | 将“本机展示”具体化为“当前浏览器保存”，与 README 的存档范围一致。 | 建议／待秦天审核 |
| 奖励弹窗；`src/app.js:125` `rewardMarkup` | 奖励已保存 · 同一奖励仅领取一次 | Saved · Each reward is granted once | **可保留**。适用于鱼粮、徽章和示例积分的状态反馈，但不应扩展为服务器到账。 | 奖励已保存在本机；同一奖励仅领取一次 | Saved in this browser; each reward is granted once | 与本地存档口径一致，避免 `Saved` 被理解为云端或后台保存。 | 建议／待秦天审核 |

## 环保内容说明

养鱼把“照顾”变成可见、低门槛的校园小游戏：喂食消耗鱼粮并增加成长值，照片拼图和接水路让参与者留意校园场景与水路；查看示例用水记录则提供一个讨论用水时间、时长和费用的入口。这样的流程可以帮助参与者观察自己的用水习惯，并把“照顾一条小鱼”联系到“守护校园环境”，但目前只能说明游戏提供了关注和讨论的情境，不能证明长期节水成效。

当前版本能展示：示例的 7 天用水时长、费用和绿色积分；绿色积分的一次性示例领取；两项小游戏的首次通关鱼粮和徽章；树牌的虚拟守护预览；以及在当前浏览器保存的共养姓名。当前记录没有接入趣智校园或其他真实后台，时长也不能直接换算成节水升数。

后续若要形成实际环保活动或数据证据，还需要在取得授权后接入真实用水记录，说明数据口径、隐私和更新频率；开展线下节水观察、宿舍或校园设施巡查、旧水龙头/漏水报修等活动；由学校确认树种、位置、挂牌和认养流程；并用持续、可复核的前后数据评估变化。游戏参与人数、完成徽章或演示截图本身不能替代这些证据。

## 术语对应表

| 中文术语 | 英文建议 | 使用口径 |
| --- | --- | --- |
| 鱼粮 | fish food | 养鱼和小游戏奖励；不等于绿色积分。 |
| 成长值 | growth XP / growth points | 喂食产生的养鱼奖励；当前每次喂食增加 20，不换算为绿色积分。 |
| 绿色积分 | green points | 只来自示例用水记录；当前示例积分只领取一次。 |
| 校园守护 | campus guardianship | 游戏里的守护主题与页面名称；树牌仍是虚拟预览。 |
| 守护牌／树牌 | guardian plaque / tree plaque | 合成或界面预览，不代表已实际挂牌、认养或获校方批准。 |
| 示例数据 | demonstration data / sample data | 当前用水日期、时长、费用和积分均属演示；未接入趣智校园。 |
| 本地存档 | browser-local save | 保存在当前浏览器，刷新可保留；不同设备和浏览器不自动同步。 |
| 共养 | co-care / care together | 当前只在本机保存姓名，不代表跨设备协作。 |
| 首次通关 | first clear | 每项小游戏首次完成发放 2 份鱼粮和 1 枚徽章，重复通关不重复发奖。 |

## 备注

本稿由 AI 协助整理原句、翻译对照和规则口径；宋沛桐本人核对了 README、`src/app.js`、`src/core.js` 中与首次进入、任务、喂食、挑战、用水记录、树牌和存档相关的范围。未编造访谈、用户反馈、完成率或长期节水成效；未把源码核对写成已试玩。
