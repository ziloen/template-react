import type { RefCallback } from 'react'
import { useLatest } from './useLatest'
import { useMemoizedFn } from './useMemoizedFn'

type Position = {
  x: number
  y: number
}

type MovePosition = {
  /** 离 pointerdown 时的 x 距离 */
  dx: number
  /** 离 pointerdown 时的 y 距离 */
  dy: number
} & Position

type Options<T> = {
  /**
   * 返回 `false` 来取消此次捕获指针
   */
  onStart?: (this: T, downEvent: PointerEvent) => void | false

  onMove?: (this: T, moveEvent: PointerEvent, position: MovePosition) => void

  onEnd?: (this: T, upEvent: PointerEvent, position: MovePosition) => void

  /**
   * - `pointerdown`：在 pointerdown 时就捕获指针，适合较小元素的拖动
   * - `pointermove`：在 pointermove 时捕获指针，适合需要触发子元素点击事件的元素拖动
   *
   * @default 'pointerdown'
   */
  captureOn?: 'pointerdown' | 'pointermove'
}

export function usePointerCaptureRef<T extends HTMLElement>(
  options: Options<T>,
): RefCallback<T> {
  const optionsRef = useLatest(options)

  return useMemoizedFn((el: T | null) => {
    if (!el) return

    const ac = new AbortController()

    el.addEventListener(
      'pointerdown',
      function (downEvent) {
        /** 取消捕获 pointer */
        if (optionsRef.current.onStart?.call(this as T, downEvent) === false) {
          return
        }

        trackPointerMove<T>(downEvent, {
          onMove(this, ...args) {
            optionsRef.current.onMove?.call(this, ...args)
          },
          onEnd(this, ...args) {
            optionsRef.current.onEnd?.call(this, ...args)
          },
          captureOn: optionsRef.current.captureOn,
        })
      },
      { signal: ac.signal },
    )

    return () => {
      ac.abort()
    }
  })
}

export function trackPointerMove<T extends HTMLElement>(
  downEvent: PointerEvent | React.PointerEvent<T>,
  {
    onMove,
    onEnd,
    signal,
    captureOn = 'pointerdown',
  }: {
    onMove?: Options<NoInfer<T>>['onMove']
    onEnd?: Options<NoInfer<T>>['onEnd']
    captureOn?: Options<NoInfer<T>>['captureOn']
    signal?: AbortSignal
  },
): void {
  const x = downEvent.clientX
  const y = downEvent.clientY
  const el = downEvent.currentTarget as T | null

  if (!el) return

  /** 防止 user-select 不为 none 时，拖动触发 pointercancel 事件，capture 失效() */
  downEvent.preventDefault()

  let pointerId: number | null = null
  if (captureOn === 'pointerdown') {
    el.setPointerCapture((pointerId = downEvent.pointerId))
  }

  const ac = new AbortController()
  signal = signal ? AbortSignal.any([ac.signal, signal]) : ac.signal

  el.addEventListener(
    'pointermove',
    function (moveEvent) {
      if (pointerId === null && captureOn === 'pointermove') {
        el.setPointerCapture((pointerId = moveEvent.pointerId))
      }

      onMove?.call(this as T, moveEvent, {
        x: moveEvent.x,
        y: moveEvent.y,
        dx: moveEvent.x - x,
        dy: moveEvent.y - y,
      })
    },
    { signal, passive: true },
  )

  const release = function (this: EventTarget, event: PointerEvent) {
    ac.abort()

    if (pointerId !== null && el.hasPointerCapture(pointerId)) {
      el.releasePointerCapture(pointerId)
    }

    onEnd?.call(this as T, event, {
      x: event.x,
      y: event.y,
      dx: event.x - x,
      dy: event.y - y,
    })
  }

  el.addEventListener('pointerup', release, { once: true, signal })
  el.addEventListener('pointercancel', release, { once: true, signal })
}
