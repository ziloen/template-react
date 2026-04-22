import axios, { isAxiosError } from 'axios'
import { prettifyError } from 'zod'

export * as API from './api'

export const request = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 3 * 60 * 1000,
  adapter: 'fetch',
})

request.interceptors.request.use((config) => {
  if (config.requestSchema) {
    const result = config.requestSchema.safeParse(config.data)

    if (!result.success) {
      globalThis.console.error(
        `[API] Invalid request data for ${String(config.url)}:`,
        config.data,
      )
      globalThis.console.error(prettifyError(result.error))
    }
  }

  return config
})

request.interceptors.response.use(
  (value) => {
    if (value.config.responseSchema) {
      const result = value.config.responseSchema.safeParse(value.data)

      if (!result.success) {
        globalThis.console.error(
          `[API] Invalid response data for ${String(value.config.url)}:`,
          value.data,
        )
        globalThis.console.error(prettifyError(result.error))
      }
    }

    return value
  },
  (error: Error) => {
    if (isAxiosError(error)) {
      if (error.config?.isExpectedError?.(error) !== true) {
        globalThis.console.error('[API Error]', error)
      }
    }

    throw error
  },
)
