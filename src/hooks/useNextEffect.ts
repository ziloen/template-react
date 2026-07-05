import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Waits for the next useEffect to execute a callback.
 *
 * @example
 * ```tsx
 * const nextEffect = useNextEffect()
 *
 * async function onClick() {
 *   setIsEditing(true)
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

  useEffect(() => {
    if (!callbacksRef.current.length) return

    // Drain current batch so re-entrant calls go to next effect
    const callbacks = callbacksRef.current
    callbacksRef.current = []

    for (const cb of callbacks) {
      cb()
    }
  })

  return useRef((callback?: () => void) => {
    if (callback) {
      callbacksRef.current.push(callback)
    }

    return new Promise<void>((resolve) => {
      callbacksRef.current.push(resolve)
    })
  }).current
}

/**
 * useLayoutEffect version of {@link useNextEffect}.
 *
 * @see {@link useNextEffect}
 */
export function useNextLayoutEffect() {
  const callbacksRef = useRef<(() => void)[]>([])

  useLayoutEffect(() => {
    if (!callbacksRef.current.length) return

    // Drain current batch so re-entrant calls go to next effect
    const callbacks = callbacksRef.current
    callbacksRef.current = []

    for (const cb of callbacks) {
      cb()
    }
  })

  return useRef((callback?: () => void) => {
    if (callback) {
      callbacksRef.current.push(callback)
    }

    return new Promise<void>((resolve) => {
      callbacksRef.current.push(resolve)
    })
  }).current
}
