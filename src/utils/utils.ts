import clsx from 'clsx/lite'
import type { ComponentType } from 'react'
import type { LoaderFunction, RouteObject } from 'react-router'
import { twMerge } from 'tailwind-merge'

export { isInstanceofElement } from './isInstanceofElement'

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
          loader: route.loader ?? false,
          handle: route.handle,
          Component: route.default,
          // FIXME: HydrateFallback is not working in lazy routes
          HydrateFallback: route.HydrateFallback ?? null,
          ErrorBoundary: route.ErrorBoundary ?? null,
        }
      },
    } satisfies RouteObject
  })
}

export function safe<T, E>(
  fn: () => T,
): [error: null, result: T] | [error: E, result: null] {
  try {
    return [null, fn()]
  } catch (error) {
    return [error as E, null]
  }
}

/*#__NO_SIDE_EFFECTS__*/
export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = await blob.bytes()
  return bytes.toBase64()
}

/*#__NO_SIDE_EFFECTS__*/
export async function blobToDataURL(blob: Blob): Promise<string> {
  const base64 = await blobToBase64(blob)
  const mimeType = blob.type || 'application/octet-stream'
  return `data:${mimeType};base64,${base64}`
}
