// https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts
import { useRef } from 'react'
import type { Equal, Expect } from '~/types'

/**
 * Replace `useCallback`. It always returns the same function reference, and the internal logic always calls the latest fn.
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * const memoizedFn = useMemoizedFn(() => {
 *   console.log(count);
 *   //          ^ Always logs the latest count value
 * });
 *
 * useEffect(() => {
 *   memoizedFn();
 * }, []);
 * // ^ Never add memoizedFn to dependencies as it never changes
 */
export function useMemoizedFn<T extends (this: any, ...args: any[]) => unknown>(
  fn: T,
): T {
  const fnRef = useRef(fn)
  const memoizedFn = useRef<T | undefined>(undefined)

  fnRef.current = fn

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args)
    } as T
  }

  return memoizedFn.current
}

function _type_test_() {
  {
    const voidFn = useMemoizedFn(() => {})
    type _ = Expect<Equal<typeof voidFn, () => void>>
  }

  {
    const fn = useMemoizedFn((a: number) => a)
    type _ = Expect<Equal<typeof fn, (a: number) => number>>
  }

  {
    const fnThis = useMemoizedFn(function (this: Event, a: number) {
      return ''
    })
    type _ = Expect<Equal<typeof fnThis, (a: number) => string>>
    // Equal doesn't support `this`
    type __ = Expect<Equal<ThisParameterType<typeof fnThis>, Event>>
  }
}
