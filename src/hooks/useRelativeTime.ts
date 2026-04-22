import { useI18n } from '~/i18n'
import { formatRelativeTime } from '~/utils/intl'

/**
 * Returns a formatted relative time string that updates in real-time.
 * Uses the current i18n language automatically.
 * The update interval adapts based on the distance from now:
 * - < 1 minute: updates every second
 * - < 1 hour: updates every minute
 * - < 1 day: updates every hour
 * - otherwise: updates every day
 *
 * @example
 * ```tsx
 * const relativeTime = useRelativeTime('2023-01-01T00:00:00Z')
 * //    ^ "2 years ago" (auto-updates)
 * const relativeTime = useRelativeTime(Date.now() - 30_000)
 * //    ^ "30秒前" (auto-updates in current language)
 * ```
 */
export function useRelativeTime(
  date: string | number | Date,
  options: Intl.RelativeTimeFormatOptions = {},
): string {
  const { i18n } = useI18n()
  const { language } = i18n

  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(date, { ...options, language }),
  )

  const optionsRef = useRef(options)
  optionsRef.current = options

  const languageRef = useRef(language)
  languageRef.current = language

  useEffect(() => {
    function getAbsDiffSeconds(): number {
      const now = Date.now()
      const ts =
        typeof date === 'string'
          ? new Date(date).getTime()
          : typeof date === 'number'
            ? date
            : date.getTime()
      return Math.abs(now - ts) / 1000
    }

    function getInterval(diffSeconds: number): number {
      if (diffSeconds < 60) return 1_000 // every second
      if (diffSeconds < 3_600) return 60_000 // every minute
      if (diffSeconds < 86_400) return 3_600_000 // every hour
      return 86_400_000 // every day
    }

    let timerId: ReturnType<typeof setTimeout>

    function schedule() {
      const diffSeconds = getAbsDiffSeconds()
      const interval = getInterval(diffSeconds)

      timerId = setTimeout(() => {
        setRelativeTime(
          formatRelativeTime(date, {
            ...optionsRef.current,
            language: languageRef.current,
          }),
        )
        schedule()
      }, interval)
    }

    // Update immediately when inputs change
    setRelativeTime(
      formatRelativeTime(date, {
        ...optionsRef.current,
        language: languageRef.current,
      }),
    )
    schedule()

    return () => clearTimeout(timerId)
  }, [date, language])

  return relativeTime
}
