
import { createFileRoute } from "@tanstack/react-router"
import Login from "@/pages/unauth";
export const Route = createFileRoute("/_unauth/login")({
	component: RouteComponent,
});

function RouteComponent() {
  return <Login/>
}

export default RouteComponent
