import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tk_TK'

const cronLocale: CronLocale = {
  fields: {
    second: 'Ikinji',
    minute: 'minut',
    hour: 'Sagat',
    day: 'Gün',
    month: 'Aý',
    week: 'Hepde',
    year: 'Yearyl',
  },
  modes: {
    every: 'Her',
    interval: 'Aralyk',
    specified: 'Görkezildi',
    range: 'aralygy',
    list: 'Sanaw',
  },
  any: 'Islendik',
  notSpecified: 'görkezilmedi',
  every: 'hersi',
  everyField: 'Her {field}',
  to: '–',
  expression: 'Kron aňlatmasy',
  fieldList: 'Kron meýdanlary',
  fieldStart: '{field} başlamak',
  fieldInterval: '{field} aralyk',
  fieldRangeStart: '{field} aralyk başlangyjy',
  fieldRangeEnd: '{field} diapazonyň soňy',
  fieldValue: '{field} bahasy',
  fieldValues: '{field} bahalar',
  nextRun: 'Indiki ylgaw: {value}',
  noFutureRun: 'Geljekde iş bolmaz',
  everySeconds: 'Her {value} sekuntda',
  everyMinutes: 'Her {value} minutda',
  everyDayAt: 'Her gün {value}-de',
  customSchedule: 'omörite tertip',
  validation: {
    invalidStep: 'Nädogry ädim aňlatmasy',
    stepOutOfRange: 'ädim meýdan çäginde oňyn baha bolmaly',
    invalidRange: 'Nädogry aralyk aňlatmasy',
    valueOutOfRange: 'Bahasy {min} bilen {max} arasynda bolmaly',
    rangeOrder: 'Aralyk başlangyjy aralyk ujundan uly bolmaly däldir',
    fieldRequired: 'Meýdan gerek',
    questionMarkField: 'Sorag belligi diňe gün we hepde meýdanlary üçin goldanýar',
    questionMarkAlone: 'Sorag belligi ýeke-täk meýdan bahasy bolmaly',
    unsupportedCharacter: 'Meýdanda goldanmaýan nyşan',
    expectedFields: 'Saýlanan Kwars formaty üçin garaşylýan {count} meýdanlary',
    dayWeekQuestionMark: 'Kwars aňlatmasynda gün meýdançasy ýa-da hepde meýdany ? bolmaly, ýöne ikisi hem däl',
    invalidExpression: 'Nädogry kron aňlatmasy',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
