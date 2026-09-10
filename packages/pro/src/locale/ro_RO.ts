import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ro_RO'

const cronLocale: CronLocale = {
  fields: {
    second: 'Al doilea',
    minute: 'Minut',
    hour: 'Ora',
    day: 'Zi',
    month: 'Luna',
    week: 'Săptămâna',
    year: 'An',
  },
  modes: {
    every: 'Fiecare',
    interval: 'Interval',
    specified: 'Specificat',
    range: 'Interval',
    list: 'Lista',
  },
  any: 'Oricare',
  notSpecified: 'Nespecificat',
  every: 'fiecare',
  everyField: 'La fiecare {field}',
  valueSeparator: ', ',
  to: 'la',
  expression: 'Expresia Cron',
  fieldList: 'Câmpuri Cron',
  fieldStart: '{field} începe',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} început de interval',
  fieldRangeEnd: '{field} sfârşit interval',
  fieldValue: '{field} valoare',
  fieldValues: '{field} valori',
  nextRun: 'Următoarea rulare: {value}',
  noFutureRun: 'Nicio rulare viitoare',
  everySeconds: 'La fiecare {value} secunde',
  everyMinutes: 'La fiecare {value} minute',
  everyDayAt: 'În fiecare zi la {value}',
  customSchedule: 'Program personalizat',
  validation: {
    invalidStep: 'Expresie pas nevalidă',
    stepOutOfRange: 'Pasul trebuie să fie o valoare pozitivă în intervalul câmpului',
    invalidRange: 'Expresie de interval nevalidă',
    valueOutOfRange: 'Valoarea trebuie să fie între {min} și {max}',
    rangeOrder: 'Începutul intervalului nu trebuie să fie mai mare decât sfârșitul intervalului',
    fieldRequired: 'Câmpul este obligatoriu',
    questionMarkField: 'Semnul de întrebare este acceptat numai pentru câmpurile de zi și săptămână',
    questionMarkAlone: 'Semnul întrebării trebuie să fie singura valoare de câmp',
    unsupportedCharacter: 'Caracter neacceptat în câmp',
    expectedFields: 'Se așteptau {count} câmpuri pentru formatul Quartz selectat',
    dayWeekQuestionMark: 'Într-o expresie Quartz, fie câmpul zi, fie câmpul săptămânii trebuie să fie ?, dar nu ambele',
    invalidExpression: 'Expresie cron nevalidă',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
