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
  const callbacksRef = useRef<(() => void)[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false

      // Prevent stale callbacks after unmount
      callbacksRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!callbacksRef.current.length) return

    // Drain current batch so re-entrant calls go to next effect
    const callbacks = callbacksRef.current
    callbacksRef.current = []

    for (const cb of callbacks) {
      cb()
    }
  })

  return useCallback((callback?: () => void) => {
    if (callback) {
      callbacksRef.current.push(callback)
    }

    return new Promise<void>((resolve) => {
      callbacksRef.current.push(() => {
        if (mountedRef.current) {
          resolve()
        }
      })
    })
  }, [])
}

/**
 * useLayoutEffect version of {@link useNextEffect}.
 * 
 * @see {@link useNextEffect}
 */
export function useNextLayoutEffect() {
  const callbacksRef = useRef<(() => void)[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false

      // Prevent stale callbacks after unmount
      callbacksRef.current = []
    }
  }, [])

  useLayoutEffect(() => {
    if (!callbacksRef.current.length) return

    // Drain current batch so re-entrant calls go to next effect
    const callbacks = callbacksRef.current
    callbacksRef.current = []

    for (const cb of callbacks) {
      cb()
    }
  })

  return useCallback((callback?: () => void) => {
    if (callback) {
      callbacksRef.current.push(callback)
    }

    return new Promise<void>((resolve) => {
      callbacksRef.current.push(() => {
        if (mountedRef.current) {
          resolve()
        }
      })
    })
  }, [])
}
