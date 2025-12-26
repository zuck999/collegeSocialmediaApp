import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/layout'
import { UserRoleUnion } from '@/utils/general'

export const Route = createFileRoute('/_auth/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout userRole={UserRoleUnion.ADMIN}/>
}
