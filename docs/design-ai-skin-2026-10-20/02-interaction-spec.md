# 02 · 交互规格（逐步状态）

日期：2026-10-20 · 状态机与 coloringeasy `credit_task` 对齐；前端只改文案与皮肤预览。

---

## 0. 共用规则

- 主按钮高度 ≥ 44px；状态同时用文案 + 颜色（DESIGN.md）。
- `aria-live` 播报任务状态变化。
- 关闭面板不取消已创建任务；任务继续在「我的皮肤」。
- Analytics（实现期）：`ai_cta_click` / `ai_generate_start` / `ai_generate_success` / `ai_generate_fail` / `begin_checkout` / `purchase`；payload 无照片/prompt/secret。

---

## 1. 未登录

| 步骤 | UI | 行为 |
|---|---|---|
| 1 | 免费结果旁 AI CTA 可见 | 点击 → `ai_cta_click` |
| 2 | 现有 Login modal | 成功后打开 AI 面板；失败保留 CTA |
| 3 | — | 不在未登录态扣费或上传到用户 R2 |

---

## 2. 已登录、邮箱未验证

| 步骤 | UI | 行为 |
|---|---|---|
| 1 | AI 面板顶部黄/警告条 | 「Verify your email to use AI (includes 1 free credit)」 |
| 2 | 主按钮禁用或改为「Resend verification」 | 验证前不可 Generate |
| 3 | Google 登录 | 视为已验证（计划） |

---

## 3. Consent（首次 AI 上传前必勾）

文案要点（英文 UI，中文摘要供审）：

> I understand my photo will be sent to a third-party AI model to generate character art. Source photos are deleted after 7 days. Generated skins stay until I delete them.

- 未勾选：Generate 禁用。
- 勾选状态可记在 local/account preference（实现细节）；每次新会话至少展示一次摘要链接到 Privacy。

---

## 4. 上传与选项（AI 面板）

| 控件 | 默认 | 校验 |
|---|---|---|
| 源图 | 可「Use current free-tool image」或重新选文件 | jpg/png/webp；≤10MB；短边 ≥256px；客户端先挡 |
| Model | Classic | Classic \| Slim（与免费工具同一语义） |
| Subject | Person | Person \| Pet/animal（改 prompt 变体，不做自动识别） |
| Cost 行 | 「1 credit · balance: N」 | N=0 时主按钮转购买 |

主按钮文案：`Generate AI skin · 1 credit`

---

## 5. Pending / Running / Unknown

- 任务卡固定最小高度；左侧缩略占位（源图模糊或骨架），右侧状态：
  - **Pending / Running：** 「Drawing character (front + back)… Usually under 1–2 min. You can leave this page.»
  - **Unknown：** 「Still checking…」+ Refresh
- 进度不假装百分比（避免假进度条）；可用不确定 pulse（尊重 `prefers-reduced-motion`）。
- 并发：每用户 1 个；若已有进行中，CTA 打开已有任务卡而非新建。

---

## 6. Succeeded（映射在浏览实时算）

1. 拉取 `resultRef`（AI 双半图）。
2. 浏览器 `ai-sheet` → 64×64 皮肤；布局不合格 → 见 §8。
3. 展示：
   - 左：AI 原图（正/背）小预览
   - 中：2D texture
   - 右：现有 3D skin preview（可旋转）
4. 动作：`Download skin PNG`（主）· `Download AI art`（次）· `Make another`（耗 credit）

---

## 7. Failed / Rejected + 退款

- 标题：`Generation failed — 1 credit refunded`
- 说明：简短原因（timeout / policy / provider）；「Refunded to your balance」
- 动作：`Try again`（将再次扣 1，若余额不足走 checkout）· `Close`

---

## 8. 布局不合格（AI 图不规范）

- 状态展示为成功拿到图但映射失败（或专用 UI 旗标，不新造服务端状态名；可用 succeeded + 客户端 flag / input_json retry）。
- 文案：`AI layout looked off — free retry available once`
- 主按钮：`Free regenerate`（仅一次）；用尽后变普通 `Try again · 1 credit`

---

## 9. 余额不足 → Checkout

1. 点 Generate 或系统检测 balance < 1 → Insufficient dialog：balance / need 1 / missing。
2. 链到 **Credits packs** 面：两卡并列（桌面）/ 纵向（手机）。
3. 卡上写清：一次性、无订阅、失败退款、未成年人需监护人同意（短句）。
4. Stripe Checkout → 回原页 → 轮询余额 → 自动或提示继续 Generate。

定价展示（已定）：

| Pack | Price | Credits | 单价展示（可选小字） |
|---|---|---|---|
| Starter | $2.99 | 15 | ~$0.20 / skin |
| Value | $6.99 | 50 | ~$0.14 / skin · Best value 角标 |

---

## 10. 全局 / 日上限

- 触达用户日限或全局 cap：toast/横幅「AI is at capacity today — try tomorrow」；**不扣费、不建 task**。
- `AI_SKIN_ENABLED=false`：隐藏 CTA，API 拒绝（实现）。

---

## 11. 我的皮肤（Creations）

- 空态：插画位 + 「Generate your first AI skin」→ 回首页并打开面板。
- 列表项：缩略（浏览器映射或缓存）、状态 pill、时间、打开详情。
- 详情复用 succeeded 预览布局。
