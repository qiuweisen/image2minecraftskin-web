# 01 · 信息架构与改哪些面

日期：2026-10-20 · 不改现有 SEO URL / content 路由。

---

## 1. 总原则

- **改表面，不改 URL。** `/`、`/minecraft-skin-viewer`、各语言首页、已有工具页保持原路径与 canonical。
- AI 能力落在：**首页 Generator 结果区旁**、**Dialog/Sheet 工作台**、**设置子页（我的皮肤 / Credits）**。
- 导航可增加「My skins」入口（登录后可见），链到 `/settings/creations`（或同路由改名展示）；不新增公开 SEO 落地页（计划非目标）。

---

## 2. 面清单

| 面 | 改动类型 | 说明 |
|---|---|---|
| **首页 Generator · 免费结果态** | 增量 | 成功条 / Download 旁增加次级 CTA：`AI 版本：让它真的像你`；旁注余额或「1 free after verify」 |
| **AI 弹层 / 面板** | 新（替换 fake-door） | 上传或沿用当前图、consent、型号 classic\|slim、主体 人物\|宠物、余额、Generate |
| **任务卡（嵌在结果区或面板内）** | 新（复用 CE 形态） | pending / succeeded（3D+下载）/ failed-refunded / 布局不合格·免费重试 |
| **登录 / 验证邮箱** | 复用现有 auth | CTA 触发；未验证时阻断 Generate 并提示发信 |
| **`/settings/creations` → 展示名「我的皮肤」** | 文案+预览 | 分页 24、缩略图、状态、打开预览 |
| **`/settings/credits` 或定价区「买积分」** | 配置驱动 | 两包：$2.99 / 15、$6.99 / 50；一次性说明；无订阅 |
| **余额不足 Dialog** | 复用 CE | 显示 balance / cost / missing + 链到买积分 |
| **Privacy 文案** | 文案（实现 PR） | AI 路径第三方处理、源图 7 天；本设计包只标位置 |
| **Waitlist 模态** | **删除/替换** | `ui-ai-modal.png` 的 coming soon 不再出现 |

---

## 3. 不改的面

- 免费 `mapImageToSkin` 工作台布局骨架（上传 / 纹理 / 3D / 格式）。
- 现有 SEO 正文块顺序与 URL。
- Skin Viewer 独立页（可不挂 AI，除非同组件复用结果卡）。
- 不做新仪表盘、不做像素编辑器、不做批量页。

---

## 4. 用户路径（跨面）

```
首页免费工具 ──成功──► 结果区
                        │
                        ├─ Download（主）
                        └─ AI CTA ──未登录──► Login modal ──► 回面板
                                   ──未验证──► Verify email gate
                                   ──已验证──► AI 面板
                                                 │
                                                 ├─ consent + options + Generate
                                                 ├─ 余额不足 ──► Credits packs ──► Stripe ──► 回面板
                                                 └─ pending 任务卡 ──► succeeded / failed
                                                                      │
                                                                      └─ 我的皮肤（历史）
```

---

## 5. 线框文件对照

| 线框 | 覆盖 |
|---|---|
| `home-free-result-with-ai-cta` | 首页结果区 + AI CTA |
| `ai-modal-or-panel` | 上传 / consent / classic\|slim / 人物\|宠物 |
| `task-pending` | 生成中 |
| `task-succeeded` | 3D 预览 + 下载 |
| `task-failed-refunded` | 失败退款 / 布局不合格重试 |
| `creations-my-skins` | 我的皮肤列表 |
| `credits-packs` | 两档一次性包 |
