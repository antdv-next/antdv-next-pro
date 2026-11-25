<docs lang="zh-CN">
传入多个关键词。同一起点优先命中更长的关键词，重叠的命中合并为一段，相邻的命中仍然各自成段。
</docs>

<docs lang="en-US">
Pass several keywords. At the same start the longer keyword wins, overlapping hits are merged into one chunk, and adjacent hits stay separate.
</docs>

<template>
  <a-flex vertical gap="small">
    <a-highlight content="antdv-next-pro is built on antdv-next." :keywords="['antdv', 'antdv-next']" />
    <a-highlight content="abcdef" :keywords="['abc', 'bcde']" />
    <a-highlight content="ReactVue" :keywords="['React', 'Vue']" />
  </a-flex>
</template>
