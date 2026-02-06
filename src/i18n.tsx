import { mapKeys } from 'es-toolkit'
import type { ParseKeys } from 'i18next'
import i18next from 'i18next'
import type { ReactElement, ReactNode } from 'react'
import {
  Fragment,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  use,
} from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'
import type { LiteralUnion } from 'type-fest'
import enJson from '~/locales/en.json'
import { useMemoizedFn } from './hooks'
import { safe } from './utils'

const i18nResourcesMap = mapKeys(
  import.meta.glob<string>(['./*.json', '!./*-tpl.json'], {
    base: './locales/',
    import: 'default',
    query: '?url',
    eager: true,
  }),
  (_, k) => k.slice(2, -5),
)

export const supportedLngs = Object.keys(i18nResourcesMap)

const fallbackLng: Record<
  LiteralUnion<'default', string>,
  [string, ...string[]]
> = {
  zh: ['zh-CN', 'en'],
  'zh-SG': ['zh-CN', 'en'],

  default: ['en'],
}

// use 'en' as fallback in production
if (import.meta.env.DEV) {
  for (const lng in fallbackLng) {
    fallbackLng[lng]!.pop()
  }

  fallbackLng['default'] = ['en']
}

i18next.use(initReactI18next).init({
  lng: 'en',
  supportedLngs,
  fallbackLng,
  showSupportNotice: false,

  resources: {
    en: { translation: enJson },
  },

  react: {
    // Only work when using `<Trans>` component
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'b'],
  },

  interpolation: {
    /** global variables */
    defaultVariables: {
      APP_NAME: 'Vite React Template',
    },
    // TODO: support default tags
    // defaultTags: {
    //   notranslate({ key, content, children }): string {
    //     return children
    //   },
    // },
  },

  parseMissingKeyHandler(key, defaultValue) {
    return key
  },
})

function resolveLanguage(lng: string) {
  const [err, requested] = safe(() => new Intl.Locale(lng).maximize())

  if (!requested) {
    return fallbackLng.default[0]
  }

  let scriptMatch: string | null = null
  let languageMatch: string | null = null

  for (const s of supportedLngs) {
    const locale = new Intl.Locale(s).maximize()

    if (locale.language !== requested.language) continue

    const isScriptMatch = locale.script === requested.script
    const isRegionMatch = locale.region === requested.region

    if (isScriptMatch && isRegionMatch) {
      return s
    }

    if (isScriptMatch && !scriptMatch) {
      scriptMatch = s
    }

    if (!languageMatch) {
      languageMatch = s
    }
  }

  return scriptMatch || languageMatch || fallbackLng.default[0]
}

export type I18nKeys = ParseKeys

type CustomTFunction = {
  (key: I18nKeys): string
  (key: I18nKeys, data: Record<string, string | number>): string
  (
    key: I18nKeys,
    data: Record<
      string,
      ((children: ReactNode) => ReactNode) | ReactElement | string
    >,
  ): React.ReactElement
}

/**
 * Support custom tag, variable and element in translation string.
 * @example
 * ```
 * const { t } = useI18n()
 *
 * return (
 *   <div>
 *    {t('hello', {
 *      string: 'world',
 *      variable: <span>world</span>,
 *      tag: (text) => <strong>{text}</strong>,
 *      element: <span className="text-red" />,
 *    })}
 *   </div>
 * )
 * ```
 */
export function useI18n() {
  return use(I18nContext)!
}

/**
 * match `<tagName>tagContent</tagName>` or `{{variable}}`
 */
const TEMPLATE_REGEX =
  /<(?<tagName>\w+)>(?<tagContent>.*?)<\/\k<tagName>>|{{(?<variable>\w+)}}/g

function parseTemplate(
  text: string,
  elementData: Map<string, ReactElement>,
  fnData: Map<string, (children: ReactNode) => ReactNode>,
  stringData: Record<string, string | number>,
): string | ReactElement {
  const result: ReactNode[] = []
  let lastIndex = 0

  // match all interpolation
  for (const match of text.matchAll(TEMPLATE_REGEX)) {
    if (match.index === undefined) continue

    const fullMatch = match[0]
    const { tagName, tagContent, variable } = match.groups ?? {}
    const textBetweenMatches = text.slice(lastIndex, match.index)
    lastIndex = match.index + fullMatch.length

    // push content between last match and current match
    if (textBetweenMatches) {
      result.push(textBetweenMatches)
    }

    if (tagName) {
      // match <tagName>tagContent</tagName>
      const render = fnData.get(tagName) ?? elementData.get(tagName)

      // recursively parse nested tag and variables
      // <b>bold and <i>italic</i></b>
      // <b>bold and {{variable}}</b>
      const parsedContent = tagContent
        ? parseTemplate(tagContent, elementData, fnData, stringData)
        : tagContent

      if (render) {
        result.push(getRendered(render, parsedContent))
      } else {
        result.push(parsedContent)
      }
    } else if (variable) {
      // match {{variable}}
      const element = elementData.get(variable)

      result.push(element ?? fullMatch)
    }
  }

  // push everything after last match
  const last = text.slice(lastIndex)
  if (result.length === 0) return last
  if (last) result.push(last)

  // combine all results
  return createElement(Fragment, null, ...result)
}

/**
 * @example
 * ```ts
 * const formatted = listFormat(['apple', 'banana', 'cherry'], 'en-US')
 * //    ^ "apple, banana, and cherry"
 * const formatted = listFormat(['苹果', '香蕉', '樱桃'], 'zh-CN')
 * //    ^ "苹果、香蕉和樱桃"
 * ```
 */
export function listFormat(
  list: readonly string[],
  language: string,
  options?: {
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
    return new Intl.ListFormat(language, {
      type: 'conjunction',
      style: 'long',
      ...options,
    }).format(list)
  } catch {
    return list.join(', ')
  }
}

/**
 * @example
 * ```ts
 * const displayName = getLanguageDisplayName('zh-Hans', 'en-US')
 * //    ^ "Chinese (Simplified)"
 * ```
 */
export function getLanguageDisplayName(
  language: string,
  toLanguage: string,
  options: Omit<Intl.DisplayNamesOptions, 'type'> = {
    fallback: 'code',
  },
) {
  try {
    return new Intl.DisplayNames([toLanguage], {
      type: 'language',
      ...options,
    }).of(language)
  } catch {
    return language
  }
}

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/**
 * get content from function or element
 */
function getRendered(
  getter: ((children: ReactNode) => ReactNode) | ReactElement,
  children: ReactNode,
) {
  if (typeof getter === 'function') {
    return getter(children)
  }

  const isVoid =
    typeof getter.type === 'string' && voidElements.has(getter.type)

  return cloneElement(getter, undefined, isVoid ? undefined : children)
}

const I18nContext = createContext<
  | (Omit<ReturnType<typeof useTranslation>, 't'> & {
      t: CustomTFunction
      changeLanguage: (lang: string) => void
      fetchingLanguage: string | null
    })
  | null
>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const translation = useTranslation(undefined, { i18n: i18next })
  const [fetchingLanguage, setFetchingLanguage] = useState<string | null>(null)

  const lastFetchKey = useRef<symbol | null>(null)
  const changeLanguage = useMemoizedFn((language: string) => {
    const resolvedLang = resolveLanguage(language)

    if (resolvedLang === i18next.language) return

    if (i18next.hasResourceBundle(resolvedLang, 'translation')) {
      i18next.changeLanguage(resolvedLang)
      return
    }

    setFetchingLanguage(resolvedLang)

    const key = (lastFetchKey.current = Symbol('fetchLang'))

    fetch(i18nResourcesMap[resolvedLang]!)
      .then((res) => res.json())
      .then((resource) => {
        i18next.addResourceBundle(resolvedLang, 'translation', resource)

        if (key !== lastFetchKey.current) return

        i18next.changeLanguage(resolvedLang)
      })
      .finally(() => {
        if (key !== lastFetchKey.current) return
        setFetchingLanguage(null)
      })
  })

  const t = useMemoizedFn(function customT(key, data) {
    // name: (children) => <span>{children}</span>
    const fnData = new Map<string, (children: ReactNode) => ReactNode>()
    // name: <span className="text-red" />
    const elementData = new Map<string, ReactElement>()
    // name: 'text'
    const stringData = Object.create(null) as Record<string, string | number>

    for (const [key, val] of Object.entries(data ?? {})) {
      if (typeof val === 'function') {
        fnData.set(key, val)
      } else if (isValidElement(val)) {
        elementData.set(key, val)
      } else {
        stringData[key] = val
      }
    }

    return parseTemplate(
      translation.t(key, stringData),
      elementData,
      fnData,
      stringData,
    )
  } as CustomTFunction)

  const ctxValue = useMemo(() => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...translation,
      changeLanguage,
      fetchingLanguage,
      t,
    }
  }, [translation, fetchingLanguage])

  return <I18nContext value={ctxValue}>{children}</I18nContext>
}
