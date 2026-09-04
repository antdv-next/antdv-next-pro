<docs lang="zh-CN">
只读状态下保留标签展示，但禁止编辑、删除和清空操作；同时演示语义化 class 的使用。
</docs>

<docs lang="en-US">
Readonly mode keeps the tags visible while preventing editing, removal, and clearing. This demo also shows semantic class usage.
</docs>

<template>
  <a-input-tag
    :default-value="['readonly', 'semantic']"
    readonly
    :classes="{ root: 'demo-input-tag' }"
  />
</template>
