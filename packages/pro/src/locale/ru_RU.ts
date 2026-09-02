import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ru_RU'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Тепловая карта',
    less: 'Меньше',
    more: 'Больше',
    noData: 'Нет данных',
    level: 'Уровень',
  },
} satisfies ProLocale

export default proLocale
