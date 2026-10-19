# 00 · UX 判断：AI 皮肤为何这样设计

日期：2026-10-20（Asia/Shanghai）· 作者：开发助手夜间执行器  
依据：`docs/plans/2026-10-18-ai-skin.md`（已审阅）、`DESIGN.md`、线上 https://image2minecraftskin.com/、coloringeasy 生成/积分/任务状态 UX、`docs/pr-screens/ui-ai-modal.png`  
原则：用户任务优先；已验证流程（coloringeasy）原样复用；免费工具不被付费 add-on 挤出首屏。

---

## 1. 用户任务（一句话，用户的话）

「我想把这张照片变成一个**真的像我**的 Minecraft 皮肤，然后下载 PNG 进游戏。」

| 来源 | 意图 | 设备假设 |
|---|---|---|
| 搜索「image to minecraft skin」等工具词 | 立刻出皮肤，越少步骤越好 | 桌面为主，手机上传自拍也常见 |
| 免费结果不满意（像素糊、不像本人） | 愿意为「更像」付一次小额 | 已看到免费结果，情绪在「差一点」 |
| 从 waitlist / AI CTA 回来 | 想用 AI，不想再被骗进 waitlist | 需真实流程，不能再 fake-door |

**单页主行动（免费默认）**：上传 → 本地出皮肤 → 下载。  
**AI 主行动（付费 add-on）**：在免费结果旁点 CTA →（登录/验证）→ consent → 上传/确认选项 → 等任务 → 看 3D 预览 → 下载。

---

## 2. 为何跟 coloringeasy（采纳什么）

本站目前**没有**积分/任务/Stripe 闭环；coloringeasy 已上线同一套模板能力。计划已定：**不自研第二套状态机**。

### What they do well — we adopt

1. **异步任务卡**：pending / running / succeeded / failed / refunded 文案清晰；离开页面可回来；轮询退避。
2. **先扣再跑、失败自动退**：用户不怕试；「退款」写进失败态，建立信任。
3. **余额不足 → checkout 弹层/页**：在决策点显示价格与缺多少，不藏到设置深处。
4. **注册赠送 1 次**：降低第一次 AI 尝试门槛（本站 = 登录并验证邮箱后送 1 credit）。
5. **Creations 历史**：分页 + 缩略图；用户有「我的皮肤」可回看，利于复购。
6. **一次性包、无订阅**（本站定价已定 $2.99/15、$6.99/50）：和「偶尔换皮肤」的低频任务匹配。

### 相对 coloringeasy 的产品差异（不能照搬文案）

| 点 | coloringeasy | 本站 AI 皮肤 |
|---|---|---|
| 免费入口 | 工具本身常需 credit | **本地算法永远免费、永远默认** |
| 结果形态 | 上色图 | AI 角色正/背图 → **浏览器实时映射** 64×64 皮肤 + 3D 预览 |
| Upsell 时机 | 工具内余额 | **免费结果成功后**旁挂 CTA「AI 版本：让它真的像你」 |
| 隐私 | 图上云 | 免费路径仍「图不离开设备」；AI 路径必须 **consent** 写明「会发给第三方 AI」 |

---

## 3. 与免费工具的关系（不得破坏）

1. **首屏 / Generator 工作台仍是免费本地工具**（DESIGN.md：工具在第一视口或紧接下方）。
2. AI 是 **同层级次要 CTA**，不替换 Download、不挡住上传区。
3. 替换现有 **fake-door waitlist**（`ui-ai-modal.png`：「AI HD version — coming soon」）：点了就要进真实流程，不再收集邮箱空等。
4. SEO URL / 正文结构本期不动（计划非目标）；FAQ 里「Does my image leave my device?」对 **免费路径** 仍为 No；AI 路径在 consent + privacy 更新里说清。

---

## 4. 折叠复杂度（设计决策）

| 用户可能纠结的 | 我们替他定的默认 |
|---|---|
| 人还是宠物？ | 默认 **人物**；显式二选一 |
| Classic / Slim | 默认 **Classic**；与免费工具同一套 switch |
| 要不要登录？ | CTA 点击后再拦；先让用户在免费结果上产生「想更像」的动机 |
| 生成中能不能走？ | 能；任务进「我的皮肤」 |
| 映射失败怪谁？ | 「AI 图不规范」+ **免费重试一次**（计划已定） |

一屏一主按钮：AI 面板主按钮 = **Generate AI skin (1 credit)**；余额不足时主按钮变 **Buy credits**。

---

## 5. 自检（对照竞品/参照，非吹嘘）

| 维度 | 评分意图 |
|---|---|
| 5 秒内是否懂「免费仍在、AI 是加分」 | CTA 文案直说「更像你」；免费 Download 仍最显眼（橙/主色下载已存在） |
| 到首次 AI 结果的摩擦 | 登录+验证+consent+1 次免费 credit；与 coloringeasy 同一量级 |
| 卡点 | 未验证邮箱、未勾 consent、余额 0、日上限 — 均需可见错误，不静默 |
| 等待体验 | 任务卡固定高度 + 状态文案 + 可离开 | 
| 手机 | 面板全屏 sheet；任务卡单列；积分包两卡纵向 |

**Honest claim：** 我们不是「发明更好的 AI 工作台」，而是把 coloringeasy 已验证的 generation/credits UX **接到** 免费皮肤工具的结果旁，并补上皮肤特有的 consent / classic|slim / 人|宠 / 3D 预览。
