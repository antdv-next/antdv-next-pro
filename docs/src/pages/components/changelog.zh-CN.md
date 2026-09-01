---
title: 组件更新日志
sourceFile: components/changelog.zh-CN.md
---

## V1.0.2 {#v1-0-2}

发布日期：2026-09-01

本版本新增 ProConfigProvider 全局配置能力，并提供与 antdv-next 保持一致的 locale wrapper。

**✨ 新功能 Features**

* feat(config-provider)：新增 ProConfigProvider，继承 Antdv ConfigProvider 配置，并提供可按公开 locale 路径导入的语言包包装器。

## V1.0.0 {#v1-0-0}

发布日期：2026-08-29

`@antdv-next/pro` 首个正式版本。本包从 antdv-next 主仓库独立出来，面向高频 Pro 场景沉淀开箱即用的增强组件，并配套独立的文档站点与工程基础设施。

**✨ 新功能 Features**

* feat(scrollbar)：新增 Scrollbar 滚动条容器组件，支持内容尺寸变化观测、auto / visible / hidden 三种可见性模式、有/无动画的显隐过渡，以及 `classes` / `styles` 语义化定制（[#2](https://github.com/antdv-next/antdv-next-pro/pull/2)）

## 如何维护本页 {#maintaining-this-page}

本页面为手工维护：每次发版时，从合并的 Pull Request 描述中的「📝 Change Log」区块整理条目，**只记录组件行为相关的新功能（feat）与问题修复（fix）两类，文档类变更不记录**，追加到文件头部。具体流程见 [RELEASE.md](https://github.com/antdv-next/antdv-next-pro/blob/main/RELEASE.md)。
