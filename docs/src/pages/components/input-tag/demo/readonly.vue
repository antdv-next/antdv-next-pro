<docs lang="zh-CN">
只读状态下保留标签展示，但禁止编辑、删除和清空操作。
</docs>

<docs lang="en-US">
Readonly mode keeps the tags visible while preventing editing, removal, and clearing.
</docs>

<template>
  <a-input-tag
    :default-value="['readonly', 'locked']"
    readonly
  />
</template>
