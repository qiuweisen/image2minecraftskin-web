# 03 · 视觉与组件规格（对照 DESIGN.md）

日期：2026-10-20 · AI 面板是现有 **Minecraft Skin Workshop** 语言的延伸，不是第二套 SaaS 皮肤。

---

## 1. Tokens（沿用 DESIGN.md，勿另起炉灶）

```css
--color-bg: #0b1011;
--color-surface: #11191b;
--color-surface-raised: #162326;
--color-fg: #f1f3ed;
--color-muted: #8d9a9a;
--color-border: #21464a;
--color-border-strong: #2a7378;
--color-accent: #36d8d4;      /* 主强调 / AI CTA 边框与次按钮 */
--color-success: #a8dd45;     /* 成功 / 退款完成 */
--color-warning: #f28b72;     /* 错误 / 需验证 */
--radius-control: 4px;
--control-min-height: 44px;
```

说明：线上部分主 Download 现为偏橙的强调色；**AI 入口用 accent cyan**，与免费 Download 主按钮形成主/次层级（Download 保持现站主下载色，AI CTA = outline cyan 或 lime 文字按钮）。不要引入玻璃拟态、大光晕、像素墙纸。

字体：标题/状态标签可用 mono display；正文 sans（DESIGN.md §3）。

---

## 2. AI CTA（免费结果旁）

- 位置：成功结果卡内，**Download** 主按钮同一操作行或紧下方；同层级文案，不抢 Download。
- 样式：`variant=outline`，边框 `--color-border-strong`，文字 `--color-accent`；图标可用小 sparkles（单色，非渐变插画）。
- 文案（EN）：**AI version: make it actually look like you**
- 旁注（muted 12px）：`1 credit · free credit after email verify` 或 `Balance: N`

---

## 3. AI 面板（Dialog 桌面 / Sheet 手机）

| 区域 | 规格 |
|---|---|
| 宽度 | 桌面 max 520–560px；手机 100% 高 sheet |
| 背景 | `--color-surface`；边框 1px `--color-border` |
| 标题 | mono 或 semibold：「AI skin from photo」 |
| 关闭 | 右上 X，44×44 热区 |
| 分区 | ① 源图 ② Model/Subject ③ Consent ④ Cost + Primary |
| 主按钮 | 满宽、`--color-accent` 底或 lime 底 + 深色字；禁用态 opacity 0.5 |
| Loading | 主按钮内 spinner + 文案不变高度（防 CLS） |

上传区：虚线边框 `--color-border-strong`，最小高 120px；已选图显示方形缩略 + Change。

Toggle 组（Classic/Slim、Person/Pet）：分段控件，选中 = surface-raised + accent 底边或填充，高度 40–44px。

---

## 4. 任务卡

- 与 coloringeasy coloring-task-card **同尺寸节奏**：圆角 4–8px、内边距 16、固定预览区最小高（建议 220px 桌面 / 180px 手机）以免 loading 顶布局。
- Pending：骨架 shimmer（可关动画）。
- Success：三列（AI art | texture | 3D）在 ≥920px；以下单列堆叠。
- Failed：左边框 3px warning；退款徽章 success 色描边。

---

## 5. 我的皮肤 / Credits

- Creations：24 宫格，卡片比例 1:1 缩略 + 下方状态 pill（pending=muted，ok=success，fail=warning）。
- Credits：两张价格卡；「Value」卡角标 Best value（小条 accent）；价格用大号数字；次要说明 muted。
- 不出现订阅 Toggle。

---

## 6. 与假门模态的差异（替换清单）

| 旧 `ui-ai-modal.png` | 新 |
|---|---|
| 「coming soon」+ Join waitlist | 真实 Generate 流程 |
| 「Images stay on your device」 | Consent：会发送给第三方 AI；免费路径仍本地 |
| 仅 Email 收集 | 登录态 + 选项 + 余额 |
| 橙红满宽 Join | Accent 主按钮 Generate / Buy credits |

---

## 7. 实现映射（给后续 Codex，本包不写代码）

- Dialog/Sheet、Button、Card、Accordion：TanStarter 已有。
- 任务卡 ← 复制 CE `coloring-task-card` 改预览槽。
- 3D ← 现有 `skin-preview-3d`。
- 积分页 ← CE settings/credits 配色换成上表 tokens。

Craft floor：对比度 ≥4.5:1；正文 ≥12px；行高 ≥1.2；可见 `:focus-visible`。
