import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauth/register"!</div>
}
