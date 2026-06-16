// https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-utilities/src/utils/isHTMLElement.ts
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms

import type { Equal, Expect } from '~/types'

/**
 * Verifies if a given node is an HTMLElement,
 * this method works seamlessly with frames and elements from different documents
 *
 * This is preferred over simply using `instanceof`.
 * Since `instanceof` might be problematic while operating with [multiple realms](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms)
 *
 * @example
 * ```ts
 * isInstanceofElement(event.target, HTMLElement) && event.target.focus()
 * isInstanceofElement(event.target, HTMLInputElement) && event.target.value
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isInstanceofElement<T extends typeof Element | typeof Node>(
  target: EventTarget | Node | null | undefined,
  instance: T,
): target is InstanceType<T> {
  if (target === null || target === undefined) {
    return false
  }

  if (target instanceof instance) {
    return true
  }

  if (!('ownerDocument' in target)) {
    return false
  }

  return (
    !!target.ownerDocument?.defaultView &&
    target instanceof
      target.ownerDocument.defaultView[instance.name as keyof typeof globalThis]
  )
}

function _type_test_(): void {
  const target = new EventTarget() as EventTarget | null

  if (isInstanceofElement(target, HTMLElement)) {
    type _ = Expect<Equal<typeof target, HTMLElement>>
  } else {
    type _ = Expect<Equal<typeof target, EventTarget | null>>
  }

  if (isInstanceofElement(target, Element)) {
    type _ = Expect<Equal<typeof target, Element>>
  } else {
    type _ = Expect<Equal<typeof target, EventTarget | null>>
  }

  if (isInstanceofElement(target, Node)) {
    type _ = Expect<Equal<typeof target, Node>>
  } else {
    type _ = Expect<Equal<typeof target, EventTarget | null>>
  }

  // @ts-expect-error parameters incompatible
  isInstanceofElement(target, EventTarget)
  // @ts-expect-error parameters incompatible
  isInstanceofElement(target, 123)
  // @ts-expect-error parameters incompatible
  isInstanceofElement(123, HTMLElement)
}
