import { Temporal } from 'temporal-polyfill'
import { Counter } from '~/components/Counter'
import { LanguageSelect } from '~/components/LanguageSelect'
import { ThemeToggleButton } from '~/components/ThemeToggleButton'
import { listFormat, useI18n } from '~/i18n'

export default function Index() {
  const name = useRef<HTMLInputElement>(null)
  const { t } = useI18n()
  const navigate = useNavigate()

  function go() {
    if (name.current) {
      navigate(`/hi/${encodeURIComponent(name.current.value)}`, {
        state: {
          from: '/',
        },
      })
    }
  }

  return (
    <div className="grid h-full content-start justify-items-center overflow-y-auto">
      <Header />

      <Counter />

      <input
        name="name"
        ref={name}
        placeholder={t('placeholder')}
        type="text"
        className="w-[250px] rounded border border-neutral-primary bg-transparent px-4 py-2 text-center outline-none active:outline-none"
        onKeyDown={({ key }) => key === 'Enter' && go()}
      />

      <div>
        <button className="m-3 btn text-sm" disabled={!name} onClick={go}>
          Go
        </button>
      </div>

      <I18nExample />
    </div>
  )
}

function I18nExample() {
  const { t, i18n } = useI18n()

  return (
    <>
      <div>
        {t('useI18nTest', {
          link: <a className="text-info-primary" />,
          name: <span className="text-success-primary">Dynamic Content</span>,
        })}
      </div>

      <div>
        {t('_examples.listInterpolation', {
          list: listFormat(['CN', 'FR', 'RU', 'GB', 'US'], i18n.language),
        })}
      </div>

      <div>{t('_examples.notranslate')}</div>
      <div>
        {t('_examples.nestedTags', {
          b: <strong />,
          i: <i />,
        })}
      </div>
      <div>
        {t('_examples.multipleSameTags', {
          b: <strong />,
        })}
      </div>

      <div>
        {t('_examples.tagAndVariable', {
          b: <strong />,
          name: <span>{i18n.language}</span>,
        })}
      </div>
    </>
  )
}

function Header() {
  const { i18n } = useI18n()

  const timeString = useMemo(() => {
    const buildTime = Temporal.Instant.from(APP_BUILD_TIME).toLocaleString(
      i18n.language,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
    )

    const relativeTime = getRelativeString(APP_BUILD_TIME, i18n.language)

    return `${buildTime} (${relativeTime})`
  }, [i18n.language])

  return (
    <div className="flex w-full items-center justify-end gap-2 px-2 py-2">
      <time dateTime={new Date(APP_BUILD_TIME).toISOString()}>
        {timeString}
      </time>
      <span className="opacity-50">{APP_BUILD_COMMIT}</span>
      <LanguageSelect />
      <ThemeToggleButton />
    </div>
  )
}

function getRelativeString(date: string, language: string): string {
  const dateTime = Temporal.Instant.from(date).toZonedDateTimeISO('UTC')
  const now = Temporal.Now.zonedDateTimeISO('UTC')
  const diff = dateTime.since(now, {
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
    'days',
    'hours',
    'minutes',
    'seconds',
  ] as const

  for (const unit of units) {
    if (diff[unit] !== 0) {
      return formatter.format(diff[unit], unit)
    }
  }

  return formatter.format(0, 'minutes')
}
