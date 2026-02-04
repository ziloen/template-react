import { useColorScheme } from '~/hooks'

export function ThemeToggleButton() {
  const [colorScheme, setColorScheme] = useColorScheme()

  const computedTheme = useMemo(() => {
    if (colorScheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      return colorScheme
    }
  }, [colorScheme])

  return (
    <button
      className="flex-center size-8 rounded-full bg-surface-secondary p-1 font-mono text-base select-none"
      onClick={(e) => {
        const nextTheme = computedTheme === 'light' ? 'dark' : 'light'
        transitionTheme(() => {
          setColorScheme(nextTheme)
          const colorSchemeMeta = document.head.querySelector(
            "meta[name='color-scheme']",
          )

          if (colorSchemeMeta) {
            colorSchemeMeta.setAttribute('content', nextTheme)
          }

          document.documentElement.setAttribute('data-theme', nextTheme)
        }, e.nativeEvent)
      }}
    >
      {computedTheme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

function transitionTheme(fn: () => void, e: MouseEvent) {
  if (enableTransitions()) {
    const transition = document.startViewTransition(async () => {
      fn()

      document.documentElement.style.setProperty('--mouse-x', `${e.x}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.y}px`)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        { '--percentage-1': ['0%', '100%'] },
        {
          duration: 1_000,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  } else {
    fn()
  }
}
