/**
 * @deprecated
 * use `import.meta.env.PROD` instead
 *
 * [Built-in constants](https://vite.dev/guide/env-and-mode.html#built-in-constants)
 */
declare const IS_PROD: boolean

/**
 * @deprecated
 * use `import.meta.env.DEV` instead
 *
 * [Built-in constants](https://vite.dev/guide/env-and-mode.html#built-in-constants)
 */
declare const IS_DEV: boolean

// use const to declare direct global constants
declare const IS_BUILD: boolean

/**
 * The build time of the application in ISO 8601 format.
 */
declare const APP_BUILD_TIME: string
declare const APP_BUILD_COMMIT: string

// use var to declare direct / globalThis / window variables
declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: boolean | undefined

interface LanguageDetector {
  readonly expectedInputLanguages: string[] | null

  readonly inputQuota: number

  destroy(): void

  detect(
    input: string,
    options?: { signal?: AbortSignal },
  ): Promise<
    {
      /**
       * A BCP 47 language tag representing the detected language.
       */
      detectedLanguage: string
      /**
       * A number between 0 and 1 representing the AI model's confidence that the detected language is correct.
       */
      confidence: number
    }[]
  >
}

declare var LanguageDetector: {
  create(options: {
    /**
     * An array of strings specifying the expected languages of the input text, which helps improve the accuracy of the language detection. These should be valid BCP 47 language tags. Defaults to ["en"].
     */
    expectedInputLanguages: string[]
    /**
     * An AbortSignal object instance, which allows the create() operation to be aborted via the associated AbortController.
     */
    signal?: AbortSignal
  }): Promise<LanguageDetector>

  availability(options: {
    expectedInputLanguages: string[]
  }): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>
}

interface ReadableStream<R = any> {
  /**
   * https://caniuse.com/mdn-api_readablestream_--asynciterator
   */
  [Symbol.asyncIterator]?(): AsyncIterableIterator<R>
}
