<docs lang="zh-CN">
数据结构不同时，用 `fieldNames` 映射 `label`、`value`、`children` 和分组的 `options` 字段。
</docs>

<docs lang="en-US">
Map `label`, `value`, `children` and the group `options` fields with `fieldNames` when your data has a different shape.
</docs>

<script setup lang="ts">
const fieldNames = { label: 'title', value: 'id', children: 'items', options: 'list' }

const options = [
  {
    title: 'Department',
    list: [
      {
        title: 'Team',
        id: 'team',
        items: [
          { title: 'Design', id: 1 },
          { title: 'Frontend', id: 2 },
          { title: 'Backend', id: 3 },
        ],
      },
    ],
  },
  { title: 'Member', id: 'member', type: 'input' },
]
</script>

<template>
  <a-category-search :options="options" :field-names="fieldNames" :default-value="[{ key: 'team', value: 2 }]" />
</template>
