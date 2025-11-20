import { createFileRoute } from '@tanstack/react-router';
import User from "@/pages/auth/users";

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <User/>
}
