import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/user/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className=''>this is home</div>
}
