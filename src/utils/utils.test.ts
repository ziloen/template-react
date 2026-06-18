import { expect, test } from 'vitest'
import { globToRoutes } from './utils'

test('globToRoutes converts glob patterns to route paths correctly', () => {
  const exports = { default: () => null }
  const resolver = () => Promise.resolve(exports)

  const paths = {
    './_index.tsx': resolver,
    './_layout.tsx': resolver,
    './_layout.page1.tsx': resolver,
  }

  const routes = globToRoutes(paths)

  expect(routes)
})
