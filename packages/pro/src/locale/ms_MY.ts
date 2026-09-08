import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ms_MY'

const cronLocale: CronLocale = {
  fields: {
    second: 'Kedua',
    minute: 'Minit',
    hour: 'Jam',
    day: 'Hari',
    month: 'Bulan',
    week: 'Minggu',
    year: 'Tahun',
  },
  modes: {
    every: 'Setiap',
    interval: 'Selang',
    specified: 'Dinyatakan',
    range: 'Julat',
    list: 'Senarai',
  },
  any: 'Mana-mana',
  notSpecified: 'Tidak dinyatakan',
  every: 'setiap',
  everyField: 'Setiap {field}',
  to: 'hingga',
  expression: 'Ungkapan cron',
  fieldList: 'Medan Cron',
  fieldStart: '{field} mula',
  fieldInterval: '{field} selang',
  fieldRangeStart: '{field} mula julat',
  fieldRangeEnd: '{field} hujung julat',
  fieldValue: '{field} nilai',
  fieldValues: '{field} nilai',
  nextRun: 'Larian seterusnya: {value}',
  noFutureRun: 'Tiada larian masa hadapan',
  everySeconds: 'Setiap {value} saat',
  everyMinutes: 'Setiap {value} minit',
  everyDayAt: 'Setiap hari pada {value}',
  customSchedule: 'Jadual tersuai',
  validation: {
    invalidStep: 'Ungkapan langkah tidak sah',
    stepOutOfRange: 'Langkah mestilah nilai positif dalam julat medan',
    invalidRange: 'Ungkapan julat tidak sah',
    valueOutOfRange: 'Nilai mestilah antara {min} dan {max}',
    rangeOrder: 'Julat mula tidak boleh lebih besar daripada julat akhir',
    fieldRequired: 'Medan diperlukan',
    questionMarkField: 'Tanda soal hanya disokong untuk medan hari dan minggu',
    questionMarkAlone: 'Tanda soal mestilah satu-satunya nilai medan',
    unsupportedCharacter: 'Watak tidak disokong dalam medan',
    expectedFields: 'Jangkaan {count} medan untuk format Kuarza yang dipilih',
    dayWeekQuestionMark: 'Dalam ungkapan Kuarza, sama ada medan hari atau medan minggu mestilah ?, tetapi bukan kedua-duanya',
    invalidExpression: 'Ungkapan cron tidak sah',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
