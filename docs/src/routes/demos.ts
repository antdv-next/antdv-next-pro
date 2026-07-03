import type { RouteRecordRaw } from 'vue-router'

const pageDemos = import.meta.glob([
  '/src/pages/components/**/demo/*.vue',
  '!/src/pages/components/**/components',
])

export function generateDemoRoutes() {
  const routes: RouteRecordRaw[] = []
  for (const pageDemosKey in pageDemos) {
    const component = pageDemos[pageDemosKey]
    const key = pageDemosKey.replace('/src/pages/components/', '').replace('.vue', '').replace(/\//g, '-')
    const route = {
      path: `/~demos/${key}`,
      component,
    }
    routes.push(route as RouteRecordRaw)
  }
  return routes
}

export default generateDemoRoutes()
