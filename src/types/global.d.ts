/* eslint-disable @typescript-eslint/no-redeclare */
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

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
  /**
   * Converts the `Uint8Array` to a base64-encoded string.
   * @param options If provided, sets the alphabet and padding behavior used.
   * @returns A base64-encoded string.
   */
  toBase64(options?: {
    alphabet?: 'base64' | 'base64url' | undefined
    omitPadding?: boolean | undefined
  }): string

  /**
   * Sets the `Uint8Array` from a base64-encoded string.
   * @param string The base64-encoded string.
   * @param options If provided, specifies the alphabet and handling of the last chunk.
   * @returns An object containing the number of bytes read and written.
   * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
   * chunk is inconsistent with the `lastChunkHandling` option.
   */
  setFromBase64(
    string: string,
    options?: {
      alphabet?: 'base64' | 'base64url' | undefined
      lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial' | undefined
    },
  ): {
    read: number
    written: number
  }

  /**
   * Converts the `Uint8Array` to a base16-encoded string.
   * @returns A base16-encoded string.
   */
  toHex(): string

  /**
   * Sets the `Uint8Array` from a base16-encoded string.
   * @param string The base16-encoded string.
   * @returns An object containing the number of bytes read and written.
   */
  setFromHex(string: string): {
    read: number
    written: number
  }
}

interface Uint8ArrayConstructor {
  /**
   * Creates a new `Uint8Array` from a base64-encoded string.
   * @param string The base64-encoded string.
   * @param options If provided, specifies the alphabet and handling of the last chunk.
   * @returns A new `Uint8Array` instance.
   * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
   * chunk is inconsistent with the `lastChunkHandling` option.
   */
  fromBase64(
    string: string,
    options?: {
      alphabet?: 'base64' | 'base64url' | undefined
      lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial' | undefined
    },
  ): Uint8Array<ArrayBuffer>

  /**
   * Creates a new `Uint8Array` from a base16-encoded string.
   * @returns A new `Uint8Array` instance.
   */
  fromHex(string: string): Uint8Array<ArrayBuffer>
}

interface ReadableStream<R = any> {
  /**
   * https://caniuse.com/mdn-api_readablestream_--asynciterator
   */
  [Symbol.asyncIterator]?(): AsyncIterableIterator<R>
}
