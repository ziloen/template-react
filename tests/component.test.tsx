import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Counter } from '~/components/Counter'

describe('Counter', () => {
  it('should render', async () => {
    const { getByText } = await render(<Counter initial={10} />)
    expect(getByText('10')).toBeDefined()
  })
  it('should be interactive', async () => {
    const { getByText } = await render(<Counter initial={0} />)
    expect(getByText('0')).toBeDefined()
    await getByText('+').click()
    expect(getByText('1')).toBeDefined()
  })
})
