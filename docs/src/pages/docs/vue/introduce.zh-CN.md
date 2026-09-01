---
title: 介绍
---

`@antdv-next/pro` 是构建在 [Antdv Next](https://github.com/antdv-next/antdv-next)（Ant Design 的 Vue3 实现）之上的企业级**增强组件库**，面向中后台高频 Pro 场景沉淀开箱即用的组件能力。

> 与 `antdv-next` 的关系：`antdv-next` 是基础组件库，提供 Button、Table、Form 等通用组件；`@antdv-next/pro` 在其之上提供面向复杂业务场景的增强组件（如自定义滚动条容器），与 `antdv-next` 共享同一套主题与 token 体系。

## ✨ 特性 {#features}

- 🚀 **面向企业场景**：为长列表、密集导航区等 Pro 布局场景提供开箱即用的组件
- 🧩 **原生主题**：组件参与 `antdv-next` 的 CSS-in-JS 主题与 token 体系，支持 `classes` / `styles` 语义化定制
- 🛡 **TypeScript**：全量类型声明，静态类型可预测
- ⚙️ **Tree-shakable**：ESM 模块组织与 `antdv-next` 一致，按需打包
- 📦 **SSR 友好**：支持服务端渲染与现代浏览器

## 📦 前置依赖 {#peer-dependencies}

`@antdv-next/pro` 以 `antdv-next` 与 `vue` 为 peer dependencies，使用时需自行安装：

| 依赖 | 最低版本 |
| --- | --- |
| `vue` | >= 3.2.0 |
| `antdv-next` | >= 1.3.0 |

## 🚀 快速开始 {#getting-started}

- [快速上手](/docs/vue/getting-started-cn)：5 分钟跑通第一个例子
- [组件总览](/components/overview-cn)：浏览全部组件
- [更新日志](/components/changelog-cn)：版本发布记录
- [GitHub](https://github.com/antdv-next/antdv-next-pro)：源码与 Issue
