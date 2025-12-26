import Layout from '@/layout'
import { UserRoleUnion } from '@/utils/general'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/user')({
  component: RouteComponent,
})

function RouteComponent() {
 return <Layout userRole={UserRoleUnion.USER}/>
}
