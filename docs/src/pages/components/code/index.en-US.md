---
category: Pro Components
title: Code
description: Display code snippets with line numbers, copy, diff line markers and injectable syntax highlighting.
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## When To Use {#when-to-use}

- Show Vue, TypeScript, JSON, SQL and other code in docs and examples, with line numbers and copy.
- Show API requests, responses, configuration or scripts in business detail pages.
- Mark added, removed and unchanged lines in change notes.

How it differs from similar components:

- For a short piece of inline code use `code` of `Typography.Text`; Code is block level only.
- For code blocks in AI conversations use `CodeHighlighter` from antdv-next-x. Code targets general docs and business scenarios, adds diff line markers and two-column line numbers, and is not tied to a specific highlighting library.

Code is read-only. It only accepts a string and renders it as text; HTML and script tags in the source are never parsed.

## Syntax Highlighting {#syntax-highlighting}

Code itself **does not depend on any highlighting library**: plain text and diff need nothing installed, and `<a-code>` works right after `app.use(pro)`.

For syntax highlighting, the application injects a highlighter. A [Shiki](https://shiki.style) based adapter is built in under a separate subpath, so only projects that import it need to install `shiki`:

```bash
pnpm add shiki
```

```ts
// highlighter.ts — create it once at module level and share it across the app
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'

export const highlighter = createShikiCodeHighlighter()
```

```vue
<script setup lang="ts">
import { highlighter } from './highlighter'
</script>

<template>
  <!-- inject globally -->
  <ap-config-provider :code="{ highlighter }">
    <a-code :content="source" language="ts" show-line-numbers copyable />
  </ap-config-provider>

  <!-- or pass it to a single instance -->
  <a-code :content="source" language="ts" :highlighter="highlighter" />
</template>
```

- The highlighter is initialized the first time highlighting is needed, and a language is loaded the first time it is used; plain text is shown while loading.
- Reuse the same highlighter reference. Creating a new one in a render function or a `computed` causes repeated highlighting.
- When `language` is set but there is no highlighter, plain text is shown and a warning is printed once in development.
- The adapter uses Shiki's JavaScript regex engine (no WASM) with the `github-light` / `github-dark` themes.

Built-in languages: `javascript`, `typescript`, `jsx`, `tsx`, `vue`, `html`, `css`, `scss`, `json`, `markdown`, `bash`, `sql`, `yaml`, `python`.

Built-in aliases: `js` / `mjs` / `cjs`, `ts` / `mts` / `cts`, `sh` / `shell` / `zsh`, `yml`, `md`, `py`.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/highlight.vue">Syntax highlighting</demo>
  <demo src="./demo/line-numbers.vue">Line numbers</demo>
  <demo src="./demo/word-wrap.vue">Word wrap</demo>
  <demo src="./demo/copyable.vue">Copy</demo>
  <demo src="./demo/diff.vue">Diff</demo>
  <demo src="./demo/theme.vue">Light and dark</demo>
  <demo src="./demo/extra.vue">Header extra</demo>
  <demo src="./demo/custom-language.vue">More languages</demo>
  <demo src="./demo/custom-highlighter.vue">Custom highlighter</demo>
  <demo src="./demo/fallback.vue">Fallback</demo>
  <demo src="./demo/semantic.vue">Semantic styles</demo>
</demo-group>

## API {#api}

### Props {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Prefix of the component class names | `string` | - | - | × |
| rootClass | Class name of the root element | `string` | - | - | × |
| content | Source code; text with line prefixes when `diff` is on. String only, HTML is not parsed | `string` | `''` | - | × |
| language | Language name or alias, interpreted by the highlighter; `'text'` means plain text | `string` | `'text'` | - | × |
| diff | Parse `content` with diff line prefixes | `boolean` | `false` | - | × |
| showLineNumbers | Show line numbers; two columns (old and new) in diff mode | `boolean` | `false` | - | ✓ |
| wordWrap | Wrap long lines | `boolean` | `false` | - | ✓ |
| copyable | Copy button | `boolean \| CodeCopyConfig` | `false` | - | ✓ |
| theme | Highlight color scheme; `auto` follows the theme of the component library | `'auto' \| 'light' \| 'dark'` | `'auto'` | - | ✓ |
| highlighter | Syntax highlighter; plain text is shown without one | `CodeHighlighter` | - | - | ✓ |
| extra | Header extra area, lower priority than the `#extra` slot | `VNodeChild \| ((info: CodeExtraInfo) => VNodeChild)` | - | - | × |
| classes | Semantic class names, as an object or a function | `CodeClassNamesType` | - | - | ✓ |
| styles | Semantic styles, as an object or a function | `CodeStylesType` | - | - | ✓ |

`class`, `style` and DOM events are passed to the root element through attrs. The header is rendered only when `copyable` is truthy or `extra` has content.

```ts
interface CodeCopyConfig {
  /** Custom text to copy; generated by the copy rules by default */
  text?: string | (() => string | Promise<string>)
  /** Copy icons: [copy, copied] */
  icon?: VNodeChild | [VNodeChild, VNodeChild]
  /** Tooltips: [copy, copied]; false hides the tooltip */
  tooltips?: false | [VNodeChild, VNodeChild]
  tabIndex?: number
}

interface CodeExtraInfo {
  copy: () => Promise<void>
  copied: boolean
  language: string
}
```

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| highlight | The current input has a final result: highlighted, or definitely falling back to plain text | `(info: { language: string, highlighted: boolean }) => void` | - |
| error | Diff parsing, language loading, tokenizing or copying failed | `(info: { stage: 'parse' \| 'load' \| 'highlight' \| 'copy', error: Error }) => void` | - |
| copy | Copied successfully | `(info: { text: string }) => void` | - |

Events are emitted on the client only. Outdated async tasks neither update the view nor emit events.

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| extra | Header extra area | `(info: CodeExtraInfo) => any` | - |

There is no default slot to replace the source, so highlighting, line numbers, diff and copy always use the same input.

### Instance {#instance}

| Name | Description | Type |
| --- | --- | --- |
| copy | Copy with the rules of the current mode. Emits `error` on failure and never rejects | `() => Promise<void>` |
| nativeElement | Root element | `HTMLElement \| null` |

### CodeHighlighter {#code-highlighter}

Code only depends on this interface. Besides the built-in Shiki adapter, you can implement it yourself to plug in highlight.js, Prism and so on.

```ts
interface CodeHighlighter {
  /** Synchronous check: whether the language can be tokenized right now */
  hasLanguage: (language: string) => boolean
  /**
   * Load a language (including the initialization of the highlighter itself).
   * resolve(false): unsupported language; falls back to plain text without an error;
   * reject: loading failed; falls back to plain text and emits error({ stage: 'load' }). It can be retried later.
   */
  loadLanguage: (language: string) => Promise<boolean>
  /** Tokenize synchronously and return tokens line by line */
  tokenize: (code: string, language: string) => CodeToken[][]
}

interface CodeToken {
  content: string
  /** Color in the light scheme */
  color?: string
  /** Color in the dark scheme, falls back to color */
  darkColor?: string
  italic?: boolean
  bold?: boolean
  underline?: boolean
}
```

- When `hasLanguage` is true the component tokenizes and commits synchronously, so frequently changing content (streaming output) never flashes a frame of plain text.
- The `code` passed to `tokenize` joins lines with `\n`. The returned line count must match the source and the `content` of the tokens in each line must concatenate to the source of that line; otherwise the result is discarded, plain text is shown and `error({ stage: 'highlight' })` is emitted.
- Singletons, load de-duplication and retries are the highlighter's responsibility; the component only versions tasks so that only the result of the latest input is committed.

### createShikiCodeHighlighter {#create-shiki-code-highlighter}

Exported from `@antdv-next/pro/code/shiki`. Requires `shiki`.

```ts
function createShikiCodeHighlighter(options?: ShikiCodeHighlighterOptions): CodeHighlighter

interface ShikiCodeHighlighterOptions {
  /** Add or override built-in languages; keys are (lowercase) language names */
  langs?: Record<string, () => Promise<unknown>>
  /** Extra aliases; keys are (lowercase) aliases, values are language names */
  aliases?: Record<string, string>
}
```

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| langs | Add or override built-in languages. A loader returns a Shiki language module, e.g. `() => import('shiki/langs/toml.mjs')` | `Record<string, () => Promise<unknown>>` | - |
| aliases | Extra aliases | `Record<string, string>` | - |

Every call returns an independent highlighter that owns a lazily created Shiki instance: concurrent requests for the same language load it once, and a failed load can be retried.

## Diff Rules {#diff-rules}

With `diff`, the first character of every line is a state marker and the rest is source code:

| First character | State | Old line number | New line number |
| --- | --- | --- | --- |
| `+` | Added | Empty | Incremented |
| `-` | Removed | Incremented | Empty |
| Space | Unchanged | Incremented | Incremented |

- Only the first character of each line is removed; the remaining indentation and content are kept as is. Source that itself starts with `+` / `-` still needs a marker: `++value` is an added `+value`, and ` -value` is an unchanged `-value`.
- Blank lines need markers too: `+` for an added blank line, `-` for a removed one, and a single space for an unchanged one.
- A trailing line break does not produce an extra empty line. An empty string is valid and means no content.
- If any line is invalid (a bare empty line, or a first character other than these three), the **whole** content falls back to the raw plain text and `error({ stage: 'parse' })` is emitted. There is no partial parsing.
- For highlighting, "unchanged + removed" lines form the old text and "unchanged + added" lines form the new text, each tokenized as a whole: removed lines use tokens from the old text, added and unchanged lines use tokens from the new text. Multi-line syntax states such as block comments and template strings stay intact.
- Diff expresses the states given by the caller. The component does not compare two texts, nor parse Git patch headers or `@@` hunks.

## Copy Rules {#copy-rules}

- Plain mode (and when an invalid diff falls back to plain text): `content` is copied as is.
- Diff mode: only the source of unchanged and added lines is kept, joined with `\n`; if the input ends with a line break, so does the result.
- The copied text is generated from line data, not read from the DOM; line numbers and `+` / `-` markers are never copied and cannot be selected manually either.
- `copyable.text` replaces the copied text entirely.

## Accessibility {#accessibility}

- Line numbers and `+` / `-` markers are hidden from assistive technology. The diff state is exposed to screen readers through visually hidden text (`Code.added` / `Code.removed` from the locale), not only through color and symbols.
- The copy button is a real button whose `aria-label` comes from `Text.copy` / `Text.copied` of the antdv-next locale.
- The code area is focusable, so long lines can be scrolled horizontally with the keyboard.
- In RTL the header layout is mirrored; the code area stays left to right with line numbers on the left.

## Server-Side Rendering {#ssr}

The server and the first client frame render the same plain text line structure, and diff parsing is synchronous. Syntax highlighting starts only after the client has mounted, so it never causes hydration mismatches and the highlighter is never called on the server.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`header` is rendered only when it has content, `lineNumber` only when `showLineNumbers` is on, and `marker` only in diff mode. Added and removed are states of a line, expressed with the state classes `ant-code-line-added` / `ant-code-line-removed`.

## Design Token {#design-tokens}

Code supports customizing component tokens through `theme.components.Code`. All defaults are derived from global tokens. Colors of syntax tokens come from the highlighter and are not configured here.

<ComponentTokenTable component="Code" />
