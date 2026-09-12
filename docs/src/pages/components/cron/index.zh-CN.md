---
category: Pro Components
title: Cron
subtitle: Cron 表达式编辑器
description: 用于编辑 Quartz / Unix Cron 表达式的面板组件。
demo:
  cols: 1
group:
  title: 数据录入
  order: 1
---

## 何时使用 {#when-to-use}

- 配置定时任务、报表、数据同步或消息推送。
- 希望用户以可视化方式编辑 Quartz 或 Unix 表达式，而不必记住完整语法。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/format.vue">Cron 格式</demo>
  <demo src="./demo/dropdown.vue">下拉模式</demo>
  <demo src="./demo/form.vue">表单校验</demo>
  <demo src="./demo/presets.vue">Preset 和预览</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性

| 参数 | 说明 | 类型 | 默认值 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- |
| value | 受控的 Cron 表达式 | `string` | - | - |
| format | Cron 方言 | `'quartz' \| 'unix'` | `'quartz'` | ✓ |
| showYear | 使用七字段 Quartz 格式 | `boolean` | `false` | ✓ |
| disabled | 禁用全部交互 | `boolean` | `false` | ✓ |
| readonly | 可选择和复制表达式，但不能编辑 | `boolean` | `false` | ✓ |
| size | 组件尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` | ✓ |
| status | 手动设置校验状态，默认跟随 Form.Item | `'' \| 'error' \| 'success' \| 'validating' \| 'warning'` | - | - |
| preview | 展示说明和本地时区的未来执行时间 | `boolean` | `false` | ✓ |
| presets | 常用表达式快捷项 | `CronPreset[]` | `[]` | ✓ |
| classes | 语义化 class 定制 | `CronClassNamesType` | - | ✓ |
| styles | 语义化 style 定制 | `CronStylesType` | - | ✓ |

### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 输入有效表达式或从非法草稿恢复为有效表达式时触发；相同的有效值不会重复触发 | `(value: string) => void` |
| input | 每次直接输入时触发，包括临时非法值 | `(value: string) => void` |
| validate | 每次执行表达式校验后触发，并同步当前校验结果 | `(result: CronValidateResult) => void` |

### CronError

`validateCronExpression()` 和 `validate` 事件在表达式非法时返回 `errors`。请用 `code` 判断错误类型，不要依赖 `message` 文案。

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| field | 出错字段；整条表达式的错误为空 | `CronFieldName` |
| code | 稳定错误码，不随 locale 变化 | `CronErrorCode` |
| message | 本地化说明 | `string` |

### Form.Item

`v-model:value` 与输入框内容一致，Form.Item 可以校验正在编辑的值。格式用 `validateCronExpression` 检查，必填仍由 Form.Item 负责。校验 Unix 表达式时传入 `{ format: 'unix' }`。

```vue
<script setup lang="ts">
import { validateCronExpression } from '@antdv-next/pro'

const rules = [
  { required: true, message: '请输入 Cron 表达式' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && validateCronExpression(value).status !== 'valid')
        throw new Error('Cron 表达式不合法')
    },
  },
]
</script>

<template>
  <a-form-item name="cron" :rules="rules">
    <a-cron v-model:value="form.cron" />
  </a-form-item>
</template>
```

### 插槽

| 插槽 | 说明 |
| --- | --- |
| field | 替换当前字段编辑器 |
| presets | 替换预设区域 |
| preview | 替换预览区域 |
| error | 替换校验错误内容 |

## Cron 格式

默认 `format` 为 `quartz`。Quartz 使用六个字段：`second minute hour day month week`。开启 `showYear` 后必须提供第七个 `year` 字段。日和周必须恰好一个为 `?`。

Unix 格式使用五个字段：`minute hour day month week`。没有秒、年，也不支持 `?`。日和周可以同时指定，语义为 OR。Unix 星期日可用 `0`、`7` 或 `SUN`。直接输入会保留原值；在可视化编辑器中修改指定星期后，会规范化为 `SUN`。

校验 Unix 表达式时请使用 `validateCronExpression(value, { format: 'unix' })`。

## 特殊语法

Quartz 的日/周字段支持 Croner 已实现的特殊语法：

| 语法 | 字段 | 含义 |
| --- | --- | --- |
| `L` | 日 | 每月最后一天 |
| `nW` | 日 | 最接近 n 日的工作日 |
| `LW` | 日 | 每月最后一个工作日 |
| `nL` | 周 | 每月最后一个星期 n |
| `n#N` | 周 | 每月第 N 个星期 n |

不支持 `L-n`。Unix 格式不接受这些标记。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题 Token {#design-tokens}

Cron 支持通过 `theme.components.Cron` 自定义组件样式 Token：

<ComponentTokenTable component="Cron" />
