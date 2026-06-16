import { useCallback, useState } from 'react'

type ColorScheme = 'auto' | 'light' | 'dark'

export function useColorScheme(): [ColorScheme, (scheme: ColorScheme) => void] {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return (localStorage.getItem('color-scheme') || 'auto') as ColorScheme
  })

  const setColorSchemeAndStore = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme)
    localStorage.setItem('color-scheme', scheme)
  }, [])

  return [colorScheme, setColorSchemeAndStore]
}
