import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SigninPage,
})

function SigninPage() {
  return (
    <div>
      <h1>Signin</h1>
      <button>Signin with Google</button>
      <br />
      or Signin with Email
      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Signin with Email</button>
      </form>
    </div>
  )
}
