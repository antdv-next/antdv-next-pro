# PR 模板填写参考

仅在需要判断模板选项、编写正文或拟定标题时读取本文件。

## 类型选项映射

优先勾选最贴近主目的的一项；确实跨两类时可勾选两项。

| 主要目的 | 英文模板 | 中文模板 | 建议标题 type |
| --- | --- | --- | --- |
| 新增组件能力或公开 API | `🆕 New feature` | `🆕 新功能` | `feat` |
| 新增组件 | `🧩 New component` | `🧩 新增组件` | `feat` |
| 现有组件功能增强 | `⭐️ Existing component enhancement` | `⭐️ 现有组件功能增强` | `feat` |
| 修复组件缺陷 | `🐞 Bug fix` | `🐞 Bug 修复` | `fix` |
| 站点或文档 | `📝 Site / documentation improvement` | `📝 站点 / 文档改进` | `site` / `docs` |
| Demo 调整 | `📽️ Demo improvement` | `📽️ Demo 改进` | `demo` |
| 样式或交互改进 | `💄 Component style improvement` | `💄 组件样式改进` | `fix` / `feat` |
| TypeScript 定义 | `🤖 TypeScript definition improvement` | `🤖 TypeScript 类型定义改进` | `type` |
| 包体积优化 | `📦 Bundle size optimization` | `📦 包体积优化` | `build` / `perf` |
| 性能优化 | `⚡️ Performance optimization` | `⚡️ 性能优化` | `perf` |
| 功能增强 | `⭐️ Feature enhancement` | `⭐️ 功能增强` | `feat` |
| 国际化 | `🌐 Internationalization` | `🌐 国际化` | `feat` / `fix` |
| 内部重构 | `🛠 Refactoring` | `🛠 重构` | `refactor` |
| 代码风格 | `🎨 Code style optimization` | `🎨 代码风格优化` | `style` |
| 测试 | `✅ Test Case` | `✅ 测试用例` | `test` |
| 分支合并 | `🔀 Branch merge` | `🔀 分支合并` | `chore` |
| CI / workflow | `⏩ Workflow` | `⏩ 工作流` | `ci` |
| 无障碍 | `⌨️ Accessibility improvement` | `⌨️ 无障碍改进` | `a11y` |
| 其他维护 | `❓ Other` | `❓ 其他` | `chore` |

类型以最终影响为准。例如：

- 新增一个组件：`🧩 New component` / `🧩 新增组件`，标题 `feat(Scrollbar)`。
- 为已有组件增加新 API：`⭐️ Existing component enhancement` / `⭐️ 现有组件功能增强`，标题 `feat(...)`。
- 修复官网主题页按钮逻辑：`site`，不是组件 `fix`。
- 修正文档描述：`docs`。
- 调整 demo 展示但不改变组件：`demo`。
- 修复 GitHub Actions：`ci`。
- 修复 Scrollbar 真实组件行为：`fix(Scrollbar)`。

## Related Issues

有明确 issue 时使用：

- `close #123`
- `fix #123`
- `ref #123`

没有 issue 时写 `None`。不得猜测或编造 issue 编号。

## Background and Solution

建议用 2 至 5 行说明：

1. 原先的问题或需求；
2. 采用的解决方式；
3. API、UI、交互或行为是否发生变化。

英文示例：

```markdown
### 💡 Background and Solution

Scrollbar could lose its thumb position when the content size changed asynchronously. This PR recalculates the thumb offset after content mutations. No public API changes are introduced.
```

中文示例：

```markdown
### 💡 背景与方案

Scrollbar 在内容异步变化后可能丢失滑块位置。本次变更在内容变更后重新计算滑块偏移，不涉及公开 API 变化。
```

## Change Log

有真实用户影响时，同时填写中英文：

```markdown
### 📝 Change Log

| Language   | Changelog                                        |
| ---------- | ------------------------------------------------ |
| 🇺🇸 English | Fix Scrollbar thumb offset after async content changes |
| 🇨🇳 Chinese | 修复 Scrollbar 内容异步变化后滑块位置异常          |
```

无用户可感知影响时：

```markdown
### 📝 Change Log

| Language   | Changelog             |
| ---------- | --------------------- |
| 🇺🇸 English | No changelog required |
| 🇨🇳 Chinese | 无需更新日志          |
```

中文模板保留 `### 📝 变更日志` 以及它自身的表头，不要用英文 section 替换。

## Component Contribution Checklist

模板末尾的 `### ✅ Component Contribution Checklist` / `### ✅ 组件贡献检查清单` 必须保留并如实勾选：

- 新增组件或组件功能增强是否补充了文档和 Demo；
- 组件行为变更是否添加单元测试或回归测试；
- 是否考虑了现有 API 和交互的向后兼容；
- 是否已运行相关 lint、类型检查和测试。

只勾选实际完成的项目，未完成的保留未勾选状态。

## 标题示例

标题必须使用英文，且 subject 以小写字母开头：

- `fix(Scrollbar): keep thumb offset stable on async content changes`
- `feat(ProConfigProvider): support custom theme tokens`
- `docs: clarify Scrollbar slot usage`
- `refactor(theme): simplify token resolution`
- `site: refine the overview page empty state`
- `ci: adjust pull request validation workflow`
- `chore: add repository PR creation skill`

避免：

- `修复 Scrollbar 滑块位置问题`
- `Fix(Scrollbar): Keep thumb stable`（subject 以大写字母开头）
- `update scrollbar`
- `fix issues`
- `some improvements`

## 创建前确认示例

```markdown
这是准备提交的 PR 草稿，请确认：

- Target repository: `antdv-next/antdv-next-pro`
- Head: `<fork-owner>:<branch>`
- Base: `main`
- Title: `fix(Scrollbar): keep thumb offset stable on async content changes`
- Type: `🐞 Bug 修复`
- Validation: `<实际运行的命令与结果>`
- Uncommitted changes: `<有则列出，否则写 None>`

确认后我再推送分支并创建 PR；如需调整 title、type、base 或正文，我会先更新草稿。
```
