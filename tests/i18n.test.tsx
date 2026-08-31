import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { I18nProvider, useI18n } from '~/i18n'

function I18nProbe() {
  const { t } = useI18n()

  return (
    <>
      <div data-testid="nested-tags">
        {t('_examples.nestedTags', {
          b: (children: ReactNode) => <strong>{children}</strong>,
        })}
      </div>
      <div data-testid="void-tag-container">
        {t('_examples.notranslate', {
          notranslate: <br data-testid="void-tag" />,
        })}
      </div>
    </>
  )
}

describe('I18nProvider', () => {
  it('renders nested templates and omits children for void elements', async () => {
    const { container } = await render(
      <I18nProvider>
        <I18nProbe />
      </I18nProvider>,
    )

    const nestedTags = container.querySelector('[data-testid="nested-tags"]')
    expect(nestedTags?.innerHTML).toBe('try <strong>bold and italic</strong>')

    const voidTagContainer = container.querySelector(
      '[data-testid="void-tag-container"]',
    )
    expect(voidTagContainer?.textContent).toBe('try ')
    expect(container.querySelector('[data-testid="void-tag"]')).not.toBeNull()
  })
})
