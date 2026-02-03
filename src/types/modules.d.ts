declare module 'react' {
  // allow style to use css custom properties
  interface CSSProperties {
    [CSSCutomProperties: `--${string}`]: string | number | undefined
  }

  // allow destructor return value
  function useEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
  function useInsertionEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
  function useLayoutEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
}

declare module 'axios' {
  // Add zod type to axios request config
  interface AxiosRequestConfig {
    requestSchema?: import('zod').ZodType
    responseSchema?: import('zod').ZodType
    /**
     * Return true to skip error logging for this error
     */
    isExpectedError?: (error: AxiosError) => boolean
  }
}

declare module 'react-router' {
  import type { Location } from 'react-router'
  // https://github.com/remix-run/react-router/issues/9358
  declare function useLocation<S = unknown>(): Location<S | undefined>
}

// https://www.i18next.com/overview/typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof import('../locales/_en-tpl.json')
    }
  }
}

declare global {
  // strict type checking for clsx/lite, disallow object and array
  const clsx: (
    ...inputs: (string | number | bigint | null | boolean | undefined)[]
  ) => string
}

export {}
