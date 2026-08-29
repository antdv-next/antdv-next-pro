# 发版流程（手工维护）

本项目**没有自动化发版流水线**，无 changesets / release-please / semantic-release。版本发布、changelog 整理、GitHub Release 均由维护者手工执行，与上游 antdv-next 保持同一套习惯。整个流程约 10 分钟。

## 版本约定

- 唯一发布包：`@antdv-next/pro`（[packages/pro/package.json](packages/pro/package.json)）
- 版本号语义化（major / minor / patch / prerelease）
- 所有 commit 遵循 conventional commits（`feat` / `fix` / `docs` / `chore` / `ci` / `refactor` / `style` / `build` / `test`），PR 标题由 CI 校验

## 0. 发布前检查

- [ ] 待发布变更均已合入 `main`，且 CI（lint / test / coverage）全绿
- [ ] 每个合并的 PR 描述都按要求填写了「📝 Change Log」区块（[PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 强制）
- [ ] 本地在 `main` 最新提交上

## 1. 整理 changelog（手工）

changelog 页面是**纯手工维护的 markdown**，不依赖任何生成工具：

| 文件 | 站点路由 |
| --- | --- |
| [docs/src/pages/components/changelog.en-US.md](docs/src/pages/components/changelog.en-US.md) | `/components/changelog` |
| [docs/src/pages/components/changelog.zh-CN.md](docs/src/pages/components/changelog.zh-CN.md) | `/components/changelog-cn` |

侧边菜单「更新日志」旁的版本 tag 会自动读取 `@antdv-next/pro` 包版本（`docs/src/config/menu/components.ts`），发版后无需手工修改。

步骤：

1. 浏览自上次发版以来合并到 `main` 的 PR，从每个 PR 的「📝 Change Log」区块提取条目（中英文各一条）
2. **只记录两类变更**（其余 commit——`docs` / `chore` / `ci` / `build` / `refactor` / `style` / `test` / `perf`——不写入 changelog）：

   | 分类标题（中 / 英） | 覆盖的 commit 类型 |
   | --- | --- |
   | ✨ 新功能 Features | `feat` |
   | 🐞 问题修复 Fixes | `fix` |

   ⚠️ 即便是 `feat` / `fix`，只要**只影响文档站或开发环境**（如 `feat(docs)`、`fix(docs)`）也不记录。changelog 只面向组件库使用者的组件行为变更。某分类没有条目时省略该节。

3. 在**文件头部**（frontmatter 之后）插入新版本块：

   ```markdown
   ## V1.1.0

   发布日期：2026-09-01

   一段发布摘要（本次版本的主线是什么）。

   **✨ 新功能 Features**

   * feat(xxx)：描述（[#123](https://github.com/antdv-next/antdv-next-pro/pull/123)）

   **🐞 问题修复 Fixes**

   * fix(xxx)：描述（#456 或 PR 链接）
   ```

4. 条目格式约定：
   - 以 `* type(scope)：描述` 开头，scope 为组件名
   - 每条尽量带 PR 或 issue 编号链接（`#123` 或完整链接）
   - 中英文文件各维护一份，内容一一对应
5. 提交：`git add docs/src/pages/components/changelog.*.md && git commit -m "docs(changelog): add v1.x.y release notes"`

## 2. 提升版本号 + 打 tag

```bash
pnpm -F @antdv-next/pro bump
```

该命令（`bumpp --commit "chore(release): @antdv-next/pro %s" --push --tag "@antdv-next/pro@%s"`）会：

1. 交互式选择版本（major / minor / patch / prerelease）
2. 更新 `packages/pro/package.json` 版本号
3. 提交 `chore(release): @antdv-next/pro x.y.z`
4. 打 tag `@antdv-next/pro@x.y.z` 并推送到远程

## 3. 发布到 npm

```bash
pnpm ci:publish   # = pnpm publish -r --access=public
```

- 发布前 `prepublish` 钩子自动执行 `pnpm build`（web-types + ESM 产物）
- 需要在 npm 上拥有 `@antdv-next/pro` 的发布权限（如需 2FA 请配合 npm one-time password）

## 4. 创建 GitHub Release

1. GitHub → Releases → `Draft a new release`
2. Tag 选择 `@antdv-next/pro@x.y.z`，标题 `V1.x.y`
3. 正文直接复用 changelog 对应版本块：发布摘要 + 分类列表，中英文任选其一（或都放）
4. 点击发布

## 5. 文档站点发布（无需手工）

- `deploy.yml` 会在 `Test` workflow 通过且分支为 `main` 时自动构建并部署文档站
- changelog 页面随本次提交自动上线

## 常见问题

- **漏了某个 PR 的条目？** changelog 是累积的有序文件，随时可在下一个版本补记；版本块内保持时间正序即可
- **bumpp 选了错误版本？** 发布前发现：`git reset --hard` 到 bump 前提交并删除 tag；已发布到 npm 则只能发 patch 修复
- **发布后 CI 挂了？** 质量门禁不阻塞 npm 发布，但请立即跟进修复并补一个 patch 版本