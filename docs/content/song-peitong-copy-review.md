# Song Peitong: Sustainability and Interface Copy Review

## Review record

- **Contributor:** Song Peitong.
- **Responsibility:** Sustainability content and comparison of the Chinese interface with its English copy.
- **Review date:** 26 September 2026.
- **Method:** Source review of `README.md`, `src/app.js` and `src/core.js`.
- **Baseline:** `32908a5518a0b05b83f96b2be1bd48c3751b150e` (`32908a5 Add gameplay regression and browser tests`).
- **Deliverable:** Proposed wording and content recommendations for Qin Tian's integration review. The proposals below describe source findings and planned wording changes.
- **English edition:** Prepared during integration with Codex assistance, retaining Song Peitong's review topics and recommendations. The original submitted Chinese edition remains in this PR's commit history.

## Copy review

Every row is a **proposal awaiting Qin Tian's implementation decision**. Locations refer to the pinned baseline; line numbers may move in later versions. Chinese terms are quoted where needed for the bilingual comparison.

| Page / baseline source | Current English or relevant source wording | Review finding | Suggested English | Reason |
| --- | --- | --- | --- | --- |
| Welcome message; `src/app.js:41`, `welcomeCopy` | Care for a little fish. Look after your campus. | Keep. Both languages connect fish care with campus care in a short sentence. | Care for a little fish. Look after your campus. | Gives new players a clear theme and an approachable action. |
| Welcome footnote; `src/app.js:41`, `welcomeFoot` | Class prototype · v5 / Saved in this browser. Water records are examples. | Keep the English. In Chinese, specify the current browser when describing the save. | Class prototype · v5 / Saved in this browser. Water records are examples. | Explains the prototype, storage location and example records together. |
| Next-step tasks; `src/app.js:57–62`, `goal()` | Next up: Feed your fish · 0/1; Next up: Review water records; Next up: Open your guardian plaque | Make the sample records and plaque preview explicit in the task bar. | Next up: Feed your fish · 0/1; Next up: Review sample water records; Next up: Open the guardian plaque preview | Keeps the next action aligned with the demonstration's actual scope. |
| Feeding; `src/app.js:94`, food panel | Each feed uses one portion of food and adds 20 XP. | Keep. This matches the food and growth rules in `src/core.js`. | Each feed uses one portion of food and adds 20 XP. | Identifies food consumption and growth as game mechanics. |
| Food supply explanation; `src/app.js:94` | The trial supply and each first-clear reward can be claimed once. Food and XP do not create green points. | Keep the reward distinction; expand XP to growth XP for clarity. | The trial supply and each first-clear reward can be claimed once. Food and growth XP do not create green points. | Consistent terminology helps players distinguish the three values. |
| First challenge clear; `src/app.js:95` | First clear of each challenge: 2 food + 1 badge. Repeat clears do not grant extra rewards. | Keep the rule; spell out the food unit. | First clear of each challenge: 2 portions of fish food + 1 badge. Repeat clears do not grant extra rewards. | Describes the exact reward and its one-time eligibility. |
| Water records; `src/app.js:108` | Sample data · Not connected to Quzhi Campus; Collect 20 points | The saved claim flag implements one claim. The Chinese weekly wording can suggest an automatic recurring settlement. | Sample water records · Not connected to Quzhi Campus; Collect the one-time sample reward of 20 green points | Describes the current one-time demonstration instead of suggesting a calendar-based service. |
| Water-record explanation; `src/app.js:108` | Durations, fees and points are examples. Time does not directly measure litres saved. Mini-games do not create green points. | Keep the distinction and explicitly include the dates as example data. | Dates, durations, fees and points are demonstration data. Duration cannot be directly converted into litres saved. Mini-games do not create green points. | Makes the interpretation of the chart and rewards precise. |
| Guardian page; `src/app.js:111` | The small plaque was added with AI assistance; no physical plaque has been installed. This is a concept preview, not an actual adoption. Tree details and arrangements still need verification. | Keep the virtual-preview explanation and include the school-approval scope explicitly. | The small plaque is an AI-assisted composite preview; no physical plaque has been installed. This page shows a campus guardianship concept only, not an actual adoption or school approval. Tree details, location and activities still need verification. | Connects the image to the proposed concept and identifies what a future campus activity would need. |
| Guardian names; `src/app.js:93` | Names appear on your guardian plaque preview. This is a local demo; devices do not sync. | Specify browser storage in both languages. | Names appear on your guardian plaque preview. Guardian names are saved in this browser; other devices do not sync automatically. | Matches the storage scope described in the README. |
| Reward panel; `src/app.js:125`, `rewardMarkup` | Saved · Each reward is granted once | Specify where the reward is saved. | Saved in this browser; each reward is granted once | Makes the persistence message consistent with the actual implementation. |

## Sustainability content

Fish care gives the project an approachable way to introduce campus environmental awareness. Feeding spends fish food and adds growth XP. The campus photo puzzle and pipe challenge draw attention to familiar places and water routes. Sample records then provide a setting for discussing water-use durations and fees. This sequence connects caring for a fish with caring for the campus through visible actions and explanations.

The current prototype presents seven example water-use records, a one-time sample points claim, first-clear food and badge rewards, a virtual guardian plaque, and guardian names saved in the current browser. These features demonstrate the proposed interaction and support discussion. Their data scope remains explicitly labelled: the records are examples, the plaque is a virtual preview, and browser storage keeps each player's progress separately.

A future environmental deployment would need authorised water records, documented data definitions and update intervals, and an agreed approach to privacy. Campus activities could include water-use observations, facility checks and reporting leaking taps. Tree identification, location, plaques and any adoption arrangement would require the relevant campus process. Sustained environmental outcomes would be evaluated using traceable observations and comparable measurements over time.

## Terminology

Chinese entries below are source terms for the bilingual review; the recommended submission language is English.

| Chinese source term | Recommended English | Intended meaning |
| --- | --- | --- |
| 鱼粮 | fish food | Game food used for feeding and earned through the defined game rewards. |
| 成长值 | growth XP / growth points | Feeding adds 20 growth XP; keep this separate from green points. |
| 绿色积分 | green points | The current one-time sample water-record reward. |
| 校园守护 | campus guardianship | The game's campus-care theme and virtual plaque concept. |
| 守护牌／树牌 | guardian plaque / tree plaque | A composite or interface preview whose scope is stated on the page. |
| 示例数据 | demonstration data / sample data | The example dates, durations, fees and points used by the prototype. |
| 本地存档 | browser-local save | Progress retained in the same browser, with separate saves on different browsers and devices. |
| 共养 | co-care / care together | Guardian names used in this browser's preview. |
| 首次通关 | first clear | A challenge's first completion grants two portions of food and one badge. |

## Method and next steps

Song Peitong's submitted review covers the welcome screen, next-step tasks, feeding, challenges, water records, the tree plaque and saved progress. AI assisted with locating source strings, translating and comparing wording, and checking the rules. The stated activity is source review; interactive playtests and participant feedback are recorded separately when they take place.

Qin Tian reviews the proposed copy, selects changes and verifies the resulting interface. Implementation, integration and final acceptance remain with the team leader. This contribution changes this document only; the table itself does not change the live game.
