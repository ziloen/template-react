import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Waits for the next useEffect to execute a callback.
 *
 * @example
 * ```tsx
 * const nextEffect = useNextEffect()
 *
 * async function onClick() {
 *   setEditing(true)
 *   nextEffect(() => {
 *     inputRef.current?.focus()
 *   })
 *   // or
 *   await nextEffect()
 *   inputRef.current?.focus()
 * }
 * ```
 */
export function useNextEffect() {
  const callbacks = useRef<(() => void)[]>([])

  useEffect(() => {
    if (!callbacks.current.length) return
    for (const cb of callbacks.current) {
      cb()
    }
    callbacks.current = []
  })

  return useCallback((callback?: () => void) => {
    callback && callbacks.current.push(callback)
    return new Promise<void>((resolve) => callbacks.current.push(resolve))
  }, [])
}

/**
 * @see {@link useNextEffect}
 */
export function useNextLayoutEffect() {
  const callbacks = useRef<(() => void)[]>([])

  useLayoutEffect(() => {
    if (!callbacks.current.length) return
    for (const cb of callbacks.current) {
      cb()
    }
    callbacks.current = []
  })

  return useCallback((callback?: () => void) => {
    callback && callbacks.current.push(callback)
    return new Promise<void>((resolve) => callbacks.current.push(resolve))
  }, [])
}
