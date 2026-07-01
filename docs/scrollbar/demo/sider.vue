<docs lang="zh-CN">
用 `Scrollbar` 组织一个高密度的导航侧栏，适合文档、后台配置和 Pro 页面目录。
</docs>

<docs lang="en-US">
Use `Scrollbar` to build a dense navigation sider for docs, admin settings, and Pro page catalogs.
</docs>

<script setup lang="ts">
const items = [
  {
    key: 'overview',
    label: 'Overview',
  },
  {
    key: 'workspace',
    label: 'Workspace',
    children: [
      { key: 'workspace-dashboard', label: 'Dashboard' },
      { key: 'workspace-members', label: 'Members' },
      { key: 'workspace-billing', label: 'Billing' },
      { key: 'workspace-audit', label: 'Audit Logs' },
    ],
  },
  {
    key: 'automation',
    label: 'Automation',
    children: [
      { key: 'automation-flow', label: 'Flows' },
      { key: 'automation-jobs', label: 'Jobs' },
      { key: 'automation-webhooks', label: 'Webhooks' },
      { key: 'automation-secrets', label: 'Secrets' },
    ],
  },
  {
    key: 'system',
    label: 'System',
    children: [
      { key: 'system-api', label: 'API Keys' },
      { key: 'system-integrations', label: 'Integrations' },
      { key: 'system-security', label: 'Security' },
      { key: 'system-observability', label: 'Observability' },
    ],
  },
]
</script>

<template>
  <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px;">
    <a-scrollbar
      visibility-y="always"
      style="height: 360px; border: 1px solid var(--ant-color-border); border-radius: 14px; background: var(--ant-color-bg-container);"
    >
      <div style="padding: 12px;">
        <div style="padding: 4px 4px 12px;">
          <a-typography-text type="secondary">
            Pro navigation
          </a-typography-text>
        </div>
        <a-menu mode="inline" :items="items" :default-open-keys="['workspace', 'automation', 'system']" />
      </div>
    </a-scrollbar>

    <a-card title="Panel Preview" style="height: 360px;">
      <a-flex vertical gap="middle">
        <a-alert
          show-icon
          type="info"
          message="This demo keeps the site layout untouched."
          description="Scrollbar only handles the dense sider area inside the component itself."
        />
        <a-skeleton active :paragraph="{ rows: 4 }" />
      </a-flex>
    </a-card>
  </div>
</template>
