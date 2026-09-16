<docs lang="zh-CN">
通过 `classes` 与 `styles` 定制 Comment 的十个语义化节点。头像区、头信息、正文与嵌套容器都可以单独控制。
</docs>

<docs lang="en-US">
Customize the ten semantic nodes of Comment with `classes` and `styles`. The avatar, header, body, and nested container can each be controlled separately.
</docs>

<script setup lang="ts">
import type { CommentProps } from '@antdv-next/pro/comment'

const avatar = (seed: string) => `https://api.dicebear.com/7.x/miniavs/svg?seed=${seed}`

const classes: CommentProps['classes'] = {
  root: 'comment-semantic-root',
  inner: 'comment-semantic-inner',
  avatar: 'comment-semantic-avatar',
  content: 'comment-semantic-content',
  header: 'comment-semantic-header',
  author: 'comment-semantic-author',
  datetime: 'comment-semantic-datetime',
  body: 'comment-semantic-body',
  actions: 'comment-semantic-actions',
  children: 'comment-semantic-children',
}

const styles: CommentProps['styles'] = {
  content: {
    padding: '12px 16px',
    border: '2px dashed var(--ant-color-primary)',
    borderRadius: '6px',
    backgroundColor: 'var(--ant-color-fill-quaternary)',
  },
  body: {
    fontStyle: 'italic',
  },
  children: {
    paddingInlineStart: '24px',
    borderInlineStart: '2px solid var(--ant-color-border)',
  },
}
</script>

<template>
  <a-comment
    author="Zhang San"
    :avatar="avatar('ZhangSan')"
    datetime="5 minutes ago"
    content="每一条语义化 class 都对应 DOM 里的一个节点。"
    :actions="['Reply']"
    :classes="classes"
    :styles="styles"
  >
    <a-comment
      author="Li Si"
      :avatar="avatar('LiSi')"
      datetime="3 minutes ago"
      content="嵌套评论容器同样可以定制。"
    />
  </a-comment>
</template>

<style>
.comment-semantic-root {
  padding: 16px;
  border: 2px solid var(--ant-color-primary);
  border-radius: 8px;
  background: var(--ant-color-primary-bg);
}

.comment-semantic-avatar {
  border-radius: 50%;
  outline: 2px dashed var(--ant-color-primary);
  outline-offset: 2px;
}

.comment-semantic-header {
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--ant-color-border);
}

.comment-semantic-author {
  font-weight: 700;
  color: var(--ant-color-primary);
}

.comment-semantic-actions {
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--ant-color-warning-bg);
}
</style>
