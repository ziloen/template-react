import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router'
import type { RouterContext } from '~/router'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent: NotFoundPage,
})

function Root() {
  return <Outlet />
}

function NotFoundPage() {
  return (
    <div className="grid place-items-center">
      <span>Page not found.</span>
      <Link to="/">Go to Home</Link>
    </div>
  )
}
