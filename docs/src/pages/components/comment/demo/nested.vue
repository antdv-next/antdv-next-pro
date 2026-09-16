<docs lang="zh-CN">
把子评论放在默认插槽中即可形成嵌套，组件不限制层级。缩进跟随头像尺寸，RTL 下自动镜像。过深的层级会同时放大 DOM 深度与水平空间占用，建议业务层限制递归深度。
</docs>

<docs lang="en-US">
Put child comments in the default slot to nest them; the component does not limit the depth. The indent follows the avatar size and mirrors automatically in RTL. Deep nesting inflates both DOM depth and horizontal space, so limit the recursion depth in the business layer.
</docs>

<script setup lang="ts">
const avatar = (seed: string) => `https://api.dicebear.com/7.x/miniavs/svg?seed=${seed}`
</script>

<template>
  <a-comment
    author="Zhang San"
    :avatar="avatar('ZhangSan')"
    datetime="5 minutes ago"
    content="Documentation feedback should stay close to the paragraph it refers to."
  >
    <a-comment
      author="Li Si"
      :avatar="avatar('LiSi')"
      datetime="3 minutes ago"
      content="Agreed. Inline comments are easier to act on than a separate review page."
    >
      <a-comment
        author="Wang Wu"
        :avatar="avatar('WangWu')"
        datetime="1 minute ago"
        content="The indent is driven by the avatar size token, so it mirrors automatically in RTL."
      />
    </a-comment>
    <a-comment
      author="Zhao Liu"
      :avatar="avatar('ZhaoLiu')"
      datetime="2 minutes ago"
      content="Keeping the thread to three levels reads best on narrow screens."
    />
  </a-comment>
</template>
