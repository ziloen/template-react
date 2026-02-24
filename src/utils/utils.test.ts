import { expect, test } from 'vitest'
import { globToRoutes } from './utils'

test('globToRoutes converts glob patterns to route paths correctly', () => {
  const exports = { default: () => null }
  const resolver = () => Promise.resolve(exports)

  const paths = {
    './pages/_index.tsx': resolver,
    './pages/_layout.tsx': resolver,
    './pages/_layout.page1.tsx': resolver,
  }

  const routes = globToRoutes(paths, './pages/')

  expect(routes)
})
