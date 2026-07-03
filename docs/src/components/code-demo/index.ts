import type { App } from 'vue'
import DemoGroup from './group.vue'
import Demo from './index.vue'

export default {
  install(app: App) {
    app.component('demo', Demo)
    app.component('demo-group', DemoGroup)
  },
}
