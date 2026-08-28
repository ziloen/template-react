export { useColorScheme } from './useColorScheme'
export { useGetState } from './useGetState'
export { useLatest } from './useLatest'
export { useMemoizedFn } from './useMemoizedFn'
export { useNextEffect, useNextLayoutEffect } from './useNextEffect'
export { trackPointerMove, usePointerCaptureRef } from './usePointerCaptureRef'
export { useRelativeTime } from './useRelativeTime'

/**
 * @example
 * ```tsx
 * const ref1 = useRef(null)
 * const ref2 = useRef(null)
 * const ref3 = useRef(null)
 *
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 */
export function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  // FIXME: runs on every render
  return function (instance) {
    const cleanups: (() => void)[] = []

    for (const ref of refs) {
      if (typeof ref === 'function') {
        const cleanup = ref(instance)
        cleanups.push(typeof cleanup === 'function' ? cleanup : () => ref(null))
      } else if (ref) {
        ref.current = instance
        cleanups.push(() => (ref.current = null))
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }
}
