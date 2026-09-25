<docs lang="zh-CN">
操作项通过 `#actions` 插槽传入，常用按钮承载。
</docs>

<docs lang="en-US">
Pass actions through the `#actions` slot, typically as buttons.
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
      content="We supply a series of design principles, practical patterns and high quality design resources, to help people and teams build their products efficiently."
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
          回复
        </a-button>
        <a-button type="text" size="small">
          <template #icon>
            <EditOutlined />
          </template>
          编辑
        </a-button>
        <a-button type="text" size="small" danger>
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
      </template>
    </a-comment>
    <a-comment
      author="Li Si"
      :avatar="liSiAvatar"
      datetime="3 minutes ago"
      content="Actions are not limited to buttons — links and plain text work just as well, and each item stays fully under your control."
    >
      <template #actions>
        <a-button type="text" size="small" danger>
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
        <a>置顶</a>
        <span>打赏</span>
      </template>
    </a-comment>
  </a-space>
</template>
