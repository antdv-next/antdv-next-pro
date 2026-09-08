import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pl_PL'

const cronLocale: CronLocale = {
  fields: {
    second: 'Sekunda',
    minute: 'Minuta',
    hour: 'Godzina',
    day: 'Dzień',
    month: 'Miesiąc',
    week: 'Tydzień',
    year: 'Rok',
  },
  modes: {
    every: 'Każdy',
    interval: 'Interwał',
    specified: 'Określono',
    range: 'Zasięg',
    list: 'Lista',
  },
  any: 'Dowolne',
  notSpecified: 'Nie określono',
  every: 'co',
  everyField: 'Co {field}',
  to: 'do',
  expression: 'Wyrażenie Cron',
  fieldList: 'Pola Cron',
  fieldStart: '{field} początek',
  fieldInterval: '{field} interwał',
  fieldRangeStart: '{field} początek zakresu',
  fieldRangeEnd: '{field} koniec zakresu',
  fieldValue: '{field} wartość',
  fieldValues: '{field} wartości',
  nextRun: 'Następne uruchomienie: {value}',
  noFutureRun: 'Brak przyszłości',
  everySeconds: 'Co {value} sekund',
  everyMinutes: 'Co {value} minut',
  everyDayAt: 'Codziennie o {value}',
  customSchedule: 'Harmonogram niestandardowy',
  validation: {
    invalidStep: 'Nieprawidłowe wyrażenie kroku',
    stepOutOfRange: 'Krok musi być wartością dodatnią w zakresie pola',
    invalidRange: 'Nieprawidłowe wyrażenie zakresu',
    valueOutOfRange: 'Wartość musi mieścić się w przedziale od {min} do {max}',
    rangeOrder: 'Początek zakresu nie może być większy niż koniec zakresu',
    fieldRequired: 'Pole jest wymagane',
    questionMarkField: 'Znak zapytania jest obsługiwany tylko w przypadku pól dnia i tygodnia',
    questionMarkAlone: 'Znak zapytania musi być jedyną wartością pola',
    unsupportedCharacter: 'Nieobsługiwany znak w polu',
    expectedFields: 'Oczekiwane pola: {count} dla wybranego formatu Quartz',
    dayWeekQuestionMark: 'W wyrażeniu Quartz pole dnia lub pole tygodnia musi mieć wartość ?, ale nie oba',
    invalidExpression: 'Nieprawidłowe wyrażenie cron',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
