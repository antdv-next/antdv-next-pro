import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/es_ES'

const cronLocale: CronLocale = {
  fields: {
    second: 'Segundo',
    minute: 'Minuto',
    hour: 'Hora',
    day: 'Día',
    month: 'Mes',
    week: 'Semana',
    year: 'Año',
  },
  modes: {
    every: 'Cada',
    interval: 'Intervalo',
    specified: 'Especificado',
    range: 'rango',
    list: 'Lista',
  },
  any: 'Cualquiera',
  notSpecified: 'No especificado',
  every: 'cada',
  everyField: 'Cada {field}',
  valueSeparator: ', ',
  to: 'a',
  expression: 'Expresión cron',
  fieldList: 'campos cron',
  fieldStart: '{field} inicio',
  fieldInterval: '{field} intervalo',
  fieldRangeStart: '{field} inicio de rango',
  fieldRangeEnd: '{field} fin de rango',
  fieldValue: '{field} valor',
  fieldValues: '{field} valores',
  nextRun: 'Próxima ejecución: {value}',
  noFutureRun: 'No hay ejecución futura',
  everySeconds: 'Cada {value} segundos',
  everyMinutes: 'Cada {value} minutos',
  everyDayAt: 'Todos los días a las {value}',
  customSchedule: 'Horario personalizado',
  validation: {
    invalidStep: 'Expresión de paso no válida',
    stepOutOfRange: 'El paso debe ser un valor positivo dentro del rango del campo.',
    invalidRange: 'Expresión de rango no válida',
    valueOutOfRange: 'El valor debe estar entre {min} y {max}',
    rangeOrder: 'El inicio del rango no debe ser mayor que el final del rango.',
    fieldRequired: 'El campo es obligatorio',
    questionMarkField: 'El signo de interrogación solo se admite en los campos de día y semana.',
    questionMarkAlone: 'El signo de interrogación debe ser el único valor del campo.',
    unsupportedCharacter: 'Carácter no admitido en el campo',
    expectedFields: '{count} campos esperados para el formato Quartz seleccionado',
    dayWeekQuestionMark: 'En una expresión Quartz, el campo de día o el campo de semana deben ser ?, pero no ambos',
    invalidExpression: 'Expresión cron no válida',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
