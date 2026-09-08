import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pt_BR'

const cronLocale: CronLocale = {
  fields: {
    second: 'Segundo',
    minute: 'Minuto',
    hour: 'Hora',
    day: 'Dia',
    month: 'Mês',
    week: 'Semana',
    year: 'Ano',
  },
  modes: {
    every: 'Cada',
    interval: 'Intervalo',
    specified: 'Especificado',
    range: 'Intervalo',
    list: 'Lista',
  },
  any: 'Qualquer',
  notSpecified: 'Não especificado',
  every: 'cada',
  everyField: 'A cada {field}',
  to: 'para',
  expression: 'Expressão Cron',
  fieldList: 'Campos Cron',
  fieldStart: '{field} início',
  fieldInterval: '{field} intervalo',
  fieldRangeStart: '{field} início do intervalo',
  fieldRangeEnd: '{field} fim do intervalo',
  fieldValue: 'valor {field}',
  fieldValues: '{field} valores',
  nextRun: 'Próxima execução: {value}',
  noFutureRun: 'Sem execução futura',
  everySeconds: 'A cada {value} segundos',
  everyMinutes: 'A cada {value} minutos',
  everyDayAt: 'Todos os dias às {value}',
  customSchedule: 'Programação personalizada',
  validation: {
    invalidStep: 'Expressão de etapa inválida',
    stepOutOfRange: 'A etapa deve ser um valor positivo dentro do intervalo do campo',
    invalidRange: 'Expressão de intervalo inválida',
    valueOutOfRange: 'O valor deve estar entre {min} e {max}',
    rangeOrder: 'O início do intervalo não deve ser maior que o final do intervalo',
    fieldRequired: 'Campo obrigatório',
    questionMarkField: 'O ponto de interrogação só é suportado para campos de dia e semana',
    questionMarkAlone: 'O ponto de interrogação deve ser o único valor do campo',
    unsupportedCharacter: 'Caractere não suportado no campo',
    expectedFields: '{count} campos esperados para o formato Quartz selecionado',
    dayWeekQuestionMark: 'Em uma expressão Quartz, o campo dia ou o campo semana deve ser ?, mas não ambos',
    invalidExpression: 'Expressão cron inválida',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
