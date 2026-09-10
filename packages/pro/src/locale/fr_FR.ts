import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_FR'

const cronLocale: CronLocale = {
  fields: {
    second: 'Seconde',
    minute: 'Minute',
    hour: 'Heure',
    day: 'Jour',
    month: 'Mois',
    week: 'Semaine',
    year: 'Année',
  },
  modes: {
    every: 'Chaque',
    interval: 'Intervalle',
    specified: 'Spécifié',
    range: 'Portée',
    list: 'Liste',
  },
  any: 'N\'importe lequel',
  notSpecified: 'Non précisé',
  every: 'tous les',
  everyField: 'Tous les {field}',
  valueSeparator: ', ',
  to: 'à',
  expression: 'Expression Cron',
  fieldList: 'Champs Cron',
  fieldStart: '{field} début',
  fieldInterval: '{field} intervalle',
  fieldRangeStart: '{field} début de plage',
  fieldRangeEnd: '{field} fin de plage',
  fieldValue: '{field} valeur',
  fieldValues: '{field} valeurs',
  nextRun: 'Prochaine exécution : {value}',
  noFutureRun: 'Aucune exécution future',
  everySeconds: 'Toutes les {value} secondes',
  everyMinutes: 'Toutes les {value} minutes',
  everyDayAt: 'Tous les jours à {value}',
  customSchedule: 'Horaire personnalisé',
  validation: {
    invalidStep: 'Expression d\'étape non valide',
    stepOutOfRange: 'Le pas doit être une valeur positive dans la plage du champ',
    invalidRange: 'Expression de plage non valide',
    valueOutOfRange: 'La valeur doit être comprise entre {min} et {max}',
    rangeOrder: 'Le début de la plage ne doit pas être supérieur à la fin de la plage',
    fieldRequired: 'Le champ est obligatoire',
    questionMarkField: 'Le point d\'interrogation n\'est pris en charge que pour les champs jour et semaine',
    questionMarkAlone: 'Le point d\'interrogation doit être la seule valeur du champ',
    unsupportedCharacter: 'Caractère non pris en charge dans le champ',
    expectedFields: 'champs {count} attendus pour le format Quartz sélectionné',
    dayWeekQuestionMark: 'Dans une expression Quartz, le champ jour ou le champ semaine doit être ?, mais pas les deux.',
    invalidExpression: 'Expression cron invalide',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
