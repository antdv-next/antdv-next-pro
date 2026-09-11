<docs lang="zh-CN">
用 Select 的 `popupRender` 承载 Cron 面板，并由确定 / 取消控制下拉开关，避免内部 Select 选中时把外层一起关掉。
</docs>

<docs lang="en-US">
Put the Cron panel in a Select dropdown and close it with OK / Cancel, so choosing a value in the inner Select does not close the outer dropdown.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const open = ref(false)
const value = ref('0 0 9 * * ?')
const draft = ref(value.value)
const options = computed(() => [{ label: value.value, value: value.value }])

function keepOpen(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
}

function onOpenChange(next: boolean) {
  if (!next)
    return
  draft.value = value.value
  open.value = true
}

function confirm() {
  value.value = draft.value
  open.value = false
}

function cancel() {
  draft.value = value.value
  open.value = false
}
</script>

<template>
  <a-select
    :open="open"
    :value="value"
    :options="options"
    :not-found-content="null"
    :popup-match-select-width="false"
    popup-class="cron-dropdown-popup"
    style="width: 100%; max-width: 360px;"
    @open-change="onOpenChange"
  >
    <template #popupRender>
      <div class="cron-dropdown-panel" @mousedown="keepOpen">
        <div style="padding: 8px;">
          <a-cron v-model:value="draft" :classes="{ input: 'cron-dropdown-input' }" />
        </div>
        <a-divider style="margin: 0;" />
        <a-flex justify="flex-end" gap="small" style="padding: 8px 12px;">
          <a-button @click="cancel">
            Cancel
          </a-button>
          <a-button type="primary" @click="confirm">
            OK
          </a-button>
        </a-flex>
      </div>
    </template>
  </a-select>
</template>

<style>
.cron-dropdown-input {
  display: none;
}

.cron-dropdown-popup .ant-select-item,
.cron-dropdown-popup .rc-virtual-list {
  display: none;
}

.cron-dropdown-panel {
  min-width: 640px;
}
</style>
