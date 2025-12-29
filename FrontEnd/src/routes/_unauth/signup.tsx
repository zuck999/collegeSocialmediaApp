import Signup from '@/pages/unauth/signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Signup/>
}
