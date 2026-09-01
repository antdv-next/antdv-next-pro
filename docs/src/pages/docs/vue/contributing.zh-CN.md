---
title: 贡献指南
---

这篇指南会帮助你了解如何为 `@antdv-next/pro` 贡献一份自己的力量，请你在提 issue 或者 pull request 之前花几分钟阅读一遍这篇指南。

## 行为准则 {#code-of-conduct}

我们与 Antdv Next 社区使用相同的[行为准则](https://github.com/antdv-next/antdv-next/blob/main/CODE_OF_CONDUCT.md)，希望所有贡献者都能遵守。

## 开发透明 {#open-development}

我们所有的开发工作都在 [GitHub](https://github.com/antdv-next/antdv-next-pro) 上进行。团队成员和社区贡献者的 pull request 都需要经过同样的 review 流程。

## 分支管理 {#branch-management}

我们长期维护 `main` 分支。所有修改（bug 修复或新功能）都基于 `main` 建立功能分支（`feat-xxx` / `fix-xxx`），通过 pull request 合入。发版时由维护者从 `main` 发布版本（见 [RELEASE.md](https://github.com/antdv-next/antdv-next-pro/blob/main/RELEASE.md)）。

## 第一次贡献 {#first-time-contributors}

如果你还不清楚怎么在 GitHub 上提 Pull Request，可以阅读[如何优雅地在 GitHub 上贡献代码](https://segmentfault.com/a/1190000000736629)。

我们用 [good first issues](https://github.com/antdv-next/antdv-next-pro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标记了一些容易修复的 bug 和小功能，可以作为你的首次尝试。

如果你打算处理一个 issue，请先检查留言确认没有别人正在处理；若要接手别人搁置的 issue，同样先留言告知。

## Pull Request {#pull-requests}

**在你发送 Pull Request 之前**，请确认按照下面的步骤来做：

1. 基于 `main` 的最新提交创建功能分支。
2. 在项目根目录运行 `pnpm install` 安装依赖。
3. 如果修复了一个 bug 或新增了一个功能，请编写相应的单元测试（新增组件的测试位于 `packages/pro/src/<component>/tests/`）。
4. 本地跑通检查：`pnpm ci:lint`（lint）、`pnpm typecheck`、`pnpm test`。

**Pull Request 描述**请使用[模板](https://github.com/antdv-next/antdv-next-pro/blob/main/.github/PULL_REQUEST_TEMPLATE.md)，并注意：

- PR 标题遵循 conventional commits（`feat` / `fix` / `docs` 等），CI 会校验标题格式；
- **「📝 Change Log」区块必须填写**（中英文各一行），这是发版时手工整理更新日志的唯一来源（只记录组件行为相关的 `feat` / `fix`，见 [更新日志页面](/components/changelog-cn)）。

## 开发流程 {#development-workflow}

本项目是使用 [pnpm workspace](https://pnpm.io/workspaces) 管理的 monorepo，请确保已安装并配置好 pnpm（node >= 22）。

1. Fork 仓库到个人账号下。
2. 克隆你 Fork 的仓库：`git clone https://github.com/xxx/antdv-next-pro.git`
3. 进入项目目录：`cd antdv-next-pro`
4. 安装依赖：`pnpm install`
5. 启动文档站开发环境：`pnpm dev`（或 `pnpm dev:pro` 调试组件库）
6. 运行 lint：`pnpm lint`
7. 运行类型检查：`pnpm typecheck`
8. 运行测试：`pnpm test`
9. 构建站点：`pnpm build`

> 提交信息必须遵循 conventional commits（`feat` / `fix` / `docs` 等），`commit-msg` 钩子会校验格式；`pre-commit` 钩子会自动对暂存文件执行 lint-staged。格式示例见 [verify-commit.js](https://github.com/antdv-next/antdv-next-pro/blob/main/scripts/verify-commit.js)。

## 致谢 {#acknowledgements}

感谢所有为 `@antdv-next/pro` 贡献代码和文档的朋友们，是我们让这个项目变得更好！

<ContributorList />
