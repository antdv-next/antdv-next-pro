<docs lang="zh-CN">
`actions` 适合纯展示：字符串命中内置动作名（`Reply` / `Edit` / `Delete` 等，不区分大小写）时渲染为纯图标，其余字符串按传入文案原样渲染。内置图标不可点击——字符串条目没有地方挂回调，渲染成按钮只会给出「可点击」却没有响应的错误承诺。需要交互（点赞、禁用、二次确认）时改用 `#actions` 插槽。
</docs>

<docs lang="en-US">
The `actions` prop is for display: a string that matches a built-in action name (`Reply`, `Edit`, `Delete`, and so on, case-insensitive) renders as a plain icon, and any other string renders as the text you passed. Built-in icons are not clickable — a string entry has nowhere to attach a handler, and rendering it as a button would promise interaction it cannot deliver. Use the `#actions` slot for anything interactive, such as likes, disabled states, or confirmations.
</docs>

<script setup lang="ts">
import { DeleteOutlined, EditOutlined, LikeFilled, LikeOutlined, MessageOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const zhangSanAvatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=ZhangSan'
const liSiAvatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=LiSi'

const likes = ref(12)
const liked = ref(false)

function toggleLike() {
  liked.value = !liked.value
  likes.value += liked.value ? 1 : -1
}
</script>

<template>
  <a-space orientation="vertical" size="large" style="width: 100%">
    <a-comment
      author="Zhang San"
      :avatar="zhangSanAvatar"
      datetime="5 minutes ago"
      content="内置动作名渲染为纯图标；未命中的字符串（如「打赏」）仍按文本渲染。"
      :actions="['Reply', 'Edit', 'Delete', '打赏']"
    />
    <a-comment
      author="Li Si"
      :avatar="liSiAvatar"
      datetime="3 minutes ago"
      content="需要交互时改用 #actions 插槽，点赞状态由业务层持有。"
    >
      <template #actions>
        <a-button type="text" size="small" @click="toggleLike">
          <template #icon>
            <LikeFilled v-if="liked" />
            <LikeOutlined v-else />
          </template>
          {{ likes }}
        </a-button>
        <a-button type="text" size="small">
          <template #icon>
            <MessageOutlined />
          </template>
          Reply
        </a-button>
        <a-button type="text" size="small">
          <template #icon>
            <EditOutlined />
          </template>
          Edit
        </a-button>
        <a-button type="text" size="small" danger>
          <template #icon>
            <DeleteOutlined />
          </template>
          Delete
        </a-button>
      </template>
    </a-comment>
  </a-space>
</template>
