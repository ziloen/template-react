import { create } from 'zustand'
import { combine } from 'zustand/middleware'

// Example of a store with a simple counter
const useCounterStore = create(
  combine(
    {
      count: 0,
    },
    (set, get) => ({
      increment(value: number = 1) {
        set({ count: get().count + value })
      },
      decrement(value: number = 1) {
        set({ count: get().count - value })
      },
    }),
  ),
)
