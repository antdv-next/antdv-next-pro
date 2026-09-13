import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/el_GR'

const cronLocale = {
  fields: {
    second: 'Δεύτερο',
    minute: 'Λεπτό',
    hour: 'Ώρα',
    day: 'Ημέρα',
    month: 'Μήνας',
    week: 'Εβδομάδα',
    year: 'Έτος',
  },
  modes: {
    every: 'Κάθε',
    interval: 'Διάστημα',
    specified: 'Καθορίστηκε',
    range: 'Εύρος',
    special: 'Ειδικό',
  },
  notSpecified: 'Δεν διευκρινίζεται',
  everyField: 'Κάθε {field}',
  everyStep: 'Εκτέλεση κάθε {step} λεπτά {field}',
  intervalField: 'Έναρξη στο {field} {start} και εκτέλεση κάθε {step} λεπτά',
  specifiedField: '{values}',
  rangeField: '{start} έως {end}',
  unspecifiedDay: 'Η ημέρα δεν ορίστηκε· ακολουθήστε το πεδίο εβδομάδας',
  unspecifiedWeek: 'Η εβδομάδα δεν ορίστηκε· ακολουθήστε το πεδίο ημέρας',
  valueSeparator: ', ',
  expression: 'Έκφραση Cron',
  fieldList: 'Πεδία Cron',
  fieldStart: '{field} έναρξη',
  fieldInterval: '{field} διάστημα',
  fieldRangeStart: '{field} έναρξη εύρους',
  fieldRangeEnd: '{field} τέλος εύρους',
  fieldValues: '{field} τιμές',
  nextRun: 'Επόμενη εκτέλεση: {value}',
  noFutureRun: 'Καμία μελλοντική εκτέλεση',
  specialLastDay: 'η τελευταία ημέρα κάθε μήνα',
  specialLastWeekday: 'η τελευταία εργάσιμη ημέρα κάθε μήνα',
  specialNearestWeekday: 'η πλησιέστερη εργάσιμη ημέρα στην ημέρα {day} κάθε μήνα',
  specialLastDayOfWeek: 'η τελευταία {week} κάθε μήνα',
  specialNthDayOfWeek: 'η {nth} {week} κάθε μήνα',
  specialLast: 'Τελευταία',
  specialNth: 'Nο',
  nthLabels: {
    1: '1η',
    2: '2η',
    3: '3η',
    4: '4η',
    5: '5η',
  },
  validation: {
    invalidStep: 'Μη έγκυρη έκφραση βήματος',
    stepOutOfRange: 'Το βήμα πρέπει να είναι μια θετική τιμή εντός του εύρους πεδίου',
    invalidRange: 'Μη έγκυρη έκφραση εύρους',
    valueOutOfRange: 'Η τιμή πρέπει να είναι μεταξύ {min} και {max}',
    rangeOrder: 'Η αρχή εύρους δεν πρέπει να είναι μεγαλύτερη από το τέλος εύρους',
    fieldRequired: 'Το πεδίο είναι υποχρεωτικό',
    questionMarkField: 'Το ερωτηματικό υποστηρίζεται μόνο για πεδία ημέρας και εβδομάδας',
    questionMarkAlone: 'Το ερωτηματικό πρέπει να είναι η μόνη τιμή πεδίου',
    unsupportedCharacter: 'Μη υποστηριζόμενος χαρακτήρας στο πεδίο',
    expectedFields: 'Αναμενόμενα {count} πεδία για την επιλεγμένη μορφή Quartz',
    expectedUnixFields: 'Το Unix cron απαιτεί 5 πεδία',
    dayWeekQuestionMark: 'Σε μια έκφραση Quartz, είτε το πεδίο ημέρας είτε το πεδίο εβδομάδας πρέπει να είναι ?, αλλά όχι και τα δύο',
    unixQuestionMark: 'Το ερωτηματικό δεν υποστηρίζεται στο Unix cron',
    unsupportedSpecial: 'Αυτή η ειδική σύνταξη δεν υποστηρίζεται',
    invalidExpression: 'Μη έγκυρη έκφραση cron',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Θερμικός χάρτης',
    less: 'Λιγότερα',
    more: 'Περισσότερα',
    noData: 'Δεν υπάρχουν δεδομένα',
    level: 'Επίπεδο',
  },
  InputTag: {
    clear: 'Καθαρισμός',
    showMore: 'Εμφάνιση όλων των ετικετών',
  },
} satisfies ProLocale

export default proLocale
