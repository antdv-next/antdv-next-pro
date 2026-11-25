---
category: Pro Components
title: Highlight
description: Highlight keywords inside plain text.
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## When To Use {#when-to-use}

- Search results, table filters, log search, and other places where **part** of a text should be highlighted.
- Replace hand-written `split` + `v-html` code: the component renders text nodes only, so there is no XSS risk, and the server and client output match.

Compared with the `mark` prop of `Typography.Text`: `mark` wraps the whole text in one `<mark>`, while `Highlight` wraps only the matched parts. The default look is the same as `mark`.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/multiple.vue">Multiple keywords</demo>
  <demo src="./demo/case-sensitive.vue">Case sensitive</demo>
  <demo src="./demo/regexp.vue">Regular expressions</demo>
  <demo src="./demo/custom-render.vue">Custom render</demo>
  <demo src="./demo/custom-tag.vue">Custom tag</demo>
  <demo src="./demo/theme.vue">Theme</demo>
  <demo src="./demo/find-chunks.vue">Custom range finder</demo>
  <demo src="./demo/table-filter.vue">With Table and Select</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API {#api}

### Properties {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Prefix of the component class | `string` | - | - | × |
| rootClass | Class of the root element | `string` | - | - | × |
| content | Source text. Plain strings only, HTML is never parsed | `string` | `''` | - | × |
| keywords | Keywords. Strings are matched literally, a `RegExp` is matched with its own flags, empty strings are ignored | `string \| RegExp \| (string \| RegExp)[]` | - | - | × |
| caseSensitive | Whether matching is case sensitive. Only applies to string keywords | `boolean` | `false` | - | ✓ |
| highlightTag | Tag or component used for highlighted chunks | `string \| Component` | `'mark'` | - | ✓ |
| highlightRender | Custom hit content, rendered inside `highlightTag`. The `#highlight` slot takes precedence | `(info: HighlightRenderInfo) => VueNode` | - | - | × |
| findChunks | Custom range finder that replaces the built-in scan | `(params: { content, keywords, caseSensitive }) => HighlightRange[]` | - | - | × |
| classes | Semantic class names, as an object or a function | `HighlightClassNamesType` | - | - | ✓ |
| styles | Semantic styles, as an object or a function | `HighlightStylesType` | - | - | ✓ |

`class`, `style`, and DOM events are passed to the root element through attrs.

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| highlight | Custom hit content, rendered inside `highlightTag`. Falls back to the matched text when it renders nothing | `(info: HighlightRenderInfo) => any` | - |

```ts
interface HighlightRenderInfo {
  /** Matched text */
  text: string
  /** Zero-based index of the highlighted chunk */
  index: number
  start: number
  end: number
  /** Matched keyword (the value passed by the caller) */
  keyword?: string | RegExp
}
```

### Instance {#instance}

| Name | Description | Type |
| --- | --- | --- |
| nativeElement | Root element | `HTMLElement \| null` |

### getHighlightChunks {#get-highlight-chunks}

A tokenizer with no Vue dependency, exported from `@antdv-next/pro` and `@antdv-next/pro/highlight`. Use it where you build your own markup, such as table filters or Select `optionRender`.

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
  /** Only on highlighted chunks */
  index?: number
  keyword?: string | RegExp
}
```

## Matching Rules {#matching-rules}

- Each keyword is scanned on its own. At the same start the longer keyword wins.
- **Overlapping** hits are merged into one chunk (`['abc', 'bcde']` on `abcdef` gives `abcde`), keeping the keyword of the earliest hit. **Adjacent** hits are not merged (`ReactVue` gives two chunks).
- `index` is the zero-based number of the highlighted chunk; merged overlaps count as one.
- The `text` of all chunks joined is exactly `content`. Empty `content` gives no chunks.
- Empty and duplicate string keywords are dropped; with `caseSensitive: false` duplicates are compared in lower case.
- A `RegExp` keyword keeps its own flags (`g` is added and `y` removed), and the `lastIndex` of the object you pass is never changed. Zero-width matches are skipped.
- Ranges returned by `findChunks` are half-open `[start, end)` and are sanitized (non-finite values dropped, out-of-range values clamped, empty ranges dropped) and merged the same way. Libraries such as Fuse.js return inclusive ranges, so add 1 to `end`.

## Security and Accessibility {#security-and-a11y}

- The component renders text nodes only. HTML inside `content` is shown as text and is never parsed.
- Not every screen reader announces `<mark>`. If the highlight carries meaning (for example "search match"), add visually hidden text through `highlightRender` / `#highlight`, or use `highlightTag` with a component that sets `aria-*`.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

The DOM is always `span.ant-highlight > (text | mark.ant-highlight-highlight)*`. Unmatched text is a bare text node, so style it through `root`.

## Design Token {#design-tokens}

Highlight supports component tokens through `theme.components.Highlight`. All defaults are derived from global tokens.

<ComponentTokenTable component="Highlight" />
