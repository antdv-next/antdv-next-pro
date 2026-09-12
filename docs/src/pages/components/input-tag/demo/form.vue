<docs lang="zh-CN">
用 Form.Item 校验标签列表。表单值是已提交的标签，不是输入框草稿。
</docs>

<docs lang="en-US">
Use Form.Item to validate the tag list. The form value is the committed tags, not the input draft.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  tags: ['Vue'],
})

const rules = [
  { required: true, type: 'array' as const, min: 1, message: 'Enter at least one tag' },
]
</script>

<template>
  <a-form :model="model" layout="vertical">
    <a-form-item name="tags" label="Tags" :rules="rules">
      <a-input-tag v-model:value="model.tags" placeholder="Add a tag" />
    </a-form-item>
  </a-form>
</template>
