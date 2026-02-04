import type { RefCallback } from 'react'
import { isInstanceofElement } from '~/utils'
import { useLatest } from './useLatest'
import { useMemoizedFn } from './useMemoizedFn'

type Positon = {
  x: number
  y: number
}

type MovePosition = {
  /** 离起点（pointerDown时位置）的 x */
  dx: number
  /** 离起点（pointerDown时位置）的 y */
  dy: number
} & Positon

type Options<T> = {
  /**
   * 开始捕获指针的回调函数，返回 `false` 来阻止此次捕获指针
   */
  onStart?: (this: T, downEvent: PointerEvent) => void | false

  /**
   * 移动过程中的回调函数
   */
  onMove?: (this: T, moveEvent: PointerEvent, position: MovePosition) => void

  /**
   * 捕获结束后的回调函数
   */
  onEnd?: (this: T, upEvent: PointerEvent, position: MovePosition) => void
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
        /** 如果用户取消捕获 */
        if (optionsRef.current.onStart?.call(this as T, downEvent) === false)
          return

        trackPointerMove<T>(downEvent, {
          onMove: function (this, ...args) {
            optionsRef.current.onMove?.call(this, ...args)
          },
          onEnd: function (this, ...args) {
            optionsRef.current.onEnd?.call(this, ...args)
          },
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
  }: {
    onMove: Options<NoInfer<T>>['onMove']
    onEnd: Options<NoInfer<T>>['onEnd']
  },
) {
  const { clientX: x, clientY: y, currentTarget: el } = downEvent

  if (!el || !isInstanceofElement(el, HTMLElement)) return

  /** 阻止默认行为，防止 user-select 不为 none 时，拖动导致触发 pointercancel 事件，capture 失效() */
  downEvent.preventDefault()

  /** 使当前元素锁定 pointer */
  el.setPointerCapture(downEvent.pointerId)
  const controller = new AbortController()

  /** 转发 move 事件 */
  el.addEventListener(
    'pointermove',
    function (moveEvent) {
      onMove?.call(this as T, moveEvent, {
        x: moveEvent.x,
        y: moveEvent.y,
        dx: moveEvent.x - x,
        dy: moveEvent.y - y,
      })
    },
    { signal: controller.signal, passive: true },
  )

  /** pointerup 停止监听 */
  el.addEventListener(
    'pointerup',
    function (upEvent) {
      controller.abort()
      el.releasePointerCapture(upEvent.pointerId)
      onEnd?.call(this as T, upEvent, {
        x: upEvent.x,
        y: upEvent.y,
        dx: upEvent.x - x,
        dy: upEvent.y - y,
      })
    },
    { once: true },
  )
}
