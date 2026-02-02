import clsx from 'clsx/lite'
import type { ComponentType } from 'react'
import type { LoaderFunction, RouteObject } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { Temporal } from 'temporal-polyfill'

/*#__NO_SIDE_EFFECTS__*/
export function cn(
  ...classLists: (string | number | bigint | null | boolean | undefined)[]
): string {
  return twMerge(clsx(...classLists))
}

/*#__NO_SIDE_EFFECTS__*/
function HydrateFallback() {
  return null
}

export function globToRoutes(
  paths: Record<string, () => Promise<unknown>>,
  base: string,
): RouteObject[] {
  return Object.entries(paths).map(([path, resolver]) => {
    // `./path/to/route/concerts.$id.tsx` -> `concerts.$id`
    const filePath = path.slice(base.length, -4)

    const index = filePath.endsWith('_index')

    // https://reactrouter.com/how-to/file-route-conventions#file-route-conventions
    // TODO: Support layout "_layout.tsx"
    const normalizedPath = filePath
      // Index Route: `_index.tsx` -> `/`
      .replaceAll('_index', '')
      // Catch-all Route: `$.tsx` -> `*`
      .replaceAll(/\$$/g, '*')
      // Optional Segments: `($lang).$id.tsx` -> `:lang?/:id`, `item.(edit).tsx` -> `item/edit?`
      .replaceAll(/\(([^).]+)\)/g, '$1?')
      // Dynamic Segments: `item.$id.tsx` -> `item/:id`
      .replaceAll('$', ':')
      // Nested Route: `concerts.trending.tsx` -> `concerts/trending`
      .replaceAll('.', '/')

    return {
      index: index,
      path: normalizedPath,
      HydrateFallback,
      lazy: async () => {
        const route = (await resolver()) as {
          default: ComponentType
          loader?: LoaderFunction
          handle?: unknown
          HydrateFallback?: ComponentType
          ErrorBoundary?: ComponentType
        }

        return {
          loader: route.loader,
          handle: route.handle,
          Component: route.default,
          // FIXME: HydrateFallback is not working in lazy routes
          HydrateFallback: route.HydrateFallback ?? null,
          ErrorBoundary: route.ErrorBoundary ?? null,
        }
      },
    }
  })
}

/**
 * @param date ISO string or Epoch milliseconds
 *
 * @example
 * const relativeTime = formatRelativeTime('2023-01-01T00:00:00Z', 'en-US')
 * //=> 'in 2 months'
 * const relativeTime = formatRelativeTime(1672531200000, 'fr-FR')
 * //=> 'dans 2 mois'
 */
export function formatRelativeTime(
  date: string | number,
  language: string,
): string {
  const dateTime =
    typeof date === 'string'
      ? Temporal.Instant.from(date).toZonedDateTimeISO('UTC')
      : Temporal.Instant.fromEpochMilliseconds(date).toZonedDateTimeISO('UTC')

  const now = Temporal.Now.zonedDateTimeISO('UTC')
  const duration = dateTime.since(now, {
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
    if (duration[unit] !== 0) {
      return formatter.format(duration[unit], unit)
    }
  }

  return formatter.format(0, 'seconds')
}
