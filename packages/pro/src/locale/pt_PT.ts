import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pt_PT'

const cronLocale = {
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
    special: 'Especial',
  },
  notSpecified: 'Não especificado',
  everyField: 'A cada {field}',
  everyStep: 'Executar a cada {step} {field}',
  intervalField: 'Começar em  {start} e executar a cada {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} para {end}',
  unspecifiedDay: 'Dia não especificado; seguir o campo da semana',
  unspecifiedWeek: 'Semana não especificada; seguir o campo do dia',
  valueSeparator: ', ',
  expression: 'Expressão Cron',
  fieldList: 'Campos Cron',
  fieldStart: '{field} início',
  fieldInterval: '{field} intervalo',
  fieldRangeStart: '{field} início do intervalo',
  fieldRangeEnd: '{field} fim do intervalo',
  fieldValues: '{field} valores',
  nextRun: 'Próxima execução: {value}',
  noFutureRun: 'Sem execução futura',
  specialLastDay: 'o último dia de cada mês',
  specialLastWeekday: 'o último dia útil de cada mês',
  specialNearestWeekday: 'o dia útil mais próximo do dia {day} de cada mês',
  specialLastDayOfWeek: 'o último {week} de cada mês',
  specialNthDayOfWeek: 'o {nth} {week} de cada mês',
  specialLast: 'Último',
  specialNth: 'N.º',
  nthLabels: {
    1: '1.º',
    2: '2.º',
    3: '3.º',
    4: '4.º',
    5: '5.º',
  },
  validation: {
    invalidStep: 'Expressão de etapa inválida',
    stepOutOfRange: 'O passo deve ser um valor positivo dentro do intervalo do campo',
    invalidRange: 'Expressão de intervalo inválida',
    valueOutOfRange: 'O valor deve estar compreendido entre {min} e {max}',
    rangeOrder: 'O início do intervalo não deve ser superior ao fim do intervalo',
    fieldRequired: 'Campo de preenchimento obrigatório',
    questionMarkField: 'O ponto de interrogação só é suportado para campos de dia e semana',
    questionMarkAlone: 'O ponto de interrogação deve ser o único valor do campo',
    unsupportedCharacter: 'Caracter não suportado no campo',
    expectedFields: '{count} campos esperados para o formato Quartz selecionado',
    expectedUnixFields: 'O Unix cron espera 5 campos',
    dayWeekQuestionMark: 'Numa expressão Quartzo, o campo dia ou o campo semana deve ser ?, mas não ambos',
    unixQuestionMark: 'O ponto de interrogação não é suportado no Unix cron',
    unsupportedSpecial: 'Esta sintaxe especial não é suportada',
    invalidExpression: 'Expressão cron inválida',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menos',
    more: 'Mais',
    noData: 'Sem dados',
    level: 'Nível',
  },
  InputTag: {
    clear: 'Limpar',
    showMore: 'Mostrar todas as etiquetas',
  },
} satisfies ProLocale

export default proLocale
