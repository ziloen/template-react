// https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts
import { useRef } from 'react'

/**
 * Replace useCallback(fn, []). It always returns the same function reference, and the internal logic always calls the latest fn.
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * const memoizedFn = useMemoizedFn(() => {
 *  console.log(count);
 * });
 *
 * // Even if count changes, memoizedFn reference remains the same
 * useEffect(() => {
 *  memoizedFn(); // Always logs the latest count value
 * }, []);
 * // ^ No need to add memoizedFn to dependencies
 */
export function useMemoizedFn<T extends (this: any, ...args: any[]) => any>(
  fn: T,
): T {
  const fnRef = useRef<T>(fn)
  const memoizedFn = useRef<T | undefined>(undefined)

  fnRef.current = fn

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fnRef.current.apply(this, args)
    } as T
  }

  return memoizedFn.current
}
