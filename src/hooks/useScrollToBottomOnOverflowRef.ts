import type { RefCallback } from 'react'
import { useCallback, useRef } from 'react'

/**
 * 当内容出现溢出时（之前未溢出，现在溢出），自动滚动到底部
 *
 * 用于配合 `overflow-anchor: auto` 使用
 */
export function useScrollToBottomOnOverflowRef(options?: {
  /**
   * 如果一开始就溢出，是否也滚动到底部
   *
   * @default true
   */
  initial?: boolean
}): RefCallback<Element> {
  const optionsRef = useRef(options)
  optionsRef.current = options

  return useCallback<RefCallback<Element>>((el) => {
    if (!el) return

    let isOverflow: boolean | null = null

    const resizeObserver = new ResizeObserver(() => {
      // FIXME: 不一定准确，例如容器 200px 高，内容 200.56px 高，scrollHeight 为 201，但并没有出现滚动条
      const currentIsOverflow = el.scrollHeight > el.clientHeight

      if (
        currentIsOverflow &&
        (isOverflow === null
          ? (optionsRef.current?.initial ?? true)
          : !isOverflow)
      ) {
        el.scrollTo({
          top: el.scrollHeight + 1, // scrollHeight 为整数，并不准确
          behavior: 'instant',
        })
      }

      isOverflow = currentIsOverflow
    })

    // FIXME: 如果元素设置了 scrollbar-gutter: stable，出现滚动条（已预留位置）并不会触发 ResizeObserver
    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])
}
