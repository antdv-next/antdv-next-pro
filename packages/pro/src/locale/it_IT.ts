import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/it_IT'

const cronLocale: CronLocale = {
  fields: {
    second: 'Secondo',
    minute: 'Minuto',
    hour: 'Ora',
    day: 'Giorno',
    month: 'Mese',
    week: 'Settimana',
    year: 'Anno',
  },
  modes: {
    every: 'Ogni',
    interval: 'Intervallo',
    specified: 'Specificato',
    range: 'Gamma',
    list: 'Elenco',
  },
  any: 'Qualunque',
  notSpecified: 'Non specificato',
  every: 'ogni',
  everyField: 'Ogni {field}',
  to: 'a',
  expression: 'Espressione cron',
  fieldList: 'Campi cron',
  fieldStart: '{field} inizio',
  fieldInterval: 'Intervallo {field}',
  fieldRangeStart: 'Inizio gamma {field}',
  fieldRangeEnd: '{field}',
  fieldValue: 'valore {field}',
  fieldValues: '{field} valori',
  nextRun: 'Prossima esecuzione: {value}',
  noFutureRun: 'Nessuna corsa futura',
  everySeconds: 'Ogni {value} secondi',
  everyMinutes: 'Ogni {value} minuti',
  everyDayAt: 'Tutti i giorni alle {value}',
  customSchedule: 'Programmazione personalizzata',
  validation: {
    invalidStep: 'Espressione del passo non valida',
    stepOutOfRange: 'Il passo deve essere un valore positivo compreso nell\'intervallo del campo',
    invalidRange: 'Espressione di intervallo non valida',
    valueOutOfRange: 'Il valore deve essere compreso tra {min} e {max}',
    rangeOrder: 'L\'inizio dell\'intervallo non deve essere maggiore della fine dell\'intervallo',
    fieldRequired: 'Il campo è obbligatorio',
    questionMarkField: 'Il punto interrogativo è supportato solo per i campi relativi al giorno e alla settimana',
    questionMarkAlone: 'Il punto interrogativo deve essere l\'unico valore del campo',
    unsupportedCharacter: 'Carattere non supportato nel campo',
    expectedFields: 'Sono previsti {count} campi per il formato Quartz selezionato',
    dayWeekQuestionMark: 'In un\'espressione Quartz, il campo del giorno o quello della settimana devono essere ?, ma non entrambi',
    invalidExpression: 'Espressione cron non valida',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
