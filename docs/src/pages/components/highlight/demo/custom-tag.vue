<docs lang="zh-CN">
通过 `highlightTag` 更换命中节点的标签，也可以传入组件，命中内容会作为组件的默认插槽。
</docs>

<docs lang="en-US">
Change the hit element with `highlightTag`. A component also works; the hit content is passed as its default slot.
</docs>

<script setup lang="ts">
import { Tag } from 'antdv-next'
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight content="Use strong for important matches." keywords="strong" highlight-tag="strong" />
    <a-highlight
      content="Status: running, stopped, running."
      keywords="running"
      :highlight-tag="Tag"
      :styles="{ highlight: { marginInlineEnd: 0 } }"
    />
  </a-flex>
</template>
