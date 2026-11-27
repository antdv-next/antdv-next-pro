---
category: Pro Components
title: Code
subtitle: 代码展示
description: 展示代码片段，支持行号、复制、Diff 行标记和可注入的语法高亮。
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## 何时使用 {#when-to-use}

- 在文档、示例里展示 Vue、TypeScript、JSON、SQL 等代码，需要行号和复制。
- 在业务详情里展示接口请求、响应、配置、脚本等文本。
- 在变更说明里标记新增、删除和未变化的行。

和相近组件的区别：

- 行内的一小段代码用 `Typography.Text` 的 `code`，Code 只做块级展示。
- AI 对话里的代码块用 antdv-next-x 的 `CodeHighlighter`。Code 面向通用文档和业务场景，多了 Diff 行标记、双列行号，并且不绑定具体的高亮库。

Code 是只读组件，输入只接受字符串，按文本渲染，源码里的 HTML 和脚本标签不会被解析。

## 语法高亮 {#syntax-highlighting}

Code 本身**不依赖任何高亮库**：纯文本和 Diff 不需要安装任何东西，`app.use(pro)` 之后直接用 `<a-code>`。

需要语法高亮时，由使用方注入一个高亮器。内置了基于 [Shiki](https://shiki.style) 的适配器，放在独立的子路径里，只有引入它的项目才需要安装 `shiki`：

```bash
pnpm add shiki
```

```ts
// highlighter.ts —— 在模块级创建一次，全应用共用
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'

export const highlighter = createShikiCodeHighlighter()
```

```vue
<script setup lang="ts">
import { highlighter } from './highlighter'
</script>

<template>
  <!-- 全局注入 -->
  <ap-config-provider :code="{ highlighter }">
    <a-code :content="source" language="ts" show-line-numbers copyable />
  </ap-config-provider>

  <!-- 或者只给单个实例 -->
  <a-code :content="source" language="ts" :highlighter="highlighter" />
</template>
```

- 高亮器在第一次需要高亮时才初始化，语言在第一次用到时才加载；加载期间先显示纯文本。
- 请复用同一个高亮器引用。写在渲染函数或 `computed` 里每次新建，会导致反复重新高亮。
- 设置了 `language` 却没有高亮器时，正常显示纯文本，开发环境会在控制台提示一次。
- 适配器使用 Shiki 的 JavaScript 正则引擎（不加载 WASM），主题固定为 `github-light` / `github-dark`。

内置语言：`javascript`、`typescript`、`jsx`、`tsx`、`vue`、`html`、`css`、`scss`、`json`、`markdown`、`bash`、`sql`、`yaml`、`python`。

内置别名：`js` / `mjs` / `cjs`、`ts` / `mts` / `cts`、`sh` / `shell` / `zsh`、`yml`、`md`、`py`。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/highlight.vue">语法高亮</demo>
  <demo src="./demo/line-numbers.vue">行号</demo>
  <demo src="./demo/word-wrap.vue">自动换行</demo>
  <demo src="./demo/copyable.vue">复制</demo>
  <demo src="./demo/diff.vue">Diff</demo>
  <demo src="./demo/theme.vue">明暗主题</demo>
  <demo src="./demo/extra.vue">头部扩展</demo>
  <demo src="./demo/custom-language.vue">扩展语言</demo>
  <demo src="./demo/custom-highlighter.vue">自定义高亮器</demo>
  <demo src="./demo/fallback.vue">失败回退</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 属性 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| content | 源码；`diff` 开启时是带行前缀的文本。只接受字符串，不解析 HTML | `string` | `''` | - | × |
| language | 语言名或别名，交给高亮器解释；`'text'` 表示纯文本 | `string` | `'text'` | - | × |
| diff | 按 Diff 行前缀解析 `content` | `boolean` | `false` | - | × |
| showLineNumbers | 显示行号，Diff 模式下显示旧、新两列 | `boolean` | `false` | - | ✓ |
| wordWrap | 自动换行 | `boolean` | `false` | - | ✓ |
| copyable | 复制按钮 | `boolean \| CodeCopyConfig` | `false` | - | ✓ |
| theme | 高亮配色，`auto` 跟随组件库主题 | `'auto' \| 'light' \| 'dark'` | `'auto'` | - | ✓ |
| highlighter | 语法高亮器，不提供时显示纯文本 | `CodeHighlighter` | - | - | ✓ |
| extra | 头部扩展区，优先级低于 `#extra` 插槽 | `VNodeChild \| ((info: CodeExtraInfo) => VNodeChild)` | - | - | × |
| classes | 自定义语义化 class，支持对象或函数 | `CodeClassNamesType` | - | - | ✓ |
| styles | 自定义语义化 style，支持对象或函数 | `CodeStylesType` | - | - | ✓ |

`class`、`style` 与 DOM 事件通过 attrs 透传到根节点。头部只在 `copyable` 为真或 `extra` 有内容时渲染。

```ts
interface CodeCopyConfig {
  /** 自定义复制文本，默认按组件的复制规则生成 */
  text?: string | (() => string | Promise<string>)
  /** 复制图标：[复制, 复制成功] */
  icon?: VNodeChild | [VNodeChild, VNodeChild]
  /** 提示文案：[复制, 复制成功]；false 时不显示 Tooltip */
  tooltips?: false | [VNodeChild, VNodeChild]
  tabIndex?: number
}

interface CodeExtraInfo {
  copy: () => Promise<void>
  copied: boolean
  language: string
}
```

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| highlight | 当前输入有了最终结果：高亮完成，或者确定回退为纯文本 | `(info: { language: string, highlighted: boolean }) => void` | - |
| error | Diff 解析、语言加载、分词或复制失败 | `(info: { stage: 'parse' \| 'load' \| 'highlight' \| 'copy', error: Error }) => void` | - |
| copy | 复制成功 | `(info: { text: string }) => void` | - |

事件只在客户端触发。过期的异步任务不更新界面，也不触发事件。

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| extra | 头部扩展区 | `(info: CodeExtraInfo) => any` | - |

不提供替换源码的默认插槽，保证高亮、行号、Diff 和复制用的是同一份输入。

### 实例 {#instance}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| copy | 按当前模式的复制规则复制。失败时触发 `error`，不会 reject | `() => Promise<void>` |
| nativeElement | 根节点 | `HTMLElement \| null` |

### CodeHighlighter {#code-highlighter}

Code 只依赖这个接口。除了内置的 Shiki 适配器，也可以自己实现它来接入 highlight.js、Prism 等。

```ts
interface CodeHighlighter {
  /** 同步检查：这个语言现在能不能直接分词 */
  hasLanguage: (language: string) => boolean
  /**
   * 加载语言（包含高亮器自身的初始化）。
   * resolve(false)：不支持这个语言，回退纯文本，不算错误；
   * reject：加载失败，回退纯文本并触发 error({ stage: 'load' })，之后可以重试。
   */
  loadLanguage: (language: string) => Promise<boolean>
  /** 同步分词，按行返回 */
  tokenize: (code: string, language: string) => CodeToken[][]
}

interface CodeToken {
  content: string
  /** 亮色主题下的颜色 */
  color?: string
  /** 暗色主题下的颜色，不提供时用 color */
  darkColor?: string
  italic?: boolean
  bold?: boolean
  underline?: boolean
}
```

- `hasLanguage` 为真时组件同步分词并提交，内容频繁变化（流式输出）时不会闪一帧纯文本。
- `tokenize` 收到的 `code` 用 `\n` 连接各行。返回的行数必须和源码一致，每行 token 的 `content` 拼起来必须等于该行源码；对不上就放弃这次高亮，回退纯文本并触发 `error({ stage: 'highlight' })`。
- 单例、加载去重和失败重试由高亮器自己负责；组件只负责任务版本，保证只提交最新输入的结果。

### createShikiCodeHighlighter {#create-shiki-code-highlighter}

从 `@antdv-next/pro/code/shiki` 导出，需要安装 `shiki`。

```ts
function createShikiCodeHighlighter(options?: ShikiCodeHighlighterOptions): CodeHighlighter

interface ShikiCodeHighlighterOptions {
  /** 追加或覆盖内置语言，键是语言名（小写） */
  langs?: Record<string, () => Promise<unknown>>
  /** 追加别名，键是别名（小写），值是语言名 */
  aliases?: Record<string, string>
}
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| langs | 追加或覆盖内置语言。加载器返回 Shiki 的语言模块，例如 `() => import('shiki/langs/toml.mjs')` | `Record<string, () => Promise<unknown>>` | - |
| aliases | 追加别名 | `Record<string, string>` | - |

每次调用返回一个独立的高亮器，各自持有一个懒创建的 Shiki 实例：同一语言并发请求只加载一次，加载失败后可以重试。

## Diff 规则 {#diff-rules}

开启 `diff` 后，每行的第一个字符是状态标记，其余部分是源码：

| 行首字符 | 状态 | 旧行号 | 新行号 |
| --- | --- | --- | --- |
| `+` | 新增 | 留空 | 递增 |
| `-` | 删除 | 递增 | 留空 |
| 空格 | 未变化 | 递增 | 递增 |

- 每行只去掉第一个字符，其余缩进和内容原样保留。源码本身以 `+` / `-` 开头时照样加标记：`++value` 是新增的 `+value`，` -value` 是未变化的 `-value`。
- 空行也要带标记：新增空行写 `+`，删除空行写 `-`，未变化的空行写一个空格。
- 输入末尾的换行符不会多出一条空行。空字符串合法，表示没有内容。
- 只要有一行不合法（裸空行，或首字符不是这三种），**整段**回退为原始纯文本，并触发 `error({ stage: 'parse' })`，不做部分解析。
- 高亮时把“未变化 + 删除”拼成旧文本、“未变化 + 新增”拼成新文本，各自整段分词：删除行用旧文本的 token，新增行和未变化行用新文本的 token。多行注释、模板字符串这类跨行语法状态不会断。
- Diff 表达的是调用方给出的增删状态，组件不比较两份文本，也不解析 Git patch 的文件头和 `@@` 区块。

## 复制规则 {#copy-rules}

- 普通模式（以及 Diff 解析失败回退为纯文本时）：原样复制 `content`。
- Diff 模式：只保留未变化行和新增行的源码，用 `\n` 连接；原文以换行结尾的，结果也以换行结尾。
- 复制文本从行数据生成，不读 DOM；行号、`+` / `-` 标记不会被复制，手动选择文本时它们也不可选。
- `copyable.text` 可以完全替换复制内容。

## 无障碍 {#accessibility}

- 行号和 `+` / `-` 标记对辅助技术隐藏。增删状态通过视觉隐藏的文本（来自 locale 的 `Code.added` / `Code.removed`）提供给读屏器，不只靠颜色和符号。
- 复制按钮是真实的按钮，`aria-label` 取自 antdv-next locale 的 `Text.copy` / `Text.copied`。
- 代码区域可以聚焦，长行可以用键盘横向滚动。
- RTL 下头部布局会镜像；代码区域固定从左到右，行号留在左侧。

## 服务端渲染 {#ssr}

服务端和客户端首帧渲染同样的纯文本行结构，Diff 解析是同步的。语法高亮在客户端挂载之后才开始，不会造成 hydration 不一致，服务端也不会调用高亮器。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`header` 只在有内容时渲染，`lineNumber` 只在 `showLineNumbers` 开启时渲染，`marker` 只在 Diff 模式下渲染。新增行和删除行是行的状态，用状态类名 `ant-code-line-added` / `ant-code-line-removed` 表示。

## 主题 Token {#design-tokens}

Code 支持通过 `theme.components.Code` 自定义组件样式 Token，默认值全部从全局 Token 派生。语法 token 的颜色由高亮器给出，不在这里配置。

<ComponentTokenTable component="Code" />
