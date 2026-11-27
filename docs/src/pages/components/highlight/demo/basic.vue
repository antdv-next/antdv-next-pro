<docs lang="zh-CN">
最基础的用法，命中的关键词用 `<mark>` 包裹，未命中部分保持纯文本。
</docs>

<docs lang="en-US">
The most basic usage. Matched keywords are wrapped in `<mark>`, the rest stays plain text.
</docs>

<template>
  <a-highlight content="Free shipping on orders over $50." :keywords="['free', '$50']" />
</template>
