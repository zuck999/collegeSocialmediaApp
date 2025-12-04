import Login from "@/pages/unauth/login"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauth/login")({
	component: RouteComponent,
});

function RouteComponent() {
  return <Login/>
}

export default RouteComponent
