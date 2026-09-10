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

## 何时使用

- 配置定时任务、报表、数据同步或消息推送。
- 希望用户以可视化方式编辑 Quartz 或 Unix 表达式，而不必记住完整语法。

## 代码演示

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/format.vue">Cron 格式</demo>
  <demo src="./demo/special.vue">特殊语法</demo>
  <demo src="./demo/form.vue">表单校验</demo>
  <demo src="./demo/presets.vue">Preset 和预览</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API

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
| update:value | 表达式内容变化时触发，包括临时非法值和空值 | `(value: string) => void` |
| change | 输入有效表达式或从非法草稿恢复为有效表达式时触发；相同的有效值不会重复触发 | `(value: string) => void` |
| input | 每次直接输入时触发，包括临时非法值 | `(value: string) => void` |
| validate | 每次执行表达式校验后触发，并同步当前校验结果 | `(result: CronValidateResult) => void` |

### Form.Item

`v-model:value` 始终与输入框中显示的内容保持一致，因此 Form.Item 的 validator 可以获取临时非法值。Cron 负责 Quartz 语法反馈；`required` 和业务规则仍由 Form.Item 管理：

直接输入会保留用户正在编辑的原文，校验和字段解析使用规范化后的表达式。`size` 与 Antdv Next 一致，取 `'small' | 'medium' | 'large'`，默认 `'medium'`。

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

## Cron 格式

默认 `format` 为 `quartz`。Quartz 使用六个字段：`second minute hour day month week`。开启 `showYear` 后必须提供第七个 `year` 字段。日和周必须恰好一个为 `?`。

Unix 格式使用五个字段：`minute hour day month week`。没有秒、年，也不支持 `?`。日和周可以同时指定，语义为 OR。

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

## 国际化

Cron 与 DatePicker 一样读取 `ConfigProvider` 的 locale，无需单独设置语言属性。Antdv Next 提供的 72 个语言入口均有对应的 Pro locale 包装器并包含 Cron 文案。使用 Pro locale 包装器可同时配置 Antdv Next 与 Cron；dayjs 的语言包仍需由应用显式引入：

```vue
<script setup lang="ts">
import zhCN from '@antdv-next/pro/locale/zh_CN'
import 'dayjs/locale/zh-cn'
</script>

<template>
  <ap-config-provider :locale="zhCN">
    <a-cron v-model:value="value" preview />
  </ap-config-provider>
</template>
```

表达式有效时，输入框下方会显示人类可读描述。开启 `preview` 后，面板底部默认展示未来 3 次执行时间。预览时间使用 dayjs 实例级 locale，并复用 `locale.DatePicker.lang.fieldDateTimeFormat`；组件不会修改全局 `dayjs.locale()`。若直接传入不含 `Cron` 文案的 Antdv Next 原始语言包，Cron 界面会回退为英文。

## 语义化 DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题 Token

通过 `theme.components.Cron` 定制组件 Token：

<ComponentTokenTable component="Cron" />
