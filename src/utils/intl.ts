/**
 * @example
 * ```ts
 * const formatted = listFormat(['apple', 'banana', 'cherry'], 'en-US')
 * //    ^ "apple, banana, and cherry"
 * const formatted = listFormat(['苹果', '香蕉', '樱桃'], 'zh-CN')
 * //    ^ "苹果、香蕉和樱桃"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function formatList(
  list: readonly string[],
  options: {
    language: string
    /**
     * - "conjunction": A, B, and C,
     * - "disjunction": A, B, or C,
     * - "unit": A, B, C
     */
    type?: Intl.ListFormatType | undefined
    /**
     * - "long": A, B, and C
     * - "short": A, B, & C,
     * - "narrow": A, B, C
     */
    style?: Intl.ListFormatStyle | undefined
  },
): string {
  try {
    const { language, ...formatOptions } = options

    return new Intl.ListFormat(language, {
      type: 'conjunction',
      style: 'long',
      ...formatOptions,
    }).format(list)
  } catch {
    return list.join(', ')
  }
}

/**
 * @param date ISO string or Epoch milliseconds
 *
 * @example
 * ```ts
 * const relativeTime = formatRelativeTime('2023-01-01T00:00:00Z', 'en-US')
 * //=> 'in 2 months'
 * const relativeTime = formatRelativeTime(1672531200000, 'fr-FR')
 * //=> 'dans 2 mois'
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function formatRelativeTime(
  date: string | number,
  language: string,
  now = Temporal.Now.zonedDateTimeISO('UTC'),
): string {
  const dateTime =
    typeof date === 'string'
      ? Temporal.Instant.from(date).toZonedDateTimeISO('UTC')
      : Temporal.Instant.fromEpochMilliseconds(date).toZonedDateTimeISO('UTC')

  const duration = dateTime.since(now, {
    largestUnit: 'years',
    smallestUnit: 'seconds',
  })

  const formatter = new Intl.RelativeTimeFormat(language, {
    style: 'narrow',
    numeric: 'auto',
  })

  const units = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ] as const

  for (const unit of units) {
    if (duration[unit] !== 0) {
      return formatter.format(duration[unit], unit)
    }
  }

  return formatter.format(0, 'seconds')
}

/**
 * @example
 * ```ts
 * const formatted = formatDuration({ hours: 1, minutes: 30 }, 'en-US')
 * //    ^ "1h 30m"
 * const formatted = formatDuration({ hours: 1, minutes: 30 }, 'zh-CN')
 * //    ^ "1小时30分钟"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function formatDuration(
  duration: Partial<Record<Intl.DurationFormatUnit, number>>,
  options: Intl.DurationFormatOptions & {
    padZero?: boolean
    language: string
  },
): string {
  const { padZero, language, ...rest } = options

  if (Intl.DurationFormat) {
    const formatter = new Intl.DurationFormat(language, {
      style: 'narrow',
      ...rest,
    })

    if (padZero) {
      const parts = formatter.formatToParts(duration)

      return parts
        .map((part) => {
          if (
            part.type === 'integer' &&
            (part.unit === 'minute' || part.unit === 'second')
          ) {
            return part.value.padStart(2, '0')
          }

          return part.value
        })
        .join('')
    } else {
      return formatter.format(duration)
    }
  }

  const DURATION_UNITS: Intl.DurationFormatUnit[] = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
    'microseconds',
    'nanoseconds',
  ]

  const dict = {
    years: 'y',
    months: 'mo',
    weeks: 'w',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    milliseconds: 'ms',
    microseconds: 'µs',
    nanoseconds: 'ns',
    _separator: ' ',
  }

  const parts = []

  for (const unit of DURATION_UNITS) {
    const value = duration[unit]

    if (typeof value === 'number' && value > 0) {
      parts.push(`${value}${dict[unit]}`)
    }
  }

  if (parts.length === 0) {
    return `0${dict.seconds}`
  }

  return parts.join(dict._separator)
}
