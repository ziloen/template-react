export type Expect<T extends true> = T
export type { IsEqual as Equal } from 'type-fest'
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true
