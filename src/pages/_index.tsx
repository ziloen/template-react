import { Counter } from '~/components/Counter'
import { LanguageSelect } from '~/components/LanguageSelect'
import { ThemeToggleButton } from '~/components/ThemeToggleButton'
import { useI18n } from '~/i18n'
import { formatList, formatRelativeTime } from '~/utils/intl'

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

      <button className="m-3 btn text-sm" onClick={go}>
        Go
      </button>

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
          list: formatList(['CN', 'FR', 'RU', 'GB', 'US'], {
            language: i18n.language,
          }),
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

    const relativeTime = formatRelativeTime(APP_BUILD_TIME, i18n.language)

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
