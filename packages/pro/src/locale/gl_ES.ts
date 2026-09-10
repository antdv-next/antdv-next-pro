import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/gl_ES'

const cronLocale: CronLocale = {
  fields: {
    second: 'Segundo',
    minute: 'Minuto',
    hour: 'Hora',
    day: 'Día',
    month: 'Mes',
    week: 'Semana',
    year: 'Ano',
  },
  modes: {
    every: 'Cada',
    interval: 'Intervalo',
    specified: 'Especificado',
    range: 'Rango',
    list: 'Lista',
  },
  any: 'Calquera',
  notSpecified: 'Non especificado',
  every: 'cada',
  everyField: 'Cada {field}',
  valueSeparator: ', ',
  to: 'a',
  expression: 'Expresión cron',
  fieldList: 'Campos Cron',
  fieldStart: '{field} comeza',
  fieldInterval: '{field} intervalo',
  fieldRangeStart: '{field} inicio do intervalo',
  fieldRangeEnd: '{field} fin do intervalo',
  fieldValue: '{field} valor',
  fieldValues: '{field} valores',
  nextRun: 'Próxima execución: {value}',
  noFutureRun: 'Non hai carreira futura',
  everySeconds: 'Cada {value} segundos',
  everyMinutes: 'Cada {value} minutos',
  everyDayAt: 'Todos os días ás {value}',
  customSchedule: 'Horario personalizado',
  validation: {
    invalidStep: 'Expresión de paso non válida',
    stepOutOfRange: 'O paso debe ser un valor positivo dentro do intervalo de campo',
    invalidRange: 'Expresión de intervalo non válida',
    valueOutOfRange: 'O valor debe estar entre {min} e {max}',
    rangeOrder: 'O inicio do intervalo non debe ser superior ao final do intervalo',
    fieldRequired: 'O campo é obrigatorio',
    questionMarkField: 'O signo de interrogación só é compatible con campos de día e semana',
    questionMarkAlone: 'O signo de interrogación debe ser o único valor do campo',
    unsupportedCharacter: 'Carácter non admitido no campo',
    expectedFields: 'Agardaban {count} campos para o formato Quartz seleccionado',
    dayWeekQuestionMark: 'Nunha expresión Quartz, o campo día ou o campo semana debe ser ?, pero non ambos',
    invalidExpression: 'Expresión cron non válida',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
