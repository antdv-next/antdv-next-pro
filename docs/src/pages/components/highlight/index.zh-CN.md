---
category: Pro Components
title: Highlight
subtitle: 文本高亮
description: 在纯文本中高亮关键词。
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## 何时使用 {#when-to-use}

- 搜索结果、表格筛选、日志检索等需要高亮**部分**文字的场景。
- 替代业务里手写的 `split` + `v-html`：组件只渲染文本节点，没有 XSS 风险，SSR 前后端输出一致。

和 `Typography.Text` 的 `mark` 的区别：`mark` 把整段文字包成一个 `<mark>`，`Highlight` 只包住命中关键词的部分。默认外观和 `mark` 一致。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/multiple.vue">多个关键词</demo>
  <demo src="./demo/case-sensitive.vue">区分大小写</demo>
  <demo src="./demo/regexp.vue">正则表达式</demo>
  <demo src="./demo/custom-render.vue">自定义渲染</demo>
  <demo src="./demo/custom-tag.vue">自定义标签</demo>
  <demo src="./demo/theme.vue">主题定制</demo>
  <demo src="./demo/find-chunks.vue">自定义区间查找</demo>
  <demo src="./demo/table-filter.vue">搭配 Table 与 Select</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 属性 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| content | 原文本，只接受纯字符串，不解析 HTML | `string` | `''` | - | × |
| keywords | 关键词。字符串按字面量匹配，`RegExp` 按自身 flags 匹配，空串会被忽略 | `string \| RegExp \| (string \| RegExp)[]` | - | - | × |
| caseSensitive | 是否区分大小写，只作用于字符串关键词 | `boolean` | `false` | - | ✓ |
| highlightTag | 命中节点使用的标签或组件 | `string \| Component` | `'mark'` | - | ✓ |
| highlightRender | 自定义命中内容，渲染在 `highlightTag` 内部，优先级低于 `#highlight` 插槽 | `(info: HighlightRenderInfo) => VueNode` | - | - | × |
| findChunks | 自定义区间查找，替代内置扫描 | `(params: { content, keywords, caseSensitive }) => HighlightRange[]` | - | - | × |
| classes | 自定义语义化 class，支持对象或函数 | `HighlightClassNamesType` | - | - | ✓ |
| styles | 自定义语义化 style，支持对象或函数 | `HighlightStylesType` | - | - | ✓ |

`class`、`style` 与 DOM 事件通过 attrs 透传到根节点。

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| highlight | 自定义命中内容，渲染在 `highlightTag` 内部；返回空内容时回退为命中的原文本 | `(info: HighlightRenderInfo) => any` | - |

```ts
interface HighlightRenderInfo {
  /** 命中的文本 */
  text: string
  /** 第几个命中片段，从 0 开始 */
  index: number
  start: number
  end: number
  /** 命中的关键词（调用方传入的原值） */
  keyword?: string | RegExp
}
```

### 实例 {#instance}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 根节点 | `HTMLElement \| null` |

### getHighlightChunks {#get-highlight-chunks}

不依赖 Vue 的分词函数，从 `@antdv-next/pro` 和 `@antdv-next/pro/highlight` 导出，适合 Table 筛选、Select `optionRender` 等需要自己拼装结构的场景。

```ts
function getHighlightChunks(
  content: string,
  keywords?: string | RegExp | (string | RegExp)[],
  options?: { caseSensitive?: boolean, findChunks?: HighlightFindChunks },
): HighlightChunk[]

interface HighlightChunk {
  text: string
  start: number
  end: number
  highlight: boolean
  /** 只有命中片段才有 */
  index?: number
  keyword?: string | RegExp
}
```

## 匹配规则 {#matching-rules}

- 每个关键词各扫一遍；同一起点优先命中更长的关键词。
- **重叠**的命中合并成一段（`['abc', 'bcde']` 在 `abcdef` 中命中 `abcde`），`keyword` 取起点最靠前的那个；**相邻**的命中不合并（`ReactVue` 是两段）。
- `index` 表示第几个命中片段，从 0 开始，重叠合并后算一个。
- 所有片段的 `text` 拼起来严格等于 `content`；`content` 为空时不输出任何片段。
- 字符串关键词会去掉空串和重复项；`caseSensitive` 为 `false` 时按小写去重。
- `RegExp` 关键词保留自身 flags（自动补 `g`、去掉 `y`），不会修改传入对象的 `lastIndex`；零宽匹配会被跳过。
- `findChunks` 返回的区间左闭右开 `[start, end)`，同样会被清洗（丢掉非有限数、裁剪越界、丢掉空区间）并合并。接入 Fuse.js 等返回闭区间的库时，`end` 要加 1。

## 安全与无障碍 {#security-and-a11y}

- 组件只渲染文本节点，`content` 中的 HTML 会按原样显示为文字，不会被解析。
- 不是所有读屏器都会播报 `<mark>`。如果高亮本身带有业务含义（比如“搜索命中”），可以通过 `highlightRender` / `#highlight` 补充视觉隐藏文本，或者用 `highlightTag` 换成带 `aria-*` 的组件。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

DOM 结构固定为 `span.ant-highlight > (文本 | mark.ant-highlight-highlight)*`，未命中的文字是裸文本节点，样式可以写在 `root` 上。

## 主题 Token {#design-tokens}

Highlight 支持通过 `theme.components.Highlight` 自定义组件样式 Token，默认值全部从全局 Token 派生。

<ComponentTokenTable component="Highlight" />
