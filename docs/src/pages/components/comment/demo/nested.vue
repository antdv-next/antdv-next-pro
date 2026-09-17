<docs lang="zh-CN">
子评论放入默认插槽即可嵌套。
</docs>

<docs lang="en-US">
Put child comments in the default slot to nest them.
</docs>

<script setup lang="ts">
const avatar = (seed: string) => `https://api.dicebear.com/7.x/miniavs/svg?seed=${seed}`
</script>

<template>
  <a-comment
    author="Zhang San"
    :avatar="avatar('ZhangSan')"
    datetime="5 minutes ago"
    content="We supply a series of design principles, practical patterns and high quality design resources."
  >
    <a-comment
      author="Li Si"
      :avatar="avatar('LiSi')"
      datetime="3 minutes ago"
      content="Keeping the discussion attached to the comment it refers to makes a long thread much easier to follow."
    >
      <a-comment
        author="Wang Wu"
        :avatar="avatar('WangWu')"
        datetime="1 minute ago"
        content="Three levels is usually enough — beyond that the indentation eats too much horizontal space."
      />
    </a-comment>
    <a-comment
      author="Zhao Liu"
      :avatar="avatar('ZhaoLiu')"
      datetime="2 minutes ago"
      content="Sibling replies stay at the same level, so a thread can branch without growing any deeper."
    />
  </a-comment>
</template>
