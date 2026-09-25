<docs lang="zh-CN">
通过 `classes` 与 `styles` 定制语义化节点。
</docs>

<docs lang="en-US">
Customize semantic nodes with `classes` and `styles`.
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
    content="We supply a series of design principles, practical patterns and high quality design resources."
    :classes="classes"
    :styles="styles"
  >
    <template #actions>
      <a-button type="text" size="small">
        回复
      </a-button>
    </template>
    <a-comment
      author="Li Si"
      :avatar="avatar('LiSi')"
      datetime="3 minutes ago"
      content="Nested comments are wrapped by the children container, which is styleable on its own."
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
