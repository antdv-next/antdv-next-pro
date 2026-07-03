import type { MenuItemType } from 'antdv-next'

export type AntdvMenuItem = MenuItemType & {
  tag?: string
  children?: AntdvMenuItem[]
}
